// State Management: дані поточного проходження тесту
const state = {
    gender: null,
    age: null,
    swipes: [],    // значення відповідей у порядку питань
    idx: 0,        // індекс поточного питання
    lock: false    // блокування на час анімації переходу
};

function resetState() {
    state.gender = null;
    state.age = null;
    state.swipes = [];
    state.idx = 0;
    state.lock = false;
}

// Сховище результатів — та сама колекція, яку показує admin.html
const jsonBucket = new LocalStorageCollection('khpi-career-advisor');
