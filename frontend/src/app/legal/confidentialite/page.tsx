import type { Metadata } from 'next';
import PageLegale from '@/components/landing/PageLegale';

export const metadata: Metadata = {
  title: 'Confidentialité — AtelierPro',
  description: 'Politique de confidentialité d’AtelierPro.',
};

export default function Confidentialite() {
  return (
    <PageLegale titre="Politique de confidentialité">
      <p>
        Ce document n’est pas encore rédigé. Il le sera avant l’ouverture des inscriptions payantes,
        et cette page portera alors le texte complet plutôt que cet avis.
      </p>
      <p>
        En attendant, voici ce que l’application fait réellement des données, tel qu’on peut le
        vérifier dans son code :
      </p>
      <ul>
        <li>
          Les données d’un atelier — clients, mesures, commandes, planning, équipe — sont rattachées
          à son compte et ne sont jamais lues par un autre atelier.
        </li>
        <li>Les mots de passe ne sont pas conservés en clair ; seule une empreinte est stockée.</li>
        <li>
          Les photos de tissus et de modèles sont hébergées chez Cloudinary. Les e-mails de
          vérification transitent par Resend.
        </li>
        <li>Aucune donnée n’est revendue ni cédée à des fins publicitaires.</li>
      </ul>
      <p>
        Pour une demande de suppression de compte ou d’export de vos données, écrivez-nous depuis la
        page d’accueil.
      </p>
    </PageLegale>
  );
}
