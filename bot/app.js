(function () {
  "use strict";

  var MAX_SELECT = 3;
  var TOP_N = 3;

  var ICON_BOT = '<svg width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 2.79933C9.19835 2.53997 9.5 2.05521 9.5 1.5C9.5 0.671573 8.82843 0 8 0C7.17157 0 6.5 0.671573 6.5 1.5C6.5 2.05521 6.80165 2.53997 7.25 2.79933V5H7C4.027 5 1.55904 7.16229 1.08296 10H0V13H1V14.5V16H2.5H13.5H15V14.5V13H16V10H14.917C14.441 7.16229 11.973 5 9 5H8.75V2.79933ZM7 6.5C4.51472 6.5 2.5 8.51472 2.5 11V14.5H13.5V11C13.5 8.51472 11.4853 6.5 9 6.5H7ZM7.25 11.25C7.25 12.2165 6.4665 13 5.5 13C4.5335 13 3.75 12.2165 3.75 11.25C3.75 10.2835 4.5335 9.5 5.5 9.5C6.4665 9.5 7.25 10.2835 7.25 11.25ZM10.5 13C11.4665 13 12.25 12.2165 12.25 11.25C12.25 10.2835 11.4665 9.5 10.5 9.5C9.5335 9.5 8.75 10.2835 8.75 11.25C8.75 12.2165 9.5335 13 10.5 13Z" fill="currentColor"/></svg>';
  var ICON_USER = '<svg width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.75 0C5.95507 0 4.5 1.45507 4.5 3.25V3.75C4.5 5.54493 5.95507 7 7.75 7H8.25C10.0449 7 11.5 5.54493 11.5 3.75V3.25C11.5 1.45507 10.0449 0 8.25 0H7.75ZM6 3.25C6 2.2835 6.7835 1.5 7.75 1.5H8.25C9.2165 1.5 10 2.2835 10 3.25V3.75C10 4.7165 9.2165 5.5 8.25 5.5H7.75C6.7835 5.5 6 4.7165 6 3.75V3.25ZM2.5 14.5V13.1709C3.31958 11.5377 4.99308 10.5 6.82945 10.5H9.17055C11.0069 10.5 12.6804 11.5377 13.5 13.1709V14.5H2.5ZM6.82945 9C4.35483 9 2.10604 10.4388 1.06903 12.6857L1 12.8353V13V15.25V16H1.75H14.25H15V15.25V13V12.8353L14.931 12.6857C13.894 10.4388 11.6452 9 9.17055 9H6.82945Z" fill="currentColor"/></svg>';

  var elMessages = document.getElementById("messages");
  var elOverview = document.getElementById("overview");
  var elEnd = document.getElementById("scrollEnd");
  var elOptions = document.getElementById("options");
  var elInput = document.getElementById("inputText");
  var elSend = document.getElementById("sendBtn");

  /* Стан розмови. Нічого не зберігається і нікуди не надсилається. */
  var state;
  function resetState() {
    state = {
      q: -1,            // індекс поточного питання
      inHint: false,    // чи показане навідне питання
      busy: false,      // бот «друкує»
      profile: {},      // сума ознак користувача
      selected: [],     // обрані варіанти поточного питання
      current: [],      // варіанти, що зараз на екрані
      ranking: null
    };
  }

  /* ---------- Утиліти ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function firstSentences(text, n) {
    var parts = text.match(/[^.!?]+[.!?]+/g) || [text];
    return parts.slice(0, n).join("").trim();
  }
  function scrollDown() { elEnd.scrollIntoView({ block: "end" }); }

  /* Автопрокрутка, як у useScrollToBottom оригіналу */
  new MutationObserver(scrollDown).observe(elMessages, { childList: true, subtree: true });

  /* ---------- Повідомлення ---------- */
  function addMessage(role, html) {
    elOverview.hidden = true;
    var wrap = document.createElement("div");
    wrap.className = "msg msg-" + role;
    wrap.innerHTML =
      '<div class="msg-icon">' + (role === "assistant" ? ICON_BOT : ICON_USER) + "</div>" +
      '<div class="msg-body">' + html + "</div>";
    elMessages.insertBefore(wrap, elEnd);
    return wrap;
  }

  /* Відповідь бота з коротким індикатором набору. parts — масив HTML-повідомлень. */
  function botSay(parts, then) {
    state.busy = true;
    lockOptions(true);
    var i = 0;
    (function next() {
      var typing = addMessage("assistant", '<span class="typing" aria-label="Бот друкує"><i></i><i></i><i></i></span>');
      setTimeout(function () {
        typing.remove();
        addMessage("assistant", parts[i]);
        i++;
        if (i < parts.length) next();
        else {
          state.busy = false;
          if (then) then();
        }
      }, 550 + Math.min(parts[i].length, 900) / 3);
    })();
  }

  /* ---------- Варіанти відповідей ---------- */
  /*
   * options: [{ label, title?, tags?, kind? }]
   * kind: "send" — надсилається одразу (старт, «Не знаю», дії після результату)
   *       інакше — перемикач, надсилається кнопкою зі стрілкою
   */
  function setOptions(options) {
    state.current = options;
    state.selected = [];
    elOptions.innerHTML = "";
    options.forEach(function (opt, idx) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "opt" + (opt.kind === "send" && opt.secondary ? " secondary" : "");
      b.style.animationDelay = (0.03 * idx) + "s";
      if (opt.title) {
        b.innerHTML = "<b>" + esc(opt.title) + "</b><span>" + esc(opt.label) + "</span>";
      } else {
        b.textContent = opt.label;
      }
      if (opt.kind !== "send") b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () { onOption(idx, b); });
      elOptions.appendChild(b);
    });
    updateInput();
    elOptions.scrollTop = 0;
  }

  function lockOptions(locked) {
    Array.prototype.forEach.call(elOptions.children, function (b) { b.disabled = locked; });
    elSend.disabled = locked || state.selected.length === 0;
  }

  function updateInput() {
    if (state.selected.length) {
      elInput.textContent = state.selected.map(function (i) { return state.current[i].label; }).join("; ");
      elInput.classList.remove("placeholder");
    } else {
      var toggles = state.current.some(function (o) { return o.kind !== "send"; });
      elInput.textContent = toggles
        ? "Обери до " + MAX_SELECT + " варіантів і натисни стрілку"
        : "Надіслати повідомлення...";
      elInput.classList.add("placeholder");
    }
    elSend.disabled = state.busy || state.selected.length === 0;
  }

  function onOption(idx, btn) {
    if (state.busy) return;
    var opt = state.current[idx];
    if (opt.kind === "send") { opt.run(); return; }

    var pos = state.selected.indexOf(idx);
    if (pos >= 0) {
      state.selected.splice(pos, 1);
      btn.setAttribute("aria-pressed", "false");
    } else {
      if (state.selected.length >= MAX_SELECT) {
        var dropped = state.selected.shift();
        elOptions.children[dropped].setAttribute("aria-pressed", "false");
      }
      state.selected.push(idx);
      btn.setAttribute("aria-pressed", "true");
    }
    updateInput();
  }

  elSend.addEventListener("click", submitSelection);

  function submitSelection() {
    if (state.busy || !state.selected.length) return;
    var chosen = state.selected.map(function (i) { return state.current[i]; });
    addMessage("user", "<p>" + esc(chosen.map(function (o) { return o.label; }).join(", ")) + "</p>");
    chosen.forEach(function (o) { addTags(o.tags); });
    setOptions([]);
    advance();
  }

  function addTags(tags) {
    for (var k in tags) state.profile[k] = (state.profile[k] || 0) + tags[k];
  }

  /* ---------- Сценарій ---------- */
  function showStart() {
    setOptions([{
      kind: "send",
      title: "Привіт,",
      label: "я хочу пройти тестування!",
      run: function () {
        addMessage("user", "<p>Привіт, я хочу пройти тестування!</p>");
        setOptions([]);
        state.q = 0;
        botSay([
          "<p>Привіт! Радий, що ти тут 🙂 Я поставлю 5 коротких питань про твої інтереси та вміння. " +
          "На кожне можна обрати кілька варіантів, а якщо важко визначитися, натисни «Не знаю», і я допоможу навідним питанням.</p>" +
          questionHtml(0)
        ], showQuestionOptions);
      }
    }]);
  }

  function questionHtml(i) {
    return '<p class="step">Питання ' + (i + 1) + " з " + QUESTIONS.length + "</p>" +
      "<p><strong>" + esc(QUESTIONS[i].text) + "</strong></p>";
  }

  function showQuestionOptions() {
    var q = QUESTIONS[state.q];
    state.inHint = false;
    var opts = q.options.slice();
    opts.push({
      kind: "send", secondary: true, label: "Не знаю",
      run: function () {
        addMessage("user", "<p>Не знаю</p>");
        setOptions([]);
        state.inHint = true;
        botSay(["<p>" + esc(q.hint.text) + "</p>"], showHintOptions);
      }
    });
    setOptions(opts);
  }

  function showHintOptions() {
    var q = QUESTIONS[state.q];
    var opts = q.hint.options.slice();
    opts.push({
      kind: "send", secondary: true, label: "Пропустити питання",
      run: function () {
        addMessage("user", "<p>Пропустити питання</p>");
        setOptions([]);
        advance(true);
      }
    });
    setOptions(opts);
  }

  function advance(skipped) {
    var q = QUESTIONS[state.q];
    var ack = skipped ? "Гаразд, пропускаємо це питання." : pick(q.acks);
    state.q++;
    if (state.q < QUESTIONS.length) {
      botSay(["<p>" + esc(ack) + "</p>" + questionHtml(state.q)], showQuestionOptions);
    } else {
      showResults(ack);
    }
  }

  /* ---------- Порівняння портретів ---------- */
  function cosine(a, b) {
    var dot = 0, na = 0, nb = 0, k;
    for (k in a) { na += a[k] * a[k]; if (b[k]) dot += a[k] * b[k]; }
    for (k in b) nb += b[k] * b[k];
    return na && nb ? dot / Math.sqrt(na * nb) : 0;
  }

  function rank() {
    return PROFESSIONS.map(function (p) {
      return { p: p, score: cosine(state.profile, p.tags) };
    }).sort(function (x, y) { return y.score - x.score; });
  }

  function topTraits(n) {
    return Object.keys(state.profile)
      .sort(function (a, b) { return state.profile[b] - state.profile[a]; })
      .slice(0, n);
  }

  /* Чому професія підходить: спільні ознаки з найбільшим внеском */
  function reasons(p) {
    var prof = state.profile;
    return Object.keys(p.tags)
      .filter(function (k) { return prof[k]; })
      .sort(function (a, b) { return prof[b] * p.tags[b] - prof[a] * p.tags[a]; })
      .slice(0, 3)
      .map(function (k) { return TRAITS[k]; });
  }

  function professionHtml(item, n, best) {
    var p = item.p;
    var why = reasons(p);
    return '<div class="prof' + (best ? " prof-best" : "") + '">' +
      "<h3>" + n + ". " + esc(p.name) + "</h3>" +
      '<p class="codes"><strong>Спеціальності:</strong> ' + esc(p.specialties.join("; ")) + "</p>" +
      (why.length ? "<p><strong>Чому тобі підходить:</strong> " + esc(why.join("; ")) + ".</p>" : "") +
      "<p>" + esc(firstSentences(p.portrait, 2)) + "</p>" +
      "<details><summary>Повний портрет професії</summary><p>" + esc(p.portrait) + "</p></details>" +
      "<p><strong>Порада:</strong> " + esc(p.tip) + "</p>" +
      "</div>";
  }

  function showResults(ack) {
    if (!Object.keys(state.profile).length) {
      botSay([
        "<p>На жаль, відповідей замало, щоб скласти твій портрет. Спробуй пройти опитування ще раз: " +
        "навіть один-два варіанти в кожному питанні вже дадуть результат.</p>"
      ], showFinalOptions);
      return;
    }

    state.ranking = rank();
    var top = state.ranking.slice(0, TOP_N);

    var traits = topTraits(5).map(function (k) { return "<li>" + esc(TRAITS[k]) + "</li>"; }).join("");

    var codes = [];
    top.forEach(function (it) {
      it.p.specialties.forEach(function (s) { if (codes.indexOf(s) < 0) codes.push(s); });
    });

    var part1 =
      "<p>" + esc(ack) + "</p>" +
      "<p><strong>Твій портрет.</strong> Судячи з відповідей, твої сильні сторони та уподобання такі:</p>" +
      "<ul>" + traits + "</ul>";

    var part2 =
      "<p><strong>Спеціальності НТУ «ХПІ», на які варто звернути увагу:</strong></p>" +
      "<ul>" + codes.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>" +
      '<p>Детальніше про вступ: <a href="' + ADMISSION_URL + '" target="_blank" rel="noopener noreferrer">vstup.kpi.kharkov.ua</a></p>';

    var part3 =
      "<p><strong>Професії, які найкраще збігаються з твоїм портретом:</strong></p>" +
      top.map(function (it, i) { return professionHtml(it, i + 1, i === 0); }).join("") +
      "<p>Найближча до тебе професія: <strong>" + esc(top[0].p.name) + "</strong>. " +
      "Це орієнтир, а не вирок: переглянь також інші варіанти й поговори з викладачами на днях відкритих дверей.</p>";

    botSay([part1, part2, part3], showFinalOptions);
  }

  function showFinalOptions(noMore) {
    var opts = [];
    if (state.ranking && noMore !== true) {
      opts.push({
        kind: "send", label: "Показати інші варіанти",
        run: function () {
          addMessage("user", "<p>Показати інші варіанти</p>");
          setOptions([]);
          var more = state.ranking.slice(TOP_N, TOP_N + 3);
          botSay([
            "<p>Ось ще кілька професій, що частково збігаються з твоїм портретом:</p>" +
            more.map(function (it, i) { return professionHtml(it, TOP_N + i + 1, false); }).join("")
          ], function () { showFinalOptions(true); });
        }
      });
    }
    opts.push({
      kind: "send", label: "Пройти тест ще раз",
      run: restart
    });
    setOptions(opts);
  }

  function restart() {
    Array.prototype.slice.call(elMessages.querySelectorAll(".msg")).forEach(function (m) { m.remove(); });
    elOverview.hidden = false;
    resetState();
    showStart();
    elMessages.scrollTop = 0;
  }

  resetState();
  showStart();
})();
