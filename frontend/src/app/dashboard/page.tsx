import type { Metadata } from 'next';
import Link from 'next/link';
import { Bell, Plus } from 'lucide-react';
import AppShell from '@/components/atelier/AppShell';
import CommandesDuJour from '@/components/atelier/CommandesDuJour';
import CapaciteEquipe from '@/components/atelier/CapaciteEquipe';
import StatistiquesAtelier from '@/components/atelier/StatistiquesAtelier';
import Avatar from '@/components/ui/Avatar';
import BasculeTheme from '@/components/ui/BasculeTheme';
import { dateDuJourFr, nombreNotifications } from '@/lib/mock/atelier';
import { NomAtelier } from '@/components/atelier/IdentiteAtelier';

export const metadata: Metadata = {
  title: 'Tableau de bord — AtelierPro',
};

/** Le bandeau mobile utilise un triangle d'alerte là où le desktop met un cercle. */
const UTILISATEUR_INITIALES = 'MK';

export default function DashboardPage() {
  return (
    <AppShell
      titre="Tableau de bord"
      sousTitre={dateDuJourFr().long}
      actions={
        <>
          <CapaciteEquipe variante="badge" />

          <Link
            href="/commandes/nouvelle"
            className="bg-primary text-primary-foreground hover:bg-accent flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            <Plus size={14} aria-hidden />
            Nouvelle commande
          </Link>
        </>
      }
      enteteMobile={
        <header className="bg-foreground px-4 pt-3 pb-4 lg:hidden">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-muted text-xs font-medium">{dateDuJourFr().court}</p>
              <h1 className="font-headings text-background truncate text-lg leading-tight font-bold">
                <NomAtelier />
              </h1>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              {/* Cet en-tête est un bandeau inversé (bg-foreground) dans les deux
                  thèmes : la bascule reprend le style de ses voisines plutôt que
                  son habillage par défaut, illisible sur ce fond. */}
              <BasculeTheme className="bg-background/10 text-background hover:bg-background/20 hover:text-background h-9 w-9 rounded-full" />

              <Link href="/notifications" className="relative" title="Notifications">
                <span className="bg-background/10 text-background flex h-9 w-9 items-center justify-center rounded-full">
                  <Bell size={18} aria-hidden />
                </span>
                {nombreNotifications > 0 && (
                  <span className="bg-danger text-background absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold">
                    {nombreNotifications}
                  </span>
                )}
                <span className="sr-only">{nombreNotifications} notifications non lues</span>
              </Link>
              <Link href="/parametres" title="Paramètres">
                <Avatar initiales={UTILISATEUR_INITIALES} taille="md" />
              </Link>
            </div>
          </div>

          {/* Carte capacité du jour — chiffres réels, donc composant client */}
          <section className="bg-background/10 rounded-xl p-4" aria-label="Capacité du jour">
            <CapaciteEquipe variante="compacte" />
          </section>
        </header>
      }
    >
      {/* ================= Bandeau statistiques mobile ================= */}
      <div className="border-border flex border-b lg:hidden">
        <StatistiquesAtelier variante="bandeau" />
      </div>

      {/* ================= Contenu ================= */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* ---- Colonne principale ---- */}
        <div className="flex min-w-0 flex-1 flex-col gap-6 lg:px-8 lg:py-6">
          {/* Tuiles KPI — desktop */}
          <div className="hidden gap-4 lg:flex">
            <StatistiquesAtelier variante="tuiles" />
          </div>

          <CommandesDuJour />
        </div>

        {/* ---- Colonne capacité — desktop ---- */}
        <aside
          className="border-border bg-surface hidden w-72 flex-shrink-0 flex-col gap-6 border-l py-6 lg:flex"
          aria-label="Capacité de l’équipe"
        >
          <CapaciteEquipe variante="panneau" />
        </aside>
      </div>
    </AppShell>
  );
}
