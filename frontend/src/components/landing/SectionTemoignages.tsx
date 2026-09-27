'use client';

import Avatar from '@/components/ui/Avatar';
import { ANCRES, TEMOIGNAGES } from '@/lib/landing-contenu';
import { useT } from '@/contexts/LangueContext';

/**
 * Témoignages.
 *
 * ⚠️ Les trois citations sortent du générateur de maquette : personne ne les a
 * prononcées. Voir l'avertissement en tête de `lib/landing-contenu.ts`.
 *
 * La section se retire d'elle-même si le tableau est vidé — retirer de faux
 * avis doit rester une opération d'une ligne, sans toucher à la mise en page.
 */
export default function SectionTemoignages() {
  const t = useT();
  if (TEMOIGNAGES.length === 0) return null;

  return (
    <section
      id={ANCRES.temoignages}
      className="bg-foreground text-background scroll-mt-20 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-6 max-w-2xl text-center lg:mb-12">
          <h2 className="font-headings mb-2 text-2xl font-bold sm:text-3xl lg:mb-3 lg:text-4xl">
            {t('Ce que disent les tailleurs')}
          </h2>
          <p className="text-background/70 text-xs sm:text-base lg:text-lg">
            {t('Des ateliers qui ont troqué le carnet contre l’écran.')}
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3 md:gap-5">
          {TEMOIGNAGES.map((avis) => (
            <figure
              key={avis.nom}
              className="bg-background/10 rounded-lg p-4 backdrop-blur sm:rounded-xl sm:p-6"
            >
              <blockquote className="mb-3 text-sm leading-relaxed sm:mb-4 sm:text-base">
                « {avis.texte} »
              </blockquote>
              <figcaption className="flex items-center gap-2 sm:gap-3">
                {/* `cn` passe par tailwind-merge : la classe donnée ici l'emporte
                    sur celle de la taille, d'où le 32px de la maquette mobile. */}
                <Avatar
                  initiales={avis.initiales}
                  taille="md"
                  className="h-8 w-8 sm:h-10 sm:w-10"
                />
                <span className="min-w-0">
                  <span className="block truncate text-xs font-bold sm:text-sm">{avis.nom}</span>
                  <span className="text-background/70 block truncate text-xs">{avis.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
