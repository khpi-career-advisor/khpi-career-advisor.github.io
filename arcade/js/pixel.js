// Pixel Art Toolkit: полотно сцени, примітиви малювання, спрайти
const sceneCv = document.getElementById('sceneCv');
const X = sceneCv.getContext('2d');

/* ---------- примітиви (координати в логічних пікселях сцени) ---------- */
const R = (x, y, w, h, c) => {
    X.fillStyle = c;
    X.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
};
const CIRC = (x, y, r, c) => {
    for (let j = -r; j <= r; j++) {
        const w = Math.round(Math.sqrt(r * r - j * j));
        R(x - w, y + j, w * 2 + 1, 1, c);
    }
};
const LINE = (x0, y0, x1, y1, c) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) | 0;
    for (let k = 0; k <= n; k++) R(x0 + (x1 - x0) * k / (n || 1), y0 + (y1 - y0) * k / (n || 1), 1, 1, c);
};
const BOX = (x, y, w, h, c) => {
    R(x, y, w, 1, c); R(x, y + h - 1, w, 1, c); R(x, y, 1, h, c); R(x + w - 1, y, 1, h, c);
};
const TXT = (s, x, y, c, size = 6) => {
    X.font = size + 'px "Press Start 2P", monospace';
    X.fillStyle = c;
    X.textAlign = 'center';
    X.textBaseline = 'middle';
    X.fillText(s, Math.round(x), Math.round(y));
};
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const NEON = ['#22e6ff', '#ff3df0', '#ffd23f', '#2bff88', '#a855f7', '#ff9a1f'];

/* ---------- спрайти з рядків ---------- */
const PAL = {
    K: '#1a1030', W: '#f2f4ff', G: '#8d96c4', D: '#0d1436', C: '#3cf0ff', O: '#ff9a1f', Y: '#ffe14d', B: '#3b6cff',
    R: '#ff4458', P: '#ff3df0', L: '#c9a400', S: '#f4c7a1', H: '#5a3a1a', E: '#ffffff'
};

function sprite(rows) {
    const c = document.createElement('canvas');
    c.width = rows[0].length;
    c.height = rows.length;
    const x = c.getContext('2d');
    rows.forEach((r, j) => {
        for (let i = 0; i < r.length; i++) if (r[i] !== '.') { x.fillStyle = PAL[r[i]]; x.fillRect(i, j, 1, 1); }
    });
    return c;
}

const SPR = {
    heart: sprite(['.RR.RR.', 'RRRRRRR', 'RRWRRRR', '.RRRRR.', '..RRR..', '...R...']),
    rocket: sprite(['...W...', '..WWW..', '..WCW..', '..WWW..', '.WWWWW.', 'RWWBWWR', 'R.W.W.R']),
    bulb: sprite(['..YYYYY..', '.YYEEYYY.', 'YYEEYYYYY', 'YYEYYYYYY', 'YYYYYYYYY', '.YYYYYYY.', '..YYYYY..', '...YLY...',
        '..GGGGG..', '..KGKGK..', '..GGGGG..', '...GGG...']),
    bot: sprite(['...YY...', '...KK...', '.KKKKKK.', 'KWWWWWWK', 'KWCDDCWK', 'KWWWWWWK', '.KKKKKK.', '..O..O..']),
    robot: sprite(['......YYYY......', '.......KK.......', '...KKKKKKKKKK...', '..KWWWWWWWWWWK..', '.OKWDDDDDDDDWKO.',
        '.OKWDCCDDCCDWKO.', '.OKWDCCDDCCDWKO.', '.OKWDDDDDDDDWKO.', '..KWDDDCCDDDWK..', '..KWWWWWWWWWWK..',
        '...KKKKKKKKKK...', '....KWWBBWWK....', '...KWWBBBBWWK...', '...KWWWBBWWWK...', '....KGGKKGGK....', '....OO....OO....'])
};

/* ---------- складені фігури ---------- */
function face(x, y, skin, hair, shirt, talk) {
    R(x - 5, y - 5, 10, 10, skin); R(x - 5, y - 7, 10, 3, hair); R(x - 6, y - 5, 1, 4, hair); R(x + 5, y - 5, 1, 4, hair);
    R(x - 3, y - 2, 2, 2, '#1a1030'); R(x + 1, y - 2, 2, 2, '#1a1030');
    R(x - 2, y + 2, 4, talk ? 2 : 1, talk ? '#7a1030' : '#1a1030');
    R(x - 7, y + 6, 14, 9, shirt);
}

function gear(x, y, r, n, a, c) {
    for (let i = 0; i < n; i++) {
        const an = a + i * 6.283 / n;
        R(x + Math.cos(an) * (r + 1) - 2, y + Math.sin(an) * (r + 1) - 2, 4, 4, c);
    }
    CIRC(x, y, r, c);
    CIRC(x, y, Math.max(2, Math.round(r * .4)), '#0b0420');
}

function flask(x, y, col, t, k) {
    R(x - 2, y - 14, 4, 6, '#c9cfe8');
    for (let j = 0; j < 10; j++) { const w = 2 + j; R(x - w, y - 8 + j, w * 2, 1, j > 3 ? col : '#c9cfe8'); }
    for (let b = 0; b < 3; b++) { const p = (t * .8 + b / 3 + k * .2) % 1; R(x - 3 + b * 3, y + 1 - p * 18, 1, 1, '#fff'); }
}
