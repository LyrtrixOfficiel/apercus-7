// Blocs de sections reutilisables. Chaque bloc a plusieurs variantes de mise
// en page ; une direction (directions.mjs) choisit la variante et les places
// d'images. Le contenu C vient de contenu.mjs ; X porte le contexte de
// construction : le jeu de photos de la famille, la video, le prefixe des
// chemins vers les fichiers communs.
//
// Quand une donnee manque, le bloc pose un emplacement qui le dit, jamais un
// texte invente.
// Aucun acces disque : ce module tourne aussi dans le navigateur (commun/rendu/).
import { DIMENSIONS } from './dimensions.js';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* --- images --------------------------------------------------------------- */
const dims = (nom, w) => { const d = DIMENSIONS[nom]; return w === 800 ? [d[2]] : [d[0], d[1]]; };
/** Les photos utilisees, pour ne copier que celles-la a la publication. */
export const UTILISEES = new Set();
function img(X, place, { cls = '', sizes = '100vw', eager = false, parallaxe = '' } = {}) {
  const nom = X.jeu[place % X.jeu.length];
  UTILISEES.add(nom);
  const [l1, h1] = dims(nom, 1600), [l0] = dims(nom, 800);
  const p = `${X.base}${nom}`;
  return `<img class="${cls}" src="${p}-1600.webp" srcset="${p}-800.webp ${l0}w, ${p}-1600.webp ${l1}w" sizes="${sizes}" width="${l1}" height="${h1}" alt="" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${parallaxe ? ` data-parallaxe="${parallaxe}"` : ''}>`;
}
const urlImg = (X, place, w = 800) => { const n = X.jeu[place % X.jeu.length]; UTILISEES.add(n); return `${X.base}${n}-${w}.webp`; };

const fleche = '<svg class="fleche" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>';
const bouton = (C, texte, cls = '') => `<a class="bouton ${cls}" href="${C.telLien}"><span>${texte}</span>${fleche}</a>`;
const etiquette = (n, t) => `<p class="etiquette" data-reveal><span class="etiquette__num">${n}</span>${t}</p>`;
const titre = (html, cls = '') => `<h2 class="titre-section ${cls}" data-split>${html}</h2>`;
const ICONES = {
  portrait: '<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
  liste: '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h10M4 17h13"/></svg>',
  avis: '<svg viewBox="0 0 24 24"><path d="M5 6h14v9H9l-4 4z"/></svg>',
  lieu: '<svg viewBox="0 0 24 24"><path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/></svg>',
  plume: '<svg viewBox="0 0 24 24"><path d="M20 4C11 5 6 10 5 19M5 19l4-1M9 18c6-1 9-6 10-11"/></svg>',
  feuille: '<svg viewBox="0 0 24 24"><path d="M5 19C5 10 11 5 19 5c0 8-5 14-14 14zM5 19l7-7"/></svg>',
};
const emplacement = (cls, icone, titreE, texte) =>
  `<div class="emplacement ${cls}" data-reveal><span class="emplacement__icone" aria-hidden="true">${ICONES[icone]}</span><p class="emplacement__titre">${titreE}</p><p>${texte}</p></div>`;
const citationVide = (cls) => `<blockquote class="${cls} citation--emplacement" data-reveal><p>Ici, la phrase qui vous ressemble&#8239;: ce que vous voulez qu’on ressente en arrivant chez vous.</p></blockquote>`;

/* --- navigation ----------------------------------------------------------- */
const LIENS = [['approche', 'L’approche'], ['seance', 'La séance'], ['tarifs', 'Tarifs'], ['apropos', 'À propos'], ['questions', 'Questions'], ['contact', 'Contact']];
export function nav(C, style) {
  const liens = LIENS.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('');
  const liensNum = LIENS.map(([id, t], i) => `<a href="#${id}"><span>0${i + 1}</span>${t}</a>`).join('');
  const marque = `<a class="marque" href="#accueil" aria-label="${esc(C.nom)}, retour en haut"><span class="marque__sceau" aria-hidden="true">${esc(C.initiales)}</span><span class="marque__nom">${esc(C.nom)}</span></a>`;
  const menu = (cls) => `<details class="menu ${cls}"><summary aria-label="Ouvrir le menu"><span class="menu__libelle">Menu</span><span class="menu__barres" aria-hidden="true"><i></i><i></i></span></summary>
    <div class="menu__panneau"><nav aria-label="Menu">${liensNum}</nav><a class="menu__tel" href="${C.telLien}">${C.tel}</a></div></details>`;
  const appel = `<a class="bouton bouton--petit entete__appel" href="${C.telLien}"><span>${C.appeler}</span></a>`;
  if (style === 'laterale') return `<header class="entete entete--laterale" id="entete">${marque}<nav class="nav" aria-label="Sections">${liens}</nav><a class="entete__tel" href="${C.telLien}">${C.tel}</a>${menu('menu--tiroir')}</header>`;
  if (style === 'plein-ecran') return `<header class="entete entete--plein" id="entete">${marque}${menu('menu--plein')}</header>`;
  if (style === 'panneau') return `<header class="entete entete--panneau" id="entete">${marque}${menu('menu--panneau')}</header>`;
  if (style === 'flottante') return `<header class="entete entete--flottante" id="entete"><div class="entete__pilule">${marque}<nav class="nav" aria-label="Sections">${liens}</nav>${appel}${menu('menu--tiroir')}</div></header>`;
  if (style === 'centree') return `<header class="entete entete--centree" id="entete">${marque}<nav class="nav" aria-label="Sections">${liens}</nav>${appel}${menu('menu--tiroir')}</header>`;
  return `<header class="entete entete--barre" id="entete">${marque}<nav class="nav" aria-label="Sections">${liens}</nav>${appel}${menu('menu--tiroir')}</header>`;
}

/* --- accueil -------------------------------------------------------------- */
const surtitre = (C) => `<p class="surtitre" data-anim style="--o:0">${esc(C.metier)}${C.ville ? ` à ${esc(C.ville)}` : ''}</p>`;
const nom = (C) => `<h1 class="ac__nom" data-split>${esc(C.nom)}</h1>`;
const phrase = (C, o = 3) => `<p class="ac__phrase" data-anim style="--o:${o}">${C.accroche}</p>`;
const actions = (C, o = 4) => `<div class="ac__actions" data-anim style="--o:${o}">${bouton(C, 'Prendre rendez-vous')}<a class="lien" href="#approche">Découvrir ${C.court ? 'le site' : 'son approche'}</a></div>`;
const defiler = '<a class="defiler" href="#approche" aria-label="Descendre"><span></span></a>';

export function accueil(C, v, o, X) {
  if (v === 'video') return `<section class="ac ac--video" id="accueil">
    <div class="ac__media" aria-hidden="true">
      <img class="ac__poster" src="https://lyrtrixofficiel.github.io/video/${X.video}.webp" alt="" fetchpriority="high">
      <video class="ac__video" muted loop playsinline preload="none" data-video="https://lyrtrixofficiel.github.io/video/${X.video}.mp4"></video>
      <div class="ac__voile"></div><div class="ac__projecteur"></div>
    </div>
    <div class="ac__contenu">${surtitre(C)}${nom(C)}<span class="ac__ligne" data-anim style="--o:2" aria-hidden="true"></span>${phrase(C)}${actions(C)}</div>${defiler}</section>`;

  if (v === 'partage') return `<section class="ac ac--partage ac--${o.cadre || 'plein'}" id="accueil">
    <figure class="ac__image" data-anim style="--o:0">${img(X, o.img, { cls: 'ac__photo', sizes: '(min-width: 900px) 50vw, 100vw', eager: true })}</figure>
    <div class="ac__contenu">${surtitre(C)}${nom(C)}<span class="ac__ligne" data-anim style="--o:2" aria-hidden="true"></span>${phrase(C)}${actions(C)}
      <dl class="ac__infos" data-anim style="--o:5">${C.ville ? `<div><dt>Lieu</dt><dd>${esc(C.ville)}${C.cp ? ` (${C.cp})` : ''}</dd></div>` : ''}<div><dt>Séances</dt><dd>${esc(C.rdv)}</dd></div></dl></div></section>`;

  if (v === 'affiche') return `<section class="ac ac--affiche" id="accueil" data-curseur>
    <div class="ac__aurore" aria-hidden="true"><span></span><span></span><span></span></div>
    <div class="ac__flottants" aria-hidden="true">${o.imgs.map((p, i) => `<figure class="flottant flottant--${i + 1}" data-parallaxe="${[0.12, -0.08, 0.18][i]}">${img(X, p, { sizes: '30vw', eager: i === 0 })}</figure>`).join('')}</div>
    <div class="ac__contenu">${surtitre(C)}${nom(C)}${phrase(C, 2)}${actions(C, 3)}</div>${defiler}</section>`;

  if (v === 'mosaique') return `<section class="ac ac--mosaique" id="accueil">
    <div class="ac__contenu">${surtitre(C)}${nom(C)}<span class="ac__ligne" data-anim style="--o:2" aria-hidden="true"></span>${phrase(C)}${actions(C)}</div>
    <div class="ac__galets" aria-hidden="true">${o.imgs.map((p, i) => `<figure class="galet galet--${i + 1}" data-anim style="--o:${i + 1}">${img(X, p, { sizes: '(min-width: 900px) 30vw, 60vw', eager: i === 0 })}</figure>`).join('')}</div></section>`;

  if (v === 'carte') return `<section class="ac ac--carte" id="accueil">
    <div class="ac__fond" aria-hidden="true">${img(X, o.img, { cls: 'ac__photo', eager: true, parallaxe: '0.18' })}</div>
    <div class="ac__contenu carte-accueil">${surtitre(C)}${nom(C)}${phrase(C, 2)}${actions(C, 3)}</div></section>`;

  if (v === 'vide') return `<section class="ac ac--vide" id="accueil">
    <svg class="enso" viewBox="0 0 600 600" aria-hidden="true"><defs><filter id="pinceau" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.09" numOctaves="3" seed="7"/><feDisplacementMap in="SourceGraphic" scale="6"/></filter></defs>
      <g filter="url(#pinceau)"><path class="enso__trait" pathLength="1" d="M318 92 C430 104 512 196 508 312 C504 430 404 514 288 508 C170 502 88 410 94 296 C100 196 170 122 262 102"/><path class="enso__fin" pathLength="1" d="M318 92 C430 104 512 196 508 312 C504 430 404 514 288 508 C170 502 88 410 94 296 C100 196 170 122 262 102"/></g></svg>
    <span class="sceau" aria-hidden="true">${esc(C.initiales)}</span>
    <p class="ac__vertical" aria-hidden="true">${[C.ville, C.region, C.rdv].filter(Boolean).map(esc).join(' · ')}</p>
    <div class="ac__contenu">${surtitre(C)}${nom(C)}${phrase(C, 2)}${actions(C, 3)}</div>
    <figure class="ac__bande" data-anim style="--o:4">${img(X, o.img, { sizes: '100vw', eager: true })}</figure></section>`;

  if (v === 'typo') return `<section class="ac ac--typo" id="accueil">
    <div class="ac__contenu">${surtitre(C)}${nom(C)}
      <div class="ac__colonnes" data-anim style="--o:2"><p>${C.accroche}</p>${C.ville ? `<p><span class="etiq">Lieu</span>${esc(C.ville)}${C.cp ? `, ${C.cp}` : ''}${C.region ? `<br>${esc(C.region)}` : ''}</p>` : ''}<p><span class="etiq">Rendez-vous</span><a class="lien" href="${C.telLien}">${C.tel}</a><br>${esc(C.rdv)}</p></div>
      ${actions(C, 3)}</div>
    <figure class="ac__bande" data-anim style="--o:4">${img(X, o.img, { sizes: '100vw', eager: true, parallaxe: '0.1' })}</figure></section>`;
  throw new Error('accueil inconnu ' + v);
}

/* --- approche ------------------------------------------------------------- */
const VIDE_APPROCHE = (C) => emplacement('emplacement--texte', 'plume', 'Ici, votre approche', 'Votre chemin jusqu’à ce métier, votre façon d’accompagner, ce qui rend vos séances uniques. Vous me donnez vos mots, je les mets en page.');
export function approche(C, v, o, X) {
  const tete = `${etiquette('01', 'L’approche')}${titre(C.approche.length ? 'Ma façon d’<em>accompagner</em>' : 'Votre <em>approche</em>')}`;
  const textes = C.approche.length
    ? `<p class="chapeau" data-reveal>${C.approche[0]}</p>${C.approche.slice(1).map((p) => `<p data-reveal>${p}</p>`).join('')}`
    : VIDE_APPROCHE(C);
  const citation = C.conviction ? `<blockquote class="citation-defile" data-scrub><p>${C.conviction}</p></blockquote>` : citationVide('citation-simple citation--large');
  const simple = C.conviction ? `<blockquote class="citation-simple" data-reveal><p>${C.conviction}</p></blockquote>` : citationVide('citation-simple');
  if (v === 'citation') return `<section class="section approche approche--citation" id="approche"><div class="conteneur"><div class="grille-2"><div>${tete}</div><div class="texte">${textes}</div></div>${citation}</div></section>`;
  if (v === 'image') return `<section class="section approche approche--image approche--${o.cote || 'gauche'}" id="approche"><div class="conteneur grille-2">
      <figure class="approche__figure revele-image" data-reveal>${img(X, o.img, { sizes: '(min-width: 900px) 45vw, 100vw', parallaxe: o.parallaxe || '' })}</figure>
      <div class="texte">${tete}${textes}</div></div>
      <div class="conteneur">${simple}</div></section>`;
  if (v === 'magazine') return `<section class="section approche approche--magazine" id="approche"><div class="conteneur">
      <div class="magazine__tete">${tete}</div>
      <div class="magazine__colonnes">${C.approche.length ? `<p class="lettrine" data-reveal>${C.approche[0]}</p><p data-reveal>${C.approche.slice(1).join(' ') || '&nbsp;'}</p>` : `<div class="magazine__vide">${VIDE_APPROCHE(C)}</div>`}
      ${C.conviction ? `<blockquote class="exergue" data-reveal><p>${C.conviction}</p></blockquote>` : citationVide('exergue')}</div></div></section>`;
  if (v === 'vertical') return `<section class="section approche approche--vertical" id="approche"><div class="conteneur">
      <div class="vertical__titre"><h2 class="titre-vertical" data-reveal>Approche</h2></div>
      <div class="texte">${etiquette('01', 'L’approche')}${textes}${simple}</div></div></section>`;
  throw new Error('approche inconnue ' + v);
}

/* --- seance --------------------------------------------------------------- */
const ROMAINS = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const etape = (C, e, i) => `<span class="etape__num">${ROMAINS[i]}</span><div class="etape__corps"><h3>${e.titre}</h3>${e.duree ? `<p class="etape__duree">${e.duree}</p>` : ''}<p${C.etapesEmplacement ? ' class="texte-emplacement"' : ''}>${e.texte}</p></div>`;
export function seance(C, v, o, X) {
  const intro = C.etapesEmplacement
    ? `<p class="seance__intro texte-emplacement" data-reveal>Ici, vos séances racontées avec vos mots. En attendant, voici la forme qu’elles prendront.</p>`
    : '';
  const tete = `${etiquette('02', 'La séance')}${titre('Le déroulé d’une <em>séance</em>')}${intro}`;
  const E = C.etapes;
  if (v === 'recit') return `<section class="seance seance--recit" id="seance" data-recit style="--n:${E.length}">
    <div class="conteneur recit__tete">${tete}</div>
    <div class="recit__scene"><div class="recit__fixe">
      <div class="recit__images" aria-hidden="true">${E.map((e, i) => `<figure class="recit__image" data-i="${i}">${img(X, o.imgs[i % o.imgs.length], { sizes: '100vw' })}</figure>`).join('')}<div class="recit__voile"></div></div>
      <ol class="recit__etapes">${E.map((e, i) => `<li class="recit__etape" data-i="${i}">${etape(C, e, i)}</li>`).join('')}</ol>
      <div class="recit__progres" aria-hidden="true">${E.map((e, i) => `<span data-i="${i}"></span>`).join('')}</div>
    </div></div></section>`;
  if (v === 'horizontal') return `<section class="seance seance--horizontal" id="seance" data-horizontal>
    <div class="horizontal__scene"><div class="horizontal__piste">
      <div class="horizontal__panneau horizontal__panneau--tete">${tete}<p class="horizontal__aide" aria-hidden="true">Faites défiler <span>→</span></p></div>
      ${E.map((e, i) => `<article class="horizontal__panneau"><figure>${img(X, o.imgs[i % o.imgs.length], { sizes: '(min-width: 900px) 40vw, 80vw' })}</figure><div class="etape">${etape(C, e, i)}</div></article>`).join('')}
    </div></div></section>`;
  if (v === 'empile') return `<section class="section seance seance--empile" id="seance"><div class="conteneur grille-2">
    <div class="empile__tete">${tete}</div>
    <ol class="empile">${E.map((e, i) => `<li class="empile__carte" style="--i:${i}">${etape(C, e, i)}</li>`).join('')}</ol></div></section>`;
  if (v === 'frise') return `<section class="section seance seance--frise" id="seance"><div class="conteneur">
    <div class="frise__tete">${tete}</div>
    <ol class="frise">${E.map((e, i) => `<li class="etape" data-reveal style="--o:${i}">${etape(C, e, i)}</li>`).join('')}</ol></div></section>`;
  if (v === 'accordeon') return `<section class="section seance seance--accordeon" id="seance"><div class="conteneur grille-2">
    <div>${tete}<figure class="accordeon__figure revele-image" data-reveal>${img(X, o.img, { sizes: '(min-width: 900px) 40vw, 100vw' })}</figure></div>
    <div class="accordeon">${E.map((e, i) => `<details class="accordeon__item" data-reveal ${i === 0 ? 'open' : ''}><summary><span class="etape__num">${ROMAINS[i]}</span><span>${e.titre}</span></summary><div class="accordeon__corps">${e.duree ? `<p class="etape__duree">${e.duree}</p>` : ''}<p${C.etapesEmplacement ? ' class="texte-emplacement"' : ''}>${e.texte}</p></div></details>`).join('')}</div></div></section>`;
  if (v === 'colonnes') return `<section class="section seance seance--colonnes" id="seance"><div class="conteneur">
    <div class="colonnes__tete">${tete}</div>
    <ol class="colonnes colonnes--${E.length}">${E.map((e, i) => `<li class="etape" data-reveal style="--o:${i}">${etape(C, e, i)}</li>`).join('')}</ol></div></section>`;
  if (v === 'liste') return `<section class="section seance seance--liste" id="seance"><div class="conteneur etroit">
    <div class="liste__tete">${tete}</div>
    <ol class="etapes-liste">${E.map((e, i) => `<li class="etape" data-reveal>${etape(C, e, i)}</li>`).join('')}</ol></div></section>`;
  throw new Error('seance inconnue ' + v);
}

/* --- apports -------------------------------------------------------------- */
export function apports(C, v, o, X) {
  const tete = `${etiquette('03', 'Ce que ça peut apporter')}${titre('Un mieux-être, <em>à votre rythme</em>')}`;
  const A = C.apports;
  const avert = `<p class="avertissement" data-reveal>${C.avertissement}</p>`;
  const imgs = o.imgs || [];
  if (A.length < 2) return `<section class="section apports apports--vide" id="apports"><div class="conteneur grille-2"><div>${tete}</div><div>
    ${emplacement('emplacement--apports', 'feuille', 'Ici, ce que vos séances peuvent apporter', 'Les bienfaits que vous voulez mettre en avant, avec vos mots, dans le respect de ce que le bien-être permet de promettre.')}${avert}</div></div></section>`;
  if (v === 'lignes') return `<section class="section apports apports--lignes" id="apports" data-apercu><div class="conteneur">${tete}
    <ul class="lignes">${A.map((a, i) => `<li class="ligne" data-reveal data-image="${urlImg(X, imgs[i % imgs.length])}"><span class="ligne__num">0${i + 1}</span><h3>${a.titre}</h3><p>${a.texte}</p></li>`).join('')}</ul>
    <div class="apercu-curseur" aria-hidden="true"><img alt=""></div>${avert}</div></section>`;
  if (v === 'bento') return `<section class="section apports apports--bento" id="apports"><div class="conteneur">${tete}
    <ul class="bento">${A.map((a, i) => `<li class="bento__case" data-reveal style="--o:${i}"><span class="carte__num">0${i + 1}</span><h3>${a.titre}</h3><p>${a.texte}</p></li>`).join('')}
    <li class="bento__case bento__case--image" data-reveal style="--o:4" aria-hidden="true">${img(X, imgs[0], { sizes: '(min-width: 900px) 40vw, 100vw' })}</li></ul>${avert}</div></section>`;
  if (v === 'feuilles') return `<section class="section apports apports--feuilles" id="apports"><div class="conteneur grille-2">
    <div>${tete}${avert}</div>
    <ul class="feuilles">${A.map((a, i) => `<li class="feuille" data-reveal style="--o:${i}"><figure aria-hidden="true">${img(X, imgs[i % imgs.length], { sizes: '96px' })}</figure><div><h3>${a.titre}</h3><p>${a.texte}</p></div></li>`).join('')}</ul></div></section>`;
  if (v === 'points') return `<section class="section apports apports--points" id="apports"><div class="conteneur grille-2">
    <div>${tete}</div><div><ul class="points">${A.map((a) => `<li data-reveal><h3>${a.titre}</h3><p>${a.texte}</p></li>`).join('')}</ul>${avert}</div></div></section>`;
  if (v === 'grille') return `<section class="section apports apports--grille" id="apports"><div class="conteneur">${tete}
    <ul class="grille-apports">${A.map((a, i) => `<li data-reveal style="--o:${i}"><span class="grille__num">0${i + 1}</span><h3>${a.titre}</h3><p>${a.texte}</p></li>`).join('')}</ul>${avert}</div></section>`;
  return `<section class="section apports apports--cartes" id="apports"><div class="conteneur">${tete}
    <ul class="cartes">${A.map((a, i) => `<li class="carte" data-reveal style="--o:${i}">${imgs.length ? `<figure class="carte__image" aria-hidden="true">${img(X, imgs[i % imgs.length], { sizes: '(min-width: 1100px) 25vw, (min-width: 640px) 50vw, 100vw' })}</figure>` : ''}<span class="carte__num">0${i + 1}</span><h3>${a.titre}</h3><p>${a.texte}</p></li>`).join('')}</ul>${avert}</div></section>`;
}

/* --- tarifs --------------------------------------------------------------- */
export function tarifs(C, v) {
  const T = C.tarifs;
  const tete = `${etiquette('04', 'Tarifs')}${titre(T.length ? 'Mes <em>tarifs</em>' : 'Vos <em>tarifs</em>')}`;
  const formules = emplacement('emplacement--tarifs', 'liste', T.length ? 'Ici, le détail de vos formules' : 'Ici, vos tarifs', T.length ? 'Première séance, suivi, forfaits, bons cadeaux&#8239;: chaque tarif aura sa ligne, comme vous le souhaitez.' : 'Exactement comme vous les pratiquez&#8239;: à la séance, en forfait, en bon cadeau. Rien n’est affiché tant que vous ne l’avez pas donné.');
  const paiement = C.paiement ? `<p class="tarif__paiement" data-reveal>${C.paiement}</p>` : '';
  if (!T.length) return `<section class="section tarifs tarifs--vide" id="tarifs"><div class="conteneur grille-2"><div>${tete}${paiement}${bouton(C, 'Réserver par téléphone')}</div><div>${formules}</div></div></section>`;
  const details = [['Première séance', C.dureePremiere], ['Séances de suivi', C.dureeSuivi], ['Lieu', C.ville ? `${C.ville}, sur rendez-vous` : '']].filter((d) => d[1]);
  const prixHtml = (p) => p.replace(' à ', ' <small>à</small> ');
  if (v === 'tableau') return `<section class="section tarifs tarifs--tableau" id="tarifs"><div class="conteneur">${tete}
    <table class="tableau" data-reveal><caption class="visuellement-cache">Tarifs</caption><thead><tr><th scope="col">Prestation</th><th scope="col">Durée</th><th scope="col">Tarif</th></tr></thead>
    <tbody>${T.map((t, i) => `<tr><th scope="row">${t.nom}</th><td>${i === 0 && C.dureePremiere ? `première séance ${C.dureePremiere}${C.dureeSuivi ? `<br>suivi ${C.dureeSuivi}` : ''}` : ''}</td><td class="tableau__prix">${t.prix}</td></tr>`).join('')}</tbody></table>
    ${paiement}<div class="tarifs__pied">${bouton(C, 'Réserver par téléphone')}${formules}</div></div></section>`;
  if (v === 'liste') return `<section class="section tarifs tarifs--liste" id="tarifs"><div class="conteneur grille-2">
    <div>${tete}${paiement}${bouton(C, 'Réserver par téléphone')}</div>
    <div><ul class="liste-tarifs" data-reveal>${T.map((t) => `<li class="liste-tarifs__principal"><span>${t.nom}</span><i aria-hidden="true"></i><b>${t.prix}</b></li>`).join('')}${details.map(([a, b]) => `<li><span>${a}</span><i aria-hidden="true"></i><b>${b}</b></li>`).join('')}</ul>${formules}</div></div></section>`;
  return `<section class="section tarifs tarifs--carte" id="tarifs"><div class="conteneur">${tete}
    <div class="tarifs__grille"><article class="tarif" data-reveal><p class="tarif__nom">${T[0].nom}</p><p class="tarif__prix">${prixHtml(T[0].prix)}</p>
    <ul class="tarif__details">${T.slice(1).map((t) => `<li><span>${t.nom}</span><span>${t.prix}</span></li>`).join('')}${details.map(([a, b]) => `<li><span>${a}</span><span>${b}</span></li>`).join('')}</ul>
    ${C.paiement ? `<p class="tarif__paiement">${C.paiement}</p>` : ''}${bouton(C, 'Réserver par téléphone')}</article>${formules}</div></div></section>`;
}

/* --- a propos ------------------------------------------------------------- */
export function apropos(C, v, o, X) {
  const portrait = `<figure class="portrait portrait--${o.cadre || 'arche'}" data-reveal>
    <div class="portrait__cadre" data-initiales="${esc(C.initiales)}">${o.fond !== undefined ? img(X, o.fond, { cls: 'portrait__fond', sizes: '(min-width: 900px) 35vw, 80vw' }) : ''}<span class="emplacement__icone" aria-hidden="true">${ICONES.portrait}</span><span class="portrait__ici">Ici, votre portrait</span></div>
    <figcaption>Une photo de vous, simple et lumineuse, prendra cette place.</figcaption></figure>`;
  const A = C.apropos;
  const textes = A.length
    ? `${etiquette('05', 'À propos')}${titre('Qui <em>suis-je&#8239;?</em>')}<p class="chapeau" data-reveal>${A.slice(0, 2).join(' ')}</p>${A.slice(2).map((p) => `<p data-reveal>${p}</p>`).join('')}<p class="signature" data-reveal>${esc(C.nom)}</p>`
    : `${etiquette('05', 'À propos')}${titre(esc(C.nom))}<p class="chapeau" data-reveal>${esc(C.metier)}${C.ville ? ` à ${esc(C.ville)}` : ''}, ${esc(C.rdv.toLowerCase())}.</p>${emplacement('emplacement--texte', 'plume', 'Ici, votre parcours', 'Votre histoire, vos formations, ce qui vous anime dans ce métier. Quelques lignes suffisent pour que l’on ait envie de vous rencontrer.')}`;
  const cerf = C.cerf ? `<figure class="cerf cerf--${o.cerf || 'simple'}" data-reveal><svg class="cerf__ornement" viewBox="0 0 120 40" aria-hidden="true"><path pathLength="1" d="M60 38 C60 26 56 18 48 12 M48 12 C42 8 36 8 30 4 M48 12 C46 6 47 3 50 1 M54 20 C48 18 42 20 38 16 M60 38 C60 26 64 18 72 12 M72 12 C78 8 84 8 90 4 M72 12 C74 6 73 3 70 1 M66 20 C72 18 78 20 82 16"/></svg><blockquote data-split>${C.cerf}</blockquote><figcaption>${esc(C.nom)}</figcaption></figure>` : '';
  const avis = emplacement('emplacement--avis', 'avis', 'Ici, les mots de vos consultants', 'Les avis que vous avez déjà reçus pourront être repris ici, avec votre accord.');
  return `<section class="section apropos apropos--${o.cote || 'gauche'}" id="apropos"><div class="conteneur grille-2 apropos__grille">${portrait}<div class="texte">${textes}</div></div>
    <div class="conteneur">${cerf}${avis}</div></section>`;
}

/* --- questions ------------------------------------------------------------ */
export function faq(C, v) {
  const Q = questions(C);
  return `<section class="section questions questions--${v || 'deux'}" id="questions"><div class="conteneur grille-2">
    <div>${etiquette('06', 'Questions fréquentes')}${titre('Avant de <em>venir</em>')}</div>
    <div class="faq">${Q.map(([q, r]) => `<details data-reveal><summary><span>${q}</span></summary><div class="faq__reponse"><p>${r}</p></div></details>`).join('')}</div></div></section>`;
}

/* --- contact -------------------------------------------------------------- */
export function contact(C, v, o, X) {
  const lieu = [C.ville && `${esc(C.ville)}${C.cp ? `, ${C.cp}` : ''}`, C.region && esc(C.region)].filter(Boolean).join('<br>');
  const ailleurs = [C.facebook && `<a class="lien" href="${esc(C.facebook)}" rel="noopener">Facebook</a>`, C.resalib && `<a class="lien" href="${esc(C.resalib)}" rel="noopener">Réserver en ligne</a>`].filter(Boolean).join('<br>');
  const infos = `<dl class="infos" data-reveal>${lieu ? `<div><dt>Où</dt><dd>${lieu}</dd></div>` : ''}<div><dt>Quand</dt><dd>${esc(C.rdv)}</dd></div>${C.paiementListe ? `<div><dt>Paiement</dt><dd>${C.paiementListe.replace(/^./, (m) => m.toUpperCase())}</dd></div>` : ''}${ailleurs ? `<div><dt>Ailleurs</dt><dd>${ailleurs}</dd></div>` : ''}</dl>`;
  const plan = emplacement('emplacement--plan', 'lieu', 'Ici, l’adresse exacte de votre cabinet', 'Avec un plan d’accès et les indications pour venir.');
  const corps = `${etiquette('07', 'Contact et rendez-vous')}${titre(`Un ${C.parMail ? 'message' : 'appel'} <em>suffit</em>`)}<p class="contact__texte" data-reveal>Dites-moi ce qui vous amène, et nous trouvons ensemble le créneau qui vous convient.</p>
    <a class="contact__tel" href="${C.telLien}" data-reveal><span class="contact__num">${C.tel}</span><span class="contact__cta">${C.appeler} maintenant ${fleche}</span></a>`;
  if (v === 'image') return `<section class="contact contact--image" id="contact"><div class="contact__fond" aria-hidden="true">${img(X, o.img, { parallaxe: '0.12' })}<div class="contact__voile"></div></div>
    <div class="conteneur contact__panneau">${corps}${infos}</div><div class="conteneur">${plan}</div></section>`;
  if (v === 'panneau') return `<section class="section contact contact--panneau" id="contact"><div class="conteneur"><div class="contact__panneau">${corps}${infos}</div>${plan}</div></section>`;
  return `<section class="section contact contact--simple" id="contact"><div class="conteneur grille-2"><div>${corps}</div><div>${infos}${plan}</div></div></section>`;
}

/* --- pied de page --------------------------------------------------------- */
export function pied(C) {
  const siret = C.siret ? `<p>SIRET ${C.siret.replace(/^(\d{3})(\d{3})(\d{3})(\d{5})$/, '$1 $2 $3 $4')}</p>` : '<p></p>';
  return `<footer class="pied"><div class="conteneur">
    <p class="pied__nom">${esc(C.nom)}</p>
    <p class="pied__metier">${esc(C.metier)}${C.ville ? ` à ${esc(C.ville)}` : ''}&nbsp;· ${esc(C.rdv)}&nbsp;· <a class="lien" href="${C.telLien}">${C.tel}</a></p>
    <p class="pied__avert">${C.avertissement}</p>
    <div class="pied__bas">${siret}<p class="pied__apercu">${C.apercu}</p></div></div></footer>`;
}

export const BLOCS = { accueil, approche, seance, apports, tarifs, apropos, questions: faq, contact };

/** Questions frequentes : uniquement a partir de faits presents. */
export function questions(C) {
  const q = [];
  if (C.dureePremiere) q.push(['Combien de temps dure une séance ?', `La première séance dure ${C.dureePremiere}.${C.dureeSuivi ? ` Les séances de suivi durent ${C.dureeSuivi}.` : ''}`]);
  const prix = C.tarifs.find((t) => /\d/.test(t.prix));
  if (prix) q.push(['Combien coûte une séance ?', `${prix.nom} : ${prix.prix}.${C.paiementListe ? ` Paiement en ${C.paiementListe}.` : ''}`]);
  if (C.ville) q.push(['Où ont lieu les séances ?', `À ${C.ville}${C.cp ? ` (${C.cp})` : ''}, ${C.rdv.toLowerCase()}.`]);
  q.push(['Comment prendre rendez-vous ?', C.parMail ? `Par courriel, à ${C.tel}.` : `Par téléphone, au ${C.tel}.`]);
  q.push(['Les séances remplacent-elles un suivi médical ?', 'Non. ' + C.avertissement]);
  return q;
}
