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

import type { Capacite } from '@/lib/plans';

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
  /**
   * Capacité que l'écran demande, quand il est payant. `undefined` = ouvert à
   * tous les paliers.
   *
   * L'entrée reste VISIBLE sans elle, avec un cadenas : masquer un écran ne
   * dit rien à personne, alors qu'un cadenas montre ce que l'atelier gagnerait
   * à monter de palier. Le clic mène à l'invitation, pas à une erreur.
   */
  capacite?: Capacite;
}

/**
 * Rail latéral desktop (source Banani : /components/SideNav.jsx).
 *
 * L'ordre suit le déroulé d'une journée : ce qu'on fait, pour qui, puis ce que
 * ça rapporte. Trésorerie et Dépenses restent voisines — on ouvre la seconde
 * depuis la première — et Rapports ferme la liste : c'est le seul écran qu'on
 * consulte à froid, jamais au milieu d'une prise de commande.
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
    capacite: 'planning',
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
    id: 'tresorerie',
    capacite: 'tresorerie',
    href: '/tresorerie',
    label: 'Trésorerie',
    labelCourt: 'Caisse',
    icone: Wallet,
    disponible: true,
  },
  {
    id: 'depenses',
    capacite: 'tresorerie',
    href: '/depenses',
    label: 'Dépenses',
    labelCourt: 'Dépenses',
    icone: Receipt,
    disponible: true,
  },
  {
    id: 'rapports',
    capacite: 'rapports',
    href: '/rapports',
    label: 'Rapports',
    labelCourt: 'Rapports',
    icone: BarChart2,
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
