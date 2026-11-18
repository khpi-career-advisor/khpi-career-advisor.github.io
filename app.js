/* =========================================================
   ШІ-помічники для вступників НТУ «ХПІ» — логіка лендингу
   Чистий JavaScript, без бібліотек
   ========================================================= */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Шапка, прогрес, кнопка «нагору» ---------- */
  var header = $("#header");
  var bar = $("#progressBar");
  var toTop = $("#toTop");
  function onScroll() {
    var y = window.scrollY;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("is-solid", y > 40);
    toTop.classList.toggle("is-shown", y > 800);
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Мобільне меню ---------- */
  var burger = $("#burger");
  var nav = $("#nav");
  function toggleNav(open) {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрити меню" : "Відкрити меню");
  }
  burger.addEventListener("click", function () { toggleNav(!nav.classList.contains("is-open")); });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { toggleNav(false); }); });

  /* ---------- Активний пункт меню ---------- */
  var navLinks = $$('.nav a[href^="#"]');
  var sections = navLinks.map(function (a) { return $(a.getAttribute("href")); }).filter(Boolean);
  if ("IntersectionObserver" in window) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle("is-current", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navObs.observe(s); });
  }

  /* ---------- Лічильники ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (reduceMotion) { el.textContent = target; return; }
    var start = null, dur = 1200;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Іконки людей (8 з 10, 3 з 10) ---------- */
  var personSVG = '<svg viewBox="0 0 40 80" fill="currentColor"><circle cx="20" cy="10" r="9"/><path d="M8 24h24a5 5 0 0 1 5 5v20a3 3 0 0 1-6 0V33h-2v42a4 4 0 0 1-8 0V52h-2v23a4 4 0 0 1-8 0V33H9v16a3 3 0 0 1-6 0V29a5 5 0 0 1 5-5z"/></svg>';
  $$(".people").forEach(function (box) {
    var on = parseInt(box.getAttribute("data-people"), 10);
    var html = "";
    for (var i = 0; i < 10; i++) html += personSVG;
    box.innerHTML = html;
    $$("svg", box).forEach(function (s, i) {
      if (i < on) s.classList.add("on");
      s.style.transitionDelay = (i * 90) + "ms";
    });
  });

  /* ---------- Поява при прокрутці ---------- */
  function activate(el) {
    el.classList.add("is-in");
    $$("[data-count]", el).forEach(function (c) { if (!c.dataset.done) { c.dataset.done = 1; countUp(c); } });
    $$(".people, .bars", el).forEach(function (x) { x.classList.add("is-in"); });
    if (el.contains($("#chatDemo"))) playChat();
  }
  if ("IntersectionObserver" in window && !reduceMotion) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { activate(e.target); obs.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    $$(".reveal").forEach(function (el, i) {
      el.style.transitionDelay = ((i % 4) * 80) + "ms";
      obs.observe(el);
    });
  } else {
    $$(".reveal").forEach(activate);
  }
  /* лічильники в hero стартують одразу */
  $$(".hero [data-count]").forEach(function (c) { c.dataset.done = 1; setTimeout(function () { countUp(c); }, 400); });

  /* ---------- Демо чату ---------- */
  var chatPlayed = false;
  function playChat() {
    if (chatPlayed) return;
    chatPlayed = true;
    var msgs = $$("#chatDemo .chat-demo__msg");
    var typing = $("#chatDemo .chat-demo__typing");
    if (reduceMotion) { msgs.forEach(function (m) { m.classList.add("is-shown"); }); return; }
    var delays = [300, 900, 1900, 3600];
    msgs.forEach(function (m, i) {
      if (m.classList.contains("chat-demo__msg--bot")) {
        setTimeout(function () { typing.classList.add("is-shown"); m.parentNode.insertBefore(typing, m); }, delays[i] - 1200);
      }
      setTimeout(function () {
        if (m.classList.contains("chat-demo__msg--bot")) typing.classList.remove("is-shown");
        m.classList.add("is-shown");
      }, delays[i]);
    });
  }

  /* ---------- Паралакс у hero ---------- */
  var visual = $("#heroVisual");
  if (visual && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    var layers = $$("[data-depth]", visual);
    var hero = $(".hero");
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach(function (l) {
        var d = parseFloat(l.getAttribute("data-depth"));
        l.style.transform = "translate3d(" + (-x * d) + "px," + (-y * d) + "px,0)";
      });
    });
    hero.addEventListener("mouseleave", function () { layers.forEach(function (l) { l.style.transform = ""; }); });
  }

  /* ---------- Відео: завантаження YouTube лише після натискання ---------- */
  var frame = $("#videoFrame");
  $("#videoPlay").addEventListener("click", function () {
    var id = frame.getAttribute("data-id");
    var iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&hl=uk";
    iframe.title = "Відео про ШІ-помічники для підлітків";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    frame.innerHTML = "";
    frame.appendChild(iframe);
  });

  /* ---------- Вкладки ---------- */
  var tabs = $$(".tabs__btn");
  var ink = $(".tabs__ink");
  function moveInk(btn) {
    ink.style.width = btn.offsetWidth + "px";
    ink.style.transform = "translateX(" + (btn.offsetLeft - 6) + "px)";
  }
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (x) {
        var on = x === t;
        x.classList.toggle("is-active", on);
        x.setAttribute("aria-selected", String(on));
        var p = document.getElementById(x.getAttribute("aria-controls"));
        p.hidden = !on;
        p.classList.toggle("is-active", on);
      });
      moveInk(t);
    });
  });
  function inkInit() { moveInk($(".tabs__btn.is-active")); }
  window.addEventListener("resize", inkInit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(inkInit);
  inkInit();

  /* ---------- Лайтбокс ---------- */
  var lb = $("#lightbox"), lbImg = $("#lbImg"), lastFocus = null;
  function openLb(src, alt) {
    lastFocus = document.activeElement;
    lbImg.src = src; lbImg.alt = alt || "";
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    $("#lbClose").focus();
  }
  function closeLb() {
    lb.hidden = true; lbImg.src = "";
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  $$(".zoom").forEach(function (z) {
    z.addEventListener("click", function () {
      var img = $("img", z);
      openLb(z.getAttribute("data-full"), img ? img.alt : "");
    });
  });
  $("#lbClose").addEventListener("click", closeLb);
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !lb.hidden) closeLb(); });

  /* ---------- Фото команди: якщо файлу немає, показуються ініціали ---------- */
  $$(".person__ava img").forEach(function (img) {
    function fail() { img.parentNode.classList.add("is-empty"); img.remove(); }
    if (img.complete && img.naturalWidth === 0) fail();
    else img.addEventListener("error", fail);
  });

  /* ---------- Рік у підвалі ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
