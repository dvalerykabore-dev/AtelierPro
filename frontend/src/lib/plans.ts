/**
 * Les quatre paliers d'abonnement — source unique.
 *
 * Ce fichier est le seul endroit où vivent les prix, les plafonds et ce que
 * chaque palier débloque. La vitrine, les gardes de route et le futur
 * encaissement le lisent tous : une grille affichée qui ne correspond pas à ce
 * que le serveur applique est la pire panne possible d'un produit payant, et
 * elle ne se voit qu'au moment où un client réclame.
 *
 * Module pur — ni React, ni Prisma, ni `server-only`. Il tourne des deux côtés.
 * Le rattachement à un compte et son expiration vivent dans
 * `lib/server/plans.ts`.
 */

export const PLANS = ['freemium', 'essentiel', 'pro', 'premium'] as const;
export type Plan = (typeof PLANS)[number];

/** Un compte sans abonnement, ou dont l'abonnement a expiré. */
export const PLAN_DEFAUT: Plan = 'freemium';

export function estPlan(valeur: unknown): valeur is Plan {
  return typeof valeur === 'string' && (PLANS as readonly string[]).includes(valeur);
}

/**
 * Ce qu'un palier débloque.
 *
 * `tresorerie` couvre les deux écrans Trésorerie et Dépenses : ils lisent les
 * mêmes routes `/api/tresorerie/*`, les séparer donnerait deux noms pour une
 * seule porte.
 *
 * L'export PDF n'y figure pas : c'est l'impression du navigateur sur l'écran
 * Rapports, déjà fermé. Une capacité qu'on ne peut pas faire respecter côté
 * serveur n'a rien à faire dans cette liste — elle donnerait l'illusion d'un
 * contrôle qui n'existe pas.
 */
export const CAPACITES = [
  'planning',
  'tresorerie',
  'rapports',
  'envoiFichier',
  'alertes',
  'mannequin',
] as const;
export type Capacite = (typeof CAPACITES)[number];

export interface DefinitionPlan {
  cle: Plan;
  nom: string;
  emoji: string;
  /** La raison d'exister du palier, en une phrase. */
  these: string;
  /** Prix mensuel de référence, en francs CFA. Entier — la devise n'a pas de décimales. */
  prixMensuel: number;
  /** Plafond de fiches artisan. `null` = illimité. */
  artisans: number | null;
  /** Rendus mannequin inclus par mois. */
  rendusMannequin: number;
  /**
   * Ce que CE palier ajoute. Les paliers sont cumulatifs : ne pas répéter
   * l'hérité, `capacitesDe` fait l'union. Recopier ouvrirait la porte à une
   * capacité présente à un palier et oubliée au suivant.
   */
  ajoute: readonly Capacite[];
}

/**
 * Les paliers, dans l'ordre croissant. L'ordre porte du sens — il sert à
 * calculer l'héritage et à comparer deux abonnements.
 */
export const DEFINITIONS: readonly DefinitionPlan[] = [
  {
    cle: 'freemium',
    nom: 'Freemium',
    emoji: '🆓',
    these: 'Le carnet papier, remplacé.',
    prixMensuel: 0,
    artisans: 2,
    rendusMannequin: 0,
    ajoute: [],
  },
  {
    cle: 'essentiel',
    nom: 'Essentiel',
    emoji: '⭐',
    these: 'Je ne suis plus seul.',
    prixMensuel: 2000,
    artisans: 5,
    rendusMannequin: 0,
    ajoute: ['planning', 'envoiFichier', 'alertes'],
  },
  {
    cle: 'pro',
    nom: 'Pro',
    emoji: '🚀',
    these: 'Je tiens une entreprise.',
    prixMensuel: 5000,
    artisans: 15,
    rendusMannequin: 0,
    ajoute: ['tresorerie', 'rapports'],
  },
  {
    cle: 'premium',
    nom: 'Premium',
    emoji: '👑',
    these: 'La vitrine — le seul palier qui aide à trouver des clientes.',
    prixMensuel: 10000,
    artisans: null,
    /**
     * Quinze et non trente. Un rendu coûte 0,07 $ chez le fournisseur, soit
     * environ 42 F : à trente, 1 252 F partent en calcul sur 10 000 F de
     * recette. À quinze on retombe à 626 F, et quinze belles pièces par mois
     * suffisent à alimenter un statut WhatsApp.
     */
    rendusMannequin: 15,
    ajoute: ['mannequin'],
  },
];

export function definitionDe(plan: Plan): DefinitionPlan {
  const d = DEFINITIONS.find((x) => x.cle === plan);
  // Impossible par construction — `Plan` est l'union des clés de DEFINITIONS.
  // La garde protège contre un plan lu en base qui aurait été retiré du code.
  if (!d) throw new Error(`Palier inconnu : ${plan}`);
  return d;
}

/** Rang dans l'échelle. Sert à comparer deux abonnements. */
export function rangDe(plan: Plan): number {
  return DEFINITIONS.findIndex((d) => d.cle === plan);
}

/** Tout ce que le palier débloque, hérité compris. */
export function capacitesDe(plan: Plan): ReadonlySet<Capacite> {
  const jusqua = rangDe(plan);
  const set = new Set<Capacite>();
  for (const d of DEFINITIONS.slice(0, jusqua + 1)) {
    for (const c of d.ajoute) set.add(c);
  }
  return set;
}

export function aAcces(plan: Plan, capacite: Capacite): boolean {
  return capacitesDe(plan).has(capacite);
}

/** Le palier le plus bas qui donne accès à cette capacité — ce qu'on propose d'acheter. */
export function palierRequis(capacite: Capacite): Plan {
  const d = DEFINITIONS.find((x) => x.ajoute.includes(capacite));
  if (!d) throw new Error(`Capacité inconnue : ${capacite}`);
  return d.cle;
}

/** `true` si le plafond de fiches artisan autorise une fiche de plus. */
export function peutAjouterArtisan(plan: Plan, actifs: number): boolean {
  const max = definitionDe(plan).artisans;
  return max === null || actifs < max;
}

/* ─────────────────────────────────────────────────────────────────────────
 * Le prépayé
 *
 * Ce n'est pas un abonnement : c'est un paiement unique qui repousse une date.
 * Pas de mandat récurrent, pas de carte gardée, pas de relance sur échec — un
 * `planExpiresAt` qu'on avance.
 * ───────────────────────────────────────────────────────────────────────── */

export const FORMULES = ['mois', 'trimestre', 'annee'] as const;
export type Formule = (typeof FORMULES)[number];

/** Mois de service ouverts par la formule. */
export const MOIS_COUVERTS: Readonly<Record<Formule, number>> = {
  mois: 1,
  trimestre: 3,
  annee: 12,
};

/**
 * Mois effectivement facturés.
 *
 * La règle tient en une phrase, et c'est le but : **le trimestre offre un
 * demi-mois, l'année offre trois mois.** Un tailleur refait le calcul de tête,
 * et une remise qu'on peut vérifier soi-même est une remise qu'on croit — là
 * où un « −27 % » demande de faire confiance.
 */
export const MOIS_FACTURES: Readonly<Record<Formule, number>> = {
  mois: 1,
  trimestre: 2.5,
  annee: 9,
};

export const LIBELLE_FORMULE: Readonly<Record<Formule, string>> = {
  mois: 'Par mois',
  trimestre: 'Par trimestre',
  annee: 'Par an',
};

/**
 * Prix à encaisser, en francs CFA.
 *
 * Arrondi à l'entier : la devise n'a pas de décimales, et les trois prix
 * mensuels donnent de toute façon des entiers exacts (2 000 × 2,5 = 5 000).
 */
export function prixDe(plan: Plan, formule: Formule): number {
  return Math.round(definitionDe(plan).prixMensuel * MOIS_FACTURES[formule]);
}

/** Ce que la formule revient au mois — le chiffre qui rend la remise lisible. */
export function prixMensuelEquivalent(plan: Plan, formule: Formule): number {
  return Math.round(prixDe(plan, formule) / MOIS_COUVERTS[formule]);
}

/** Mois offerts par rapport au tarif mensuel. 0,5 pour le trimestre, 3 pour l'année. */
export function moisOfferts(formule: Formule): number {
  return MOIS_COUVERTS[formule] - MOIS_FACTURES[formule];
}

/**
 * Nouvelle date d'échéance après un encaissement.
 *
 * On part de l'échéance en cours si elle est encore devant : un atelier qui
 * renouvelle en avance ne doit pas perdre les jours qu'il a déjà payés. Sinon
 * on part de maintenant.
 */
export function reporterEcheance(
  echeanceActuelle: Date | null | undefined,
  formule: Formule,
  maintenant: Date = new Date(),
): Date {
  const base =
    echeanceActuelle && echeanceActuelle.getTime() > maintenant.getTime()
      ? new Date(echeanceActuelle)
      : new Date(maintenant);
  base.setMonth(base.getMonth() + MOIS_COUVERTS[formule]);
  return base;
}

/**
 * Formatage des montants — « 12 500 F ».
 *
 * `toLocaleString('fr-FR')` sépare les milliers par une espace insécable étroite
 * (U+202F) ou ordinaire (U+00A0) selon la version d'ICU embarquée. On les ramène
 * toutes à une espace simple, désignée par son point de code et non par un
 * caractère tapé : deux espaces différentes se ressemblent trop dans un fichier
 * source pour qu'on parie dessus, et la même somme s'afficherait autrement d'un
 * navigateur à l'autre.
 */
/**
 * Les espaces que `toLocaleString('fr-FR')` peut poser entre les milliers :
 * insécable étroite, insécable ordinaire, fine. Laquelle dépend de la version
 * d'ICU du navigateur — on les ramène donc toutes à une espace simple, sinon
 * la même somme ne se lit pas pareil sur deux téléphones.
 *
 * Désignées par leur point de code, jamais tapées : une espace invisible dans
 * un fichier source est illisible à la relecture, et ESLint la refuse.
 */
const SEPARATEURS_MILLIERS = [0x202f, 0x00a0, 0x2009].map((c) => String.fromCharCode(c));
const SIMPLE = String.fromCharCode(0x20);
export function formaterFcfa(montant: number): string {
  let rendu = montant.toLocaleString('fr-FR');
  for (const point of SEPARATEURS_MILLIERS) rendu = rendu.split(point).join(SIMPLE);
  return `${rendu} F`;
}
