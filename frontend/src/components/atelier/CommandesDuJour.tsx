'use client';

import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import OrderCard from '@/components/atelier/OrderCard';
import { useCommandes } from '@/lib/useCommandes';
import { useT } from '@/contexts/LangueContext';

/**
 * Commandes en cours du tableau de bord — cartes sur mobile, tableau sur desktop.
 *
 * Extrait de la page pour pouvoir lire `/api/commandes` : le tableau de bord
 * reste un composant serveur, seule cette portion a besoin d'être cliente.
 *
 * Les commandes livrées sont écartées : le tableau de bord montre l'activité du
 * jour, l'historique se consulte depuis /commandes.
 */
export default function CommandesDuJour() {
  const t = useT();
  const { commandes, source, chargement } = useCommandes();
  const enCours = commandes.filter((c) => c.statut !== 'Livré');

  return (
    <>
      {/* ---------- Mobile ---------- */}
      <section className="lg:hidden" aria-label={t('Commandes du jour')}>
        <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-2">
          <h2 className="font-headings text-foreground text-sm font-bold">
            Commandes du jour
            {source === 'demonstration' && (
              <span className="text-warning ml-1.5 font-normal">· exemples</span>
            )}
          </h2>
          <Link
            href="/commandes/nouvelle"
            className="bg-primary text-primary-foreground flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium"
          >
            <Plus size={12} aria-hidden />
            {t('Nouvelle')}
          </Link>
        </div>

        {enCours.length === 0 ? (
          <p className="text-muted-foreground px-4 py-8 text-center text-xs">
            {chargement ? 'Chargement…' : 'Aucune commande en cours.'}
          </p>
        ) : (
          <ul className="grid gap-2 px-4 pb-4 sm:grid-cols-2">
            {enCours.map((c) => (
              <li key={c.id}>
                <OrderCard commande={c} variante="carte" href={`/commandes/${c.id}`} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ---------- Desktop ---------- */}
      <section
        className="bg-surface border-border hidden flex-1 overflow-hidden rounded-lg border lg:block"
        aria-label={t('Commandes en cours')}
      >
        <div className="border-border flex items-center justify-between border-b px-4 py-3">
          <h2 className="font-headings text-foreground text-sm font-bold">
            Commandes en cours
            {source === 'demonstration' && (
              <span className="text-warning ml-1.5 font-normal">· exemples</span>
            )}
          </h2>
          <div className="flex items-center gap-2">
            <span className="bg-muted flex items-center gap-1 rounded-md px-3 py-1.5">
              <Search size={13} className="text-muted-foreground" aria-hidden />
              <span className="text-muted-foreground text-xs">Rechercher…</span>
            </span>
            <Link href="/commandes" className="text-primary text-xs font-medium">
              {t('Voir tout')}
            </Link>
          </div>
        </div>

        {/* Entêtes de colonnes */}
        <div className="border-border flex items-center gap-3 border-b px-4 py-2">
          <div className="w-2 flex-shrink-0" />
          <div className="text-muted-foreground flex-1 text-xs tracking-wide uppercase">
            {t('Client / Tenue')}
          </div>
          <div className="text-muted-foreground w-20 text-xs tracking-wide uppercase">
            {t('Statut')}
          </div>
          <div className="text-muted-foreground w-16 text-right text-xs tracking-wide uppercase">
            {t('Livraison')}
          </div>
          <div className="w-7 flex-shrink-0" />
        </div>

        {enCours.length === 0 ? (
          <p className="text-muted-foreground px-4 py-10 text-center text-sm">
            {chargement ? 'Chargement des commandes…' : 'Aucune commande en cours.'}
          </p>
        ) : (
          enCours.map((c) => (
            <OrderCard key={c.id} commande={c} variante="ligne" href={`/commandes/${c.id}`} />
          ))
        )}
      </section>
    </>
  );
}
