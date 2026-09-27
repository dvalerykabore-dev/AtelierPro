'use client';

import Link from 'next/link';
import { AlertCircle, Calendar, ChevronRight } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import StatusBadge from '@/components/atelier/StatusBadge';
import type { Commande } from '@/lib/mock/atelier';
import { cn } from '@/lib/utils';
import { useT } from '@/contexts/LangueContext';

export interface OrderCardProps {
  commande: Commande;
  /**
   * `carte` — forme mobile : avatar, statut et échéance empilés.
   * `ligne` — forme desktop : ligne alignée sur les entêtes du tableau.
   *
   * Les deux structures Banani diffèrent trop (ordre des éléments, hiérarchie)
   * pour être obtenues par simples classes responsives sur un seul arbre. La
   * page choisit la variante ; chaque conteneur est masqué par `display:none`
   * hors de son point de rupture, ce qui le retire aussi de l'arbre
   * d'accessibilité — un lecteur d'écran n'en lit donc qu'une seule.
   */
  variante: 'carte' | 'ligne';
  /**
   * Destination au clic. Omis tant que l'écran « Fiche commande » n'existe pas —
   * la commande reste alors non cliquable plutôt que de mener à une 404.
   */
  href?: string;
}

export default function OrderCard({ commande, variante, href }: OrderCardProps) {
  const t = useT();
  const { client, tenue, statut, livraison, assignee, urgent } = commande;
  const enRetard = statut === 'En retard';

  const Conteneur = href ? Link : 'div';
  const propsLien = (href ? { href } : {}) as { href: string };

  if (variante === 'carte') {
    return (
      <Conteneur
        {...propsLien}
        className={cn(
          'flex items-center gap-3 rounded-lg border p-3',
          enRetard ? 'border-danger bg-background' : 'border-border bg-surface',
          href && 'hover:border-primary/60 transition-colors',
        )}
      >
        <Avatar initiales={assignee} taille="lg" />

        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center gap-1.5">
            <span className="text-foreground truncate text-sm font-medium">{client}</span>
            {urgent && (
              <AlertCircle
                size={13}
                className="text-danger flex-shrink-0"
                aria-label={t('Urgent')}
              />
            )}
          </div>
          <span className="text-muted-foreground block truncate text-xs">{tenue}</span>
          <div className="mt-1 flex items-center gap-2">
            <StatusBadge statut={statut} />
            <span className="text-muted-foreground text-xs" aria-hidden>
              ·
            </span>
            <span
              className={cn(
                'text-xs font-medium',
                enRetard ? 'text-danger' : 'text-muted-foreground',
              )}
            >
              {livraison}
            </span>
          </div>
        </div>

        {href && (
          <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" aria-hidden />
        )}
      </Conteneur>
    );
  }

  return (
    <Conteneur
      {...propsLien}
      className={cn(
        'border-border flex items-center gap-3 border-b px-4 py-3',
        urgent && 'bg-muted',
        href && 'hover:bg-muted/60 transition-colors',
      )}
    >
      <StatusBadge statut={statut} pastilleSeule />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-foreground text-sm font-medium">{client}</span>
          {urgent && (
            <span className="bg-danger text-foreground rounded-sm px-1.5 py-0.5 text-xs font-medium">
              {t('Urgent')}
            </span>
          )}
        </div>
        <span className="text-muted-foreground text-xs">{tenue}</span>
      </div>

      <StatusBadge statut={statut} className="w-20 flex-shrink-0" />

      <div className="flex w-16 flex-shrink-0 items-center justify-end gap-1">
        <Calendar size={12} className="text-muted-foreground" aria-hidden />
        <span className="text-muted-foreground text-xs">{livraison}</span>
      </div>

      <Avatar initiales={assignee} taille="sm" />
    </Conteneur>
  );
}
