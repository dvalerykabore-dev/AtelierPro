import {
  Banknote,
  Clock,
  LayoutGrid,
  MessageSquare,
  Ruler,
  Smartphone,
  Star,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
 * TEXTE COMMERCIAL DE LA PAGE D'ACCUEIL
 *
 * Tout est rassemblé ici, et nulle part ailleurs, pour une raison précise : la
 * maquette Banani avait rédigé des chiffres et des témoignages qu'aucune donnée
 * ne soutenait. Éparpillés dans dix composants, ils seraient partis en
 * production sans que personne ne les relise.
 *
 * ── Corrigé ────────────────────────────────────────────────────────────────
 *   · CHIFFRES_CLES      — « 50K+ tailleurs », « 96 % de satisfaction » →
 *                          remplacés par des faits vérifiables en ouvrant
 *                          l'application. L'original est en CHIFFRES_MAQUETTE.
 *   · TEMOIGNAGES        — vidé. Trois personnes nommées, avec ville et métier,
 *                          n'avaient jamais rien dit. L'original est en
 *                          TEMOIGNAGES_MAQUETTE ; la section et son lien de
 *                          navigation disparaissent tant que le tableau est vide.
 *   · CAS_USAGE.resultat — « +35 % de commandes », « +60 % de chiffre
 *                          d'affaires » → remplacés par ce que l'application
 *                          fait réellement pour chaque profil.
 *   · QUESTIONS          — reformulées : le hors-ligne et l'import de fichier
 *                          sont annoncés comme prévus, non comme disponibles.
 *
 * ── Reste à trancher ───────────────────────────────────────────────────────
 *   · PLANS_TARIFAIRES   — les montants sont une décision commerciale, pas une
 *                          affirmation vérifiable. Ils restent tels quels, mais
 *                          AUCUN PAIEMENT N'EST BRANCHÉ : une mention le dit
 *                          sous la grille, à retirer le jour où il le sera.
 *
 * FONCTIONNALITES est la liste dont chaque ligne se vérifie d'un clic : chaque
 * carte mène à l'écran qu'elle décrit.
 * ═══════════════════════════════════════════════════════════════════════════ */

export interface ChiffreCle {
  valeur: string;
  label: string;
  icone: LucideIcon;
}

/**
 * Trois chiffres du bandeau d'accroche.
 *
 * La maquette annonçait « 50K+ tailleurs », « 40 h gagnées par mois » et
 * « 96 % de satisfaction ». Aucun n'était mesurable : le produit n'a pas
 * d'utilisateurs, donc pas d'adoption à citer, et aucune enquête n'a jamais
 * été menée. Les trois sont remplacés par des faits vérifiables en ouvrant
 * l'application — c'est moins spectaculaire, mais c'est tenable devant le
 * premier client qui demande d'où sort le chiffre.
 *
 * L'original est conservé plus bas dans `CHIFFRES_MAQUETTE`.
 */
export const CHIFFRES_CLES: ChiffreCle[] = [
  { valeur: '30 jours', label: 'D’essai gratuit, sans carte bancaire', icone: Clock },
  { valeur: '0 F', label: 'À installer — tout passe par le navigateur', icone: Smartphone },
  { valeur: '8', label: 'Écrans de gestion, du planning à la trésorerie', icone: LayoutGrid },
];

/**
 * Les chiffres d'origine de la maquette Banani. Conservés pour mémoire, et
 * pour que les rétablir reste un remplacement d'une ligne le jour où ils
 * seront étayés par de vraies mesures.
 */
export const CHIFFRES_MAQUETTE: ChiffreCle[] = [
  { valeur: '50K+', label: 'Tailleurs en Afrique de l’Ouest', icone: Users },
  { valeur: '40 h', label: 'Temps gagné par atelier et par mois', icone: Clock },
  { valeur: '96 %', label: 'Satisfaction clients', icone: Star },
];

export interface Fonctionnalite {
  icone: LucideIcon;
  titre: string;
  description: string;
  /** Écran correspondant — la carte n'est pas décorative, elle y mène. */
  href: string;
  /** Libellé du lien, pour que la destination soit annoncée avant le clic. */
  lienLabel: string;
}

/**
 * Les six promesses de la page correspondent à six écrans qui existent : la
 * carte y mène. C'est la seule liste de ce fichier dont chaque ligne est
 * vérifiable en cliquant dessus.
 */
export const FONCTIONNALITES: Fonctionnalite[] = [
  {
    icone: LayoutGrid,
    titre: 'Planification de l’équipe',
    description:
      'Affectez les tâches jour par jour et voyez immédiatement qui est saturé. La capacité est propre à chaque artisan : un apprenti à 6 h n’est pas jugé au seuil d’un tailleur senior.',
    href: '/planning',
    lienLabel: 'Voir le planning',
  },
  {
    icone: Ruler,
    titre: 'Mesures conservées',
    description:
      'Un relevé corporel par client, enregistré une fois et repris à chaque commande. Photos des tissus apportés et du modèle choisi.',
    href: '/mesures',
    lienLabel: 'Voir le relevé',
  },
  {
    icone: Banknote,
    titre: 'Acomptes et soldes',
    description:
      'Chaque commande porte son montant, son acompte et son reste à payer, en francs CFA. Le solde se lit sans calcul mental.',
    href: '/commandes',
    lienLabel: 'Voir les commandes',
  },
  {
    icone: MessageSquare,
    titre: 'Carnet client',
    description:
      'Coordonnées, historique des commandes et mesures d’un client au même endroit. Plus de carnet papier à retrouver.',
    href: '/clients',
    lienLabel: 'Voir le carnet',
  },
  {
    icone: TrendingUp,
    titre: 'Rapports d’atelier',
    description:
      'Chiffre d’affaires, tenues les plus demandées, délais de livraison — calculés sur vos commandes réelles, jamais sur des exemples.',
    href: '/rapports',
    lienLabel: 'Voir les rapports',
  },
  {
    icone: Smartphone,
    titre: 'Pensé pour le téléphone',
    description:
      'Chaque écran est conçu d’abord pour un écran de téléphone, puis élargi. L’atelier se gère debout, entre deux essayages.',
    href: '/dashboard',
    lienLabel: 'Voir le tableau de bord',
  },
];

export interface CasUsage {
  titre: string;
  description: string;
  /** Ce que l'application fait pour ce profil — une capacité, pas une promesse chiffrée. */
  resultat: string;
  mesure: string;
}

/**
 * Trois profils d'atelier.
 *
 * La maquette promettait « +35 % de commandes », « +45 % de satisfaction »,
 * « chiffre d'affaires +60 % ». Ces gains n'ont été mesurés nulle part. Ils
 * cèdent la place à ce que l'application fait réellement pour chaque profil :
 * vérifiable en cliquant, et ça n'engage que ce qui existe.
 */
export const CAS_USAGE: CasUsage[] = [
  {
    titre: 'Atelier de quartier',
    description:
      'Un tailleur seul ou deux à trois couturières. Commandes régulières, clientèle fidèle.',
    resultat: 'Carnet client, mesures et acomptes au même endroit',
    mesure: 'Ce que ça change',
  },
  {
    titre: 'Production collective',
    description: 'Cinq à dix tailleurs, forte charge. Besoin de coordination et de délais tenus.',
    resultat: 'Charge de chaque artisan, jour par jour, avec sa capacité propre',
    mesure: 'Ce que ça change',
  },
  {
    titre: 'Maison de mode',
    description: 'Pièces de valeur, retouches nombreuses, clientèle exigeante.',
    resultat: 'Relevé corporel conservé, photos des tissus, solde suivi à l’écriture près',
    mesure: 'Ce que ça change',
  },
];

export interface Temoignage {
  nom: string;
  initiales: string;
  role: string;
  texte: string;
}

/**
 * Témoignages affichés — **vide, délibérément**.
 *
 * La maquette en fournissait trois, attribués à des personnes nommées avec leur
 * ville et leur métier. Aucune n'existe et aucune n'a rien dit : les citations
 * sortent du générateur. Publier la page en l'état, c'est afficher de faux avis
 * clients signés — la seule chose de cette page qu'un visiteur ne peut pas
 * vérifier lui-même, et celle qui coûterait le plus cher à démentir.
 *
 * `SectionTemoignages` se retire d'elle-même quand ce tableau est vide : la
 * page se referme proprement, sans trou de mise en page.
 *
 * Pour rétablir la section, remplacez ce tableau par de vrais retours — ou par
 * `TEMOIGNAGES_MAQUETTE` ci-dessous, en connaissance de cause.
 */
export const TEMOIGNAGES: Temoignage[] = [];

/** Les citations d'origine de la maquette. Inventées — voir ci-dessus. */
export const TEMOIGNAGES_MAQUETTE: Temoignage[] = [
  {
    nom: 'Moussa Koné',
    initiales: 'MK',
    role: 'Maître tailleur, Ouagadougou',
    texte:
      'Avant, j’avais des carnets partout. Des clients oubliés, des dates mélangées. Maintenant tout est au même endroit, et je gère même l’atelier depuis mon téléphone.',
  },
  {
    nom: 'Fatoumata Ba',
    initiales: 'FB',
    role: 'Directrice d’atelier, Dakar',
    texte:
      'Le planning a tout changé. Plus de surcharge. Chaque matin les couturières savent exactement ce qu’elles ont à faire.',
  },
  {
    nom: 'Ibrahim Diallo',
    initiales: 'ID',
    role: 'Tailleur indépendant, Bamako',
    texte:
      'C’était compliqué avant. Aujourd’hui les clients voient que je suis organisé, et ça leur donne confiance.',
  },
];

export interface Question {
  question: string;
  reponse: string;
}

/** ⚠️ Plusieurs réponses décrivent des fonctions qui n'existent pas encore. */
export const QUESTIONS: Question[] = [
  {
    question: 'Faut-il un téléphone récent ?',
    reponse:
      'Non. AtelierPro s’ouvre dans le navigateur, y compris sur un Android ancien et une connexion lente. Aucune installation n’est nécessaire.',
  },
  {
    question: 'Combien ça coûte ?',
    reponse:
      'Trente jours d’essai gratuit, puis de 2 000 à 5 000 F CFA par mois selon le plan. Moins cher qu’une retouche.',
  },
  {
    question: 'Et si internet est coupé ?',
    reponse:
      'L’atelier a besoin d’une connexion pour enregistrer ses commandes. Le travail hors-ligne avec synchronisation différée est prévu, il n’est pas encore disponible.',
  },
  {
    question: 'Comment reprendre mes anciens clients ?',
    reponse:
      'Le carnet s’alimente au fil des commandes : le premier client se saisit en moins d’une minute, mesures comprises. Un import de fichier est à l’étude.',
  },
  {
    question: 'C’est pour quel pays ?',
    reponse:
      'Conçu pour l’Afrique de l’Ouest : interface en français, en anglais ou en arabe, montants en francs CFA sans décimales.',
  },
];

export interface PlanTarifaire {
  nom: string;
  /** Identifiant transmis à l'inscription via `?plan=`. */
  cle: string;
  prix: string;
  periode: string;
  description: string;
  populaire?: boolean;
  inclus: string[];
  /** `true` pour Enterprise : mène au contact plutôt qu'à l'inscription. */
  surDevis?: boolean;
}

/** ⚠️ Aucun paiement n'est branché : ces prix ne sont encore prélevés nulle part. */
export const PLANS_TARIFAIRES: PlanTarifaire[] = [
  {
    nom: 'Découverte',
    cle: 'decouverte',
    prix: '2 000 F',
    periode: '/mois',
    description: 'Pour un atelier qui démarre',
    inclus: [
      'Jusqu’à 50 commandes par mois',
      'Jusqu’à 5 artisans',
      'Mesures et paiements',
      'Notes d’atelier',
      'Assistance par e-mail',
    ],
  },
  {
    nom: 'Atelier',
    cle: 'atelier',
    prix: '4 000 F',
    periode: '/mois',
    description: 'Pour une équipe qui grandit',
    populaire: true,
    inclus: [
      'Commandes illimitées',
      'Jusqu’à 10 artisans',
      'Planning et capacité par artisan',
      'Rapports complets',
      'Assistance prioritaire',
    ],
  },
  {
    nom: 'Maison',
    cle: 'maison',
    prix: 'Sur devis',
    periode: '',
    description: 'Pour les grands ateliers',
    surDevis: true,
    inclus: [
      'Artisans illimités',
      'Accès à l’API',
      'Mise en route accompagnée',
      'Formation de l’équipe',
      'Interlocuteur dédié',
    ],
  },
];

/**
 * Numéro de contact WhatsApp, au format international sans espaces.
 *
 * La maquette affichait « +226 XXXXXXXXX ». Un numéro fictif sur une page
 * publique est pire qu'une absence : il promet un canal qui ne répondra pas.
 * Tant que la variable est vide, la ligne n'est pas rendue.
 */
export const WHATSAPP = process.env.NEXT_PUBLIC_ATELIER_WHATSAPP ?? '';

/** Ancres de la page, partagées entre la navigation et les sections. */
export const ANCRES = {
  fonctionnalites: 'fonctionnalites',
  tarifs: 'tarifs',
  temoignages: 'temoignages',
  faq: 'faq',
  contact: 'contact',
} as const;
