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
    <PageLegale titre={t('Politique de confidentialité')}>
      <p>
        {t(
          'Ce document n’est pas encore rédigé. Il le sera avant l’ouverture des inscriptions payantes, et cette page portera alors le texte complet plutôt que cet avis.',
        )}
      </p>
      <p>
        {t(
          'En attendant, voici ce que l’application fait réellement des données, tel qu’on peut le vérifier dans son code :',
        )}
      </p>
      <ul>
        <li>
          {t(
            'Les données d’un atelier — clients, mesures, commandes, planning, équipe — sont rattachées à son compte et ne sont jamais lues par un autre atelier.',
          )}
        </li>
        <li>
          {t('Les mots de passe ne sont pas conservés en clair ; seule une empreinte est stockée.')}
        </li>
        <li>
          {t(
            'Les photos de tissus et de modèles sont hébergées chez Cloudinary. Les e-mails de vérification transitent par Resend.',
          )}
        </li>
        <li>{t('Aucune donnée n’est revendue ni cédée à des fins publicitaires.')}</li>
      </ul>
      <p>
        {t(
          'Pour une demande de suppression de compte ou d’export de vos données, écrivez-nous depuis la page d’accueil.',
        )}
      </p>
    </PageLegale>
  );
}
