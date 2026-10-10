// Les visuels, par famille de metier, en deux humeurs : « lumineux » (lumiere
// naturelle douce, tons clairs) et « sombre » (clair-obscur, lumiere chaude).
// Une direction claire ne pioche que dans le jeu lumineux de la famille, une
// direction sombre (Nuit, Vegetal) que dans le jeu sombre : sur une page, toutes
// les photos partagent donc la meme lumiere et la meme palette.
//
// CDN : cle de la photo sur images.unsplash.com (verifiee page par page, licence
// Unsplash, aucun visage ni marque). Les pages d'origine sont dans
// gabarit/candidats-*.jsonl et prototype/CREDITS.md.

export const CDN = {
  // premiere bibliotheque
  'nuit-bougie': '1768935390834', 'nuit-eau-reflets': '1758110281285', 'nuit-eau-ondes': '1662014329616',
  'nuit-encens': '1627769916425', 'nuit-fumee': '1723997774348', 'nuit-etoiles-lac': '1663010478036',
  'nuit-feuilles': '1687463221057', 'nuit-roche': '1701105040869',
  'horizon-lac-bleu': '1776595900864', 'horizon-lac-foret': '1784655597870', 'horizon-brume': '1758243488200',
  'horizon-dunes': '1698471058817', 'horizon-montagnes': '1521729839347', 'horizon-mer': '1491920239164',
  'aurore-sommets': '1772733694354', 'aurore-nuages': '1779380033776', 'aurore-mer': '1474540412665',
  'aurore-ciel-ocean': '1765120401542', 'aurore-petales': '1754190855116',
  'terre-main-argile': '1422246358533', 'terre-tour': '1753164725860', 'terre-bols': '1530006498959', 'terre-pots': '1484811804487',
  'vegetal-fougere': '1755004609166', 'vegetal-fougere-foret': '1732525830182', 'vegetal-fougere-sombre': '1689495024006',
  'vegetal-ombre-mur': '1600172454132', 'vegetal-ombre-chene': '1748257615880', 'vegetal-sous-bois': '1785648755113',
  'vegetal-gouttes': '1487017931017',
  'zen-jardin-sec': '1757829315863', 'zen-jardin': '1766585464570', 'zen-pierres-mer': '1541834167531',
  'zen-pierres-soir': '1530368333607', 'zen-bambous': '1714758461816', 'zen-bambouseraie': '1531021713651',
  'zen-galets-eau': '1750325679006', 'zen-galets-plage': '1764054655220',
  'lin-rideaux': '1752216581624', 'lin-soleil': '1708471497203', 'lin-tissu': '1528458909336',
  'lin-fleurs-lumiere': '1781875483636', 'lin-vase': '1744549259903',
  'ardoise-roche': '1762088875280', 'ardoise-galets': '1559621768', 'ardoise-equilibre': '1619478092483',
  'ardoise-mer': '1599394156868', 'commun-main-pierre': '1756432013586',
  // jeux par metier (10 octobre)
  'perinatal-tricot': '1598871956091', 'perinatal-draps': '1639690222445', 'perinatal-tulipes': '1706713115353',
  'perinatal-voilage-soir': '1768577908037', 'perinatal-chambre': '1593030019566', 'perinatal-coton': '1705147293352',
  'perinatal-lampe': '1749226949594', 'perinatal-bougie': '1698953185826', 'perinatal-fenetre-soir': '1686395810129',
  'perinatal-hortensias': '1610815496193', 'perinatal-bougies': '1744918712163',
  'plantes-tisane': '1514733670139', 'plantes-bol-herbes': '1691391611977', 'plantes-fleurs-champ': '1767471263304',
  'plantes-aromatiques': '1551808412', 'plantes-camomille': '1618673713291', 'plantes-sauge': '1726994804363',
  'plantes-fleurs-nuit': '1713299712536', 'plantes-romarin': '1737042680441', 'plantes-fleurs-violettes': '1695826524570',
  'plantes-fleurs-fanees': '1646657125178',
  'energie-rayons': '1495926086070', 'energie-bol': '1700423523690', 'energie-plume': '1600048225192',
  'energie-voile': '1776472603139', 'energie-violon': '1676201452253', 'energie-bol-main': '1786840228879',
  'energie-cristal': '1652118845236', 'energie-bougeoir': '1774647004210',
  'accomp-carnets': '1635253547947', 'accomp-fauteuils': '1776313756922', 'accomp-carnet-tasse': '1465314659012',
  'accomp-crayons': '1513542789411', 'accomp-fenetre-mer': '1672928988471', 'accomp-lampe': '1523380262778',
  'accomp-fauteuil-soir': '1744559244044', 'accomp-allee': '1787083281132', 'accomp-tasse': '1787167653518',
  'toucher-serviettes-bougie': '1706795033855', 'toucher-serviettes': '1706795033849', 'toucher-pied': '1675159364615',
  'toucher-dos': '1741522509438', 'toucher-galets': '1780599994472', 'toucher-flacons': '1671492246169',
  'toucher-basalte': '1591020330942', 'toucher-bougie-lavande': '1693567398116', 'toucher-photophores': '1706795033917',
  'toucher-pierres-bougie': '1597010803327', 'toucher-galets-bougie': '1597010804526', 'toucher-basalte-noir': '1578413142862',
  'yoga-blocs': '1646239646963', 'yoga-panier': '1767605528683', 'yoga-tapis-bleus': '1676686055281',
  'yoga-studio': '1761971975858', 'yoga-grand-studio': '1761971975962', 'yoga-salle-sombre': '1687783615476',
  'yoga-tapis-fenetre': '1780589093361', 'yoga-salle-doree': '1687783615494', 'yoga-meditation': '1760624492217',
  'yoga-rai': '1763004871583', 'yoga-tables': '1767327863182',
};

/* Chaque jeu : 6 photos au moins. L'ordre compte : la premiere sert d'accueil. */
export const FAMILLES = {
  calme: {
    nom: 'Calme et souffle', video: 'souffle',
    lumineux: ['horizon-brume', 'horizon-mer', 'zen-galets-eau', 'horizon-lac-foret', 'ardoise-equilibre', 'lin-rideaux', 'aurore-ciel-ocean'],
    sombre: ['nuit-bougie', 'nuit-eau-reflets', 'nuit-encens', 'nuit-etoiles-lac', 'nuit-eau-ondes', 'nuit-roche'],
  },
  toucher: {
    nom: 'Toucher et soins', video: 'toucher',
    lumineux: ['toucher-serviettes', 'toucher-dos', 'toucher-galets', 'toucher-flacons', 'toucher-pied', 'toucher-bougie-lavande', 'toucher-basalte', 'toucher-serviettes-bougie'],
    sombre: ['toucher-pierres-bougie', 'toucher-photophores', 'toucher-galets-bougie', 'toucher-basalte-noir', 'nuit-bougie', 'commun-main-pierre'],
  },
  plantes: {
    nom: 'Plantes et nature', video: 'plantes',
    lumineux: ['plantes-camomille', 'plantes-bol-herbes', 'plantes-aromatiques', 'plantes-fleurs-champ', 'plantes-sauge', 'vegetal-ombre-mur', 'plantes-tisane'],
    sombre: ['plantes-fleurs-nuit', 'plantes-romarin', 'vegetal-fougere-sombre', 'plantes-fleurs-violettes', 'nuit-feuilles', 'plantes-fleurs-fanees'],
  },
  yoga: {
    nom: 'Yoga et mouvement', video: 'bambou',
    lumineux: ['yoga-studio', 'yoga-tapis-fenetre', 'yoga-blocs', 'yoga-grand-studio', 'yoga-panier', 'yoga-tapis-bleus'],
    sombre: ['yoga-salle-doree', 'yoga-meditation', 'yoga-rai', 'yoga-tables', 'yoga-salle-sombre', 'nuit-bougie'],
  },
  energie: {
    nom: 'Énergie et son', video: 'lumiere',
    lumineux: ['energie-plume', 'energie-bol', 'energie-voile', 'energie-rayons', 'energie-violon', 'aurore-ciel-ocean'],
    sombre: ['energie-cristal', 'energie-bol-main', 'energie-bougeoir', 'nuit-etoiles-lac', 'nuit-bougie', 'nuit-fumee'],
  },
  accompagnement: {
    nom: 'Accompagnement', video: 'brume',
    lumineux: ['accomp-fauteuils', 'accomp-carnet-tasse', 'accomp-carnets', 'accomp-fenetre-mer', 'accomp-crayons', 'horizon-mer'],
    sombre: ['accomp-fauteuil-soir', 'accomp-lampe', 'accomp-allee', 'accomp-tasse', 'nuit-bougie', 'nuit-eau-reflets'],
  },
  perinatal: {
    nom: 'Périnatalité', video: 'fleur-blanche',
    lumineux: ['perinatal-draps', 'perinatal-coton', 'perinatal-tricot', 'perinatal-tulipes', 'perinatal-chambre', 'lin-tissu'],
    sombre: ['perinatal-bougie', 'perinatal-hortensias', 'perinatal-fenetre-soir', 'perinatal-bougies', 'perinatal-voilage-soir', 'perinatal-lampe'],
  },
};

const sansAccent = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
/* L'ordre compte : « Réflexologie bébé et accompagnement parental » est d'abord périnatal,
   « Naturopathe réflexologie » d'abord plantes, « Reiki sonothérapeute yoga du son » d'abord énergie. */
const REGLES = [
  [/doula|perinat|sage-femme|bebe|maternit|naissance|parental|portage/, 'perinatal'],
  [/reiki|magnet|energet|sonoth|chaman|astrolog|musicoth|lithoth|bols? chantant/, 'energie'],
  [/yoga|qi ?gong|tai ?chi|pilates/, 'yoga'],
  [/naturo|phyto|herbor|aroma|fleurs de bach|nutri|diet|ayurv|plante|soins naturels|medecines? douces/, 'plantes'],
  [/massage|masseu|reflexo|shiatsu|somatopath|esthet|kinesi|osteo|medecine chinoise|tuina|drainage|soin du corps/, 'toucher'],
  [/coach|pnl|eft|art-?ther|psycho|gestalt|formateur|formatrice|sexo|constellation/, 'accompagnement'],
];
export function familleDe(metier) {
  const m = sansAccent(metier);
  return (REGLES.find(([re]) => re.test(m)) || [null, 'calme'])[1];
}
