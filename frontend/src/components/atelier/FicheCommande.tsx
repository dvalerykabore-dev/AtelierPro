'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
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
import { useClients } from '@/lib/useClients';
import { useCommandes } from '@/lib/useCommandes';
import { useReleveMesures } from '@/lib/useReleveMesures';
import {
  etapeSuivante,
  etapesDe,
  initialesDe,
  libelleRang,
  mesuresResumeesDe,
  numeroWhatsApp,
  rangCommande,
} from '@/lib/commande-fiche';
import { messageErreur } from '@/lib/message-erreur';
import { paletteDe, type StatutCommande } from '@/lib/mock/atelier';
import { cn, formatPrice } from '@/lib/utils';
import { useT } from '@/contexts/LangueContext';

export default function FicheCommande({ id }: { id: string }) {
  const t = useT();
  const { commandes, chargement, source, changerStatut } = useCommandes();
  const [envoiStatut, setEnvoiStatut] = useState(false);
  const [erreurStatut, setErreurStatut] = useState<string | null>(null);
  const { clients } = useClients();
  const commande = commandes.find((c) => c.id === id);
  const client = clients.find((c) => c.id === commande?.clientId);

  // Le relevé ne se charge que sur un identifiant réel : en démonstration les
  // ids sont ceux du jeu simulé et l'API répondrait 404.
  const { charge: releve } = useReleveMesures(commande?.clientId ?? null, source === 'serveur');

  // Trois états distincts : sans cette séparation, « commande introuvable »
  // s'afficherait le temps du chargement, à tort.
  if (!commande) {
    return (
      <AppShell titre={chargement ? 'Chargement…' : 'Commande introuvable'}>
        <div className="flex flex-col items-center gap-3 p-12 text-center">
          {chargement ? (
            <p className="text-muted-foreground text-sm">{t('Chargement de la commande…')}</p>
          ) : (
            <>
              <p className="text-foreground text-sm font-medium">
                {t('Cette commande n’existe pas')}
              </p>
              <p className="text-muted-foreground max-w-sm text-xs">
                {t('Elle a peut-être été supprimée, ou appartient à un autre atelier.')}
              </p>
              <Link href="/commandes">
                <Button>{t('Retour aux commandes')}</Button>
              </Link>
            </>
          )}
        </div>
      </AppShell>
    );
  }

  const rang = rangCommande(commandes, commande);
  const etapes = etapesDe(commande.statut, commande.creeLe, commande.livraison);
  // La palette suit le genre du relevé lui-même : c'est lui qui dit sous quels
  // libellés les valeurs ont été prises.
  const mesures = releve ? mesuresResumeesDe(paletteDe(releve.genre), releve.valeurs) : [];
  const suivante = etapeSuivante(commande.statut);
  const whatsapp = numeroWhatsApp(client?.telephone);

  async function avancer(statut: StatutCommande) {
    setEnvoiStatut(true);
    setErreurStatut(null);
    try {
      await changerStatut(id, statut);
    } catch (err) {
      setErreurStatut(messageErreur(err, 'Le statut n’a pas pu être enregistré.'));
    } finally {
      setEnvoiStatut(false);
    }
  }

  return (
    <AppShell
      titre={`${commande.reference} — ${commande.client}`}
      actions={
        <>
          <button
            type="button"
            onClick={() => window.print()}
            className="border-border text-foreground hover:bg-muted flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-colors"
          >
            <Printer size={14} aria-hidden />
            {t('Imprimer')}
          </button>

          {/* Sans numéro joignable, le lien wa.me ouvrirait une conversation
              vide : le bouton reste visible mais annonce ce qui manque. */}
          {whatsapp ? (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border text-foreground hover:bg-muted flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-colors"
            >
              <MessageCircle size={14} aria-hidden />
              WhatsApp {commande.client.split(' ')[0]}
            </a>
          ) : (
            <button
              type="button"
              disabled
              title={t('Aucun numéro enregistré pour ce client.')}
              className="border-border text-muted-foreground flex cursor-not-allowed items-center gap-1.5 rounded-md border px-3 py-2 text-sm opacity-50"
            >
              <MessageCircle size={14} aria-hidden />
              {t('Pas de numéro')}
            </button>
          )}

          {/* Le libellé nomme le geste du jour — « Valider l'essayage » n'a de
              sens que sur une commande en essayage. Une commande livrée n'a
              plus de jalon suivant : le bouton disparaît. */}
          {suivante && (
            <button
              type="button"
              onClick={() => void avancer(suivante.suivant)}
              disabled={envoiStatut}
              className="bg-primary text-primary-foreground hover:bg-accent flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <CheckCircle2 size={14} aria-hidden />
              {envoiStatut ? 'Enregistrement…' : suivante.libelle}
            </button>
          )}
        </>
      }
    >
      {/* Fil d'Ariane */}
      <div className="border-border bg-surface text-muted-foreground hidden items-center gap-2 border-b px-8 py-2.5 text-sm lg:flex">
        <Link href="/commandes" className="hover:text-foreground">
          {t('Commandes')}
        </Link>
        <ChevronRight size={13} aria-hidden />
        <span className="text-foreground font-medium">
          {commande.reference} — {commande.client}
        </span>
      </div>

      {erreurStatut && (
        <p
          role="alert"
          className="text-danger border-border flex items-start gap-2 border-b px-4 py-3 text-sm lg:px-8"
        >
          <AlertCircle size={15} className="mt-0.5 flex-shrink-0" aria-hidden />
          {erreurStatut}
        </p>
      )}

      <OngletsFiche
        recapitulatif={
          <RecapitulatifCommande commande={commande} client={client} releve={releve} rang={rang} />
        }
        suivi={
          <div className="flex min-w-0 flex-col lg:flex-row">
            {/* ---- Colonne principale ---- */}
            <div className="border-border flex min-w-0 flex-1 flex-col lg:border-r">
              {/* En-tête commande */}
              <div className="border-border border-b px-4 py-5 lg:px-8">
                <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar
                      initiales={initialesDe(commande.client)}
                      taille="lg"
                      className="h-12 w-12 text-base"
                    />
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h2 className="font-headings text-foreground text-xl font-bold">
                          {commande.client}
                        </h2>
                        {client?.fidele && (
                          <span className="bg-primary text-primary-foreground rounded-sm px-2 py-0.5 text-xs font-medium">
                            {t('Fidèle')}
                          </span>
                        )}
                      </div>
                      <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
                        <span className="flex items-center gap-1">
                          <Phone size={12} aria-hidden />
                          {client?.telephone || 'Téléphone non renseigné'}
                        </span>
                        <span aria-hidden>·</span>
                        <span className="flex items-center gap-1">
                          <Shirt size={12} aria-hidden />
                          {libelleRang(rang)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 sm:items-end">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">{t('Réf.')}</span>
                      <span className="text-foreground font-mono text-sm font-medium">
                        {commande.reference}
                      </span>
                    </div>
                    <div
                      className={cn(
                        'flex items-center gap-1.5 text-xs font-medium',
                        commande.urgent ? 'text-accent' : 'text-muted-foreground',
                      )}
                    >
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          commande.urgent ? 'bg-accent' : 'bg-border',
                        )}
                        aria-hidden
                      />
                      {t(commande.statut)}
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
                    <div className="text-muted-foreground text-xs">
                      {commande.tissu ?? 'Tissu non renseigné'}
                    </div>
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
                <h2 className="font-headings text-foreground mb-4 text-sm font-bold">
                  {t('Avancement')}
                </h2>

                {/* Mobile : liste verticale — 7 étapes ne tiennent pas en ligne sur 375px */}
                <ol className="flex flex-col gap-3 lg:hidden">
                  {etapes.map((e, i) => (
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
                        {t(e.label)}
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
                  {etapes.map((e, i) => (
                    <li key={e.label} className="relative flex flex-1 flex-col items-center">
                      {i < etapes.length - 1 && (
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
                          {t(e.label)}
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

              <NotesAtelier commandeId={commande.id} />
            </div>

            {/* ---- Colonne latérale ---- */}
            <aside className="border-border flex w-full flex-shrink-0 flex-col border-t lg:w-80 lg:border-t-0">
              {/* Mesures */}
              <section className="border-border border-b px-4 py-5 lg:px-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="font-headings text-foreground text-sm font-bold">
                    {t('Mesures')}
                  </h2>
                  <Link
                    href="/mesures"
                    className="text-primary text-xs font-medium hover:underline"
                  >
                    {t('Voir tout')}
                  </Link>
                </div>
                {mesures.length > 0 ? (
                  <div className="border-border overflow-hidden rounded-lg border">
                    {mesures.map((m, i) => (
                      /* « Tour de hanches » figure deux fois dans la palette
                         féminine : le libellé seul ne fait pas une clé. */
                      <div
                        key={`${m.label}-${i}`}
                        className={cn(
                          'flex items-center justify-between gap-3 px-3 py-2.5',
                          i < mesures.length - 1 && 'border-border border-b',
                          i % 2 === 1 ? 'bg-muted' : 'bg-surface',
                        )}
                      >
                        <span className="text-muted-foreground text-xs">{t(m.label)}</span>
                        <span className="text-foreground text-xs font-medium">
                          {m.valeur} {m.unite}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-border rounded-lg border border-dashed px-3 py-4">
                    <p className="text-muted-foreground text-xs">
                      {source === 'serveur'
                        ? `Aucune mesure relevée pour ${commande.client}. Prenez le relevé avant de tailler.`
                        : 'Les mesures ne sont pas consultables en mode démonstration.'}
                    </p>
                  </div>
                )}
              </section>

              <PaiementsCommande
                commandeId={commande.id}
                montant={commande.montant}
                encaisse={commande.encaisse ?? 0}
              />
            </aside>
          </div>
        }
      />
    </AppShell>
  );
}
