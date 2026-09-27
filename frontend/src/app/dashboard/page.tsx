import type { Metadata } from 'next';
import TableauDeBord from '@/app/dashboard/TableauDeBord';

export const metadata: Metadata = {
  title: 'Tableau de bord — AtelierPro',
};

export default function DashboardPage() {
  return <TableauDeBord />;
}
