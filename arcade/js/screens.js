// Screens & Navigation: перемикання екранів, фокус для клавіатури й геймпада, дії кнопок
const $ = id => document.getElementById(id);

let cur = null;          // id поточного екрана: intro | quiz | results
let navItems = [];       // фокусовані елементи поточного екрана
let navIdx = 0;
let lastInput = performance.now();

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('on'));
    cur = null;
}

function showScreen(id) {
    hideAllScreens();
    if (!id) return;
    const el = $('scr-' + id);
    if (!el) return;
    el.classList.add('on');
    cur = id;
    el.scrollTop = 0;
    navItems = [...el.querySelectorAll('.nav')];
    setFocus(0);
}

function setFocus(i) {
    document.querySelectorAll('.nav.focus').forEach(n => n.classList.remove('focus'));
    navIdx = i;
    const n = navItems[i];
    if (!n) return;
    n.classList.add('focus');
    if (document.body.classList.contains('kb')) n.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

// просторова навігація: найближчий елемент у напрямку натиснутої стрілки
function moveNav(dir) {
    if (!navItems.length) return;
    const r = navItems[navIdx].getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const v = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[dir];
    let best = -1, bs = Infinity;
    navItems.forEach((el, i) => {
        if (i === navIdx) return;
        const q = el.getBoundingClientRect();
        const dx = q.left + q.width / 2 - cx, dy = q.top + q.height / 2 - cy;
        const along = dx * v[0] + dy * v[1];
        if (along <= 2) return;
        const perp = Math.abs(dx * v[1] - dy * v[0]);
        const s = along + perp * 2.2 + (perp > along ? 1e5 : 0);
        if (s < bs) { bs = s; best = i; }
    });
    if (best >= 0) setFocus(best);
}

// data-act="тип:значення" → дія
function parseAct(act) {
    const k = act.indexOf(':');
    return k < 0 ? { type: act, value: '' } : { type: act.slice(0, k), value: act.slice(k + 1) };
}

function doAction(el) {
    const { type, value } = parseAct(el.dataset.act || '');
    switch (type) {
        case 'g': selectGender(value, el); break;
        case 'a': selectAge(value, el); break;
        case 'start': if (state.gender && state.age) startQuiz(); break;
        case 'retry': resetAll(); break;
    }
}

// активація з клавіатури чи геймпада
function activateFocused() {
    const n = navItems[navIdx];
    if (!n) return;
    if (n.tagName === 'A') openLink(n);
    else doAction(n);
}

// клік або тап: посилання відкриваються браузером самостійно
document.addEventListener('click', e => {
    const n = e.target.closest('.nav');
    if (!n || !cur || !$('scr-' + cur).contains(n)) return;
    setFocus(navItems.indexOf(n));
    n.blur();
    if (n.tagName === 'A') return;
    doAction(n);
});

let toastT = 0;
function toast(msg, ms = 2600) {
    const t = $('toast');
    t.innerHTML = msg;
    t.classList.add('on');
    toastT = performance.now() + ms;
}
