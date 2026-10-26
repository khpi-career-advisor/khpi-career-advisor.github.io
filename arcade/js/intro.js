// Intro Screen: вибір статі й віку, кнопка «Почати тест»
function selectGender(value, el) {
    state.gender = value;
    markSelected('g', el);
    focusSelector('[data-act^="a:"]');
}

function selectAge(value, el) {
    state.age = value;
    markSelected('a', el);
    if (state.gender) focusSelector('#confirmBtn');
}

function markSelected(prefix, el) {
    document.querySelectorAll(`#scr-intro [data-act^="${prefix}:"]`).forEach(n => n.classList.remove('sel'));
    el.classList.add('sel');
    $('confirmBtn').classList.toggle('off', !(state.gender && state.age));
}

// після вибору фокус переходить до наступної групи (зручно з геймпадом)
function focusSelector(sel) {
    const scr = $('scr-' + cur);
    const t = scr.querySelector(sel.replace(']', '].sel')) || scr.querySelector(sel);
    const i = navItems.indexOf(t);
    if (i >= 0) setFocus(i);
}

function resetAll() {
    resetState();
    document.querySelectorAll('#scr-intro .nav.sel').forEach(n => n.classList.remove('sel'));
    $('confirmBtn').classList.add('off');
    showScreen('intro');
}
