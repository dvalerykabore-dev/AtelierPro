import type { Metadata } from 'next';
import PlanningEquipe from '@/components/atelier/PlanningEquipe';
import ExigePalier from '@/components/atelier/ExigePalier';

export const metadata: Metadata = {
  title: 'Planning équipe — AtelierPro',
};

/**
 * Coquille serveur : elle ne porte que les métadonnées. L'en-tête (libellé de
 * semaine, navigation) est rendu par le composant client, qui seul connaît la
 * semaine réellement affichée.
 */
export default function PlanningPage() {
  return (
    <ExigePalier capacite="planning">
      <PlanningEquipe />
    </ExigePalier>
  );
}
