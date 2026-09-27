'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { avecReessai401 } from '@/lib/api-repli';
import { messageErreur } from '@/lib/message-erreur';

/**
 * Alertes que l'atelier peut réellement recevoir.
 *
 * La liste précédente promettait des « SMS au client 24 h avant l'essayage » —
 * aucun envoi SMS n'existe dans le code. On n'énumère donc que ce que le cron
 * quotidien émet vraiment : proposer un réglage pour une alerte qui n'existe
 * pas est un mensonge de plus, pas une fonctionnalité de moins.
 */
export const ALERTES = [
  {
    type: 'COMMANDE_EN_RETARD',
    label: 'Commande en retard',
    description: 'Dès qu’une commande dépasse son échéance de livraison.',
  },
  {
    type: 'LIVRAISON_DEMAIN',
    label: 'Livraison demain',
    description: 'La veille, pour les commandes à remettre le lendemain.',
  },
] as const;

export type TypeAlerte = (typeof ALERTES)[number]['type'];

type ReglagesCanal = { email?: boolean; inApp?: boolean };
export type Reglages = Record<string, ReglagesCanal>;

/**
 * Un rappel est-il actif ?
 *
 * Contrat du serveur, repris tel quel : la table ne stocke que les refus
 * explicites, donc un type absent — ou un canal absent dans un type connu —
 * vaut activé. On n'attend pas d'un artisan qu'il active ses alertes avant de
 * pouvoir les recevoir.
 *
 * Écrit ici en double de `isChannelEnabled` (serveur), qui est `server-only` et
 * ne peut pas être importé par un composant. Un test compare les deux sur les
 * mêmes entrées : le jour où le contrat s'inverse côté serveur, il casse, au
 * lieu de laisser l'écran afficher « actif » pour un rappel qui ne part plus.
 */
export function rappelActif(reglages: Reglages | null | undefined, type: string): boolean {
  return reglages?.[type]?.inApp !== false;
}

/**
 * Les réglages d'alertes de l'atelier.
 *
 * Contrat du serveur : un type absent vaut activé. La table ne stocke que les
 * refus explicites — on n'attend pas d'un artisan qu'il active ses alertes
 * avant de pouvoir les recevoir.
 */
export function usePreferencesNotifications() {
  const [reglages, setReglages] = useState<Reglages>({});
  const [chargement, setChargement] = useState(true);
  const [session, setSession] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    let annule = false;

    void (async () => {
      try {
        const res = await avecReessai401<{ prefs: Reglages }>('/api/notifications/prefs');
        if (annule) return;
        setReglages(res.prefs ?? {});
        setSession(true);
      } catch (err) {
        if (annule) return;
        if (err instanceof ApiError && err.status === 401) setSession(false);
        else setErreur(messageErreur(err, 'Réglages indisponibles.'));
      } finally {
        if (!annule) setChargement(false);
      }
    })();

    return () => {
      annule = true;
    };
  }, []);

  const estActif = useCallback((type: string): boolean => rappelActif(reglages, type), [reglages]);

  /** Renvoie `null` en cas de succès, sinon le message à afficher. */
  const basculer = useCallback(
    async (type: string): Promise<string | null> => {
      if (!session) return 'Connectez-vous pour régler vos alertes.';

      const suivant = !estActif(type);
      // Bascule optimiste : un interrupteur doit répondre au doigt. On revient
      // en arrière si le serveur refuse, plutôt que de laisser l'écran affirmer
      // un réglage qui n'a pas pris.
      const precedent = reglages;
      setReglages((prec) => ({ ...prec, [type]: { ...prec[type], inApp: suivant } }));

      try {
        await api('/api/notifications/prefs', {
          method: 'PATCH',
          body: { prefs: { [type]: { inApp: suivant } } },
        });
        return null;
      } catch (err) {
        setReglages(precedent);
        return messageErreur(err, 'Réglage non enregistré.');
      }
    },
    [session, estActif, reglages],
  );

  return { alertes: ALERTES, estActif, basculer, chargement, session, erreur };
}
