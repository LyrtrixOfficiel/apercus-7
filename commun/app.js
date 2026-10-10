/* Site praticien V2 : comportements communs aux huit directions.
   Chaque effet s'active par un attribut dans le HTML (data-split, data-reveal,
   data-scrub, data-recit, data-horizontal, data-parallaxe, data-curseur,
   data-apercu, data-video). Une direction n'a donc rien a programmer : sa
   composition decide des attributs presents. Sans ce fichier, tout s'affiche
   (la classe « js » est retiree au bout de 4 s par la page).

   Deux formes de maquette :
   - huit pages voisines (prototype) : le panneau est dans le HTML, chaque
     ambiance est un lien vers sa page ;
   - une seule page (publication a l'echelle, <html data-auto>) : le panneau est
     construit ici, et choisir une ambiance redessine la page sur place a partir
     de donnees.json et des blocs de commun/rendu/. Le choix est garde dans
     l'adresse (#ambiance=nuit) pour qu'un lien partage ouvre la bonne. */
(function () {
  'use strict';
  var R = document.documentElement;
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finPointeur = window.matchMedia('(pointer: fine)').matches;
  var grandEcran = window.matchMedia('(min-width: 900px)');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* --- texte decoupe en mots et lettres ------------------------------------ */
  function decouper(el) {
    var label = el.textContent.replace(/\s+/g, ' ').trim(), c = 0, w = 0;
    function traiter(n, parent) {
      if (n.nodeType === 3) {
        n.textContent.split(/([ \t\n\r]+)/).forEach(function (m) {
          if (!m) return;
          if (/^[ \t\n\r]+$/.test(m)) { parent.appendChild(document.createTextNode(' ')); return; }
          /* Un nom compose peut passer a la ligne apres son trait d'union ; dans un
             mot protege (.nw), le parent l'en empeche. */
          m.split(/(?<=-)(?=\S)/).forEach(function (bout) {
            var mot = document.createElement('span'); mot.className = 'mot'; mot.style.setProperty('--w', w++);
            Array.from(bout).forEach(function (ch) { var s = document.createElement('span'); s.className = 'c'; s.style.setProperty('--c', c++); s.textContent = ch; mot.appendChild(s); });
            parent.appendChild(mot);
          });
        });
      } else if (n.nodeType === 1) {
        var copie = n.cloneNode(false); parent.appendChild(copie);
        Array.from(n.childNodes).forEach(function (x) { traiter(x, copie); });
      }
    }
    var f = document.createDocumentFragment();
    Array.from(el.childNodes).forEach(function (n) { traiter(n, f); });
    el.textContent = ''; el.appendChild(f); el.setAttribute('aria-label', label);
    Array.from(el.children).forEach(function (e) { e.setAttribute('aria-hidden', 'true'); });
  }

  /* --- tous les effets de la page ------------------------------------------
     Relancables : quand la page est redessinee dans une autre ambiance, les
     ecouteurs, observateurs et minuteries de l'ancienne sont coupes d'un coup. */
  var controle = null;
  function effets() {
    if (controle) controle.abort();
    controle = typeof AbortController === 'function' ? new AbortController() : { signal: { aborted: false, addEventListener: function () {} }, abort: function () {} };
    var sig = controle.signal;
    var sur = function (cible, type, fn, opts) { opts = opts || {}; opts.signal = sig; cible.addEventListener(type, fn, opts); };
    var plusTard = function (fn, ms) { return setTimeout(function () { if (!sig.aborted) fn(); }, ms); };

    $$('[data-split]').forEach(decouper);

    /* apparitions au defilement */
    var ac = $('.ac');
    var aVoir = $$('main [data-reveal], main [data-split], .cerf').filter(function (e) { return !ac || !ac.contains(e); });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
      aVoir.forEach(function (e) { io.observe(e); });
      sig.addEventListener('abort', function () { io.disconnect(); });
    } else aVoir.forEach(function (e) { e.classList.add('is-in'); });

    /* L'accueil joue sa choregraphie une fois les polices pretes. */
    function intro() {
      if (!ac) return;
      var m = $$('[data-anim], [data-split]', ac);
      requestAnimationFrame(function () { requestAnimationFrame(function () { ac.classList.add('is-in'); m.forEach(function (x) { x.classList.add('is-in'); }); }); });
    }

    /* video de fond : chargee apres l'affichage, jamais en mouvement reduit */
    $$('video[data-video]').forEach(function (v) {
      var eco = navigator.connection && navigator.connection.saveData;
      if (reduit || eco) return;
      plusTard(function () {
        v.src = v.getAttribute('data-video');
        v.addEventListener('playing', function () { v.classList.add('is-lue'); }, { once: true });
        var p = v.play(); if (p && p.catch) p.catch(function () {});
      }, 600);
    });

    /* curseur : lumiere de l'accueil (Aurore), projecteur (Nuit) */
    if (finPointeur && !reduit) {
      $$('[data-curseur], .ac--video').forEach(function (z) {
        var cible = null;
        z.addEventListener('pointermove', function (e) {
          var r = z.getBoundingClientRect();
          cible = [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
          requestAnimationFrame(function () {
            if (!cible) return;
            z.style.setProperty('--cx', (cible[0] - .5).toFixed(3)); z.style.setProperty('--cy', (cible[1] - .5).toFixed(3));
            z.style.setProperty('--mx', (cible[0] * 100).toFixed(1) + '%'); z.style.setProperty('--my', (cible[1] * 100).toFixed(1) + '%');
            cible = null;
          });
        }, { passive: true });
      });
    }

    /* apercu d'image qui suit le curseur (liste des apports, Nuit) */
    $$('[data-apercu]').forEach(function (s) {
      var boite = $('.apercu-curseur', s), im = boite && $('img', boite);
      if (!boite || !finPointeur || reduit) return;
      $$('[data-image]', s).forEach(function (li) {
        li.addEventListener('pointerenter', function () { im.src = li.getAttribute('data-image'); boite.classList.add('is-visible'); });
        li.addEventListener('pointerleave', function () { boite.classList.remove('is-visible'); });
      });
      s.addEventListener('pointermove', function (e) { boite.style.setProperty('--ax', e.clientX + 'px'); boite.style.setProperty('--ay', e.clientY + 'px'); }, { passive: true });
    });

    /* citation qui s'allume mot a mot */
    var citations = $$('[data-scrub]');
    citations.forEach(function (q) {
      var p = $('p', q), mots = p.textContent.trim().split(/\s+/);
      p.setAttribute('aria-label', p.textContent.trim());
      p.innerHTML = mots.map(function (m, i) { return '<span class="m" aria-hidden="true" style="--i:' + i + '">' + m + '</span>'; }).join(' ');
      q.style.setProperty('--n', mots.length);
    });

    /* recit epingle, defilement horizontal, parallaxe */
    var recits = $$('[data-recit]');
    var horizontaux = $$('[data-horizontal]');
    function mesurerHorizontaux() {
      horizontaux.forEach(function (s) {
        var piste = $('.horizontal__piste', s), scene = $('.horizontal__scene', s);
        var actif = grandEcran.matches && !reduit;
        s.classList.toggle('est-epingle', actif);
        if (!actif) { s.style.removeProperty('--hauteur'); piste.style.removeProperty('--x'); return; }
        var course = Math.max(0, piste.scrollWidth - scene.clientWidth);
        s._course = course;
        s.style.setProperty('--hauteur', (course + window.innerHeight) + 'px');
      });
    }
    var parallaxes = reduit ? [] : $$('[data-parallaxe]');

    var entete = $('#entete');
    var liens = $$('.nav a');
    var cibles = liens.map(function (a) { return $(a.getAttribute('href')); });
    var attente = false;
    function image() {
      attente = false;
      if (sig.aborted) return;
      var vh = window.innerHeight;
      if (entete) entete.classList.toggle('is-scrolled', window.scrollY > 30);
      citations.forEach(function (q) {
        if (reduit || R.classList.contains('tout-visible')) { q.style.setProperty('--p', 1); return; }
        var r = q.getBoundingClientRect();
        q.style.setProperty('--p', Math.max(0, Math.min(1, (vh * .9 - r.top) / (r.height + vh * .5))).toFixed(3));
      });
      recits.forEach(function (s) {
        var sc = $('.recit__scene', s), r = sc.getBoundingClientRect(), n = +getComputedStyle(s).getPropertyValue('--n') || 4;
        var p = Math.max(0, Math.min(.999, -r.top / Math.max(1, r.height - vh)));
        s.setAttribute('data-actif', String(Math.floor(p * n)));
      });
      horizontaux.forEach(function (s) {
        if (!s.classList.contains('est-epingle')) return;
        var r = s.getBoundingClientRect(), p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - vh)));
        $('.horizontal__piste', s).style.setProperty('--x', (-p * (s._course || 0)).toFixed(1) + 'px');
      });
      parallaxes.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var centre = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = 'translate3d(0,' + (centre * -100 * parseFloat(el.getAttribute('data-parallaxe'))).toFixed(1) + 'px,0)';
      });
      var actif = -1;
      cibles.forEach(function (c, i) { if (c && c.getBoundingClientRect().top < vh * .4) actif = i; });
      liens.forEach(function (a, i) { a.classList.toggle('is-actif', i === actif); });
    }
    function demander() { if (!attente) { attente = true; requestAnimationFrame(image); } }
    sur(window, 'scroll', demander, { passive: true });
    var minuterie = 0;
    sur(window, 'resize', function () { clearTimeout(minuterie); minuterie = plusTard(function () { mesurerHorizontaux(); demander(); }, 150); });

    /* menus <details> : se referment au choix d'un lien, ou a cote */
    $$('details.menu').forEach(function (m) {
      m.addEventListener('click', function (e) { if (e.target.closest('a')) m.open = false; });
      sur(document, 'click', function (e) { if (m.open && !m.contains(e.target)) m.open = false; });
      sur(document, 'keydown', function (e) { if (e.key === 'Escape') m.open = false; });
      m.addEventListener('toggle', function () { document.body.style.overflow = m.open && /plein|panneau/.test(m.className) ? 'hidden' : ''; });
    });

    mesurerHorizontaux();
    image();
    var polices = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 1500); })]) : Promise.resolve();
    polices.then(function () { if (sig.aborted) return; mesurerHorizontaux(); image(); intro(); });
  }

  /* --- panneau « Choisissez l'ambiance de votre site » ---------------------
     Un bouton, une bulle d'invitation la premiere fois, un panneau (feuille au
     telephone, volet sur ordinateur). */
  function cablerPanneau(boite, choisir) {
    var b = $('.ambiances__bouton', boite), bulle = $('.ambiance-bulle', boite);
    var vue = false; try { vue = localStorage.getItem('v2-bulle') === '1'; } catch (e) {}
    var cacherBulle = function (memo) {
      if (bulle) bulle.classList.remove('is-visible');
      if (memo) try { localStorage.setItem('v2-bulle', '1'); } catch (e) {}
    };
    var ouvert = function () { return boite.classList.contains('is-ouvert'); };
    var ouvrir = function (oui) {
      boite.classList.toggle('is-ouvert', oui);
      b.setAttribute('aria-expanded', String(oui));
      document.body.style.overflow = oui ? 'hidden' : '';
      if (oui) { cacherBulle(true); var c = $('[aria-current]', boite) || $('.ambiances__choix', boite); if (c) setTimeout(function () { c.focus({ preventScroll: true }); }, 60); }
    };
    b.addEventListener('click', function () { ouvrir(!ouvert()); });
    $$('[data-fermer]', boite).forEach(function (x) { x.addEventListener('click', function () { ouvrir(false); b.focus({ preventScroll: true }); }); });
    boite.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ouvert()) { ouvrir(false); b.focus({ preventScroll: true }); } });
    if (choisir) $$('.ambiances__choix', boite).forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); ouvrir(false); choisir(a.getAttribute('data-cle')); });
    });
    if (bulle && !vue && !R.classList.contains('tout-visible')) {
      /* Jamais sur l'accueil (elle couvrirait « Prendre rendez-vous ») : la bulle
         vient une fois que le visiteur a commence a descendre, puis repart seule. */
      var surDefile = function () {
        if (window.scrollY < window.innerHeight * 0.6) return;
        window.removeEventListener('scroll', surDefile);
        setTimeout(function () { if (!ouvert() && boite.isConnected) bulle.classList.add('is-visible'); }, 700);
        setTimeout(function () { cacherBulle(false); }, 11000);
      };
      window.addEventListener('scroll', surDefile, { passive: true });
      $('button', bulle).addEventListener('click', function (e) { e.stopPropagation(); cacherBulle(true); });
      bulle.addEventListener('click', function () { ouvrir(true); });
    }
  }

  /* --- une seule page : redessin sur place --------------------------------- */
  var auto = R.getAttribute('data-auto');
  if (!auto) {
    effets();
    var boite = $('#ambiances');
    if (boite) cablerPanneau(boite, null);
    window.__siteOk = true;
    return;
  }

  var commun = new URL(R.getAttribute('data-commun') || '../commun/', location.href).href;
  var relatif = R.getAttribute('data-commun') || '../commun/';
  var actuelle = R.getAttribute('data-direction');
  var ctx = {
    mode: 'echelle', famille: R.getAttribute('data-famille'), auto: auto,
    chemins: { commun: relatif, css: relatif, dir: relatif + 'directions/', img: relatif + 'images/', vign: relatif + 'vignettes/' },
    liens: {},
  };
  var promesseModule = null, promesseDonnees = null;
  var rendu = function () { return promesseModule || (promesseModule = import(commun + 'rendu/page.js')); };
  var donnees = function () {
    return promesseDonnees || (promesseDonnees = fetch(new URL('donnees.json', location.href).href).then(function (r) { if (!r.ok) throw new Error('donnees ' + r.status); return r.json(); }));
  };
  var demandee = function () { var m = /[#&]ambiance=([a-z]+)/.exec(location.hash); return m ? m[1] : auto; };

  function poserPanneau(m) {
    Object.keys(m.DIRECTIONS).forEach(function (k) { ctx.liens[k] = k === auto ? location.pathname + location.search : '#ambiance=' + k; });
    var ancien = $('#ambiances'), etait = ancien && ancien.querySelector('.ambiance-bulle.is-visible');
    if (ancien) ancien.remove();
    document.body.insertAdjacentHTML('beforeend', m.panneau(actuelle, ctx));
    var boite = $('#ambiances');
    $$('.ambiances__choix', boite).forEach(function (a) {
      var k = Object.keys(m.DIRECTIONS).filter(function (x) { return a.getAttribute('href') === ctx.liens[x]; })[0];
      a.setAttribute('data-cle', k);
    });
    if (etait) { var bl = $('.ambiance-bulle', boite); if (bl) bl.classList.add('is-visible'); }
    cablerPanneau(boite, choisir);
  }

  /* Charge une feuille et attend qu'elle soit appliquee (2,5 s au plus). */
  function feuille(attribut, href) {
    var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; l.setAttribute(attribut, '');
    return new Promise(function (ok) { l.onload = l.onerror = ok; setTimeout(ok, 2500); document.head.appendChild(l); }).then(function () { return l; });
  }

  var enCours = Promise.resolve();
  function basculer(k) {
    enCours = enCours.then(function () {
      if (k === actuelle) return;
      return Promise.all([rendu(), donnees()]).then(function (r) {
        var m = r[0], C = r[1];
        if (!m.DIRECTIONS[k]) return;
        var doc = new DOMParser().parseFromString(m.page(C, k, ctx), 'text/html');
        var anciennes = $$('link[data-polices], link[data-feuille-direction]');
        return Promise.all([
          feuille('data-polices', doc.querySelector('link[data-polices]').getAttribute('href')),
          feuille('data-feuille-direction', doc.querySelector('link[data-feuille-direction]').getAttribute('href')),
        ]).then(function () {
          if (controle) controle.abort();
          anciennes.forEach(function (l) { l.remove(); });
          R.setAttribute('data-direction', k);
          R.setAttribute('style', doc.documentElement.getAttribute('style') || '');
          document.title = doc.title;
          var tc = $('meta[name="theme-color"]'), ntc = doc.querySelector('meta[name="theme-color"]');
          if (tc && ntc) tc.setAttribute('content', ntc.getAttribute('content'));
          var panneau = $('#ambiances');
          Array.from(document.body.childNodes).forEach(function (n) { if (n !== panneau) n.remove(); });
          Array.from(doc.body.childNodes).forEach(function (n) { document.body.insertBefore(document.importNode(n, true), panneau); });
          document.body.style.overflow = '';
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          actuelle = k;
          effets();
          poserPanneau(m);
        });
      });
    }).catch(function (e) { if (window.console) console.warn('ambiance indisponible', e); });
    return enCours;
  }

  function choisir(k) {
    if (!k) return;
    var adresse = k === auto ? location.pathname + location.search : '#ambiance=' + k;
    try { history.pushState(null, '', adresse); } catch (e) { location.hash = k === auto ? '' : 'ambiance=' + k; }
    basculer(k);
  }
  /* Retour arriere, ou adresse modifiee a la main */
  window.addEventListener('popstate', function () { basculer(demandee()); });
  window.addEventListener('hashchange', function () { basculer(demandee()); });

  /* Les liens internes (#approche, #contact...) font defiler sans effacer
     l'ambiance choisie de l'adresse. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || a.classList.contains('ambiances__choix')) return;
    var id = a.getAttribute('href').slice(1);
    if (!id || /^ambiance=/.test(id)) return;
    var cible = document.getElementById(id);
    if (!cible) return;
    e.preventDefault();
    cible.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth', block: 'start' });
    if (a.classList.contains('evitement')) { cible.setAttribute('tabindex', '-1'); cible.focus({ preventScroll: true }); }
  });

  var voulue = demandee();
  var depart = voulue !== actuelle
    ? basculer(voulue).then(function () { if (actuelle !== voulue) effets(); })
    : (effets(), Promise.resolve());
  depart.then(function () {
    R.classList.remove('rendu-attente');
    window.__siteOk = true;
    return rendu().then(poserPanneau);
  }).catch(function (e) { R.classList.remove('rendu-attente'); window.__siteOk = true; if (window.console) console.warn(e); });
})();
