'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import {
  commandes as commandesSimulees,
  type Commande,
  type StatutCommande,
} from '@/lib/mock/atelier';

/** Statuts tels que stockés en base — l'affichage reste en français. */
type StatutApi = 'IN_PROGRESS' | 'FITTING' | 'DELIVERY' | 'LATE' | 'DELIVERED';

const STATUT_AFFICHE: Record<StatutApi, StatutCommande> = {
  IN_PROGRESS: 'En cours',
  FITTING: 'Essayage',
  DELIVERY: 'Livraison',
  LATE: 'En retard',
  DELIVERED: 'Livré',
};

interface CommandeApi {
  id: string;
  sequence: number;
  garment: string;
  fabric: string | null;
  color: string | null;
  status: StatutApi;
  priceAmount: number;
  depositAmount: number;
  assignee: string | null;
  dueDate: string | null;
  notes: string | null;
  customer: { id: string; name: string; gender: 'FEMALE' | 'MALE' };
}

/** « 7 » → « #007 » : le format court que l'atelier dicte à voix haute. */
function reference(sequence: number): string {
  return `#${String(sequence).padStart(3, '0')}`;
}

function echeance(dueDate: string | null): string {
  if (!dueDate) return '—';
  return new Date(dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function versUI(c: CommandeApi): Commande {
  return {
    id: c.id,
    reference: reference(c.sequence),
    client: c.customer.name,
    tenue: c.garment,
    statut: STATUT_AFFICHE[c.status],
    livraison: echeance(c.dueDate),
    // Initiales de l'artisan : l'équipe n'a pas encore de table dédiée.
    assignee: c.assignee ?? '—',
    // Une commande en retard porte l'urgence du jour dans toutes les vues.
    urgent: c.status === 'LATE',
    montant: c.priceAmount,
    acompte: c.depositAmount > 0,
  };
}

export type SourceCommandes = 'serveur' | 'demonstration';

/**
 * Commandes de l'atelier, lues depuis `/api/commandes`.
 *
 * Même repli que pour les clients : sans session l'API répond 401 et l'on
 * retombe sur le jeu simulé, en l'annonçant. Voir `useClients`.
 */
export function useCommandes() {
  const [commandes, setCommandes] = useState<Commande[]>(commandesSimulees);
  const [source, setSource] = useState<SourceCommandes>('demonstration');
  const [chargement, setChargement] = useState(true);

  const recharger = useCallback(async () => {
    setChargement(true);
    try {
      const res = await api<{ commandes: CommandeApi[] }>('/api/commandes');
      setCommandes(res.commandes.map(versUI));
      setSource('serveur');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setCommandes(commandesSimulees);
        setSource('demonstration');
      }
      // Toute autre panne laisse la liste précédente en place : mieux vaut des
      // données un peu anciennes qu'un écran vide en plein service.
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    void recharger();
  }, [recharger]);

  return { commandes, source, chargement, recharger };
}
