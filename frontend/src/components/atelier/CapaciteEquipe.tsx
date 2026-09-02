'use client';

import Link from 'next/link';
import { Clock } from 'lucide-react';
import CapacityBar, { chargeArtisan } from '@/components/ui/CapacityBar';
import { useArtisans } from '@/lib/useArtisans';
import { cn } from '@/lib/utils';
import { useLangue } from '@/contexts/LangueContext';

export interface EtatBadge {
  chargement: boolean;
  /** Nombre d'artisans actifs. Zéro n'est pas « de la place », c'est personne. */
  effectif: number;
  /** Artisans qui ont encore des heures devant eux aujourd'hui. */
  disponibles: number;
  chargeGlobale: number;
}

export interface LibelleBadge {
  /**
   * Phrase française — c'est la clé du dictionnaire, pas le texte affiché.
   *
   * La fonction rendait la phrase toute faite, y compris son pluriel accordé à
   * la main (« 2 places disponibles »). Cette phrase-là ne pouvait pas se
   * traduire : elle arrivait à l'écran déjà écrite. On rend maintenant de quoi
   * la composer, et le composant la traduit.
   */
  cle: string;
  /** Forme plurielle, quand le libellé se décline. */
  clePluriel?: string;
  /** Nombre à injecter, quand il y en a un. */
  n?: number;
  /** Rouge : plus rien à donner aujourd'hui. */
  alerte: boolean;
}

/**
 * Ce qu'annonce la pastille de la barre haute.
 *
 * Extrait du composant pour être vérifiable seul. Le cas qui motive cette
 * extraction est l'atelier sans artisan : la condition de saturation exigeait
 * `effectif > 0`, si bien qu'un atelier vide tombait dans la branche « il reste
 * de la place ». La barre haute annonçait des disponibilités alors qu'il n'y
 * avait personne pour coudre — le pire des deux sens possibles.
 */
export function libelleBadge(etat: EtatBadge): LibelleBadge {
  if (etat.chargement) return { cle: 'Calcul…', alerte: false };
  if (etat.effectif === 0) return { cle: 'Aucun artisan', alerte: true };
  if (etat.chargeGlobale >= 100 || etat.disponibles === 0) {
    return { cle: 'Journée saturée', alerte: true };
  }
  // Le compte plutôt que « Places disponibles » : savoir s'il en reste une ou
  // quatre change ce qu'on accepte de promettre à un client au comptoir.
  return {
    cle: '{n} place disponible',
    clePluriel: '{n} places disponibles',
    n: etat.disponibles,
    alerte: false,
  };
}

export interface CapaciteEquipeProps {
  /**
   * `badge`    : la pastille « Journée saturée » de la barre haute.
   * `compacte` : les mini-barres du bandeau crème mobile.
   * `panneau`  : la colonne de droite du tableau de bord desktop.
   *
   * Un seul composant pour les trois : la charge se lit au même endroit, et
   * des copies finiraient par diverger — la barre haute annoncerait
   * « Places disponibles » au-dessus d'un panneau montrant tout le monde saturé.
   */
  variante: 'badge' | 'compacte' | 'panneau';
}

/**
 * Charge de l'équipe pour la journée.
 *
 * Composant client : le tableau de bord est rendu côté serveur (il exporte
 * `metadata`), or ces chiffres viennent de `/api/artisans` et changent à
 * chaque tâche affectée.
 *
 * Les heures ne sont plus celles du jeu d'exemple : elles sont sommées depuis
 * les tâches du jour, par artisan et rapportées à SA capacité — un apprenti à
 * 6 h n'est pas saturé au même seuil qu'un tailleur senior.
 */
export default function CapaciteEquipe({ variante }: CapaciteEquipeProps) {
  const { t, tp } = useLangue();
  const { artisans, chargement } = useArtisans();
  const equipe = artisans.filter((a) => a.actif);

  const satures = equipe.filter((a) => a.heuresAujourdhui >= a.capacite).length;
  const disponibles = equipe.length - satures;
  const heuresTotal = equipe.reduce((s, a) => s + a.capacite, 0);
  const heuresUtilisees = equipe.reduce((s, a) => s + a.heuresAujourdhui, 0);
  const chargeGlobale = heuresTotal > 0 ? Math.round((heuresUtilisees / heuresTotal) * 100) : 0;
  const atelierSature = chargeGlobale >= 100;

  // Le premier artisan qui a encore des heures devant lui. Remplace un libellé
  // figé qui annonçait une disponibilité sans jamais la calculer.
  const prochainDispo = [...equipe]
    .filter((a) => a.heuresAujourdhui < a.capacite)
    .sort((a, b) => a.heuresAujourdhui - b.heuresAujourdhui)[0];

  if (variante === 'badge') {
    // Le seuil se lit sur la charge globale, pas sur un décompte fixe de trois
    // artisans saturés : un atelier de deux personnes n'atteindrait jamais ce
    // chiffre et se croirait disponible en permanence.
    const badge = libelleBadge({
      chargement,
      effectif: equipe.length,
      disponibles,
      chargeGlobale,
    });
    const texte =
      badge.clePluriel !== undefined && badge.n !== undefined
        ? tp(badge.cle, badge.clePluriel, badge.n)
        : t(badge.cle);

    // Un lien, plus un `<span>`.
    //
    // La pastille est posée dans la barre haute, contre le bouton « Nouvelle
    // commande », avec la même forme et la même taille : elle se lit comme un
    // bouton et on clique dessus. Elle ne faisait rien. Le planning est la
    // suite naturelle — c'est là qu'on voit qui a des heures devant lui et
    // qu'on lui donne le travail.
    return (
      <Link
        href="/planning"
        title={
          chargement
            ? t('Calcul de la charge du jour…')
            : t('{utilisees} h engagées sur {total} h — voir le planning', {
                utilisees: heuresUtilisees,
                total: heuresTotal,
              })
        }
        className={cn(
          'flex items-center gap-2 rounded-md border px-3 py-1.5 transition-opacity hover:opacity-85',
          badge.alerte ? 'border-danger bg-danger' : 'border-success bg-success',
        )}
      >
        <span className="bg-background h-2 w-2 rounded-full" aria-hidden />
        <span className="text-background text-xs font-medium">{texte}</span>
      </Link>
    );
  }

  if (variante === 'compacte') {
    return (
      <>
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-background/70 text-xs">{t('Capacité du jour')}</span>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-bold',
              atelierSature ? 'bg-danger text-foreground' : 'bg-success text-background',
            )}
          >
            {chargement ? '…' : `${chargeGlobale}%`}
          </span>
        </div>

        <div
          className="bg-background/20 mb-3 h-2 overflow-hidden rounded-full"
          role="progressbar"
          aria-valuenow={chargeGlobale}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t('Charge globale de l’atelier')}
        >
          <div
            className={cn('h-full rounded-full', atelierSature ? 'bg-danger' : 'bg-success')}
            style={{ width: `${Math.min(chargeGlobale, 100)}%` }}
          />
        </div>

        {equipe.length === 0 ? (
          <p className="text-background/70 text-xs">
            {chargement ? t('Chargement…') : t('Aucun artisan — composez votre équipe.')}
          </p>
        ) : (
          <ul className="flex gap-1.5">
            {equipe.map((a) => {
              const { pourcentage, sature, alerte } = chargeArtisan(a.heuresAujourdhui, a.capacite);
              return (
                <li key={a.id} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="bg-background/20 flex h-8 w-full flex-col-reverse overflow-hidden rounded-sm"
                    title={`${a.nom} — ${a.heuresAujourdhui}/${a.capacite}h`}
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
        )}
      </>
    );
  }

  return (
    <>
      <div className="px-5">
        <h2 className="font-headings text-foreground mb-1 text-sm font-bold">
          {t('Capacité du jour')}
        </h2>
        <p className="text-muted-foreground mb-4 text-xs">
          {chargement
            ? t('Chargement…')
            : t('Équipe de {n} — d’après les tâches du jour', { n: equipe.length })}
        </p>

        <div className="mb-5 flex gap-3">
          <div className="bg-muted flex-1 rounded-lg p-3 text-center">
            <div className="font-headings text-danger text-2xl font-bold">{satures}</div>
            <div className="text-muted-foreground text-xs">{t('Saturés')}</div>
          </div>
          <div className="bg-muted flex-1 rounded-lg p-3 text-center">
            <div className="font-headings text-success text-2xl font-bold">{disponibles}</div>
            <div className="text-muted-foreground text-xs">{t('Disponibles')}</div>
          </div>
        </div>

        <div className="bg-primary/40 mb-4 h-px" />
      </div>

      <div className="flex-1 px-5">
        {equipe.length === 0 ? (
          <p className="text-muted-foreground text-xs">
            {chargement ? t('Chargement de l’équipe…') : t('Aucun artisan actif.')}
          </p>
        ) : (
          equipe.map((a) => (
            <CapacityBar
              key={a.id}
              nom={a.nom}
              role={a.role}
              initiales={a.initiales}
              heuresUtilisees={a.heuresAujourdhui}
              heuresTotal={a.capacite}
            />
          ))
        )}
      </div>

      <div className="border-border border-t px-5 pt-4">
        <div className="bg-muted rounded-lg p-3">
          <div className="mb-1 flex items-center gap-2">
            <Clock size={13} className="text-muted-foreground" aria-hidden />
            <span className="text-foreground text-xs font-medium">{t('Prochaine dispo')}</span>
          </div>
          {prochainDispo ? (
            <>
              <div className="text-primary text-sm font-bold">{prochainDispo.nom}</div>
              <div className="text-muted-foreground text-xs">
                {t('{n} h encore libres aujourd’hui', {
                  n: prochainDispo.capacite - prochainDispo.heuresAujourdhui,
                })}
              </div>
            </>
          ) : (
            <div className="text-muted-foreground text-xs">
              {equipe.length === 0
                ? t('Aucun artisan.')
                : t('Toute l’équipe est saturée aujourd’hui.')}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
