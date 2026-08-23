'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
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
export function useRapports() {
  const [rapports, setRapports] = useState<Rapports | null>(null);
  const [source, setSource] = useState<SourceRapports>('serveur');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    let annule = false;

    void (async () => {
      try {
        const res = await api<Rapports>('/api/rapports');
        if (!annule) {
          setRapports(res);
          setSource('serveur');
        }
      } catch (err) {
        if (annule) return;
        if (err instanceof ApiError && err.status === 401) {
          setSource('demonstration');
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
  }, []);

  return { rapports, source, chargement, erreur };
}
