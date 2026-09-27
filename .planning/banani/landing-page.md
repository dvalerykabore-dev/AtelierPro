# Landing page — Banani → Next.js 16 / Tailwind v4

## Source

- Écran Banani : `BlTaeCglLjgB/screens/LandingPage.jsx` — `screenSize = 'desktop'`
- Récupéré : 2026-08-23
- **Une seule variante remontée par le MCP.** L'utilisateur pensait avoir
  sélectionné la desktop *et* la mobile ; `banani_get_selected_designs` n'a
  renvoyé qu'un écran, marqué `desktop`. La version mobile est donc **conçue
  ici**, en mobile-first, et non traduite d'une maquette.

## Où ça se branche

| Question | Réponse (preuve) |
|---|---|
| Route | `/` — `frontend/src/app/page.tsx` redirigeait vers `/dashboard`, la racine était libre |
| Publique ? | Oui. `src/middleware.ts` n'a aucun préfixe protégé par défaut ; `AuthGuard` n'est pas appliqué |
| Lecture backend | Aucune donnée métier. Seul `AuthContext` est lu, pour savoir si un atelier est déjà connecté |
| Écriture backend | Aucune. Tous les CTA mènent à `/inscription`, qui appelle déjà `POST /api/auth/signup` |
| Navigation entrante | Point d'entrée du domaine, et `auth/error/page.tsx:51` (« retour à l'accueil ») |
| Navigation sortante | `/inscription`, `/connexion`, `/dashboard`, les 5 écrans de l'atelier, les 2 pages légales |
| États | Pas de chargement de données ⇒ pas d'état vide/erreur. Seul le CTA de la barre haute a un état transitoire (`loading` d'`AuthContext`) |
| Effets de bord | Aucun |

## Découpage

| Fichier | Rôle | Client ? |
|---|---|---|
| `src/app/page.tsx` | composition + `metadata` SEO | serveur |
| `src/lib/landing-contenu.ts` | **tout le texte marketing**, isolé exprès (voir « Affirmations ») | — |
| `components/landing/BarreNavigation.tsx` | nav collante, tiroir mobile, CTA selon session | **oui** |
| `components/landing/SectionHero.tsx` | titre, 2 CTA, panneau visuel, bandeau de 3 chiffres | serveur |
| `components/landing/SectionFonctionnalites.tsx` | 6 cartes, chacune liant vers son écran | serveur |
| `components/landing/SectionCasUsage.tsx` | 3 profils d'atelier | serveur |
| `components/landing/SectionTemoignages.tsx` | 3 citations | serveur |
| `components/landing/SectionTarifs.tsx` | 3 plans → `/inscription?plan=` | serveur |
| `components/landing/SectionFaq.tsx` | accordéon réel | **oui** |
| `components/landing/SectionAppelFinal.tsx` | CTA de clôture + contact | serveur |
| `components/landing/PiedDePage.tsx` | mentions + liens légaux | serveur |
| `app/legal/{confidentialite,conditions}/page.tsx` | évite deux liens morts | serveur |

`Button` (`components/ui/`) est réutilisé tel quel. `Avatar` remplace le
`UserAvatar` de Banani, comme sur tous les autres écrans.

## Ce qui est réellement branché

| Élément | Branchement |
|---|---|
| Liens de la nav | ancres `#fonctionnalites` `#tarifs` `#temoignages` `#faq` + `scroll-mt` sous la barre collante |
| CTA de la nav | `useAuth()` : session ⇒ « Tableau de bord » → `/dashboard` ; sinon « Essai gratuit » → `/inscription` |
| Menu mobile | tiroir à état réel, fermé au clic sur un lien et à la touche Échap |
| « Démarrer essai gratuit » (hero, tarifs, clôture) | `/inscription`, avec le plan en `?plan=` depuis les tarifs |
| « Voir démo » | `/dashboard` — les écrans retombent sur le jeu d'exemple hors session |
| 6 cartes fonctionnalités | chacune pointe vers son écran (`/planning`, `/mesures`, `/commandes`, `/clients`, `/rapports`) |
| Plan sélectionné | `/inscription` lit `?plan=` et l'affiche. **Aucune facturation n'existe** : la mention reste neutre, elle n'annonce pas de prélèvement |
| Enterprise | ancre `#contact`, pas de prix inventé |
| FAQ | accordéon `<button aria-expanded>` + `<h3>`, une seule ouverte à la fois |
| Numéro WhatsApp | `NEXT_PUBLIC_ATELIER_WHATSAPP`. **Absent ⇒ la ligne disparaît** plutôt que d'afficher `+226 XXXXXXXXX` |
| Liens de pied de page | 2 pages réelles + « Contact » → `#contact` |

## Affirmations non vérifiables — à trancher avant mise en ligne

Regroupées dans `src/lib/landing-contenu.ts` sous un bandeau de commentaire,
pour qu'aucune ne parte en production sans avoir été vue :

1. **Chiffres du hero** — « 50K+ tailleurs », « 40h gagnées/mois », « 96 % de
   satisfaction ». Rien en base ne les soutient.
2. **Témoignages** — trois personnes nommées, avec ville et métier, dont les
   citations sont écrites par le générateur de maquette. Présentés tels quels,
   ce sont des avis clients fabriqués.
3. **Résultats des cas d'usage** — « +35 % de commandes », « revenue +60 % ».
4. **Engagements de la FAQ** — hors-ligne avec synchronisation, formation
   gratuite, import de clients, support WhatsApp : aucun n'est implémenté.
5. **Prix** — 2 000 / 4 000 F/mois : aucun paiement n'est branché.

Deux écarts délibérés par rapport à la maquette, parce que le texte était
factuellement faux :

- « App iOS & Android » → l'application est un site web. Remplacé par une
  formulation exacte sur le navigateur.
- Le numéro `+226 XXXXXXXXX` n'est pas affiché tant que la variable est vide.

## Plan responsive (mobile-first — la maquette est desktop uniquement)

| Palier | Ce qui change |
|---|---|
| base 375px | tout en une colonne ; nav = logo + hamburger ; CTA pleine largeur empilés ; `h1` en `text-3xl` ; panneau visuel du hero en `aspect-[4/3]` ; bandeau de chiffres en colonne |
| `sm` 640px | chiffres et fonctionnalités sur 2 colonnes ; CTA côte à côte |
| `md` 768px | liens de nav horizontaux, hamburger masqué ; cas d'usage, témoignages et tarifs sur 3 colonnes |
| `lg` 1024px | hero sur 2 colonnes ; fonctionnalités sur 3 ; `h1` en `text-5xl` ; paddings verticaux élargis |
| `xl` 1280px | conteneur plafonné à `max-w-6xl`, la maquette Banani est atteinte |

Cibles tactiles ≥ 44px sur les liens de nav, le hamburger, les en-têtes de FAQ
et tous les CTA.

## Vérification

- [ ] `pnpm lint` / `pnpm typecheck` / `pnpm test`
- [ ] 375 px — pas de défilement horizontal, tiroir fonctionnel
- [ ] 768 px et 1280 px
- [ ] Chaque lien cliqué mène quelque part (audit final)
- [ ] Accordéon FAQ au clavier
- [ ] CTA de la nav bascule selon la session
