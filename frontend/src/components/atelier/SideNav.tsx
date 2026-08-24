'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { entreesLaterales } from '@/components/atelier/nav-items';
import { cn } from '@/lib/utils';

export interface SideNavProps {
  /** Initiales de l'utilisateur connecté, en pied de rail. */
  initiales: ReactNode;
}

/**
 * Rail de navigation vertical, icônes seules — desktop uniquement.
 * Source Banani : /components/SideNav.jsx
 */
export default function SideNav({ initiales }: SideNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className="bg-surface border-border hidden min-h-full w-16 flex-col border-r lg:flex"
    >
      {/* Logo */}
      <div className="border-border flex flex-col items-center border-b py-6">
        <span className="bg-primary flex h-9 w-9 items-center justify-center rounded-md">
          <span className="text-primary-foreground font-headings text-base font-bold">A</span>
        </span>
      </div>

      {/* Entrées */}
      <div className="flex flex-1 flex-col items-center gap-1 py-4">
        {entreesLaterales.map(({ id, href, label, icone: Icone, disponible }) => {
          const actif = pathname === href;
          const classes = cn(
            'flex h-10 w-10 items-center justify-center rounded-md transition-colors',
            actif ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
            disponible && !actif && 'hover:text-foreground hover:bg-muted',
          );

          if (!disponible) {
            return (
              <span key={id} className={classes} title={`${label} — écran à venir`} aria-disabled>
                <Icone size={18} aria-hidden />
              </span>
            );
          }

          return (
            <Link
              key={id}
              href={href}
              title={label}
              aria-label={label}
              aria-current={actif ? 'page' : undefined}
              className={classes}
            >
              <Icone size={18} aria-hidden />
            </Link>
          );
        })}
      </div>

      {/* Pied */}
      <div className="border-border flex flex-col items-center gap-3 border-t py-4">
        <Link
          href="/parametres"
          title="Paramètres"
          aria-label="Paramètres"
          aria-current={pathname === '/parametres' ? 'page' : undefined}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-md transition-colors',
            pathname === '/parametres'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted',
          )}
        >
          <Settings size={18} aria-hidden />
        </Link>
        <Avatar initiales={initiales} taille="sm" accentue />
      </div>
    </nav>
  );
}
