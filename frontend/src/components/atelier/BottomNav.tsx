'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { entreesBasses } from '@/components/atelier/nav-items';
import { cn } from '@/lib/utils';

/**
 * Barre de navigation basse — mobile uniquement.
 * Source Banani : écran « Mobile — Tableau de bord ».
 *
 * Cibles tactiles portées à 56px de haut (la maquette était à ~44px) pour rester
 * au-dessus du seuil de confort au doigt.
 */
export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className="border-border bg-surface sticky bottom-0 z-10 border-t lg:hidden"
    >
      <div className="flex">
        {entreesBasses.map(({ id, href, labelCourt, label, icone: Icone, disponible }) => {
          const actif = pathname === href;
          const classes = cn(
            'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 py-2.5',
            actif ? 'text-primary' : 'text-muted-foreground',
          );

          if (!disponible) {
            return (
              <span key={id} className={classes} title={`${label} — écran à venir`} aria-disabled>
                <Icone size={20} aria-hidden />
                <span className="text-[10px] font-medium">{labelCourt}</span>
              </span>
            );
          }

          return (
            <Link
              key={id}
              href={href}
              aria-current={actif ? 'page' : undefined}
              className={classes}
            >
              <Icone size={20} aria-hidden />
              <span className="text-[10px] font-medium">{labelCourt}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
