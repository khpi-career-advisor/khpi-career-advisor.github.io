// Тест з профорієнтації НТУ «ХПІ».
// Усе працює в браузері: відповіді ніде не зберігаються і нікуди не надсилаються.

(function() {
    'use strict';

    const $ = (id) => document.getElementById(id);

    const screens = {
        welcome: $('screen-welcome'),
        question: $('screen-question'),
        result: $('screen-result'),
    };

    let order = []; // перемішані запитання поточного проходження
    let current = 0; // індекс поточного запитання
    let answers = []; // { q, yes } для кожного запитання

    // ---------- Підбір напрямів ----------

    const rankOf = (q, field, isYes) => (isYes ? q.weights[field] || 0 : 0);

    // Найменша й найбільша сума, яку може набрати кожен напрям.
    // Рахуються з data.js, тому ранги можна змінювати без правок коду.
    const bounds = {};
    FIELDS.forEach(({ name }) => {
        bounds[name] = { min: 0, max: 0 };
        QUESTIONS.forEach((q) => {
            const options = [rankOf(q, name, true), rankOf(q, name, false)];
            bounds[name].min += Math.min(...options);
            bounds[name].max += Math.max(...options);
        });
    });

    // Сума рангів обраних відповідей переводиться у відсоток на власній шкалі напряму:
    // % = (сума − min) / (max − min) × 100. Відсотки напрямів не додаються до 100.
    function rank(answers) {
        return FIELDS
            .map((field, i) => {
                const total = answers.reduce((sum, a) => sum + rankOf(a.q, field.name, a.yes), 0);
                const { min, max } = bounds[field.name];
                const percent = max > min ? ((total - min) / (max - min)) * 100 : 0;
                return {...field, total, percent, i };
            })
            .sort((a, b) => b.percent - a.percent || b.total - a.total || a.i - b.i);
    }

    function buildVerdict(answers) {
        const ranked = rank(answers);
        const [first, second] = ranked;

        // Риси — запитання з відповіддю «Так», найближчі до двох обраних напрямів.
        const closeness = (q) => (q.weights[first.name] || 0) + (q.weights[second.name] || 0);
        const traits = answers
            .filter((a) => a.yes)
            .map((a) => a.q)
            .sort((a, b) => closeness(b) - closeness(a) || a.id - b.id)
            .slice(0, 2)
            .map((q) => q.trait);

        const intro = traits.length === 0 ? 'твої різнобічні інтереси' :
            traits.length === 1 ? traits[0] :
            `${traits[0]} і ${traits[1]}`;

        const text = `Враховуючи ${intro}, тобі найкраще підходять напрями "${first.name}" і "${second.name}". ` +
            `"${first.name}" дозволить тобі ${first.benefit}, а "${second.name}" — ${second.benefit}.`;

        return { text, ranked };
    }

    // ---------- Інтерфейс ----------

    function show(name) {
        Object.entries(screens).forEach(([key, el]) => { el.hidden = key !== name; });
    }

    function shuffle(list) {
        const a = list.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    const imageSrc = (id) => `questions/question_${id}.png`;

    function renderQuestion() {
        const q = order[current];
        const n = current + 1;

        $('counter').textContent = `Запитання ${n}/${order.length}`;
        $('progress').style.width = `${(n / order.length) * 100}%`;
        $('question-text').textContent = q.text;

        const pic = $('pic');
        pic.hidden = true;
        $('skeleton').hidden = false;
        pic.src = imageSrc(q.id);
    }

    $('pic').addEventListener('load', () => {
        $('pic').hidden = false;
        $('skeleton').hidden = true;
    });

    function start() {
        order = shuffle(QUESTIONS);
        current = 0;
        answers = [];
        order.forEach((q) => { new Image().src = imageSrc(q.id); }); // попереднє завантаження
        $('progress').style.width = '0';
        show('question');
        renderQuestion();
    }

    function answer(isYes) {
        answers.push({ q: order[current], yes: isYes });
        current += 1;
        if (current < order.length) {
            renderQuestion();
        } else {
            showResult();
        }
    }

    function fieldLink(field, label) {
        const a = document.createElement('a');
        a.className = 'specialty';
        a.href = field.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = label;
        return a;
    }

    // Назви напрямів у лапках стають посиланнями на сторінки вступу.
    function showResult() {
        const { text, ranked } = buildVerdict(answers);
        const byName = (name) => FIELDS.find((f) => f.name === name);

        const p = $('verdict');
        p.textContent = '';
        text.split('"').forEach((part, i) => {
            p.appendChild(i % 2 === 1 ?
                fieldLink(byName(part), `“${part}”`) :
                document.createTextNode(part));
        });

        // Усі чотири напрями від найвищого відсотка до найнижчого.
        const list = $('fields');
        list.textContent = '';
        ranked.forEach((field) => {
            const li = document.createElement('li');
            const pct = Math.round(field.percent);
            li.appendChild(fieldLink(field, field.name));
            const value = document.createElement('span');
            value.className = 'field-percent';
            value.textContent = `${pct}%`;
            const bar = document.createElement('span');
            bar.className = 'field-bar';
            bar.innerHTML = '<span></span>';
            bar.firstChild.style.width = `${pct}%`;
            li.append(value, bar);
            list.appendChild(li);
        });

        show('result');
    }

    let toastTimer;

    function toast() {
        const el = $('toast');
        clearTimeout(toastTimer);
        el.classList.remove('leaving');
        el.hidden = false;
        toastTimer = setTimeout(() => {
            el.classList.add('leaving');
            toastTimer = setTimeout(() => { el.hidden = true; }, 400);
        }, 4000);
    }

    $('start').addEventListener('click', start);
    document.querySelectorAll('[data-answer]').forEach((btn) => {
        btn.addEventListener('click', () => answer(btn.dataset.answer === 'yes'));
    });
    $('restart').addEventListener('click', () => {
        show('welcome');
        toast();
    });
})();