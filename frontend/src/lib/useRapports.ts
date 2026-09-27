'use client';

import { useEffect, useState } from 'react';
import { useEtatMemorise } from '@/lib/etat-memorise';
import { ApiError } from '@/lib/api';
import { avecReessai401 } from '@/lib/api-repli';
import { messageErreur } from '@/lib/message-erreur';

export interface Rapports {
  indicateurs: {
    chiffreAffairesMois: number;
    commandesLivrees: number;
    /** `null` quand aucune commande livrée n'a d'échéance : rien à mesurer. */
    tauxPonctualite: number | null;
    delaiMoyenJours: number | null;
    totalCommandes: number;
  };
  chiffreAffairesMensuel: {
    label: string;
    chiffreAffaires: number;
    commandes: number;
    courant: boolean;
  }[];
  tenuesPopulaires: { label: string; nombre: number; pourcentage: number }[];
  performancesArtisans: { initiales: string; commandes: number; chiffreAffaires: number }[];
  repartitionPaiements: { label: string; nombre: number; pourcentage: number }[];
}

export type SourceRapports = 'serveur' | 'demonstration';

/**
 * Indicateurs de l'atelier, calculés côté serveur depuis les commandes.
 *
 * Contrairement aux clients et aux commandes, aucun repli sur des données
 * simulées : un rapport chiffré est soit exact, soit absent. Afficher un
 * chiffre d'affaires d'exemple serait le pire des mensonges de cette interface.
 */
interface EtatRapports {
  rapports: Rapports | null;
  source: SourceRapports;
}

export function useRapports() {
  const [etat, poserEtat, dejaCharge] = useEtatMemorise<EtatRapports>('/api/rapports', {
    rapports: null,
    source: 'serveur',
  });
  const { rapports, source } = etat;
  const [chargement, setChargement] = useState(!dejaCharge);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    let annule = false;

    void (async () => {
      try {
        const res = await avecReessai401<Rapports>('/api/rapports');
        if (!annule) poserEtat({ rapports: res, source: 'serveur' });
      } catch (err) {
        if (annule) return;
        if (err instanceof ApiError && err.status === 401) {
          // Pas de repli chiffré : un rapport est exact ou absent. On efface
          // aussi la valeur mémorisée — la session a expiré, ces chiffres ne
          // sont plus les nôtres à montrer.
          poserEtat({ rapports: null, source: 'demonstration' });
        } else {
          setErreur(messageErreur(err, 'Impossible de calculer les indicateurs.'));
        }
      } finally {
        if (!annule) setChargement(false);
      }
    })();

    return () => {
      annule = true;
    };
  }, [poserEtat]);

  return { rapports, source, chargement, erreur };
}
