'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Banknote,
  CalendarClock,
  MessageCircle,
  Lock,
  Package,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { CATEGORIES_NOTIF, type Notification } from '@/lib/mock/atelier';
import { useNotifications } from '@/lib/useNotifications';
import { cn } from '@/lib/utils';

const ICONES: Record<Notification['icone'], LucideIcon> = {
  paiement: Banknote,
  essayage: CalendarClock,
  retard: AlertTriangle,
  message: MessageCircle,
  livraison: Package,
  equipe: Users,
  nouveauClient: UserPlus,
};

type Filtre = 'Toutes' | 'Non lues' | (typeof CATEGORIES_NOTIF)[number];

/**
 * Centre de notifications, lu depuis `/api/notifications`.
 * Source Banani : screens/new_screen7.jsx (« Notifications — AtelierPro »).
 *
 * Le marquage « lu » part au serveur : il doit survivre au rechargement, sinon
 * la pastille revient et l'on relit dix fois la même chose.
 */
export default function ListeNotifications() {
  const { notifications, nonLues, session, chargement, marquerLues } = useNotifications();
  const [filtre, setFiltre] = useState<Filtre>('Toutes');

  // Les onglets suivent ce que la liste contient vraiment : un filtre
  // « Livraisons » qui ne peut jamais rien afficher est une promesse en l'air.
  const filtres = useMemo<Filtre[]>(() => {
    const presentes = CATEGORIES_NOTIF.filter((cat) =>
      notifications.some((n) => n.categorie === cat),
    );
    return ['Toutes', 'Non lues', ...presentes];
  }, [notifications]);

  const comptes = useMemo(() => {
    const c: Record<string, number> = {
      Toutes: notifications.length,
      'Non lues': nonLues,
    };
    for (const cat of CATEGORIES_NOTIF) {
      c[cat] = notifications.filter((n) => n.categorie === cat).length;
    }
    return c;
  }, [notifications, nonLues]);

  const visibles = useMemo(() => {
    if (filtre === 'Toutes') return notifications;
    if (filtre === 'Non lues') return notifications.filter((n) => !n.lue);
    return notifications.filter((n) => n.categorie === filtre);
  }, [filtre, notifications]);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <Lock size={26} className="text-muted-foreground mb-3" aria-hidden />
        <p className="text-foreground mb-1 text-sm font-bold">Notifications indisponibles</p>
        <p className="text-muted-foreground max-w-md text-xs">
          Vos alertes ne s’affichent qu’une fois connecté. Aucun jeu d’exemple n’est proposé ici :
          une notification affirme un fait daté, et une alerte inventée se confondrait avec une
          vraie.
        </p>
        <Link href="/connexion" className="text-primary mt-4 text-sm font-medium">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Filtres */}
      <div className="border-border bg-background border-b">
        <div className="flex items-center gap-1 overflow-x-auto px-4 py-3 lg:px-8">
          {filtres.map((f) => {
            const actif = f === filtre;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFiltre(f)}
                aria-pressed={actif}
                className={cn(
                  'flex flex-shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  actif
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {f}
                <span
                  className={cn(
                    'rounded-sm px-1.5 py-0.5 text-xs',
                    actif ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                  )}
                >
                  {comptes[f] ?? 0}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => void marquerLues('all')}
            disabled={nonLues === 0}
            className="text-primary ml-auto flex-shrink-0 px-3 py-1.5 text-xs font-medium disabled:opacity-40"
          >
            Tout marquer comme lu
          </button>
        </div>
      </div>

      {/* Liste */}
      {chargement && notifications.length === 0 ? (
        <p className="text-muted-foreground px-4 py-10 text-center text-sm lg:px-8">
          Chargement des notifications…
        </p>
      ) : visibles.length === 0 ? (
        <div className="px-4 py-10 text-center lg:px-8">
          <p className="text-foreground text-sm font-medium">
            {notifications.length === 0
              ? 'Aucune notification'
              : 'Aucune notification dans cette catégorie'}
          </p>
          {notifications.length === 0 && (
            /* Dire pourquoi c'est vide : sans cette phrase, un écran nu passe
               pour une panne de chargement. */
            <p className="text-muted-foreground mx-auto mt-1 max-w-sm text-xs">
              Rien ne vous a été signalé. Les retards et les livraisons du lendemain sont vérifiés
              chaque matin — aucune échéance ne tombe aujourd’hui.
            </p>
          )}
        </div>
      ) : (
        <ul className="flex flex-col">
          {visibles.map((n) => {
            const Icone = ICONES[n.icone];
            const nonLue = !n.lue;

            return (
              <li
                key={n.id}
                className={cn(
                  'border-border flex items-start gap-3 border-b px-4 py-4 lg:gap-4 lg:px-8',
                  nonLue ? 'bg-surface' : 'bg-background',
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md',
                    n.couleurIcone,
                  )}
                >
                  <Icone size={16} aria-hidden />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2
                      className={cn(
                        'text-sm',
                        nonLue ? 'text-foreground font-bold' : 'text-foreground font-medium',
                      )}
                    >
                      {n.titre}
                    </h2>
                    {nonLue && (
                      <span className="bg-primary h-1.5 w-1.5 rounded-full" title="Non lue" />
                    )}
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-sm">{n.corps}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className="text-muted-foreground text-xs">{n.moment}</span>

                    {n.action &&
                      (n.href ? (
                        <Link
                          href={n.href}
                          onClick={() => void marquerLues([n.id])}
                          className="text-primary text-xs font-medium"
                        >
                          {n.action}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void marquerLues([n.id])}
                          className="text-primary text-xs font-medium"
                        >
                          {n.action}
                        </button>
                      ))}

                    {nonLue && (
                      <button
                        type="button"
                        onClick={() => void marquerLues([n.id])}
                        className="text-muted-foreground hover:text-foreground text-xs"
                      >
                        Marquer comme lue
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
