import type { Metadata } from 'next';
import Contenu from '@/app/legal/conditions/Contenu';

export const metadata: Metadata = {
  title: 'Conditions d’utilisation — AtelierPro',
  description: 'Conditions générales d’utilisation d’AtelierPro.',
};

export default function Conditions() {
  return <Contenu />;
}
