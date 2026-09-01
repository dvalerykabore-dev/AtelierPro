import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import VisuelHero from '@/components/landing/VisuelHero';
import { CHIFFRES_CLES } from '@/lib/landing-contenu';

/**
 * Premier écran de la page publique — deux maquettes Banani fusionnées.
 *
 * L'ordre change d'un format à l'autre, et ce n'est pas cosmétique : sur
 * téléphone la maquette place le visuel **entre** le texte et les boutons,
 * alors que le desktop le met en colonne de droite. D'où le placement explicite
 * en grille à partir de `lg` plutôt qu'un simple empilement.
 *
 * Un écart assumé avec les deux maquettes : le panneau annonçait
 * « App iOS & Android ». AtelierPro est un site web — il n'existe aucune
 * application à télécharger. La formulation a été corrigée plutôt que
 * reproduite, une promesse fausse en haut de page d'accueil étant une dette
 * qui se paie au premier client. Le panneau étant devenu la carte de marque,
 * ce « rien à installer » a rejoint la ligne de réassurance sous le titre :
 * c'est la correction qu'il faut garder, pas l'encadré qui la portait.
 */
export default function SectionHero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-24">
      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
        <div className="mb-6 lg:col-start-1 lg:row-start-1 lg:mb-0">
          <h1 className="font-headings mb-3 text-3xl leading-tight font-bold sm:text-4xl lg:mb-6 lg:text-5xl">
            Votre atelier, enfin tenu au clair
          </h1>
          <p className="text-muted-foreground mb-2 text-sm sm:text-base lg:mb-3 lg:text-lg">
            Commandes, mesures, acomptes, planning de l’équipe. AtelierPro rassemble ce qui vit
            aujourd’hui dans des carnets, des SMS et de la mémoire.
          </p>
          <p className="text-muted-foreground mb-4 text-xs sm:text-sm lg:mb-0 lg:text-base">
            Trente jours d’essai gratuit. Sans carte bancaire. En français, dans le navigateur —
            rien à installer.
          </p>
        </div>

        {/* Carte de marque. Sur téléphone elle s'intercale entre le texte et
            les boutons ; à partir de `lg` elle occupe la colonne de droite sur
            les deux rangées. */}
        <div className="mb-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mb-0 lg:self-center">
          <VisuelHero />
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <Link
              href="/inscription"
              className="bg-primary text-primary-foreground hover:bg-accent flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-bold transition-colors sm:px-6 sm:text-base"
            >
              Créer mon atelier
            </Link>
            <Link
              href="/dashboard"
              className="border-primary text-primary hover:bg-primary/10 flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 text-xs font-medium transition-colors sm:px-5 sm:text-sm"
            >
              Parcourir la démonstration
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden />
            </Link>
          </div>
          <p className="text-muted-foreground mt-2 text-xs lg:mt-3">
            La démonstration ouvre l’application remplie d’un atelier d’exemple. Aucune inscription
            n’est demandée.
          </p>
        </div>
      </div>

      {/* Bandeau de chiffres — lignes horizontales sur téléphone (icône à
          gauche, valeur et libellé à droite), colonnes centrées à partir de
          `sm`. Les deux maquettes divergent ici, la structure suit. */}
      <div className="border-border mt-8 flex flex-col gap-3 border-t pt-6 sm:mt-12 sm:grid sm:grid-cols-3 sm:gap-8 sm:pt-12 lg:mt-16 lg:pt-16">
        {CHIFFRES_CLES.map((c) => {
          const Icone = c.icone;
          return (
            <div key={c.label} className="flex items-center gap-3 sm:flex-col sm:gap-0">
              <span className="bg-muted inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg sm:mb-3 sm:h-12 sm:w-12">
                <Icone className="text-primary h-4.5 w-4.5 sm:h-5.5 sm:w-5.5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1 sm:flex-none sm:text-center">
                <div className="font-headings text-foreground text-lg font-bold sm:mb-1 sm:text-3xl">
                  {c.valeur}
                </div>
                <div className="text-muted-foreground text-xs sm:text-sm">{c.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
