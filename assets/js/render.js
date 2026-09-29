/*
 * Gemeinsame Render-Funktionen – laufen im Browser UND im Build-Skript
 * (tools/build.js), damit die statische HTML-Speisekarte für Google
 * exakt der dynamisch gerenderten entspricht.
 */
(function (root) {
  var ICON = {
    leaf: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14Z"/><path d="M5 19 13 11"/></svg>',
    fish: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 12c3-4 7-6 11-6 3 0 5 2 7 6-2 4-4 6-7 6-4 0-8-2-11-6Z"/><path d="M3 12 1 8m2 4-2 4"/><circle cx="16" cy="11" r=".6"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/></svg>'
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function euro(v) {
    if (v == null) return "–";
    var neg = v < 0;
    var s = Math.abs(v).toFixed(2).replace(".", ",") + " €";
    return neg ? "−" + s : s;
  }

  function badgesHtml(g) {
    var out = [];
    (g.badges || []).forEach(function (b) {
      if (b === "frisch") out.push('<span class="badge badge--frisch">Frisch!</span>');
      if (b === "xl") out.push('<span class="badge badge--xl">XL</span>');
      if (b === "haus") out.push('<span class="badge badge--haus">' + ICON.star + "Hausspezialität</span>");
    });
    if (g.typ === "veg") out.push('<span class="badge badge--veg">' + ICON.leaf + "vegetarisch</span>");
    if (g.typ === "fisch") out.push('<span class="badge badge--fisch">' + ICON.fish + "Fisch</span>");
    return out.length ? '<div class="dish__badges">' + out.join("") + "</div>" : "";
  }

  function searchText(g, kat) {
    return [g.nr, g.name, g.zutaten, g.stichworte, kat.titel].join(" ").toLowerCase();
  }

  function dishHtml(g, kat) {
    var labels = g.labels || kat.spalten;
    var multi = g.preise.length > 1;
    var id = g.nr != null ? ' id="g-' + g.nr + '"' : "";
    var h = "";
    h += '<article class="dish' + (g.badges && g.badges.indexOf("haus") > -1 ? " dish--haus" : "") + '"' + id +
      ' data-typ="' + esc(g.typ || "") + '" data-search="' + esc(searchText(g, kat)) + '">';
    h += '<div class="dish__head">';
    if (g.nr != null) h += '<span class="dish__nr" aria-label="Nummer ' + g.nr + '">' + g.nr + "</span>";
    h += '<h3 class="dish__name">' + esc(g.name) + "</h3>";
    if (!multi) h += '<span class="dish__price">' + euro(g.preise[0]) + "</span>";
    h += "</div>";
    if (g.zutaten) h += '<p class="dish__desc">' + esc(g.zutaten) + "</p>";
    h += badgesHtml(g);
    if (multi) {
      h += '<ul class="prices prices--' + g.preise.length + '">';
      g.preise.forEach(function (p, i) {
        h += '<li class="' + (p == null ? "is-na" : "") + '"><span>' + esc(labels ? labels[i] : "") + "</span><strong>" +
          (p == null ? '–<span class="sr-only"> nicht erhältlich</span>' : euro(p)) + "</strong></li>";
      });
      h += "</ul>";
    }
    h += '<p class="dish__allergene"' + (g.allergene ? "" : " hidden") + ">Allergene/Zusatzstoffe: " + esc(g.allergene) + "</p>";
    h += "</article>";
    return h;
  }

  function renderMenu(karte, config) {
    var h = "";
    karte.kategorien.forEach(function (kat) {
      h += '<section class="menu-cat' + (kat.angebot ? " menu-cat--angebot" : "") + '" id="' + kat.id + '" data-cat="' + kat.id + '" aria-labelledby="h-' + kat.id + '">';
      h += '<header class="menu-cat__head"><h2 id="h-' + kat.id + '">' + esc(kat.titel) + "</h2>";
      if (kat.intro) h += "<p>" + esc(kat.intro) + "</p>";
      if (kat.spalten) h += '<p class="menu-cat__sizes">Größen: ' + kat.spalten.map(esc).join(" · ") + "</p>";
      h += "</header>";
      h += '<div class="dish-grid">';
      kat.gerichte.forEach(function (g) { h += dishHtml(g, kat); });
      h += "</div>";
      if (kat.extras) {
        kat.extras.forEach(function (x) {
          h += '<div class="menu-extra"><span>' + esc(x.name) + "</span><span class=\"menu-extra__prices\">";
          h += x.preise.map(function (p, i) {
            return (kat.spalten ? '<span><small>' + esc(kat.spalten[i]) + "</small> " : "<span>") + (x.plus ? "+ " : "") + euro(p) + "</span>";
          }).join("");
          h += "</span></div>";
        });
      }
      h += "</section>";
    });
    return h;
  }

  function renderMenuNav(karte) {
    return karte.kategorien.map(function (kat) {
      return '<a class="chip" href="#' + kat.id + '" data-nav="' + kat.id + '">' + esc(kat.nav || kat.titel) + "</a>";
    }).join("");
  }

  function zeitenText(zeiten) {
    if (!zeiten || !zeiten.length) return "Ruhetag";
    return zeiten.map(function (z) { return z[0] + "–" + z[1]; }).join(", ");
  }

  function renderHoursTable(config) {
    var oz = config.oeffnungszeiten;
    var h = '<table class="hours"><caption class="sr-only">Öffnungszeiten</caption><tbody>';
    oz.tage.forEach(function (t, i) {
      h += '<tr data-day="' + i + '"><th scope="row">' + esc(t.tag) + "</th><td>" + esc(zeitenText(t.zeiten)) + (t.zeiten.length ? " Uhr" : "") + "</td></tr>";
    });
    h += "</tbody></table>";
    if (oz.platzhalter) h += '<p class="placeholder-note">[ÖFFNUNGSZEITEN] – Beispielwerte, bitte in assets/js/config.js eintragen.</p>';
    return h;
  }

  /* Kurzform für den Footer: gleiche Tage zusammenfassen (Mo–Do 11:00–22:00) */
  function renderHoursShort(config) {
    var tage = config.oeffnungszeiten.tage, groups = [];
    tage.forEach(function (t) {
      var txt = zeitenText(t.zeiten), last = groups[groups.length - 1];
      if (last && last.txt === txt) last.bis = t.kurz;
      else groups.push({ von: t.kurz, bis: null, txt: txt });
    });
    return groups.map(function (g) {
      return "<li><span>" + g.von + (g.bis ? "–" + g.bis : "") + "</span><span>" + esc(g.txt) + "</span></li>";
    }).join("");
  }

  var DAY_CODES = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  var SCHEMA_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  function restaurantSchema(config, karte) {
    var a = config.adresse;
    var s = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "@id": config.domain + "/#restaurant",
      name: config.name,
      image: config.domain + "/assets/img/og-image.jpg",
      logo: config.domain + "/assets/img/logo.png",
      url: config.domain + "/",
      telephone: config.telefonLink.replace("tel:", ""),
      servesCuisine: ["Türkisch", "Döner", "Pizza", "Pasta"],
      priceRange: "€",
      address: { "@type": "PostalAddress", streetAddress: a.strasse, postalCode: a.plz, addressLocality: a.ort, addressCountry: a.land },
      hasMap: config.mapsUrl,
      acceptsReservations: false,
      menu: config.domain + "/speisekarte.html",
      sameAs: [config.instagram.url].concat(config.facebook.platzhalter ? [] : [config.facebook.url])
    };
    if (!config.oeffnungszeiten.platzhalter) {
      s.openingHoursSpecification = [];
      config.oeffnungszeiten.tage.forEach(function (t, i) {
        t.zeiten.forEach(function (z) {
          s.openingHoursSpecification.push({ "@type": "OpeningHoursSpecification", dayOfWeek: SCHEMA_DAYS[i], opens: z[0], closes: z[1] });
        });
      });
    }
    if (karte) s.hasMenu = menuSchema(config, karte);
    return s;
  }

  function menuSchema(config, karte) {
    return {
      "@type": "Menu",
      name: "Speisekarte " + config.name,
      url: config.domain + "/speisekarte.html",
      inLanguage: "de",
      hasMenuSection: karte.kategorien.filter(function (k) { return !k.angebot; }).map(function (kat) {
        return {
          "@type": "MenuSection",
          name: kat.titel,
          hasMenuItem: kat.gerichte.map(function (g) {
            var labels = g.labels || kat.spalten;
            var item = { "@type": "MenuItem", name: (g.nr != null ? g.nr + ". " : "") + g.name };
            if (g.zutaten) item.description = g.zutaten;
            if (g.typ === "veg") item.suitableForDiet = "https://schema.org/VegetarianDiet";
            item.offers = g.preise.map(function (p, i) {
              if (p == null) return null;
              var o = { "@type": "Offer", price: p.toFixed(2), priceCurrency: "EUR" };
              if (labels && g.preise.length > 1) o.name = labels[i];
              return o;
            }).filter(Boolean);
            if (item.offers.length === 1) item.offers = item.offers[0];
            return item;
          })
        };
      })
    };
  }

  var api = {
    esc: esc, euro: euro, renderMenu: renderMenu, renderMenuNav: renderMenuNav,
    renderHoursTable: renderHoursTable, renderHoursShort: renderHoursShort,
    restaurantSchema: restaurantSchema, zeitenText: zeitenText, DAY_CODES: DAY_CODES
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.BESTO_RENDER = api;
})(this);
