'use client';

import { useCallback, useEffect, useState } from 'react';
import { useEtatMemorise } from '@/lib/etat-memorise';
import { api, ApiError } from '@/lib/api';
import { avecReessai401 } from '@/lib/api-repli';
import {
  commandes as commandesSimulees,
  type Commande,
  type StatutCommande,
} from '@/lib/mock/atelier';
import { ETIQUETTE_INTL, type Langue } from '@/lib/langue';
import { useLangue } from '@/contexts/LangueContext';

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

function echeance(dueDate: string | null, langue: Langue): string {
  if (!dueDate) return '—';
  return new Intl.DateTimeFormat(ETIQUETTE_INTL[langue], {
    day: 'numeric',
    month: 'short',
  }).format(new Date(dueDate));
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

function versUI(c: CommandeApi, langue: Langue): Commande {
  return {
    id: c.id,
    reference: reference(c.sequence),
    sequence: c.sequence,
    client: c.customer.name,
    clientId: c.customer.id,
    tenue: c.garment,
    tissu: tissuDe(c.fabric, c.color),
    statut: STATUT_AFFICHE[c.status],
    livraison: echeance(c.dueDate, langue),
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
interface EtatCommandes {
  commandes: Commande[];
  source: SourceCommandes;
}

export function useCommandes() {
  // L’échéance affichée suit la langue de l’écran : une liste retournée en arabe
  // ne doit pas garder « 24 jan » au milieu.
  const { langue } = useLangue();
  const [etat, poserEtat, dejaCharge] = useEtatMemorise<EtatCommandes>('/api/commandes', {
    commandes: commandesSimulees,
    source: 'demonstration',
  });
  const { commandes, source } = etat;
  const [chargement, setChargement] = useState(!dejaCharge);

  // `silencieux` : au retour sur un écran déjà visité on revalide sans
  // squelette. Un rechargement demandé à la main doit rester visible, sinon le
  // bouton semble n'avoir rien fait.
  const recharger = useCallback(
    async (silencieux = false) => {
      if (!silencieux) setChargement(true);
      try {
        const res = await avecReessai401<{ commandes: CommandeApi[] }>('/api/commandes');
        poserEtat({ commandes: res.commandes.map((c) => versUI(c, langue)), source: 'serveur' });
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          poserEtat({ commandes: commandesSimulees, source: 'demonstration' });
        }
        // Toute autre panne laisse la liste précédente en place : mieux vaut des
        // données un peu anciennes qu'un écran vide en plein service.
      } finally {
        setChargement(false);
      }
    },
    [poserEtat, langue],
  );

  useEffect(() => {
    void recharger(dejaCharge);
    // `dejaCharge` est figé au premier rendu : le relire ici ne relance rien.
  }, [recharger, dejaCharge]);

  /**
   * Fait avancer une commande d'un jalon.
   *
   * Rien n'est posé localement avant la réponse : contrairement au marquage
   * « lu » d'une notification, un statut faux se voit sur le planning, dans les
   * rapports et sur la fiche client. Mieux vaut un bouton qui attend une
   * seconde qu'un atelier qui croit une commande livrée.
   */
  const changerStatut = useCallback(
    async (id: string, statut: StatutCommande) => {
      const res = await api<{ commande: CommandeApi }>(`/api/commandes/${id}`, {
        method: 'PATCH',
        body: { status: STATUT_API[statut] },
      });
      const maj = versUI(res.commande, langue);
      poserEtat((prec) => ({
        ...prec,
        commandes: prec.commandes.map((c) => (c.id === id ? maj : c)),
      }));
      return maj;
    },
    [poserEtat, langue],
  );

  return { commandes, source, chargement, recharger, changerStatut };
}
