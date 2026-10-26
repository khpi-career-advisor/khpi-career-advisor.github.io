// Arcade Scenes: анімована піксельна сцена до кожного питання (індекс = індекс у cards)
let sceneT0 = performance.now();
let SW = 96, SH = 72;   // логічний розмір полотна сцени

// полотно масштабується так, щоб коротша сторона мала близько 70 логічних пікселів
function sizeScene() {
    const r = sceneCv.parentElement.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const s = Math.max(1, Math.min(r.width, r.height) / 70);
    SW = Math.max(48, Math.round(r.width / s));
    SH = Math.max(48, Math.round(r.height / s));
    if (sceneCv.width !== SW || sceneCv.height !== SH) { sceneCv.width = SW; sceneCv.height = SH; }
}
addEventListener('resize', () => requestAnimationFrame(sizeScene));
if (window.ResizeObserver) new ResizeObserver(() => sizeScene()).observe(sceneCv.parentElement);

// спільне тло: зорі та неонова підлога
function bgScene(w, h, t, idx, acc) {
    const g = X.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#07031a');
    g.addColorStop(1, '#1c0838');
    X.fillStyle = g;
    X.fillRect(0, 0, w, h);
    for (let k = 0; k < 30; k++) {
        const sx = hash(idx * 50 + k) * w, sy = hash(idx * 90 + k * 3) * h * .75;
        X.globalAlpha = .3 + .7 * Math.abs(Math.sin(t * 1.5 + k));
        R(sx, sy, 1, 1, '#fff');
    }
    const hy = Math.round(h * .8);
    X.globalAlpha = .45;
    for (let k = -10; k <= 10; k++) LINE(w / 2 + k * 6, hy, w / 2 + k * 26, h, acc);
    for (let j = 0; j < 4; j++) { const u = ((j + t * .7) % 4) / 4; R(0, hy + u * u * (h - hy), w, 1, acc); }
    X.globalAlpha = 1;
    R(0, hy, w, 1, acc);
}

// колір підлоги для кожної сцени
const ACC = ['#a855f7', '#ff9a1f', '#ff3df0', '#22e6ff', '#2bff88', '#ff9a1f', '#22e6ff', '#ff3df0', '#ffd23f', '#22e6ff',
    '#2bff88', '#a855f7', '#ff9a1f', '#ffd23f', '#a855f7', '#22e6ff', '#ffd23f', '#ff9a1f', '#a855f7', '#2bff88'];

// кожна сцена малюється навколо центру (cx, cy) у полі приблизно 64×56 логічних пікселів
const SCENES = [
    /* 1 тексти й мови: книга з літерами різних абеток */
    (cx, cy, t) => {
        R(cx - 27, cy + 15, 54, 3, '#3a2a6a');
        R(cx - 26, cy - 1, 25, 16, '#f2f4ff'); R(cx + 1, cy - 1, 25, 16, '#dfe3ff'); R(cx - 1, cy - 2, 2, 18, '#8d96c4');
        for (let k = 0; k < 4; k++) { R(cx - 23, cy + 2 + k * 3, 18, 1, '#8d96c4'); R(cx + 4, cy + 2 + k * 3, 18 - (k === 3 ? 8 : 0), 1, '#8d96c4'); }
        ['А', 'Ї', 'B', 'Ж', 'Q', 'Є'].forEach((s, k) => {
            const p = (t * .32 + k / 6) % 1;
            X.globalAlpha = 1 - p;
            TXT(s, cx - 20 + k * 8 + Math.sin(t * 2 + k) * 2, cy - 3 - p * 24, NEON[k % 4], 7);
        });
        X.globalAlpha = 1;
    },
    /* 2 механізми: зубчасті колеса */
    (cx, cy, t) => {
        gear(cx - 10, cy + 3, 11, 10, t * 1.1, '#ff9a1f');
        gear(cx + 12, cy - 10, 7, 7, -t * 1.1 * 11 / 7 + .3, '#22e6ff');
        gear(cx + 14, cy + 14, 6, 6, -t * 1.1 * 11 / 6, '#ffd23f');
    },
    /* 3 заходи й проєкти: дошка задач і феєрверк */
    (cx, cy, t) => {
        R(cx - 30, cy - 8, 60, 28, '#140a2c'); BOX(cx - 30, cy - 8, 60, 28, '#a855f7');
        R(cx - 10, cy - 7, 1, 26, '#a855f755'); R(cx + 10, cy - 7, 1, 26, '#a855f755');
        [[0, 0, '#ff9a1f'], [0, 1, '#22e6ff'], [1, 1, '#ff3df0'], [2, 0, '#2bff88'], [2, 1, '#2bff88'], [2, 2, '#2bff88']]
            .forEach(([c, r, col]) => R(cx - 27 + c * 20, cy - 4 + r * 7, 14, 5, col));
        const p = (t * .35) % 1, mx = cx - 27 + Math.min(1, p * 1.6) * 20;
        R(mx, cy + 11, 14, 5, '#ffd23f');
        for (let f = 0; f < 2; f++) {
            const q = (t * .7 + f * .5) % 1, fx = cx - 16 + f * 32, fy = cy - 18;
            X.globalAlpha = 1 - q;
            for (let k = 0; k < 8; k++) { const a = k * .785; R(fx + Math.cos(a) * q * 10, fy + Math.sin(a) * q * 8, 1, 1, NEON[(k + f) % 6]); }
        }
        X.globalAlpha = 1;
    },
    /* 4 логіка й головоломки: падаюча фігура заповнює проміжок */
    (cx, cy, t) => {
        const ox = cx - 20, oy = cy - 25, cell = (c, r, col) => R(ox + c * 5, oy + r * 5, 4, 4, col);
        R(ox - 2, oy, 2, 51, '#8a8fbf'); R(ox + 40, oy, 2, 51, '#8a8fbf'); R(ox - 2, oy + 50, 44, 2, '#8a8fbf');
        const p = (t * .4) % 1, py = Math.min(8, Math.floor(p * 13)), landed = py >= 8;
        const flash = landed && Math.sin(t * 24) > 0;
        for (let c = 0; c < 8; c++) {
            if (c !== 4) cell(c, 9, flash ? '#fff' : '#5b8cff');
            if (c < 3 || c > 5) cell(c, 8, flash ? '#fff' : '#a855f7');
        }
        cell(3, py, '#ffd23f'); cell(4, py, '#ffd23f'); cell(5, py, '#ffd23f'); cell(4, py + 1, '#ffd23f');
        if (!landed && Math.sin(t * 5) > 0) TXT('?', cx + 30, cy - 14, '#ff3df0', 8);
    },
    /* 5 спілкування: двоє співрозмовників */
    (cx, cy, t) => {
        const who = Math.floor(t / 1.3) % 2, words = ['ПРИВІТ', 'ОК!', 'ДОМОВИЛИСЬ?', 'ТАК!'], wd = words[Math.floor(t / 1.3) % 4];
        face(cx - 17, cy + 8, '#f4c7a1', '#5a3a1a', '#22e6ff', who === 0 && Math.sin(t * 14) > 0);
        face(cx + 17, cy + 8, '#c68d5f', '#1a1030', '#ff3df0', who === 1 && Math.sin(t * 14) > 0);
        const bx = who ? cx + 12 : cx - 12, bw = wd.length * 5 + 6;
        R(bx - bw / 2, cy - 16, bw, 11, '#f2f4ff'); R(who ? bx + 3 : bx - 5, cy - 5, 3, 3, '#f2f4ff');
        TXT(wd, bx, cy - 10, '#1a1030', 5);
    },
    /* 6 робота руками: збирання робота молотком */
    (cx, cy, t) => {
        const n = Math.floor((t * 1.2) % 6);
        const parts = [
            () => { R(cx - 12, cy + 12, 4, 7, '#8d96c4'); R(cx - 4, cy + 12, 4, 7, '#8d96c4'); },
            () => { R(cx - 15, cy - 1, 18, 13, '#f2f4ff'); R(cx - 9, cy + 3, 6, 5, '#3b6cff'); },
            () => { R(cx - 13, cy - 13, 14, 11, '#f2f4ff'); R(cx - 11, cy - 11, 10, 7, '#0d1436'); R(cx - 9, cy - 9, 2, 2, '#3cf0ff'); R(cx - 5, cy - 9, 2, 2, '#3cf0ff'); },
            () => { R(cx - 7, cy - 17, 2, 4, '#1a1030'); R(cx - 8, cy - 19, 4, 2, '#ffd23f'); },
            () => { R(cx - 19, cy, 4, 9, '#ff9a1f'); R(cx + 3, cy, 4, 9, '#ff9a1f'); }
        ];
        for (let k = 0; k <= Math.min(n, 4); k++) parts[k]();
        const hit = Math.abs(Math.sin(t * 5)), hy = cy - 16 - hit * 7;
        R(cx + 18, hy, 3, 16, '#c68d5f'); R(cx + 13, hy - 4, 13, 6, '#c9cfe8');
        if (hit < .2) for (let k = 0; k < 5; k++) R(cx + 10 + Math.random() * 14, cy - 2 + Math.random() * 6, 1, 1, '#ffd23f');
    },
    /* 7 як працюють додатки та ігри: міні-пінг-понг */
    (cx, cy, t) => {
        R(cx - 30, cy - 22, 60, 38, '#0d1436'); BOX(cx - 30, cy - 22, 60, 38, '#22e6ff');
        R(cx - 6, cy + 16, 12, 3, '#8d96c4'); R(cx - 14, cy + 19, 28, 2, '#8d96c4');
        for (let y = cy - 19; y < cy + 13; y += 4) R(cx, y, 1, 2, '#22e6ff66');
        const tri = v => Math.abs(((v % 2) + 2) % 2 - 1);
        const bx = cx - 24 + tri(t * .6) * 48, by = cy - 18 + tri(t * .83) * 30;
        R(bx, by, 2, 2, '#fff');
        const py = Math.min(cy + 6, Math.max(cy - 20, by - 4));
        R(cx - 27, py, 2, 9, '#ff3df0'); R(cx + 25, py, 2, 9, '#2bff88');
        TXT('3', cx - 8, cy - 16, '#ff3df0', 5); TXT('2', cx + 8, cy - 16, '#2bff88', 5);
    },
    /* 8 емпатія: серце й маленькі серця, що злітають */
    (cx, cy, t) => {
        const s = Math.sin(t * 4) > .5 ? 5 : 4, w = 7 * s, h = 6 * s;
        X.drawImage(SPR.heart, Math.round(cx - w / 2), Math.round(cy - h / 2 + 2), w, h);
        for (let k = 0; k < 5; k++) {
            const p = (t * .35 + k / 5) % 1;
            X.globalAlpha = 1 - p;
            X.drawImage(SPR.heart, Math.round(cx - 26 + k * 13 + Math.sin(t * 2 + k) * 3), Math.round(cy + 18 - p * 42), 7, 6);
        }
        X.globalAlpha = 1;
    },
    /* 9 як заробляють компанії: зростаючий графік і монети */
    (cx, cy, t) => {
        R(cx - 26, cy + 18, 52, 1, '#8d96c4'); R(cx - 26, cy - 20, 1, 38, '#8d96c4');
        for (let i = 0; i < 5; i++) { const h = 6 + i * 6 + Math.sin(t * 2 + i) * 2; R(cx - 22 + i * 9, cy + 18 - h, 6, h, NEON[i % 4]); }
        LINE(cx - 21, cy + 8, cx + 17, cy - 20, '#fff'); R(cx + 15, cy - 21, 4, 2, '#fff'); R(cx + 17, cy - 21, 2, 4, '#fff');
        for (let k = 0; k < 2; k++) {
            const w = Math.max(1, Math.round(Math.abs(Math.cos(t * 3 + k * 1.5)) * 5));
            const x = cx + 24 - k * 52, y = cy - 6 + k * 10 + Math.sin(t * 2 + k) * 2;
            R(x - w, y - 5, w * 2, 10, '#ffd23f'); R(x - w, y - 5, w * 2, 1, '#fff3a8');
            if (w > 2) R(x - 1, y - 3, 2, 6, '#c9a400');
        }
    },
    /* 10 точні науки: атом і формули */
    (cx, cy, t) => {
        for (let k = 0; k < 3; k++) {
            const a = k * Math.PI / 3, ca = Math.cos(a), sa = Math.sin(a);
            for (let s = 0; s < 48; s++) {
                const u = s / 48 * 6.283, ex = Math.cos(u) * 24, ey = Math.sin(u) * 8;
                R(cx + ex * ca - ey * sa, cy + ex * sa + ey * ca, 1, 1, '#22e6ff55');
            }
            const u = t * 2 + k * 2.1, ex = Math.cos(u) * 24, ey = Math.sin(u) * 8;
            R(cx + ex * ca - ey * sa - 1, cy + ex * sa + ey * ca - 1, 3, 3, NEON[k + 1]);
        }
        CIRC(cx, cy, 4, '#ff3df0'); R(cx - 1, cy - 2, 2, 2, '#fff');
        TXT(['F=ma', 'E=mc2', 'a+b=c'][Math.floor(t / 2) % 3], cx, cy - 22, '#2bff88', 6);
    },
    /* 11 робити світ кращим: планета, паросток і сонце */
    (cx, cy, t) => {
        for (let k = 0; k < 8; k++) { const a = k * .785 + t * .4; R(cx + 24 + Math.cos(a) * 9, cy - 17 + Math.sin(a) * 9, 1, 1, '#ffd23f'); }
        CIRC(cx + 24, cy - 17, 5, '#ffd23f');
        X.save(); X.beginPath(); X.arc(cx, cy + 6, 16.5, 0, 7); X.clip();
        CIRC(cx, cy + 6, 16, '#3b6cff');
        const o = (t * 6) % 48;
        [[0, 0, 12, 6], [18, 8, 9, 7], [32, -6, 10, 5], [8, 12, 6, 4]].forEach(([x, y, w, h]) => R(cx - 30 + ((x + o) % 48), cy - 4 + y, w, h, '#2bff88'));
        X.restore();
        const g = Math.min(12, (t * 4) % 16);
        R(cx, cy - 10 - g, 1, g, '#2bff88');
        if (g > 6) { R(cx - 4, cy - 8 - g, 4, 2, '#2bff88'); R(cx + 1, cy - 6 - g, 4, 2, '#2bff88'); }
    },
    /* 12 нові програми й гаджети: смартфон, на якому з'являються іконки */
    (cx, cy, t) => {
        R(cx - 15, cy - 25, 30, 50, '#1a1030'); BOX(cx - 15, cy - 25, 30, 50, '#8d96c4');
        R(cx - 12, cy - 21, 24, 40, '#0d1436'); R(cx - 3, cy + 21, 6, 2, '#8d96c4');
        for (let k = 0; k < 9; k++) {
            const p = ((t * 1.5 - k * .3) % 4 + 4) % 4, s = p < .3 ? Math.round(p / .3 * 6) : (p < 3.6 ? 6 : 0);
            if (s > 0) R(cx - 10 + (k % 3) * 8 + (6 - s) / 2, cy - 18 + Math.floor(k / 3) * 9 + (6 - s) / 2, s, s, NEON[k % 6]);
        }
        if (Math.sin(t * 6) > 0) CIRC(cx + 13, cy - 23, 2, '#ff4458');
    },
    /* 13 власний бізнес і стартап: запуск ракети */
    (cx, cy, t) => {
        for (let k = 0; k < 6; k++) { const y = (t * 30 + k * 11) % 60; R(cx - 30 + hash(k) * 60, cy - 28 + y, 1, 3, '#ffffff88'); }
        const p = (t * .35) % 1, ry = cy + 12 - p * 50;
        R(cx - 14, cy + 18, 28, 2, '#8d96c4');
        for (let k = 0; k < 4; k++) {
            const q = (t * 1.5 + k / 4) % 1;
            X.globalAlpha = 1 - q;
            CIRC(cx - 8 + k * 5, cy + 16 - q * 4, 1 + Math.round(q * 3), '#8d96c4');
        }
        X.globalAlpha = 1;
        const fl = 4 + Math.round(Math.random() * 4);
        R(cx - 2, ry + 14, 4, fl, '#ff9a1f'); R(cx - 1, ry + 14, 2, fl - 2, '#ffd23f');
        X.drawImage(SPR.rocket, Math.round(cx - 7), Math.round(ry), 14, 14);
    },
    /* 14 винаходи й технології: лампочка-ідея з іскрами */
    (cx, cy, t) => {
        const on = Math.sin(t * 3) > -.3;
        if (on) {
            const g = X.createRadialGradient(cx, cy - 4, 0, cx, cy - 4, 26);
            g.addColorStop(0, 'rgba(255,225,77,.45)');
            g.addColorStop(1, 'rgba(255,225,77,0)');
            X.fillStyle = g;
            X.fillRect(cx - 30, cy - 30, 60, 52);
            for (let k = 0; k < 8; k++) {
                const a = k * .785 + t * .3;
                LINE(cx + Math.cos(a) * 15, cy - 5 + Math.sin(a) * 15, cx + Math.cos(a) * 21, cy - 5 + Math.sin(a) * 21, '#ffd23f');
            }
        }
        X.globalAlpha = on ? 1 : .5;
        X.drawImage(SPR.bulb, Math.round(cx - 9), Math.round(cy - 15), 18, 24);
        X.globalAlpha = 1;
        gear(cx - 22, cy + 16, 4, 6, t, '#22e6ff'); gear(cx + 22, cy + 16, 4, 6, -t, '#ff3df0');
    },
    /* 15 історія, психологія, культура: античний храм і сонце над ним */
    (cx, cy, t) => {
        const sa = (t * .25) % 1, sx = cx - 30 + sa * 60, sy = cy - 20 - Math.sin(sa * Math.PI) * 6;
        CIRC(sx, sy, 3, '#ff9a1f');
        for (let j = 0; j < 8; j++) R(cx - 3 - j * 3.3, cy - 18 + j, 6 + j * 6.6, 1, '#e8dcb5');
        R(cx - 28, cy - 10, 56, 3, '#d9cba0');
        for (let k = 0; k < 5; k++) {
            R(cx - 24 + k * 11, cy - 7, 5, 21, '#d9cba0'); R(cx - 24 + k * 11, cy - 7, 1, 21, '#fff7dc'); R(cx - 25 + k * 11, cy - 7, 7, 2, '#e8dcb5');
        }
        R(cx - 30, cy + 14, 60, 3, '#e8dcb5'); R(cx - 32, cy + 17, 64, 2, '#c4b48a');
    },
    /* 16 сайти, боти, додатки: вікно браузера з кодом і бот */
    (cx, cy, t) => {
        R(cx - 31, cy - 24, 62, 46, '#0d1436'); BOX(cx - 31, cy - 24, 62, 46, '#22e6ff'); R(cx - 30, cy - 23, 60, 5, '#1d2a5a');
        R(cx - 28, cy - 22, 2, 2, '#ff4458'); R(cx - 24, cy - 22, 2, 2, '#ffd23f'); R(cx - 20, cy - 22, 2, 2, '#2bff88');
        const lines = [[0, 14, '#ff3df0'], [2, 22, '#22e6ff'], [4, 16, '#ffd23f'], [4, 10, '#2bff88'], [2, 18, '#22e6ff'], [0, 8, '#ff3df0'], [0, 20, '#a855f7']];
        const n = Math.floor((t * 3) % 10);
        lines.slice(0, Math.min(n, 7)).forEach(([ind, w, c], k) => R(cx - 27 + ind * 2, cy - 15 + k * 5, w, 2, c));
        if (Math.sin(t * 8) > 0) R(cx - 27, cy - 15 + Math.min(n, 7) * 5, 2, 3, '#fff');
        X.drawImage(SPR.bot, Math.round(cx + 14), Math.round(cy + 5 + Math.sin(t * 4) * 1.5), 16, 16);
    },
    /* 17 переконання й вигідні рішення: терези */
    (cx, cy, t) => {
        const a = Math.sin(t * 1.4) * .22, L = 23, ca = Math.cos(a), sa = Math.sin(a);
        R(cx - 1, cy - 16, 3, 33, '#c9cfe8'); R(cx - 11, cy + 17, 23, 3, '#8d96c4'); CIRC(cx, cy - 17, 2, '#ffd23f');
        const lx = cx - L * ca, ly = cy - 15 - L * sa, rx = cx + L * ca, ry = cy - 15 + L * sa;
        LINE(lx, ly, rx, ry, '#ffd23f'); LINE(lx, ly + 1, rx, ry + 1, '#c9a400');
        for (const [x, y, c] of [[lx, ly, '#22e6ff'], [rx, ry, '#ff3df0']]) {
            LINE(x, y, x - 6, y + 12, '#8d96c4'); LINE(x, y, x + 6, y + 12, '#8d96c4');
            R(x - 8, y + 12, 17, 2, c); R(x - 6, y + 14, 13, 1, c);
        }
        R(lx - 3, ly + 8, 6, 4, '#ffd23f');
        X.drawImage(SPR.heart, Math.round(rx - 3), Math.round(ry + 6), 7, 6);
    },
    /* 18 виробництво, лабораторія, будівництво: завод, колби й кран */
    (cx, cy, t) => {
        R(cx - 32, cy - 2, 26, 20, '#2a1650'); R(cx - 28, cy - 20, 5, 18, '#2a1650'); R(cx - 18, cy - 14, 5, 12, '#2a1650');
        for (let k = 0; k < 3; k++) {
            const p = (t * .6 + k / 3) % 1;
            X.globalAlpha = .7 * (1 - p);
            CIRC(cx - 25 + p * 6, cy - 22 - p * 10, 1 + Math.round(p * 3), '#8d96c4');
        }
        X.globalAlpha = 1;
        for (let k = 0; k < 3; k++) R(cx - 29 + k * 8, cy + 4, 4, 4, Math.sin(t * 3 + k) > 0 ? '#ffd23f' : '#5a3a7a');
        flask(cx + 2, cy + 8, '#2bff88', t, 0); flask(cx + 18, cy + 8, '#ff3df0', t, 1);
        R(cx - 32, cy + 18, 64, 2, '#8d96c4');
        R(cx + 24, cy - 24, 2, 26, '#ffd23f'); R(cx + 8, cy - 24, 20, 2, '#ffd23f');
        const hook = cy - 18 + Math.sin(t * 1.5) * 4;
        LINE(cx + 12, cy - 22, cx + 12, hook, '#8d96c4'); R(cx + 9, hook, 7, 4, '#ff9a1f');
    },
    /* 19 робота за комп'ютером: термінал */
    (cx, cy, t) => {
        R(cx - 30, cy - 24, 60, 38, '#1a1030'); BOX(cx - 30, cy - 24, 60, 38, '#a855f7'); R(cx - 27, cy - 21, 54, 32, '#05010c');
        R(cx - 4, cy + 14, 8, 4, '#8d96c4'); R(cx - 18, cy + 18, 36, 3, '#8d96c4');
        const L = [['#2bff88', 24], ['#c9cfe8', 36], ['#22e6ff', 18], ['#c9cfe8', 30], ['#ffd23f', 12], ['#2bff88', 28], ['#c9cfe8', 20], ['#ff3df0', 26]];
        const off = Math.floor(t * 2.5);
        for (let k = 0; k < 6; k++) {
            const [c, w] = L[(off + k) % L.length];
            R(cx - 24, cy - 18 + k * 5, 2, 2, '#2bff88'); R(cx - 20, cy - 18 + k * 5, w, 2, c);
        }
        if (Math.sin(t * 8) > 0) R(cx - 18, cy + 9, 4, 2, '#fff');
    },
    /* 20 робота з людьми: навчання й допомога */
    (cx, cy, t) => {
        R(cx - 30, cy - 24, 40, 24, '#0f3d2e'); BOX(cx - 30, cy - 24, 40, 24, '#c68d5f');
        const n = Math.floor((t * 6) % 30);
        const pts = [[cx - 26, cy - 6], [cx - 20, cy - 12], [cx - 14, cy - 9], [cx - 8, cy - 17], [cx - 2, cy - 13], [cx + 5, cy - 20]];
        for (let k = 0; k < Math.min(5, Math.floor(n / 4)); k++) LINE(pts[k][0], pts[k][1], pts[k + 1][0], pts[k + 1][1], '#f2f4ff');
        face(cx + 20, cy - 10, '#f4c7a1', '#1a1030', '#a855f7', Math.sin(t * 10) > 0);
        LINE(cx + 13, cy - 2, cx + 6, cy - 10 + Math.sin(t * 3) * 2, '#f4c7a1');
        for (let k = 0; k < 4; k++) {
            R(cx - 26 + k * 13, cy + 10, 8, 8, ['#f4c7a1', '#c68d5f', '#e8b48a', '#8a5a3a'][k]);
            R(cx - 26 + k * 13, cy + 8, 8, 3, ['#5a3a1a', '#1a1030', '#c9a400', '#1a1030'][k]);
            R(cx - 28 + k * 13, cy + 18, 12, 3, NEON[k]);
        }
        if (Math.sin(t * 2) > 0) { R(cx + 25, cy + 4, 3, 9, '#ff4458'); R(cx + 22, cy + 7, 9, 3, '#ff4458'); }
    }
];

function drawScene(now, idx) {
    const t = Math.max(0, (now - sceneT0) / 1000);
    X.imageSmoothingEnabled = false;
    bgScene(SW, SH, t, idx, ACC[idx]);
    try { SCENES[idx](Math.round(SW / 2), Math.round(SH / 2), t); } catch (e) { console.error(e); }
}
