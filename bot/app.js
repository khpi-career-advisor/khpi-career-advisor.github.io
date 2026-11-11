(function() {
    "use strict";

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
        state = { q: -1, busy: false, scores: {}, current: [], selected: -1 };
        Object.keys(DIRECTIONS).forEach(function(k) { state.scores[k] = 0; });
    }

    /* ---------- Утиліти ---------- */
    function esc(s) {
        return String(s).replace(/[&<>"']/g, function(c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

    function scrollDown() { elEnd.scrollIntoView({ block: "end" }); }

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

    function botSay(parts, then) {
        state.busy = true;
        lockOptions(true);
        var i = 0;
        (function next() {
            var typing = addMessage("assistant", '<span class="typing" aria-label="Бот друкує"><i></i><i></i><i></i></span>');
            setTimeout(function() {
                typing.remove();
                addMessage("assistant", parts[i]);
                i++;
                if (i < parts.length) next();
                else { state.busy = false; if (then) then(); }
            }, 450 + Math.min(parts[i].length, 900) / 4);
        })();
    }

    /* ---------- Варіанти відповідей ----------
       Натискання на варіант лише обирає його й показує в полі вводу.
       Відповідь надсилається кнопкою зі стрілкою (або клавішею Enter).
       До надсилання вибір можна змінити. */
    var PLACEHOLDER_IDLE = "Надіслати повідомлення...";
    var PLACEHOLDER_PICK = "Обери варіант і натисни стрілку";

    function setOptions(options) {
        state.current = options;
        state.selected = -1;
        elOptions.innerHTML = "";
        options.forEach(function(opt, idx) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "opt";
            b.style.animationDelay = (0.03 * idx) + "s";
            b.setAttribute("aria-pressed", "false");
            b.innerHTML = opt.title ?
                "<b>" + esc(opt.title) + "</b><span>" + esc(opt.label) + "</span>" :
                esc(opt.label);
            b.addEventListener("click", function() { select(idx); });
            elOptions.appendChild(b);
        });
        elOptions.scrollTop = 0;
        updateInput();
    }

    function select(idx) {
        if (state.busy) return;
        state.selected = idx;
        Array.prototype.forEach.call(elOptions.children, function(b, i) {
            b.setAttribute("aria-pressed", i === idx ? "true" : "false");
        });
        updateInput();
        elSend.focus();
    }

    function optionText(opt) {
        return opt.title ? opt.title + " " + opt.label : opt.label;
    }

    function updateInput() {
        var opt = state.current[state.selected];
        if (opt) {
            elInput.textContent = optionText(opt);
        } else {
            elInput.textContent = state.current.length ? PLACEHOLDER_PICK : PLACEHOLDER_IDLE;
        }
        elSend.disabled = state.busy || !opt;
    }

    function send() {
        var opt = state.current[state.selected];
        if (state.busy || !opt) return;
        opt.run();
    }

    elSend.addEventListener("click", send);
    document.addEventListener("keydown", function(e) {
        var el = document.activeElement;
        /* Enter на кнопці варіанта лише обирає його; на стрілці спрацьовує її власний клік. */
        if (e.key === "Enter" && state.selected >= 0 && el !== elSend && !(el && el.classList.contains("opt"))) {
            e.preventDefault();
            send();
        }
    });

    function lockOptions(locked) {
        Array.prototype.forEach.call(elOptions.children, function(b) { b.disabled = locked; });
        updateInput();
    }

    function say(text) {
        addMessage("user", "<p>" + esc(text) + "</p>");
        setOptions([]);
    }

    /* ---------- Сценарій ---------- */
    function showStart() {
        setOptions([{
            title: "Привіт,",
            label: "я хочу пройти тестування!",
            run: function() {
                say("Привіт, я хочу пройти тестування!");
                state.q = 0;
                botSay([
                    "<p>Привіт! Радий, що ти тут 🙂 Зараз буде " + QUESTIONS.length + " коротких питань. " +
                    "У кожному обери один варіант, який тобі найближчий. За відповідями я визначу напрям професійної діяльності в НТУ «ХПІ», що тобі підходить.</p>" +
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
        setOptions(QUESTIONS[state.q].options.map(function(o) {
            return {
                label: o.key + ". " + o.label,
                run: function() {
                    say(o.label);
                    var r = ranksOf(o);
                    Object.keys(DIRECTIONS).forEach(function(k) { state.scores[k] += r[k] || 0; });
                    state.q++;
                    var parts = o.comment ? ["<p>" + esc(o.comment) + "</p>"] : [];
                    if (state.q < QUESTIONS.length) {
                        parts.push(questionHtml(state.q));
                        botSay(parts, showQuestionOptions);
                    } else if (parts.length) {
                        botSay(parts, showResults);
                    } else {
                        showResults();
                    }
                }
            };
        }));
    }

    /* ---------- Результат: схильність до напрямів у % ---------- */
    /* Ранги варіанта. Якщо ranks не задано, основний напрям отримує 1, решта 0. */
    function ranksOf(o) {
        if (o.ranks) return o.ranks;
        var r = {};
        r[o.key] = 1;
        return r;
    }

    /* Схильність = (сума рангів − мінімум) / (максимум − мінімум) × 100,
       де мінімум і максимум — найменша й найбільша можлива сума за всіма питаннями. */
    function percents() {
        var keys = Object.keys(DIRECTIONS);
        return keys.map(function(k, i) {
            var min = 0,
                max = 0;
            QUESTIONS.forEach(function(q) {
                var vals = q.options.map(function(o) { return ranksOf(o)[k] || 0; });
                min += Math.min.apply(null, vals);
                max += Math.max.apply(null, vals);
            });
            var share = max > min ? (state.scores[k] - min) / (max - min) : 0;
            return { key: k, order: i, share: share, pct: Math.round(share * 100) };
        }).sort(function(x, y) { return y.share - x.share || x.order - y.order; });
    }

    function showResults() {
        var list = "<ol>" + percents().map(function(r) {
            var d = DIRECTIONS[r.key];
            return '<li><a href="' + esc(d.url) + '" target="_blank" rel="noopener noreferrer">' +
                esc(d.name) + "</a>: " + r.pct + "%</li>";
        }).join("") + "</ol>";

        botSay([
            "<p>Дякую за відповіді! Ось твоя схильність до напрямів навчання в НТУ «ХПІ»:</p>" + list +
            "<p>Натисни на напрям, щоб перейти до наступного етапу та дізнатися більше!</p>"
        ], function() {
            setOptions([{ label: "Пройти тест ще раз", run: restart }]);
        });
    }

    function restart() {
        Array.prototype.slice.call(elMessages.querySelectorAll(".msg")).forEach(function(m) { m.remove(); });
        elOverview.hidden = false;
        resetState();
        showStart();
        elMessages.scrollTop = 0;
    }

    resetState();
    showStart();
})();