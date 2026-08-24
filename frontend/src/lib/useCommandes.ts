'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { avecReessai401 } from '@/lib/api-repli';
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

/** Sens inverse : l'écran parle français, la base parle en constantes. */
const STATUT_API: Record<StatutCommande, StatutApi> = {
  'En cours': 'IN_PROGRESS',
  Essayage: 'FITTING',
  Livraison: 'DELIVERY',
  'En retard': 'LATE',
  Livré: 'DELIVERED',
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
  createdAt: string;
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

/**
 * « Bazin riche » + « bleu nuit » → « Bazin riche · bleu nuit ».
 *
 * Rien n'est inventé quand les deux champs sont vides : la fiche dira que le
 * tissu n'est pas renseigné plutôt que d'afficher un tissu qui n'existe pas.
 */
function tissuDe(fabric: string | null, color: string | null): string | null {
  const parts = [fabric, color].filter((v): v is string => (v ?? '').trim() !== '');
  return parts.length > 0 ? parts.join(' · ') : null;
}

function versUI(c: CommandeApi): Commande {
  return {
    id: c.id,
    reference: reference(c.sequence),
    sequence: c.sequence,
    client: c.customer.name,
    clientId: c.customer.id,
    tenue: c.garment,
    tissu: tissuDe(c.fabric, c.color),
    statut: STATUT_AFFICHE[c.status],
    livraison: echeance(c.dueDate),
    // Initiales de l'artisan : l'équipe n'a pas encore de table dédiée.
    assignee: c.assignee ?? '—',
    // Une commande en retard porte l'urgence du jour dans toutes les vues.
    urgent: c.status === 'LATE',
    montant: c.priceAmount,
    acompte: c.depositAmount > 0,
    encaisse: c.depositAmount,
    notes: c.notes,
    creeLe: c.createdAt,
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
      const res = await avecReessai401<{ commandes: CommandeApi[] }>('/api/commandes');
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

  /**
   * Fait avancer une commande d'un jalon.
   *
   * Rien n'est posé localement avant la réponse : contrairement au marquage
   * « lu » d'une notification, un statut faux se voit sur le planning, dans les
   * rapports et sur la fiche client. Mieux vaut un bouton qui attend une
   * seconde qu'un atelier qui croit une commande livrée.
   */
  const changerStatut = useCallback(async (id: string, statut: StatutCommande) => {
    const res = await api<{ commande: CommandeApi }>(`/api/commandes/${id}`, {
      method: 'PATCH',
      body: { status: STATUT_API[statut] },
    });
    const maj = versUI(res.commande);
    setCommandes((prec) => prec.map((c) => (c.id === id ? maj : c)));
    return maj;
  }, []);

  return { commandes, source, chargement, recharger, changerStatut };
}
