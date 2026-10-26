// Quiz Controller: показ питань, відповіді кнопками та свайпом картки в чотири боки
const card = $('card');
const tint = $('tint');
const ansBtns = [...document.querySelectorAll('.ans')].sort((a, b) => a.dataset.i - b.dataset.i);

function startQuiz() {
    state.swipes = [];
    state.idx = 0;
    state.lock = false;
    $('dots').innerHTML = cards.map(() => '<i></i>').join('');
    showScreen('quiz');
    renderQuestion(false);
}

function renderQuestion(animate) {
    $('qText').textContent = cards[state.idx].text;
    $('qNum').textContent = String(state.idx + 1).padStart(2, '0') + ' / ' + cards.length;
    [...$('dots').children].forEach((d, i) => {
        d.className = i === state.idx ? 'now' : '';
        d.style.background = i < state.swipes.length ? ANS.find(a => a.v === state.swipes[i]).col : '';
    });
    sceneT0 = performance.now();
    requestAnimationFrame(sizeScene);
    if (animate) card.animate([{ transform: 'scale(.9)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 240, easing: 'ease-out' });
}

function hot(i) {
    ansBtns.forEach((b, k) => b.classList.toggle('hot', k === i));
}

function setTint(i, alpha) {
    if (i < 0) { tint.style.opacity = 0; return; }
    tint.style.background = ANS[i].col;
    tint.style.opacity = alpha;
}

// i — індекс у масиві ANS (0 точно ні · 1 скоріше ні · 2 скоріше так · 3 точно так)
function answer(i) {
    if (state.lock || cur !== 'quiz') return;
    state.lock = true;
    const A = ANS[i];
    state.swipes.push(A.v);
    hot(i);
    setTint(i, .35);
    card.classList.remove('snap');
    const from = card.style.transform || 'none';
    const anim = card.animate([
        { transform: from, opacity: 1 },
        { transform: `translate(${A.vec[0] * 120}vw,${A.vec[1] * 120}vh) rotate(${A.vec[0] * 18}deg)`, opacity: 0 }
    ], { duration: 300, easing: 'ease-in', fill: 'forwards' });
    anim.onfinish = () => {
        anim.cancel();
        card.style.transform = '';
        hot(-1);
        setTint(-1);
        if (state.swipes.length >= cards.length) { showResults(); return; }
        state.idx++;
        renderQuestion(true);
        state.lock = false;
    };
}

ansBtns.forEach(b => b.addEventListener('click', () => {
    b.blur();
    document.body.classList.remove('kb');
    answer(+b.dataset.i);
}));

/* ---------- свайп або перетягування картки ---------- */
let drag = null;

function dirOf(dx, dy) {
    return Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? DIR_IDX.left : DIR_IDX.right) : (dy < 0 ? DIR_IDX.up : DIR_IDX.down);
}

card.addEventListener('pointerdown', e => {
    if (state.lock) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, dy: 0 };
    card.setPointerCapture(e.pointerId);
    card.classList.add('dragging');
    card.classList.remove('snap');
});

card.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    drag.dx = e.clientX - drag.x;
    drag.dy = e.clientY - drag.y;
    const d = Math.max(Math.abs(drag.dx), Math.abs(drag.dy)), i = dirOf(drag.dx, drag.dy);
    card.style.transform = `translate(${drag.dx}px,${drag.dy}px) rotate(${drag.dx / 22}deg)`;
    if (d > 24) { hot(i); setTint(i, Math.min(.4, d / 320)); }
    else { hot(-1); setTint(-1); }
});

function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const r = card.getBoundingClientRect();
    const threshold = Math.max(55, Math.min(120, Math.min(r.width, r.height) * .2));
    const d = Math.max(Math.abs(drag.dx), Math.abs(drag.dy)), i = dirOf(drag.dx, drag.dy);
    card.classList.remove('dragging');
    drag = null;
    if (d >= threshold) answer(i);
    else { card.classList.add('snap'); card.style.transform = ''; hot(-1); setTint(-1); }
}

card.addEventListener('pointerup', endDrag);
card.addEventListener('pointercancel', endDrag);
