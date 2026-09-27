'use client';

import PageLegale from '@/components/landing/PageLegale';
import { useT } from '@/contexts/LangueContext';

/**
 * Corps de la page, isolé du module `page.tsx`.
 *
 * La page exporte `metadata`, que Next résout sur le serveur : elle ne peut
 * donc pas être marquée `'use client'`, et ce texte a besoin de `useT`.
 */
export default function Contenu() {
  const t = useT();
  return (
    <PageLegale titre={t('Conditions d’utilisation')}>
      <p>
        {t(
          'Ce document n’est pas encore rédigé. Il le sera avant l’ouverture des inscriptions payantes, et cette page portera alors le texte complet plutôt que cet avis.',
        )}
      </p>
      <p>
        {t(
          'Deux points méritent d’être dits dès maintenant, parce qu’ils engagent les deux parties :',
        )}
      </p>
      <ul>
        <li>
          {t(
            'Le paiement en ligne n’est pas ouvert. Aucun prélèvement n’est possible aujourd’hui, quel que soit le plan affiché sur la page d’accueil.',
          )}
        </li>
        <li>
          {t(
            'Le service est en cours de construction. Certaines fonctions annoncées sur la page d’accueil — travail hors-ligne, import de fichier clients — ne sont pas encore disponibles.',
          )}
        </li>
      </ul>
    </PageLegale>
  );
}
