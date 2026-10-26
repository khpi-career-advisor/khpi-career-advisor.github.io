// Answer Scale: сторона екрана → значення бажаності, що йде на вхід моделі
// Індекс у масиві збігається з атрибутом data-i кнопок у index.html.
const ANS = [
    { dir: 'left',  v: 0.00, label: 'Точно ні',    col: '#ff4458', vec: [-1, 0] },
    { dir: 'up',    v: 0.25, label: 'Скоріше ні',  col: '#ff9a1f', vec: [0, -1] },
    { dir: 'down',  v: 0.75, label: 'Скоріше так', col: '#c6ff3d', vec: [0, 1] },
    { dir: 'right', v: 1.00, label: 'Точно так',   col: '#2bff88', vec: [1, 0] }
];

const DIR_IDX = { left: 0, up: 1, down: 2, right: 3 };
