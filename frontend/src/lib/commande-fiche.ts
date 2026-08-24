import type { Commande, SectionMesures, StatutCommande } from '@/lib/mock/atelier';

/**
 * Ce que la fiche commande déduit de données réelles.
 *
 * Tout ce qui est affiché ici se calcule à partir de la commande, du client et
 * du dernier relevé de mesures. Rien n'y est inventé : quand une information
 * manque, la fonction le dit — un `null`, une liste vide — et l'écran affiche
 * l'absence plutôt qu'un chiffre plausible. Un tailleur coupe dans du tissu
 * avec ces valeurs.
 */

export interface EtapeFiche {
  label: string;
  /** Vide quand aucune date n'est connue — on n'en fabrique pas. */
  date: string;
  terminee: boolean;
  active: boolean;
}

/**
 * « Mariam Coulibaly » → « MC » ; « MK » → « MK ».
 *
 * Le champ « assigné » est une chaîne libre : l'atelier y met tantôt un nom
 * complet, tantôt déjà des initiales. Un mot unique est donc gardé sur deux
 * lettres — sinon « MK » s'afficherait « M » à côté de son propre libellé.
 */
export function initialesDe(nom: string): string {
  const mots = nom.trim().split(' ').filter(Boolean);
  if (mots.length <= 1) return (mots[0] ?? '').slice(0, 2).toUpperCase();
  return mots
    .slice(0, 2)
    .map((mot) => mot[0] ?? '')
    .join('')
    .toUpperCase();
}

/** Rang chronologique d'une commande chez son client — 1 pour la première. */
export function rangCommande(commandes: Commande[], commande: Commande): number {
  return commandes.filter(
    (c) => c.clientId === commande.clientId && c.sequence <= commande.sequence,
  ).length;
}

/** 1 → « 1ʳᵉ commande » ; 6 → « 6ᵉ commande ». */
export function libelleRang(rang: number): string {
  return rang <= 1 ? '1ʳᵉ commande' : `${rang}ᵉ commande`;
}

/**
 * Prochain jalon d'une commande, et le libellé du bouton qui l'y emmène.
 *
 * `null` quand il n'y a plus rien à valider : le bouton disparaît plutôt que
 * de rester cliquable sans effet.
 *
 * « En retard » n'est pas une étape de fabrication mais une alerte de délai —
 * une commande en retard reprend donc là où une commande en cours en est.
 */
export function etapeSuivante(
  statut: StatutCommande,
): { suivant: StatutCommande; libelle: string } | null {
  switch (statut) {
    case 'En cours':
    case 'En retard':
      return { suivant: 'Essayage', libelle: 'Passer à l’essayage' };
    case 'Essayage':
      return { suivant: 'Livraison', libelle: 'Valider l’essayage' };
    case 'Livraison':
      return { suivant: 'Livré', libelle: 'Marquer livrée' };
    case 'Livré':
      return null;
  }
}

/**
 * Numéro au format attendu par wa.me : chiffres seuls, indicatif compris.
 *
 * `null` dès qu'il n'y a pas de quoi composer — un lien wa.me tronqué ouvre
 * WhatsApp sur une conversation vide, ou pire, sur le mauvais correspondant.
 * Le seuil de huit chiffres écarte les saisies partielles sans exclure les
 * numéros courts hors UEMOA.
 */
export function numeroWhatsApp(telephone: string | undefined): string | null {
  if (!telephone) return null;
  const chiffres = [...telephone].filter((c) => c >= '0' && c <= '9').join('');
  return chiffres.length >= 8 ? chiffres : null;
}

/**
 * Avancement déduit du statut, seule donnée d'étape réellement en base.
 *
 * La maquette montrait sept étapes datées (« Découpe tissu · 16 jan ») ;
 * aucune n'existe côté serveur, où une commande porte un statut et rien de
 * plus. Quatre jalons calqués sur ce statut disent la vérité ; sept étapes
 * datées ne le pourraient pas sans les fabriquer.
 */
export function etapesDe(
  statut: StatutCommande,
  dateCreation: string,
  echeance: string,
): EtapeFiche[] {
  const rang: Record<StatutCommande, number> = {
    'En cours': 1,
    'En retard': 1,
    Essayage: 2,
    Livraison: 3,
    Livré: 4,
  };
  const courant = rang[statut];

  const jalons: { label: string; date: string }[] = [
    { label: 'Commande enregistrée', date: dateCourte(dateCreation) },
    { label: 'Confection', date: '' },
    { label: 'Essayage', date: '' },
    { label: 'Livraison', date: echeance === '—' ? '' : echeance },
  ];

  return jalons.map((j, i) => ({
    label: j.label,
    date: j.date,
    // Le jalon 0 (enregistrement) est acquis dès que la commande existe.
    terminee: i < courant,
    active: i === courant,
  }));
}

/** « 2025-01-10T00:00:00.000Z » → « 10 janv. ». Chaîne vide si la date est illisible. */
export function dateCourte(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

/** « 2025-01-10T00:00:00.000Z » → « 10 janvier 2025 ». Vide si la date est illisible. */
export function dateComplete(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export interface MesureResumee {
  label: string;
  valeur: string;
  unite: string;
}

/**
 * Mesures effectivement relevées, dans l'ordre du carnet, plafonnées à `max`.
 *
 * Les champs vides sont écartés : la colonne latérale est un extrait, pas la
 * palette complète — celle-ci se consulte sur `/mesures`. Un relevé absent
 * rend une liste vide, jamais des valeurs d'exemple.
 */
export function mesuresResumeesDe(
  palette: SectionMesures[],
  valeurs: Record<string, string> | null,
  max = 6,
): MesureResumee[] {
  if (!valeurs) return [];
  const resume: MesureResumee[] = [];
  for (const section of palette) {
    for (const champ of section.champs) {
      if (resume.length >= max) return resume;
      const brut = valeurs[`${section.titre}::${champ.numero}`];
      const valeur = (brut ?? '').trim();
      if (valeur !== '') resume.push({ label: champ.label, valeur, unite: champ.unite });
    }
  }
  return resume;
}
