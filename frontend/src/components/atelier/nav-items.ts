import {
  BarChart2,
  CalendarDays,
  LayoutDashboard,
  Ruler,
  Shirt,
  Users,
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
];

/**
 * Barre basse mobile — 5 entrées (source Banani : écran « Mobile — Tableau de bord »).
 * La maquette mobile omet « Mesures », accessible depuis la fiche client.
 */
export const entreesBasses: EntreeNav[] = entreesLaterales.filter((e) => e.id !== 'mesures');
