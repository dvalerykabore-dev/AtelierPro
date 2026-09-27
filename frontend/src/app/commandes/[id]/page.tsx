import type { Metadata } from 'next';
import FicheCommande from '@/components/atelier/FicheCommande';

export const metadata: Metadata = {
  title: 'Fiche commande — AtelierPro',
};

/**
 * Coquille serveur : elle ne porte que les métadonnées, interdites dans un
 * composant client. Le corps de la fiche lit `/api/commandes` côté navigateur.
 */
export default async function FicheCommandePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FicheCommande id={id} />;
}
