import type { Metadata } from 'next';
import AppShell from '@/components/atelier/AppShell';
import PriseDeMesures from '@/components/atelier/PriseDeMesures';

export const metadata: Metadata = {
  title: 'Prise de mesures — AtelierPro',
};

export default function MesuresPage() {
  return (
    <AppShell
      titre="Prise de mesures"
      sousTitre="Relevé corporel, tissus apportés et modèle choisi"
    >
      <PriseDeMesures />
    </AppShell>
  );
}
