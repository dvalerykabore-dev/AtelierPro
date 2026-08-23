import type { Metadata } from 'next';
import PlanningEquipe from '@/components/atelier/PlanningEquipe';

export const metadata: Metadata = {
  title: 'Planning équipe — AtelierPro',
};

/**
 * Coquille serveur : elle ne porte que les métadonnées. L'en-tête (libellé de
 * semaine, navigation) est rendu par le composant client, qui seul connaît la
 * semaine réellement affichée.
 */
export default function PlanningPage() {
  return <PlanningEquipe />;
}
