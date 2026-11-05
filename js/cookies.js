/* =========================================================
   La Crème des Bordelaises – Bandeau cookies (Loi 25)
   Google Analytics et Microsoft Clarity ne se chargent
   QUE si le visiteur clique sur « Accepter ».
   Pour rouvrir le bandeau : tout lien avec class="lien-cookies".
   ========================================================= */
(function () {
  var GA_ID = 'G-3QC4BR9BK6';
  var CLARITY_ID = 'ycnmy4byph';
  var CLE = 'lcdb-cookies';            // choix mémorisé : "oui" ou "non"
  var DUREE_JOURS = 180;               // on redemande après 6 mois

  // gtag existe toujours (les formulaires l'utilisent), mais n'envoie
  // rien tant que le script Google n'est pas chargé.
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  function lireChoix() {
    try {
      var v = JSON.parse(localStorage.getItem(CLE));
      if (v && v.choix && (Date.now() - v.date) < DUREE_JOURS * 864e5) return v.choix;
    } catch (e) {}
    return null;
  }
  function enregistrer(choix) {
    try { localStorage.setItem(CLE, JSON.stringify({ choix: choix, date: Date.now() })); } catch (e) {}
  }

  var dejaCharge = false;
  function chargerMesure() {
    if (dejaCharge) return; dejaCharge = true;
    // Google Analytics 4
    var g = document.createElement('script');
    g.async = true; g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(g);
    gtag('js', new Date());
    gtag('config', GA_ID);
    // Microsoft Clarity
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  function effacerTemoins() {
    var noms = document.cookie.split(';').map(function (c) { return c.split('=')[0].trim(); });
    var domaines = ['', location.hostname, '.' + location.hostname.replace(/^www\./, '')];
    noms.forEach(function (n) {
      if (/^(_ga|_gid|_gat|_clck|_clsk|CLID|MUID)/.test(n)) {
        domaines.forEach(function (d) {
          document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }

  var CSS =
    '#lcdb-cookies{position:fixed;left:16px;right:16px;bottom:16px;z-index:100000;max-width:720px;margin:0 auto;' +
    'background:#f9f5f0;color:#513c21;border:1px solid #e8d6b5;border-top:4px solid #d9a545;border-radius:10px;' +
    'box-shadow:0 10px 30px rgba(81,60,33,.25);padding:18px 20px;font-family:"Work Sans",Arial,sans-serif;' +
    'display:flex;flex-wrap:wrap;align-items:center;gap:14px 20px}' +
    '#lcdb-cookies[hidden]{display:none}' +
    '#lcdb-cookies p{flex:1 1 320px;margin:0;font-size:14px;line-height:1.55;color:#513c21}' +
    '#lcdb-cookies p strong{display:block;font-size:15px;margin-bottom:2px}' +
    '#lcdb-cookies a{color:#513c21;text-decoration:underline}' +
    '#lcdb-cookies .lcdb-btns{display:flex;gap:10px;flex:0 0 auto}' +
    '#lcdb-cookies button{font:700 14px "Work Sans",Arial,sans-serif;border-radius:4px;padding:10px 20px;cursor:pointer;' +
    'border:2px solid #513c21;line-height:1.2}' +
    '#lcdb-cookies .lcdb-non{background:transparent;color:#513c21}' +
    '#lcdb-cookies .lcdb-oui{background:#d9a545;border-color:#d9a545;color:#513c21}' +
    '#lcdb-cookies button:focus-visible{outline:3px solid #8BA6B1;outline-offset:2px}' +
    '@media (max-width:560px){#lcdb-cookies{left:10px;right:10px;bottom:10px;padding:14px 15px}' +
    '#lcdb-cookies p{font-size:13px}#lcdb-cookies .lcdb-btns{width:100%}#lcdb-cookies button{flex:1}}';

  var EN = /^en/i.test(document.documentElement.lang || '');
  var TXT = EN ? {
    titre: 'Your privacy',
    texte: 'I use audience measurement cookies, Google Analytics and Microsoft Clarity, to see which pages are useful to you and improve the site. They are only turned on with your consent. ',
    lien: '/en/politique-confidentialite.html', plus: 'Learn more',
    non: 'Decline', oui: 'Accept', zone: 'Cookie preferences'
  } : {
    titre: 'Votre vie privée',
    texte: 'J\u2019utilise des témoins (cookies) de mesure d\u2019audience, Google Analytics et Microsoft Clarity, pour savoir quelles pages vous sont utiles et améliorer le site. Ils ne sont activés qu\u2019avec votre accord. ',
    lien: '/politique-confidentialite.html', plus: 'En savoir plus',
    non: 'Refuser', oui: 'Accepter', zone: 'Choix des témoins (cookies)'
  };

  var banniere;
  function afficher() {
    if (!banniere) {
      var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
      banniere = document.createElement('div');
      banniere.id = 'lcdb-cookies';
      banniere.setAttribute('role', 'region');
      banniere.setAttribute('aria-label', TXT.zone);
      banniere.innerHTML =
        '<p><strong>' + TXT.titre + '</strong>' + TXT.texte +
        '<a href="' + TXT.lien + '">' + TXT.plus + '</a></p>' +
        '<div class="lcdb-btns"><button type="button" class="lcdb-non">' + TXT.non + '</button>' +
        '<button type="button" class="lcdb-oui">' + TXT.oui + '</button></div>';
      document.body.appendChild(banniere);
      banniere.querySelector('.lcdb-oui').onclick = function () {
        enregistrer('oui'); banniere.hidden = true; chargerMesure();
      };
      banniere.querySelector('.lcdb-non').onclick = function () {
        var avait = lireChoix() === 'oui';
        enregistrer('non'); banniere.hidden = true; effacerTemoins();
        if (avait && dejaCharge) location.reload(); // arrête la mesure tout de suite
      };
    }
    banniere.hidden = false;
  }

  // Au chargement de la page
  if (lireChoix() === 'oui') chargerMesure();

  document.addEventListener('DOMContentLoaded', function () {
    if (!lireChoix()) afficher();
    document.addEventListener('click', function (e) {
      var lien = e.target.closest && e.target.closest('.lien-cookies');
      if (lien) { e.preventDefault(); afficher(); }
    });
  });
})();
