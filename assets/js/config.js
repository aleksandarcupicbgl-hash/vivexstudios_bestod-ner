/*
 * ============================================================
 *  BESTO DÖNER & PIZZA – zentrale Einstellungen
 * ============================================================
 *  Alles, was mit [ECKIGEN KLAMMERN] markiert ist, ist noch ein
 *  PLATZHALTER und muss vor der Veröffentlichung ausgefüllt werden.
 *
 *  Nach Änderungen einmal ausführen:   node tools/build.js
 *  (aktualisiert Kopf-/Fußzeile, Öffnungszeiten, statische
 *   Speisekarte für Google und die Datei vorschau.html)
 * ============================================================
 */
(function (root) {
  var config = {
    name: "Besto Döner & Pizza",
    domain: "https://[DOMAIN]", // z. B. "https://www.besto-altoetting.de" – ohne Schrägstrich am Ende

    adresse: {
      strasse: "Trostberger Str. 52",
      plz: "84503",
      ort: "Altötting",
      land: "DE"
    },

    telefon: "0160 4187229",          // Anzeige
    telefonLink: "tel:+491604187229", // Link zum Anrufen

    email: "[E-MAIL]",
    inhaber: "[INHABER-NAME]",
    ustId: "[USt-IdNr.]", // leer lassen ("") falls nicht vorhanden

    instagram: {
      name: "besto_imbiss",
      url: "https://www.instagram.com/besto_imbiss/", // [INSTAGRAM-LINK PRÜFEN] – auf der Karte steht „Bestodönerpizza“
      platzhalter: true
    },
    facebook: {
      name: "Besto Döner & Pizza",
      url: "https://www.facebook.com/search/top?q=Besto%20D%C3%B6ner%20%26%20Pizza%20Alt%C3%B6tting", // [FACEBOOK-LINK] – echte Seiten-URL eintragen
      platzhalter: true
    },

    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Trostberger+Str.+52+84503+Alt%C3%B6tting",

    /*
     * [ÖFFNUNGSZEITEN] – BEISPIELWERTE, bitte ersetzen!
     * Pro Tag eine Liste von Zeitfenstern ["von", "bis"].
     * Ruhetag = leere Liste [].  Mittagspause = zwei Fenster, z. B.
     *   [["11:00", "14:00"], ["17:00", "22:00"]]
     * Wenn alles stimmt: platzhalter auf false setzen.
     */
    oeffnungszeiten: {
      platzhalter: true,
      tage: [
        { tag: "Montag",     kurz: "Mo", zeiten: [["11:00", "22:00"]] },
        { tag: "Dienstag",   kurz: "Di", zeiten: [["11:00", "22:00"]] },
        { tag: "Mittwoch",   kurz: "Mi", zeiten: [["11:00", "22:00"]] },
        { tag: "Donnerstag", kurz: "Do", zeiten: [["11:00", "22:00"]] },
        { tag: "Freitag",    kurz: "Fr", zeiten: [["11:00", "23:00"]] },
        { tag: "Samstag",    kurz: "Sa", zeiten: [["11:00", "23:00"]] },
        { tag: "Sonntag",    kurz: "So", zeiten: [["12:00", "22:00"]] }
      ]
    },

    mittagsangebot: {
      zeit: "11:00–14:00 Uhr",
      hinweis: "nur bei Selbstabholung"
    },

    /*
     * FRAGE AN DICH: Gibt es einen Lieferservice?
     * Falls ja: aktiv auf true setzen und Werte eintragen –
     * dann erscheint auf der Startseite automatisch ein Abschnitt dazu.
     */
    lieferservice: {
      aktiv: false,
      liefergebiet: "[LIEFERGEBIET]",
      mindestbestellwert: "[MINDESTBESTELLWERT]",
      liefergebuehr: "[LIEFERGEBÜHR]",
      zeiten: "[LIEFERZEITEN]"
    },

    /*
     * Google-Bewertungen (Stand laut Google-Profil). Werte bei Bedarf aktualisieren.
     * Rezensionen: nur mit Einverständnis bzw. als Zitat mit Quelle verwenden,
     * Name am besten abgekürzt (Vorname + Initial).
     * Leere/Platzhalter-Einträge (platzhalter: true) werden markiert angezeigt.
     */
    bewertungen: {
      schnitt: 4.6,
      anzahl: 195,
      url: "https://www.google.com/maps/search/?api=1&query=Besto+D%C3%B6ner+%26+Pizza+Trostberger+Str.+52+Alt%C3%B6tting",
      stichworte: ["Zutaten", "perfekt", "Dönerladen", "Bestellung"],
      liste: [
        {
          name: "Richard S.",
          sterne: 5,
          datum: "vor 6 Monaten",
          art: "Verzehr im Restaurant",
          text: "Sehr guter Döner. Geschmacklich top – saftiges Fleisch, frische Zutaten und insgesamt sehr stimmig. Auch optisch macht der Döner einiges her …"
        },
        { name: "[NAME]", sterne: 5, datum: "", art: "", text: "[REZENSION 2 – folgt]", platzhalter: true },
        { name: "[NAME]", sterne: 5, datum: "", art: "", text: "[REZENSION 3 – folgt]", platzhalter: true }
      ]
    },

    speisekarteStand: "[DATUM]" // z. B. "Oktober 2026"
  };

  if (typeof module !== "undefined" && module.exports) module.exports = config;
  else root.BESTO_CONFIG = config;
})(this);
