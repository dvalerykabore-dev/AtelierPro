/**
 * Fil d'étapes du formulaire de nouvelle commande.
 *
 * Il était décoratif et faux : quatre étapes dont les états « terminée » étaient
 * écrits en dur dans le jeu d'exemple, avec une étape courante figée à 3. Le
 * fil affichait donc « Client ✓ · Modèle ✓ · Mesures (en cours) · Planning » à
 * l'ouverture d'un formulaire vierge, et n'avait jamais bougé depuis.
 *
 * Le formulaire tient d'ailleurs sur une seule page : il n'y a pas de tunnel.
 * Le fil devient donc ce qu'il pouvait être d'utile — la liste de ce qui manque
 * encore avant de pouvoir confirmer.
 */

export interface EtatCommande {
  /** Un client est rattaché. */
  client: boolean;
  /** Une tenue est choisie et son tissu renseigné. */
  modele: boolean;
  /** Le client a un relevé de mesures au dossier. */
  mesures: boolean;
  /** Une date de livraison est posée. */
  planning: boolean;
}

export interface Etape {
  numero: number;
  label: string;
  terminee: boolean;
  /** Première étape non terminée : celle qui reste à faire. */
  active: boolean;
}

/**
 * Rend les quatre étapes avec leur état réel.
 *
 * L'étape active est la PREMIÈRE non terminée, et non un numéro fixe : c'est
 * elle qui indique où reprendre. Quand tout est fait, aucune n'est active —
 * l'absence de repère marque alors que le formulaire est complet.
 */
export function etapesDe(etat: EtatCommande): Etape[] {
  const brut = [
    { numero: 1, label: 'Client', terminee: etat.client },
    { numero: 2, label: 'Modèle', terminee: etat.modele },
    { numero: 3, label: 'Mesures', terminee: etat.mesures },
    { numero: 4, label: 'Planning', terminee: etat.planning },
  ];
  const premiereRestante = brut.find((e) => !e.terminee)?.numero ?? null;
  return brut.map((e) => ({ ...e, active: e.numero === premiereRestante }));
}
