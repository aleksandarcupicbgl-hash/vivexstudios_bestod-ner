/*
 * ============================================================
 *  BESTO – SPEISEKARTE (einzige Datenquelle für alle Gerichte)
 * ============================================================
 *  Preise und Gerichte NUR HIER ändern. Danach:  node tools/build.js
 *
 *  Felder pro Gericht:
 *    nr        Nummer auf der Karte (oder null)
 *    name      Name des Gerichts
 *    zutaten   Zutaten / Beschreibung (klein darunter)
 *    preise    Liste von Preisen in Euro (Zahl) – Reihenfolge wie
 *              "spalten" der Kategorie; null = Größe nicht erhältlich („–“)
 *    labels    (optional) eigene Preis-Beschriftungen, z. B. ["klein","groß"]
 *    typ       "veg" (vegetarisch) | "fleisch" | "fisch" | null
 *    badges    (optional) "frisch", "xl", "haus"
 *    stichworte (optional) zusätzliche Suchbegriffe, z. B. "Döner"
 *    allergene Kennzeichnung Allergene/Zusatzstoffe, z. B. "a, c, 3"
 *              → [ALLERGEN-LEGENDE] noch offen, daher vorerst leer
 * ============================================================
 */
(function (root) {
  var BELAG = "Fleisch, Salat, Zwiebeln, Blaukraut, Tomaten, Soße";

  var speisekarte = {
    kategorien: [
      {
        id: "doener",
        titel: "Türkische Spezialitäten",
        nav: "Türkische Spezialitäten",
        intro: "Mit Hähnchen-Puten-Drehspießfleisch. Unser Döner- und Dürümbrot wird bei jeder Bestellung frisch gebacken!",
        gerichte: [
          { nr: 1,  name: "Hähnchen-Puten-Drehspießfleisch im Fladenbrot", stichworte: "Döner", zutaten: BELAG, preise: [7.00], typ: "fleisch", badges: ["frisch"], allergene: "" },
          { nr: 2,  name: "Hähnchen-Puten-Drehspießfleisch XL im Fladenbrot", stichworte: "Döner", zutaten: BELAG, preise: [9.00], typ: "fleisch", badges: ["frisch", "xl"], allergene: "" },
          { nr: 3,  name: "Hähnchen-Puten-Drehspießfleisch im Fladenbrot & Käse", stichworte: "Döner", zutaten: BELAG, preise: [7.50], typ: "fleisch", badges: ["frisch"], allergene: "" },
          { nr: 4,  name: "Hähnchen-Puten-Drehspießfleisch mit Pommes im Fladenbrot", stichworte: "Döner", zutaten: BELAG, preise: [7.50], typ: "fleisch", badges: ["frisch"], allergene: "" },
          { nr: 5,  name: "Vegetarisches im Fladenbrot", zutaten: "Käse, Salat, Zwiebeln, Blaukraut, Tomaten, Soße", preise: [6.50], typ: "veg", badges: ["frisch"], allergene: "" },
          { nr: 6,  name: "Hähnchen-Puten-Drehspießfleisch – Box", stichworte: "Döner", zutaten: "mit Pommes oder Salat oder Reis · " + BELAG, preise: [6.50, 7.50], labels: ["klein", "groß"], typ: "fleisch", allergene: "" },
          { nr: 7,  name: "Hähnchen-Puten-Drehspießfleisch – Teller", stichworte: "Döner", zutaten: "mit Pommes oder Fladenbrot oder Reis · " + BELAG, preise: [11.00], typ: "fleisch", allergene: "" },
          { nr: 8,  name: "Dürüm (gerollt) mit Hähnchen-Puten-Drehspießfleisch", zutaten: BELAG, preise: [7.50], typ: "fleisch", badges: ["frisch"], allergene: "" },
          { nr: 9,  name: "Dürüm (gerollt) mit Hähnchen-Puten-Drehspießfleisch XL", zutaten: BELAG, preise: [9.50], typ: "fleisch", badges: ["frisch", "xl"], allergene: "" },
          { nr: 10, name: "Dürüm (gerollt) mit Hähnchen-Puten-Drehspießfleisch & Käse", zutaten: "Fleisch, Käse, Salat, Zwiebeln, Blaukraut, Tomaten, Soße", preise: [8.00], typ: "fleisch", badges: ["frisch"], allergene: "" },
          { nr: 11, name: "Pomm Dürüm (gerollt) mit Hähnchen-Puten-Drehspießfleisch & Pommes", zutaten: "Fleisch, Käse, Salat, Zwiebeln, Blaukraut, Tomaten, Soße", preise: [8.00], typ: "fleisch", badges: ["frisch"], allergene: "" },
          { nr: 12, name: "Vegetarisches Dürüm (gerollt)", zutaten: "Käse, Salat, Zwiebeln, Blaukraut, Tomaten, Soße", preise: [7.00], typ: "veg", badges: ["frisch"], allergene: "" },
          { nr: 13, name: "Falafel Döner", zutaten: "Salat, Zwiebeln, Blaukraut, Tomaten, Soße", preise: [6.00], typ: "veg", badges: ["frisch"], allergene: "" },
          { nr: 14, name: "Falafel Dürüm", zutaten: "Salat, Zwiebeln, Kraut, Gurken, Tomaten, Soße", preise: [6.50], typ: "veg", badges: ["frisch"], allergene: "" },
          { nr: 15, name: "Falafel Teller", zutaten: "Salat, Zwiebeln, Kraut, Gurken, Tomaten, Soße", preise: [8.00], typ: "veg", badges: ["frisch"], allergene: "" },
          { nr: 16, name: "Lahmacun mit Salat", zutaten: "gerollte türkische Pizza · Hackfleisch, Salat, Zwiebeln, Blaukraut, Tomaten, Soße", preise: [8.00], typ: "fleisch", allergene: "" },
          { nr: 17, name: "Lahmacun mit Hähnchen-Puten-Drehspießfleisch", zutaten: "gerollte türkische Pizza · Fleisch, Hackfleisch, Salat, Zwiebeln, Blaukraut, Tomaten, Soße", preise: [9.00], typ: "fleisch", allergene: "" }
          // Nr. 18–19 folgen
        ]
      },
      {
        id: "pizza",
        titel: "Pizza",
        nav: "Pizza",
        intro: "Alle Pizzen mit Tomatensoße und Käse.",
        spalten: ["28 cm", "32 cm", "50 cm"],
        gerichte: [
          { nr: 20, name: "Pizzabrot", zutaten: "mit Knoblauchöl", preise: [5.00, 6.00, null], typ: "veg", allergene: "" },
          { nr: 21, name: "Margherita", zutaten: "Tomatensoße, Käse", preise: [7.00, 9.00, 18.00], typ: "veg", allergene: "" },
          { nr: 22, name: "Peperoni", zutaten: "Peperoni", preise: [7.50, 10.00, 18.00], typ: "veg", allergene: "" },
          { nr: 23, name: "Funghi", zutaten: "Champignons", preise: [7.50, 10.00, 18.00], typ: "veg", allergene: "" },
          { nr: 24, name: "Prosciutto", zutaten: "Truthahnschinken", preise: [7.50, 10.00, 18.00], typ: "fleisch", allergene: "" },
          { nr: 25, name: "Salami", zutaten: "Salami", preise: [7.50, 10.00, 18.00], typ: "fleisch", allergene: "" },
          { nr: 26, name: "Sucuk", zutaten: "Knoblauchwurst", preise: [8.50, 11.50, 20.00], typ: "fleisch", allergene: "" },
          { nr: 27, name: "Regina", zutaten: "Truthahnschinken, Champignons", preise: [8.00, 11.00, 20.00], typ: "fleisch", allergene: "" },
          { nr: 28, name: "Mario", zutaten: "Salami, Peperoni", preise: [8.00, 11.00, 20.00], typ: "fleisch", allergene: "" },
          { nr: 29, name: "Capri", zutaten: "Truthahnschinken, Salami", preise: [8.00, 11.00, 20.00], typ: "fleisch", allergene: "" },
          { nr: 30, name: "Hawaii", zutaten: "Truthahnschinken, Ananas", preise: [8.50, 11.00, 20.00], typ: "fleisch", allergene: "" },
          { nr: 31, name: "Tonno", zutaten: "Thunfisch, Zwiebeln", preise: [8.00, 11.00, 20.00], typ: "fisch", allergene: "" },
          { nr: 32, name: "Spinat", zutaten: "Spinat, Eier", preise: [8.50, 11.00, 20.00], typ: "veg", allergene: "" },
          { nr: 33, name: "Diablo", zutaten: "scharfe Salami, Oliven", preise: [8.00, 11.00, 20.00], typ: "fleisch", allergene: "" },
          { nr: 34, name: "Mozzarella", zutaten: "frische Tomaten, Mozzarella", preise: [8.00, 11.50, 20.00], typ: "veg", allergene: "" },
          { nr: 35, name: "Calzone", zutaten: "Truthahnschinken, Salami, Champignons", preise: [8.50, 12.00, null], typ: "fleisch", allergene: "" },
          { nr: 36, name: "Krabben", zutaten: "Krabben, Knoblauchsoße", preise: [9.00, 12.00, 21.00], typ: "fisch", allergene: "" },
          { nr: 37, name: "Frutti di Mare", zutaten: "Meeresfrüchte, Knoblauchsoße", preise: [9.00, 12.00, 21.00], typ: "fisch", allergene: "" },
          { nr: 38, name: "Americana", zutaten: "Truthahnschinken, Salami, Mais", preise: [9.00, 11.50, 20.50], typ: "fleisch", allergene: "" },
          { nr: 39, name: "Quattro Stagioni", zutaten: "Truthahnschinken, Salami, Champignons, Peperoni", preise: [9.00, 12.50, 21.00], typ: "fleisch", allergene: "" },
          { nr: 40, name: "Quattro Formaggi", zutaten: "vier Käsesorten", preise: [9.00, 12.50, 21.00], typ: "veg", allergene: "" },
          { nr: 41, name: "Mexikana", zutaten: "Truthahnschinken, Salami, Champignons, Peperoni, Zwiebeln, Artischocken, Chili", preise: [9.50, 13.50, 22.00], typ: "fleisch", allergene: "" },
          { nr: 42, name: "Pizza Futura", zutaten: "gemischtes Gemüse", preise: [9.00, 11.00, 20.00], typ: "veg", allergene: "" },
          { nr: 43, name: "Pizza Con Alio", zutaten: "Mozzarella, frische Tomatenscheiben, Zwiebeln, Knoblauch", preise: [9.00, 11.50, 21.00], typ: "veg", allergene: "" },
          { nr: 44, name: "Pizza Gorgonzola", zutaten: "Salami, Gorgonzola", preise: [9.00, 11.00, 20.00], typ: "fleisch", allergene: "" },
          { nr: 45, name: "Pizza Estate", zutaten: "Mozzarella, Rucola, Mais, frische Tomatenscheiben", preise: [9.00, 11.00, 20.00], typ: "veg", allergene: "" },
          { nr: 46, name: "Besto Pizza", zutaten: "Truthahnschinken, Salami, Mais, Ananas, Oliven, Peperoni", preise: [9.50, 11.00, 21.00], typ: "fleisch", badges: ["haus"], allergene: "" },
          { nr: 47, name: "Calzone Döner", zutaten: "Hähnchen-Puten-Drehspießfleisch, Käse, Zwiebeln", preise: [10.50, 12.00, null], typ: "fleisch", allergene: "" },
          { nr: 48, name: "Döner Pizza", zutaten: "Hähnchen-Puten-Drehspießfleisch, Zwiebeln, Peperoni", preise: [9.00, 12.00, 22.00], typ: "fleisch", allergene: "" },
          { nr: 49, name: "Sucuk 1", zutaten: "Knoblauchwurst, Eier", preise: [9.00, 11.50, 22.00], typ: "fleisch", allergene: "" },
          { nr: 50, name: "Olandese", zutaten: "Truthahnschinken, Brokkoli, Hollandaise-Sauce", preise: [9.00, 11.00, 22.00], typ: "fleisch", allergene: "" }
        ],
        extras: [
          { name: "Jede extra Zutat", preise: [0.50, 1.00, 2.00] }
        ]
      },
      {
        id: "nudeln",
        titel: "Spaghetti / Rigatoni",
        nav: "Spaghetti / Rigatoni",
        intro: "Wahlweise mit Spaghetti oder Rigatoni.",
        gerichte: [
          { nr: 60, name: "Napoli", zutaten: "Tomatensoße", preise: [7.00], typ: "veg", allergene: "" },
          { nr: 61, name: "Futura", zutaten: "frische Paprika, Champignons, Oliven, Tomaten, Sahnesauce", preise: [8.00], typ: "veg", allergene: "" },
          { nr: 62, name: "Aglio e Olio", zutaten: "Öl, Knoblauch, Petersilie, Peperoni", preise: [8.00], typ: "veg", allergene: "" },
          { nr: 63, name: "Gorgonzola", zutaten: "Gorgonzola und Sahnesoße", preise: [8.50], typ: "veg", allergene: "" },
          { nr: 64, name: "Quattro Formaggi", zutaten: "4 verschiedene Käsesorten", preise: [9.00], typ: "veg", allergene: "" },
          { nr: 65, name: "Frutti di Mare", zutaten: "Meeresfrüchte, Tomatensauce", preise: [9.00], typ: "fisch", allergene: "" },
          { nr: 66, name: "Carbonara", zutaten: "Truthahnschinken, Ei, Parmesan in Sahnesoße", preise: [8.00], typ: "fleisch", allergene: "" },
          { nr: 67, name: "Tonno", zutaten: "Thunfisch, Zwiebeln, Tomatensauce", preise: [8.00], typ: "fisch", allergene: "" },
          { nr: 68, name: "Tonno 1", zutaten: "Thunfisch, Zwiebeln, Sahnesoße", preise: [8.00], typ: "fisch", allergene: "" },
          { nr: 69, name: "Döner Nudeln", zutaten: "Hähnchen-Puten, Tomatensauce, Sahnesoße, Paprika, Oliven", preise: [8.00], typ: "fleisch", allergene: "" }
        ],
        extras: [
          { name: "… mit Käse überbacken", preise: [1.00], plus: true }
        ]
      },
      {
        id: "salate",
        titel: "Salate",
        nav: "Salate",
        intro: "Knackig frisch – klein oder groß.",
        spalten: ["klein", "groß"],
        gerichte: [
          { nr: 101, name: "Gemischter Salat", zutaten: "Eisbergsalat, Paprika, Tomaten, Gurken, Zwiebeln, Blaukraut, Peperoni", preise: [5.00, 6.00], typ: "veg", allergene: "" },
          { nr: 102, name: "Salat mit Hähnchen-Puten-Drehspießfleisch", zutaten: "Fleisch, Eisbergsalat, Paprika, Tomaten, Gurken, Zwiebeln, Blaukraut, Peperoni", preise: [7.50, 9.00], typ: "fleisch", allergene: "" },
          { nr: 103, name: "Hirtensalat", zutaten: "Eisbergsalat, Paprika, Tomaten, Gurken, Zwiebeln, Käse, Oliven", preise: [6.50, 8.00], typ: "veg", allergene: "" },
          { nr: 104, name: "Thunfischsalat", zutaten: "Thunfisch, Eisbergsalat, Paprika, Tomaten, Gurken, Zwiebeln", preise: [6.50, 8.00], typ: "fisch", allergene: "" },
          { nr: 105, name: "Meeresfrüchtesalat", zutaten: "Meeresfrüchte, Eisbergsalat, Paprika, Tomaten, Gurken, Zwiebeln", preise: [7.50, 10.00], typ: "fisch", allergene: "" },
          { nr: 106, name: "Mozzarellasalat", zutaten: "Mozzarella, Tomaten, Zwiebeln, Oliven, Öl, Balsamico", preise: [6.00, 8.00], typ: "veg", allergene: "" }
        ]
      },
      {
        id: "getraenke",
        titel: "Getränke",
        nav: "Getränke",
        intro: "Preise zzgl. Pfand.",
        gerichte: [
          { nr: 110, name: "Coca-Cola, Coca-Cola Light", zutaten: "0,33 l", preise: [2.00], typ: null, allergene: "" },
          { nr: 111, name: "Fanta, Sprite, Mezzo Mix", zutaten: "0,33 l", preise: [2.00], typ: null, allergene: "" },
          { nr: 112, name: "Mineralwasser (ohne Kohlensäure)", zutaten: "0,5 l", preise: [1.50], typ: null, allergene: "" },
          { nr: 113, name: "Red Bull", zutaten: "[GRÖSSE PRÜFEN]", preise: [2.50], typ: null, allergene: "" },
          { nr: 114, name: "Uludağ", zutaten: "türkische Zitronenlimo · 0,33 l", preise: [2.00], typ: null, allergene: "" },
          { nr: 115, name: "Ayran", zutaten: "Joghurt-Wasser-Erfrischungsgetränk · 0,25 l", preise: [1.50], typ: null, allergene: "" },
          { nr: 116, name: "Eistee Pfirsich", zutaten: "0,5 l", preise: [2.00], typ: null, allergene: "" }
        ]
      },
      {
        id: "mittag",
        titel: "Mittags-Angebot",
        nav: "Mittagsangebot",
        intro: "Täglich 11:00–14:00 Uhr – nur bei Selbstabholung.",
        angebot: true,
        gerichte: [
          { nr: null, name: "Döner", zutaten: "im frisch gebackenen Fladenbrot", preise: [6.50], typ: "fleisch", allergene: "" },
          { nr: null, name: "Dürüm", zutaten: "gerollt", preise: [7.00], typ: "fleisch", allergene: "" },
          { nr: null, name: "Döner Box groß", zutaten: "mit Pommes, Salat oder Reis", preise: [7.00], typ: "fleisch", allergene: "" },
          { nr: null, name: "Alle Pizzen", zutaten: "jede Pizza 1,00 € günstiger", preise: [-1.00], typ: null, allergene: "" }
        ]
      }
    ]
  };

  if (typeof module !== "undefined" && module.exports) module.exports = speisekarte;
  else root.BESTO_SPEISEKARTE = speisekarte;
})(this);
