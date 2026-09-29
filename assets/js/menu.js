/* Besto – Speisekarte: Rendern aus speisekarte.js, Kategorie-Navigation, Filter & Suche */
(function () {
  "use strict";
  var karte = window.BESTO_SPEISEKARTE, R = window.BESTO_RENDER, cfg = window.BESTO_CONFIG;
  var list = document.getElementById("menu-list");
  var nav = document.getElementById("menu-nav");
  if (!list || !karte || !R) return;

  // Aus der Datendatei neu rendern (identisch zur statischen Version für Google)
  list.innerHTML = R.renderMenu(karte, cfg);
  if (nav) nav.innerHTML = R.renderMenuNav(karte);

  var reduceMotion = window.BESTO_UTIL && window.BESTO_UTIL.reduceMotion;
  var dishes = Array.prototype.slice.call(list.querySelectorAll(".dish"));
  var cats = Array.prototype.slice.call(list.querySelectorAll(".menu-cat"));
  var chips = nav ? Array.prototype.slice.call(nav.querySelectorAll("[data-nav]")) : [];
  var search = document.getElementById("menu-search");
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var status = document.getElementById("menu-status");
  var empty = document.getElementById("menu-empty");
  var filter = "alle";

  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss");
  }
  dishes.forEach(function (d) { d._search = norm(d.getAttribute("data-search")); });

  function apply() {
    var q = norm(search ? search.value.trim() : "");
    var terms = q ? q.split(/\s+/) : [];
    var count = 0;
    dishes.forEach(function (d) {
      var typ = d.getAttribute("data-typ");
      var okFilter = filter === "alle" || typ === filter;
      var okSearch = terms.every(function (t) { return d._search.indexOf(t) > -1; });
      var show = okFilter && okSearch;
      d.hidden = !show;
      if (show) count++;
    });
    var active = filter !== "alle" || terms.length > 0;
    cats.forEach(function (c) {
      var visible = c.querySelectorAll(".dish:not([hidden])").length;
      c.hidden = visible === 0;
      var chip = nav && nav.querySelector('[data-nav="' + c.id + '"]');
      if (chip) chip.hidden = visible === 0;
    });
    if (empty) empty.hidden = count !== 0;
    if (status) status.textContent = active ? count + (count === 1 ? " Gericht gefunden" : " Gerichte gefunden") : "";
    spy();
  }

  filterBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      filter = b.getAttribute("data-filter");
      filterBtns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      apply();
    });
  });
  if (search) {
    search.addEventListener("input", apply);
    search.addEventListener("keydown", function (e) { if (e.key === "Escape") { search.value = ""; apply(); } });
  }
  var reset = document.getElementById("menu-reset");
  if (reset) reset.addEventListener("click", function () {
    if (search) search.value = "";
    filter = "alle";
    filterBtns.forEach(function (x) { x.setAttribute("aria-pressed", String(x.getAttribute("data-filter") === "alle")); });
    apply();
  });

  /* ---------- Aktive Kategorie markieren (Scrollspy) ---------- */
  var current = null;
  function setActive(id) {
    if (id === current || !nav) return;
    current = id;
    chips.forEach(function (c) {
      var on = c.getAttribute("data-nav") === id;
      if (on) {
        c.setAttribute("aria-current", "true");
        // Chip-Leiste horizontal mitscrollen (nicht die Seite)
        if (nav.scrollWidth > nav.clientWidth) {
          var left = nav.scrollLeft + (c.getBoundingClientRect().left - nav.getBoundingClientRect().left) - (nav.clientWidth - c.offsetWidth) / 2;
          nav.scrollTo({ left: left, behavior: reduceMotion ? "auto" : "smooth" });
        }
      } else c.removeAttribute("aria-current");
    });
  }
  function spy() {
    var line = window.innerHeight * 0.3, active = null;
    for (var i = 0; i < cats.length; i++) {
      if (cats[i].hidden) continue;
      if (cats[i].getBoundingClientRect().top <= line) active = cats[i].id;
      else if (!active) { active = cats[i].id; break; }
      else break;
    }
    if (active) setActive(active);
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { spy(); ticking = false; }); }
  }, { passive: true });
  window.addEventListener("resize", spy);
  spy();

  /* ---------- Direktlink auf ein Gericht (#g-46) hervorheben ---------- */
  function flashHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!/^g-/.test(id)) return;
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
    el.classList.remove("is-flash"); void el.offsetWidth; el.classList.add("is-flash");
  }
  window.addEventListener("hashchange", flashHash);
  if (location.hash) setTimeout(flashHash, 60);
})();
