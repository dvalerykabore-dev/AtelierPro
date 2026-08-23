import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ANCRES, FONCTIONNALITES } from '@/lib/landing-contenu';

/**
 * Les six fonctions de l'atelier.
 *
 * Chaque carte est un lien vers l'écran qu'elle décrit : la promesse est
 * vérifiable d'un clic, ce qui est le seul argument commercial honnête dont
 * dispose une page d'accueil. Hors session, ces écrans s'ouvrent sur l'atelier
 * d'exemple et l'annoncent — le visiteur voit la vraie interface, pas une
 * capture retouchée.
 *
 * Empilement en une colonne sur téléphone (maquette mobile), deux à partir de
 * `sm`, trois en desktop.
 */
export default function SectionFonctionnalites() {
  return (
    <section
      id={ANCRES.fonctionnalites}
      className="bg-surface scroll-mt-20 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-6 max-w-2xl text-center lg:mb-12">
          <h2 className="font-headings mb-2 text-2xl font-bold sm:text-3xl lg:mb-3 lg:text-4xl">
            Tout ce qu’un atelier a besoin de retenir
          </h2>
          <p className="text-muted-foreground text-xs sm:text-base lg:text-lg">
            De la prise de commande à la livraison. Touchez une carte pour voir l’écran
            correspondant.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {FONCTIONNALITES.map((f) => {
            const Icone = f.icone;
            return (
              <Link
                key={f.href}
                href={f.href}
                className="border-border bg-background hover:border-primary group flex flex-col rounded-lg border p-4 transition-colors sm:rounded-xl sm:p-6"
              >
                <span className="bg-primary/10 text-primary mb-2 flex h-8 w-8 items-center justify-center rounded-lg sm:mb-3 sm:h-10 sm:w-10">
                  <Icone className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
                </span>
                <h3 className="text-foreground mb-1 text-sm font-bold sm:mb-2 sm:text-base">
                  {f.titre}
                </h3>
                <p className="text-muted-foreground mb-3 flex-1 text-xs sm:mb-4 sm:text-sm">
                  {f.description}
                </p>
                <span className="text-primary flex items-center gap-1.5 text-xs font-medium sm:text-sm">
                  {f.lienLabel}
                  <ArrowRight
                    className="h-3 w-3 transition-transform group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5"
                    aria-hidden
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
