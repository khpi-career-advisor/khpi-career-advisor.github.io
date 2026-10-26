// Input: клавіатура (WASD, стрілки, Space/Enter) і геймпад
const KEYS = {
    KeyW: 'up', ArrowUp: 'up',
    KeyS: 'down', ArrowDown: 'down',
    KeyA: 'left', ArrowLeft: 'left',
    KeyD: 'right', ArrowRight: 'right',
    Space: 'ok', Enter: 'ok', NumpadEnter: 'ok'
};

function onAction(a) {
    lastInput = performance.now();
    document.body.classList.add('kb');
    if (cur === 'quiz') {
        if (a in DIR_IDX) answer(DIR_IDX[a]);
        return;
    }
    if (a in DIR_IDX) moveNav(a);
    else if (a === 'ok') activateFocused();
}

addEventListener('keydown', e => {
    const a = KEYS[e.code];
    if (!a) return;
    e.preventDefault();
    if (e.repeat && cur === 'quiz') return;
    onAction(a);
});

// дотик чи миша ховають рамку фокусу
addEventListener('pointerdown', () => {
    lastInput = performance.now();
    document.body.classList.remove('kb');
}, true);

/* ---------- геймпад ----------
   У тесті кнопки обличчя розташовані як відповіді: X ліворуч, Y вгорі, B праворуч, A внизу.
   У меню: D-pad або стік — вибір, A чи Start — підтвердження. */
const pad = { prev: {}, rep: {} };
const PAD_DIRS = ['left', 'up', 'right', 'down'];
const PAD_QUIZ = { left: 'left', up: 'up', right: 'right', down: 'down', fl: 'left', fu: 'up', fr: 'right', fd: 'down' };

function pollPad(now) {
    const list = navigator.getGamepads ? navigator.getGamepads() : [];
    let p = null;
    for (const g of list) if (g && g.connected) { p = g; break; }
    if (!p) { pad.prev = {}; return; }

    const b = i => !!(p.buttons[i] && (p.buttons[i].pressed || p.buttons[i].value > .5));
    const ax = p.axes[0] || 0, ay = p.axes[1] || 0;
    const st = {
        left: b(14) || ax < -.6, up: b(12) || ay < -.6, right: b(15) || ax > .6, down: b(13) || ay > .6,
        fl: b(2), fu: b(3), fr: b(1), fd: b(0), start: b(9)
    };

    for (const k in st) {
        const edge = st[k] && !pad.prev[k];
        const repeat = st[k] && cur !== 'quiz' && PAD_DIRS.includes(k) && now > (pad.rep[k] || 0);
        if (edge || repeat) {
            pad.rep[k] = now + (edge ? 380 : 120);
            if (cur === 'quiz') {
                if (edge && PAD_QUIZ[k]) onAction(PAD_QUIZ[k]);
            } else if (PAD_DIRS.includes(k)) {
                onAction(k);
            } else if (edge && (k === 'fd' || k === 'start')) {
                onAction('ok');
            }
        }
        pad.prev[k] = st[k];
    }
}
