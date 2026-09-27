import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatTileProps {
  label: string;
  valeur: string;
  icone: LucideIcon;
  tendance: string;
  /**
   * Sens de la tendance. `null` (ou absent) = indicateur non mesurable : la
   * mention reste neutre, car ni le vert ni le rouge ne seraient honnêtes
   * devant une absence de données.
   */
  enHausse?: boolean | null;
}

/**
 * Tuile KPI de la rangée haute du tableau de bord (desktop).
 * Source Banani : /components/StatTile.jsx
 */
export default function StatTile({
  label,
  valeur,
  icone: Icone,
  tendance,
  enHausse = null,
}: StatTileProps) {
  return (
    <div className="bg-surface border-border flex-1 rounded-lg border px-5 py-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="text-muted-foreground text-xs tracking-wide uppercase">{label}</span>
        <span className="bg-muted flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md">
          <Icone size={15} aria-hidden />
        </span>
      </div>
      <div className="flex items-end gap-2">
        <span className="font-headings text-foreground text-3xl font-bold">{valeur}</span>
        <span
          className={cn(
            'mb-1 text-xs font-medium',
            enHausse === null ? 'text-muted-foreground' : enHausse ? 'text-success' : 'text-danger',
          )}
        >
          {tendance}
        </span>
      </div>
    </div>
  );
}
