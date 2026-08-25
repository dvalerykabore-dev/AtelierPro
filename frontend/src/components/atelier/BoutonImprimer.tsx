'use client';

import { Download } from 'lucide-react';

export interface BoutonImprimerProps {
  /** Ce que le bouton annonce. « Exporter PDF » sur les rapports. */
  libelle?: string;
}

/**
 * Ouvre la boîte d'impression du navigateur, dont la destination « Enregistrer
 * au format PDF » produit le fichier attendu.
 *
 * Le bouton des rapports n'avait aucun gestionnaire : cliquer dessus ne faisait
 * rien. Un export PDF fabriqué côté serveur serait un autre chantier — celui-ci
 * s'appuie sur ce que le navigateur sait déjà faire, et la feuille de style
 * d'impression (globals.css) se charge de sortir un document présentable :
 * palette claire quel que soit le thème, navigation retirée.
 *
 * Client uniquement : `window.print` n'existe pas au rendu serveur, et les
 * coquilles de page qui portent ce bouton sont des composants serveur.
 */
export default function BoutonImprimer({ libelle = 'Exporter PDF' }: BoutonImprimerProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="border-border text-foreground hover:bg-muted flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors"
    >
      <Download size={14} aria-hidden />
      {libelle}
    </button>
  );
}
