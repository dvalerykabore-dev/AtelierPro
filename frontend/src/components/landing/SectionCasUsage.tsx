import { CAS_USAGE } from '@/lib/landing-contenu';

/**
 * Trois profils d'atelier.
 *
 * Les chiffres de la ligne « résultat » viennent des maquettes et ne sont
 * adossés à aucune mesure — voir l'avertissement en tête de
 * `lib/landing-contenu.ts`.
 */
export default function SectionCasUsage() {
  return (
    <section className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-6 max-w-2xl text-center lg:mb-12">
          <h2 className="font-headings mb-2 text-2xl font-bold sm:text-3xl lg:mb-3 lg:text-4xl">
            Pour tout type d’atelier
          </h2>
          <p className="text-muted-foreground text-xs sm:text-base lg:text-lg">
            Que vous cousiez seul ou que vous meniez une équipe de dix personnes.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3 md:gap-5">
          {CAS_USAGE.map((c) => (
            <div
              key={c.titre}
              className="border-border bg-surface rounded-lg border p-4 sm:rounded-xl sm:p-6"
            >
              <h3 className="text-foreground mb-1 text-sm font-bold sm:mb-2 sm:text-base">
                {c.titre}
              </h3>
              <p className="text-muted-foreground mb-3 text-xs sm:mb-4 sm:text-sm">
                {c.description}
              </p>
              <div className="border-border bg-background rounded-lg border px-2.5 py-2 sm:px-3">
                <div className="text-muted-foreground text-xs">{c.mesure}</div>
                <div className="text-primary text-sm font-bold">{c.resultat}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
