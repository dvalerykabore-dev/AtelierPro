# Banani implementation status

Flow : **Atelier Couture Pro** — `BlTaeCglLjgB`
https://app.banani.co/flow/BlTaeCglLjgB

Last updated : 2026-08-23

## Système de design (source : `/style.css`, bloc `@theme`)

Thème sombre, bleu nuit + or. À porter dans `frontend/src/app/globals.css`.

| Token Banani | Valeur | Usage |
|---|---|---|
| `--color-background` | `#0b1628` | fond global |
| `--color-foreground` | `#f0e8d5` | texte principal (crème) |
| `--color-surface` | `#0f1f3a` | cartes, panneaux |
| `--color-border` | `#1e3255` | bordures |
| `--color-input` | `#132040` | champs de saisie |
| `--color-primary` | `#c9993a` | or — CTA, accents |
| `--color-primary-foreground` | `#0b1628` | texte sur or |
| `--color-secondary` | `#1a2e50` | boutons secondaires |
| `--color-muted` / `--color-muted-foreground` | `#162340` / `#7a8faa` | zones atténuées |
| `--color-accent` | `#e8b84b` | or clair |
| `--color-danger` / `--color-success` / `--color-warning` | `#e05a3a` / `#3aaf7a` / `#e8b84b` | états |

- Police corps **et** titres : `Space Grotesk` (le projet est actuellement sur Inter — à remplacer)
- Rayons : `sm 4px` (défaut) · `md 6px` · `lg 10px` · `xl 16px`
- Échelle typographique : 11 / 13 / 15 / 17 / 20 / 24 / 30 / 38 px

## Composants partagés fournis par Banani

Déjà factorisés côté design — à porter en priorité, ils sont réutilisés par presque tous les écrans.

- `SideNav` — navigation latérale (desktop)
- `OrderCard` — carte commande
- `StatTile` — tuile de statistique (tableau de bord, rapports)
- `CapacityBar` — barre de charge (planning équipe)
- `MeasureRow` — ligne de mesure (fiche commande)

## Écrans sélectionnés — 14 uniques + 2 doublons

Tous implémentés (voir « Done » plus bas). Inventaire conservé comme table de
correspondance maquette → route.

### Desktop

| Écran | ID Banani | Route pressentie |
|---|---|---|
| Tableau de bord | `screens/Dashboard.jsx` | `/` ou `/dashboard` |
| Liste commandes | `screens/new_screen8.jsx` | `/commandes` |
| Nouvelle commande | `screens/new_screen1.jsx` | `/commandes/nouvelle` |
| Fiche commande | `screens/new_screen4.jsx` | `/commandes/[id]` |
| Fiche commande détail | `screens/new_screen11.jsx` | `/commandes/[id]` (variante) |
| Carnet clients | `screens/new_screen3.jsx` | `/clients` |
| Planning équipe | `screens/new_screen2.jsx` | `/planning` |
| Rapports | `screens/new_screen5.jsx` | `/rapports` |
| Notifications | `screens/new_screen7.jsx` | `/notifications` |
| Paramètres | `screens/new_screen6.jsx` | `/parametres` |

### Mobile (variantes du même parcours)

| Écran | ID Banani |
|---|---|
| Mobile — Tableau de bord | `screens/new_screen9.jsx` |
| Mobile — Nouvelle commande | `screens/new_screen10.jsx` |
| Mobile — Planning équipe | `screens/MobilePlanningEquipe.jsx` |
| Mobile — Carnet clients | `screens/MobileCarnetClients.jsx` |

### Doublons — à ignorer

- `new_screen8_copy1_copy1.jsx` — « Liste commandes (Copy) (Copy) »
- `new_screen11_copy1.jsx` — « Fiche commande détail (Copy) »

## Done

- [x] **Socle du système de design** — `frontend/src/app/globals.css` (bloc `@theme` Banani),
      `frontend/src/app/layout.tsx` (Space Grotesk, `lang="fr"`, fond navy)
- [x] **Composants partagés Banani** — les 5 portés :
      `components/ui/StatTile.tsx`, `components/ui/CapacityBar.tsx`,
      `components/atelier/OrderCard.tsx`, `components/atelier/StatusBadge.tsx`,
      plus `components/ui/Avatar.tsx` (remplace `UserAvatar`, non fourni par le MCP).
      `MeasureRow` reste à porter — il ne sert qu'à la fiche commande.
- [x] **Navigations** — `components/atelier/SideNav.tsx` (rail desktop),
      `components/atelier/BottomNav.tsx` (barre basse mobile),
      `components/atelier/nav-items.ts` (source unique des entrées)
- [x] `tableau-de-bord` — `frontend/src/app/dashboard/page.tsx` —
      plan : `dashboard.md` — fusionne les écrans `Dashboard.jsx` (desktop) et
      `new_screen9.jsx` (mobile) en une page responsive unique

### Vérifications du tableau de bord

| Contrôle | Résultat |
|---|---|
| `pnpm format` / `pnpm lint` / `pnpm typecheck` | verts |
| Rendu 375px | pas de débordement horizontal · 3 statistiques · commandes 1 colonne (328px) |
| Rendu 768px | 4 statistiques · commandes 2 colonnes |
| Rendu 1280px | conforme à la maquette desktop Banani |
| Cibles tactiles barre basse | 57px (seuil 44px) |
| Barres de capacité | hauteurs mesurées 32/24/12/32/20px pour 8·6·3·8·5 h sur 8 |

- [x] `liste-commandes` — `app/commandes/page.tsx` — filtres et pagination fonctionnels
- [x] `nouvelle-commande` — `app/commandes/nouvelle/page.tsx` — fusion desktop + mobile
- [x] `fiche-commande` + `fiche-commande-detail` — `app/commandes/[id]/page.tsx` —
      les deux maquettes réunies en onglets **Suivi** / **Récapitulatif**
- [x] `carnet-clients` — `app/clients/page.tsx` — fusion desktop + mobile (onglets sur petit écran)
- [x] `planning-equipe` — `app/planning/page.tsx` — grille hebdo desktop, vue par jour sur mobile
- [x] `rapports` — `app/rapports/page.tsx`
- [x] `notifications` — `app/notifications/page.tsx` — filtres et marquage « lu » fonctionnels
- [x] `parametres` — `app/parametres/page.tsx` — 5 onglets, interrupteurs fonctionnels
- [x] Navigation reliée de bout en bout + `/` redirige vers `/dashboard`

## Couverture des écrans sélectionnés

Les 14 écrans uniques ont tous une destination. Les 2 doublons `(Copy)` sont ignorés.

| Écran Banani | Destination |
|---|---|
| Tableau de bord + Mobile — Tableau de bord | `/dashboard` |
| Liste commandes | `/commandes` |
| Nouvelle commande + Mobile — Nouvelle commande | `/commandes/nouvelle` |
| Fiche commande | `/commandes/[id]` — onglet Récapitulatif |
| Fiche commande détail | `/commandes/[id]` — onglet Suivi |
| Carnet clients + Mobile — Carnet clients | `/clients` |
| Planning équipe + Mobile — Planning équipe | `/planning` |
| Rapports | `/rapports` |
| Notifications | `/notifications` |
| Paramètres | `/parametres` |

## In progress

_(aucun)_

## Écart majeur constaté au départ — **comblé**

Le starter ne ship que des modèles génériques. `Order` est une **commande de paiement**
(`amount`, `currency`, `provider`, `paymentUrl`, Bictorys) — pas une commande de couture.
Il a donc fallu construire tout le domaine métier.

| Notion du design | Modèle Prisma | Route API |
|---|---|---|
| Client (carnet clients) | `Customer` ✅ | `/api/clients` ✅ |
| Commande de couture | `TailoringOrder` ✅ (`Order` reste le paiement) | `/api/commandes` ✅ |
| Mesures | `MeasurementSet` ✅ | `/api/clients/[id]/mesures` ✅ |
| Charge de l'équipe | `WorkshopTask` ✅ | `/api/planning` ✅ |
| Rapports | agrégations dérivées des commandes ✅ | `/api/rapports` ✅ |

Repris tels quels du starter : `User`, `Organization` + `OrganizationMember`,
`Notification` (écran Notifications), `FileUpload` (photos de tissus et de modèles).

**Sans modèle à ce jour** — encore sur `lib/mock/atelier.ts` : l'équipe d'artisans
(les tâches et les commandes stockent des initiales, pas une clé étrangère), la grille
tarifaire, les notifications de l'atelier et les paramètres.

## Décisions prises (2026-08-16)

- **Interface d'abord**, sur données simulées (`lib/mock/atelier.ts`) — le back-end viendra ensuite
- **Ordre** : socle + tableau de bord, puis le reste
- **Mobile** : fusion en pages responsives, une seule route par fonction
- **Un seul atelier par compte** — pas de filtrage multi-tenant pour l'instant

## Open design questions

- Les maquettes mobiles affichent des **photos** de clients et d'artisans (`UserAvatar`).
  Remplacées par des pastilles d'initiales, faute de source d'images. Brancher sur
  Cloudinary (déjà configuré) ? — posée 2026-08-16
- La racine `/` reste vide. Doit-elle rediriger vers `/dashboard` ? — posée 2026-08-16
- Les entrées de navigation non encore implémentées (Planning, Commandes, Clients,
  Mesures, Rapports, Paramètres, Notifications) sont volontairement **non cliquables**
  plutôt que de mener à une 404. Basculer `disponible: true` dans
  `components/atelier/nav-items.ts` au fur et à mesure des écrans livrés.

## Complété au-delà des maquettes Banani

Ces écrans n'existent pas dans le flow Banani : ils sont déduits de son système de
design (Space Grotesk, palette bleu nuit + or, carte `surface` bordée, filet doré).

### Authentification — 5 écrans

`/connexion` · `/inscription` · `/verification` · `/mot-de-passe-oublie` · `/reinitialiser`

Branchés sur le vrai back-end (`/api/auth/*`), avec les codes d'erreur stables traduits
en messages français, la connexion Google, et le respect de la résistance à l'énumération
(l'inscription redirige toujours vers la saisie du code, sans révéler si le compte existait).
Coquille commune : `components/auth/AuthCard.tsx`.

### Verrouillage des pages

- **Serveur** — `frontend/src/middleware.ts`, activé par `AUTH_PROTECTED_PREFIXES`.
  Redirige en 303 vers `/connexion?next=…` **avant tout rendu** : 0 octet de données
  envoyé à un visiteur non connecté. Vérifié.
- **Navigateur** — `components/atelier/AuthGuard.tsx`, second rideau intégré à `AppShell`.
- **Mode démonstration** — `NEXT_PUBLIC_ATELIER_DEMO="1"` laisse consulter l'atelier sans
  compte, avec un bandeau orange permanent. Nécessaire en local : l'e-mail de vérification
  part par une file drainée par un cron Vercel, absent en développement.

> 🐛 **Bug corrigé dans le starter lui-même** : `middleware.ts` se trouvait à
> `frontend/middleware.ts` alors que l'app vit sous `frontend/src/app/`. Next.js exige
> le middleware au même niveau que `app` — il n'était donc **jamais chargé** et la
> protection de routes documentée par le starter n'avait jamais fonctionné.
> Déplacé vers `frontend/src/middleware.ts`.

### Boutons rendus fonctionnels

| Bouton | Ce qui a été construit |
|---|---|
| « Ajouter » un client | fenêtre de création (nom, téléphone), ajout en tête de liste |
| « Affecter tâche » | fenêtre d'affectation + **alerte de surcharge** au-delà de 8 h/jour |
| « Enregistrer paiement » | fenêtre de saisie, solde pré-rempli, règle la ligne restante |
| « Ajouter note » | saisie active, Entrée publie, Maj+Entrée saute une ligne |
| « Ajouter / modifier / supprimer un tarif » | fenêtre partagée création + édition |
| Champs « Rechercher… » | filtrage réel (commandes : client, tenue, référence · clients : nom, téléphone) + états vides |
| « Se déconnecter » | appelle réellement `/api/auth/logout` puis redirige |

Primitives ajoutées : `ui/Button.tsx`, `ui/Field.tsx` (champ, zone de texte, liste
déroulante), `ui/Modal.tsx` (Échap, clic extérieur, focus, défilement bloqué).

### Icône

`app/icon.svg` — monogramme « A » or sur bleu nuit, repris du logo du rail latéral.
Remplace le 404 sur `/favicon.ico`.

### Écran « Prise de mesures » — `/mesures`

L'entrée « Mesures » du rail renvoyait au carnet clients, où les mesures sont en
**lecture seule**. Il manquait l'endroit où l'on *relève* les mesures.

`app/mesures/page.tsx` + `components/atelier/PriseDeMesures.tsx` :

- choix du client par liste déroulante avec recherche
- 10 mesures corporelles **modifiables**, compteur de champs renseignés
- **photos des tissus apportés** (jusqu'à 6) et **photo du modèle choisi** (1)
- remarques de morphologie, puis enchaînement vers la création de commande

`components/ui/PhotoUpload.tsx` envoie réellement sur Cloudinary via `POST /api/upload` :
aperçu local immédiat (prise de mesures souvent faite au téléphone, en 3G), puis
remplacement par l'URL Cloudinary. Sans session, la photo reste visible mais un
avertissement annonce qu'elle n'est pas enregistrée — pas de faux succès.

> 🐛 **Second bug corrigé dans le starter** : `lib/server/upload/cloudinary-client.ts`
> envoyait `options.metadata = "mime=..."`. Or `metadata` désigne chez Cloudinary les
> métadonnées **structurées**, dont chaque clé doit être déclarée au préalable dans le
> compte — d'où un rejet systématique
> (`Metadata External IDs do not exist: ["mime"]`, HTTP 400) sur tout compte neuf.
> **Aucun upload n'avait jamais pu aboutir.** Remplacé par `context`, libre et sans
> déclaration, qui conserve l'intention (`context.custom.mime`).
> Vérifié : `POST /api/upload` renvoie désormais `201` avec l'URL Cloudinary.

## Back-end — première tranche verticale livrée

Le domaine métier n'existait pas côté serveur. Première tranche complète, du modèle
Prisma jusqu'à l'écran : **les clients**.

### Schéma

Migration `20260821042844_atelier_customers_measurements` :

- `Customer` — nom, téléphone, `gender` (`FEMALE` | `MALE`), fidélité, notes.
  Cloisonné par `userId` (un compte = un atelier) et `@@unique([userId, name])` :
  deux ateliers peuvent avoir un homonyme, un même atelier non.
- `MeasurementSet` — palette employée, valeurs en `Json` indexées `section::numero`,
  photos de tissus et du modèle. Le `Json` évite une migration à chaque mesure ajoutée,
  et le genre est figé avec le relevé : changer le client plus tard ne doit pas
  réinterpréter d'anciennes mesures.

### API

`GET` et `POST /api/clients`, conformes aux invariants du CLAUDE.md
(`runtime = 'nodejs'`, `verifyCsrf`, `requireAuth`, `withRequestContext`).

Vérifié contre la vraie base Neon :

| Cas | Réponse |
|---|---|
| Sans session | `401` |
| Sans jeton CSRF | `403` |
| Création valide | `201` |
| Nom déjà pris | `409 CUSTOMER_ALREADY_EXISTS` |
| Genre hors liste, nom vide | `400 VALIDATION_FAILED` |

### Écran branché

`components/atelier/CarnetClients.tsx` lit désormais `/api/clients` via
`lib/useClients.ts`. **Repli assumé** : sans session l'API répond 401 et l'écran
retombe sur le jeu simulé — le mode démonstration doit rester consultable — mais
affiche « · exemples » à côté du décompte. On ne doit jamais prendre des données
d'exemple pour le vrai carnet.

Chaîne prouvée de bout en bout : formulaire → `POST` → Prisma → Neon → relecture.
Un client créé depuis l'interface (« Fatou Sanogo », palette homme) est bien en base
avec `gender: MALE`.

### Tranches suivantes — le domaine métier est désormais entièrement en base

| Tranche | Migration | Route | Écran branché |
|---|---|---|---|
| Clients | `20260821042844_atelier_customers_measurements` | `/api/clients` | `CarnetClients` |
| Relevés de mesures | (même migration) | `/api/clients/[id]/mesures` | `PriseDeMesures` |
| Commandes de couture | `20260821053524_atelier_tailoring_orders` | `/api/commandes` | `ListeCommandes`, `FicheCommande`, `CommandesDuJour` |
| Rapports | _(aucune — tout se dérive des commandes)_ | `/api/rapports` | `Rapports` |
| Planning | `20260821081033_atelier_workshop_tasks` | `/api/planning` | `PlanningEquipe` |

**Plus aucun écran ne vit sur des données simulées en session.** Le jeu
`lib/mock/atelier.ts` ne sert plus qu'au mode démonstration (hors session) et aux
référentiels qui n'ont pas encore de modèle : l'équipe d'artisans, les tarifs, les
notifications et les paramètres.

#### Numérotation des commandes — trois tentatives, une seule tient

`@@unique([userId, sequence])` garantit l'unicité ; restait à allouer le numéro.

| Approche | Résultat mesuré (8 créations simultanées) |
|---|---|
| Reprise simple, 5 essais | 1 × `500` |
| Verrou consultatif dans une transaction interactive | **6 échecs sur 8** — `P2028` |
| Sans transaction, reprise à attente croissante et désynchronisée | **8/8**, aucun doublon |

La deuxième échoue à cause de `connection_limit=1` sur le pooler Neon : une
transaction interactive monopolise l'unique connexion.

#### Rapports — le seul écran qui refuse le repli

Clients, commandes et planning retombent sur le jeu d'exemple hors session, en
l'annonçant. Les rapports, non : `useRapports` affiche « Indicateurs indisponibles »
plutôt qu'un chiffre d'affaires inventé. Un montant faux est le pire mensonge que
puisse produire cette interface.

Les indicateurs non mesurables valent `null`, pas `0` : sans commande livrée, la
ponctualité s'affiche « — », jamais « 0 % » — qui se lirait comme une contre-performance.

#### Planning — la grille est datée, plus indexée

La maquette Banani numérotait les colonnes de 0 à 5 : le planning devenait faux dès
le lundi suivant. `WorkshopTask.day` est un `DATE`, la semaine est calculée **par le
serveur** (une horloge de poste mal réglée ne doit pas décaler la colonne du jour),
et les flèches ‹ › naviguent réellement de semaine en semaine.

Le plafond de 8 h par artisan et par jour est appliqué **côté serveur**
(`409 DAY_CAPACITY_EXCEEDED`) : l'avertissement à l'écran prévient, il ne garde pas
la porte — deux onglets ouverts le contourneraient.

Vérifié en navigateur : 6 h affectées à MK vendredi → acceptées ; 4 h de plus le même
jour → refusées avec « MK a déjà 6 h engagées ce jour-là (8 h maximum). » ; 4 h
affectées à AT le même jour → acceptées. Charge totale 10/40 h. Après aller-retour
sur la semaine suivante, les deux tâches sont relues depuis la base.

#### Messages d'erreur — `lib/message-erreur.ts`

`ApiError.message` vaut toujours le champ `error` de la réponse, c'est-à-dire le
**code** (`DAY_CAPACITY_EXCEEDED`, `VALIDATION_FAILED`). Plusieurs écrans affichaient
donc une constante d'API à un couturier. `lib/api.ts` étant protégé, la traduction se
fait dans un helper appelé par `useClients`, `useReleveMesures`, `useRapports` et
`usePlanning` : `body.message` d'abord, puis la première entrée de `body.issues`, sinon
un repli en français.

#### L'équipe — dernier référentiel simulé

Migration `20260823105037_atelier_artisans` : `Artisan` (nom, rôle, initiales,
capacité quotidienne, actif), cloisonné par `userId`, `@@unique([userId, initials])`.
Les initiales sont la clé de rapprochement de `TailoringOrder.assignee` et
`WorkshopTask.assignee` : la route les dérive du nom et les désambiguïse (MK, MK2)
plutôt que de refuser une collision que l'utilisateur ne saurait pas résoudre.

Les cinq artisans étaient codés en dur : **un atelier qui venait d'ouvrir voyait le
personnel de quelqu'un d'autre et ne pouvait pas le corriger** — même classe de bug
que la fiche client. `/api/artisans` + `/api/artisans/[id]` (PATCH ; pas de DELETE :
un partant est désactivé, ses commandes passées doivent rester lisibles) alimentent
désormais les paramètres, le planning, le formulaire de commande et le tableau de bord.

La capacité devient **individuelle** : un apprenti à 6 h n'est plus jugé au seuil de
8 h d'un senior. Le plafond serveur (`409 DAY_CAPACITY_EXCEEDED`) lit la capacité de
l'artisan, et refuse aussi d'assigner un artisan désactivé (`409 ARTISAN_INACTIVE`).

#### Le tableau de bord annonçait 24 commandes au-dessus d'une liste d'une seule

Les quatre tuiles étaient figées (« 24 actives », « +3 »), la date aussi
(« Jeudi 23 janvier 2025 »). Tout se dérive maintenant des commandes et du carnet
déjà chargés — sans appel supplémentaire, donc sans divergence possible avec la liste
juste en dessous. Les tendances « +3 » ont disparu : rien en base ne permet de les
calculer, et un écart inventé serait pire qu'une absence. La charge de l'équipe est
sommée depuis les tâches du jour, et « Prochaine dispo » est calculée au lieu d'être
annoncée.

> ⚠️ **Limite connue, non corrigée — décision utilisateur requise.**
> `REFRESH_TIMEOUT_MS = 10_000` dans `lib/api.ts` (fichier **protégé**). Quand la base
> est lente — mesuré à 5–8 s par requête sur le plan gratuit Neon — le rafraîchissement
> de jeton dépasse ce délai, le 401 initial remonte, et l'application bascule en mode
> démonstration alors que la session est valide. Chaque hook montant sa propre requête,
> certains basculent et d'autres non : le tableau de bord affiche alors « 1 commande
> active » au-dessus de dix commandes d'exemple.
>
> Atténué sans toucher au fichier protégé : `lib/api-repli.ts` rejoue une fois toute
> **lecture** ayant échoué en 401, le temps que le rafraîchissement aboutisse (les
> mutations ne sont jamais rejouées — l'aide ne prend qu'un chemin, pas de corps).
> Les tuiles annoncent « exemples » quand elles comptent des exemples, pour ne plus
> jamais paraître contredire la liste.
>
> Le correctif de fond — relever le délai, ou le rendre configurable — impose de
> modifier `lib/api.ts`. À arbitrer.

#### Le carnet clients se contredisait

`nbCommandes` et `totalFacture` venaient de la fiche client, que l'API ne renvoie
pas : « 0 commandes · 0 F CFA » s'affichait au-dessus d'un historique de cinq
lignes, lui-même issu du jeu simulé. Compteur et liste lisent désormais tous deux
`useCommandes`. Les mesures affichent le vrai relevé (valeur en crème si prise,
« — » en gris sinon) au lieu d'un « Mise à jour 15 jan 2025 » figé, et les tissus
sont les photos réellement prises pendant le relevé (`MeasurementSet.fabricPhotos`)
— l'onglet attribuait jusqu'ici six yards de wax à un client qui venait d'être créé.

> 🐛 **Bug bloquant, trouvé en vérifiant** : sur un atelier neuf, le bouton
> « Ajouter le premier client » ne faisait **rien**. La fenêtre de création était
> rendue en bas du rendu principal, après le retour anticipé « Aucun client
> enregistré » — donc jamais montée dans la branche que prend justement un
> compte tout neuf. Le tout premier geste du produit était impossible.
> Corrigé en déclarant la fenêtre avant les retours anticipés et en la rendant
> dans les deux branches. Une variable JSX, pas un composant local : un composant
> serait remonté à chaque frappe et volerait le curseur.

#### Vérification de bout en bout sur un atelier vierge

Compte créé depuis l'interface (`verif-carnet@local.test`), code lu en base avec
`pnpm code:verif`, puis :

| Étape | Résultat |
|---|---|
| Carnet vide | « Aucun client enregistré » — aucun repli sur les 8 clients d'exemple |
| Création client | Salimata Zongo, palette femme (23 champs) |
| Fiche du client neuf | « 0 commande · 0 F CFA », « Aucune commande enregistrée », « Aucun relevé », « Aucun tissu photographié » |
| Commande #001 | Robe wax cérémonie, 25 000 F, acompte 10 000 F — numérotation repartie à 1 pour ce nouvel atelier |
| Fiche après commande | « 1 commande · 25 000 F CFA » **=** l'unique ligne d'historique |
| Relevé de 6 mesures sur 23 | « Relevé du 21/08/2026 » ; les 6 valeurs en crème, les 17 autres « — » en gris |

Ce compte de test reste en base ; il est cloisonné par `userId` et n'affecte ni
les rapports ni le carnet du compte principal. À supprimer quand il n'a plus d'usage.

#### Nettoyage de la base

18 des 19 commandes présentes étaient mes propres rebuts de test — jeux de
concurrence (« Charge 1-8 », « Tenue concurrente 1-5 ») et trois insertions `curl`
dont les accents avaient été mangés par l'encodage du terminal Windows
(« Robe wax c□r□monie »). Elles polluaient les rapports, où « Charge 5 » figurait
parmi les tenues les plus commandées. Supprimées ; la commande #19, saisie via le
formulaire, est conservée.

## Restent des actions sans écran (hors périmètre design)

« Imprimer », « Exporter PDF », « WhatsApp », « Valider essayage », « Modifier » les
mesures : ce sont des actions métier, pas des écrans. Elles demandent un back-end réel
(génération PDF, passerelle WhatsApp, transition d'état) plutôt qu'une maquette.

## Corrigé en cours de route (sans lien avec Banani)

`src/app/api/auth/signup/route.test.ts` — le test « 429 TOO_MANY_SIGNUP_ATTEMPTS »
dépassait son délai de 5 s quand la suite complète tourne en parallèle sur une machine
chargée (6 inscriptions avec hachage bcrypt), alors qu'il passe en 3,5 s isolé.
Délai porté à 20 s pour ce cas seul : la suite est redevenue déterministe (570/570).

## Page d'accueil publique — `LandingPage.jsx` + `MobileLandingPage.jsx` (2026-08-23)

Plan : `.planning/banani/landing-page.md`. Route `/` — elle redirigeait vers
`/dashboard`, le produit n'avait aucune vitrine : un visiteur non connecté
tombait directement sur l'écran de connexion.

**Deux maquettes, récupérées en deux temps.** Le premier appel au MCP n'a
renvoyé que `LandingPage.jsx` (`desktop`) ; la version mobile a d'abord été
conçue à la main. `MobileLandingPage.jsx` (`screenSize = 'mobile'`) est arrivé
ensuite, et chaque section a été réalignée dessus — l'espacement du téléphone
n'est pas une réduction du desktop, c'est une maquette distincte. La page est
passée de 7 259 à 5 406 px de haut à 375 px après cet alignement.

### Fichiers

`src/app/page.tsx` · `src/lib/landing-contenu.ts` · `src/components/landing/`
(BarreNavigation, SectionHero, SectionFonctionnalites, SectionCasUsage,
SectionTemoignages, SectionTarifs, SectionFaq, SectionAppelFinal, PiedDePage,
PageLegale) · `src/app/legal/{confidentialite,conditions}/page.tsx` ·
`src/components/auth/FormulaireInscription.tsx` (extrait de la page pour la
frontière `<Suspense>` qu'impose `useSearchParams`).

### Ce qui est branché, et à quoi

| Élément | Branchement | Vérifié |
|---|---|---|
| CTA de la barre haute | `AuthContext` — session ⇒ « Tableau de bord » → `/dashboard`, sinon « Essai gratuit » → `/inscription` ; le lien « Se connecter » disparaît en session | oui |
| 4 liens de nav | ancres `#fonctionnalites` `#tarifs` `#temoignages` `#faq`, `scroll-mt-20` sous la barre collante de 59 px | oui, les 4 |
| Tiroir mobile | état réel, Échap referme, un lien referme et défile | oui |
| 6 cartes fonctionnalités | `/planning` `/mesures` `/commandes` `/clients` `/rapports` `/dashboard` | oui, 200 |
| « Parcourir la démonstration » | `/dashboard`, qui affiche le bandeau « Mode démonstration » | oui |
| Boutons de tarifs | `/inscription?plan=decouverte\|atelier` ; l'inscription affiche « Plan retenu : … ». Plan inconnu ⇒ mention absente | oui |
| Enterprise | ancre `#contact`, pas de prix inventé | oui |
| Accordéon FAQ | `aria-expanded`, panneau retiré du DOM quand fermé, une seule ouverte, Entrée au clavier | oui |
| Pied de page | 2 pages légales réelles (200) + « Contact » → `#contact` | oui |

22 liens sur la page, **aucun `href="#"`**, aucune destination en erreur.

### Responsive

Pas de débordement horizontal à 368 / 775 / 1308 px CSS. Grille des
fonctionnalités 1 → 2 → 3 colonnes. Toutes les cibles tactiles ≥ 44 px après
correction du logo (32 px au départ).

⚠️ **Les captures d'écran de ce poste sont trompeuses** : l'affichage Windows
applique une échelle de ~1,445, si bien qu'un contexte Playwright demandé à
375 px rend en réalité 540 px CSS, et que les coordonnées de clic ne
correspondent pas aux pixels CSS. Un premier diagnostic — « le hamburger n'est
pas cliquable » — en découlait et était **faux** : les taps visaient du vide.
Étalonner le rapport avant toute vérification visuelle.

### ⚠️ Affirmations non vérifiables — à trancher avant mise en ligne

Toutes regroupées dans `src/lib/landing-contenu.ts` sous un bandeau
d'avertissement, pour qu'aucune ne parte en production sans avoir été relue :

1. **Chiffres du hero** — « 50K+ tailleurs », « 40 h gagnées/mois », « 96 % de
   satisfaction ». Aucune source.
2. **Témoignages** — trois personnes nommées, avec ville et métier, dont les
   citations sortent du générateur de maquette. En l'état, ce sont de faux avis
   clients. `SectionTemoignages` se retire d'elle-même si le tableau est vidé.
3. **Résultats des cas d'usage** — « +35 % de commandes », « revenus +60 % ».
4. **Réponses de la FAQ** — reformulées pour ne plus promettre le hors-ligne ni
   l'import de fichier comme s'ils existaient, mais le sujet reste sensible.
5. **Tarifs** — aucun paiement n'est branché. Une mention le dit sous la grille.

Deux écarts délibérés avec la maquette, le texte d'origine étant faux :
« App iOS & Android » (l'application est un site web) et le numéro
`+226 XXXXXXXXX`, remplacé par `NEXT_PUBLIC_ATELIER_WHATSAPP` — variable vide,
ligne non rendue.

### Alignement sur la maquette mobile (seconde passe)

Divergences réelles entre les deux maquettes, désormais portées par des paliers
plutôt que par une réduction uniforme du desktop :

| Section | Téléphone | Desktop |
|---|---|---|
| Barre haute | logo 28 px, marque `text-base`, bouton d'essai `text-xs` | logo 32 px, `text-lg`, liens d'ancre visibles |
| Hero | **titre → visuel → boutons**, boutons empilés pleine largeur | deux colonnes, visuel à droite sur les deux rangées |
| Chiffres | lignes horizontales, icône 40 px à gauche, valeur `text-lg` | colonnes centrées, icône 48 px, valeur `text-3xl` |
| Fonctionnalités | 1 colonne, cartes `rounded-lg p-4`, icône 32 px | 3 colonnes, `rounded-xl p-6`, icône 40 px |
| Cas d'usage · Témoignages · Tarifs | 1 colonne, `p-4`, titres `text-sm` | 3 colonnes, `p-6` / `p-8` |
| FAQ | questions `text-xs`, `gap-2` | `text-base`, `gap-3` |
| Pied de page | centré, séparateurs `·` | réparti sur une ligne |

L'ordre du hero impose un placement explicite en grille (`lg:row-start`,
`lg:row-span-2`) : un simple empilement ne peut pas produire les deux ordres.

#### Trois écarts délibérés avec la maquette mobile

1. **Le hamburger est conservé.** La maquette mobile ne montre que le logo et le
   bouton d'essai — aucun lien de navigation. Les quatre ancres, dont les tarifs
   et la FAQ, deviendraient inatteignables sur une page de 5 400 px. Le tiroir
   vit donc **à côté** du bouton de la maquette, pas à sa place ; vérifié sans
   chevauchement à 368 px CSS.
2. **Les cibles tactiles restent à 44 px.** Le `py-1.5` du bouton d'essai donne
   27 px de haut : au-dessus du minimum WCAG 2.2 (24 px), en dessous de ce que
   demande l'action principale d'une page consultée au doigt. La barre garde sa
   hauteur de 69 px, seul le bouton est plus haut que la maquette.
3. **La liste des tarifs n'est pas tronquée.** La maquette mobile n'affiche que
   `features.slice(0, 3)` ; or ce qui distingue les plans est précisément dans
   les lignes suivantes. Tronquer revient à faire choisir sans montrer.

Deux artefacts de maquette non repris, parce qu'ils cassaient la lecture :
`max-h-20 overflow-hidden` sur les réponses de la FAQ (coupe le texte en pleine
phrase — l'accordéon montre la réponse entière), et le « + » décoratif à côté de
chaque question, devenu un vrai bouton.

#### Revérifié après réalignement

368 / 775 / 1308 px CSS sans débordement · ordre du hero correct sur les deux
formats · 22 liens, aucun mort · 4 ancres sous la barre collante · accordéon
(souris, tactile, clavier) · tiroir (tap, Échap, fermeture au clic d'un lien) ·
aucune cible tactile sous 44 px · `lint`, `typecheck`, 577/577 tests, `build`.
