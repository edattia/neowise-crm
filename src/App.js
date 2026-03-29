import { useState, useRef } from "react";

// ═══════════════════════════════════════════════════════════
// DONNÉES
// ═══════════════════════════════════════════════════════════
const USERS = [
  { id: "elie", name: "Elie-Dan ATTIA", role: "Expert-Comptable & CAC", initials: "EA", color: "#1a5c8a" },
  { id: "collab", name: "Collaboratrice", role: "Collaboratrice", initials: "CO", color: "#2d7a4f" },
];

const today = new Date("2026-03-28");
const fmt = (d) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
const fmtM = (n) => (n || 0).toLocaleString("fr-FR") + " €";
const daysLeft = (d) => Math.ceil((new Date(d) - today) / 86400000);


const makeClient = (id, nom, email, tel, siret, adresse, ville, cp) => ({
  id, nom, email: email||"", tel: tel||"", siret: siret||"",
  adresse: adresse||"", ville: ville||"", cp: cp||"",
  forme: "À définir", tva: "À définir", activite: "", ca: 0, contact: "",
  responsable: "elie", statut: "En cours", honorairesMensuels: 0,
  avancement: { saisie: 0, rapprochement: 0, declarations: 0, bilan: 0 },
  docs: [], demandes: [], factures: [], temps: [], lettresMission: [],
  echeancesIds: [], notes: "",
});

const INITIAL_CLIENTS = [
  makeClient(100,"SYNERGIES SVA","","","83819100000000","10 RUE DE L'HOTEL DE VILLE","SERGINES","89140"),
  makeClient(101,"HERVE BURGUIERE CONSEILS H.B. CONSEILS","","","41043900000000","88 RUE GRIGNAN","MARSEILLE","13001"),
  makeClient(102,"L'ANTIDOTE","aliboogistyle@gmail.com","","78925800000000","132 BOULEVARD DE LA BLANCARDE","MARSEILLE","13004"),
  makeClient(103,"ECOTECH","esteban.araujo.pro@gmail.com","33652277718","93433500000000","3 VILLA DES POMMIERS","TREMBLAY-EN-FRANCE","93290"),
  makeClient(104,"RENAULT LAURENT","laurentnettoyage350@gmail.com","33612843775","84884000000000","1 RUE DE LA MALTONNIERE","LE BOURGNEUF-LA-FORET","53410"),
  makeClient(105,"TOUILA WESSIM","wessim.touila@yahoo.fr","33625424691","93262500000000","11 BOULEVARD EUGENE GAUTHIER","BEAULIEU-SUR-MER","06310"),
  makeClient(106,"E2D INVEST","","","98799000000000","94 RUE DRAGON","MARSEILLE","13006"),
  makeClient(107,"AIDE AUDITION 1","ilan.slama1312@gmail.com","","98367300000000","35 CHEMIN VA A LA FONTAINE","ALLAUCH","13190"),
  makeClient(108,"D&G CONSTRUCTION","detgconstruction@gmail.com","33766853951","989251137","1 AVENUE ILE DE FRANCE","MARSEILLE","13008"),
  makeClient(109,"GOUTTE-D'O-EXPERTISE","gdo.expertise@gmail.com","","90756800000000","200 PROMENADE DU CAVAOU","PLAN-DE-CUQUES","13380"),
  makeClient(110,"DAJOMO","jo.mergui@hotmail.fr","","94446900000000","31 BOULEVARD NOTRE DAME","MARSEILLE","13006"),
  makeClient(111,"SARL COACHING PACA","contact@coachingpaca.com","","52519100000000","26 BOULEVARD GAY LUSSAC","MARSEILLE","13014"),
  makeClient(112,"SERENO VICTORIA","victoria.sereno6@gmail.com","","91902600000000","25 BOULEVARD DE SAINT MARCEL","MARSEILLE","13011"),
  makeClient(113,"NOGIA CONSEIL","bkermarrec@hotmail.fr","","94340000000000","70 RUE DU POINT DU JOUR","BOULOGNE-BILLANCOURT","92100"),
  makeClient(114,"CLINADENT AVIGNON","","","85382900000000","44 BOULEVARD SAINT-MICHEL","AVIGNON","84000"),
  makeClient(115,"CLINADENT BAGNOLET","","","81384800000000","29 RUE FRANCOIS MITTERRAND","BAGNOLET","93170"),
  makeClient(116,"CLINADENT MARSEILLE BOULEVARD NATIONAL","","","82380400000000","BOULEVARD NATIONAL","MARSEILLE","13003"),
  makeClient(117,"CLINADENT PARIS LOUVRE","","","84405200000000","33 RUE DU LOUVRE","PARIS","75002"),
  makeClient(118,"CLINADENT MARSEILLE QUATRE SEPTEMBRE","","","83332400000000","1 PLACE DU QUATRE SEPTEMBRE","MARSEILLE","13007"),
  makeClient(119,"CLINADENT MARSEILLE SAKAKINI","","","83331700000000","92 BOULEVARD SAKAKINI","MARSEILLE","13005"),
  makeClient(120,"CLINADENT MARSEILLE","","","81484400000000","2 BOULEVARD DES FRERES GODCHOT","MARSEILLE","13005"),
  makeClient(121,"CLINADENT MONTPELLIER JEU DE PAUME","","","89150500000000","43 BOULEVARD DU JEU DE PAUME","MONTPELLIER","34000"),
  makeClient(122,"CLINADENT MARSEILLE NEGRESKO","","","83332400000000","26 RUE NEGRESKO","MARSEILLE","13008"),
  makeClient(123,"CLINADENT NICE JEAN MEDECIN","","","89144000000000","47 AVENUE JEAN MEDECIN","NICE","06000"),
  makeClient(124,"CLINADENT NIMES","","","88447700000000","64 AV JEAN JAURES","NIMES","30000"),
  makeClient(125,"CLINADENT MARSEILLE PRADO-PERIER","","","84415200000000","108 AVENUE DU PRADO","MARSEILLE","13008"),
  makeClient(126,"CLINADENT TOULON","","","89023900000000","5 AVENUE SAINT ROCH","TOULON","83000"),
  makeClient(127,"CLINADENT PARIS VICTOR HUGO","","","82772300000000","3 PLACE VICTOR HUGO","PARIS","75016"),
  makeClient(128,"JN3L","benattarjeremy@gmail.com","","99107500000000","39 PROMENADE GEORGES POMPIDOU","MARSEILLE","13008"),
  makeClient(129,"MISHPAHA","benattarjeremy@gmail.com","","94097700000000","397 CORNICHE DU PDT JOHN F KENNEDY","MARSEILLE","13007"),
  makeClient(130,"AUDILAN","ilan.slama1312@gmail.com","","93322600000000","103 RUE ALPHONSE DAUDET","MARSEILLE","13013"),
  makeClient(131,"DRZ DEROZIMO","","","93865300000000","115 RUE JULES MOULET","MARSEILLE","13006"),
  makeClient(132,"OPEN ACTION SAS","adrien@openaction.eu","","99260500000000","60 RUE FRANCOIS IER","PARIS","75008"),
  makeClient(133,"LEGAL2DIGITAL","compta.clts@legal2digital.fr","","97986700000000","3 RUE DE PONDICHERY","PARIS","75015"),
  makeClient(134,"ESKINAZI ILAN","ilan.eskinazi@gmail.com","","84209400000000","7 IMPASSE DU CANAL","SAINT-ESTEVE-JANSON","13610"),
  makeClient(135,"ALESSI CLAUDE","claude.alessi@orange.fr","","38536000000000","26 BOULEVARD DU SABLIER","MARSEILLE","13008"),
  makeClient(136,"COZZOLINO GILLES","contact@graphique-com.fr","","45353800000000","73 ROUTE DE BEAURECUEIL","MEYREUIL","13590"),
  makeClient(137,"CARCASSIN ALEXIS","alexis.carcassin@gmail.com","","82035500000000","44 BOULEVARD MICHELET","MARSEILLE","13008"),
  makeClient(138,"ESTENOZA ANICEE","anicee.estenoza@gmail.com","","75282200000000","44 BOULEVARD MICHELET","MARSEILLE","13008"),
  makeClient(139,"MERGUI JOHAN","jo.mergui@hotmail.fr","","81256600000000","75 RUE ALPHONSE DAUDET","MARSEILLE","13013"),
  makeClient(140,"SLAMA MARCEL ALAIN","alainslama@orange.fr","","41804400000000","3 PLACE LNT ALBERT DURAND","MARSEILLE","13014"),
  makeClient(141,"BERTHEAU SALOME","bertheau.psychologue@gmail.com","","89264100000000","","",""),
  makeClient(142,"SLAMA VALERIE","valerie.slama@orange.fr","","39005600000000","19 RUE RAYMONDE MARTIN","MARSEILLE","13013"),
  makeClient(143,"LMNP SLAMA","alainslama@orange.fr","","41804400000000","3 PLACE LNT ALBERT DURAND","MARSEILLE","13014"),
  makeClient(144,"GIUSTI MELODIE","melodie.giusti1301@gmail.com","","88428200000000","21 CHEMIN DE PALAMA","MARSEILLE","13013"),
  makeClient(145,"HUTEAU MARIE-EVE","marie.eve.huteau@gmail.com","","89470400000000","3 RUE D'OCCITANIE","FABREGUES","34690"),
  makeClient(146,"CHABREUIL SOPHIE","schabreuil@gmail.com","","84900100000000","10 IMPASSE DES CHARMILLES","CHAPONOST","69630"),
  makeClient(147,"THEOHARIS ALEXANDRE","alextheoperso@gmail.com","","79842100000000","135 RUE DU ROUET","MARSEILLE","13008"),
  makeClient(148,"BEN ITTAH KEREN","kerenb2455@gmail.com","","53482400000000","12 AV MAL FOCH","MARSEILLE","13004"),
  makeClient(149,"AU BON OEIL","aubonoeil13@gmail.com","","84538500000000","RUE FRANCOIS MAURIAC","MARSEILLE","13010"),
  makeClient(150,"RAPH'INVEST","romainhamot@hotmail.com","","88026000000000","19 AVENUE EUGENE CUENOT","MARSEILLE","13009"),
  makeClient(151,"CHIVA IMMOBILIER","anthony.destriere@gmail.com","","85273800000000","14 AVENUE DU GENERAL DE GAULLE","SAINT-MANDE","94160"),
  makeClient(152,"COPRO'ASSIST","daniel.allouche@copro-assist.fr","","83007500000000","131 RUE BRETEUIL","MARSEILLE","13006"),
  makeClient(153,"LE SYNDIC","pascale.leboeuf@wanadoo.fr","","79763900000000","79 RUE DU CHEVALERET","PARIS","75013"),
  makeClient(154,"SILVANTON GAETAN","gaetan.silvanton@gmail.com","","79005400000000","42 RUE ROQUEBRUNE","MARSEILLE","13004"),
  makeClient(155,"PM SPORTS","","","50955600000000","890 CHEMIN DE LA CAPELASSE","AIX-EN-PROVENCE","13080"),
  makeClient(156,"8 SURENE","anthony@footballplayers.agency","","88478600000000","8 RUE DE SURENE","PARIS","75008"),
  makeClient(157,"STARCO INVEST","anthony@footballplayers.agency","","84977700000000","7 RUE LA BOETIE","PARIS","75008"),
  makeClient(158,"HAMOT ROMAIN","romainhamot@hotmail.com","","85401000000000","8 RUE EDMOND ROSTAND","MARSEILLE","13006"),
  makeClient(159,"SASU S.O CONSULTING","osconsultingfr@gmail.com","","90467400000000","46 RUE DAUPHINE","PARIS","75006"),
  makeClient(160,"ALD ENERGIE","contact@aldenergie.com","","91832200000000","26 RUE FRANCOIS MAURIAC","MARSEILLE","13010"),
  makeClient(161,"SYMBIOSAE","d.bertheau@symbiosae.fr","","88849000000000","115 CHEMIN DE BOUENHOURE","AIX-EN-PROVENCE","13090"),
  makeClient(162,"ISOTES","muriel.trichet@isotes.fr","","87826700000000","657 CHEMIN-DE-PATIN","AUBIGNAN","84810"),
  makeClient(163,"EXPERHIENCE","caroline.achard@experhience.com","","89222500000000","50 RUE GEORGES DUBY","AIX-EN-PROVENCE","13080"),
  makeClient(164,"MAGNE CYRIL","cm18cyr@hotmail.fr","","94921900000000","85 AVENUE DES PLANTIERS","SAINT-LAURENT-DU-VAR","06700"),
  makeClient(165,"SARL GIBESTA","aymeric.gibesi@gmail.com","","95126200000000","1 RUE DES FENIERS","SAINT-TROPEZ","83990"),
  makeClient(166,"MERGUI JOHAN LMNP","jo.mergui@hotmail.fr","","81256600000000","75 ALPHONSE DAUDET","MARSEILLE","13013"),
  makeClient(167,"SAS LA PALETTE DES OPTICIENS","lapalettedesopticiens@gmail.com","","92910600000000","203 AVENUE PAUL JULLIEN","LE THOLONET","13100"),
  makeClient(168,"SRH HOLDING","romainhamot@hotmail.com","","892234980","22 CHEMIN DES CHALETS","MARSEILLE","13009"),
  makeClient(169,"ZESTE DE DECO","zestededeco@yahoo.fr","","44285500000000","18 BIS RUE DIDEROT","SURESNES","92150"),
  makeClient(170,"SANGRI IMEN","sangriimen@yahoo.fr","","952781524","44 RUE TIQUETONNE","PARIS","75002"),
  makeClient(171,"SAS AUDITIVE","ilan.slama1312@gmail.com","","98745800000000","38 PLACE EDMOND AUDRAN","MARSEILLE","13004"),
  makeClient(172,"SAS URBA","","","97760600000000","48 RUE DAUPHINE","PARIS","75006"),
  makeClient(173,"JACQUET BENOIT","b.jacquet@datack.fr","","524997087","99 BOULEVARD DE LA LIBERATION","MARSEILLE","13001"),
  makeClient(174,"SAS WAHKAN AA","wakhan.aa@gmail.com","","88257700000000","2 PLACE SAINT-FRANCOIS","NICE","06300"),
  makeClient(175,"PALERMIMMO","smenjix.levy@gmail.com","","93528100000000","82 RUE JULES MOULET","MARSEILLE","13006"),
  makeClient(176,"CONTROLE PROVENCE HABITAT","fares.maazouz@gmail.com","","93392900000000","168 RUE DU DIRIGEABLE","AUBAGNE","13400"),
  makeClient(177,"DYNAMICS FOR DISPLAY - D4D","julien.trombetta@d4d.fr","","52053900000000","10 RUE DE LA PAIX","PARIS","75002"),
  makeClient(178,"URSU CONSTRUCTION","marianursu@icloud.com","","87940700000000","19 BOULEVARD DE SAINTE MARGUERITE","MARSEILLE","13009"),
  makeClient(179,"MODERN RENOV","dylanelbaz@hotmail.fr","","91033700000000","258 AVENUE DU PRADO","MARSEILLE","13008"),
  makeClient(180,"LES 4 TEMPS","cclem2008@live.fr","","89159500000000","9 IMPASSE FERDINAND ARNODIN","MARSEILLE","13010"),
  makeClient(181,"FOOTBALL PLAYERS AGENCY","anthony@footballplayers.agency","","92843900000000","9 RUE LA BOETIE","PARIS","75008"),
  makeClient(182,"THE SCIENCE CABINET","ashleyscribbins@gmail.com","","93107200000000","1831 ROUTE DE CANNES ET CLAIRAN","ORTHOUX-SERIGNAC-QUILHAN","30260"),
  makeClient(183,"NACH INVEST","alextheoperso@gmail.com","","93765800000000","27 BOULEVARD DIE","MARSEILLE","13012"),
  makeClient(184,"COPR 21 RUE CAILLAUX 75013 PARIS","p.leboeuf@le-syndic.fr","","03925925400017","21 RUE CAILLAUX","PARIS","75013"),
  makeClient(185,"TAMAR RENOV","batimax13013@gmail.com","","93458500000000","44 RUE DES FORGES","MARSEILLE","13010"),
  makeClient(186,"PRO PROFIL FRANCE","anthony@cabinet3a.com","","91836500000000","8 RUE DE SURENE","PARIS","75008"),
  makeClient(187,"DATACK","m.pons@datack.fr","","81034100000000","11 COURS JOSEPH THIERRY","MARSEILLE","13001"),
  makeClient(188,"ESPERELLE","m.pons@datack.fr","","98013300000000","11 COURS JOSEPH THIERRY","MARSEILLE","13001"),
  makeClient(189,"PARTIS-PRIS","m.pigamo@partis-pris.com","","98155600000000","11 COURS JOSEPH THIERRY","MARSEILLE","13001"),
  makeClient(190,"CHEMTOV YANIV","ychemtov@gmail.com","","95106100000000","103 BOULEVARD DE SAINT LOUP","MARSEILLE","13010"),
  makeClient(191,"COHEN BENJAMIN","benjamin.cohen@mbeartisan.com","","91226700000000","69 RUE DU ROUET","MARSEILLE","13008"),
  makeClient(192,"TRINITY AASDSSS","carredaasss@gmail.com","","","66 AVENUE DES CHAMPS-ELYSEES","PARIS","75008"),
  makeClient(193,"SMK CONSEILS","smkconseils@gmail.com","","50522400000000","44 RUE TIQUETONNE","PARIS","75002"),
  makeClient(194,"CSE CLAIRVAL","cseclairval@gmail.com","","","317 BOULEVARD DU REDON","MARSEILLE","13009"),
  makeClient(195,"LAURENCE EDY","laurenceedy@gmail.com","","88265300000000","1 RUE D'ALGER","NANTES","44100"),
  makeClient(196,"MEHRPOUR SAKHA","smehrpourk@gmail.com","","","54 RUE DU FOUR","PARIS","75006"),
  makeClient(197,"MOUGEL RAPHAEL","raphael.mougel@gmail.com","","80928300000000","18 RUE NEUVE SAINTE CATHERINE","MARSEILLE","13007"),
  makeClient(198,"LE TEMPS DE VIVRE","delph.ferrara@protonmail.com","","99942800000000","COUSTARRAS","LESPINASSIERE","11160"),
  makeClient(199,"CRESTANI STEPHAN","","","53028400000000","24 AVENUE DE LA MADRAGUE MONTREDON","MARSEILLE","13008"),
  makeClient(200,"COLLEC MATISSE","matisse.collec@gmail.com","","83518600000000","16 BOULEVARD CAUVIERE","MARSEILLE","13009"),
  makeClient(201,"FMR FRED MONTAGE RENOVATION","sas.fmr@yahoo.com","","92038100000000","1 RUE ALEXANDRE CHAZEAUX","MARSEILLE","13013"),
  makeClient(202,"AUDITIVE","ilan.slama1312@gmail.com","","98745800000000","38 PLACE EDMOND AUDRAN","MARSEILLE","13004"),
  makeClient(203,"FANNY VOULFOR","fannyvoulfor@gmail.com","","99344000000000","17 AVENUE DES FLEURS","NICE","06000"),
  makeClient(204,"UFARATZTA","ychemtov@gmail.com","","98799600000000","45 BOULEVARD SACCOMAN","MARSEILLE","13010"),
  makeClient(205,"SDC ALTITUDE 90","","","","AVENUE ALPHONSE DAUDET","SALON-DE-PROVENCE","13300"),
];

// ═══════════════════════════════════════════════════════════
// MOTEUR D'ÉCHÉANCES FISCALES AUTOMATIQUES
// ═══════════════════════════════════════════════════════════
const genererEcheances = (client) => {
  const annee = 2026;
  const echeances = [];
  let id = 1;
  const forme = (client.forme || "").toUpperCase();
  const tva = (client.tva || "").toLowerCase();
  const isSociete = ["SARL","SAS","SASU","EURL","SA"].some(f => forme.includes(f));
  const isSCI = forme.includes("SCI");
  const isEI = forme.includes("EI") || forme.includes("AUTO") || forme.includes("MICRO");
  const isIS = isSociete;

  if (tva.includes("normal")) {
    [{m:4,l:"Mars"},{m:5,l:"Avril"},{m:6,l:"Mai"},{m:7,l:"Juin"},
     {m:9,l:"Août"},{m:10,l:"Sept."},{m:11,l:"Oct."},{m:12,l:"Nov."}
    ].forEach(({m,l}) => echeances.push({id:id++,label:`TVA CA3 – ${l} ${annee-1}`,date:`${annee}-${String(m).padStart(2,"0")}-21`,type:"TVA",priorite:daysLeft(`${annee}-${String(m).padStart(2,"0")}-21`)<=7?"urgente":"haute",auto:true}));
  }
  if (tva.includes("simplifié") || tva.includes("ca12")) {
    echeances.push({id:id++,label:`TVA CA12 – ${annee-1}`,date:`${annee}-04-30`,type:"TVA",priorite:"urgente",auto:true});
    echeances.push({id:id++,label:`Acompte TVA Juillet ${annee}`,date:`${annee}-07-25`,type:"TVA",priorite:"normale",auto:true});
    echeances.push({id:id++,label:`Acompte TVA Décembre ${annee}`,date:`${annee}-12-19`,type:"TVA",priorite:"normale",auto:true});
  }
  if (isIS) {
    echeances.push({id:id++,label:`Solde IS – ${annee-1}`,date:`${annee}-04-15`,type:"IS",priorite:"urgente",auto:true});
    [{m:3,n:"1er"},{m:6,n:"2ème"},{m:9,n:"3ème"},{m:12,n:"4ème"}].forEach(({m,n}) =>
      echeances.push({id:id++,label:`IS acompte ${n} trim. ${annee}`,date:`${annee}-${String(m).padStart(2,"0")}-15`,type:"IS",priorite:"haute",auto:true}));
    echeances.push({id:id++,label:`Liasse fiscale 2065 – ${annee-1}`,date:`${annee}-05-15`,type:"Liasse",priorite:"haute",auto:true});
    echeances.push({id:id++,label:`Bilan & comptes annuels – ${annee-1}`,date:`${annee}-06-30`,type:"Bilan",priorite:"haute",auto:true});
  }
  if (isEI) {
    echeances.push({id:id++,label:`Liasse 2031 BIC – ${annee-1}`,date:`${annee}-05-15`,type:"Liasse",priorite:"haute",auto:true});
    echeances.push({id:id++,label:`Déclaration IR 2042 – ${annee-1}`,date:`${annee}-05-31`,type:"IR",priorite:"normale",auto:true});
    echeances.push({id:id++,label:`Acompte IR Sept. ${annee}`,date:`${annee}-09-15`,type:"IR",priorite:"normale",auto:true});
    echeances.push({id:id++,label:`Acompte IR Déc. ${annee}`,date:`${annee}-12-15`,type:"IR",priorite:"normale",auto:true});
    [{n:"T1",m:"04"},{n:"T2",m:"07"},{n:"T3",m:"10"}].forEach(({n,m}) =>
      echeances.push({id:id++,label:`Décl. CA ${n} ${annee}`,date:`${annee}-${m}-30`,type:"CA",priorite:"haute",auto:true}));
    echeances.push({id:id++,label:`Cotisations URSSAF T1 ${annee}`,date:`${annee}-02-05`,type:"Social",priorite:"normale",auto:true});
    echeances.push({id:id++,label:`Cotisations URSSAF T2 ${annee}`,date:`${annee}-05-05`,type:"Social",priorite:"normale",auto:true});
    echeances.push({id:id++,label:`Cotisations URSSAF T3 ${annee}`,date:`${annee}-08-05`,type:"Social",priorite:"normale",auto:true});
    echeances.push({id:id++,label:`Cotisations URSSAF T4 ${annee}`,date:`${annee}-11-05`,type:"Social",priorite:"normale",auto:true});
  }
  if (isSCI) {
    echeances.push({id:id++,label:`Déclaration 2072 SCI – ${annee-1}`,date:`${annee}-04-30`,type:"Déclaration",priorite:"haute",auto:true});
    echeances.push({id:id++,label:`IR associés SCI – ${annee-1}`,date:`${annee}-05-31`,type:"IR",priorite:"normale",auto:true});
  }
  if (isSociete || isEI || isSCI) {
    echeances.push({id:id++,label:`CFE – Acompte ${annee}`,date:`${annee}-06-15`,type:"CFE",priorite:"normale",auto:true});
    echeances.push({id:id++,label:`CFE – Solde ${annee}`,date:`${annee}-12-15`,type:"CFE",priorite:"normale",auto:true});
  }
  if (forme.includes("SARL") || forme.includes("EURL")) {
    [{n:"T1",m:"02"},{n:"T2",m:"05"},{n:"T3",m:"08"},{n:"T4",m:"11"}].forEach(({n,m}) =>
      echeances.push({id:id++,label:`Cotisations TNS ${n} ${annee}`,date:`${annee}-${m}-05`,type:"Social",priorite:"normale",auto:true}));
  }
  return echeances.filter(e => daysLeft(e.date) > -60).sort((a,b) => new Date(a.date)-new Date(b.date));
};

const getSituationFiscale = (client) => {
  const forme = (client.forme||"").toUpperCase();
  const tva = (client.tva||"").toLowerCase();
  const items = [];
  if (["SARL","SAS","SASU","SA"].some(f=>forme.includes(f))) items.push("Soumise à l'IS");
  if (forme.includes("SCI")) items.push("SCI – imposition IR associés");
  if (forme.includes("EI")||forme.includes("MICRO")) items.push("Imposition IR (BIC/BNC)");
  if (tva.includes("normal")) items.push("TVA réel normal – CA3 mensuelle");
  if (tva.includes("simplifié")) items.push("TVA réel simplifié – CA12 annuelle");
  if (tva.includes("franchise")) items.push("Franchise en base de TVA");
  if (tva.includes("sans")) items.push("Non assujetti à la TVA");
  return items;
};


const TAUX_HORAIRE = { elie: 180, collab: 90 };
const MISSIONS_TYPES = ["Saisie comptable", "Rapprochement bancaire", "Déclaration TVA", "Liasse fiscale", "Révision", "Bilan", "Conseil", "Lettre de mission", "CIR", "Autre"];

// ═══════════════════════════════════════════════════════════
// UTILITAIRES UI
// ═══════════════════════════════════════════════════════════
const sc = (s) => ({
  "Payée": "#2d7a4f", "En attente": "#b07d1a", "Impayée": "#c0392b", "À envoyer": "#1a5c8a",
  "Traité": "#2d7a4f", "En cours": "#1a5c8a", "Urgent": "#c0392b", "Avancé": "#2d7a4f",
  "En retard": "#c0392b", "Reçu": "#2d7a4f", "Manquant": "#c0392b", "Signée": "#2d7a4f",
  "À renouveler": "#c0392b", "En attente signature": "#b07d1a",
}[s] || "#666");

const pc = (p) => ({ urgente: "#c0392b", haute: "#b07d1a", normale: "#1a5c8a" }[p?.toLowerCase()] || "#666");

const Badge = ({ label, color }) => (
  <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, background: (color || "#666") + "18", color: color || "#666", border: `1px solid ${color || "#666"}40`, fontSize: 11, fontWeight: 700, letterSpacing: 0.4, whiteSpace: "nowrap" }}>{label}</span>
);

const Bar = ({ value, color = "#1a5c8a", label }) => (
  <div style={{ marginBottom: 8 }}>
    {label && <div style={{ fontSize: 11, color: "#888", display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
      <span>{label}</span><span style={{ fontWeight: 800, color }}>{value}%</span>
    </div>}
    <div style={{ background: "#e8ecf0", borderRadius: 6, height: 6 }}>
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 6, transition: "width .6s" }} />
    </div>
  </div>
);

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8ecf0", boxShadow: "0 1px 4px rgba(0,0,0,.06)", padding: 20, cursor: onClick ? "pointer" : "default", transition: "box-shadow .2s, transform .15s", ...style }}
    onMouseEnter={e => { if (onClick) { e.currentTarget.style.boxShadow = "0 4px 16px rgba(26,92,138,.12)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
    onMouseLeave={e => { if (onClick) { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.06)"; e.currentTarget.style.transform = "none"; } }}>
    {children}
  </div>
);

const Btn = ({ children, onClick, color = "#1a5c8a", outline, small, style = {} }) => (
  <button onClick={onClick} style={{
    background: outline ? "transparent" : color, color: outline ? color : "#fff",
    border: `1.5px solid ${color}`, borderRadius: 8, padding: small ? "5px 12px" : "8px 16px",
    fontSize: small ? 11 : 13, fontWeight: 700, cursor: "pointer", transition: "all .15s", ...style
  }}
    onMouseEnter={e => { e.currentTarget.style.opacity = ".85"; }}
    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
    {children}
  </button>
);

const Input = ({ label, value, onChange, type = "text", placeholder, style = {} }) => (
  <div style={{ marginBottom: 12, ...style }}>
    {label && <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #dde3ea", fontSize: 13, boxSizing: "border-box", outline: "none" }}
      onFocus={e => e.target.style.borderColor = "#1a5c8a"}
      onBlur={e => e.target.style.borderColor = "#dde3ea"} />
  </div>
);

const Sel = ({ label, value, onChange, options, style = {} }) => (
  <div style={{ marginBottom: 12, ...style }}>
    {label && <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>}
    <select value={value} onChange={onChange} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #dde3ea", fontSize: 13, boxSizing: "border-box" }}>
      {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  </div>
);

// ═══════════════════════════════════════════════════════════
// MODAL WRAPPER
// ═══════════════════════════════════════════════════════════
const Modal = ({ title, onClose, children, wide }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(10,20,40,.55)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
    <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: wide ? 900 : 560, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,.25)" }}>
      <div style={{ padding: "18px 24px", borderBottom: "1px solid #e8ecf0", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#1a2332" }}>{title}</h3>
        <button onClick={onClose} style={{ background: "#f0f4f8", border: "none", borderRadius: 8, width: 32, height: 32, fontSize: 16, cursor: "pointer", color: "#555" }}>✕</button>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 24 }}>{children}</div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// MODULE TEMPS PASSÉ
// ═══════════════════════════════════════════════════════════
const TempsPanel = ({ client, onUpdate, currentUser }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "2026-03-28", collaborateur: currentUser.id, mission: "Saisie comptable", duree: 1, notes: "" });

  const totalHeures = client.temps.reduce((s, t) => s + t.duree, 0);
  const totalCout = client.temps.reduce((s, t) => s + t.duree * (TAUX_HORAIRE[t.collaborateur] || 90), 0);
  const totalFacture = client.factures.filter(f => f.statut === "Payée").reduce((s, f) => s + f.montant, 0);
  const ratio = totalFacture > 0 ? Math.round((totalFacture / totalCout) * 100) : 0;
  const rentabilite = totalFacture - totalCout;

  const addTemps = () => {
    const t = { id: Date.now(), ...form, duree: parseFloat(form.duree) };
    onUpdate(client.id, { temps: [...client.temps, t] });
    setShowForm(false);
  };

  return (
    <div>
      {/* KPIs rentabilité */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Heures passées", val: totalHeures + "h", color: "#1a5c8a" },
          { label: "Coût interne", val: fmtM(totalCout), color: "#5a3e8a", sub: `@ ${TAUX_HORAIRE.elie}€/h EC · ${TAUX_HORAIRE.collab}€/h collab` },
          { label: "Encaissé", val: fmtM(totalFacture), color: "#2d7a4f" },
          { label: "Rentabilité", val: fmtM(rentabilite), color: rentabilite >= 0 ? "#2d7a4f" : "#c0392b", sub: `Ratio ${ratio}%` },
        ].map((k, i) => (
          <div key={i} style={{ padding: 14, background: "#f7f9fc", borderRadius: 10, border: "1px solid #e8ecf0" }}>
            <div style={{ fontSize: 10, color: "#888", fontWeight: 700, textTransform: "uppercase" }}>{k.label}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: k.color, margin: "4px 0 2px" }}>{k.val}</div>
            {k.sub && <div style={{ fontSize: 10, color: "#aaa" }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Indicateur rentabilité visuel */}
      <div style={{ marginBottom: 20, padding: 14, background: ratio >= 100 ? "#f0faf5" : ratio >= 70 ? "#fffbf0" : "#fff0f0", borderRadius: 10, border: `1px solid ${ratio >= 100 ? "#b8e8cc" : ratio >= 70 ? "#ffe5a0" : "#ffcccc"}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
          <span>Ratio honoraires / coût interne</span>
          <span style={{ color: ratio >= 100 ? "#2d7a4f" : ratio >= 70 ? "#b07d1a" : "#c0392b" }}>{ratio}% {ratio >= 100 ? "✅ Rentable" : ratio >= 70 ? "⚠️ Limite" : "🔴 Déficitaire"}</span>
        </div>
        <div style={{ background: "#e8ecf0", borderRadius: 6, height: 10 }}>
          <div style={{ width: `${Math.min(ratio, 100)}%`, height: "100%", background: ratio >= 100 ? "#2d7a4f" : ratio >= 70 ? "#b07d1a" : "#c0392b", borderRadius: 6 }} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800 }}>Saisies de temps</h4>
        <Btn small onClick={() => setShowForm(!showForm)}>+ Saisir du temps</Btn>
      </div>

      {showForm && (
        <div style={{ padding: 16, background: "#f0f5fa", borderRadius: 10, border: "1px solid #cce0f5", marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Input label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            <Sel label="Collaborateur" value={form.collaborateur} onChange={e => setForm({ ...form, collaborateur: e.target.value })} options={USERS.map(u => ({ value: u.id, label: u.name }))} />
            <Sel label="Mission" value={form.mission} onChange={e => setForm({ ...form, mission: e.target.value })} options={MISSIONS_TYPES} />
            <Input label="Durée (heures)" type="number" value={form.duree} onChange={e => setForm({ ...form, duree: e.target.value })} />
          </div>
          <Input label="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Observations..." />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={addTemps}>Enregistrer</Btn>
            <Btn outline onClick={() => setShowForm(false)}>Annuler</Btn>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[...client.temps].sort((a, b) => new Date(b.date) - new Date(a.date)).map(t => {
          const u = USERS.find(u => u.id === t.collaborateur);
          const cout = t.duree * (TAUX_HORAIRE[t.collaborateur] || 90);
          return (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#f7f9fc", borderRadius: 8, border: "1px solid #e8ecf0" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: u?.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{u?.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{t.mission}</div>
                <div style={{ fontSize: 11, color: "#aaa" }}>{fmt(t.date)} · {u?.name}</div>
                {t.notes && <div style={{ fontSize: 11, color: "#888", fontStyle: "italic" }}>{t.notes}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#1a2332" }}>{t.duree}h</div>
                <div style={{ fontSize: 11, color: "#888" }}>{fmtM(cout)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// MODULE LETTRES DE MISSION
// ═══════════════════════════════════════════════════════════
const LettreMissionPanel = ({ client, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(null);
  const [form, setForm] = useState({ titre: `Lettre de mission ${new Date().getFullYear()}`, missions: [], honoraires: client.honorairesMensuels, periodicite: "Mensuelle" });
  const [checkMissions, setCheckMissions] = useState({});

  const MISSIONS_DISPONIBLES = [
    "Tenue comptable et saisie", "Rapprochement bancaire", "Déclarations de TVA",
    "Établissement du bilan", "Liasse fiscale", "Conseils fiscaux", "Commissariat aux Comptes",
    "Établissement des bulletins de paie", "Déclarations sociales (DSN)", "Assistance en cas de contrôle fiscal"
  ];

  const addLdm = () => {
    const selected = MISSIONS_DISPONIBLES.filter((_, i) => checkMissions[i]);
    const ldm = { id: Date.now(), titre: form.titre, date: "2026-03-28", statut: "En attente signature", missions: selected, honoraires: form.honoraires, periodicite: form.periodicite };
    onUpdate(client.id, { lettresMission: [...client.lettresMission, ldm] });
    setShowForm(false); setCheckMissions({});
  };

  const LdmPreview = ({ ldm }) => (
    <div style={{ fontFamily: "Georgia, serif", fontSize: 13, lineHeight: 1.7 }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#1a2332" }}>NEOWISE EXPERTISE</div>
        <div style={{ fontSize: 12, color: "#888" }}>Elie-Dan ATTIA · Expert-Comptable & Commissaire aux Comptes</div>
        <div style={{ borderTop: "2px solid #1a5c8a", marginTop: 12, paddingTop: 12, fontSize: 15, fontWeight: 700 }}>LETTRE DE MISSION</div>
      </div>
      <p><strong>Client :</strong> {client.nom}</p>
      <p><strong>Date :</strong> {fmt(ldm.date)}</p>
      <p><strong>Exercice :</strong> {new Date().getFullYear()}</p>
      <p style={{ marginTop: 16 }}>Par la présente lettre de mission, le cabinet <strong>NEOWISE EXPERTISE</strong>, représenté par <strong>Elie-Dan ATTIA</strong>, Expert-Comptable inscrit à l'Ordre, s'engage à réaliser les missions suivantes pour le compte de <strong>{client.nom}</strong> :</p>
      <ul>{ldm.missions.map((m, i) => <li key={i}>{m}</li>)}</ul>
      <p><strong>Honoraires :</strong> {fmtM(ldm.honoraires)} HT / mois ({ldm.periodicite})</p>
      <p style={{ marginTop: 24, fontStyle: "italic", fontSize: 12, color: "#888" }}>Cette lettre de mission est établie conformément aux dispositions de l'article 11 du Code de déontologie des experts-comptables. Elle annule et remplace toute lettre de mission antérieure.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 32, fontSize: 12 }}>
        <div><strong>Pour NEOWISE EXPERTISE</strong><br /><br /><br />Elie-Dan ATTIA<br />Expert-Comptable & CAC</div>
        <div><strong>Pour {client.nom}</strong><br /><br /><br />{client.contact}<br />Lu et approuvé</div>
      </div>
    </div>
  );

  return (
    <div>
      {showPreview && <Modal title="Aperçu lettre de mission" onClose={() => setShowPreview(null)} wide>
        <LdmPreview ldm={showPreview} />
        <div style={{ marginTop: 20, padding: 14, background: "#f0f8ff", borderRadius: 10, border: "1px solid #cce0f5", fontSize: 12, color: "#555" }}>
          💡 <strong>Intégration Outlook :</strong> En production, un bouton « Envoyer par email » enverrait cette lettre en PDF via l'API Microsoft Graph à {client.email}.
        </div>
      </Modal>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800 }}>Lettres de mission</h4>
        <Btn small onClick={() => setShowForm(!showForm)}>+ Nouvelle lettre</Btn>
      </div>

      {showForm && (
        <div style={{ padding: 16, background: "#f0f5fa", borderRadius: 10, border: "1px solid #cce0f5", marginBottom: 16 }}>
          <Input label="Titre" value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} />
          <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Missions incluses</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
            {MISSIONS_DISPONIBLES.map((m, i) => (
              <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer", padding: "5px 8px", borderRadius: 6, background: checkMissions[i] ? "#e8f0f8" : "transparent" }}>
                <input type="checkbox" checked={!!checkMissions[i]} onChange={e => setCheckMissions({ ...checkMissions, [i]: e.target.checked })} />
                {m}
              </label>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Input label="Honoraires HT/mois (€)" type="number" value={form.honoraires} onChange={e => setForm({ ...form, honoraires: +e.target.value })} />
            <Sel label="Périodicité" value={form.periodicite} onChange={e => setForm({ ...form, periodicite: e.target.value })} options={["Mensuelle", "Trimestrielle", "Annuelle"]} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={addLdm}>Générer</Btn>
            <Btn outline onClick={() => setShowForm(false)}>Annuler</Btn>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {client.lettresMission.map(ldm => (
          <div key={ldm.id} style={{ padding: 14, background: "#f7f9fc", borderRadius: 10, border: `1px solid ${sc(ldm.statut)}33` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800 }}>📄 {ldm.titre}</div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>Établie le {fmt(ldm.date)} · {fmtM(ldm.honoraires)}/mois</div>
                <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {ldm.missions.map((m, i) => <Badge key={i} label={m} color="#555" />)}
                </div>
              </div>
              <Badge label={ldm.statut} color={sc(ldm.statut)} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Btn small outline onClick={() => setShowPreview(ldm)}>👁 Aperçu</Btn>
              {ldm.statut !== "Signée" && (
                <Btn small outline color="#b07d1a" onClick={() => onUpdate(client.id, { lettresMission: client.lettresMission.map(l => l.id === ldm.id ? { ...l, statut: "Signée" } : l) })}>✓ Marquer signée</Btn>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// MODULE ESPACE CLIENT (simulation)
// ═══════════════════════════════════════════════════════════
const EspaceClientPanel = ({ client }) => {
  const [lienCopie, setLienCopie] = useState(false);
  const lienClient = `https://espace.neowise-expertise.fr/client/${client.id}-${client.nom.toLowerCase().replace(/\s/g, "-").replace(/[^a-z0-9-]/g, "")}`;

  const docsDeposes = client.docs.filter(d => d.statut === "Reçu");
  const docsManquants = client.docs.filter(d => d.statut !== "Reçu");

  return (
    <div>
      <div style={{ padding: 16, background: "linear-gradient(135deg,#f0f8ff,#e8f4f8)", borderRadius: 12, border: "1px solid #cce0f5", marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#1a2332", marginBottom: 8 }}>🔗 Lien espace client sécurisé</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, padding: "8px 12px", background: "#fff", borderRadius: 8, border: "1px solid #cce0f5", fontSize: 11, color: "#555", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lienClient}</div>
          <Btn small onClick={() => { setLienCopie(true); setTimeout(() => setLienCopie(false), 2000); }}>{lienCopie ? "✓ Copié !" : "Copier"}</Btn>
        </div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 8 }}>Ce lien unique permet à {client.contact} de déposer des documents en toute sécurité, sans accès à votre CRM.</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <div style={{ padding: 14, background: "#f0faf5", borderRadius: 10, border: "1px solid #b8e8cc" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#2d7a4f", marginBottom: 10 }}>✅ Documents reçus ({docsDeposes.length})</div>
          {docsDeposes.map((d, i) => <div key={i} style={{ fontSize: 12, padding: "5px 0", borderBottom: "1px solid #e0f0e8", color: "#444" }}>📄 {d.nom}</div>)}
          {docsDeposes.length === 0 && <div style={{ fontSize: 12, color: "#aaa" }}>Aucun document reçu</div>}
        </div>
        <div style={{ padding: 14, background: "#fff0f0", borderRadius: 10, border: "1px solid #ffcccc" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#c0392b", marginBottom: 10 }}>⏳ Documents en attente ({docsManquants.length})</div>
          {docsManquants.map((d, i) => <div key={i} style={{ fontSize: 12, padding: "5px 0", borderBottom: "1px solid #ffe0e0", color: "#444" }}>📋 {d.nom}</div>)}
          {docsManquants.length === 0 && <div style={{ fontSize: 12, color: "#aaa" }}>Tout est reçu ✓</div>}
        </div>
      </div>

      {/* Simulation email de relance */}
      <div style={{ padding: 16, background: "#f7f9fc", borderRadius: 12, border: "1px solid #e8ecf0" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#1a2332", marginBottom: 12 }}>📧 Relance documents manquants</div>
        <div style={{ padding: 14, background: "#fff", borderRadius: 8, border: "1px solid #dde3ea", fontSize: 12, lineHeight: 1.7, color: "#333", marginBottom: 12, fontFamily: "monospace" }}>
          <strong>À :</strong> {client.email}<br />
          <strong>De :</strong> elie.attia@neowise-expertise.fr<br />
          <strong>Objet :</strong> Documents manquants – Dossier {client.nom}<br /><br />
          Bonjour {client.contact.split(" ")[0]},<br /><br />
          J'espère que vous allez bien. Je reviens vers vous au sujet des documents suivants, nécessaires à l'avancement de votre dossier comptable :<br /><br />
          {docsManquants.map((d, i) => `• ${d.nom}\n`).join("")}<br />
          Vous pouvez les déposer directement sur votre espace sécurisé ou par email.<br /><br />
          Cordialement,<br />
          Elie-Dan ATTIA<br />
          Expert-Comptable & CAC – NEOWISE EXPERTISE
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn small onClick={() => alert("✉️ En production : email envoyé via Outlook / Microsoft Graph API à " + client.email)}>📤 Envoyer via Outlook</Btn>
          <div style={{ fontSize: 11, color: "#aaa", alignSelf: "center" }}>Connecté à votre boîte Outlook via Microsoft Graph API</div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// MODULE ALERTES & RELANCES
// ═══════════════════════════════════════════════════════════
const AlertesPage = ({ clients, onUpdate }) => {
  const [sent, setSent] = useState({});

  const alertes = [];

  // Impayés
  clients.forEach(c => {
    c.factures.filter(f => f.statut === "Impayée").forEach(f => {
      const j = Math.ceil((today - new Date(f.date)) / 86400000);
      alertes.push({ id: `imp-${c.id}-${f.id}`, type: "Impayé", urgence: j > 60 ? "urgente" : "haute", client: c, label: `Facture ${f.id} impayée depuis ${j} jours`, montant: f.montant, email: c.email, emailBody: `Bonjour ${c.contact.split(" ")[0]},\n\nNous n'avons pas reçu le règlement de la facture ${f.id} d'un montant de ${fmtM(f.montant)}, émise le ${fmt(f.date)}.\n\nMerci de procéder au règlement dans les meilleurs délais.\n\nCordialement,\nElie-Dan ATTIA – NEOWISE EXPERTISE` });
    });
  });

  // Docs manquants
  clients.forEach(c => {
    const manquants = c.docs.filter(d => d.statut === "Manquant" || d.statut === "En attente");
    if (manquants.length > 0) {
      alertes.push({ id: `doc-${c.id}`, type: "Docs manquants", urgence: c.statut === "En retard" ? "urgente" : "normale", client: c, label: `${manquants.length} document(s) manquant(s) : ${manquants.map(d => d.nom).join(", ")}`, email: c.email, emailBody: `Bonjour ${c.contact.split(" ")[0]},\n\nAfin d'avancer sur votre dossier, merci de nous faire parvenir :\n${manquants.map(d => `• ${d.nom}`).join("\n")}\n\nCordialement,\nElie-Dan ATTIA – NEOWISE EXPERTISE` });
    }
  });

  // Échéances J-15
  clients.forEach(c => {
    const echs = genererEcheances(c).filter(e => daysLeft(e.date) <= 15 && daysLeft(e.date) > 0);
    echs.forEach(e => {
      alertes.push({ id: `ech-${c.id}-${e.id}`, type: "Échéance proche", urgence: daysLeft(e.date) <= 7 ? "urgente" : "haute", client: c, label: `${e.label} dans ${daysLeft(e.date)} jours`, email: c.email, emailBody: `Bonjour ${c.contact.split(" ")[0]},\n\nRappel : ${e.label} est à déposer avant le ${fmt(e.date)}.\n\nMerci de vous assurer que tous les éléments sont transmis.\n\nCordialement,\nElie-Dan ATTIA – NEOWISE EXPERTISE` });
    });
  });

  // LDM à renouveler
  clients.forEach(c => {
    c.lettresMission.filter(l => l.statut === "À renouveler").forEach(l => {
      alertes.push({ id: `ldm-${c.id}-${l.id}`, type: "LDM expirée", urgence: "haute", client: c, label: `Lettre de mission expirée : ${l.titre}`, email: c.email, emailBody: "" });
    });
  });

  alertes.sort((a, b) => ({ urgente: 0, haute: 1, normale: 2 }[a.urgence] || 0) - ({ urgente: 0, haute: 1, normale: 2 }[b.urgence] || 0));

  const sendEmail = (a) => {
    setSent(prev => ({ ...prev, [a.id]: true }));
    alert(`✉️ Email envoyé à ${a.email} via Outlook\n\n${a.emailBody}`);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2332", margin: 0 }}>Alertes & Relances</h2>
          <p style={{ color: "#888", fontSize: 13, margin: "4px 0 0" }}>{alertes.length} alerte(s) active(s) · Relances envoyables via Outlook</p>
        </div>
        <Btn onClick={() => alert("📅 Synchronisation Outlook : toutes les échéances sont exportées vers votre calendrier Microsoft 365.")}>📅 Sync Outlook</Btn>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {alertes.map(a => (
          <div key={a.id} style={{ padding: "14px 18px", background: "#fff", borderRadius: 12, border: `1px solid ${pc(a.urgence)}33`, borderLeft: `4px solid ${pc(a.urgence)}`, boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{ fontSize: 22 }}>{a.type === "Impayé" ? "💰" : a.type === "Docs manquants" ? "📂" : a.type === "Échéance proche" ? "⏳" : "📄"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                  <Badge label={a.type} color={pc(a.urgence)} />
                  <Badge label={a.urgence} color={pc(a.urgence)} />
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#1a2332" }}>{a.client.nom}</span>
                </div>
                <div style={{ fontSize: 13, color: "#444" }}>{a.label}</div>
                {a.montant && <div style={{ fontSize: 12, color: "#c0392b", fontWeight: 700, marginTop: 2 }}>{fmtM(a.montant)}</div>}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {a.emailBody && !sent[a.id] && (
                  <Btn small onClick={() => sendEmail(a)}>📧 Relancer</Btn>
                )}
                {sent[a.id] && <Badge label="✓ Envoyé" color="#2d7a4f" />}
              </div>
            </div>
          </div>
        ))}
        {alertes.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Aucune alerte active</div>
            <div style={{ fontSize: 13 }}>Tout est sous contrôle</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// MODULE INTÉGRATIONS
// ═══════════════════════════════════════════════════════════
const IntegrationsPage = ({ clients, onUpdate }) => {
  const [tiimeStatus, setTiimeStatus] = useState("disconnected");
  const [outlookStatus, setOutlookStatus] = useState("disconnected");
  const [importing, setImporting] = useState(false);
  const [importLog, setImportLog] = useState([]);
  const fileRef = useRef();

  const connectOutlook = () => {
    setOutlookStatus("connecting");
    setTimeout(() => { setOutlookStatus("connected"); }, 1500);
  };

  const connectTiime = () => {
    setTiimeStatus("connecting");
    setTimeout(() => { setTiimeStatus("connected"); }, 1500);
  };

  const simulateImportTiime = () => {
    setImporting(true);
    setImportLog([]);
    const logs = [
      "⏳ Connexion à Tiime Accounting...",
      "📥 Récupération du FEC – SARL DUPONT & FILS (janv. 2026)...",
      "✅ 248 écritures importées · TVA collectée : 14 280 € · TVA déductible : 3 120 €",
      "📥 Récupération du FEC – SAS TECHFLOW (janv. 2026)...",
      "✅ 512 écritures importées · TVA collectée : 48 000 € · TVA déductible : 12 400 €",
      "📊 Mise à jour automatique de l'avancement saisie → 90%",
      "🔄 Synchronisation terminée · 2 dossiers mis à jour",
    ];
    logs.forEach((l, i) => setTimeout(() => {
      setImportLog(prev => [...prev, l]);
      if (i === logs.length - 1) {
        setImporting(false);
        onUpdate(1, { avancement: { saisie: 90, rapprochement: 60, declarations: 40, bilan: 10 } });
        onUpdate(5, { avancement: { saisie: 90, rapprochement: 55, declarations: 35, bilan: 5 } });
      }
    }, (i + 1) * 900));
  };

  const handleCsvImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImportLog([
        `📂 Fichier chargé : ${file.name}`,
        `📊 Analyse du FEC en cours...`,
        `✅ Format FEC valide · ${ev.target.result.split("\n").length - 1} lignes détectées`,
        `🔄 Prêt à importer dans le dossier client`,
      ]);
    };
    reader.readAsText(file);
  };

  const syncOutlookCalendar = () => {
    alert(`📅 Synchronisation Outlook – ${ECHEANCES.length} échéances exportées vers votre calendrier Microsoft 365.\n\nLes événements suivants ont été créés :\n${ECHEANCES.map(e => `• ${e.label} – ${fmt(e.date)}`).join("\n")}`);
  };

  const StatusBadge = ({ status }) => {
    const cfg = { connected: ["✅ Connecté", "#2d7a4f"], connecting: ["⏳ Connexion...", "#b07d1a"], disconnected: ["Non connecté", "#888"] }[status];
    return <Badge label={cfg[0]} color={cfg[1]} />;
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2332", margin: 0 }}>Intégrations</h2>
        <p style={{ color: "#888", fontSize: 13, margin: "4px 0 0" }}>Connectez NEOWISE CRM à vos outils métier</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Tiime */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, background: "linear-gradient(135deg,#6c3fc5,#4a90d9)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🔵</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#1a2332" }}>Tiime Accounting</div>
              <StatusBadge status={tiimeStatus} />
            </div>
          </div>
          <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>
            Importez automatiquement les FEC, rapprochements bancaires et données de saisie depuis Tiime pour mettre à jour l'avancement des dossiers en temps réel.
          </p>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 14, padding: 10, background: "#f7f9fc", borderRadius: 8 }}>
            <strong>Modes disponibles :</strong><br />
            • Import FEC CSV/TXT (manuel)<br />
            • API Tiime partenaire (accord Tiime requis)<br />
            • Export grand livre → mise à jour avancement auto
          </div>
          {tiimeStatus !== "connected" ? (
            <Btn onClick={connectTiime} style={{ width: "100%" }}>{tiimeStatus === "connecting" ? "Connexion en cours..." : "🔌 Connecter Tiime"}</Btn>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Btn onClick={simulateImportTiime} style={{ width: "100%" }}>🔄 Importer depuis Tiime</Btn>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn outline small onClick={() => fileRef.current.click()} style={{ flex: 1 }}>📂 Import FEC (CSV)</Btn>
                <input ref={fileRef} type="file" accept=".csv,.txt" style={{ display: "none" }} onChange={handleCsvImport} />
              </div>
            </div>
          )}
        </Card>

        {/* Outlook */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, background: "linear-gradient(135deg,#0078d4,#00bcf2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📧</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#1a2332" }}>Microsoft Outlook 365</div>
              <StatusBadge status={outlookStatus} />
            </div>
          </div>
          <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>
            Synchronisez votre calendrier avec les échéances fiscales, envoyez des relances directement depuis le CRM, et créez des tâches Outlook pour vos équipes.
          </p>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 14, padding: 10, background: "#f7f9fc", borderRadius: 8 }}>
            <strong>Fonctionnalités :</strong><br />
            • Export échéances → Calendrier Outlook<br />
            • Envoi emails de relance via Microsoft Graph<br />
            • Création de tâches To-Do pour la collaboratrice<br />
            • OAuth 2.0 (connexion sécurisée à votre compte)
          </div>
          {outlookStatus !== "connected" ? (
            <Btn onClick={connectOutlook} color="#0078d4" style={{ width: "100%" }}>{outlookStatus === "connecting" ? "Connexion en cours..." : "🔗 Connecter Outlook"}</Btn>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Btn color="#0078d4" onClick={syncOutlookCalendar} style={{ width: "100%" }}>📅 Sync calendrier échéances</Btn>
              <Btn outline small color="#0078d4" onClick={() => alert("📋 Tâches créées dans Outlook To-Do pour la collaboratrice")} style={{ width: "100%" }}>✅ Créer tâches équipe</Btn>
            </div>
          )}
        </Card>
      </div>

      {/* Log d'import */}
      {importLog.length > 0 && (
        <Card>
          <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 800 }}>Journal d'import</h4>
          <div style={{ fontFamily: "monospace", fontSize: 12, background: "#0f1a2a", padding: 16, borderRadius: 10, color: "#7ecbf7" }}>
            {importLog.map((l, i) => <div key={i} style={{ marginBottom: 4, opacity: importing && i === importLog.length - 1 ? 0.7 : 1 }}>{l}</div>)}
            {importing && <span style={{ animation: "blink 1s infinite" }}>▌</span>}
          </div>
        </Card>
      )}

      {/* Architecture technique */}
      <Card style={{ marginTop: 20 }}>
        <h4 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 800 }}>🏗️ Architecture d'intégration en production</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { title: "Tiime → CRM (FEC/CSV)", steps: ["Export FEC depuis Tiime (menu Exports)", "Upload dans le CRM (import CSV)", "Parsing automatique des journaux comptables", "Mise à jour avancement + alertes anomalies"], color: "#6c3fc5" },
            { title: "Outlook (Microsoft Graph API)", steps: ["Authentification OAuth 2.0 (une seule fois)", "GET /me/calendars → sync échéances", "POST /me/messages → envoi relances", "POST /me/tasks → tâches collaboratrice"], color: "#0078d4" },
          ].map((block, i) => (
            <div key={i} style={{ padding: 14, background: "#f7f9fc", borderRadius: 10, border: `1px solid ${block.color}33` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: block.color, marginBottom: 10 }}>{block.title}</div>
              {block.steps.map((s, j) => <div key={j} style={{ fontSize: 11, color: "#555", padding: "4px 0", borderBottom: "1px solid #eee", display: "flex", gap: 8 }}><span style={{ color: block.color, fontWeight: 700 }}>{j + 1}.</span>{s}</div>)}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════
// FICHE CLIENT COMPLÈTE — inspirée des Excel de suivi
// ═══════════════════════════════════════════════════════════

const MOIS = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"];

// Workflow bilan exact (colonnes de votre Excel AVANCEMENT BILAN)
const WORKFLOW_BILAN = [
  { key: "docs_recus", label: "Documents reçus", icon: "📂" },
  { key: "saisie", label: "Saisie", icon: "⌨️" },
  { key: "revise_collab", label: "Révisé Collab", icon: "👓" },
  { key: "revise_eda", label: "Révisé EDA", icon: "✅" },
  { key: "revue_associe", label: "Revue Associé", icon: "🤝" },
  { key: "tdfc", label: "TDFC", icon: "📤" },
  { key: "annexes_fiscales", label: "Annexes fiscales", icon: "📋" },
  { key: "is", label: "IS", icon: "💰" },
  { key: "ca12", label: "CA12", icon: "📊" },
  { key: "cvae", label: "CVAE", icon: "🏢" },
  { key: "das2", label: "DAS2", icon: "👥" },
  { key: "envoi_plaquette", label: "Envoi plaquette", icon: "📬" },
];

const WORKFLOW_MISE_EN_ROUTE = [
  { key: "fiche_client", label: "Création fiche client" },
  { key: "compta_n1", label: "Comptabilité N-1 / FEC" },
  { key: "mandat_ebics", label: "Mandat EBICS / Tiime" },
  { key: "compte_impots", label: "Compte impots.gouv" },
  { key: "lettre_mission", label: "Lettre de mission" },
  { key: "acces_tiime", label: "Accès Tiime configuré" },
];

const getDefaultWorkflow = () => {
  const w = {};
  WORKFLOW_BILAN.forEach(s => { w[s.key] = false; });
  return w;
};

const getDefaultMiseEnRoute = () => {
  const m = {};
  WORKFLOW_MISE_EN_ROUTE.forEach(s => { m[s.key] = false; });
  return m;
};

const getDefaultTVA = () => {
  const t = {};
  MOIS.forEach((_, i) => { t[i] = { fait: false, commentaire: "" }; });
  return t;
};

const getDefaultIS = () => ({
  acompte1: { fait: false, montant: "" },
  acompte2: { fait: false, montant: "" },
  acompte3: { fait: false, montant: "" },
  acompte4: { fait: false, montant: "" },
  solde: { fait: false, montant: "" },
});

const getDefaultIR = () => ({
  elements: "",
  docs_recus: false,
  saisie: false,
  revue: false,
  mail_client: false,
  envoye_edi: false,
  commentaire: "",
});

const getDefaultPlanning = () => {
  const p = {};
  MOIS.forEach((_, i) => { p[i] = { eda: "", collab: "" }; });
  return p;
};

// Checkbox stylé
const CB = ({ checked, onChange, label, color = "#1a5c8a" }) => (
  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "6px 8px", borderRadius: 6, background: checked ? color + "12" : "transparent", transition: "background .15s" }}>
    <div onClick={onChange} style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${checked ? color : "#ccc"}`, background: checked ? color : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", transition: "all .15s" }}>
      {checked && <span style={{ color: "#fff", fontSize: 11, fontWeight: 900, lineHeight: 1 }}>✓</span>}
    </div>
    <span style={{ fontSize: 12, fontWeight: checked ? 700 : 500, color: checked ? color : "#555" }}>{label}</span>
  </label>
);

// ── Module Dossier Bilan ──────────────────────────────────
const DossierBilanPanel = ({ client, onUpdate, currentUser }) => {
  const workflow = client.workflow || getDefaultWorkflow();
  const commentaire = client.commentaireBilan || "";

  const toggle = (key) => {
    const newW = { ...workflow, [key]: !workflow[key] };
    onUpdate(client.id, { workflow: newW });
  };

  const done = Object.values(workflow).filter(Boolean).length;
  const total = WORKFLOW_BILAN.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div>
      {/* Barre progression */}
      <div style={{ marginBottom: 18, padding: 14, background: "#f0f5fa", borderRadius: 10, border: "1px solid #cce0f5" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 800, marginBottom: 6 }}>
          <span>Avancement bilan 31/12/2025</span>
          <span style={{ color: pct === 100 ? "#2d7a4f" : pct >= 60 ? "#b07d1a" : "#c0392b" }}>{done}/{total} étapes · {pct}%</span>
        </div>
        <div style={{ background: "#dde9f5", borderRadius: 6, height: 8 }}>
          <div style={{ width: pct + "%", height: "100%", background: pct === 100 ? "#2d7a4f" : pct >= 60 ? "#b07d1a" : "#1a5c8a", borderRadius: 6, transition: "width .5s" }} />
        </div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 6 }}>
          Responsable : <strong>{USERS.find(u => u.id === client.responsable)?.name}</strong>
        </div>
      </div>

      {/* Grille workflow exact comme votre Excel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {WORKFLOW_BILAN.map(step => (
          <div key={step.key} style={{ padding: "8px 10px", background: workflow[step.key] ? "#f0faf5" : "#f7f9fc", borderRadius: 8, border: "1px solid " + (workflow[step.key] ? "#b8e8cc" : "#e8ecf0"), transition: "all .15s" }}>
            <CB checked={workflow[step.key]} onChange={() => toggle(step.key)} label={step.icon + " " + step.label} color="#2d7a4f" />
          </div>
        ))}
      </div>

      {/* Commentaire */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Commentaire dossier</div>
        <textarea
          value={commentaire}
          onChange={e => onUpdate(client.id, { commentaireBilan: e.target.value })}
          placeholder="Relances, observations, points en attente..."
          style={{ width: "100%", minHeight: 70, padding: "8px 12px", borderRadius: 8, border: "1px solid #dde3ea", fontSize: 12, resize: "vertical", boxSizing: "border-box" }}
        />
      </div>

      {/* Documents reçus */}
      {client.docs && client.docs.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#1a2332", marginBottom: 8 }}>📂 Documents</div>
          {client.docs.map((d, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", background: "#f7f9fc", borderRadius: 7, border: "1px solid #e8ecf0", marginBottom: 4 }}>
              <span style={{ fontSize: 12 }}>📄 {d.nom}</span>
              <Badge label={d.statut} color={sc(d.statut)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Module Suivi TVA mensuel ──────────────────────────────
const SuiviTVAPanel = ({ client, onUpdate }) => {
  const tva = client.suiviTVA || getDefaultTVA();
  const annee = 2026;
  const mode = client.modeTVA || "EDI";

  const toggleMois = (i) => {
    const newTVA = { ...tva, [i]: { ...tva[i], fait: !tva[i]?.fait } };
    onUpdate(client.id, { suiviTVA: newTVA });
  };

  const setComment = (i, val) => {
    const newTVA = { ...tva, [i]: { ...tva[i], commentaire: val } };
    onUpdate(client.id, { suiviTVA: newTVA });
  };

  const fait = Object.values(tva).filter(m => m?.fait).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800 }}>Suivi TVA {annee - 1}/{annee}</div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{fait}/12 déclarations effectuées</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#888" }}>Mode :</span>
          <select value={mode} onChange={e => onUpdate(client.id, { modeTVA: e.target.value })}
            style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #dde3ea", fontSize: 12 }}>
            {["EDI", "EDI TRIM", "IMPOT.GOUV", "Tiime", "CA12", "Franchise"].map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Grille 12 mois */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {MOIS.map((mois, i) => {
          const m = tva[i] || { fait: false, commentaire: "" };
          return (
            <div key={i} style={{ padding: 10, background: m.fait ? "#f0faf5" : "#f7f9fc", borderRadius: 9, border: "1px solid " + (m.fait ? "#b8e8cc" : "#e8ecf0"), transition: "all .15s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#1a2332" }}>{mois} {i < 3 ? annee : annee - 1}</span>
                <div onClick={() => toggleMois(i)} style={{ width: 22, height: 22, borderRadius: 5, border: "2px solid " + (m.fait ? "#2d7a4f" : "#ccc"), background: m.fait ? "#2d7a4f" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .15s" }}>
                  {m.fait && <span style={{ color: "#fff", fontSize: 12, fontWeight: 900 }}>✓</span>}
                </div>
              </div>
              <input
                value={m.commentaire || ""}
                onChange={e => setComment(i, e.target.value)}
                placeholder="Note..."
                style={{ width: "100%", padding: "3px 6px", borderRadius: 5, border: "1px solid #e8ecf0", fontSize: 10, boxSizing: "border-box" }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Module Suivi IS ───────────────────────────────────────
const SuiviISPanel = ({ client, onUpdate }) => {
  const is = client.suiviIS || getDefaultIS();
  const annee = 2026;

  const toggle = (key) => {
    const newIS = { ...is, [key]: { ...is[key], fait: !is[key]?.fait } };
    onUpdate(client.id, { suiviIS: newIS });
  };

  const setMontant = (key, val) => {
    const newIS = { ...is, [key]: { ...is[key], montant: val } };
    onUpdate(client.id, { suiviIS: newIS });
  };

  const acomptes = [
    { key: "acompte1", label: "1er acompte", date: "15 mars " + annee },
    { key: "acompte2", label: "2ème acompte", date: "15 juin " + annee },
    { key: "acompte3", label: "3ème acompte", date: "15 sept. " + annee },
    { key: "acompte4", label: "4ème acompte", date: "15 déc. " + annee },
    { key: "solde", label: "Solde IS", date: "15 avril " + annee },
  ];

  const fait = acomptes.filter(a => is[a.key]?.fait).length;

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4 }}>Suivi acomptes IS {annee}</div>
      <div style={{ fontSize: 11, color: "#888", marginBottom: 14 }}>{fait}/{acomptes.length} acomptes effectués</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {acomptes.map(a => {
          const item = is[a.key] || { fait: false, montant: "" };
          return (
            <div key={a.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: item.fait ? "#f0faf5" : "#f7f9fc", borderRadius: 10, border: "1px solid " + (item.fait ? "#b8e8cc" : "#e8ecf0") }}>
              <div onClick={() => toggle(a.key)} style={{ width: 24, height: 24, borderRadius: 6, border: "2px solid " + (item.fait ? "#2d7a4f" : "#ccc"), background: item.fait ? "#2d7a4f" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                {item.fait && <span style={{ color: "#fff", fontSize: 13, fontWeight: 900 }}>✓</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{a.label}</div>
                <div style={{ fontSize: 11, color: "#aaa" }}>{a.date}</div>
              </div>
              <input
                value={item.montant || ""}
                onChange={e => setMontant(a.key, e.target.value)}
                placeholder="Montant €"
                style={{ width: 110, padding: "5px 8px", borderRadius: 7, border: "1px solid #dde3ea", fontSize: 12, textAlign: "right" }}
              />
              {item.fait && <Badge label="Fait" color="#2d7a4f" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Module Suivi IR Particuliers ──────────────────────────
const SuiviIRPanel = ({ client, onUpdate }) => {
  const ir = client.suiviIR || getDefaultIR();

  const update = (key, val) => {
    onUpdate(client.id, { suiviIR: { ...ir, [key]: val } });
  };

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 14 }}>Suivi IR / Déclaration 2042</div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Éléments à déclarer</div>
        <textarea
          value={ir.elements || ""}
          onChange={e => update("elements", e.target.value)}
          placeholder="- Salaires&#10;- Revenus fonciers&#10;- RF/SCI&#10;- IFI&#10;- Dons..."
          style={{ width: "100%", minHeight: 90, padding: "8px 12px", borderRadius: 8, border: "1px solid #dde3ea", fontSize: 12, resize: "vertical", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[
          { key: "docs_recus", label: "📂 Documents reçus" },
          { key: "saisie", label: "⌨️ Saisie effectuée" },
          { key: "revue", label: "✅ Revue associé" },
          { key: "mail_client", label: "📧 Mail client envoyé" },
          { key: "envoye_edi", label: "📤 Envoyé EDI" },
        ].map(item => (
          <div key={item.key} style={{ padding: "8px 10px", background: ir[item.key] ? "#f0faf5" : "#f7f9fc", borderRadius: 8, border: "1px solid " + (ir[item.key] ? "#b8e8cc" : "#e8ecf0") }}>
            <CB checked={ir[item.key]} onChange={() => update(item.key, !ir[item.key])} label={item.label} color="#2d7a4f" />
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Commentaire</div>
        <textarea
          value={ir.commentaire || ""}
          onChange={e => update("commentaire", e.target.value)}
          placeholder="Observations, points particuliers..."
          style={{ width: "100%", minHeight: 60, padding: "8px 12px", borderRadius: 8, border: "1px solid #dde3ea", fontSize: 12, resize: "vertical", boxSizing: "border-box" }}
        />
      </div>
    </div>
  );
};

// ── Module Mise en route nouveaux clients ─────────────────
const MiseEnRoutePanel = ({ client, onUpdate }) => {
  const mer = client.miseEnRoute || getDefaultMiseEnRoute();
  const done = Object.values(mer).filter(Boolean).length;

  const toggle = (key) => {
    onUpdate(client.id, { miseEnRoute: { ...mer, [key]: !mer[key] } });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800 }}>Mise en route nouveau client</div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{done}/{WORKFLOW_MISE_EN_ROUTE.length} étapes complétées</div>
        </div>
        {done === WORKFLOW_MISE_EN_ROUTE.length && <Badge label="✅ Prêt" color="#2d7a4f" />}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ background: "#e8ecf0", borderRadius: 6, height: 6 }}>
          <div style={{ width: Math.round((done / WORKFLOW_MISE_EN_ROUTE.length) * 100) + "%", height: "100%", background: "#2d7a4f", borderRadius: 6, transition: "width .4s" }} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {WORKFLOW_MISE_EN_ROUTE.map(step => (
          <div key={step.key} style={{ padding: "10px 14px", background: mer[step.key] ? "#f0faf5" : "#f7f9fc", borderRadius: 10, border: "1px solid " + (mer[step.key] ? "#b8e8cc" : "#e8ecf0") }}>
            <CB checked={mer[step.key]} onChange={() => toggle(step.key)} label={step.label} color="#2d7a4f" />
          </div>
        ))}
      </div>

      {/* Infos pratiques */}
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>N° dossier</div>
          <input value={client.numeroDossier || ""} onChange={e => onUpdate(client.id, { numeroDossier: e.target.value })}
            placeholder="Ex: 8831" style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: "1px solid #dde3ea", fontSize: 12, boxSizing: "border-box" }} />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Date entrée cabinet</div>
          <input type="date" value={client.dateEntree || ""} onChange={e => onUpdate(client.id, { dateEntree: e.target.value })}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: "1px solid #dde3ea", fontSize: 12, boxSizing: "border-box" }} />
        </div>
      </div>
    </div>
  );
};

// ── Module Planning horaire mensuel ───────────────────────
const PlanningPanel = ({ client, onUpdate }) => {
  const planning = client.planning || getDefaultPlanning();
  const annee = 2026;

  const update = (i, who, val) => {
    const newP = { ...planning, [i]: { ...planning[i], [who]: val } };
    onUpdate(client.id, { planning: newP });
  };

  const totalEDA = Object.values(planning).reduce((s, m) => s + (parseFloat(m?.eda) || 0), 0);
  const totalCollab = Object.values(planning).reduce((s, m) => s + (parseFloat(m?.collab) || 0), 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 800 }}>Planning horaire {annee - 1}/{annee}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ textAlign: "center", padding: "4px 10px", background: "#e8f0f8", borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: "#1a5c8a", fontWeight: 700 }}>EDA</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#1a5c8a" }}>{totalEDA}h</div>
          </div>
          <div style={{ textAlign: "center", padding: "4px 10px", background: "#e8f5ee", borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: "#2d7a4f", fontWeight: 700 }}>Collab</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#2d7a4f" }}>{totalCollab}h</div>
          </div>
          <div style={{ textAlign: "center", padding: "4px 10px", background: "#f7f9fc", borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: "#888", fontWeight: 700 }}>Total</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#1a2332" }}>{totalEDA + totalCollab}h</div>
          </div>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#f7f9fc" }}>
              <th style={{ padding: "8px 10px", textAlign: "left", fontSize: 11, fontWeight: 800, color: "#888", textTransform: "uppercase" }}>Mois</th>
              {MOIS.map((m, i) => (
                <th key={i} style={{ padding: "6px 4px", textAlign: "center", fontSize: 10, fontWeight: 700, color: "#888", minWidth: 48 }}>{m}</th>
              ))}
              <th style={{ padding: "6px 8px", textAlign: "center", fontSize: 11, fontWeight: 800, color: "#888" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {[
              { who: "eda", label: "EDA", color: "#1a5c8a" },
              { who: "collab", label: "Collab", color: "#2d7a4f" },
            ].map(row => {
              const total = Object.values(planning).reduce((s, m) => s + (parseFloat(m?.[row.who]) || 0), 0);
              return (
                <tr key={row.who} style={{ borderTop: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "6px 10px", fontWeight: 700, color: row.color }}>{row.label}</td>
                  {MOIS.map((_, i) => (
                    <td key={i} style={{ padding: "4px 2px", textAlign: "center" }}>
                      <input
                        type="number"
                        value={planning[i]?.[row.who] || ""}
                        onChange={e => update(i, row.who, e.target.value)}
                        placeholder="0"
                        style={{ width: 40, padding: "3px 4px", borderRadius: 5, border: "1px solid #e8ecf0", fontSize: 11, textAlign: "center", color: row.color, fontWeight: 700 }}
                      />
                    </td>
                  ))}
                  <td style={{ padding: "6px 8px", textAlign: "center", fontWeight: 900, color: row.color, background: row.color + "10", borderRadius: 6 }}>{total}h</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── FICHE CLIENT PRINCIPALE ───────────────────────────────
const ClientDetail = ({ client, onClose, currentUser, onUpdate }) => {
  const [tab, setTab] = useState("dossier");

  const tabs = [
    { id: "dossier", label: "📁 Dossier bilan" },
    { id: "tva", label: "🧾 Suivi TVA" },
    { id: "is", label: "💰 Suivi IS" },
    { id: "ir", label: "📝 Suivi IR" },
    { id: "planning", label: "📅 Planning" },
    { id: "mise_en_route", label: "🚀 Mise en route" },
    { id: "temps", label: "⏱ Temps / Renta" },
    { id: "demandes", label: "💬 Demandes" },
    { id: "facturation", label: "🧾 Facturation" },
    { id: "echeances", label: "⏳ Échéances" },
    { id: "espace", label: "🔗 Espace client" },
    { id: "ldm", label: "📄 LDM" },
    { id: "notes", label: "📝 Notes" },
  ];

  const workflow = client.workflow || getDefaultWorkflow();
  const done = Object.values(workflow).filter(Boolean).length;
  const pct = Math.round((done / WORKFLOW_BILAN.length) * 100);

  const [editNotes, setEditNotes] = useState(false);
  const [notesVal, setNotesVal] = useState(client.notes);
  const [showDemandeForm, setShowDemandeForm] = useState(false);
  const [newDemande, setNewDemande] = useState({ sujet: "", priorite: "Normale" });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,20,40,.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 960, maxHeight: "92vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>

        {/* Header */}
        <div style={{ padding: "16px 22px 12px", background: "linear-gradient(135deg,#1a2332,#1a5c8a)", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#fff" }}>{client.nom}</h2>
                {client.numeroDossier && <Badge label={"N°" + client.numeroDossier} color="#7ecbf7" />}
              </div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {[client.forme, client.tva, client.activite].filter(Boolean).map(l => <Badge key={l} label={l} color="#7ecbf7" />)}
                <Badge label={client.statut || "En cours"} color={sc(client.statut || "En cours")} />
              </div>
              <div style={{ fontSize: 11, color: "#aac8e0", marginTop: 5 }}>
                {[client.contact, client.email, client.tel, "Resp : " + (USERS.find(u => u.id === client.responsable)?.name || "—")].filter(Boolean).join(" · ")}
              </div>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,.15)", border: "none", color: "#fff", borderRadius: 8, width: 32, height: 32, fontSize: 16, cursor: "pointer", flexShrink: 0 }}>✕</button>
          </div>
          {/* Barre avancement bilan */}
          <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#aac8e0", marginBottom: 3 }}>
              <span>Avancement bilan</span>
              <span style={{ fontWeight: 800 }}>{pct}% · {done}/{WORKFLOW_BILAN.length} étapes</span>
            </div>
            <div style={{ background: "rgba(255,255,255,.2)", borderRadius: 6, height: 6 }}>
              <div style={{ width: pct + "%", height: "100%", background: pct === 100 ? "#4de899" : pct >= 60 ? "#ffc93c" : "#ff6b6b", borderRadius: 6, transition: "width .5s" }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #e8ecf0", background: "#f7f9fc", overflowX: "auto", flexShrink: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ border: "none", background: "none", padding: "9px 13px", fontSize: 11, fontWeight: tab === t.id ? 800 : 500, color: tab === t.id ? "#1a5c8a" : "#888", borderBottom: tab === t.id ? "2px solid #1a5c8a" : "2px solid transparent", cursor: "pointer", whiteSpace: "nowrap" }}>{t.label}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: 20 }}>

          {tab === "dossier" && <DossierBilanPanel client={client} onUpdate={onUpdate} currentUser={currentUser} />}
          {tab === "tva" && <SuiviTVAPanel client={client} onUpdate={onUpdate} />}
          {tab === "is" && <SuiviISPanel client={client} onUpdate={onUpdate} />}
          {tab === "ir" && <SuiviIRPanel client={client} onUpdate={onUpdate} />}
          {tab === "planning" && <PlanningPanel client={client} onUpdate={onUpdate} />}
          {tab === "mise_en_route" && <MiseEnRoutePanel client={client} onUpdate={onUpdate} />}
          {tab === "temps" && <TempsPanel client={client} onUpdate={onUpdate} currentUser={currentUser} />}

          {tab === "demandes" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ fontSize: 13, fontWeight: 800, margin: 0 }}>Demandes client</h3>
                <Btn small onClick={() => setShowDemandeForm(!showDemandeForm)}>+ Nouvelle</Btn>
              </div>
              {showDemandeForm && (
                <div style={{ padding: 14, background: "#f0f5fa", borderRadius: 10, marginBottom: 14, border: "1px solid #cce0f5" }}>
                  <Input label="Sujet" value={newDemande.sujet} onChange={e => setNewDemande({ ...newDemande, sujet: e.target.value })} placeholder="Sujet..." />
                  <Sel label="Priorité" value={newDemande.priorite} onChange={e => setNewDemande({ ...newDemande, priorite: e.target.value })} options={["Urgente", "Haute", "Normale"]} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn small onClick={() => { if (!newDemande.sujet) return; onUpdate(client.id, { demandes: [...(client.demandes||[]), { id: Date.now(), date: "2026-03-28", sujet: newDemande.sujet, statut: "En cours", priorite: newDemande.priorite }] }); setNewDemande({ sujet: "", priorite: "Normale" }); setShowDemandeForm(false); }}>Ajouter</Btn>
                    <Btn small outline onClick={() => setShowDemandeForm(false)}>Annuler</Btn>
                  </div>
                </div>
              )}
              {(client.demandes||[]).map(d => (
                <div key={d.id} style={{ padding: 12, background: "#f7f9fc", borderRadius: 10, border: "1px solid #e8ecf0", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{d.sujet}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>{fmt(d.date)}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Badge label={d.priorite} color={pc(d.priorite?.toLowerCase())} />
                      <Badge label={d.statut} color={sc(d.statut)} />
                    </div>
                  </div>
                  {d.statut !== "Traité" && <Btn small style={{ marginTop: 8 }} color="#2d7a4f" onClick={() => onUpdate(client.id, { demandes: client.demandes.map(x => x.id === d.id ? { ...x, statut: "Traité" } : x) })}>✓ Traité</Btn>}
                </div>
              ))}
            </div>
          )}

          {tab === "facturation" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 18 }}>
                {[
                  { label: "Total facturé", val: (client.factures||[]).reduce((s,f)=>s+f.montant,0), color: "#1a5c8a" },
                  { label: "Encaissé", val: (client.factures||[]).filter(f=>f.statut==="Payée").reduce((s,f)=>s+f.montant,0), color: "#2d7a4f" },
                  { label: "En attente", val: (client.factures||[]).filter(f=>f.statut!=="Payée"&&f.statut!=="À envoyer").reduce((s,f)=>s+f.montant,0), color: "#c0392b" },
                ].map((k,i) => (
                  <div key={i} style={{ padding: 12, background: "#f7f9fc", borderRadius: 10, border: "1px solid #e8ecf0", textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "#888", fontWeight: 700, textTransform: "uppercase" }}>{k.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: k.color, marginTop: 4 }}>{fmtM(k.val)}</div>
                  </div>
                ))}
              </div>
              {(client.factures||[]).map(f => (
                <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "#f7f9fc", borderRadius: 8, border: "1px solid #e8ecf0", marginBottom: 6 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 800 }}>{f.id}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>{f.libelle} · {fmt(f.date)}</div>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 13 }}>{fmtM(f.montant)}</div>
                  <Badge label={f.statut} color={sc(f.statut)} />
                </div>
              ))}
              {(!client.factures || client.factures.length === 0) && (
                <div style={{ textAlign: "center", padding: 30, color: "#aaa", fontSize: 13 }}>Aucune facture enregistrée</div>
              )}
            </div>
          )}

          {tab === "echeances" && (
            <div>
              {(client.forme && client.forme !== "À définir") ? (
                <div style={{ padding: 12, background: "#f0f5fa", borderRadius: 10, border: "1px solid #cce0f5", marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#1a5c8a", marginBottom: 6, textTransform: "uppercase" }}>Situation fiscale</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {getSituationFiscale(client).map((item, i) => <Badge key={i} label={item} color="#1a5c8a" />)}
                  </div>
                </div>
              ) : (
                <div style={{ padding: 12, background: "#fffbf0", borderRadius: 10, border: "1px solid #ffe5a0", marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: "#b07d1a", fontWeight: 700 }}>Renseignez la forme juridique pour voir les écheances automatiques.</div>
                </div>
              )}
              {genererEcheances(client).map(e => {
                const j = daysLeft(e.date);
                return (
                  <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: j <= 7 ? "#fff0f0" : j <= 15 ? "#fffbf0" : "#f7f9fc", borderRadius: 10, border: "1px solid " + (j <= 7 ? "#ffcccc" : j <= 15 ? "#ffe5a0" : "#e8ecf0"), marginBottom: 7 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: j <= 7 ? "#c0392b" : j <= 15 ? "#b07d1a" : "#1a5c8a", minWidth: 44, textAlign: "center", background: j <= 7 ? "#ffecec" : j <= 15 ? "#fff4cc" : "#e8f0f8", borderRadius: 7, padding: "3px 5px" }}>
                      {j <= 0 ? "Passé" : "J-" + j}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{e.label}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>{fmt(e.date)}</div>
                    </div>
                    <Badge label={e.type} color={pc(e.priorite)} />
                  </div>
                );
              })}
            </div>
          )}

          {tab === "espace" && <EspaceClientPanel client={client} />}
          {tab === "ldm" && <LettreMissionPanel client={client} onUpdate={onUpdate} />}

          {tab === "notes" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 style={{ fontSize: 13, fontWeight: 800, margin: 0 }}>Notes internes</h3>
                <Btn small onClick={() => { if (editNotes) onUpdate(client.id, { notes: notesVal }); setEditNotes(!editNotes); }} color={editNotes ? "#2d7a4f" : "#1a5c8a"}>{editNotes ? "✓ Enregistrer" : "✏️ Modifier"}</Btn>
              </div>
              {editNotes
                ? <textarea value={notesVal} onChange={e => setNotesVal(e.target.value)} style={{ width: "100%", minHeight: 180, padding: 14, borderRadius: 10, border: "1px solid #1a5c8a", fontSize: 13, lineHeight: 1.6, resize: "vertical", boxSizing: "border-box" }} />
                : <div style={{ padding: 16, background: "#f7f9fc", borderRadius: 10, border: "1px solid #e8ecf0", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", minHeight: 60 }}>{client.notes || "Aucune note."}</div>
              }
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ clients, currentUser, onSelectClient }) => {
  const totalCA = clients.reduce((s, c) => s + c.ca, 0);
  const allFactures = clients.flatMap(c => c.factures);
  const totalEncaisse = allFactures.filter(f => f.statut === "Payée").reduce((s, f) => s + f.montant, 0);
  const impayees = allFactures.filter(f => f.statut === "Impayée").reduce((s, f) => s + f.montant, 0);
  const totalHeures = clients.flatMap(c => c.temps).reduce((s, t) => s + t.duree, 0);
  const allEcheances = clients.flatMap(c => genererEcheances(c).map(e => ({...e, clientNom: c.nom, clientId: c.id})));
  const urgentes = allEcheances.filter(e => daysLeft(e.date) <= 30 && daysLeft(e.date) > 0).sort((a,b) => new Date(a.date)-new Date(b.date)).reduce((acc, e) => { const existing = acc.find(x => x.label===e.label); if(!existing) acc.push(e); return acc; }, []);
  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2332", margin: 0 }}>Tableau de bord</h2>
        <p style={{ color: "#888", fontSize: 13, margin: "4px 0 0" }}>{today.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · NEOWISE EXPERTISE · {USERS.find(u => u.id === currentUser.id)?.name}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 22 }}>
        {[
          { label: "Clients", val: clients.length, sub: `${clients.filter(c => c.responsable === currentUser.id).length} à votre charge`, color: "#1a5c8a", icon: "👥" },
          { label: "CA suivi", val: fmtM(totalCA), sub: "Portefeuille total", color: "#2d7a4f", icon: "📊" },
          { label: "Encaissé", val: fmtM(totalEncaisse), sub: "Honoraires réglés", color: "#5a3e8a", icon: "💳" },
          { label: "Impayés", val: fmtM(impayees), sub: `${clients.flatMap(c => c.factures.filter(f => f.statut === "Impayée")).length} facture(s)`, color: "#c0392b", icon: "⚠️" },
          { label: "Heures passées", val: totalHeures + "h", sub: "Ce mois (tous dossiers)", color: "#b07d1a", icon: "⏱" },
        ].map((k, i) => (
          <Card key={i}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 10, color: "#888", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{k.label}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: k.color, margin: "4px 0 2px" }}>{k.val}</div>
                <div style={{ fontSize: 10, color: "#aaa" }}>{k.sub}</div>
              </div>
              <span style={{ fontSize: 26 }}>{k.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>⏳ Échéances 30 jours</h3>
            <Badge label={urgentes.length + ""} color="#c0392b" />
          </div>
          {urgentes.map(e => {
            const j = daysLeft(e.date);
            const clientsE = clients.filter(c => genererEcheances(c).some(ec => ec.label === e.label));
            return (
              <div key={e.id} style={{ display: "flex", gap: 10, padding: "8px 10px", background: j <= 7 ? "#fff0f0" : j <= 15 ? "#fffbf0" : "#f7f9fc", borderRadius: 8, border: `1px solid ${j <= 7 ? "#ffcccc" : j <= 15 ? "#ffe5a0" : "#e8ecf0"}`, marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: j <= 7 ? "#c0392b" : j <= 15 ? "#b07d1a" : "#1a5c8a", minWidth: 38, textAlign: "center", background: j <= 7 ? "#ffecec" : j <= 15 ? "#fff4cc" : "#e8f0f8", borderRadius: 6, padding: "2px 4px" }}>J-{j}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{e.label}</div>
                  <div style={{ fontSize: 10, color: "#aaa" }}>{fmt(e.date)} · {clientsE.length} client(s)</div>
                </div>
                <Badge label={e.type} color={pc(e.priorite)} />
              </div>
            );
          })}
        </Card>

        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>📁 Avancement dossiers</h3>
          </div>
          {clients.map(c => {
            const avg = Math.round((Object.values(c.workflow || {}).filter(Boolean).length / 12) * 100);
            return (
              <div key={c.id} onClick={() => onSelectClient(c)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #e8ecf0", marginBottom: 6, cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f0f5fa"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{c.nom}</span>
                  <Badge label={c.statut} color={sc(c.statut)} />
                </div>
                <Bar value={avg} color={avg >= 80 ? "#2d7a4f" : avg >= 50 ? "#b07d1a" : "#c0392b"} />
              </div>
            );
          })}
        </Card>
      </div>

      {/* Rentabilité globale */}
      <Card>
        <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 800 }}>📈 Rentabilité globale du cabinet (mois en cours)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
          {clients.map(c => {
            const cout = c.temps.reduce((s, t) => s + t.duree * (TAUX_HORAIRE[t.collaborateur] || 90), 0);
            const enc = c.factures.filter(f => f.statut === "Payée").reduce((s, f) => s + f.montant, 0);
            const ratio = cout > 0 ? Math.round((enc / cout) * 100) : 0;
            return (
              <div key={c.id} onClick={() => onSelectClient(c)} style={{ padding: 12, background: "#f7f9fc", borderRadius: 10, border: "1px solid #e8ecf0", cursor: "pointer" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#1a2332", marginBottom: 6 }}>{c.nom.split(" ").slice(0, 2).join(" ")}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: ratio >= 100 ? "#2d7a4f" : ratio >= 70 ? "#b07d1a" : "#c0392b" }}>{ratio}%</div>
                <div style={{ fontSize: 10, color: "#aaa" }}>{fmtM(enc)} / {fmtM(cout)}</div>
                <Bar value={Math.min(ratio, 100)} color={ratio >= 100 ? "#2d7a4f" : ratio >= 70 ? "#b07d1a" : "#c0392b"} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// LISTE CLIENTS
// ═══════════════════════════════════════════════════════════
const NouveauClientModal = ({ onClose, onAdd, currentUser }) => {
  const [form, setForm] = useState({
    nom: "", forme: "SARL", tva: "Réel normal", activite: "", ca: "",
    contact: "", email: "", tel: "", responsable: currentUser.id,
    honorairesMensuels: "", notes: ""
  });
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!form.nom || !form.contact || !form.email) { setError("Nom, contact et email sont obligatoires."); return; }
    const newClient = {
      id: Date.now(),
      nom: form.nom.toUpperCase(),
      forme: form.forme,
      tva: form.tva,
      activite: form.activite,
      ca: parseInt(form.ca) || 0,
      contact: form.contact,
      email: form.email,
      tel: form.tel,
      responsable: form.responsable,
      honorairesMensuels: parseInt(form.honorairesMensuels) || 0,
      statut: "En cours",
      avancement: { saisie: 0, rapprochement: 0, declarations: 0, bilan: 0 },
      docs: [],
      demandes: [],
      factures: [],
      temps: [],
      lettresMission: [],
      echeancesIds: [],
      notes: form.notes,
    };
    onAdd(newClient);
    onClose();
  };

  return (
    <Modal title="➕ Nouveau client" onClose={onClose} wide>
      {error && <div style={{ padding: "10px 14px", background: "#fff0f0", border: "1px solid #ffcccc", borderRadius: 8, color: "#c0392b", fontSize: 12, marginBottom: 16 }}>⚠️ {error}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ gridColumn: "1/-1" }}>
          <Input label="Dénomination sociale *" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Ex : SARL DUPONT & FILS" />
        </div>
        <Sel label="Forme juridique" value={form.forme} onChange={e => setForm({ ...form, forme: e.target.value })} options={["EI", "EURL", "SARL", "SAS", "SASU", "SCI", "SA", "Auto-entrepreneur", "Association"]} />
        <Input label="Activité" value={form.activite} onChange={e => setForm({ ...form, activite: e.target.value })} placeholder="Ex : BTP, Conseil, Commerce..." />
        <Sel label="Régime TVA" value={form.tva} onChange={e => setForm({ ...form, tva: e.target.value })} options={["Réel normal", "Réel simplifié", "Franchise", "Sans TVA", "CA12 annuelle"]} />
        <Input label="CA annuel HT (€)" type="number" value={form.ca} onChange={e => setForm({ ...form, ca: e.target.value })} placeholder="Ex : 250000" />
        <Input label="Contact *" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="Prénom NOM du dirigeant" />
        <Input label="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="contact@societe.fr" />
        <Input label="Téléphone" value={form.tel} onChange={e => setForm({ ...form, tel: e.target.value })} placeholder="06 00 00 00 00" />
        <Input label="Honoraires HT/mois (€)" type="number" value={form.honorairesMensuels} onChange={e => setForm({ ...form, honorairesMensuels: e.target.value })} placeholder="Ex : 1500" />
        <Sel label="Responsable dossier" value={form.responsable} onChange={e => setForm({ ...form, responsable: e.target.value })} options={USERS.map(u => ({ value: u.id, label: u.name }))} />
        <div style={{ gridColumn: "1/-1" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Notes internes</div>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Informations complémentaires, particularités du dossier..." style={{ width: "100%", minHeight: 80, padding: "10px 12px", borderRadius: 8, border: "1px solid #dde3ea", fontSize: 13, resize: "vertical", boxSizing: "border-box" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <Btn onClick={handleAdd} style={{ flex: 1 }}>✅ Créer le client</Btn>
        <Btn outline onClick={onClose}>Annuler</Btn>
      </div>
    </Modal>
  );
};

const ClientsList = ({ clients, onSelect, onAdd, currentUser }) => {
  const [search, setSearch] = useState("");
  const [filterResp, setFilterResp] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const filtered = clients.filter(c => (c.nom.toLowerCase().includes(search.toLowerCase()) || c.forme.toLowerCase().includes(search.toLowerCase())) && (filterResp === "all" || c.responsable === filterResp));

  return (
    <div>
      {showForm && <NouveauClientModal onClose={() => setShowForm(false)} onAdd={onAdd} currentUser={currentUser} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2332", margin: 0 }}>Clients</h2>
          <p style={{ color: "#888", fontSize: 13, margin: "4px 0 0" }}>{clients.length} dossier(s) au cabinet</p>
        </div>
        <Btn onClick={() => setShowForm(true)}>➕ Nouveau client</Btn>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Rechercher…" style={{ flex: 1, padding: "9px 14px", borderRadius: 8, border: "1px solid #e8ecf0", fontSize: 13 }} />
        <select value={filterResp} onChange={e => setFilterResp(e.target.value)} style={{ padding: "9px 14px", borderRadius: 8, border: "1px solid #e8ecf0", fontSize: 13 }}>
          <option value="all">Tous</option>
          {USERS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </div>
      {filtered.map(c => {
        const avg = Math.round((Object.values(c.workflow || {}).filter(Boolean).length / 12) * 100);
        const resp = USERS.find(u => u.id === c.responsable);
        const impayees = c.factures.filter(f => f.statut === "Impayée").reduce((s, f) => s + f.montant, 0);
        const totalHeures = c.temps.reduce((s, t) => s + t.duree, 0);
        const cout = c.temps.reduce((s, t) => s + t.duree * (TAUX_HORAIRE[t.collaborateur] || 90), 0);
        const enc = c.factures.filter(f => f.statut === "Payée").reduce((s, f) => s + f.montant, 0);
        const ratio = cout > 0 ? Math.round((enc / cout) * 100) : 0;
        return (
          <Card key={c.id} onClick={() => onSelect(c)} style={{ padding: 16, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, background: "linear-gradient(135deg,#1a5c8a,#2d7a4f)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 14, flexShrink: 0 }}>
                {c.nom.replace(/[^A-Z]/g, "").slice(0, 2) || c.nom.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 800 }}>{c.nom}</span>
                  <Badge label={c.forme} color="#1a5c8a" />
                  <Badge label={c.statut} color={sc(c.statut)} />
                </div>
                <div style={{ maxWidth: 380 }}><Bar value={avg} color={avg >= 80 ? "#2d7a4f" : avg >= 50 ? "#b07d1a" : "#c0392b"} label={`Avancement : ${avg}%`} /></div>
              </div>
              <div style={{ textAlign: "right", fontSize: 12 }}>
                <div>CA : <strong>{fmtM(c.ca)}</strong></div>
                <div style={{ color: ratio >= 100 ? "#2d7a4f" : ratio >= 70 ? "#b07d1a" : "#c0392b", fontWeight: 700 }}>Renta : {ratio}% ({totalHeures}h)</div>
                {impayees > 0 && <div style={{ color: "#c0392b", fontWeight: 700 }}>Impayé : {fmtM(impayees)}</div>}
                <div style={{ color: "#aaa", fontSize: 11 }}>→ {resp?.name}</div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// CALENDRIER FISCAL
// ═══════════════════════════════════════════════════════════
const CalendrierFiscal = ({ clients }) => {
  const [filter, setFilter] = useState("all");

  const allEcheances = clients
    .filter(c => c.forme && c.forme !== "A definir")
    .flatMap(c => genererEcheances(c).map(e => ({ ...e, clientNom: c.nom, clientId: c.id })));

  const grouped = allEcheances.reduce((acc, e) => {
    const key = e.label + "__" + e.date;
    if (!acc[key]) acc[key] = { ...e, clients: [] };
    if (!acc[key].clients.find(c => c.id === e.clientId))
      acc[key].clients.push({ id: e.clientId, nom: e.clientNom });
    return acc;
  }, {});

  const types = [...new Set(Object.values(grouped).map(e => e.type))].sort();
  const filtered = Object.values(grouped)
    .filter(e => filter === "all" || e.type === filter)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const clientsSansForme = clients.filter(c => !c.forme || c.forme === "A definir");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2332", margin: 0 }}>Calendrier fiscal</h2>
          <p style={{ color: "#888", fontSize: 13, margin: "4px 0 0" }}>{filtered.length} echeances · {clients.filter(c => c.forme && c.forme !== "A definir").length} clients actifs</p>
        </div>
        <Btn small onClick={() => alert("Echeances exportees vers Outlook 365")}>📅 Exporter Outlook</Btn>
      </div>

      {clientsSansForme.length > 0 && (
        <div style={{ padding: 12, background: "#fffbf0", borderRadius: 10, border: "1px solid #ffe5a0", marginBottom: 16, fontSize: 12, color: "#b07d1a" }}>
          <strong>{clientsSansForme.length} client(s)</strong> sans forme juridique — leurs echeances ne sont pas generees.
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["all", ...types].map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{ border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", background: filter === t ? "#1a5c8a" : "#f0f4f8", color: filter === t ? "#fff" : "#555" }}>
            {t === "all" ? "Toutes (" + Object.values(grouped).length + ")" : t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Aucune echeance</div>
          <div style={{ fontSize: 13 }}>Completez la forme juridique de vos clients</div>
        </div>
      ) : filtered.map((e, idx) => {
        const j = daysLeft(e.date);
        return (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: j <= 7 ? "#fff0f0" : j <= 15 ? "#fffbf0" : "#fff", borderRadius: 12, border: "1px solid " + (j <= 7 ? "#ffcccc" : j <= 15 ? "#ffe5a0" : "#e8ecf0"), marginBottom: 10, boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
            <div style={{ textAlign: "center", minWidth: 64, padding: "6px 8px", background: j <= 7 ? "#ffecec" : j <= 15 ? "#fff4cc" : "#f0f5fa", borderRadius: 10 }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: j <= 7 ? "#c0392b" : j <= 15 ? "#b07d1a" : "#1a5c8a" }}>{j <= 0 ? "Passe" : "J-" + j}</div>
              <div style={{ fontSize: 10, color: "#aaa" }}>{fmt(e.date)}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6 }}>{e.label}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {e.clients.slice(0, 4).map((c, i) => <Badge key={i} label={c.nom} color="#555" />)}
                {e.clients.length > 4 && <Badge label={"+" + (e.clients.length - 4) + " autres"} color="#888" />}
              </div>
            </div>
            <Badge label={e.type} color={pc(e.priorite)} />
          </div>
        );
      })}
    </div>
  );
};

const Facturation = ({ clients }) => {
  const [filter, setFilter] = useState("all");
  const allF = clients.flatMap(c => c.factures.map(f => ({ ...f, client: c.nom, email: c.email }))).sort((a, b) => new Date(b.date) - new Date(a.date));
  const filtered = allF.filter(f => filter === "all" || f.statut === filter);
  const stats = { total: allF.reduce((s, f) => s + f.montant, 0), payees: allF.filter(f => f.statut === "Payée").reduce((s, f) => s + f.montant, 0), attente: allF.filter(f => f.statut === "En attente").reduce((s, f) => s + f.montant, 0), impayees: allF.filter(f => f.statut === "Impayée").reduce((s, f) => s + f.montant, 0) };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2332", margin: "0 0 20px" }}>Facturation</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
        {[{ l: "Total facturé", v: stats.total, c: "#1a5c8a" }, { l: "Encaissé", v: stats.payees, c: "#2d7a4f" }, { l: "En attente", v: stats.attente, c: "#b07d1a" }, { l: "Impayés 🔴", v: stats.impayees, c: "#c0392b" }].map((k, i) => (
          <Card key={i}><div style={{ fontSize: 10, color: "#888", fontWeight: 700, textTransform: "uppercase" }}>{k.l}</div><div style={{ fontSize: 20, fontWeight: 900, color: k.c, marginTop: 4 }}>{fmtM(k.v)}</div></Card>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {["all", "Payée", "En attente", "Impayée", "À envoyer"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", background: filter === s ? "#1a5c8a" : "#f0f4f8", color: filter === s ? "#fff" : "#555" }}>{s === "all" ? "Toutes" : s}</button>
        ))}
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#f7f9fc" }}>
            {["N° Facture", "Client", "Libellé", "Date", "Montant", "Statut", "Action"].map(h => (
              <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 800, color: "#888", textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{filtered.map((f, i) => (
            <tr key={f.id} style={{ borderTop: "1px solid #f0f0f0", background: i % 2 ? "#fafbfc" : "#fff" }}>
              <td style={{ padding: "11px 14px", fontSize: 12, fontWeight: 800, color: "#1a5c8a" }}>{f.id}</td>
              <td style={{ padding: "11px 14px", fontSize: 12 }}>{f.client}</td>
              <td style={{ padding: "11px 14px", fontSize: 12, color: "#555" }}>{f.libelle}</td>
              <td style={{ padding: "11px 14px", fontSize: 12, color: "#888" }}>{fmt(f.date)}</td>
              <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 900 }}>{fmtM(f.montant)}</td>
              <td style={{ padding: "11px 14px" }}><Badge label={f.statut} color={sc(f.statut)} /></td>
              <td style={{ padding: "11px 14px" }}>
                {f.statut === "Impayée" && <Btn small color="#c0392b" onClick={() => alert(`📧 Relance impayé envoyée à ${f.email} via Outlook\nFacture : ${f.id} · ${fmtM(f.montant)}`)}>📧 Relancer</Btn>}
                {f.statut === "À envoyer" && <Btn small onClick={() => alert(`📤 Facture ${f.id} envoyée à ${f.email} via Outlook`)}>📤 Envoyer</Btn>}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ÉCRAN DE CONNEXION
// ═══════════════════════════════════════════════════════════
const CREDENTIALS = [
  { login: "eliedan@neowise-expertise.fr", password: "Neowise2026!", userId: "elie" },
  { login: "aurelie@neowise-expertise.fr", password: "Neowise2026!", userId: "collab" },
];

const LoginScreen = ({ onLogin }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const match = CREDENTIALS.find(c => c.login === login.trim() && c.password === password);
      if (match) {
        onLogin(USERS.find(u => u.id === match.userId));
      } else {
        setError("Identifiant ou mot de passe incorrect.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1a2332 0%,#1a3a5c 60%,#1a5c8a 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 420, padding: 24 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: 1 }}>NEOWISE</div>
          <div style={{ fontSize: 12, color: "#7ecbf7", fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", marginTop: 4 }}>Expertise · CRM</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", marginTop: 8 }}>Elie-Dan ATTIA · Expert-Comptable & CAC</div>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 36, boxShadow: "0 24px 80px rgba(0,0,0,.35)" }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 800, color: "#1a2332" }}>Connexion</h2>
          <p style={{ margin: "0 0 28px", fontSize: 13, color: "#888" }}>Accès réservé au cabinet</p>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Identifiant</div>
            <input
              value={login} onChange={e => setLogin(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="votre@email.fr"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${error ? "#ffcccc" : "#dde3ea"}`, fontSize: 13, boxSizing: "border-box", outline: "none", transition: "border .2s" }}
              onFocus={e => e.target.style.borderColor = "#1a5c8a"}
              onBlur={e => e.target.style.borderColor = error ? "#ffcccc" : "#dde3ea"}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Mot de passe</div>
            <div style={{ position: "relative" }}>
              <input
                type={showPwd ? "text" : "password"}
                value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••••"
                style={{ width: "100%", padding: "12px 44px 12px 14px", borderRadius: 10, border: `1.5px solid ${error ? "#ffcccc" : "#dde3ea"}`, fontSize: 13, boxSizing: "border-box", outline: "none" }}
                onFocus={e => e.target.style.borderColor = "#1a5c8a"}
                onBlur={e => e.target.style.borderColor = error ? "#ffcccc" : "#dde3ea"}
              />
              <button onClick={() => setShowPwd(!showPwd)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#888" }}>
                {showPwd ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {error && <div style={{ fontSize: 12, color: "#c0392b", marginBottom: 16, padding: "8px 12px", background: "#fff0f0", borderRadius: 8, border: "1px solid #ffcccc" }}>⚠️ {error}</div>}

          <button
            onClick={handleSubmit}
            disabled={loading || !login || !password}
            style={{ width: "100%", padding: "13px", background: loading || !login || !password ? "#ccc" : "linear-gradient(135deg,#1a5c8a,#2d7a4f)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: loading || !login || !password ? "not-allowed" : "pointer", marginTop: 8, transition: "all .2s", letterSpacing: 0.5 }}>
            {loading ? "Connexion en cours..." : "Se connecter →"}
          </button>


        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "rgba(255,255,255,.3)" }}>
          © 2026 NEOWISE EXPERTISE · Accès sécurisé
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [selectedClient, setSelectedClient] = useState(null);

  const updateClient = (id, changes) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...changes } : c));
    setSelectedClient(prev => prev?.id === id ? { ...prev, ...changes } : prev);
  };

  if (!currentUser) return <LoginScreen onLogin={user => setCurrentUser(user)} />;

  const addClient = (newClient) => {
    setClients(prev => [...prev, newClient]);
  };

  const navItems = [
    { id: "dashboard", label: "Tableau de bord", icon: "🏠" },
    { id: "clients", label: "Clients", icon: "👥" },
    { id: "alertes", label: "Alertes", icon: "🔔", badge: clients.flatMap(c => c.factures.filter(f => f.statut === "Impayée")).length + clients.filter(c => c.docs.some(d => d.statut === "Manquant")).length },
    { id: "echeances", label: "Calendrier fiscal", icon: "📅" },
    { id: "facturation", label: "Facturation", icon: "🧾" },
    { id: "integrations", label: "Intégrations", icon: "🔌" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f0f4f8", fontSize: 14 }}>
      {/* Sidebar */}
      <div style={{ width: 224, background: "linear-gradient(180deg,#1a2332 0%,#1a3a5c 100%)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: "#fff", letterSpacing: 0.5 }}>NEOWISE</div>
          <div style={{ fontSize: 10, color: "#7ecbf7", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>Expertise · CRM v2</div>
        </div>
        <nav style={{ flex: 1, padding: "14px 10px" }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", background: page === item.id ? "rgba(126,203,247,.15)" : "none", border: "none", borderRadius: 8, color: page === item.id ? "#7ecbf7" : "rgba(255,255,255,.6)", fontWeight: page === item.id ? 700 : 500, fontSize: 13, cursor: "pointer", textAlign: "left", marginBottom: 2, borderLeft: page === item.id ? "3px solid #7ecbf7" : "3px solid transparent", position: "relative" }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
              {item.badge > 0 && <span style={{ marginLeft: "auto", background: "#c0392b", color: "#fff", borderRadius: 10, fontSize: 10, fontWeight: 900, padding: "1px 6px" }}>{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: "14px 10px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Utilisateur actif</div>
          {USERS.map(u => (
            <button key={u.id} onClick={() => setCurrentUser(u)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", background: currentUser.id === u.id ? "rgba(255,255,255,.1)" : "none", border: `1px solid ${currentUser.id === u.id ? "rgba(255,255,255,.2)" : "transparent"}`, borderRadius: 8, cursor: "pointer", marginBottom: 4 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: u.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{u.initials}</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{u.name.split(" ")[0]}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)" }}>{u.role}</div>
              </div>
            </button>
          ))}
          <button onClick={() => { setCurrentUser(null); setPage("dashboard"); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", background: "none", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, cursor: "pointer", marginTop: 6, color: "rgba(255,255,255,.5)", fontSize: 12, fontWeight: 600 }}>
            🚪 Se déconnecter
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto", padding: 26 }}>
        {page === "dashboard" && <Dashboard clients={clients} currentUser={currentUser} onSelectClient={c => { setSelectedClient(c); }} />}
        {page === "clients" && <ClientsList clients={clients} onSelect={setSelectedClient} onAdd={addClient} currentUser={currentUser} />}
        {page === "alertes" && <AlertesPage clients={clients} onUpdate={updateClient} />}
        {page === "echeances" && <CalendrierFiscal clients={clients} />}
        {page === "facturation" && <Facturation clients={clients} />}
        {page === "integrations" && <IntegrationsPage clients={clients} onUpdate={updateClient} />}
      </div>

      {selectedClient && <ClientDetail client={selectedClient} onClose={() => setSelectedClient(null)} currentUser={currentUser} onUpdate={updateClient} />}
    </div>
  );
}
