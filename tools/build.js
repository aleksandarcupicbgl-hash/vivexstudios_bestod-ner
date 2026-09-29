#!/usr/bin/env node
/*
 * Besto – Build-Skript (ohne Abhängigkeiten, nur Node.js)
 *
 *   node tools/build.js
 *
 * Erzeugt aus src/*.html die fertigen Seiten im Hauptordner:
 *   index.html, speisekarte.html, impressum.html, datenschutz.html
 * – Kopf-/Fußzeile aus src/partials, Kontaktdaten aus assets/js/config.js
 * – Speisekarte als statisches HTML (für Google) aus assets/js/speisekarte.js
 * – vorschau.html: eine einzige Datei mit allem eingebettet (iPad / Claude-App)
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const rel = (...p) => path.join(ROOT, ...p);
const read = (p) => fs.readFileSync(rel(p), "utf8");

const cfg = require(rel("assets/js/config.js"));
const karte = require(rel("assets/js/speisekarte.js"));
const R = require(rel("assets/js/render.js"));
const icons = JSON.parse(read("src/icons.json"));

const PAGES = [
  { key: "start", file: "index.html", title: "Startseite" },
  { key: "speisekarte", file: "speisekarte.html", title: "Speisekarte" },
  { key: "impressum", file: "impressum.html", title: "Impressum" },
  { key: "datenschutz", file: "datenschutz.html", title: "Datenschutz" }
];

/* ---------- Beliebte Gerichte (Startseite) – Preise kommen aus der Speisekarte ---------- */
const HIGHLIGHTS = [
  { nr: 1, titel: "Döner im Fladenbrot", text: "Der Klassiker – im frisch gebackenen Brot mit Salat, Blaukraut und hausgemachter Soße.", foto: "doener.jpg", label: "Döner" },
  { nr: 8, titel: "Dürüm", text: "Gerollt im dünnen, frisch gebackenen Fladen – perfekt für unterwegs.", foto: "duerum.jpg", label: "Dürüm" },
  { nr: 6, titel: "Döner Box", text: "Mit Pommes, Salat oder Reis – klein oder groß.", foto: "doener-box.jpg", label: "Döner Box" },
  { nr: 16, titel: "Lahmacun", text: "Gerollte türkische Pizza mit würzigem Hackfleisch und frischem Salat.", foto: "lahmacun.jpg", label: "Lahmacun" },
  { nr: 46, titel: "Besto Pizza", text: "Unsere Hausspezialität: Truthahnschinken, Salami, Mais, Ananas, Oliven, Peperoni.", foto: "pizza.jpg", label: "Pizza", tag: "Hausspezialität" },
  { nr: 15, titel: "Falafel Teller", text: "Knusprige Falafel mit Salat, Gurken, Tomaten und Soße – vegetarisch.", foto: "falafel.jpg", label: "Falafel", veg: true }
];

function findDish(nr) {
  for (const k of karte.kategorien) for (const g of k.gerichte) if (g.nr === nr) return g;
  throw new Error("Gericht Nr. " + nr + " nicht in speisekarte.js gefunden");
}

function icon(name) {
  if (!icons[name]) throw new Error("Unbekanntes Icon: " + name);
  return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + icons[name] + "</svg>";
}

function highlightsHtml() {
  return HIGHLIGHTS.map((h, i) => {
    const g = findDish(h.nr);
    const preise = g.preise.filter((p) => p != null);
    const min = Math.min(...preise);
    const price = (preise.length > 1 ? "<small>ab</small> " : "") + R.euro(min);
    const tag = h.tag ? '<span class="badge badge--haus hl-card__tag">' + h.tag + "</span>"
      : h.veg ? '<span class="badge badge--veg hl-card__tag">' + icon("leaf").replace('class="icon"', "") + "vegetarisch</span>" : "";
    return `        <a class="hl-card reveal" style="--d:${(i % 3) * 0.08}s" href="speisekarte.html#g-${h.nr}">
          <div class="hl-card__media">${tag}
            <figure class="ph" data-foto="${h.foto}" data-alt="${R.esc(h.titel)} bei Besto Döner &amp; Pizza in Altötting">
              <figcaption class="ph__label">${icon("camera")}[FOTO: ${h.label}]<small>assets/img/fotos/${h.foto}</small></figcaption>
            </figure>
          </div>
          <div class="hl-card__body">
            <div class="hl-card__top"><h3>${R.esc(h.titel)}</h3><span class="price-tag">${price}</span></div>
            <p>${R.esc(h.text)}</p>
            <span class="hl-card__more">Zur Speisekarte ${icon("arrow")}</span>
          </div>
        </a>`;
  }).join("\n");
}

function offerListHtml() {
  const kat = karte.kategorien.find((k) => k.angebot);
  return kat.gerichte.map((g) =>
    `<li${g.preise[0] < 0 ? ' class="offer__all"' : ""}><span>${R.esc(g.name)}</span><strong>${R.euro(g.preise[0])}</strong></li>`
  ).join("");
}

function isPlaceholder(v) { return /\[[^\]]+\]/.test(String(v)); }
function ph(v) { return isPlaceholder(v) ? '<span class="placeholder">' + R.esc(v) + "</span>" : R.esc(v); }

const jsonSafe = (o) => JSON.stringify(o, null, 2).replace(/</g, "\\u003c");

const VARS = {
  name: R.esc(cfg.name),
  domain: cfg.domain,
  strasse: R.esc(cfg.adresse.strasse),
  plz: cfg.adresse.plz,
  ort: R.esc(cfg.adresse.ort),
  telefon: R.esc(cfg.telefon),
  telefonLink: cfg.telefonLink,
  mapsUrl: R.esc(cfg.mapsUrl),
  instagramUrl: R.esc(cfg.instagram.url),
  instagramName: R.esc(cfg.instagram.name),
  facebookUrl: R.esc(cfg.facebook.url),
  facebookName: R.esc(cfg.facebook.name),
  mittagZeit: R.esc(cfg.mittagsangebot.zeit),
  mittagHinweis: R.esc(cfg.mittagsangebot.hinweis),
  year: String(new Date().getFullYear()),
  "ph:email": ph(cfg.email),
  "ph:inhaber": ph(cfg.inhaber),
  "ph:ustId": cfg.ustId ? ph(cfg.ustId) : "–",
  "ph:stand": ph(cfg.speisekarteStand),
  "ph:liefergebiet": ph(cfg.lieferservice.liefergebiet),
  "ph:mindestbestellwert": ph(cfg.lieferservice.mindestbestellwert),
  "ph:liefergebuehr": ph(cfg.lieferservice.liefergebuehr),
  "ph:lieferzeiten": ph(cfg.lieferservice.zeiten),
  hoursTable: R.renderHoursTable(cfg),
  hoursShort: R.renderHoursShort(cfg),
  menu: R.renderMenu(karte, cfg),
  menuNav: R.renderMenuNav(karte),
  highlights: highlightsHtml(),
  offerList: offerListHtml(),
  jsonld: jsonSafe(R.restaurantSchema(cfg)),
  jsonldMenu: jsonSafe(R.restaurantSchema(cfg, karte))
};

function render(tpl, pageKey) {
  // Partials (dürfen selbst Variablen enthalten)
  tpl = tpl.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, n) => read("src/partials/" + n + ".html").trim());
  return tpl.replace(/\{\{([\w:-]+)\}\}/g, (m, key) => {
    if (key.startsWith("icon:")) return icon(key.slice(5));
    if (key.startsWith("current:")) return key.slice(8) === pageKey ? ' aria-current="page"' : "";
    if (key in VARS) return VARS[key];
    throw new Error("Unbekannte Variable " + m);
  });
}

/* ---------- 1) Seiten bauen ---------- */
const built = {};
for (const p of PAGES) {
  const html = render(read("src/" + p.file), p.key);
  fs.writeFileSync(rel(p.file), html);
  built[p.key] = html;
  console.log("✓ " + p.file);
}

/* ---------- 2) vorschau.html – alles in einer Datei ---------- */
const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".ico": "image/x-icon" };
const dataUri = (file) => "data:" + MIME[path.extname(file).toLowerCase()] + ";base64," + fs.readFileSync(rel(file)).toString("base64");

function inlineAssets(html) {
  return html.replace(/(src|href)="(assets\/img\/[^"]+|favicon\.ico)"/g, (m, attr, file) =>
    fs.existsSync(rel(file)) ? `${attr}="${dataUri(file)}"` : m);
}

function rewriteLinks(html) {
  const map = { "index.html": "seite-start", "speisekarte.html": "seite-speisekarte", "impressum.html": "seite-impressum", "datenschutz.html": "seite-datenschutz" };
  return html.replace(/href="(index|speisekarte|impressum|datenschutz)\.html(#[^"]*)?"/g, (m, page, hash) =>
    'href="' + (hash || "#" + map[page + ".html"]) + '"');
}

function embedPhotos(html) {
  // Bereits vorhandene Fotos direkt einbetten (Vorschau hat keinen Server)
  return html.replace(/<figure class="ph" data-foto="([^"]+)" data-alt="([^"]*)">/g, (m, foto, alt) => {
    const file = "assets/img/fotos/" + foto;
    if (!fs.existsSync(rel(file))) return m;
    return `<figure class="ph has-photo" data-foto="${foto}" data-alt="${alt}"><img src="${dataUri(file)}" alt="${alt}" loading="lazy">`;
  });
}

const mainOf = (html) => html.match(/<main id="inhalt">([\s\S]*?)<\/main>/)[1];
const cut = (html, re) => (html.match(re) || [""])[0];

let css = read("assets/css/style.css").replace(/url\("\.\.\/fonts\/([^"]+)"\)/g, (_, f) => `url("${dataUri("assets/fonts/" + f)}")`);
const js = ["config.js", "render.js", "main.js", "speisekarte.js", "menu.js"].map((f) => read("assets/js/" + f)).join("\n;\n");

const start = built.start;
const headerHtml = cut(start, /<a class="skip-link"[\s\S]*?<\/header>/).replace(' aria-current="page"', "");
const footerHtml = cut(start, /<footer class="site-footer">[\s\S]*?<\/footer>/);
const bottomHtml = cut(start, /<nav class="bottom-bar"[\s\S]*?<\/nav>/);

const nav = PAGES.map((p) => `<a href="#seite-${p.key}">${p.title}</a>`).join(" · ");
let body = `
<div class="preview-bar">Vorschau – alle Seiten untereinander: ${nav}</div>
${headerHtml}
<main id="inhalt">
<div id="seite-start">${mainOf(start)}</div>
<div class="preview-divider" id="seite-speisekarte">Seite: Speisekarte</div>
<div>${mainOf(built.speisekarte)}</div>
<div class="preview-divider" id="seite-impressum">Seite: Impressum</div>
<div>${mainOf(built.impressum)}</div>
<div class="preview-divider" id="seite-datenschutz">Seite: Datenschutz</div>
<div>${mainOf(built.datenschutz)}</div>
</main>
${footerHtml}
${bottomHtml}`;
body = embedPhotos(inlineAssets(rewriteLinks(body)));

const vorschau = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#0e0e0e">
<title>Vorschau – Besto Döner & Pizza Altötting</title>
<link rel="icon" href="${dataUri("assets/img/favicon.png")}">
<style>${css}</style>
</head>
<body class="has-bottom-bar">
${body}
<script>window.BESTO_VORSCHAU = true;</script>
<script>${js.replace(/<\/script/gi, "<\\/script")}</script>
</body>
</html>
`;
fs.writeFileSync(rel("vorschau.html"), vorschau);
console.log("✓ vorschau.html (" + Math.round(vorschau.length / 1024) + " KB)");
