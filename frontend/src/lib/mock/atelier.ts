/**
 * Données d'exemple pour les écrans « Atelier Couture Pro ».
 *
 * Provisoire — l'interface est construite d'abord, le back-end viendra ensuite
 * (aucun modèle Prisma ne représente encore un client, une commande de couture
 * ou une mesure : voir .planning/banani/STATUS.md).
 *
 * Les valeurs reprennent celles des maquettes Banani afin que la comparaison
 * visuelle avec le design soit fidèle.
 */

export const STATUTS = ['En cours', 'Essayage', 'Livraison', 'En retard', 'Livré'] as const;
export type StatutCommande = (typeof STATUTS)[number];

export interface Artisan {
  id: string;
  /** Nom complet — réduit au prénom sur mobile faute de place. */
  nom: string;
  prenom: string;
  role: string;
  initiales: string;
  /** Heures déjà engagées sur la journée. */
  heuresUtilisees: number;
  /** Capacité quotidienne en heures. */
  heuresTotal: number;
}

export interface Commande {
  id: string;
  reference: string;
  /** Numéro brut de la commande dans l'atelier — « 87 » pour « #087 ». */
  sequence: number;
  client: string;
  /** Identifiant du client — permet de rejoindre sa fiche, ses mesures, son rang. */
  clientId: string;
  tenue: string;
  /** Tissu et coloris, tels que saisis. `null` quand rien n'a été renseigné. */
  tissu: string | null;
  statut: StatutCommande;
  /** Libellé d'échéance tel qu'affiché (« 24 jan », « Auj. 15h »). */
  livraison: string;
  /** Initiales de l'artisan assigné. */
  assignee: string;
  urgent: boolean;
  /** Montant total en francs CFA — entier, la devise n'a pas de décimales. */
  montant: number;
  /** `false` déclenche le badge « Aucun acompte » dans la liste. */
  acompte: boolean;
  /**
   * Somme réellement encaissée, en francs CFA.
   *
   * Miroir de `TailoringOrder.depositAmount`, lui-même recalé sur le journal de
   * caisse à chaque écriture. Absent des commandes d'exemple : le jeu simulé
   * n'a jamais eu de montant encaissé, seulement un booléen.
   */
  encaisse?: number;
  /** Consignes d'atelier saisies à la commande. */
  notes: string | null;
  /** Date de création, en ISO — affichée dans le récapitulatif. */
  creeLe: string;
}

export interface StatistiqueCle {
  id: string;
  label: string;
  /** Libellé raccourci pour le bandeau mobile. */
  labelCourt: string;
  valeur: string;
  tendance: string;
  enHausse: boolean;
  /** Visible dans le bandeau compact mobile (3 sur 4). */
  surMobile: boolean;
}

export const artisans: Artisan[] = [
  {
    id: 'a1',
    nom: 'Moussa Koné',
    prenom: 'Moussa',
    role: 'Tailleur senior',
    initiales: 'MK',
    heuresUtilisees: 8,
    heuresTotal: 8,
  },
  {
    id: 'a2',
    nom: 'Awa Traoré',
    prenom: 'Awa',
    role: 'Couturière',
    initiales: 'AT',
    heuresUtilisees: 6,
    heuresTotal: 8,
  },
  {
    id: 'a3',
    nom: 'Ibrahim Diallo',
    prenom: 'Ibrahim',
    role: 'Apprenti',
    initiales: 'ID',
    heuresUtilisees: 3,
    heuresTotal: 8,
  },
  {
    id: 'a4',
    nom: 'Fatoumata Ba',
    prenom: 'Fatoumata',
    role: 'Couturière',
    initiales: 'FB',
    heuresUtilisees: 8,
    heuresTotal: 8,
  },
  {
    id: 'a5',
    nom: 'Seydou Ouédraogo',
    prenom: 'Seydou',
    role: 'Tailleur',
    initiales: 'SO',
    heuresUtilisees: 5,
    heuresTotal: 8,
  },
];

/**
 * Les 13 commandes de l'écran « Liste commandes » — jeu de référence unique.
 *
 * Les maquettes Banani divergeaient d'un écran à l'autre (mêmes clients, mais
 * références, dates et statuts différents entre le tableau de bord et la liste).
 * On retient les valeurs de la liste, la plus complète, et l'on conserve
 * l'échéance « Auj. 15h » du tableau de bord pour la commande #087, qui porte
 * l'urgence de la journée.
 */
export const commandes: Commande[] = [
  {
    id: 'c087',
    reference: '#087',
    sequence: 87,
    client: 'Mariam Coulibaly',
    clientId: 'cl1',
    tenue: 'Robe wax cérémonie',
    tissu: 'Wax hollandais orange · 6 yards',
    statut: 'Essayage',
    livraison: 'Auj. 15h',
    assignee: 'AT',
    urgent: true,
    montant: 30000,
    acompte: true,
    notes: 'Broderie à l’encolure, doublure incluse. Essayage avant montage des manches.',
    creeLe: '2025-01-10T00:00:00.000Z',
  },
  {
    id: 'c086',
    reference: '#086',
    sequence: 86,
    client: 'Amadou Diallo',
    clientId: 'cl2',
    tenue: 'Boubou grand occasion',
    tissu: 'Bazin riche blanc · 8 yards',
    statut: 'En cours',
    livraison: '24 jan',
    assignee: 'MK',
    urgent: false,
    montant: 40000,
    acompte: true,
    notes: null,
    creeLe: '2025-01-08T00:00:00.000Z',
  },
  {
    id: 'c085',
    reference: '#085',
    sequence: 85,
    client: 'Aissatou Ndiaye',
    clientId: 'cl5',
    tenue: 'Robe de mariée',
    tissu: 'Dentelle et satin ivoire · 10 yards',
    statut: 'En cours',
    livraison: '28 jan',
    assignee: 'SO',
    urgent: false,
    montant: 75000,
    acompte: true,
    notes: 'Trois essayages prévus. Perles cousues main sur le bustier.',
    creeLe: '2025-01-06T00:00:00.000Z',
  },
  {
    id: 'c084',
    reference: '#084',
    sequence: 84,
    client: 'Sekou Camara',
    clientId: 'cl6',
    tenue: 'Boubou bazin brodé',
    tissu: 'Bazin riche bleu nuit · 8 yards',
    statut: 'Essayage',
    livraison: '25 jan',
    assignee: 'AT',
    urgent: false,
    montant: 35000,
    acompte: false,
    notes: null,
    creeLe: '2025-01-04T00:00:00.000Z',
  },
  {
    id: 'c083',
    reference: '#083',
    sequence: 83,
    client: 'Kadiatou Sylla',
    clientId: 'cl3',
    tenue: 'Ensemble pagne bazin',
    tissu: 'Pagne tissé et bazin · 6 yards',
    statut: 'Livraison',
    livraison: '22 jan',
    assignee: 'FB',
    urgent: false,
    montant: 22000,
    acompte: true,
    notes: null,
    creeLe: '2025-01-02T00:00:00.000Z',
  },
  {
    id: 'c082',
    reference: '#082',
    sequence: 82,
    client: 'Oumar Sangaré',
    clientId: 'cl8',
    tenue: 'Costume 3 pièces',
    tissu: 'Laine peignée grise · 3,5 m',
    statut: 'En retard',
    livraison: '20 jan',
    assignee: 'MK',
    urgent: true,
    montant: 45000,
    acompte: true,
    notes: null,
    creeLe: '2024-12-31T00:00:00.000Z',
  },
  {
    id: 'c081',
    reference: '#081',
    sequence: 81,
    client: 'Boubacar Touré',
    clientId: 'cl4',
    tenue: 'Chemise bogolan',
    tissu: 'Bogolan écru · 2 yards',
    statut: 'En cours',
    livraison: '26 jan',
    assignee: 'ID',
    urgent: false,
    montant: 12000,
    acompte: false,
    notes: null,
    creeLe: '2024-12-29T00:00:00.000Z',
  },
  {
    id: 'c080',
    reference: '#080',
    sequence: 80,
    client: 'Rokia Kouyaté',
    clientId: 'cl7',
    tenue: 'Tailleur wax',
    tissu: 'Wax Vlisco vert · 6 yards',
    statut: 'En cours',
    livraison: '27 jan',
    assignee: 'FB',
    urgent: false,
    montant: 28000,
    acompte: true,
    notes: null,
    creeLe: '2024-12-27T00:00:00.000Z',
  },
  {
    id: 'c079',
    reference: '#079',
    sequence: 79,
    client: 'Mariam Coulibaly',
    clientId: 'cl1',
    tenue: 'Ensemble 2 pièces',
    tissu: 'Bazin riche jaune · 6 yards',
    statut: 'Livré',
    livraison: '15 jan',
    assignee: 'AT',
    urgent: false,
    montant: 18000,
    acompte: false,
    notes: null,
    creeLe: '2024-12-25T00:00:00.000Z',
  },
  {
    id: 'c078',
    reference: '#078',
    sequence: 78,
    client: 'Amadou Diallo',
    clientId: 'cl2',
    tenue: 'Boubou bazin simple',
    tissu: 'Bazin uni blanc · 8 yards',
    statut: 'Livré',
    livraison: '14 jan',
    assignee: 'MK',
    urgent: false,
    montant: 15000,
    acompte: false,
    notes: null,
    creeLe: '2024-12-23T00:00:00.000Z',
  },
  {
    id: 'c077',
    reference: '#077',
    sequence: 77,
    client: 'Sekou Camara',
    clientId: 'cl6',
    tenue: 'Chemise sur mesure',
    tissu: 'Popeline de coton ciel · 2 m',
    statut: 'Livré',
    livraison: '10 jan',
    assignee: 'ID',
    urgent: false,
    montant: 12000,
    acompte: false,
    notes: null,
    creeLe: '2024-12-21T00:00:00.000Z',
  },
  {
    id: 'c076',
    reference: '#076',
    sequence: 76,
    client: 'Boubacar Touré',
    clientId: 'cl4',
    tenue: 'Boubou bazin brodé',
    tissu: 'Bazin riche marron · 8 yards',
    statut: 'En retard',
    livraison: '22 jan',
    assignee: 'MK',
    urgent: true,
    montant: 35000,
    acompte: true,
    notes: null,
    creeLe: '2024-12-19T00:00:00.000Z',
  },
  {
    id: 'c075',
    reference: '#075',
    sequence: 75,
    client: 'Kadiatou Sylla',
    clientId: 'cl3',
    tenue: 'Robe wax',
    tissu: 'Wax fleuri rouge · 6 yards',
    statut: 'En retard',
    livraison: '21 jan',
    assignee: 'AT',
    urgent: true,
    montant: 20000,
    acompte: true,
    notes: null,
    creeLe: '2024-12-17T00:00:00.000Z',
  },
];

/** Compte par statut, pour les onglets de filtre de la liste des commandes. */
export function compterParStatut(): Record<StatutCommande | 'Toutes', number> {
  const base = { Toutes: commandes.length } as Record<StatutCommande | 'Toutes', number>;
  for (const s of STATUTS) base[s] = commandes.filter((c) => c.statut === s).length;
  return base;
}

/** Couleur de pastille par artisan, reprise de l'écran « Liste commandes ». */
export const couleursAssignes: Record<string, string> = {
  MK: 'bg-primary text-primary-foreground',
  AT: 'bg-accent text-primary-foreground',
  FB: 'bg-success text-primary-foreground',
  ID: 'bg-muted text-muted-foreground',
  SO: 'bg-secondary text-secondary-foreground',
};

export const statistiques: StatistiqueCle[] = [
  {
    id: 's1',
    label: 'Commandes actives',
    labelCourt: 'Commandes',
    valeur: '24',
    tendance: '+3',
    enHausse: true,
    surMobile: true,
  },
  {
    id: 's2',
    label: 'Livraisons ce soir',
    labelCourt: 'Livraisons auj.',
    valeur: '4',
    tendance: '−1',
    enHausse: false,
    surMobile: true,
  },
  {
    id: 's3',
    label: 'En retard',
    labelCourt: 'En retard',
    valeur: '2',
    tendance: '+2',
    enHausse: false,
    surMobile: true,
  },
  {
    id: 's4',
    label: 'Clients ce mois',
    labelCourt: 'Clients',
    valeur: '31',
    tendance: '+5',
    enHausse: true,
    surMobile: false,
  },
];

/** Date affichée dans les en-têtes — figée tant que les données sont simulées. */
/**
 * Date du jour, dans la langue de l'atelier.
 *
 * C'était une chaîne figée (« Jeudi 23 janvier 2025 ») : le tableau de bord
 * affichait une date fausse dès le lendemain de la maquette. Calculée au rendu,
 * elle suit l'horloge — c'est la seule donnée d'accueil qui n'a besoin ni du
 * serveur ni de la base.
 */
export function dateDuJourFr(): { long: string; court: string } {
  const d = new Date();
  const long = d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const court = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' });
  const majuscule = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
  return { long: majuscule(long), court: majuscule(court) };
}

/** Encart « Prochaine dispo » de la colonne capacité (desktop). */
export const prochaineDisponibilite = {
  artisan: 'Demain — Awa Traoré',
  detail: '2h disponibles · Vendredi 24 jan',
};

export const nombreNotifications = 5;

// ---------------------------------------------------------------------------
// Nouvelle commande / fiche commande
// ---------------------------------------------------------------------------

export interface Mesure {
  label: string;
  valeur: string;
  unite: string;
}

/** Profil de mesures chargé pour Mariam Coulibaly (écran « Nouvelle commande »). */
export const mesuresReference: Mesure[] = [
  { label: 'Tour de cou', valeur: '96', unite: 'cm' },
  { label: 'Taille', valeur: '76', unite: 'cm' },
  { label: 'Épaules', valeur: '102', unite: 'cm' },
  { label: 'Bassin', valeur: '138', unite: 'cm' },
  { label: 'Poitrine', valeur: '38', unite: 'cm' },
  { label: 'Cuisse', valeur: '32', unite: 'cm' },
  { label: 'Longueur manche', valeur: '17', unite: 'cm' },
  { label: 'Longueur bas', valeur: '58', unite: 'cm' },
  { label: 'Tour de bras', valeur: '36', unite: 'cm' },
  { label: 'Tour de cheville', valeur: '22', unite: 'cm' },
  { label: 'Poignet', valeur: '28', unite: 'cm' },
  { label: 'Écart mamelons', valeur: '20', unite: 'cm' },
  { label: 'Longueur habit', valeur: '42', unite: 'cm' },
  { label: 'Hauteur poitrine', valeur: '26', unite: 'cm' },
];

export interface EtapeCommande {
  numero: number;
  label: string;
  terminee: boolean;
}

export const etapesNouvelleCommande: EtapeCommande[] = [
  { numero: 1, label: 'Client', terminee: true },
  { numero: 2, label: 'Modèle', terminee: true },
  { numero: 3, label: 'Mesures', terminee: false },
  { numero: 4, label: 'Planning', terminee: false },
];

/** Étape actuellement ouverte dans le tunnel de création. */
export const etapeCourante = 3;

export interface LigneTarif {
  label: string;
  montant: number;
  /** Une déduction s'affiche en vert avec un signe moins. */
  deduction?: boolean;
}

export const tarification: LigneTarif[] = [
  { label: 'Façon robe cérémonie', montant: 25000 },
  { label: 'Finitions broderie', montant: 5000 },
  { label: 'Acompte versé', montant: 10000, deduction: true },
];

export const livraisonEstimee = {
  date: 'Mardi 28 jan',
  detail: '5 jours ouvrés · Awa Traoré · 6h',
  dureeEstimee: '6 heures',
  prochaineDispo: 'Vendredi 24 jan · 2h',
  delaiMinimum: 'Lundi 27 jan',
};

// ---------------------------------------------------------------------------
// Paramètres
// ---------------------------------------------------------------------------

export const atelier = {
  nom: 'Atelier Koné & Associés',
  telephone: '+226 70 12 34 56',
  ville: 'Ouagadougou',
  adresse: 'Secteur 15, rue 15.42',
  devise: 'F CFA',
  heuresOuverture: '08h00 — 18h00',
};

export interface MembreEquipe {
  id: string;
  nom: string;
  role: string;
  initiales: string;
  /** Capacité quotidienne en heures. */
  capacite: number;
  actif: boolean;
}

export const equipeParametres: MembreEquipe[] = [
  {
    id: 'e1',
    nom: 'Moussa Koné',
    role: 'Tailleur senior',
    initiales: 'MK',
    capacite: 8,
    actif: true,
  },
  { id: 'e2', nom: 'Awa Traoré', role: 'Couturière', initiales: 'AT', capacite: 8, actif: true },
  { id: 'e3', nom: 'Ibrahim Diallo', role: 'Apprenti', initiales: 'ID', capacite: 6, actif: true },
  { id: 'e4', nom: 'Fatoumata Ba', role: 'Couturière', initiales: 'FB', capacite: 8, actif: true },
  {
    id: 'e5',
    nom: 'Seydou Ouédraogo',
    role: 'Tailleur',
    initiales: 'SO',
    capacite: 8,
    actif: false,
  },
];

export interface Tarif {
  tenue: string;
  prix: number;
  unite: string;
}

export const tarifs: Tarif[] = [
  { tenue: 'Boubou simple', prix: 15000, unite: 'façon' },
  { tenue: 'Boubou bazin brodé', prix: 35000, unite: 'façon' },
  { tenue: 'Robe wax cérémonie', prix: 25000, unite: 'façon' },
  { tenue: 'Costume 3 pièces', prix: 45000, unite: 'façon' },
  { tenue: 'Tailleur bogolan', prix: 30000, unite: 'façon' },
  { tenue: 'Chemise sur mesure', prix: 12000, unite: 'façon' },
];

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export const CATEGORIES_NOTIF = ['Clients', 'Livraisons', 'Paiements', 'Atelier'] as const;
export type CategorieNotif = (typeof CATEGORIES_NOTIF)[number];

export interface Notification {
  id: string;
  categorie: CategorieNotif;
  /** Clé d'icône résolue côté composant (les données restent sans JSX). */
  icone: 'paiement' | 'essayage' | 'retard' | 'message' | 'livraison' | 'equipe' | 'nouveauClient';
  /** Classes de la pastille d'icône, reprises du design. */
  couleurIcone: string;
  titre: string;
  corps: string;
  moment: string;
  lue: boolean;
  action?: string;
  /** Lien de l'action, quand la cible existe déjà. */
  href?: string;
}

// ---------------------------------------------------------------------------
// Rapports
// ---------------------------------------------------------------------------

export interface MoisChiffreAffaires {
  label: string;
  chiffreAffaires: number;
  commandes: number;
  /** Mois en cours — mis en avant dans l'histogramme. */
  courant?: boolean;
}

export const chiffreAffairesMensuel: MoisChiffreAffaires[] = [
  { label: 'Août', chiffreAffaires: 310000, commandes: 18 },
  { label: 'Sep', chiffreAffaires: 420000, commandes: 24 },
  { label: 'Oct', chiffreAffaires: 385000, commandes: 21 },
  { label: 'Nov', chiffreAffaires: 510000, commandes: 29 },
  { label: 'Déc', chiffreAffaires: 780000, commandes: 44 },
  { label: 'Jan', chiffreAffaires: 440000, commandes: 31, courant: true },
];

export interface TenuePopulaire {
  label: string;
  nombre: number;
  /** Part relative à la tenue la plus commandée. */
  pourcentage: number;
}

export const tenuesPopulaires: TenuePopulaire[] = [
  { label: 'Boubou bazin brodé', nombre: 12, pourcentage: 87 },
  { label: 'Robe wax cérémonie', nombre: 9, pourcentage: 65 },
  { label: 'Tailleur bogolan', nombre: 7, pourcentage: 51 },
  { label: 'Costume 3 pièces', nombre: 5, pourcentage: 36 },
  { label: 'Ensemble pagne', nombre: 4, pourcentage: 29 },
];

export interface PerformanceArtisan {
  nom: string;
  role: string;
  initiales: string;
  commandes: number;
  heures: number;
  chiffreAffaires: number;
}

export const performancesArtisans: PerformanceArtisan[] = [
  {
    nom: 'Moussa Koné',
    role: 'Tailleur senior',
    initiales: 'MK',
    commandes: 14,
    heures: 112,
    chiffreAffaires: 182000,
  },
  {
    nom: 'Awa Traoré',
    role: 'Couturière',
    initiales: 'AT',
    commandes: 11,
    heures: 88,
    chiffreAffaires: 145000,
  },
  {
    nom: 'Fatoumata Ba',
    role: 'Couturière',
    initiales: 'FB',
    commandes: 10,
    heures: 80,
    chiffreAffaires: 128000,
  },
  {
    nom: 'Seydou Ouédraogo',
    role: 'Tailleur',
    initiales: 'SO',
    commandes: 7,
    heures: 56,
    chiffreAffaires: 91000,
  },
  {
    nom: 'Ibrahim Diallo',
    role: 'Apprenti',
    initiales: 'ID',
    commandes: 4,
    heures: 32,
    chiffreAffaires: 44000,
  },
];

export interface RepartitionPaiement {
  label: string;
  nombre: number;
  pourcentage: number;
  couleur: string;
}

export const repartitionPaiements: RepartitionPaiement[] = [
  { label: 'Payé intégral', nombre: 18, pourcentage: 58, couleur: 'bg-success' },
  { label: 'Acompte versé', nombre: 9, pourcentage: 29, couleur: 'bg-warning' },
  { label: 'Non payé', nombre: 4, pourcentage: 13, couleur: 'bg-danger' },
];

export const indicateursRapport = [
  { id: 'r1', label: "Chiffre d'affaires", valeur: '440k', tendance: '+14 %', enHausse: true },
  { id: 'r2', label: 'Commandes livrées', valeur: '31', tendance: '+7', enHausse: true },
  { id: 'r3', label: 'Livraison à temps', valeur: '87 %', tendance: '+3 %', enHausse: true },
  { id: 'r4', label: 'Délai moyen', valeur: '5,2 j', tendance: '−0,4 j', enHausse: true },
];

// ---------------------------------------------------------------------------
// Planning équipe
// ---------------------------------------------------------------------------

export interface JourPlanning {
  /** Numéro du jour dans le mois. */
  date: string;
  /** Abréviation — « Lun », « Mar »… */
  jour: string;
  aujourdhui: boolean;
}

export const semainePlanning: JourPlanning[] = [
  { date: '20', jour: 'Lun', aujourdhui: false },
  { date: '21', jour: 'Mar', aujourdhui: false },
  { date: '22', jour: 'Mer', aujourdhui: false },
  { date: '23', jour: 'Jeu', aujourdhui: true },
  { date: '24', jour: 'Ven', aujourdhui: false },
  { date: '25', jour: 'Sam', aujourdhui: false },
];

export const STATUTS_TACHE = ['Terminé', 'En cours', 'Essayage', 'Planifié', 'Bloqué'] as const;
export type StatutTache = (typeof STATUTS_TACHE)[number];

export interface Tache {
  artisanIndex: number;
  jourIndex: number;
  /** Durée en heures — la journée compte 8 blocs. */
  duree: number;
  label: string;
  statut: StatutTache;
}

/** Heures ouvrables par jour et par artisan. */
export const HEURES_PAR_JOUR = 8;

export const taches: Tache[] = [
  { artisanIndex: 0, jourIndex: 0, duree: 3, label: 'Boubou bazin — Sekou C.', statut: 'Terminé' },
  { artisanIndex: 0, jourIndex: 1, duree: 4, label: 'Costume 3p — Oumar S.', statut: 'Terminé' },
  {
    artisanIndex: 0,
    jourIndex: 2,
    duree: 3,
    label: 'Boubou occasion — Amadou D.',
    statut: 'Terminé',
  },
  {
    artisanIndex: 0,
    jourIndex: 3,
    duree: 5,
    label: 'Boubou grand occasion — Amadou D.',
    statut: 'En cours',
  },
  {
    artisanIndex: 0,
    jourIndex: 3,
    duree: 3,
    label: 'Chemise bogolan — Boubacar T.',
    statut: 'Bloqué',
  },
  {
    artisanIndex: 0,
    jourIndex: 4,
    duree: 4,
    label: 'Djellaba brodée — Ali K.',
    statut: 'Planifié',
  },
  { artisanIndex: 0, jourIndex: 5, duree: 2, label: 'Retouche veste', statut: 'Planifié' },

  { artisanIndex: 1, jourIndex: 0, duree: 4, label: 'Robe wax — Mariam C.', statut: 'Terminé' },
  {
    artisanIndex: 1,
    jourIndex: 1,
    duree: 3,
    label: 'Tailleur pagne — Aissatou N.',
    statut: 'Terminé',
  },
  {
    artisanIndex: 1,
    jourIndex: 2,
    duree: 5,
    label: 'Robe cérémonie — Kadiatou S.',
    statut: 'Terminé',
  },
  {
    artisanIndex: 1,
    jourIndex: 3,
    duree: 6,
    label: 'Robe wax cérémonie — Mariam C.',
    statut: 'Essayage',
  },
  { artisanIndex: 1, jourIndex: 4, duree: 2, label: 'Finitions robe mariée', statut: 'Planifié' },
  {
    artisanIndex: 1,
    jourIndex: 5,
    duree: 3,
    label: 'Ensemble bazin — Rokia K.',
    statut: 'Planifié',
  },

  { artisanIndex: 2, jourIndex: 0, duree: 2, label: 'Découpe pagne', statut: 'Terminé' },
  { artisanIndex: 2, jourIndex: 1, duree: 3, label: 'Chemise — Mamadou S.', statut: 'Terminé' },
  { artisanIndex: 2, jourIndex: 2, duree: 2, label: 'Aide montage boubou', statut: 'Terminé' },
  {
    artisanIndex: 2,
    jourIndex: 3,
    duree: 3,
    label: 'Chemise bogolan — Boubacar T.',
    statut: 'En cours',
  },
  {
    artisanIndex: 2,
    jourIndex: 4,
    duree: 4,
    label: 'Pantalon bazin — Cheick D.',
    statut: 'Planifié',
  },

  {
    artisanIndex: 3,
    jourIndex: 0,
    duree: 5,
    label: 'Ensemble pagne — Kadiatou S.',
    statut: 'Terminé',
  },
  {
    artisanIndex: 3,
    jourIndex: 1,
    duree: 4,
    label: 'Robe de mariée — Aissatou N.',
    statut: 'Terminé',
  },
  { artisanIndex: 3, jourIndex: 2, duree: 6, label: 'Robe de mariée suite', statut: 'Terminé' },
  {
    artisanIndex: 3,
    jourIndex: 3,
    duree: 8,
    label: 'Robe de mariée — Aissatou N.',
    statut: 'Bloqué',
  },
  { artisanIndex: 3, jourIndex: 4, duree: 5, label: 'Ensemble wax — Tenin B.', statut: 'Planifié' },
  { artisanIndex: 3, jourIndex: 5, duree: 3, label: 'Retouches diverses', statut: 'Planifié' },

  { artisanIndex: 4, jourIndex: 0, duree: 3, label: 'Pantalon wax — Adama D.', statut: 'Terminé' },
  {
    artisanIndex: 4,
    jourIndex: 1,
    duree: 4,
    label: 'Veste bogolan — Lassina T.',
    statut: 'Terminé',
  },
  { artisanIndex: 4, jourIndex: 2, duree: 3, label: 'Boubou simple — Yaya K.', statut: 'Terminé' },
  { artisanIndex: 4, jourIndex: 3, duree: 5, label: 'Tailleur wax — Rokia K.', statut: 'En cours' },
  {
    artisanIndex: 4,
    jourIndex: 4,
    duree: 3,
    label: 'Boubou bazin — Moussa O.',
    statut: 'Planifié',
  },
  { artisanIndex: 4, jourIndex: 5, duree: 4, label: 'Costume cérémonie', statut: 'Planifié' },
];

/** Habillage de chaque statut de tâche dans la grille. */
export const styleTache: Record<StatutTache, string> = {
  Terminé: 'bg-muted text-muted-foreground',
  'En cours': 'bg-secondary border border-primary text-primary',
  Essayage: 'bg-secondary border border-accent text-accent',
  Planifié: 'bg-muted border border-border text-foreground',
  Bloqué: 'bg-danger text-foreground',
};

// ---------------------------------------------------------------------------
// Palettes de mesures
// ---------------------------------------------------------------------------

export const GENRES = ['Femme', 'Homme'] as const;
export type Genre = (typeof GENRES)[number];

export interface ChampMesure {
  /** Repère d'ordre de l'atelier — chaîne car il existe un « 9A » et un « 9B ». */
  numero: string;
  label: string;
  unite: string;
}

export interface SectionMesures {
  titre: string;
  /** Ce que la section couvre, affiché en sous-titre. */
  precision: string;
  champs: ChampMesure[];
}

const CM = 'cm';

/**
 * Palette masculine — 17 lignes.
 *
 * Découpée en deux sections : le relevé bascule du buste au pantalon à partir
 * du point 10 (Ceinture). Ce découpage n'est pas décoratif — il évite de faire
 * défiler dix-sept champs d'affilée sur un téléphone, en atelier.
 */
export const paletteHomme: SectionMesures[] = [
  {
    titre: 'Haut',
    precision: 'Buste, manches et longueur d’habit',
    champs: [
      { numero: '1', label: 'Tour de cou', unite: CM },
      { numero: '2', label: 'Épaule', unite: CM },
      { numero: '3', label: 'Poitrine', unite: CM },
      { numero: '4', label: 'Longueur de manche', unite: CM },
      { numero: '5', label: 'Tour de bras', unite: CM },
      { numero: '6', label: 'Coude', unite: CM },
      { numero: '7', label: 'Poignet', unite: CM },
      { numero: '8', label: 'Taille', unite: CM },
      { numero: '9A', label: 'Longueur habit A', unite: CM },
      { numero: '9B', label: 'Longueur habit B', unite: CM },
    ],
  },
  {
    titre: 'Bas',
    precision: 'Pantalon',
    champs: [
      { numero: '10', label: 'Ceinture', unite: CM },
      { numero: '11', label: 'Tour hanche', unite: CM },
      { numero: '12', label: 'Entrejambe', unite: CM },
      { numero: '13', label: 'Cuisse', unite: CM },
      { numero: '14', label: 'Mollet', unite: CM },
      { numero: '15', label: 'Cheville', unite: CM },
      { numero: '16', label: 'Longueur pantalon', unite: CM },
    ],
  },
];

/**
 * Palette féminine — 23 lignes.
 *
 * « Tour de hanches » et « Hauteur taille-hanches » figurent deux fois dans la
 * liste de l'atelier (5 et 19, 7 et 20). Ce ne sont pas des doublons : la liste
 * repasse au bas du corps à partir du point 18. Les deux sections lèvent
 * l'ambiguïté, et le repère numérique reste affiché pour retrouver l'ordre du
 * carnet papier.
 */
export const paletteFemme: SectionMesures[] = [
  {
    titre: 'Haut',
    precision: 'Buste, robe et manches',
    champs: [
      { numero: '1', label: 'Longueur habit', unite: CM },
      { numero: '2', label: 'Épaules', unite: CM },
      { numero: '3', label: 'Poitrine', unite: CM },
      { numero: '4', label: 'Tour de taille', unite: CM },
      { numero: '5', label: 'Tour de hanches', unite: CM },
      { numero: '6', label: 'Hauteur épaules-longueur finie', unite: CM },
      { numero: '7', label: 'Hauteur taille-hanches', unite: CM },
      { numero: '8', label: 'Hauteur taille-genou', unite: CM },
      { numero: '9', label: 'Écart poitrine', unite: CM },
      { numero: '10', label: 'Hauteur poitrine', unite: CM },
      { numero: '11', label: 'Hauteur bassin', unite: CM },
      { numero: '12', label: 'Longueur taille devant', unite: CM },
      { numero: '13', label: 'Longueur taille dos', unite: CM },
      { numero: '14', label: 'Longueur d’épaule', unite: CM },
      { numero: '15', label: 'Longueur bras', unite: CM },
      { numero: '16', label: 'Longueur bras total plié', unite: CM },
      { numero: '17', label: 'Tour du poignet', unite: CM },
    ],
  },
  {
    titre: 'Bas',
    precision: 'Jupe, pantalon et montant',
    champs: [
      { numero: '18', label: 'Ceinture', unite: CM },
      { numero: '19', label: 'Tour de hanches', unite: CM },
      { numero: '20', label: 'Hauteur taille-hanches', unite: CM },
      { numero: '21', label: 'Hauteur taille-cheville', unite: CM },
      { numero: '22', label: 'Hauteur montant assis', unite: CM },
      { numero: '23', label: 'Fourche (entrejambe)', unite: CM },
    ],
  },
];

export function paletteDe(genre: Genre): SectionMesures[] {
  return genre === 'Homme' ? paletteHomme : paletteFemme;
}

export function nombreDeChamps(palette: SectionMesures[]): number {
  return palette.reduce((total, s) => total + s.champs.length, 0);
}

// ---------------------------------------------------------------------------
// Carnet clients
// ---------------------------------------------------------------------------

export interface Client {
  id: string;
  nom: string;
  initiales: string;
  telephone: string;
  /** Détermine la palette de mesures présentée pour ce client. */
  genre: Genre;
  nbCommandes: number;
  derniereCommande: string;
  fidele: boolean;
  /** Cumul facturé, en francs CFA. */
  totalFacture: number;
  /** Date de création ISO — absente du jeu d'exemple, qui n'a pas d'historique. */
  creeLe?: string;
}

export const clients: Client[] = [
  {
    id: 'cl1',
    nom: 'Mariam Coulibaly',
    initiales: 'MC',
    telephone: '+226 70 11 22 33',
    genre: 'Femme',
    nbCommandes: 6,
    derniereCommande: '23 jan',
    fidele: true,
    totalFacture: 133000,
  },
  {
    id: 'cl2',
    nom: 'Amadou Diallo',
    initiales: 'AD',
    telephone: '+226 76 44 55 66',
    genre: 'Homme',
    nbCommandes: 4,
    derniereCommande: '20 jan',
    fidele: false,
    totalFacture: 92000,
  },
  {
    id: 'cl3',
    nom: 'Kadiatou Sylla',
    initiales: 'KS',
    telephone: '+226 65 88 99 00',
    genre: 'Femme',
    nbCommandes: 9,
    derniereCommande: '22 jan',
    fidele: true,
    totalFacture: 187000,
  },
  {
    id: 'cl4',
    nom: 'Boubacar Touré',
    initiales: 'BT',
    telephone: '+226 70 33 44 55',
    genre: 'Homme',
    nbCommandes: 2,
    derniereCommande: '18 jan',
    fidele: false,
    totalFacture: 47000,
  },
  {
    id: 'cl5',
    nom: 'Aissatou Ndiaye',
    initiales: 'AN',
    telephone: '+226 76 22 11 00',
    genre: 'Femme',
    nbCommandes: 5,
    derniereCommande: '21 jan',
    fidele: true,
    totalFacture: 141000,
  },
  {
    id: 'cl6',
    nom: 'Sekou Camara',
    initiales: 'SC',
    telephone: '+226 65 77 88 99',
    genre: 'Homme',
    nbCommandes: 3,
    derniereCommande: '15 jan',
    fidele: false,
    totalFacture: 59000,
  },
  {
    id: 'cl7',
    nom: 'Rokia Kouyaté',
    initiales: 'RK',
    telephone: '+226 70 55 66 77',
    genre: 'Femme',
    nbCommandes: 7,
    derniereCommande: '19 jan',
    fidele: true,
    totalFacture: 154000,
  },
  {
    id: 'cl8',
    nom: 'Oumar Sangaré',
    initiales: 'OS',
    telephone: '+226 76 99 00 11',
    genre: 'Homme',
    nbCommandes: 1,
    derniereCommande: '10 jan',
    fidele: false,
    totalFacture: 45000,
  },
];

export interface CommandePassee {
  reference: string;
  tenue: string;
  date: string;
  statut: string;
  montant: number;
}

export const historiqueClient: CommandePassee[] = [
  {
    reference: '#086',
    tenue: 'Ensemble pagne bazin',
    date: '15 jan 2025',
    statut: 'Livré',
    montant: 35000,
  },
  {
    reference: '#071',
    tenue: 'Robe wax cérémonie',
    date: '18 déc 2024',
    statut: 'Livré',
    montant: 28000,
  },
  {
    reference: '#058',
    tenue: 'Tailleur bogolan',
    date: '02 nov 2024',
    statut: 'Livré',
    montant: 22000,
  },
  {
    reference: '#044',
    tenue: 'Robe de soirée',
    date: '07 sep 2024',
    statut: 'Livré',
    montant: 30000,
  },
  {
    reference: '#031',
    tenue: 'Ensemble wax 2 pièces',
    date: '12 juin 2024',
    statut: 'Livré',
    montant: 18000,
  },
];

export interface TissuClient {
  nom: string;
  metrage: string;
  /** Classe de couleur de la pastille — reprise telle quelle du design. */
  couleur: string;
}

export const tissusClient: TissuClient[] = [
  { nom: 'Wax hollandais orange', metrage: '6 yards', couleur: 'bg-warning' },
  { nom: 'Bazin riche bleu', metrage: '4 yards', couleur: 'bg-secondary' },
  { nom: 'Bogolan naturel', metrage: '3 yards', couleur: 'bg-muted-foreground' },
];

export const mesuresMiseAJour = '15 jan 2025';

// ---------------------------------------------------------------------------
// Fiche commande détaillée
// ---------------------------------------------------------------------------

export interface Paiement {
  label: string;
  montant: number;
  date: string;
  mode: string;
  regle: boolean;
}

export const paiements: Paiement[] = [
  { label: 'Acompte 50 %', montant: 15000, date: '15 jan', mode: 'Mobile Money', regle: true },
  { label: 'Solde restant', montant: 15000, date: 'À la livraison', mode: '—', regle: false },
];

export interface NoteAtelier {
  auteur: string;
  initiales: string;
  date: string;
  texte: string;
}

export const notesAtelier: NoteAtelier[] = [
  {
    auteur: 'Awa T.',
    initiales: 'AT',
    date: '18 jan',
    texte: 'Assemblage terminé, tissu conforme. Pré-essayage OK.',
  },
  {
    auteur: 'Moussa K.',
    initiales: 'MK',
    date: '20 jan',
    texte: 'Broderie encolure en cours, 2h restantes.',
  },
];

export const modeleCommande = {
  typeTenue: 'Robe wax cérémonie',
  tissu: 'Wax hollandais — 6 yards',
  couleur: 'Ankara orange & bleu',
  assigneNom: 'Awa Traoré',
  assigneInitiales: 'AT',
  notesPlaceholder: 'Ex : col bateau, fermeture invisible dos, finitions dorées…',
};
