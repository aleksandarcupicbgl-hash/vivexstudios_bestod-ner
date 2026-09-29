/* Besto – allgemeine Funktionen für alle Seiten */
(function () {
  "use strict";
  var doc = document.documentElement;
  var cfg = window.BESTO_CONFIG;
  var R = window.BESTO_RENDER;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Jahr im Footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Header-Schatten beim Scrollen ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Öffnungszeiten: Jetzt geöffnet / geschlossen ---------- */
  function berlinNow() {
    // Uhrzeit immer in Altötting (Europe/Berlin), egal wo das Gerät steht
    try {
      var parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false })
        .formatToParts(new Date());
      var o = {};
      parts.forEach(function (p) { o[p.type] = p.value; });
      var idx = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(o.weekday);
      return { day: idx, min: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
    } catch (e) {
      var d = new Date();
      return { day: (d.getDay() + 6) % 7, min: d.getHours() * 60 + d.getMinutes() };
    }
  }
  function toMin(t) { var p = t.split(":"); return parseInt(p[0], 10) * 60 + parseInt(p[1], 10); }

  function openState() {
    var tage = cfg.oeffnungszeiten.tage, now = berlinNow(), today = tage[now.day];
    var state = { day: now.day, open: false, until: null, next: null, nextDay: null, todayClose: null };
    today.zeiten.forEach(function (z) {
      var a = toMin(z[0]), b = toMin(z[1]);
      if (b <= a) b += 24 * 60; // nach Mitternacht
      if (now.min >= a && now.min < b) { state.open = true; state.until = z[1]; }
      if (now.min < a && !state.next) state.next = z[0];
      state.todayClose = z[1];
    });
    // Gestern bis nach Mitternacht geöffnet?
    if (!state.open) {
      var y = tage[(now.day + 6) % 7];
      y.zeiten.forEach(function (z) {
        var a = toMin(z[0]), b = toMin(z[1]);
        if (b <= a && now.min < b) { state.open = true; state.until = z[1]; }
      });
    }
    if (!state.open && !state.next) {
      for (var i = 1; i <= 7; i++) {
        var t = tage[(now.day + i) % 7];
        if (t.zeiten.length) { state.next = t.zeiten[0][0]; state.nextDay = i === 1 ? "morgen" : t.tag; break; }
      }
    }
    return state;
  }

  if (cfg && cfg.oeffnungszeiten) {
    var st = openState();
    var todayZeiten = cfg.oeffnungszeiten.tage[st.day].zeiten;
    var statusText = st.open
      ? "Jetzt geöffnet · bis " + st.until + " Uhr"
      : "Jetzt geschlossen" + (st.next ? " · öffnet " + (st.nextDay ? st.nextDay + " " : "") + "um " + st.next + " Uhr" : "");
    var todayText = !todayZeiten.length ? "Heute Ruhetag"
      : st.open ? "Heute geöffnet bis " + st.until + " Uhr"
      : st.next && !st.nextDay ? "Heute geöffnet ab " + st.next + " Uhr"
      : "Heute geöffnet bis " + st.todayClose + " Uhr";

    document.querySelectorAll("[data-open-status]").forEach(function (el) {
      el.classList.add(st.open ? "is-open" : "is-closed");
      var t = el.querySelector("[data-open-text]") || el;
      t.textContent = statusText;
    });
    document.querySelectorAll("[data-today]").forEach(function (el) {
      el.classList.add(st.open ? "is-open" : "is-closed");
      var t = el.querySelector("[data-today-text]") || el;
      t.textContent = todayText;
    });
    document.querySelectorAll(".hours tr[data-day='" + st.day + "']").forEach(function (tr) {
      tr.classList.add("is-today");
      tr.setAttribute("aria-current", "date");
    });
  }

  /* ---------- Lieferservice nur zeigen, wenn aktiv ---------- */
  if (cfg && cfg.lieferservice && cfg.lieferservice.aktiv) {
    document.querySelectorAll("[data-delivery]").forEach(function (el) { el.hidden = false; });
  }

  /* ---------- Fotos: einfach Datei in assets/img/fotos/ legen ---------- */
  if (!window.BESTO_VORSCHAU) {
    document.querySelectorAll(".ph[data-foto]").forEach(function (ph) {
      var img = new Image();
      img.alt = ph.getAttribute("data-alt") || "";
      img.loading = "lazy";
      img.decoding = "async";
      img.onload = function () { ph.appendChild(img); ph.classList.add("has-photo"); };
      img.src = "assets/img/fotos/" + ph.getAttribute("data-foto");
    });
  }

  /* ---------- Sanfte Einblend-Animationen ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    doc.classList.add("js");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  window.BESTO_UTIL = { openState: openState, reduceMotion: reduceMotion, R: R };
})();
