'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { avecReessai401 } from '@/lib/api-repli';
import { versUI, type NotificationApi } from '@/lib/notifications';
import type { Notification } from '@/lib/mock/atelier';

/** Une page suffit : le centre de notifications n'a pas de défilement infini. */
const LIMITE = 50;

/**
 * Notifications de l'atelier, lues depuis `/api/notifications`.
 *
 * Aucun repli sur des données d'exemple, contrairement à `useCommandes` et
 * `useClients` : une notification affirme un fait daté — « acompte reçu »,
 * « commande en retard ». En inventer hors session, c'est exactement ce que
 * l'audit reprochait à cet écran. Même règle que la trésorerie : sans session,
 * l'écran dit pourquoi et propose la connexion.
 *
 * À noter : aucun événement de l'atelier ne créait de notification avant le
 * cron `atelier-alertes`. Une base neuve affiche donc légitimement une liste
 * vide — c'est l'état des données, pas une panne de l'écran.
 */
export function useNotifications() {
  const [brutes, setBrutes] = useState<NotificationApi[]>([]);
  const [session, setSession] = useState(true);
  const [chargement, setChargement] = useState(true);

  const recharger = useCallback(async () => {
    setChargement(true);
    try {
      const res = await avecReessai401<{ items: NotificationApi[] }>(
        `/api/notifications?limit=${LIMITE}`,
      );
      setBrutes(res.items);
      setSession(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setBrutes([]);
        setSession(false);
      }
      // Toute autre panne laisse la liste précédente en place : une liste
      // périmée reste plus utile qu'un écran vidé sur un incident réseau.
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    void recharger();
  }, [recharger]);

  const notifications: Notification[] = useMemo(() => brutes.map((n) => versUI(n)), [brutes]);
  const nonLues = notifications.filter((n) => !n.lue).length;

  /**
   * Marque des notifications lues — `'all'` pour toutes celles qui ne le sont
   * pas encore.
   *
   * L'état local est posé avant la réponse : le point bleu doit s'éteindre au
   * clic, pas après un aller-retour. Un échec relit le serveur, qui tranche.
   */
  const marquerLues = useCallback(
    async (ids: string[] | 'all') => {
      const instant = new Date().toISOString();
      const cible = ids === 'all' ? null : new Set(ids);
      setBrutes((prec) =>
        prec.map((n) =>
          n.readAt === null && (cible === null || cible.has(n.id)) ? { ...n, readAt: instant } : n,
        ),
      );

      try {
        await api('/api/notifications', { method: 'PATCH', body: { ids } });
      } catch {
        // Le serveur fait foi : on relit plutôt que de deviner ce qui a abouti.
        void recharger();
      }
    },
    [recharger],
  );

  return { notifications, nonLues, session, chargement, marquerLues, recharger };
}
