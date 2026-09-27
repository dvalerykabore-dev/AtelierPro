import type { Metadata } from 'next';
import Contenu from '@/app/legal/confidentialite/Contenu';

export const metadata: Metadata = {
  title: 'Confidentialité — AtelierPro',
  description: 'Politique de confidentialité d’AtelierPro.',
};

export default function Confidentialite() {
  return <Contenu />;
}
