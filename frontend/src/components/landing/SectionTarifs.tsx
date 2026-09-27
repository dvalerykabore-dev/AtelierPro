'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { ANCRES, PLANS_TARIFAIRES } from '@/lib/landing-contenu';
import {
  FORMULES,
  definitionDe,
  formaterFcfa,
  moisOfferts,
  prixDe,
  prixMensuelEquivalent,
  type Formule,
} from '@/lib/plans';
import { cn } from '@/lib/utils';
import { useLangue } from '@/contexts/LangueContext';

/**
 * Grille tarifaire — quatre paliers, trois formules de règlement.
 *
 * Les montants ne sont pas écrits ici : ils sortent de `lib/plans.ts`, le même
 * module que lisent les gardes de route. Une grille et un serveur qui ne disent
 * pas la même chose, c'est un client qui paie pour un écran resté fermé.
 *
 * ⚠️ L'encaissement n'est pas branché. Le bouton mène à l'inscription en
 * transmettant le palier choisi ; une mention sous la grille le dit, à retirer
 * le jour où Bictorys sera câblé.
 */

/** Le trimestre plutôt que le mois : douze prélèvements, c'est douze occasions de partir. */
const FORMULE_DEFAUT: Formule = 'trimestre';

const ONGLETS: Readonly<Record<Formule, string>> = {
  mois: 'Au mois',
  trimestre: 'Au trimestre',
  annee: 'À l’année',
};

export default function SectionTarifs() {
  const { t, tp } = useLangue();
  const [formule, setFormule] = useState<Formule>(FORMULE_DEFAUT);

  return (
    <section
      id={ANCRES.tarifs}
      className="bg-surface scroll-mt-20 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-6 max-w-2xl text-center lg:mb-10">
          <h2 className="font-headings mb-2 text-2xl font-bold sm:text-3xl lg:mb-3 lg:text-4xl">
            {t('Des tarifs lisibles')}
          </h2>
          <p className="text-muted-foreground text-xs sm:text-base lg:text-lg">
            {t(
              'Le carnet est gratuit, sans limite de durée. Vous ne payez que le jour où l’atelier grandit.',
            )}
          </p>
        </div>

        {/* Choix de la formule. Le trimestre est présélectionné : c'est celui
            qu'on recommande, et un choix par défaut vaut mieux qu'un menu. */}
        <div className="mb-6 flex justify-center lg:mb-10">
          <div
            role="radiogroup"
            aria-label={t('Formule de règlement')}
            className="border-border bg-background inline-flex rounded-lg border p-1"
          >
            {FORMULES.map((f) => {
              const actif = f === formule;
              const offert = moisOfferts(f);
              return (
                <button
                  key={f}
                  type="button"
                  role="radio"
                  aria-checked={actif}
                  onClick={() => setFormule(f)}
                  className={cn(
                    'flex min-h-11 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors sm:px-4 sm:text-sm',
                    actif
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {t(ONGLETS[f])}
                  {offert > 0 && (
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                        actif ? 'bg-primary-foreground/15' : 'bg-primary/10 text-primary',
                      )}
                    >
                      {/*
                        « −½ mois » / « −3 mois » : la remise se vérifie de tête.

                        Deux valeurs passées séparément, et ce n'est pas une
                        coquetterie. « mois » est invariable en français, si
                        bien qu'un simple `t('mois')` rendait « ½ meses » en
                        espagnol et « ½ meses » en portugais — agrammatical :
                        une demie prend le singulier. C'est donc `1` qui
                        détermine la forme quand la remise est d'une demie,
                        pendant que `{n}` affiche « ½ ». `Intl.PluralRules` ne
                        peut pas trancher à notre place : il range 0,5 sous
                        « other », soit le pluriel.
                      */}
                      {tp('−{n} mois', '−{n} mois', offert < 1 ? 1 : offert, {
                        n: offert === 0.5 ? '½' : offert,
                      })}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:items-start">
          {PLANS_TARIFAIRES.map((p) => {
            const def = definitionDe(p.cle);
            const gratuit = def.prixMensuel === 0;
            const montant = prixDe(p.cle, formule);
            const parMois = prixMensuelEquivalent(p.cle, formule);

            return (
              <div
                key={p.cle}
                className={cn(
                  'bg-background flex flex-col rounded-lg border-2 p-4 sm:rounded-xl sm:p-6',
                  p.populaire ? 'border-primary' : 'border-border',
                )}
              >
                {p.populaire && (
                  <span className="bg-primary text-primary-foreground mb-2 inline-block self-start rounded-full px-2 py-0.5 text-xs font-bold sm:mb-3 sm:px-3 sm:py-1">
                    {t('Le plus choisi')}
                  </span>
                )}

                <h3 className="text-foreground text-base font-bold sm:text-lg">
                  <span aria-hidden>{def.emoji}</span> {t(def.nom)}
                </h3>
                <p className="text-muted-foreground mb-3 text-xs sm:mb-4 sm:text-sm">
                  {t(def.these)}
                </p>

                <p className="mb-1">
                  <span className="font-headings text-foreground text-2xl font-bold sm:text-3xl">
                    {gratuit ? t('Gratuit') : formaterFcfa(montant)}
                  </span>
                </p>
                {/* Sous le montant encaissé, ce qu'il revient au mois — sans ça,
                    « 45 000 F » se compare mal à « 2 000 F ». */}
                <p className="text-muted-foreground mb-4 h-4 text-xs">
                  {gratuit
                    ? t('Pour toujours')
                    : formule === 'mois'
                      ? t('par mois')
                      : `${formaterFcfa(parMois)} ${t('par mois')}`}
                </p>

                <Link
                  href={`/inscription?plan=${p.cle}`}
                  className={cn(
                    'mb-4 flex min-h-11 items-center justify-center rounded-lg text-xs font-bold transition-colors sm:text-sm',
                    p.populaire
                      ? 'bg-primary text-primary-foreground hover:bg-accent'
                      : 'border-border text-foreground hover:bg-muted border',
                  )}
                >
                  {gratuit ? t('Créer mon atelier') : t('Choisir ce palier')}
                </Link>

                {p.herite && (
                  <p className="text-muted-foreground mb-2 font-mono text-[10px] tracking-widest uppercase">
                    {t(p.herite)}
                  </p>
                )}
                <ul className="flex flex-col gap-1 sm:gap-2">
                  {p.inclus.map((i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs sm:gap-2 sm:text-sm">
                      <Check
                        className="text-primary mt-0.5 h-3 w-3 flex-shrink-0 sm:mt-1 sm:h-3.5 sm:w-3.5"
                        aria-hidden
                      />
                      <span>{t(i)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="text-muted-foreground mx-auto mt-6 flex max-w-2xl flex-col gap-2 text-center text-xs sm:mt-8">
          <p>
            {t(
              'Le trimestre offre un demi-mois, l’année offre trois mois. Aucun prélèvement automatique : vous payez, la date recule.',
            )}
          </p>
          <p>
            {t(
              'Le paiement en ligne n’est pas encore ouvert. Créez votre atelier gratuitement : nous vous contactons avant tout encaissement.',
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
