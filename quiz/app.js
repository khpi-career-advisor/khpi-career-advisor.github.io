// Тест з профорієнтації НТУ «ХПІ».
// Усе працює в браузері: відповіді ніде не зберігаються і нікуди не надсилаються.

(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);

  const screens = {
    welcome: $('screen-welcome'),
    question: $('screen-question'),
    result: $('screen-result'),
  };

  let order = [];   // перемішані запитання поточного проходження
  let current = 0;  // індекс поточного запитання
  let yesIds = [];  // id запитань з відповіддю «Так»

  // ---------- Підбір спеціальностей ----------

  // Максимально можливий бал кожної спеціальності.
  const maxScore = {};
  QUESTIONS.forEach((q) => {
    Object.entries(q.weights).forEach(([name, w]) => {
      maxScore[name] = (maxScore[name] || 0) + w;
    });
  });

  // Бал = набрані ваги · (набрані / максимум)^0.5.
  // Так спеціальність, пов'язана з багатьма запитаннями, не перемагає завжди,
  // а пряма відповідність (вага 3) важить більше за побічну (1–2).
  function rank(ids) {
    const raw = {};
    const sources = {};
    ids.forEach((id) => {
      const q = QUESTIONS.find((x) => x.id === id);
      Object.entries(q.weights).forEach(([name, w]) => {
        raw[name] = (raw[name] || 0) + w;
        (sources[name] = sources[name] || []).push({ id, w });
      });
    });

    return SPECIALTIES
      .map((s, i) => {
        const r = raw[s.name] || 0;
        return {
          ...s,
          raw: r,
          score: r ? r * Math.sqrt(r / maxScore[s.name]) : 0,
          sources: sources[s.name] || [],
          i,
        };
      })
      .sort((a, b) => b.score - a.score || b.raw - a.raw || a.i - b.i);
  }

  function buildVerdict(ids) {
    const ranked = rank(ids);
    const byName = (name) => ranked.find((s) => s.name === name);

    let first;
    let second;
    if (ranked[0].score === 0) {
      [first, second] = FALLBACK.map(byName);
    } else {
      first = ranked[0];
      second = ranked[1].score > 0 ? ranked[1] : byName(FALLBACK.find((n) => n !== first.name));
    }

    // Риси — запитання, що найбільше вплинули на дві обрані спеціальності.
    const weightById = {};
    first.sources.concat(second.sources).forEach(({ id, w }) => {
      weightById[id] = (weightById[id] || 0) + w;
    });
    const traits = Object.keys(weightById)
      .map(Number)
      .sort((a, b) => weightById[b] - weightById[a] || a - b)
      .slice(0, 2)
      .map((id) => QUESTIONS.find((q) => q.id === id).trait);

    const compose = (list) => {
      const intro = list.length === 0 ? 'твої різнобічні інтереси'
        : list.length === 1 ? list[0]
        : `${list[0]} і ${list[1]}`;
      return `Враховуючи ${intro}, тобі найкраще підходять спеціальності "${first.name}" і "${second.name}". ` +
        `"${first.name}" дозволить тобі ${first.benefit}, а "${second.name}" — ${second.benefit}.`;
    };

    // Якщо текст задовгий, лишаємо одну рису.
    const full = compose(traits);
    return full.length <= 320 ? full : compose(traits.slice(0, 1));
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
    yesIds = [];
    order.forEach((q) => { new Image().src = imageSrc(q.id); }); // попереднє завантаження
    $('progress').style.width = '0';
    show('question');
    renderQuestion();
  }

  function answer(isYes) {
    if (isYes) yesIds.push(order[current].id);
    current += 1;
    if (current < order.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }

  // Назви спеціальностей у лапках підсвічуються, як в оригіналі.
  function showResult() {
    const parts = buildVerdict(yesIds).split('"');
    const p = $('verdict');
    p.textContent = '';
    parts.forEach((part, i) => {
      if (i % 2 === 1) {
        const span = document.createElement('span');
        span.className = 'specialty';
        span.textContent = `“${part}”`;
        p.appendChild(span);
      } else {
        p.appendChild(document.createTextNode(part));
      }
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
