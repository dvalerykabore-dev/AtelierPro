import {
  BarChart2,
  CalendarDays,
  LayoutDashboard,
  Receipt,
  Ruler,
  Shirt,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

export interface EntreeNav {
  /** Identifiant stable — deux entrées peuvent viser la même URL (voir « Mesures »). */
  id: string;
  href: string;
  /** Libellé complet (rail desktop, infobulle). */
  label: string;
  /** Libellé court de la barre basse mobile. */
  labelCourt: string;
  icone: LucideIcon;
  /**
   * `false` tant que l'écran n'est pas implémenté : l'entrée reste visible et
   * identique à la maquette, mais ne navigue pas — mieux qu'un lien vers une 404.
   */
  disponible: boolean;
}

/**
 * Rail latéral desktop — 6 entrées (source Banani : /components/SideNav.jsx).
 *
 * « Mesures » n'existait pas dans la maquette Banani — l'entrée y renvoyait au
 * carnet clients, où les mesures sont en lecture seule. `/mesures` est un écran
 * ajouté : relevé corporel modifiable, photos des tissus apportés et du modèle
 * choisi.
 */
export const entreesLaterales: EntreeNav[] = [
  {
    id: 'dashboard',
    href: '/dashboard',
    label: 'Tableau de bord',
    labelCourt: 'Accueil',
    icone: LayoutDashboard,
    disponible: true,
  },
  {
    id: 'planning',
    href: '/planning',
    label: 'Planning',
    labelCourt: 'Planning',
    icone: CalendarDays,
    disponible: true,
  },
  {
    id: 'commandes',
    href: '/commandes',
    label: 'Commandes',
    labelCourt: 'Commandes',
    icone: Shirt,
    disponible: true,
  },
  {
    id: 'clients',
    href: '/clients',
    label: 'Clients',
    labelCourt: 'Clients',
    icone: Users,
    disponible: true,
  },
  {
    id: 'mesures',
    href: '/mesures',
    label: 'Mesures',
    labelCourt: 'Mesures',
    icone: Ruler,
    disponible: true,
  },
  {
    id: 'rapports',
    href: '/rapports',
    label: 'Rapports',
    labelCourt: 'Rapports',
    icone: BarChart2,
    disponible: true,
  },
  {
    id: 'tresorerie',
    href: '/tresorerie',
    label: 'Trésorerie',
    labelCourt: 'Caisse',
    icone: Wallet,
    disponible: true,
  },
  {
    id: 'depenses',
    href: '/depenses',
    label: 'Dépenses',
    labelCourt: 'Dépenses',
    icone: Receipt,
    disponible: true,
  },
];

/**
 * Barre basse mobile (source Banani : écran « Mobile — Tableau de bord »).
 *
 * Deux entrées du rail n'y figurent pas, et pour des raisons différentes :
 * « Mesures » se rejoint depuis la fiche client, comme dans la maquette ;
 * « Dépenses » depuis l'écran Trésorerie, qui est l'endroit où l'on se demande
 * où l'argent est parti. La trésorerie, elle, reste dans la barre : sur
 * téléphone il n'y a pas de rail latéral, la reléguer la rendrait
 * inatteignable — or c'est précisément l'écran qu'on consulte debout.
 */
export const entreesBasses: EntreeNav[] = entreesLaterales.filter(
  (e) => e.id !== 'mesures' && e.id !== 'depenses',
);
