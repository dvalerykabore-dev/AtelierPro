'use client';

import { Banknote, Calendar, Clock, Lock, Package, TriangleAlert } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import StatTile from '@/components/ui/StatTile';
import { useRapports } from '@/lib/useRapports';
import { cn, formatPrice } from '@/lib/utils';
import { useLangue } from '@/contexts/LangueContext';

/** Hauteur maximale de l'histogramme, en pixels (comme la maquette). */
const HAUTEUR_BARRE = 120;

/** Couleurs de la barre empilée des paiements, dans l'ordre du serveur. */
const COULEURS_PAIEMENT = ['bg-success', 'bg-warning', 'bg-danger'];

/** Un indicateur sans donnée s'affiche « — » plutôt qu'un zéro trompeur. */
function ouTiret(valeur: number | null, suffixe = ''): string {
  return valeur === null ? '—' : `${valeur}${suffixe}`;
}

/** « 1 commande » / « 4 commandes » — le pluriel automatique de « 1 commandes ». */
function pluriel(nombre: number, mot: string): string {
  return `${nombre} ${mot}${nombre > 1 ? 's' : ''}`;
}

export default function Rapports() {
  const { t, tp } = useLangue();
  const { rapports, source, chargement, erreur } = useRapports();

  if (chargement) {
    return (
      <p className="text-muted-foreground p-12 text-center text-sm">
        {t('Calcul des indicateurs…')}
      </p>
    );
  }

  // Aucun repli sur des données d'exemple : un chiffre d'affaires inventé serait
  // le pire mensonge de cette interface.
  if (source === 'demonstration') {
    return (
      <div className="flex flex-col items-center gap-3 p-12 text-center">
        <Lock size={24} className="text-muted-foreground" aria-hidden />
        <p className="text-foreground text-sm font-medium">{t('Indicateurs indisponibles')}</p>
        <p className="text-muted-foreground max-w-md text-xs">
          {t(
            'Les rapports se calculent depuis vos commandes réelles. Connectez-vous pour les consulter — afficher des chiffres d’exemple ici induirait en erreur.',
          )}
        </p>
      </div>
    );
  }

  if (erreur || !rapports) {
    return (
      <p className="text-danger flex items-center justify-center gap-2 p-12 text-center text-sm">
        <TriangleAlert size={15} aria-hidden />
        {erreur ?? 'Indicateurs indisponibles.'}
      </p>
    );
  }

  const { indicateurs, chiffreAffairesMensuel, tenuesPopulaires, performancesArtisans } = rapports;
  const maximum = Math.max(...chiffreAffairesMensuel.map((m) => m.chiffreAffaires), 1);
  const totalSemestre = chiffreAffairesMensuel.reduce((s, m) => s + m.chiffreAffaires, 0);

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-8">
      {/* Indicateurs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* `enHausse` reste neutre partout où la mention n'est pas une
            variation : « 19 commandes » en vert laisserait croire à une
            hausse qui n'a jamais été calculée. Seule la ponctualité se juge. */}
        <StatTile
          label={t('Chiffre d’affaires du mois')}
          valeur={formatPrice(indicateurs.chiffreAffairesMois, 'F')}
          icone={Banknote}
          tendance={pluriel(indicateurs.totalCommandes, 'commande')}
        />
        <StatTile
          label={t('Commandes livrées')}
          valeur={String(indicateurs.commandesLivrees)}
          icone={Package}
          tendance={`sur ${indicateurs.totalCommandes}`}
        />
        <StatTile
          label={t('Livraison à temps')}
          valeur={ouTiret(indicateurs.tauxPonctualite, ' %')}
          icone={Clock}
          tendance={indicateurs.tauxPonctualite === null ? 'non mesurable' : 'des livraisons'}
          enHausse={indicateurs.tauxPonctualite === null ? null : indicateurs.tauxPonctualite >= 80}
        />
        <StatTile
          label={t('Délai moyen')}
          valeur={ouTiret(indicateurs.delaiMoyenJours, ' j')}
          icone={Calendar}
          tendance={
            indicateurs.delaiMoyenJours === null ? 'non mesurable' : 'de la commande à la livraison'
          }
        />
      </div>

      <div className="flex flex-col gap-4 xl:flex-row">
        {/* Chiffre d'affaires mensuel */}
        <section className="bg-surface border-border flex-1 rounded-lg border p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-headings text-foreground text-sm font-bold">
              {t('Chiffre d’affaires mensuel')}
            </h2>
            <span className="text-muted-foreground text-xs">6 derniers mois · F CFA</span>
          </div>

          <ul className="flex items-end gap-3" style={{ height: HAUTEUR_BARRE + 40 }}>
            {chiffreAffairesMensuel.map((m) => (
              <li key={m.label} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-muted-foreground text-xs">
                  {m.chiffreAffaires > 0 ? `${Math.round(m.chiffreAffaires / 1000)}k` : '—'}
                </span>
                {/* Écart au design Banani : les mois passés y étaient en
                    `bg-muted`, indiscernables du fond. `bg-secondary` permet de
                    comparer, ce qui est tout l'objet du graphique. */}
                <div
                  className={cn('w-full rounded-sm', m.courant ? 'bg-primary' : 'bg-secondary')}
                  style={{ height: Math.round((m.chiffreAffaires / maximum) * HAUTEUR_BARRE) }}
                  title={`${t(m.label)} : ${formatPrice(m.chiffreAffaires, 'F')} · ${tp('{n} commande', '{n} commandes', m.commandes)}`}
                />
                <span
                  className={cn(
                    'text-xs font-medium',
                    m.courant ? 'text-primary' : 'text-muted-foreground',
                  )}
                >
                  {t(m.label)}
                </span>
              </li>
            ))}
          </ul>

          <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
            <span className="text-muted-foreground text-xs">{t('Total 6 mois')}</span>
            <span className="text-primary text-sm font-bold">
              {formatPrice(totalSemestre, 'F CFA')}
            </span>
          </div>
        </section>

        {/* Tenues les plus commandées */}
        <section className="bg-surface border-border rounded-lg border p-5 xl:w-80">
          <h2 className="font-headings text-foreground mb-5 text-sm font-bold">
            {t('Tenues les plus commandées')}
          </h2>
          {tenuesPopulaires.length === 0 ? (
            <p className="text-muted-foreground text-xs">{t('Aucune commande enregistrée.')}</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {tenuesPopulaires.map((tenue) => (
                <li key={tenue.label}>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <span className="text-foreground truncate text-xs">{tenue.label}</span>
                    <span className="text-muted-foreground flex-shrink-0 text-xs">
                      {tenue.nombre}
                    </span>
                  </div>
                  <div className="bg-muted h-2 overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${tenue.pourcentage}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row">
        {/* Performance par artisan */}
        <section className="bg-surface border-border flex-1 overflow-hidden rounded-lg border">
          <div className="border-border border-b px-5 py-3">
            <h2 className="font-headings text-foreground text-sm font-bold">
              {t('Performance par artisan')}
            </h2>
          </div>

          {performancesArtisans.length === 0 ? (
            <p className="text-muted-foreground px-5 py-6 text-xs">
              {t('Aucune commande assignée pour l’instant.')}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-100">
                <thead>
                  <tr className="border-border bg-muted border-b">
                    <th className="text-muted-foreground px-5 py-2 text-left text-xs font-normal tracking-wide uppercase">
                      {t('Artisan')}
                    </th>
                    <th className="text-muted-foreground px-3 py-2 text-right text-xs font-normal tracking-wide uppercase">
                      {t('Commandes')}
                    </th>
                    <th className="text-muted-foreground px-5 py-2 text-right text-xs font-normal tracking-wide uppercase">
                      {t('CA généré')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {performancesArtisans.map((p) => (
                    <tr key={p.initiales} className="border-border border-b last:border-b-0">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar initiales={p.initiales} taille="sm" />
                          <span className="text-foreground text-sm font-medium">{p.initiales}</span>
                        </div>
                      </td>
                      <td className="text-foreground px-3 py-3 text-right text-sm">
                        {p.commandes}
                      </td>
                      <td className="text-foreground px-5 py-3 text-right text-sm font-medium">
                        {formatPrice(p.chiffreAffaires, 'F')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Répartition des paiements */}
        <section className="bg-surface border-border rounded-lg border p-5 xl:w-80">
          <h2 className="font-headings text-foreground mb-4 text-sm font-bold">
            {t('Statut des paiements')}
          </h2>

          <div className="bg-muted mb-4 flex h-3 overflow-hidden rounded-full">
            {rapports.repartitionPaiements.map((p, i) => (
              <div
                key={p.label}
                className={COULEURS_PAIEMENT[i] ?? 'bg-muted'}
                style={{ width: `${p.pourcentage}%` }}
                title={`${t(p.label)} : ${tp('{n} commande', '{n} commandes', p.nombre)}`}
              />
            ))}
          </div>

          <ul className="flex flex-col gap-2.5">
            {rapports.repartitionPaiements.map((p, i) => (
              <li key={p.label} className="flex items-center gap-2.5">
                <span
                  className={cn(
                    'h-3 w-3 flex-shrink-0 rounded-sm',
                    COULEURS_PAIEMENT[i] ?? 'bg-muted',
                  )}
                  aria-hidden
                />
                <span className="text-foreground flex-1 text-xs">{t(p.label)}</span>
                <span className="text-muted-foreground text-xs">{p.nombre}</span>
                <span className="text-foreground w-10 text-right text-xs font-medium">
                  {p.pourcentage} %
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
