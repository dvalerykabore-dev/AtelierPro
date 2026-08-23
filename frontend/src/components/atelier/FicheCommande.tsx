'use client';
import Link from 'next/link';
import {
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  MessageCircle,
  Phone,
  Printer,
  Shirt,
} from 'lucide-react';
import AppShell from '@/components/atelier/AppShell';
import OngletsFiche from '@/components/atelier/OngletsFiche';
import RecapitulatifCommande from '@/components/atelier/RecapitulatifCommande';
import NotesAtelier from '@/components/atelier/NotesAtelier';
import PaiementsCommande from '@/components/atelier/PaiementsCommande';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { useCommandes } from '@/lib/useCommandes';
import { clientPrincipal, etapesFabrication, mesuresResume, rappels } from '@/lib/mock/atelier';
import { cn, formatPrice } from '@/lib/utils';

/** Initiales à partir d'un nom complet — « Mariam Coulibaly » → « MC ». */
function initiales(nom: string): string {
  return nom
    .split(' ')
    .slice(0, 2)
    .map((m) => m[0] ?? '')
    .join('')
    .toUpperCase();
}

export default function FicheCommande({ id }: { id: string }) {
  const { commandes, chargement } = useCommandes();
  const commande = commandes.find((c) => c.id === id);

  // Trois états distincts : sans cette séparation, « commande introuvable »
  // s'afficherait le temps du chargement, à tort.
  if (!commande) {
    return (
      <AppShell titre={chargement ? 'Chargement…' : 'Commande introuvable'}>
        <div className="flex flex-col items-center gap-3 p-12 text-center">
          {chargement ? (
            <p className="text-muted-foreground text-sm">Chargement de la commande…</p>
          ) : (
            <>
              <p className="text-foreground text-sm font-medium">Cette commande n'existe pas</p>
              <p className="text-muted-foreground max-w-sm text-xs">
                Elle a peut-être été supprimée, ou appartient à un autre atelier.
              </p>
              <Link href="/commandes">
                <Button>Retour aux commandes</Button>
              </Link>
            </>
          )}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      titre={`${commande.reference} — ${commande.client}`}
      actions={
        <>
          <button
            type="button"
            className="border-border text-foreground hover:bg-muted flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-colors"
          >
            <Printer size={14} aria-hidden />
            Imprimer
          </button>
          <button
            type="button"
            className="border-border text-foreground hover:bg-muted flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-colors"
          >
            <MessageCircle size={14} aria-hidden />
            WhatsApp cliente
          </button>
          <button
            type="button"
            className="bg-primary text-primary-foreground hover:bg-accent flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            <CheckCircle2 size={14} aria-hidden />
            Valider essayage
          </button>
        </>
      }
    >
      {/* Fil d'Ariane */}
      <div className="border-border bg-surface text-muted-foreground hidden items-center gap-2 border-b px-8 py-2.5 text-sm lg:flex">
        <Link href="/commandes" className="hover:text-foreground">
          Commandes
        </Link>
        <ChevronRight size={13} aria-hidden />
        <span className="text-foreground font-medium">
          {commande.reference} — {commande.client}
        </span>
      </div>

      <OngletsFiche
        recapitulatif={<RecapitulatifCommande commande={commande} />}
        suivi={
          <div className="flex min-w-0 flex-col lg:flex-row">
            {/* ---- Colonne principale ---- */}
            <div className="border-border flex min-w-0 flex-1 flex-col lg:border-r">
              {/* En-tête commande */}
              <div className="border-border border-b px-4 py-5 lg:px-8">
                <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar
                      initiales={initiales(commande.client)}
                      taille="lg"
                      className="h-12 w-12 text-base"
                    />
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h2 className="font-headings text-foreground text-xl font-bold">
                          {commande.client}
                        </h2>
                        {clientPrincipal.fidele && (
                          <span className="bg-primary text-primary-foreground rounded-sm px-2 py-0.5 text-xs font-medium">
                            Fidèle
                          </span>
                        )}
                      </div>
                      <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
                        <span className="flex items-center gap-1">
                          <Phone size={12} aria-hidden />
                          {clientPrincipal.telephone}
                        </span>
                        <span aria-hidden>·</span>
                        <span className="flex items-center gap-1">
                          <Shirt size={12} aria-hidden />
                          {clientPrincipal.rangCommande}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 sm:items-end">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">Réf.</span>
                      <span className="text-foreground font-mono text-sm font-medium">
                        {commande.reference}
                      </span>
                    </div>
                    <div className="text-accent flex items-center gap-1.5 text-xs font-medium">
                      <span className="bg-accent h-1.5 w-1.5 rounded-full" aria-hidden />
                      Essayage aujourd’hui 15h
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                      <Calendar size={11} aria-hidden />
                      Livraison {commande.livraison}
                    </div>
                  </div>
                </div>

                {/* Tenue + tissu */}
                <div className="bg-muted flex flex-col gap-3 rounded-lg px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
                  <span className="bg-warning h-10 w-10 flex-shrink-0 rounded-md" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground text-sm font-bold">{commande.tenue}</div>
                    <div className="text-muted-foreground text-xs">{clientPrincipal.tissu}</div>
                  </div>
                  <div className="flex flex-col sm:items-end">
                    <span className="text-foreground text-base font-bold">
                      {formatPrice(commande.montant, 'F')}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      Assigné : {commande.assignee}
                    </span>
                  </div>
                </div>
              </div>

              {/* Avancement */}
              <section className="border-border border-b px-4 py-5 lg:px-8">
                <h2 className="font-headings text-foreground mb-4 text-sm font-bold">Avancement</h2>

                {/* Mobile : liste verticale — 7 étapes ne tiennent pas en ligne sur 375px */}
                <ol className="flex flex-col gap-3 lg:hidden">
                  {etapesFabrication.map((e, i) => (
                    <li key={e.label} className="flex items-center gap-3">
                      <span
                        className={cn(
                          'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                          e.terminee
                            ? 'bg-primary text-primary-foreground'
                            : e.active
                              ? 'bg-accent text-background'
                              : 'bg-background border-border text-muted-foreground border-2',
                        )}
                      >
                        {e.terminee ? <Check size={11} aria-hidden /> : i + 1}
                      </span>
                      <span
                        className={cn(
                          'flex-1 text-sm font-medium',
                          e.active
                            ? 'text-accent'
                            : e.terminee
                              ? 'text-foreground'
                              : 'text-muted-foreground',
                        )}
                      >
                        {e.label}
                      </span>
                      <span
                        className={cn(
                          'text-xs',
                          e.active ? 'text-accent font-medium' : 'text-muted-foreground',
                        )}
                      >
                        {e.date}
                      </span>
                    </li>
                  ))}
                </ol>

                {/* Desktop : frise horizontale */}
                <ol className="hidden items-start lg:flex">
                  {etapesFabrication.map((e, i) => (
                    <li key={e.label} className="relative flex flex-1 flex-col items-center">
                      {i < etapesFabrication.length - 1 && (
                        <span
                          className={cn(
                            'absolute top-3 left-1/2 h-0.5 w-full',
                            e.terminee ? 'bg-primary' : 'bg-border',
                          )}
                          aria-hidden
                        />
                      )}
                      <span
                        className={cn(
                          'z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                          e.terminee
                            ? 'bg-primary text-primary-foreground'
                            : e.active
                              ? 'bg-accent text-background border-accent border-2'
                              : 'bg-background border-border text-muted-foreground border-2',
                        )}
                      >
                        {e.terminee ? <Check size={11} aria-hidden /> : i + 1}
                      </span>
                      <span className="mt-2 px-1 text-center">
                        <span
                          className={cn(
                            'block text-xs leading-tight font-medium',
                            e.active
                              ? 'text-accent'
                              : e.terminee
                                ? 'text-foreground'
                                : 'text-muted-foreground',
                          )}
                        >
                          {e.label}
                        </span>
                        <span
                          className={cn(
                            'mt-0.5 block text-xs',
                            e.active ? 'text-accent font-medium' : 'text-muted-foreground',
                          )}
                        >
                          {e.date}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </section>

              <NotesAtelier />
            </div>

            {/* ---- Colonne latérale ---- */}
            <aside className="border-border flex w-full flex-shrink-0 flex-col border-t lg:w-80 lg:border-t-0">
              {/* Mesures */}
              <section className="border-border border-b px-4 py-5 lg:px-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="font-headings text-foreground text-sm font-bold">Mesures</h2>
                  <span className="text-primary text-xs font-medium">Voir tout</span>
                </div>
                <div className="border-border overflow-hidden rounded-lg border">
                  {mesuresResume.map((m, i) => (
                    <div
                      key={m.label}
                      className={cn(
                        'flex items-center justify-between gap-3 px-3 py-2.5',
                        i < mesuresResume.length - 1 && 'border-border border-b',
                        i % 2 === 1 ? 'bg-muted' : 'bg-surface',
                      )}
                    >
                      <span className="text-muted-foreground text-xs">{m.label}</span>
                      <span className="text-foreground text-xs font-medium">
                        {m.valeur} {m.unite}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <PaiementsCommande />

              {/* Rappels */}
              <section className="px-4 py-5 lg:px-6">
                <h2 className="font-headings text-foreground mb-3 text-sm font-bold">Rappels</h2>
                <div className="flex flex-col gap-2">
                  {rappels.map((r) => (
                    <div
                      key={r.texte}
                      className={cn(
                        'border-border flex items-center gap-2.5 rounded-md border px-3 py-2',
                        r.envoye ? 'bg-muted' : 'bg-surface',
                      )}
                    >
                      {r.envoye ? (
                        <CheckCircle2
                          size={14}
                          className="text-success flex-shrink-0"
                          aria-hidden
                        />
                      ) : (
                        <Clock
                          size={14}
                          className="text-muted-foreground flex-shrink-0"
                          aria-hidden
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-foreground text-xs">{r.texte}</div>
                        <div className="text-muted-foreground text-xs">{r.date}</div>
                      </div>
                      {!r.envoye && (
                        <button
                          type="button"
                          className="text-primary flex-shrink-0 text-xs font-medium"
                        >
                          Envoyer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        }
      />
    </AppShell>
  );
}
