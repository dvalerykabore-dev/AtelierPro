import type { Metadata } from 'next';
import PageLegale from '@/components/landing/PageLegale';

export const metadata: Metadata = {
  title: 'Conditions d’utilisation — AtelierPro',
  description: 'Conditions générales d’utilisation d’AtelierPro.',
};

export default function Conditions() {
  return (
    <PageLegale titre="Conditions d’utilisation">
      <p>
        Ce document n’est pas encore rédigé. Il le sera avant l’ouverture des inscriptions payantes,
        et cette page portera alors le texte complet plutôt que cet avis.
      </p>
      <p>
        Deux points méritent d’être dits dès maintenant, parce qu’ils engagent les deux parties :
      </p>
      <ul>
        <li>
          Le paiement en ligne n’est pas ouvert. Aucun prélèvement n’est possible aujourd’hui, quel
          que soit le plan affiché sur la page d’accueil.
        </li>
        <li>
          Le service est en cours de construction. Certaines fonctions annoncées sur la page
          d’accueil — travail hors-ligne, import de fichier clients — ne sont pas encore
          disponibles.
        </li>
      </ul>
    </PageLegale>
  );
}
