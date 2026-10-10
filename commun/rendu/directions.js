// Les huit directions. Chacune est une COMPOSITION : un type de navigation,
// un accueil, et pour chaque section la variante de bloc. Les visuels ne sont
// plus nommes ici : une section demande des places (0, 1, 2...) dans le jeu de
// la famille du metier (gabarit/visuels.mjs), lumineux ou sombre selon
// l'humeur de la direction. Couleurs, polices et animations :
// prototype/directions/<cle>.css.
//
// niveau : « immersive » (on se dit waouh), « animee » (elegante et vivante),
// « sobre » (classique, pour les praticiens reserves).

const GF = 'https://fonts.googleapis.com/css2?family=';

export const DIRECTIONS = {
  nuit: {
    nom: 'Nuit', niveau: 'immersive', humeur: 'sombre', phrase: 'Immersive, avec vidéo : noir et or, cinématographique',
    polices: GF + 'Cormorant:ital,wght@0,300..600;1,300..500&family=Jost:wght@300..500&display=swap',
    couleurs: ['#08080a', '#c9a45c', '#eee8dc'], nav: 'plein-ecran',
    sections: [
      ['accueil', 'video', { video: true }],
      ['approche', 'citation'],
      ['seance', 'recit', { imgs: [0, 1, 2, 3] }],
      ['apports', 'lignes', { imgs: [4, 5, 1, 2] }],
      ['tarifs', 'carte'],
      ['apropos', 'portrait', { cadre: 'arche', fond: 5, cerf: 'geant' }],
      ['questions', 'deux'],
      ['contact', 'image', { img: 1 }],
    ],
  },
  horizon: {
    nom: 'Horizon', niveau: 'immersive', humeur: 'lumineux', phrase: 'Immersive : grands paysages, défilement horizontal',
    polices: GF + 'Bellefair&family=Albert+Sans:wght@300..600&display=swap',
    couleurs: ['#f3f5f4', '#3f6075', '#1d2a33'], nav: 'laterale',
    sections: [
      ['accueil', 'partage', { img: 0 }],
      ['approche', 'image', { img: 1, cote: 'droite', parallaxe: '0.08' }],
      ['seance', 'horizontal', { imgs: [2, 3, 4, 5] }],
      ['apports', 'grille'],
      ['tarifs', 'liste'],
      ['apropos', 'portrait', { cadre: 'haut-arrondi', fond: 3, cote: 'droite' }],
      ['questions', 'deux'],
      ['contact', 'image', { img: 4 }],
    ],
  },
  aurore: {
    nom: 'Aurore', niveau: 'immersive', humeur: 'lumineux', phrase: 'Immersive : lumière vivante, photos en apesanteur',
    polices: GF + 'Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300..600&display=swap',
    couleurs: ['#fbf7f8', '#c86684', '#251f30'], nav: 'flottante',
    sections: [
      ['accueil', 'affiche', { imgs: [0, 1, 2] }],
      ['approche', 'citation'],
      ['seance', 'empile'],
      ['apports', 'bento', { imgs: [3] }],
      ['tarifs', 'carte'],
      ['apropos', 'portrait', { cadre: 'cercle', fond: 4, cerf: 'geant' }],
      ['questions', 'deux'],
      ['contact', 'panneau'],
    ],
  },
  terre: {
    nom: 'Terre', niveau: 'animee', humeur: 'lumineux', phrase: 'Animée : chaleureuse, mosaïque de photos',
    polices: GF + 'Bricolage+Grotesque:opsz,wght@12..96,300..700&family=Figtree:wght@400..600&display=swap',
    couleurs: ['#d8c5ac', '#793c10', '#26170f'], nav: 'barre',
    sections: [
      ['accueil', 'mosaique', { imgs: [0, 1, 2] }],
      ['approche', 'magazine'],
      ['seance', 'frise'],
      ['apports', 'cartes', { imgs: [3, 4, 5, 1] }],
      ['tarifs', 'liste'],
      ['apropos', 'portrait', { cadre: 'galet', fond: 5 }],
      ['questions', 'deux'],
      ['contact', 'simple'],
    ],
  },
  vegetal: {
    nom: 'Végétal', niveau: 'animee', humeur: 'sombre', phrase: 'Animée : sombre et profonde, une carte posée sur une photo',
    polices: GF + 'Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500&family=Outfit:wght@300..500&display=swap',
    couleurs: ['#0c1812', '#b8d48f', '#e7efe2'], nav: 'centree',
    sections: [
      ['accueil', 'carte', { img: 0 }],
      ['approche', 'image', { img: 1, cote: 'gauche' }],
      ['seance', 'accordeon', { img: 2 }],
      ['apports', 'feuilles', { imgs: [3, 4, 5, 0] }],
      ['tarifs', 'carte'],
      ['apropos', 'portrait', { cadre: 'arche', fond: 4, cote: 'droite' }],
      ['questions', 'deux'],
      ['contact', 'image', { img: 3 }],
    ],
  },
  zen: {
    nom: 'Zen', niveau: 'animee', humeur: 'lumineux', phrase: 'Animée : épurée, beaucoup de vide, un trait de pinceau',
    polices: GF + 'Shippori+Mincho:wght@400;500;600&family=Zen+Kaku+Gothic+New:wght@300;400;500&display=swap',
    couleurs: ['#f1f0eb', '#a32d24', '#151514'], nav: 'panneau',
    sections: [
      ['accueil', 'vide', { img: 0 }],
      ['approche', 'vertical'],
      ['seance', 'colonnes'],
      ['apports', 'points'],
      ['tarifs', 'liste'],
      ['apropos', 'portrait', { cadre: 'carre', fond: 1 }],
      ['questions', 'deux'],
      ['contact', 'simple'],
    ],
  },
  lin: {
    nom: 'Lin', niveau: 'sobre', humeur: 'lumineux', phrase: 'Sobre et classique : clair, une fenêtre en arche',
    polices: GF + 'Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..500&family=Mulish:wght@300..600&display=swap',
    couleurs: ['#f7f3ec', '#2f3e5c', '#1f2433'], nav: 'centree',
    sections: [
      ['accueil', 'partage', { img: 0, cadre: 'arche' }],
      ['approche', 'image', { img: 1, cote: 'droite' }],
      ['seance', 'liste'],
      ['apports', 'points'],
      ['tarifs', 'tableau'],
      ['apropos', 'portrait', { cadre: 'arche', fond: 2 }],
      ['questions', 'deux'],
      ['contact', 'simple'],
    ],
  },
  ardoise: {
    nom: 'Ardoise', niveau: 'sobre', humeur: 'lumineux', phrase: 'Sobre et moderne : grande typographie, très lisible',
    polices: GF + 'Schibsted+Grotesk:ital,wght@0,400..800;1,400..600&family=Spectral:ital,wght@0,300;1,300;1,400&display=swap',
    couleurs: ['#eef0f1', '#2f4a5b', '#16191c'], nav: 'barre',
    sections: [
      ['accueil', 'typo', { img: 0 }],
      ['approche', 'magazine'],
      ['seance', 'colonnes'],
      ['apports', 'grille'],
      ['tarifs', 'tableau'],
      ['apropos', 'portrait', { cadre: 'rect', fond: 1, cote: 'droite' }],
      ['questions', 'deux'],
      ['contact', 'simple'],
    ],
  },
};

/* ---------------------------------------------------------------------------
   Choix automatique : la famille du metier donne trois directions, une par
   niveau (immersive, animee, sobre). L'empreinte du nom de dossier en choisit
   une ; le praticien peut toujours en changer depuis le panneau d'ambiances.
   --------------------------------------------------------------------------- */
export const TRIOS = {
  calme: ['nuit', 'zen', 'lin'],
  toucher: ['aurore', 'terre', 'lin'],
  plantes: ['horizon', 'vegetal', 'lin'],
  yoga: ['horizon', 'zen', 'ardoise'],
  energie: ['nuit', 'vegetal', 'ardoise'],
  accompagnement: ['aurore', 'terre', 'ardoise'],
  perinatal: ['aurore', 'vegetal', 'lin'],
};
export function empreinte(s) {
  let h = 0x811c9dc5;
  for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return h;
}
export function choisirDirection(famille, cleDossier) {
  const trio = TRIOS[famille] || TRIOS.calme;
  return trio[empreinte(cleDossier) % trio.length];
}
