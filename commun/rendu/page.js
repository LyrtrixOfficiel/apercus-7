// Fabrique une page complete pour un praticien et une direction.
// ctx.chemins : prefixes vers les fichiers communs (feuilles, scripts, images,
// vignettes), differents entre le prototype local et la publication.
import { BLOCS, nav, pied } from './blocs.js';
import { DIRECTIONS } from './directions.js';
import { FAMILLES } from './visuels.js';

const NIVEAUX = [['immersive', 'Immersives'], ['animee', 'Animées'], ['sobre', 'Sobres']];
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Noms longs : la taille du nom suit son mot le plus long et sa longueur totale. */
export function reduction(nom) {
  const mots = String(nom).split(/[\s-]+/).filter(Boolean);
  const plusLong = Math.max(...mots.map((m) => m.length), 1);
  // plancher 0,5 ; 0,3 pour les tres longs noms (enseigne + metiers), sinon ils couvrent tout l'accueil
  return Math.max(String(nom).length > 52 ? 0.3 : 0.5, Math.min(1, 10 / plusLong, 26 / String(nom).length));
}

/* Les mots composes (« rendez-vous », « mieux-être ») ne se coupent jamais au
   trait d'union : proteges dans le texte, jamais dans les balises ni le titre. */
function insecables(html) {
  let protege = false;
  return html.split(/(<[^>]+>)/).map((m) => {
    // Le nom du praticien reste libre : « Lefillastre-Guilloux » peut passer a la ligne apres le trait d'union.
    if (m.startsWith('<')) { if (/^<(script|style|title)\b|class="(ac__nom|pied__nom|marque__nom)"/i.test(m)) protege = true; if (/^<\/(script|style|title|h1)>/i.test(m) || (protege && /^<\/(p|span)>/.test(m))) protege = false; return m; }
    // le mot compose emporte sa ponctuation : jamais de virgule seule en debut de ligne
    return protege ? m : m.replace(/([A-Za-zÀ-ÿ’]+(?:-[A-Za-zÀ-ÿ]+)+(?:[,.;:!?…]| [;:!?])?)/g, '<span class="nw">$1</span>');
  }).join('');
}

/* Filet de securite : la regle du depot interdit les tirets cadratins et demi-cadratins partout. */
const sansTiret = (h) => h.replace(/\s+[\u2013\u2014]\s+/g, ', ').replace(/[\u2013\u2014]/g, '-');

export function panneau(cle, ctx) {
  const d = DIRECTIONS[cle];
  const groupes = NIVEAUX.map(([n, titre]) => `<p class="ambiances__groupe">${titre}</p><div class="ambiances__liste">${
    Object.entries(DIRECTIONS).filter(([, x]) => x.niveau === n).map(([k, x]) => `<a class="ambiances__choix" href="${ctx.liens[k]}"${k === cle ? ' aria-current="page"' : ''}>
      <span class="ambiances__vignette" style="--v:${x.couleurs[0]}"><img src="${ctx.chemins.vign}${ctx.famille}-${k}.webp" alt="" width="480" height="300" loading="lazy">${k === ctx.auto ? '<span class="ambiances__marque">Proposée pour vous</span>' : ''}</span>
      <span class="ambiances__nom">${x.nom}${k === cle ? ' · actuelle' : ''}</span><span class="ambiances__desc">${x.phrase}</span></a>`).join('')}</div>`).join('');
  return `<div class="ambiances" id="ambiances">
  <div class="ambiance-bulle" role="status"><b>Ce site existe en 8 ambiances.</b>Essayez-les&#8239;: même contenu, autre mise en scène.<button type="button" aria-label="Fermer l’invitation">×</button></div>
  <button class="ambiances__bouton" type="button" aria-expanded="false" aria-controls="ambiances-panneau">
    <span class="ambiances__pastilles" aria-hidden="true">${d.couleurs.map((c) => `<i style="background:${c}"></i>`).join('')}</span>
    <span>Changer d’ambiance<small>Actuelle&#8239;: ${d.nom}</small></span></button>
  <div class="ambiances__fond" data-fermer></div>
  <div class="ambiances__panneau" id="ambiances-panneau" role="dialog" aria-modal="true" aria-labelledby="ambiances-titre">
    <span class="ambiances__poignee" aria-hidden="true"></span>
    <div class="ambiances__tete"><div><h2 class="ambiances__titre" id="ambiances-titre">Choisissez l’ambiance de votre site</h2>
      <p class="ambiances__sous">Le même contenu, huit mises en scène. Vous pourrez en changer à tout moment.</p></div>
      <button class="ambiances__fermer" type="button" data-fermer aria-label="Fermer">×</button></div>
    ${groupes}</div></div>`;
}

export function page(C, cle, ctx) {
  const d = DIRECTIONS[cle];
  const X = { jeu: FAMILLES[ctx.famille][d.humeur], video: FAMILLES[ctx.famille].video, base: ctx.chemins.img };
  const sections = d.sections.map(([bloc, variante, options]) => BLOCS[bloc](C, variante, options || {}, X)).join('\n');
  const reduc = reduction(C.nom).toFixed(2);
  /* Mode « echelle » : une seule page par praticien. Les autres ambiances sont
     redessinees dans le navigateur (commun/app.js + commun/rendu/) a partir de
     donnees.json ; le panneau est construit par le script, l'adresse garde le
     choix (#ambiance=nuit). */
  const echelle = ctx.mode === 'echelle';
  const html = sansTiret(insecables(`<!doctype html>
<html lang="fr" data-direction="${cle}" style="--reduc:${reduc}"${echelle ? ` data-famille="${ctx.famille}" data-auto="${ctx.auto}" data-commun="${ctx.chemins.commun}"` : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(C.nom)} · ${esc(C.metier)}${C.ville ? ` à ${esc(C.ville)}` : ''}</title>
<meta name="description" content="${esc(C.nom)}, ${esc(C.metier.toLowerCase())}${C.ville ? ` à ${esc(C.ville)}` : ''}. ${esc(C.accroche)}">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="${d.couleurs[0]}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${d.polices.replace(/&/g, '&amp;')}" data-polices>
<link rel="stylesheet" href="${ctx.chemins.css}base.css">
<link rel="stylesheet" href="${ctx.chemins.css}blocs.css">
<link rel="stylesheet" href="${ctx.chemins.dir}${cle}.css" data-feuille-direction>
<script>
/* Etats de depart des animations seulement si le script tourne ; sinon, au bout
   de 4 s, tout s'affiche. */
document.documentElement.classList.add('js');${echelle ? `
/* Lien partage vers une autre ambiance : on masque la page le temps de la redessiner. */
(function (R, m) { if (m && m[1] !== R.getAttribute('data-auto')) R.classList.add('rendu-attente'); })(document.documentElement, /[#&]ambiance=([a-z]+)/.exec(location.hash));
setTimeout(function () { document.documentElement.classList.remove('rendu-attente'); }, 4000);` : ''}
setTimeout(function () { if (!window.__siteOk) document.documentElement.classList.remove('js'); }, 4000);
</script>
<script src="${ctx.chemins.css}app.js" defer></script>
</head>
<body>
<a class="evitement" href="#approche">Aller au contenu</a>
${nav(C, d.nav)}
<main>
${sections}
</main>
${pied(C)}
${ctx.panneau === false || echelle ? '' : panneau(cle, ctx)}
</body>
</html>
`));
  // A l'echelle, chaque octet compte : on retire l'indentation (sans effet sur le rendu).
  return echelle ? html.replace(/\n[ \t]+/g, '\n') : html;
}
export { DIRECTIONS };
