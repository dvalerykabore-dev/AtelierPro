import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Clock,
  Package,
  Plus,
  Shirt,
  Users,
  type LucideIcon,
} from 'lucide-react';
import AppShell from '@/components/atelier/AppShell';
import CommandesDuJour from '@/components/atelier/CommandesDuJour';
import StatTile from '@/components/ui/StatTile';
import CapacityBar, { chargeArtisan } from '@/components/ui/CapacityBar';
import Avatar from '@/components/ui/Avatar';
import {
  ATELIER_NOM,
  artisans,
  dateDuJour,
  nombreNotifications,
  prochaineDisponibilite,
  statistiques,
} from '@/lib/mock/atelier';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Tableau de bord — AtelierPro',
};

/** Icône associée à chaque statistique (les données restent agnostiques du rendu). */
const ICONES_STATS: Record<string, LucideIcon> = {
  s1: Shirt,
  s2: Package,
  s3: AlertCircle,
  s4: Users,
};

/** Le bandeau mobile utilise un triangle d'alerte là où le desktop met un cercle. */
const ICONES_STATS_MOBILE: Record<string, LucideIcon> = {
  ...ICONES_STATS,
  s3: AlertTriangle,
};

const UTILISATEUR_INITIALES = 'MK';

export default function DashboardPage() {
  const satures = artisans.filter((a) => a.heuresUtilisees >= a.heuresTotal).length;
  const disponibles = artisans.length - satures;

  const heuresTotal = artisans.reduce((somme, a) => somme + a.heuresTotal, 0);
  const heuresUtilisees = artisans.reduce((somme, a) => somme + a.heuresUtilisees, 0);
  const chargeGlobale = heuresTotal > 0 ? Math.round((heuresUtilisees / heuresTotal) * 100) : 0;
  const atelierSature = chargeGlobale >= 100;

  // Le bandeau compact affiche 3 statistiques sur téléphone (comme la maquette
  // mobile Banani) et la 4e dès qu'il y a la place, à partir de 640px.
  const statsCompactes = statistiques;

  return (
    <AppShell
      titre="Tableau de bord"
      sousTitre={dateDuJour.long}
      actions={
        <>
          <span
            className={cn(
              'flex items-center gap-2 rounded-md border px-3 py-1.5',
              satures >= 3 ? 'border-danger bg-danger' : 'border-success bg-success',
            )}
          >
            <span className="bg-background h-2 w-2 rounded-full" aria-hidden />
            <span className="text-background text-xs font-medium">
              {satures >= 3 ? 'Journée saturée' : 'Places disponibles'}
            </span>
          </span>

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
              <p className="text-muted text-xs font-medium">{dateDuJour.court}</p>
              <h1 className="font-headings text-background truncate text-lg leading-tight font-bold">
                {ATELIER_NOM}
              </h1>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
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

          {/* Carte capacité du jour */}
          <section className="bg-background/10 rounded-xl p-4" aria-label="Capacité du jour">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-background/80 text-xs font-medium">Capacité du jour</span>
              <span
                className={cn(
                  'text-background rounded-sm px-2 py-0.5 text-xs font-bold',
                  atelierSature ? 'bg-danger' : 'bg-success',
                )}
              >
                {atelierSature ? 'Saturé' : `${chargeGlobale}%`}
              </span>
            </div>

            {/* Barre globale */}
            <div
              className="bg-background/20 mb-3 h-2 overflow-hidden rounded-full"
              role="progressbar"
              aria-valuenow={chargeGlobale}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Charge globale de l’atelier"
            >
              <div
                className={cn('h-full rounded-full', atelierSature ? 'bg-danger' : 'bg-success')}
                style={{ width: `${Math.min(chargeGlobale, 100)}%` }}
              />
            </div>

            {/* Mini-barres verticales par artisan */}
            <ul className="flex gap-1.5">
              {artisans.map((a) => {
                const { pourcentage, sature, alerte } = chargeArtisan(
                  a.heuresUtilisees,
                  a.heuresTotal,
                );
                return (
                  <li key={a.id} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="bg-background/20 flex h-8 w-full flex-col-reverse overflow-hidden rounded-sm"
                      title={`${a.prenom} — ${a.heuresUtilisees}/${a.heuresTotal}h`}
                    >
                      <div
                        className={cn(
                          'w-full',
                          sature ? 'bg-danger' : alerte ? 'bg-warning' : 'bg-success',
                        )}
                        style={{ height: `${Math.min(pourcentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-background/70 text-[9px] font-bold">{a.initiales}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        </header>
      }
    >
      {/* ================= Bandeau statistiques mobile ================= */}
      <div className="border-border flex border-b lg:hidden">
        {statsCompactes.map((s, i) => {
          const Icone = ICONES_STATS_MOBILE[s.id] ?? Shirt;
          const dernierSurMobile = i === statsCompactes.length - 2;
          const dernier = i === statsCompactes.length - 1;
          return (
            <div
              key={s.id}
              className={cn(
                'flex-1 flex-col items-center gap-0.5 py-3',
                // La 4e statistique n'apparaît qu'à partir de 640px, où la
                // largeur le permet — la maquette mobile n'en montre que 3.
                s.surMobile ? 'flex' : 'hidden sm:flex',
                !dernier && !dernierSurMobile && 'border-border border-r',
                // Sur mobile la 3e est la dernière visible : pas de filet.
                dernierSurMobile && 'border-border sm:border-r',
              )}
            >
              <Icone size={16} className="text-muted-foreground" aria-hidden />
              <span className="text-foreground text-base leading-none font-bold">{s.valeur}</span>
              <span className="text-muted-foreground text-xs">{s.labelCourt}</span>
            </div>
          );
        })}
      </div>

      {/* ================= Contenu ================= */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* ---- Colonne principale ---- */}
        <div className="flex min-w-0 flex-1 flex-col gap-6 lg:px-8 lg:py-6">
          {/* Tuiles KPI — desktop */}
          <div className="hidden gap-4 lg:flex">
            {statistiques.map((s) => (
              <StatTile
                key={s.id}
                label={s.label}
                valeur={s.valeur}
                icone={ICONES_STATS[s.id] ?? Shirt}
                tendance={s.tendance}
                enHausse={s.enHausse}
              />
            ))}
          </div>

          <CommandesDuJour />
        </div>

        {/* ---- Colonne capacité — desktop ---- */}
        <aside
          className="border-border bg-surface hidden w-72 flex-shrink-0 flex-col gap-6 border-l py-6 lg:flex"
          aria-label="Capacité de l’équipe"
        >
          <div className="px-5">
            <h2 className="font-headings text-foreground mb-1 text-sm font-bold">
              Capacité du jour
            </h2>
            <p className="text-muted-foreground mb-4 text-xs">
              Équipe de {artisans.length} — mise à jour auto
            </p>

            <div className="mb-5 flex gap-3">
              <div className="bg-muted flex-1 rounded-lg p-3 text-center">
                <div className="font-headings text-danger text-2xl font-bold">{satures}</div>
                <div className="text-muted-foreground text-xs">Saturés</div>
              </div>
              <div className="bg-muted flex-1 rounded-lg p-3 text-center">
                <div className="font-headings text-success text-2xl font-bold">{disponibles}</div>
                <div className="text-muted-foreground text-xs">Disponibles</div>
              </div>
            </div>

            {/* Filet or */}
            <div className="bg-primary/40 mb-4 h-px" />
          </div>

          <div className="flex-1 px-5">
            {artisans.map((a) => (
              <CapacityBar
                key={a.id}
                nom={a.nom}
                role={a.role}
                initiales={a.initiales}
                heuresUtilisees={a.heuresUtilisees}
                heuresTotal={a.heuresTotal}
              />
            ))}
          </div>

          <div className="border-border border-t px-5 pt-4">
            <div className="bg-muted rounded-lg p-3">
              <div className="mb-1 flex items-center gap-2">
                <Clock size={13} className="text-muted-foreground" aria-hidden />
                <span className="text-foreground text-xs font-medium">Prochaine dispo</span>
              </div>
              <div className="text-primary text-sm font-bold">{prochaineDisponibilite.artisan}</div>
              <div className="text-muted-foreground text-xs">{prochaineDisponibilite.detail}</div>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
