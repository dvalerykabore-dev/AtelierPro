'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import OrderCard from '@/components/atelier/OrderCard';
import { couleurStatut } from '@/components/atelier/StatusBadge';
import { useCommandes } from '@/lib/useCommandes';
import { STATUTS, couleursAssignes, type StatutCommande } from '@/lib/mock/atelier';
import { cn, formatPrice } from '@/lib/utils';
import { useLangue } from '@/contexts/LangueContext';

type Filtre = StatutCommande | 'Toutes';

const FILTRES: Filtre[] = ['Toutes', ...STATUTS];
const PAR_PAGE = 10;

/**
 * Liste des commandes — tableau sur desktop, cartes sur mobile.
 * Source Banani : screens/new_screen8.jsx (« Liste commandes — AtelierPro »).
 *
 * Les onglets de filtre et la pagination sont réellement fonctionnels : la
 * maquette les montrait figés, mais un filtre qui ne filtre pas est un piège
 * pour qui teste l'écran.
 */
export default function ListeCommandes() {
  const { t, tp } = useLangue();
  const { commandes, source, chargement } = useCommandes();

  const [filtre, setFiltre] = useState<Filtre>('Toutes');
  const [recherche, setRecherche] = useState('');
  const [page, setPage] = useState(1);

  const comptes = useMemo(() => {
    const c: Record<string, number> = { Toutes: commandes.length };
    for (const s of STATUTS) c[s] = commandes.filter((x) => x.statut === s).length;
    return c;
  }, [commandes]);

  const filtrees = useMemo(() => {
    const parStatut =
      filtre === 'Toutes' ? commandes : commandes.filter((c) => c.statut === filtre);
    const terme = recherche.trim().toLowerCase();
    if (!terme) return parStatut;
    // Recherche sur le client, la tenue et la référence — les trois façons
    // dont on cherche une commande dans un atelier.
    return parStatut.filter((c) =>
      [c.client, c.tenue, c.reference].some((champ) => champ.toLowerCase().includes(terme)),
    );
  }, [commandes, filtre, recherche]);

  const nbPages = Math.max(1, Math.ceil(filtrees.length / PAR_PAGE));
  const pageSure = Math.min(page, nbPages);
  const debut = (pageSure - 1) * PAR_PAGE;
  const visibles = filtrees.slice(debut, debut + PAR_PAGE);

  function changerFiltre(f: Filtre) {
    setFiltre(f);
    setPage(1);
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Recherche — la barre haute desktop en montre une décorative ; celle-ci
          filtre réellement et reste accessible sur mobile. */}
      <div className="border-border bg-background border-b px-4 py-3 lg:px-8">
        <div className="bg-input border-border focus-within:border-primary flex items-center gap-2 rounded-md border px-3 py-2 transition-colors lg:max-w-md">
          <Search size={14} className="text-muted-foreground flex-shrink-0" aria-hidden />
          <input
            type="search"
            value={recherche}
            onChange={(e) => {
              setRecherche(e.target.value);
              setPage(1);
            }}
            placeholder={t('Rechercher un client, une tenue, une référence…')}
            aria-label={t('Rechercher une commande')}
            className="text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm focus:outline-none"
          />
          {recherche && (
            <button
              type="button"
              onClick={() => setRecherche('')}
              aria-label={t('Effacer la recherche')}
              className="text-muted-foreground hover:text-foreground flex-shrink-0"
            >
              <X size={14} aria-hidden />
            </button>
          )}
        </div>
      </div>

      {/* Onglets de filtre */}
      <div className="border-border bg-background border-b">
        <div className="flex items-center gap-1 overflow-x-auto px-4 py-3 lg:px-8">
          {FILTRES.map((f) => {
            const actif = f === filtre;
            return (
              <button
                key={f}
                type="button"
                onClick={() => changerFiltre(f)}
                aria-pressed={actif}
                className={cn(
                  'flex flex-shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  actif
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t(f)}
                <span
                  className={cn(
                    'rounded-sm px-1.5 py-0.5 text-xs',
                    actif ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                  )}
                >
                  {comptes[f] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* État vide — une recherche infructueuse doit s'expliquer, pas laisser
          l'écran nu. On distingue le chargement de l'absence de résultat : sinon
          « aucune commande » clignote à chaque ouverture. */}
      {visibles.length === 0 && chargement && (
        <p className="text-muted-foreground flex-1 px-4 py-16 text-center text-sm">
          {t('Chargement des commandes…')}
        </p>
      )}

      {visibles.length === 0 && !chargement && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center">
          <Search size={28} className="text-muted-foreground" aria-hidden />
          <p className="text-foreground text-sm font-medium">
            {t('Aucune commande ne correspond')}
          </p>
          <p className="text-muted-foreground max-w-sm text-xs">
            {recherche
              ? t('Rien ne correspond à « {recherche} »{filtre}.', {
                  recherche,
                  filtre:
                    filtre !== 'Toutes' ? t(' dans le filtre « {nom} »', { nom: t(filtre) }) : '',
                })
              : t('Aucune commande avec le statut « {statut} ».', { statut: t(filtre) })}
          </p>
          {(recherche || filtre !== 'Toutes') && (
            <button
              type="button"
              onClick={() => {
                setRecherche('');
                changerFiltre('Toutes');
              }}
              className="text-primary text-xs font-medium"
            >
              {t('Réinitialiser les filtres')}
            </button>
          )}
        </div>
      )}

      {/* ---------- Mobile : cartes ---------- */}
      <ul className="grid gap-2 p-4 sm:grid-cols-2 lg:hidden">
        {visibles.map((c) => (
          <li key={c.id}>
            <OrderCard commande={c} variante="carte" href={`/commandes/${c.id}`} />
          </li>
        ))}
      </ul>

      {/* ---------- Desktop : tableau ---------- */}
      <div className={cn('hidden flex-1 flex-col', visibles.length > 0 && 'lg:flex')}>
        <div className="border-border bg-muted flex items-center border-b px-6 py-2.5">
          <div className="text-muted-foreground w-16 text-xs tracking-wide uppercase">
            {t('Réf.')}
          </div>
          <div className="text-muted-foreground flex-1 text-xs tracking-wide uppercase">
            {t('Client & tenue')}
          </div>
          <div className="text-muted-foreground w-28 text-xs tracking-wide uppercase">
            {t('Assigné')}
          </div>
          <div className="text-muted-foreground w-28 text-xs tracking-wide uppercase">
            {t('Livraison')}
          </div>
          <div className="text-muted-foreground w-28 text-xs tracking-wide uppercase">
            {t('Statut')}
          </div>
          <div className="text-muted-foreground w-28 text-right text-xs tracking-wide uppercase">
            {t('Montant')}
          </div>
          <div className="w-10" />
        </div>

        {visibles.map((c) => {
          const enRetard = c.statut === 'En retard';
          const { pastille, texte } = couleurStatut(c.statut);
          return (
            <a
              key={c.id}
              href={`/commandes/${c.id}`}
              className={cn(
                'border-border hover:bg-muted/40 flex items-center border-b px-6 py-3.5 transition-colors',
                enRetard ? 'bg-danger/5' : c.statut === 'Livré' ? 'bg-surface' : 'bg-background',
              )}
            >
              <div className="w-16">
                <span className="text-muted-foreground font-mono text-xs">{c.reference}</span>
              </div>

              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar initiales={c.assignee} taille="sm" />
                <div className="min-w-0">
                  <div className="text-foreground truncate text-sm font-medium">{c.client}</div>
                  <div className="text-muted-foreground truncate text-xs">{c.tenue}</div>
                </div>
                {!c.acompte && (
                  <span className="text-danger border-danger flex-shrink-0 rounded-sm border px-1.5 py-0.5 text-xs">
                    {t('Aucun acompte')}
                  </span>
                )}
              </div>

              <div className="w-28">
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                    couleursAssignes[c.assignee] ?? 'bg-muted text-muted-foreground',
                  )}
                >
                  {c.assignee}
                </span>
              </div>

              <div className="w-28">
                <span
                  className={cn('text-sm', enRetard ? 'text-danger font-bold' : 'text-foreground')}
                >
                  {c.livraison}
                </span>
              </div>

              <div className="w-28">
                <span
                  className={cn(
                    'bg-muted inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-medium',
                    texte,
                  )}
                >
                  <span className={cn('h-1.5 w-1.5 rounded-full', pastille)} aria-hidden />
                  {t(c.statut)}
                </span>
              </div>

              <div className="text-foreground w-28 text-right text-sm font-medium">
                {formatPrice(c.montant, 'F')}
              </div>

              <div className="flex w-10 justify-end">
                <ChevronRight size={14} className="text-muted-foreground" aria-hidden />
              </div>
            </a>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="border-border bg-surface flex items-center justify-between gap-3 border-t px-4 py-3 lg:px-6">
        <span className="text-muted-foreground text-xs">
          {t('Affichage {premiere}–{derniere} sur {total}', {
            premiere: filtrees.length === 0 ? 0 : debut + 1,
            derniere: debut + visibles.length,
            total: tp('{n} commande', '{n} commandes', filtrees.length),
          })}
          {/* La provenance est annoncée : des commandes d'exemple ne doivent
              jamais passer pour le carnet réel de l'atelier. */}
          {source === 'demonstration' && <span className="text-warning ml-1.5">· exemples</span>}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageSure === 1}
            aria-label={t('Page précédente')}
            className="text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md disabled:opacity-40"
          >
            <ChevronLeft size={14} aria-hidden />
          </button>

          {Array.from({ length: nbPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              aria-current={p === pageSure ? 'page' : undefined}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium',
                p === pageSure
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(nbPages, p + 1))}
            disabled={pageSure === nbPages}
            aria-label={t('Page suivante')}
            className="text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md disabled:opacity-40"
          >
            <ChevronRight size={14} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
