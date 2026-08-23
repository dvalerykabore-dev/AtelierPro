'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { ANCRES, QUESTIONS } from '@/lib/landing-contenu';

/**
 * Questions fréquentes — accordéon réel.
 *
 * Les deux maquettes dessinaient un « + » à côté de chaque question mais
 * laissaient toutes les réponses dépliées : l'icône ne servait à rien. Pire,
 * la maquette mobile bornait chaque réponse à `max-h-20 overflow-hidden`, ce
 * qui coupe le texte en plein milieu d'une phrase.
 *
 * Ici l'en-tête est un vrai bouton, il porte `aria-expanded`, et le panneau
 * n'est pas seulement masqué visuellement — il est retiré du document, donc de
 * la tabulation et des lecteurs d'écran. Ouvert, il montre la réponse entière.
 *
 * Une seule réponse à la fois : sur un écran de téléphone, cinq réponses
 * ouvertes obligent à faire défiler la page pour retrouver la question
 * suivante.
 */
export default function SectionFaq() {
  const [ouverte, setOuverte] = useState<number | null>(null);

  return (
    <section id={ANCRES.faq} className="scroll-mt-20 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-headings mb-6 text-center text-2xl font-bold sm:text-3xl lg:mb-12 lg:text-4xl">
          Questions fréquentes
        </h2>

        <div className="flex flex-col gap-2 sm:gap-3">
          {QUESTIONS.map((q, i) => {
            const active = ouverte === i;
            return (
              <div key={q.question} className="border-border overflow-hidden rounded-lg border">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOuverte(active ? null : i)}
                    aria-expanded={active}
                    aria-controls={`faq-reponse-${i}`}
                    id={`faq-question-${i}`}
                    className="bg-surface hover:bg-muted flex min-h-12 w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors sm:gap-4 sm:px-6"
                  >
                    <span className="text-foreground text-xs font-bold sm:text-base">
                      {q.question}
                    </span>
                    {active ? (
                      <Minus
                        className="text-primary h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4"
                        aria-hidden
                      />
                    ) : (
                      <Plus
                        className="text-muted-foreground h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4"
                        aria-hidden
                      />
                    )}
                  </button>
                </h3>
                {active && (
                  <div
                    id={`faq-reponse-${i}`}
                    role="region"
                    aria-labelledby={`faq-question-${i}`}
                    className="bg-background text-muted-foreground px-4 py-3 text-xs sm:px-6 sm:py-4 sm:text-sm"
                  >
                    {q.reponse}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
