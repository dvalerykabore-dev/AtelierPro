import type { Metadata } from 'next';
import BarreNavigation from '@/components/landing/BarreNavigation';
import PiedDePage from '@/components/landing/PiedDePage';
import SectionAppelFinal from '@/components/landing/SectionAppelFinal';
import SectionCasUsage from '@/components/landing/SectionCasUsage';
import SectionFaq from '@/components/landing/SectionFaq';
import SectionFonctionnalites from '@/components/landing/SectionFonctionnalites';
import SectionHero from '@/components/landing/SectionHero';
import SectionTarifs from '@/components/landing/SectionTarifs';
import SectionTemoignages from '@/components/landing/SectionTemoignages';

export const metadata: Metadata = {
  title: 'AtelierPro — la gestion d’atelier de couture',
  description:
    'Commandes, mesures, acomptes et planning d’équipe pour les ateliers de couture d’Afrique de l’Ouest. Essai gratuit de 30 jours, sans carte bancaire.',
  openGraph: {
    title: 'AtelierPro — la gestion d’atelier de couture',
    description:
      'Commandes, mesures, acomptes et planning d’équipe, depuis le téléphone. Essai gratuit de 30 jours.',
    locale: 'fr_FR',
    type: 'website',
  },
};

/**
 * Page d'accueil publique.
 *
 * La racine redirigeait vers `/dashboard` : le produit n'avait aucune vitrine,
 * un visiteur non connecté atterrissait directement sur l'écran de connexion.
 * Elle porte désormais la maquette Banani « AtelierPro — Landing Page ».
 *
 * Pas de redirection pour les visiteurs déjà connectés : c'est la barre de
 * navigation qui s'adapte (« Tableau de bord » au lieu d'« Essai gratuit »).
 * Rediriger rendrait la page d'accueil invisible à ses propres clients, qui
 * ont pourtant de bonnes raisons d'y revenir — les tarifs, la FAQ, le contact.
 *
 * Composant serveur : la page est presque entièrement statique et doit l'être
 * pour le référencement. Seuls la barre de navigation (état de session, tiroir
 * mobile) et l'accordéon de la FAQ sont des composants client.
 */
export default function Accueil() {
  return (
    <>
      <BarreNavigation />
      <main>
        <SectionHero />
        <SectionFonctionnalites />
        <SectionCasUsage />
        <SectionTemoignages />
        <SectionTarifs />
        <SectionFaq />
        <SectionAppelFinal />
      </main>
      <PiedDePage />
    </>
  );
}
