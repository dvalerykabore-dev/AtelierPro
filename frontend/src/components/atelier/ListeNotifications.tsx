'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Banknote,
  CalendarClock,
  MessageCircle,
  Package,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { CATEGORIES_NOTIF, notifications, type Notification } from '@/lib/mock/atelier';
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
const FILTRES: Filtre[] = ['Toutes', 'Non lues', ...CATEGORIES_NOTIF];

/**
 * Centre de notifications.
 * Source Banani : screens/new_screen7.jsx (« Notifications — AtelierPro »).
 *
 * Les filtres et le marquage « tout lu » sont fonctionnels : la maquette les
 * montrait figés. L'état vit côté client tant que les données sont simulées.
 */
export default function ListeNotifications() {
  const [filtre, setFiltre] = useState<Filtre>('Toutes');
  const [lues, setLues] = useState<Set<string>>(
    () => new Set(notifications.filter((n) => n.lue).map((n) => n.id)),
  );

  const comptes = useMemo(() => {
    const c: Record<string, number> = {
      Toutes: notifications.length,
      'Non lues': notifications.filter((n) => !lues.has(n.id)).length,
    };
    for (const cat of CATEGORIES_NOTIF) {
      c[cat] = notifications.filter((n) => n.categorie === cat).length;
    }
    return c;
  }, [lues]);

  const visibles = useMemo(() => {
    if (filtre === 'Toutes') return notifications;
    if (filtre === 'Non lues') return notifications.filter((n) => !lues.has(n.id));
    return notifications.filter((n) => n.categorie === filtre);
  }, [filtre, lues]);

  function marquerLue(id: string) {
    setLues((prec) => new Set(prec).add(id));
  }

  function toutMarquerLu() {
    setLues(new Set(notifications.map((n) => n.id)));
  }

  const nonLues = comptes['Non lues'] ?? 0;

  return (
    <div className="flex min-h-full flex-col">
      {/* Filtres */}
      <div className="border-border bg-background border-b">
        <div className="flex items-center gap-1 overflow-x-auto px-4 py-3 lg:px-8">
          {FILTRES.map((f) => {
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
            onClick={toutMarquerLu}
            disabled={nonLues === 0}
            className="text-primary ml-auto flex-shrink-0 px-3 py-1.5 text-xs font-medium disabled:opacity-40"
          >
            Tout marquer comme lu
          </button>
        </div>
      </div>

      {/* Liste */}
      {visibles.length === 0 ? (
        <p className="text-muted-foreground px-4 py-10 text-center text-sm lg:px-8">
          Aucune notification dans cette catégorie.
        </p>
      ) : (
        <ul className="flex flex-col">
          {visibles.map((n) => {
            const Icone = ICONES[n.icone];
            const nonLue = !lues.has(n.id);

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
                          onClick={() => marquerLue(n.id)}
                          className="text-primary text-xs font-medium"
                        >
                          {n.action}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => marquerLue(n.id)}
                          className="text-primary text-xs font-medium"
                        >
                          {n.action}
                        </button>
                      ))}

                    {nonLue && (
                      <button
                        type="button"
                        onClick={() => marquerLue(n.id)}
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
