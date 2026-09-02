'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { ANCRES, PLANS_TARIFAIRES } from '@/lib/landing-contenu';
import { cn } from '@/lib/utils';
import { useT } from '@/contexts/LangueContext';

/**
 * Grille tarifaire.
 *
 * ⚠️ Aucun paiement n'est branché dans l'application : ces montants ne sont
 * prélevés nulle part. Le bouton mène à l'inscription en transmettant le plan
 * choisi (`?plan=`), que l'écran d'inscription affiche — il n'annonce ni
 * prélèvement ni engagement, faute de facturation à laquelle se raccrocher.
 *
 * ⚠️ Écart avec la maquette mobile, délibéré : elle ne montre que les trois
 * premières lignes de chaque plan (`features.slice(0, 3)`). Ce qui distingue
 * les plans se trouve précisément dans les lignes suivantes ; les tronquer
 * demande au visiteur de choisir sans voir ce qu'il achète, et il est sur
 * téléphone dans la majorité des cas. La liste est donc complète partout.
 */
export default function SectionTarifs() {
  const t = useT();
  return (
    <section
      id={ANCRES.tarifs}
      className="bg-surface scroll-mt-20 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-6 max-w-2xl text-center lg:mb-12">
          <h2 className="font-headings mb-2 text-2xl font-bold sm:text-3xl lg:mb-3 lg:text-4xl">
            {t('Des tarifs lisibles')}
          </h2>
          <p className="text-muted-foreground text-xs sm:text-base lg:text-lg">
            {t('Trente jours d’essai sur tous les plans. Sans engagement.')}
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3 md:items-start md:gap-5">
          {PLANS_TARIFAIRES.map((p) => (
            <div
              key={p.cle}
              className={cn(
                'bg-background flex flex-col rounded-lg border-2 p-4 sm:rounded-xl sm:p-6 lg:p-8',
                p.populaire ? 'border-primary' : 'border-border',
              )}
            >
              {p.populaire && (
                <span className="bg-primary text-primary-foreground mb-2 inline-block self-start rounded-full px-2 py-0.5 text-xs font-bold sm:mb-4 sm:px-3 sm:py-1">
                  {t('Le plus choisi')}
                </span>
              )}
              <h3 className="text-foreground text-base font-bold sm:mb-1 sm:text-xl">{t(p.nom)}</h3>
              <p className="text-muted-foreground mb-2 text-xs sm:mb-4 sm:text-sm">
                {t(p.description)}
              </p>
              <p className="mb-3 sm:mb-6">
                <span className="font-headings text-foreground text-2xl font-bold sm:text-3xl">
                  {t(p.prix)}
                </span>
                <span className="text-muted-foreground text-xs sm:text-sm">{t(p.periode)}</span>
              </p>

              <Link
                href={p.surDevis ? `#${ANCRES.contact}` : `/inscription?plan=${p.cle}`}
                className={cn(
                  'mb-3 flex min-h-11 items-center justify-center rounded-lg text-xs font-bold transition-colors sm:mb-6 sm:text-sm',
                  p.populaire
                    ? 'bg-primary text-primary-foreground hover:bg-accent'
                    : 'border-border text-foreground hover:bg-muted border',
                )}
              >
                {p.surDevis ? t('Nous écrire') : t('Commencer l’essai')}
              </Link>

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
          ))}
        </div>

        <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-center text-xs sm:mt-8">
          {t(
            'Le paiement en ligne n’est pas encore ouvert : l’essai démarre sans moyen de paiement, et nous vous contactons avant tout prélèvement.',
          )}
        </p>
      </div>
    </section>
  );
}
