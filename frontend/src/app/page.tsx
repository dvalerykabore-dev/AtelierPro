import { redirect } from 'next/navigation';

/**
 * La racine n'a pas d'écran propre dans la maquette Banani : le point d'entrée
 * de l'atelier est le tableau de bord. On y redirige plutôt que d'afficher une
 * page vide.
 */
export default function Home() {
  redirect('/dashboard');
}
