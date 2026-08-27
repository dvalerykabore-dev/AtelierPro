/**
 * Indicatifs téléphoniques et longueurs nationales attendues.
 *
 * Les longueurs comptent les chiffres APRÈS l'indicatif. Le zéro de composition
 * locale (06 … en France) n'est retiré que dans les pays qui en ont un — voir
 * le drapeau `zeroTronc`. En Côte d'Ivoire et au Bénin il appartient au numéro,
 * et le retirer fabriquerait une ligne qui ne sonne nulle part.
 *
 * Les plages sont volontairement un peu larges là où un pays a changé de plan
 * de numérotation récemment — le Bénin est passé de 8 à 10 chiffres, la Côte
 * d'Ivoire de 8 à 10. Rejeter un numéro valide coûte plus cher que laisser
 * passer une faute de frappe : le premier bloque l'enregistrement d'un client
 * au comptoir, le second se corrige à la première tentative d'appel.
 *
 * Pour ajouter un pays : une ligne suffit. `exemple` sert de repère visuel dans
 * le champ, pas de gabarit imposé.
 */

export interface Pays {
  /** ISO 3166-1 alpha-2 — clé stable, et non l'indicatif : +1 en couvre deux. */
  code: string;
  nom: string;
  /** Sans le « + ». */
  indicatif: string;
  /** Nombre de chiffres nationaux minimum et maximum. */
  min: number;
  max: number;
  /** Numéro d'exemple, formaté comme on l'écrit sur place. */
  exemple: string;
  /**
   * Le pays utilise un préfixe interurbain « 0 » qui disparaît à
   * l'international : on compose 06 … en France, on écrit +33 6 ….
   *
   * ABSENT PAR DÉFAUT, et c'est délibéré. En Côte d'Ivoire et au Bénin, le zéro
   * fait partie du numéro lui-même (+225 01 23 45 67 89) : le retirer produit
   * un numéro qui ne sonne nulle part, sans rien signaler. Une longueur fausse
   * affiche un message qu'on corrige ; un numéro amputé s'enregistre comme s'il
   * était bon et ne se découvre que le jour où l'on cherche à joindre le
   * client. Dans le doute, on garde le zéro.
   */
  zeroTronc?: boolean;
}

/**
 * Pays proposés, Burkina Faso en tête.
 *
 * L'ordre n'est pas alphabétique : les voisins immédiats viennent d'abord,
 * parce que c'est ce qu'un atelier de Ouagadougou compose tous les jours. Une
 * liste alphabétique mettrait l'Afrique du Sud avant le Mali.
 */
export const PAYS: Pays[] = [
  // ---- Afrique de l'Ouest ----
  { code: 'BF', nom: 'Burkina Faso', indicatif: '226', min: 8, max: 8, exemple: '70 12 34 56' },
  {
    code: 'CI',
    nom: 'Côte d’Ivoire',
    indicatif: '225',
    min: 8,
    max: 10,
    exemple: '01 23 45 67 89',
  },
  { code: 'ML', nom: 'Mali', indicatif: '223', min: 8, max: 8, exemple: '76 12 34 56' },
  { code: 'SN', nom: 'Sénégal', indicatif: '221', min: 9, max: 9, exemple: '77 123 45 67' },
  { code: 'NE', nom: 'Niger', indicatif: '227', min: 8, max: 8, exemple: '90 12 34 56' },
  { code: 'TG', nom: 'Togo', indicatif: '228', min: 8, max: 8, exemple: '90 12 34 56' },
  { code: 'BJ', nom: 'Bénin', indicatif: '229', min: 8, max: 10, exemple: '01 97 12 34 56' },
  {
    code: 'GH',
    nom: 'Ghana',
    indicatif: '233',
    min: 9,
    max: 9,
    exemple: '24 123 4567',
    zeroTronc: true,
  },
  {
    code: 'NG',
    nom: 'Nigeria',
    indicatif: '234',
    min: 7,
    max: 10,
    exemple: '802 123 4567',
    zeroTronc: true,
  },
  {
    code: 'GN',
    nom: 'Guinée',
    indicatif: '224',
    min: 8,
    max: 9,
    exemple: '622 12 34 56',
    zeroTronc: true,
  },
  {
    code: 'SL',
    nom: 'Sierra Leone',
    indicatif: '232',
    min: 8,
    max: 8,
    exemple: '76 123456',
    zeroTronc: true,
  },
  {
    code: 'LR',
    nom: 'Liberia',
    indicatif: '231',
    min: 7,
    max: 9,
    exemple: '77 012 345',
    zeroTronc: true,
  },
  { code: 'GM', nom: 'Gambie', indicatif: '220', min: 7, max: 7, exemple: '301 2345' },
  { code: 'GW', nom: 'Guinée-Bissau', indicatif: '245', min: 7, max: 9, exemple: '955 012 345' },
  { code: 'MR', nom: 'Mauritanie', indicatif: '222', min: 8, max: 8, exemple: '22 12 34 56' },
  { code: 'CV', nom: 'Cap-Vert', indicatif: '238', min: 7, max: 7, exemple: '991 1234' },

  // ---- Afrique centrale ----
  { code: 'CM', nom: 'Cameroun', indicatif: '237', min: 8, max: 9, exemple: '6 71 23 45 67' },
  { code: 'GA', nom: 'Gabon', indicatif: '241', min: 7, max: 8, exemple: '06 03 12 34' },
  { code: 'CG', nom: 'Congo', indicatif: '242', min: 9, max: 9, exemple: '06 123 4567' },
  {
    code: 'CD',
    nom: 'RD Congo',
    indicatif: '243',
    min: 9,
    max: 9,
    exemple: '991 234 567',
    zeroTronc: true,
  },
  { code: 'TD', nom: 'Tchad', indicatif: '235', min: 8, max: 8, exemple: '63 01 23 45' },
  { code: 'CF', nom: 'Centrafrique', indicatif: '236', min: 8, max: 8, exemple: '70 01 23 45' },

  // ---- Afrique du Nord ----
  {
    code: 'MA',
    nom: 'Maroc',
    indicatif: '212',
    min: 9,
    max: 9,
    exemple: '6 12 34 56 78',
    zeroTronc: true,
  },
  {
    code: 'DZ',
    nom: 'Algérie',
    indicatif: '213',
    min: 8,
    max: 9,
    exemple: '5 51 23 45 67',
    zeroTronc: true,
  },
  { code: 'TN', nom: 'Tunisie', indicatif: '216', min: 8, max: 8, exemple: '20 123 456' },
  {
    code: 'EG',
    nom: 'Égypte',
    indicatif: '20',
    min: 9,
    max: 10,
    exemple: '10 1234 5678',
    zeroTronc: true,
  },
  { code: 'LY', nom: 'Libye', indicatif: '218', min: 9, max: 9, exemple: '91 234 5678' },

  // ---- Afrique de l'Est et australe ----
  {
    code: 'KE',
    nom: 'Kenya',
    indicatif: '254',
    min: 9,
    max: 9,
    exemple: '712 345 678',
    zeroTronc: true,
  },
  {
    code: 'TZ',
    nom: 'Tanzanie',
    indicatif: '255',
    min: 9,
    max: 9,
    exemple: '621 234 567',
    zeroTronc: true,
  },
  {
    code: 'UG',
    nom: 'Ouganda',
    indicatif: '256',
    min: 9,
    max: 9,
    exemple: '712 345 678',
    zeroTronc: true,
  },
  {
    code: 'RW',
    nom: 'Rwanda',
    indicatif: '250',
    min: 9,
    max: 9,
    exemple: '788 123 456',
    zeroTronc: true,
  },
  {
    code: 'ET',
    nom: 'Éthiopie',
    indicatif: '251',
    min: 9,
    max: 9,
    exemple: '911 234 567',
    zeroTronc: true,
  },
  {
    code: 'ZA',
    nom: 'Afrique du Sud',
    indicatif: '27',
    min: 9,
    max: 9,
    exemple: '71 123 4567',
    zeroTronc: true,
  },

  // ---- Diaspora ----
  {
    code: 'FR',
    nom: 'France',
    indicatif: '33',
    min: 9,
    max: 9,
    exemple: '6 12 34 56 78',
    zeroTronc: true,
  },
  {
    code: 'BE',
    nom: 'Belgique',
    indicatif: '32',
    min: 8,
    max: 9,
    exemple: '470 12 34 56',
    zeroTronc: true,
  },
  {
    code: 'CH',
    nom: 'Suisse',
    indicatif: '41',
    min: 9,
    max: 9,
    exemple: '78 123 45 67',
    zeroTronc: true,
  },
  {
    code: 'DE',
    nom: 'Allemagne',
    indicatif: '49',
    min: 9,
    max: 11,
    exemple: '151 23456789',
    zeroTronc: true,
  },
  { code: 'IT', nom: 'Italie', indicatif: '39', min: 9, max: 10, exemple: '312 345 6789' },
  { code: 'ES', nom: 'Espagne', indicatif: '34', min: 9, max: 9, exemple: '612 34 56 78' },
  { code: 'PT', nom: 'Portugal', indicatif: '351', min: 9, max: 9, exemple: '912 345 678' },
  {
    code: 'GB',
    nom: 'Royaume-Uni',
    indicatif: '44',
    min: 9,
    max: 10,
    exemple: '7400 123456',
    zeroTronc: true,
  },
  { code: 'US', nom: 'États-Unis', indicatif: '1', min: 10, max: 10, exemple: '202 555 0148' },
  { code: 'CA', nom: 'Canada', indicatif: '1', min: 10, max: 10, exemple: '416 555 0148' },
  {
    code: 'AE',
    nom: 'Émirats arabes unis',
    indicatif: '971',
    min: 9,
    max: 9,
    exemple: '50 123 4567',
  },
  { code: 'SA', nom: 'Arabie saoudite', indicatif: '966', min: 9, max: 9, exemple: '51 234 5678' },
  {
    code: 'TR',
    nom: 'Turquie',
    indicatif: '90',
    min: 10,
    max: 10,
    exemple: '532 123 4567',
    zeroTronc: true,
  },
  { code: 'CN', nom: 'Chine', indicatif: '86', min: 11, max: 11, exemple: '131 2345 6789' },
  {
    code: 'IN',
    nom: 'Inde',
    indicatif: '91',
    min: 10,
    max: 10,
    exemple: '98765 43210',
    zeroTronc: true,
  },
  { code: 'BR', nom: 'Brésil', indicatif: '55', min: 10, max: 11, exemple: '11 91234 5678' },
];

/** L'atelier est à Ouagadougou ; c'est le choix qui évite un geste neuf fois sur dix. */
export const PAYS_DEFAUT = 'BF';

const PAR_CODE = new Map(PAYS.map((p) => [p.code, p]));

export function paysDe(code: string): Pays | undefined {
  return PAR_CODE.get(code);
}

/** Première lettre des indicateurs régionaux Unicode : 🇦 vaut U+1F1E6. */
const INDICATEUR_A = 0x1f1e6;
const LETTRE_A = 'A'.codePointAt(0)!;

/**
 * Drapeau d'un pays, déduit de son code ISO.
 *
 * Un drapeau Unicode est une paire d'« indicateurs régionaux » — deux lettres
 * spéciales que la police assemble en drapeau. Le déduire du code plutôt que de
 * le stocker garantit qu'il ne peut pas contredire le pays : ajouter une ligne
 * à la table suffit, sans risque de coller le mauvais drapeau à un indicatif.
 *
 * ATTENTION à ce que la police en fait. Android, iOS et macOS dessinent le
 * drapeau ; Windows ne livre pas ces glyphes et affiche les deux lettres — on
 * lit « BF » au lieu de 🇧🇫. C'est pour cela que l'indicatif reste écrit à côté :
 * la ligne garde son sens là où le drapeau ne s'affiche pas.
 */
export function drapeau(code: string): string {
  const iso = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(iso)) return '';
  return [...iso]
    .map((c) => String.fromCodePoint(INDICATEUR_A + (c.codePointAt(0)! - LETTRE_A)))
    .join('');
}

/** Ne garde que les chiffres — l'utilisateur colle des espaces, des points, des tirets. */
export function chiffres(valeur: string): string {
  return [...valeur].filter((c) => c >= '0' && c <= '9').join('');
}

/**
 * Retire le zéro de composition locale — mais seulement là où il en est un.
 *
 * En France, « 06 12 34 56 78 » s'écrit « +33 6 12 34 56 78 » : le zéro ouvre
 * une ligne depuis l'intérieur du pays et n'existe pas à l'international. En
 * Côte d'Ivoire, « +225 01 23 45 67 89 » garde le sien, qui appartient au
 * numéro.
 *
 * La distinction n'est pas cosmétique. Retirer le zéro partout amputait
 * silencieusement les numéros ivoiriens et béninois — deux pays qu'un atelier
 * de Ouagadougou appelle toutes les semaines. Aucune erreur ne s'affichait :
 * le numéro passait la validation de longueur et s'enregistrait, faux.
 */
export function sansZeroInitial(national: string, codePays?: string): string {
  const pays = codePays === undefined ? undefined : paysDe(codePays);
  // Sans pays connu, on ne touche à rien : mieux vaut une longueur signalée
  // qu'un chiffre supprimé sans le dire.
  if (!pays?.zeroTronc) return national;
  return national.startsWith('0') ? national.slice(1) : national;
}

/**
 * Assemble un numéro international : `+22670123456`.
 *
 * Sans espaces en base — la mise en forme est une affaire d'affichage, et un
 * numéro stocké formaté se compare mal à lui-même. Rend une chaîne vide quand
 * il n'y a pas de numéro : un client sans téléphone est un cas normal.
 */
export function composer(codePays: string, national: string): string {
  const pays = paysDe(codePays);
  const corps = sansZeroInitial(chiffres(national), codePays);
  if (!pays || corps === '') return '';
  return `+${pays.indicatif}${corps}`;
}

export interface Decomposition {
  codePays: string;
  national: string;
}

/**
 * Sépare un numéro enregistré en pays + partie nationale.
 *
 * Tolérante par construction : la base contient des numéros saisis avant
 * l'existence de ce champ — « 752000 », « 70 12 34 56 », « +226 70 12 34 56 ».
 * Une valeur sans indicatif reconnaissable est rendue telle quelle sur le pays
 * par défaut, plutôt que vidée. Effacer le numéro d'un client parce qu'on ne
 * sait pas le lire serait une perte de donnée déguisée en migration.
 */
export function decomposer(
  valeur: string | null | undefined,
  codeDefaut: string = PAYS_DEFAUT,
): Decomposition {
  const defaut = codeSur(codeDefaut);
  if (!valeur) return { codePays: defaut, national: '' };

  const brut = valeur.trim();
  const tous = chiffres(brut);
  if (tous === '') return { codePays: defaut, national: '' };

  // Un indicatif ne se devine que si le numéro s'annonce comme international.
  // Sans « + » ni « 00 », « 226123 » est un numéro local, pas le Burkina suivi
  // de « 123 ».
  const international = brut.startsWith('+') || brut.startsWith('00');
  if (!international) return { codePays: defaut, national: tous };

  const sansPrefixe = brut.startsWith('00') ? tous.slice(2) : tous;

  // Le plus long indicatif d'abord : « 1 » ne doit pas rafler « 1 » de « 1xx »
  // avant qu'un indicatif à trois chiffres ait eu sa chance.
  const candidats = [...PAYS].sort((a, b) => b.indicatif.length - a.indicatif.length);
  for (const p of candidats) {
    if (sansPrefixe.startsWith(p.indicatif)) {
      return { codePays: p.code, national: sansPrefixe.slice(p.indicatif.length) };
    }
  }

  // Indicatif inconnu de la liste : on garde les chiffres tels quels plutôt que
  // de les jeter, et le pays par défaut sert de repli affichable.
  return { codePays: codeSur(codeDefaut), national: sansPrefixe };
}

/** Un code absent de la liste rendrait le menu vide : on retombe sur le défaut. */
function codeSur(code: string): string {
  return PAR_CODE.has(code) ? code : PAYS_DEFAUT;
}

/**
 * Contrôle la longueur. Rend le message à afficher, ou `null` si tout va bien.
 *
 * Un numéro vide est accepté : tous les clients n'en laissent pas un, et
 * refuser l'enregistrement pour ça ferait perdre la fiche entière.
 */
export function valider(codePays: string, national: string): string | null {
  const corps = sansZeroInitial(chiffres(national), codePays);
  if (corps === '') return null;

  const pays = paysDe(codePays);
  if (!pays) return 'Choisissez un pays.';

  if (corps.length < pays.min) {
    const manque = pays.min - corps.length;
    return `Il manque ${manque} chiffre${manque > 1 ? 's' : ''} — ${pays.nom} en attend ${attendu(pays)}.`;
  }
  if (corps.length > pays.max) {
    const trop = corps.length - pays.max;
    return `${trop} chiffre${trop > 1 ? 's' : ''} de trop — ${pays.nom} en attend ${attendu(pays)}.`;
  }
  return null;
}

function attendu(pays: Pays): string {
  return pays.min === pays.max ? `${pays.min}` : `${pays.min} à ${pays.max}`;
}

/** Bornes de la norme E.164 : 15 chiffres au total, indicatif compris. */
const E164_MAX = 15;
const E164_MIN = 7;

/**
 * Contrôle un numéro international complet — la forme enregistrée en base.
 *
 * Sert des deux côtés : l'écran s'en sert pour prévenir avant d'envoyer, et la
 * route pour refuser ce qui arriverait par un autre chemin. Le même jugement
 * aux deux endroits évite qu'un numéro accepté à l'écran soit rejeté ensuite.
 *
 * Un indicatif absent de la liste n'est pas un refus : la liste ne prétend pas
 * couvrir le monde, et un client peut appeler d'un pays qui n'y figure pas.
 * On retombe alors sur les bornes E.164, qui valent partout.
 */
export function validerInternational(valeur: string | null | undefined): string | null {
  if (!valeur) return null;
  const brut = valeur.trim();
  if (brut === '') return null;

  if (!brut.startsWith('+')) return 'Le numéro doit commencer par un indicatif, par exemple +226.';

  const tous = chiffres(brut);
  if (tous.length < E164_MIN || tous.length > E164_MAX) {
    return `Un numéro international compte entre ${E164_MIN} et ${E164_MAX} chiffres.`;
  }

  const reconnu = [...PAYS]
    .sort((a, b) => b.indicatif.length - a.indicatif.length)
    .find((p) => tous.startsWith(p.indicatif));
  if (!reconnu) return null;

  return valider(reconnu.code, tous.slice(reconnu.indicatif.length));
}

/**
 * Met en forme pour la lecture : `+226 70 12 34 56`.
 *
 * Groupes de deux à partir de la fin pour les numéros pairs, de trois sinon —
 * approximation assumée. Reproduire la convention de chaque pays demanderait
 * une bibliothèque entière ; l'objectif ici est qu'un numéro se relise et se
 * recopie sans compter les chiffres au doigt.
 */
export function formaterAffichage(valeur: string | null | undefined): string {
  if (!valeur) return '';

  // Un numéro hérité, saisi avant ce champ, n'a pas d'indicatif : « 752000 ».
  // Lui en coller un serait inventer un pays que personne n'a choisi, et
  // afficher comme joignable une ligne qui ne l'est pas. On le rend tel quel —
  // incomplet et visiblement incomplet, ce qui invite à le corriger.
  const brut = valeur.trim();
  if (!brut.startsWith('+') && !brut.startsWith('00')) return brut;

  const { codePays, national } = decomposer(brut);
  const pays = paysDe(codePays);
  if (!pays || national === '') return brut;

  const taille = national.length % 2 === 0 ? 2 : 3;
  const groupes: string[] = [];
  for (let i = 0; i < national.length; i += taille) {
    groupes.push(national.slice(i, i + taille));
  }
  return `+${pays.indicatif} ${groupes.join(' ')}`;
}
