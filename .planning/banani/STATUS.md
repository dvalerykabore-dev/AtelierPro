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

## Trésorerie de l'atelier — hors maquette Banani (2026-08-23)

Demande utilisateur : suivre les dépenses, les recouper avec les recettes, en
dégager la trésorerie et une prévision. Aucune maquette Banani ne couvre ce
domaine — la mise en page suit les conventions déjà posées par les autres
écrans.

### L'obstacle levé d'abord

`TailoringOrder.depositAmount` était un cumul **sans date**, écrit à la création
de la commande et jamais modifié ensuite. L'écran « Paiements » d'une commande
tournait sur `lib/mock/atelier.ts` : ce qu'on y saisissait disparaissait au
rechargement. Impossible de dire « au 23 août, la caisse contient X » sans un
journal daté.

### Modèle

- `CashMovement` — journal unique, deux sens (`IN` / `OUT`). `occurredAt` est en
  `@db.Date` et porte **le jour où l'argent a bougé**, pas celui de la saisie.
  Un seul registre plutôt que deux tables : la trésorerie est la somme signée
  des mouvements, elle doit se lire d'une requête.
- `RecurringCharge` — charges fixes déclarées. Elles n'écrivent **rien** en
  caisse : une charge auto-postée montrerait un loyer payé avant qu'il le soit.
- `TailoringOrder.depositAmount` devient un raccourci de lecture, recalé par
  `recalerAcompte(tx, orderId)` dans la même transaction que chaque écriture ou
  suppression. Vérifié dans les deux sens : +5 000 F → acompte 10 000 → 15 000 ;
  suppression → retour à 10 000.

Migration `20260823200621_atelier_tresorerie`.

### Routes

`/api/tresorerie` (recoupement) · `/api/tresorerie/mouvements` (GET filtrable,
POST) · `/api/tresorerie/mouvements/[id]` (DELETE) · `/api/tresorerie/charges`
(GET, POST) · `/api/tresorerie/charges/[id]` (PATCH, DELETE).

Pas de `PATCH` sur un mouvement : une ligne fausse se supprime et se ressaisit.
Modifier un montant déjà rapproché d'une commande imposerait de rejouer le
contrôle de dépassement dans les deux sens pour un gain nul.

### Écrans

`/depenses` — saisie, filtre par mois et par poste, répartition.
`/tresorerie` — solde constaté, mois courant, six mois, répartition, prévision,
charges fixes.
`PaiementsCommande` — repris sur le journal réel.

Douze postes, dont les quatre ajoutés par l'utilisateur (internet, publicité,
commission, broderie). Les regroupements initialement proposés ont été éclatés :
une facture d'électricité qui double ne se voit pas si elle est noyée dans le
loyer.

### Trois règles tenues à l'écran, pas seulement dans le code

1. **Encaissé ≠ facturé.** Une commande de 80 000 F réglée de 20 000 F pèse
   20 000 F en trésorerie et 80 000 F dans `/rapports`. Un encart l'explique —
   sans lui, l'écart passerait pour une anomalie.
2. **Le mesuré et le prévu ne se mélangent pas.** Le solde est constaté ; la
   projection est dans son propre bloc et s'annonce comme telle.
3. **Une échéance déjà passée n'est pas reprojetée.** Loyer dû le 5, on est le
   23 : le mois en cours compte 0 — la charge est soit payée (donc au journal),
   soit en retard. Vérifié : août 0 F, septembre −50 000 F.

Comme les rapports, aucun repli sur des données d'exemple : hors session
l'écran dit pourquoi et propose la connexion. On prend des décisions d'achat
avec ce chiffre.

### Reprise des acomptes existants

`pnpm db:reprise-caisse [--dry]` reconstitue une entrée par acompte antérieur au
journal, datée de la création de la commande faute de mieux. Les lignes portent
`backfilled: true`, l'écran les signale (« date reconstituée ») et la trésorerie
affiche un avertissement. Idempotent, vérifié : 2 écritures pour 20 000 F, puis
0 à la relance.

⚠️ **Papercut préexistant** : `--env-file-if-exists` échoue sur Node 20.18 —
`db:make-superadmin`, `seed:dev` et `smoke:auth` sont cassés de la même façon.
Le nouveau script utilise `--env-file=.env` pour fonctionner ; les trois autres
restent à corriger.

### Vérifié

Saisie de deux dépenses → solde 10 000 → −35 000, répartition 67/33 · charge
fixe déclarée → prévision septembre −40 000, octobre −90 000 · versement sur
commande → acompte et solde suivent · dépassement refusé (409 `OVERPAYMENT`,
« il ne reste que 10 000 F ») · barre basse mobile à 6 entrées, 61 px chacune,
sans troncature à 368 px CSS · `lint`, `typecheck`, **582 tests**.

Les données de test ont été retirées : seule la reprise d'acompte légitime
subsiste.

## Audit complet — 2026-08-23

### Corrections portées avant l'audit

1. **Les cinq scripts CLI étaient cassés** — `--env-file-if-exists` n'existe pas
   sur Node 20.18 (« bad option »), alors que `engines` accepte `node >= 20`.
   `db:make-superadmin`, `seed:dev`, `smoke:auth`, `code:verif` et
   `db:reprise-caisse` échouaient tous avant de démarrer, sur un message qui ne
   dit rien de la cause : « node: .env.local: not found ».
   Corrigé par `scripts/charger-env.mjs`, chargé via `--import` :
   `process.loadEnvFile` (Node ≥ 20.6) fait le même travail depuis le code.
   `.env.local` est lu **en premier** car `loadEnvFile` n'écrase jamais une
   variable déjà posée — vérifié — donc le premier fichier lu l'emporte, ce qui
   reproduit la précédence de Next.js. Les scripts n'ont pas été modifiés, donc
   les tests qui les importent non plus.

2. **Affirmations fabriquées de la page d'accueil.** Les témoignages sont vidés :
   trois personnes nommées, avec ville et métier, n'avaient jamais rien dit. La
   section et son lien de navigation disparaissent d'eux-mêmes. Les chiffres du
   hero (« 50K+ », « 96 % ») et les gains des cas d'usage (« +35 % », « +60 % »)
   sont remplacés par des faits vérifiables en ouvrant l'application. Les
   originaux sont conservés dans `CHIFFRES_MAQUETTE` et `TEMOIGNAGES_MAQUETTE`.

### Ce qui a été vérifié — vert

| Contrôle | Résultat |
|---|---|
| 21 pages | toutes en 200 |
| 8 routes API sans session | toutes en 401 |
| 5 mutations sans en-tête CSRF | toutes en 403 |
| Liens, 12 pages × 375 et 1280 px | **aucun lien mort**, aucune ancre orpheline |
| Débordement horizontal | aucun, sur les 12 pages aux deux largeurs |
| Validation du journal de caisse | 10 cas malformés refusés, caisse intacte |
| Isolation entre ateliers | commande d'un autre compte → **404**, pas 403 |
| Barre basse mobile (6 entrées) | 61 px chacune, 57 px de haut, sans troncature à 368 px |
| `lint` · `typecheck` · tests · `build` | verts, **582 tests** |

### Défauts trouvés — par gravité

**1. La fiche commande affiche les données d'un client fictif.** Confirmé à
l'écran sur la commande #001 de Salimata Zongo, cliente réelle dont le numéro en
base est `+226 78 12 34 56` :

| Affiché | Réalité |
|---|---|
| `+226 70 11 22 33` | faux numéro — quelqu'un l'appellerait |
| « 6ᵉ commande » | c'est sa première |
| « Wax hollandais orange · 6 yards » | la commande porte « Robe wax cérémonie » |
| Mesures 96 / 76 / 102 / 138 cm | simulées — un tailleur coupe dans du tissu avec ça |

Le tout sous son vrai nom, sans rien qui distingue le réel du simulé. Source :
`clientPrincipal`, `mesuresResume`, `etapesFabrication`, `rappels` dans
`FicheCommande.tsx`, et `clientPrincipal`, `mesuresCorporelles`,
`recapitulatifCommande`, `tarificationCommande` dans `RecapitulatifCommande.tsx`.
Les données réelles existent pourtant : `useClients` et `useReleveMesures` sont
déjà branchés ailleurs.

**2. L'écran Notifications est entièrement simulé.** Il annonce « 5 non lues sur
10 » et affiche dix lignes ; la base en contient **zéro**. Le modèle
`Notification` et la route `/api/notifications` existent — l'écran ne les lit
pas.

**3. Le nom de l'atelier est codé en dur.** `ATELIER_NOM = 'Atelier Koné'`
s'affiche sur `/rapports`, `/tresorerie`, `/depenses` et dans les écrans
d'authentification, quel que soit le compte connecté. Même famille que l'équipe
d'artisans et le carnet clients, corrigés précédemment.

**4. Paramètres en lecture seule.** Aucun champ modifiable ; les valeurs
viennent de l'objet `atelier` simulé.

**5. Grille tarifaire simulée** — `tarifs` dans `FormulaireNouvelleCommande`.

**6. Notes d'atelier simulées** — `NotesAtelier.tsx`.

### Constaté, non corrigé — arbitrage utilisateur

- `REFRESH_TIMEOUT_MS = 10_000` dans `lib/api.ts` (**fichier protégé**). Neon
  répond en 5 à 8 s sur le plan gratuit — mesuré à 7,8 s pour l'affichage de la
  trésorerie. Le rafraîchissement de jeton peut dépasser ce délai et faire
  basculer un écran en démonstration alors que la session est valide.
  Correctif proposé, une ligne :
  `const REFRESH_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_REFRESH_TIMEOUT_MS) || 10_000;`
  — défaut inchangé, réglable par environnement.

## Défaut n°1 corrigé — la fiche commande lit ses vraies données (2026-08-23)

L'audit du jour l'avait classé le plus grave : la fiche de la commande #001
affichait, sous le vrai nom de Salimata Zongo, le téléphone, le rang, le tissu
et les mesures d'une cliente d'exemple. Un tailleur coupe dans du tissu avec ces
chiffres.

### La cause, plus bête que le symptôme

`useCommandes.versUI` jetait la moitié de ce que l'API renvoyait déjà :
`customer.id`, `fabric`, `color`, `notes`, `createdAt` étaient sélectionnés
côté serveur et perdus à la conversion. Sans identifiant client, la fiche ne
pouvait rejoindre ni le carnet ni le relevé de mesures — d'où le repli sur
`clientPrincipal`, une constante figée. Le correctif tient d'abord à faire
transiter ces champs.

`Commande` gagne `sequence`, `clientId`, `tissu`, `notes`, `creeLe`.

### Avant / après, sur la commande réelle #001

| Affiché avant | Affiché maintenant |
|---|---|
| `+226 70 11 22 33` (numéro d'une autre) | `+226 78 12 34 56` — celui de sa fiche |
| « 6ᵉ commande » | « 1ʳᵉ commande » — comptée dans ses commandes |
| « Wax hollandais orange · 6 yards » | « Wax hollandais — 6 yards · Ankara orange & bleu » |
| Mesures 96 / 76 / 102 / 138 cm | « Aucune mesure relevée pour Salimata Zongo. Prenez le relevé avant de tailler. » |
| « Essayage aujourd'hui 15h » | « En cours » — le statut réel |
| 7 étapes datées inventées | 4 jalons déduits du statut, « Commande enregistrée · 21 août » |
| Deux rappels SMS simulés | section retirée — aucune donnée derrière |
| Grille tarifaire à 3 lignes inventées | montant, encaissé, reste — tirés du journal de caisse |

### Ce qui a été décidé, et pourquoi

**Quatre jalons plutôt que sept.** Une commande porte un statut, pas un
historique d'étapes datées. Sept étapes ne pouvaient être honnêtes qu'en
inventant leurs dates ; quatre jalons calqués sur le statut disent ce qu'on
sait. Les cases sans date restent vides — pas de « — » décoratif.

**Les rappels disparaissent.** Rien en base ne les porte, et aucun envoi n'est
branché. Un bloc qui annonce « SMS essayage envoyé » alors qu'aucun SMS n'est
parti est pire qu'un bloc absent.

**L'absence s'affiche.** Mesures non relevées, tissu non renseigné, artisan non
assigné, aucune consigne : chaque cas a sa phrase. C'est la règle déjà tenue sur
la trésorerie, étendue ici.

**Les neuf constantes simulées sont supprimées** de `mock/atelier.ts`
(`clientPrincipal`, `mesuresCorporelles`, `mesuresResume`, `etapesFabrication`,
`rappels`, `recapitulatifCommande`, `tarificationCommande` et leurs deux types).
Les laisser inutilisées, c'était les rendre disponibles pour la prochaine fiche.

### Vérifié

Écran réel, commande #001, session ouverte : les huit lignes du tableau ci-dessus
relevées une à une, onglets « Suivi » et « Récapitulatif ». Mode démonstration
sur `#087` : rang « 2ᵉ commande » (compté, plus déclaré), mesures annoncées non
consultables. `lint`, `typecheck`, `build`, et **23 tests neufs** sur
`lib/commande-fiche.ts` (rang, libellé ordinal, jalons, extrait de mesures,
initiales) — 607 verts au total.

### Reste du même écran, non traité

Les notes d'atelier (défaut n°6) restent simulées : « Awa T. · 18 jan » s'affiche
toujours sur la commande de Salimata Zongo. Les boutons « Imprimer », « WhatsApp
cliente » et « Valider essayage » de l'en-tête n'ont jamais été branchés — non
listés à l'audit, à trancher.

## Défaut n°2 corrigé — l'écran Notifications lit la base (2026-08-24)

L'écran annonçait « 5 non lues sur 10 » et affichait dix lignes ; la base en
contenait zéro. Le modèle `Notification` et la route `/api/notifications`
existaient depuis le starter — l'écran ne les avait jamais ouverts.

### Ce qui a été branché

`lib/notifications.ts` traduit la forme serveur (`type`, `data`, `readAt`,
`createdAt`) en forme d'affichage (catégorie, icône, pastille, moment relatif).
`lib/useNotifications.ts` lit `/api/notifications?limit=50` et poste le
marquage « lu » en `PATCH` — même repli simulé que `useCommandes` hors session.

Le marquage part désormais au serveur. Il vivait dans un `useState` : la
pastille bleue revenait à chaque rechargement, et l'on relisait dix fois la
même notification.

### Trois choix qui tiennent l'écran honnête

1. **Le sous-titre disparaît.** « N non lues sur M » était calculé sur le jeu
   simulé. Le compte réel vit dans les onglets de filtre, à côté de ce qu'il
   décrit — un chiffre au même endroit que sa liste ne peut plus la contredire.
2. **Les onglets suivent les données.** « Clients », « Livraisons » ne
   s'affichent que si une notification les porte. Un filtre qui ne peut rien
   afficher est une promesse en l'air.
3. **Un type inconnu reste lisible** plutôt que de casser la liste : catégorie
   « Atelier », icône neutre. La table ne décrit que les trois types réellement
   émis (`PAYMENT_RECEIVED`, `WITHDRAWAL_REQUESTED`, `WELCOME`) — inventer des
   entrées pour des types sans producteur décrirait une application imaginaire.

Le lien d'action ne suit que `data.commandeId`. Le `PAYMENT_RECEIVED` du starter
porte un `orderId` qui référence le modèle `Order` générique, pas
`TailoringOrder` : le suivre mènerait à une fiche introuvable.

### Ce que l'écran affichera vraiment : rien

Aucun événement de l'atelier n'émet de notification. Les trois types existants
viennent du starter (inscription OAuth, retrait, webhook de paiement) et aucun
ne se déclenche dans l'usage courant d'un atelier. Une session réelle verra donc
« Aucune notification », avec la phrase qui dit pourquoi — sans elle, un écran
nu passe pour une panne de chargement.

**Le vrai manque est en amont, et n'était pas dans l'audit** : il faudrait un
cron qui signale les commandes en retard et les livraisons du lendemain. C'est
la seule notification utile à un tailleur seul — être averti d'un versement
qu'on vient soi-même de saisir n'apprend rien. À décider.

### Vérifié

`lint`, `typecheck`, `build`, **706 tests** (dont 14 neufs sur
`lib/notifications.ts` : apparences, lien d'action, moments relatifs, horloge
client en avance, type inconnu). `/notifications` répond 200.

**Non vérifié à l'écran** : le navigateur de test était occupé. L'état vide
réel et l'aller-retour du marquage « lu » restent à constater.

## Les cinq points d'arbitrage, tranchés (2026-08-24)

### 1. Le correctif du délai de rafraîchissement était inerte

`lib/api.ts` lisait bien `NEXT_PUBLIC_REFRESH_TIMEOUT_MS`, mais la variable
n'était posée nulle part : ni `.env`, ni `.env.example`, ni le README. Le défaut
restait donc 10 000 ms face aux 7,8 s mesurés sur Neon — un rapport de 1,3, donc
le défaut d'origine (une session valide qui bascule en démonstration) était
toujours vivant. Posée à **20 000 ms**, documentée dans `.env.example`.

### 2. Cron `atelier-alertes` — les notifications ont enfin un producteur

`lib/server/atelier/alertes.ts`, appelé chaque matin à 6h UTC : l'atelier ouvre
avec ses retards de la veille déjà posés plutôt que de les découvrir le soir.

- **Retard** — échéance strictement antérieure à aujourd'hui. Une commande due
  aujourd'hui n'est pas en retard, elle est due.
- **Livraison du lendemain** — fenêtre bornée à la seule journée de demain.
- Le statut suit l'alerte : une commande signalée en retard bascule en `LATE`.
  Sans cela la notification dirait « en retard » pendant que la fiche afficherait
  « en cours », et rien ne dirait laquelle se trompe. C'est aussi le premier
  producteur de `LATE` — jusqu'ici le statut existait sans que rien ne l'écrive,
  donc le badge « urgent » ne s'allumait jamais.
- Idempotent : `dedupeKey` porte le jour, un rejeu après incident ne réveille pas
  l'atelier deux fois.

Le versement encaissé n'émet **rien**, délibérément : être averti d'une saisie
qu'on vient de faire soi-même n'apprend rien.

### 3. Les trois boutons de la fiche commande

- **Imprimer** → `window.print()`.
- **WhatsApp** → `wa.me` sur le numéro réel du client. Sans numéro joignable, le
  bouton reste visible mais annonce « Pas de numéro » : un `wa.me` tronqué ouvre
  une conversation vide, ou avec le mauvais correspondant.
- **« Valider essayage »** n'avait aucune route derrière — et plus largement,
  **rien ne permettait de faire avancer une commande** : elle naissait « en
  cours » et n'en bougeait plus jamais. `PATCH /api/commandes/[id]` comble ce
  trou. Le libellé nomme le geste du jour (« Passer à l'essayage », « Valider
  l'essayage », « Marquer livrée ») et le bouton disparaît une fois la commande
  livrée. `deliveredAt` suit le statut dans les deux sens : une commande sortie
  de « livrée » par correction ne garde pas sa date, sinon les rapports
  compteraient une livraison qui n'a pas eu lieu.

Le changement de statut n'est **pas** posé localement avant la réponse serveur,
contrairement au marquage « lu » d'une notification : un statut faux se voit sur
le planning, dans les rapports et sur la fiche client.

### 4. Les notifications suivent la règle trésorerie

Plus de repli sur le jeu simulé hors session. Une notification affirme un fait
daté — « acompte reçu », « commande en retard » ; une alerte inventée se
confondrait avec une vraie. L'écran dit pourquoi et propose la connexion, comme
la trésorerie. Les 115 lignes de notifications d'exemple sont supprimées de
`mock/atelier.ts`.

### 5. Commité

Le tout était dans l'arbre de travail depuis deux jours.

### Vérifié

`format`, `lint`, `typecheck`, `build`, **735 tests** — dont 11 sur la route
`PATCH /api/commandes/[id]` (CSRF, 401, statut hors domaine, 404 pour l'atelier
voisin, `deliveredAt` dans les deux sens) et 10 sur `signalerEcheances`
(fenêtres de dates, bascule `LATE`, déduplication, passage à vide).

Le garde-fou `vercel-json-shape.test.ts` épinglait l'inventaire des crons : il a
correctement refusé le septième avant d'être mis à jour. La table du README en
annonçait cinq pour six existantes — dérive antérieure, corrigée au passage.

**Non vérifié à l'écran** : le navigateur de test est resté occupé. Le cron n'a
pas été déclenché contre une vraie base, et les trois boutons n'ont pas été
cliqués.
