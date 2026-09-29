# Besto Döner & Pizza – Website

Statische Website (HTML, CSS, Vanilla JS) für **Besto Döner & Pizza**, Trostberger Str. 52, 84503 Altötting.
Keine Frameworks, keine Cookies, kein Tracking, Schriften lokal.

## Dateien

| Pfad | Inhalt |
|---|---|
| `index.html` | Startseite |
| `speisekarte.html` | Speisekarte mit Kategorie-Navigation, Filter und Suche |
| `impressum.html`, `datenschutz.html` | Pflichtseiten |
| `vorschau.html` | **Eine** Datei mit allem eingebettet (z. B. fürs iPad) |
| `assets/js/config.js` | **Kontaktdaten, Öffnungszeiten, Platzhalter** |
| `assets/js/speisekarte.js` | **Alle Gerichte und Preise** (einzige Datenquelle) |
| `assets/img/fotos/` | Hier eigene Fotos ablegen |
| `src/` | Vorlagen der Seiten (Kopf-/Fußzeile in `src/partials/`) |
| `tools/build.js` | Baut die fertigen Seiten aus `src/` + Daten |

## Etwas ändern

1. Preise/Gerichte in `assets/js/speisekarte.js` bzw. Daten in `assets/js/config.js` anpassen.
2. `node tools/build.js` ausführen – aktualisiert alle Seiten (inkl. statischer Speisekarte für Google,
   strukturierter Daten und `vorschau.html`).

Texte der Seiten bitte in `src/*.html` ändern (nicht in den erzeugten Dateien im Hauptordner).

## Fotos einsetzen

Einfach Dateien mit diesen Namen in `assets/img/fotos/` legen – sie erscheinen automatisch
(am besten JPG, ca. 1200 × 900 px, 4:3):

`doener.jpg` ✓ · `innenraum.jpg` ✓ · `teller.jpg` ✓ · `duerum.jpg` · `doener-box.jpg` · `lahmacun.jpg` · `pizza.jpg` · `falafel.jpg`

Danach `node tools/build.js`, damit die Fotos auch in `vorschau.html` erscheinen.

## Lokal ansehen

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

## Noch auszufüllen

- [ ] `[ÖFFNUNGSZEITEN]` – in `config.js` (aktuell Beispielwerte!), danach `platzhalter: false`
- [ ] `[INHABER-NAME]`, `[E-MAIL]`, `[USt-IdNr.]` – `config.js` (Impressum/Datenschutz)
- [ ] `[INSTAGRAM-LINK PRÜFEN]` – `besto_imbiss` oder „Bestodönerpizza“?
- [ ] `[FACEBOOK-LINK]` – echte Seiten-URL eintragen (aktuell Facebook-Suche)
- [ ] `[DOMAIN]` – für Canonical-, Open-Graph- und schema.org-Links
- [ ] `[ALLERGEN-LEGENDE]` – `src/speisekarte.html`; Kennzeichnung je Gericht im Feld `allergene`
- [ ] `[DATUM]` – Stand der Speisekarte (`speisekarteStand`)
- [ ] `[GRÖSSE PRÜFEN]` – Red Bull
- [ ] `[HOSTING-ANBIETER]` – `src/datenschutz.html`
- [ ] `[FOTO: …]` – siehe oben
- [ ] `[REZENSION 2/3]` – Google-Rezensionen in `config.js` → `bewertungen.liste` eintragen
- [ ] Speisekarte Nr. 18–19 fehlen noch
- [ ] Lieferservice? Falls ja: `lieferservice.aktiv = true` + Werte in `config.js`
