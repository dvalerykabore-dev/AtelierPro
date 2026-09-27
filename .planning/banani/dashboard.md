# Tableau de bord — Banani → Next.js 16 / React 19 / Tailwind v4

## Source

- Banani flow : `BlTaeCglLjgB` — « Atelier Couture Pro »
- Écrans fusionnés :
  - `screens/Dashboard.jsx` — « Tableau de bord — AtelierPro » (`screenSize: desktop`)
  - `screens/new_screen9.jsx` — « Mobile — Tableau de bord » (`screenSize: mobile`)
- Récupéré : 2026-08-16
- Décisions utilisateur : interface d'abord sur données simulées · socle + tableau de bord ·
  fusion en pages responsives · un seul atelier par compte

## Structure map

Les deux maquettes ne sont **pas** la même mise en page redimensionnée. Elles diffèrent en
structure, donc la page responsive bascule réellement de l'une à l'autre à `lg` (1024px).

| Zone | Mobile (base) | Desktop (`lg:`) |
|---|---|---|
| Navigation | barre basse fixe, 5 entrées | rail vertical 64px à gauche, 6 entrées + réglages + avatar |
| En-tête | bandeau **inversé** crème (`bg-foreground`, texte navy) : date, nom atelier, cloche + badge, avatar | barre haute `bg-surface` : titre, date, pastille de capacité, bouton « Nouvelle commande » |
| Capacité | carte dans le bandeau : barre globale % + 5 mini-barres verticales par artisan | colonne droite 288px : compteurs saturés/disponibles, filet or, 5 `CapacityBar` horizontales, carte « Prochaine dispo » |
| Statistiques | bandeau 3 colonnes compact (Commandes, Livraisons auj., En retard) | 4 `StatTile` en ligne (Commandes actives, Livraisons ce soir, En retard, Clients ce mois) |
| Commandes | cartes empilées : avatar, client, tenue, statut, échéance, chevron | tableau : entêtes de colonnes + lignes `OrderCard` |

## Component breakdown

- **NEW** `components/ui/StatTile.tsx` — `{label, value, icon, trend, trendUp}` · tuile KPI desktop
- **NEW** `components/ui/CapacityBar.tsx` — `{name, role, used, total, initials}` · barre de charge horizontale
- **NEW** `components/ui/Avatar.tsx` — `{initials, size}` · **remplace le `UserAvatar` de Banani**
  (photos non fournies par le MCP) ; pastille initiales cohérente avec le desktop
- **NEW** `components/atelier/OrderCard.tsx` — `{client, tenue, status, livraison, assignee, urgent, ref}`
  · **rend les deux formes** : carte sur mobile, ligne de tableau à partir de `lg`
- **NEW** `components/atelier/SideNav.tsx` — rail desktop, `hidden lg:flex`
- **NEW** `components/atelier/BottomNav.tsx` — barre basse mobile, `lg:hidden`
- **NEW** `components/atelier/StatusBadge.tsx` — pastille + libellé de statut (partagé mobile/desktop)
- **NEW** `lib/mock/atelier.ts` — données d'exemple typées (artisans, commandes, KPI)
- **REUSE** `lib/utils.ts` → `cn()` existe déjà (clsx + tailwind-merge)

## Token mapping (Banani → projet)

Le bloc `@theme` de Banani est déjà au format Tailwind v4 : **copié tel quel** dans
`globals.css`. Aucune conversion nécessaire, les classes `bg-surface`, `text-primary`,
`border-border` fonctionnent directement.

| Banani | Projet |
|---|---|
| `--font-body` / `--font-headings: Space Grotesk` | `next/font/google` → `Space_Grotesk`, exposée en `--font-body` / `--font-headings` |
| `--radius-*` (4/6/10/16px) | repris tels quels |
| `--text-*` (11→38px) | repris tels quels — écrase l'échelle par défaut de Tailwind |

## Corrections apportées à la source Banani

La source du MCP n'est pas directement exécutable. Défauts relevés et corrigés :

1. **`t()` non défini** — appelé ~40 fois (`{t('Urgent')}`, `t('Saturé')`, `t('Tableau de bord')`…).
   C'est un marqueur d'internationalisation que Banani laisse fuiter. Plante au rendu.
   → texte français littéral, conformément à la langue du projet.
2. **`bg-opacity-10` / `bg-opacity-20`** — syntaxe Tailwind v3, supprimée en v4.
   → `bg-background/10`, `bg-background/20`.
3. **`style={{ fontSize: 9 }}` / `{{ fontSize: 10 }}`** — styles en dur.
   → `text-[9px]`, `text-[10px]`.
4. **`style={{ opacity: 1 }}` / `{{ opacity: 0.4 }}`** — styles en dur.
   → `opacity-100`, `bg-primary/40`.
5. **`style={{ minHeight: '100%' }}` dans `SideNav`** — redondant avec `min-h-full` déjà présent.
   → supprimé.
6. **`UserAvatar` / `Icon`** — composants globaux Banani, non fournis.
   → `Icon` devient des imports nommés `lucide-react` ; `UserAvatar` devient `Avatar` à initiales.

**Exception assumée sur les styles en dur** : les barres de charge utilisent
`style={{ width: '<pct>%' }}` / `height`. Le pourcentage est calculé à l'exécution ;
Tailwind ne peut pas générer une classe par valeur possible. C'est le seul `style`
conservé, et uniquement pour cette dimension dynamique.

## Responsive plan

- **Base (375px)** — mise en page mobile de Banani, fidèle. Navigation basse fixe,
  bandeau inversé, cartes de commandes pleine largeur, cibles tactiles ≥ 44px.
- **sm (640px+)** — bandeau statistiques passe de 3 à 4 colonnes ; grille de commandes en 2 colonnes.
- **lg (1024px+)** — bascule vers la maquette desktop : rail latéral, barre haute,
  colonne capacité à droite, commandes en tableau. Navigation basse masquée.
- **xl (1280px+)** — reproduction fidèle de la maquette Banani desktop.

## Interactions / états

- Survol sur lignes de commande et entrées de navigation (desktop uniquement)
- Focus clavier visible sur tous les éléments interactifs (`focus-visible:ring`)
- Aucun élément accessible au seul survol — tout est atteignable au doigt
- États `vide` / `chargement` / `erreur` : **non fournis par Banani**. Non implémentés à
  ce stade puisque les données sont simulées — à ajouter au branchement de l'API réelle.

## Copy / i18n

Tous les libellés sont en français, en dur dans les composants (le projet n'a pas de
couche i18n). `lib/constants.ts` existe mais ne contient pas de libellés d'interface —
non touché pour ne pas préjuger d'une convention.

## Implementation checklist

- [ ] `globals.css` — bloc `@theme` Banani
- [ ] `layout.tsx` — Space Grotesk, `lang="fr"`, fond navy
- [ ] Composants partagés (StatTile, CapacityBar, Avatar, StatusBadge, OrderCard)
- [ ] Navigations (SideNav desktop, BottomNav mobile)
- [ ] Données simulées typées
- [ ] Page `/dashboard`
- [ ] `pnpm lint` + `pnpm typecheck` verts
- [ ] Vérification visuelle 375 / 768 / 1280px

## Open questions for user

- La maquette mobile affiche des **photos** d'artisans et de clients (`UserAvatar`).
  Remplacées par des initiales, faute de source d'images. À confirmer ou à brancher
  plus tard sur Cloudinary (déjà configuré).
- Le desktop et le mobile n'affichent **pas les mêmes statistiques** (4 contre 3) ni les
  mêmes commandes. J'ai retenu les 4 du desktop, réduites à 3 sur mobile comme la maquette.
- Route retenue : `/dashboard`. La racine `/` reste vide — à décider si elle doit rediriger.
