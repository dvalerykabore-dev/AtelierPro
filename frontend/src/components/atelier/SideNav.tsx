'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings } from 'lucide-react';
import { BoutonAtelierPro } from '@/components/marque/LogoAtelierPro';
import { PastilleAtelier } from '@/components/atelier/IdentiteAtelier';
import { entreesLaterales } from '@/components/atelier/nav-items';
import { useT } from '@/contexts/LangueContext';
import { cn } from '@/lib/utils';

/**
 * Rail de navigation vertical, icônes seules — desktop uniquement.
 * Source Banani : /components/SideNav.jsx
 *
 * La pastille du pied lit la session elle-même. Elle recevait ses initiales en
 * prop depuis `AppShell`, ce qui obligeait chaque appelant à savoir de quoi
 * l'identité de l'atelier est faite — devenu faux le jour où elle a pu être un
 * logo.
 */
export default function SideNav() {
  const pathname = usePathname();
  const t = useT();

  return (
    <nav
      aria-label={t('Navigation principale')}
      data-chrome="app"
      className="bg-surface border-border hidden min-h-full w-16 flex-col border-r lg:flex"
    >
      {/* Marque du produit — celle de l'atelier est la pastille du pied. */}
      <div className="border-border flex flex-col items-center border-b py-6">
        <BoutonAtelierPro taille={34} className="text-primary" />
        <span className="sr-only">AtelierPro</span>
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
              <span
                key={id}
                className={classes}
                title={t('{ecran} — écran à venir', { ecran: t(label) })}
                aria-disabled
              >
                <Icone size={18} aria-hidden />
              </span>
            );
          }

          return (
            <Link
              key={id}
              href={href}
              title={t(label)}
              aria-label={t(label)}
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
          title={t('Paramètres')}
          aria-label={t('Paramètres')}
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
        <PastilleAtelier taille="sm" accentue />
      </div>
    </nav>
  );
}
