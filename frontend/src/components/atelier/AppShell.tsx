'use client';

import type { ReactNode } from 'react';
import SideNav from '@/components/atelier/SideNav';
import BottomNav from '@/components/atelier/BottomNav';
import AuthGuard from '@/components/atelier/AuthGuard';
import { useT } from '@/contexts/LangueContext';
import { cn } from '@/lib/utils';
import BasculeTheme from '@/components/ui/BasculeTheme';

export interface AppShellProps {
  /**
   * Titre de la barre haute (desktop) et de l'en-tête mobile par défaut.
   *
   * Reçu en français et traduit ici. Les pages qui le fournissent sont des
   * composants serveur, où le hook de traduction n'a pas cours : c'est la
   * raison pour laquelle cette coquille est passée côté client.
   */
  titre: string;
  /** Ligne secondaire sous le titre, desktop uniquement. */
  sousTitre?: ReactNode;
  /** Boutons et champs alignés à droite de la barre haute desktop. */
  actions?: ReactNode;
  /** Actions compactes de l'en-tête mobile par défaut. */
  actionsMobile?: ReactNode;
  /**
   * Remplace intégralement l'en-tête mobile. Le tableau de bord s'en sert pour
   * son bandeau crème inversé, qui ne ressemble à aucun autre écran.
   */
  enteteMobile?: ReactNode;
  /** Contenu inséré entre l'en-tête et le contenu principal (onglets de filtre…). */
  sousEntete?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Coquille commune à tous les écrans de l'atelier : rail latéral sur desktop,
 * barre de navigation basse sur mobile, et une barre haute dont la forme change
 * selon la largeur (source Banani : chaque écran répète cette structure).
 */
export default function AppShell({
  titre,
  sousTitre,
  actions,
  actionsMobile,
  enteteMobile,
  sousEntete,
  children,
  className,
}: AppShellProps) {
  const t = useT();
  return (
    <AuthGuard>
      <div className="bg-background font-body flex min-h-screen">
        <SideNav />

        <div className="flex min-w-0 flex-1 flex-col">
          {/* En-tête mobile : personnalisé si fourni, sinon barre simple */}
          {enteteMobile ?? (
            <header
              data-chrome="app"
              className="border-border bg-surface flex items-center justify-between gap-3 border-b px-4 py-3 lg:hidden"
            >
              <h1 className="font-headings text-foreground truncate text-lg font-bold">
                {t(titre)}
              </h1>
              <div className="flex flex-shrink-0 items-center gap-2">
                <BasculeTheme />
                {actionsMobile}
              </div>
            </header>
          )}

          {/* Barre haute desktop */}
          <header
            data-chrome="app"
            className="border-border bg-surface hidden items-center justify-between gap-4 border-b px-8 py-4 lg:flex"
          >
            <div className="min-w-0">
              <h1 className="font-headings text-foreground text-xl font-bold">{t(titre)}</h1>
              {sousTitre && (
                <p className="text-muted-foreground text-xs">
                  {typeof sousTitre === 'string' ? t(sousTitre) : sousTitre}
                </p>
              )}
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <BasculeTheme />
              {actions}
            </div>
          </header>

          {sousEntete}

          <main className={cn('flex-1', className)}>{children}</main>

          <BottomNav />
        </div>
      </div>
    </AuthGuard>
  );
}
