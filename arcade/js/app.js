// Main Application: запуск, головний цикл, автоповернення на старт
const IDLE_RESET_MS = 120000;   // без дій 2 хвилини — повернення на вступний екран (режим кіоску)

function drawMascot() {
    const x = $('botCv').getContext('2d');
    x.imageSmoothingEnabled = false;
    x.drawImage(SPR.robot, 0, 0);
}

function frame(now) {
    pollPad(now);
    if (cur === 'quiz') drawScene(now, state.idx);
    if (toastT && now > toastT) { $('toast').classList.remove('on'); toastT = 0; }
    if (cur && cur !== 'intro' && now - lastInput > IDLE_RESET_MS) {
        resetAll();
        lastInput = now;
    }
    requestAnimationFrame(frame);
}

['pointerdown', 'keydown', 'touchstart'].forEach(ev =>
    addEventListener(ev, () => { lastInput = performance.now(); }, { passive: true }));

document.addEventListener('DOMContentLoaded', () => {
    drawMascot();
    showScreen('intro');
    requestAnimationFrame(frame);
    console.log('Polytech Quiz initialized');
});
