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
 * ⚠️  AFFIRMATIONS NON VÉRIFIÉES — À TRANCHER AVANT TOUTE MISE EN LIGNE
 *
 * Tout le texte commercial de la page d'accueil est rassemblé ici, et nulle
 * part ailleurs, pour une raison précise : la maquette Banani a rédigé des
 * chiffres et des témoignages qu'aucune donnée ne soutient. Éparpillés dans
 * dix composants, ils partiraient en production sans que personne ne les
 * relise.
 *
 * Ne sont adossés à rien :
 *   · CHIFFRES_CLES      — « 50K+ tailleurs », « 96 % de satisfaction »
 *   · TEMOIGNAGES        — trois personnes nommées, citations écrites par le
 *                          générateur de maquette : ce sont des avis fabriqués
 *   · CAS_USAGE.resultat — « +35 % de commandes », « revenue +60 % »
 *   · QUESTIONS          — hors-ligne, formation gratuite, import de clients,
 *                          support WhatsApp : aucun n'est implémenté
 *   · PLANS_TARIFAIRES   — aucun paiement n'est branché dans l'application
 *
 * FONCTIONNALITES est la seule liste qui décrit des écrans réellement livrés.
 * ═══════════════════════════════════════════════════════════════════════════ */

export interface ChiffreCle {
  valeur: string;
  label: string;
  icone: LucideIcon;
}

/** ⚠️ Chiffres de démarchage — aucune source. */
export const CHIFFRES_CLES: ChiffreCle[] = [
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
  /** ⚠️ Résultat annoncé — aucune mesure ne l'appuie. */
  resultat: string;
  mesure: string;
}

/** ⚠️ Les `resultat` sont des promesses de maquette, pas des mesures. */
export const CAS_USAGE: CasUsage[] = [
  {
    titre: 'Atelier de quartier',
    description:
      'Un tailleur seul ou deux à trois couturières. Commandes régulières, clientèle fidèle.',
    resultat: '+35 % de commandes, −20 h d’administratif par mois',
    mesure: 'Temps gagné',
  },
  {
    titre: 'Production collective',
    description: 'Cinq à dix tailleurs, forte charge. Besoin de coordination et de délais tenus.',
    resultat: 'Zéro retard de livraison, +45 % de satisfaction',
    mesure: 'Qualité',
  },
  {
    titre: 'Maison de mode',
    description: 'Pièces de valeur, retouches nombreuses, clientèle exigeante.',
    resultat: 'Chiffre d’affaires +60 %, paiements 50 % plus rapides',
    mesure: 'Revenus',
  },
];

export interface Temoignage {
  nom: string;
  initiales: string;
  role: string;
  texte: string;
}

/**
 * ⚠️ Témoignages fabriqués.
 *
 * Ces trois personnes n'existent pas et n'ont rien dit : les citations sortent
 * du générateur de maquette. Publier la page en l'état revient à afficher de
 * faux avis clients signés d'un nom et d'une ville. À remplacer par de vrais
 * retours, ou à retirer — la section entière disparaît si le tableau est vide.
 */
export const TEMOIGNAGES: Temoignage[] = [
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
      'Conçu pour l’Afrique de l’Ouest : interface en français, montants en francs CFA sans décimales.',
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
