import type { Dictionnaire } from '@/lib/i18n/traduire';

/**
 * Traductions anglaises.
 *
 * La clé est la phrase française. Une clé absente n'est pas une erreur : le
 * moteur rend alors le français, et l'écran reste lisible. Voir
 * `traduire.ts` pour le raisonnement complet.
 *
 * Vocabulaire retenu, une fois pour toutes :
 *   atelier → workshop      commande → order        acompte → deposit
 *   tenue   → garment       façon    → tailoring    relevé  → measurements
 *   artisan → tailor        échéance → due date     caisse  → cash
 */
export const en: Dictionnaire = {
  // ---------------------------------------------------------------- commun
  Enregistrer: 'Save',
  'Enregistrement…': 'Saving…',
  'Enregistré.': 'Saved.',
  Annuler: 'Cancel',
  Ajouter: 'Add',
  'Ajout…': 'Adding…',
  Modifier: 'Edit',
  Supprimer: 'Delete',
  Retirer: 'Remove',
  Changer: 'Change',
  Fermer: 'Close',
  Confirmer: 'Confirm',
  Rechercher: 'Search',
  Filtrer: 'Filter',
  Aujourd: 'Today',
  'aujourd’hui': 'today',
  demain: 'tomorrow',
  'Chargement…': 'Loading…',
  Oui: 'Yes',
  Non: 'No',
  Actif: 'Active',
  Inactif: 'Inactive',
  Total: 'Total',
  Tous: 'All',
  Toutes: 'All',
  Aucun: 'None',
  Aucune: 'None',
  Optionnel: 'Optional',
  facultatif: 'optional',
  'Date invalide.': 'Invalid date.',
  'Heure invalide.': 'Invalid time.',
  'F CFA': 'CFA',
  à: 'to',

  // ------------------------------------------------------------ navigation
  'Tableau de bord': 'Dashboard',
  Accueil: 'Home',
  Planning: 'Schedule',
  Commandes: 'Orders',
  Clients: 'Clients',
  Mesures: 'Measurements',
  Trésorerie: 'Cash',
  Caisse: 'Till',
  Dépenses: 'Expenses',
  Rapports: 'Reports',
  Paramètres: 'Settings',
  Notifications: 'Notifications',
  'Navigation principale': 'Main navigation',
  'Chargement de l’atelier…': 'Loading workshop…',
  'Mode démonstration — pages accessibles sans connexion. Retirez':
    'Demo mode — pages open without signing in. Remove',
  'avant toute mise en ligne.': 'before going live.',

  // ------------------------------------------------------------- apparence
  'Activer le thème clair': 'Switch to light theme',
  'Activer le thème sombre': 'Switch to dark theme',
  Apparence: 'Appearance',
  'Thème de l’interface': 'Interface theme',
  Sombre: 'Dark',
  Clair: 'Light',
  'Mémorisé sur cet appareil, pas sur votre compte.':
    'Remembered on this device, not on your account.',

  // ----------------------------------------------------------------- langue
  Langue: 'Language',
  'Langue de l’interface': 'Interface language',
  'Choisissez la langue de l’interface.': 'Choose the language of the interface.',
  'L’arabe se lit de droite à gauche : l’interface se retourne entièrement.':
    'Arabic reads right to left, so the whole interface flips.',

  // ------------------------------------------------- paramètres · atelier
  Atelier: 'Workshop',
  Équipe: 'Team',
  Tarification: 'Pricing',
  Compte: 'Account',
  'Informations de l’atelier': 'Workshop details',
  'Nom de l’atelier': 'Workshop name',
  'Mon atelier': 'My workshop',
  'Le nom n’a pas pu être enregistré.': 'The name could not be saved.',
  'Téléphone de l’atelier': 'Workshop phone',
  'Le numéro sur lequel on joint l’atelier.': 'The number people reach the workshop on.',
  'Le numéro n’a pas pu être enregistré.': 'The number could not be saved.',
  Ville: 'City',
  'La ville n’a pas pu être enregistrée.': 'The city could not be saved.',
  Adresse: 'Address',
  'L’adresse n’a pas pu être enregistrée.': 'The address could not be saved.',
  Horaires: 'Opening hours',
  'Heure d’ouverture': 'Opening time',
  'Heure de fermeture': 'Closing time',
  'Les horaires n’ont pas pu être enregistrés.': 'The opening hours could not be saved.',
  'Indiquez l’ouverture et la fermeture, ou aucune des deux.':
    'Set both opening and closing, or neither.',
  'La fermeture doit venir après l’ouverture.': 'Closing must come after opening.',
  Devise: 'Currency',
  'Tous les montants enregistrés sont en francs CFA.': 'Every amount on record is in CFA francs.',
  Logo: 'Logo',
  'Le logo n’a pas pu être envoyé.': 'The logo could not be uploaded.',
  'Le logo n’a pas pu être retiré.': 'The logo could not be removed.',
  'Session expirée — reconnectez-vous pour enregistrer le logo.':
    'Session expired — sign in again to save the logo.',
  '« {fichier} » est trop lourd — réduisez l’image et réessayez.':
    '“{fichier}” is too large — shrink the image and try again.',
  'Format refusé — choisissez une image JPEG, PNG ou WebP.':
    'Format rejected — choose a JPEG, PNG or WebP image.',
  'Le stockage d’images n’est pas configuré sur ce serveur.':
    'Image storage is not configured on this server.',
  'L’envoi a échoué — le logo n’a pas été enregistré.': 'Upload failed — the logo was not saved.',
  'Logo de {atelier}': '{atelier} logo',

  // --------------------------------------------------- paramètres · équipe
  '{n} actifs sur {total}': { one: '{n} active of {total}', other: '{n} active of {total}' },
  '· exemples': '· samples',
  'Chargement de l’équipe…': 'Loading team…',
  'Aucun artisan. Ajoutez-en un pour pouvoir assigner des commandes et remplir le planning.':
    'No tailors yet. Add one to assign orders and fill the schedule.',
  'Activer {nom}': 'Enable {nom}',
  'Ajouter un artisan': 'Add a tailor',
  'Les initiales sont déduites du nom ; elles identifient l’artisan sur les commandes et le planning.':
    'Initials come from the name; they identify the tailor on orders and in the schedule.',
  'Ajouter à l’équipe': 'Add to team',
  'Nom complet': 'Full name',
  Rôle: 'Role',
  'Tailleur senior': 'Senior tailor',
  Couturière: 'Seamstress',
  'Capacité quotidienne (heures)': 'Daily capacity (hours)',
  'Un apprenti ne tient pas les 8 h d’un tailleur senior — le planning s’appuie sur ce chiffre.':
    'An apprentice cannot hold a senior tailor’s 8 hours — the schedule relies on this figure.',
  'Téléphone (facultatif)': 'Phone (optional)',
  'Pour joindre l’artisan quand une tenue est promise pour le lendemain.':
    'To reach the tailor when a garment is promised for the next day.',
  '{n} h / jour': '{n} h / day',

  // ---------------------------------------------- paramètres · tarification
  'Grille tarifaire': 'Price list',
  'Ajouter un tarif': 'Add a price',
  'Chargement de la grille…': 'Loading price list…',
  'Grille d’exemple — connectez-vous pour composer la vôtre.':
    'Sample list — sign in to build your own.',
  'Aucun tarif enregistré. Ajoutez vos prix de façon : ils seront proposés à chaque nouvelle commande.':
    'No prices yet. Add your tailoring rates: they will be offered on every new order.',
  'Prix de {unite}': '{unite} price',
  façon: 'tailoring',
  'Modifier le tarif {tenue}': 'Edit the {tenue} price',
  'Supprimer le tarif {tenue}': 'Delete the {tenue} price',
  'Nouveau tarif': 'New price',
  'Modifier le tarif': 'Edit price',
  'Prix de façon appliqué par défaut à ce type de tenue.':
    'Default tailoring price for this kind of garment.',
  'Type de tenue': 'Garment type',
  'Prix de façon': 'Tailoring price',
  'En francs CFA, sans décimales.': 'In CFA francs, no decimals.',

  // --------------------------------------------- paramètres · notifications
  'Rappels automatiques': 'Automatic reminders',
  'Relevés chaque matin et déposés dans vos notifications.':
    'Checked every morning and left in your notifications.',
  'Chargement des réglages…': 'Loading settings…',
  'Connectez-vous pour régler vos rappels.': 'Sign in to set up your reminders.',

  // --------------------------------------------------- paramètres · compte
  'Votre compte': 'Your account',
  'Propriétaire de l’atelier': 'Workshop owner',
  'Adresse e-mail': 'Email address',
  Téléphone: 'Phone',
  'Le même que celui de l’onglet Atelier.': 'The same one as on the Workshop tab.',
  'Changer le mot de passe': 'Change password',
  'Se déconnecter': 'Sign out',
  'Déconnexion…': 'Signing out…',
  'Se déconnecter ?': 'Sign out?',
  'Pour revenir, il faudra retaper votre mot de passe puis saisir un code envoyé à votre adresse e-mail.':
    'To come back you will need your password again, then a code sent to your email.',
  'Rester connecté': 'Stay signed in',
  'Les commandes, la caisse et les mesures restent enregistrées — c’est l’accès depuis cet appareil qui se ferme.':
    'Orders, cash and measurements stay on record — it is access from this device that closes.',

  // ------------------------------------------------------------- rappels
  'Commande en retard': 'Order overdue',
  'Dès qu’une commande dépasse son échéance de livraison.':
    'As soon as an order passes its due date.',
  'Livraison demain': 'Delivery tomorrow',
  'La veille, pour les commandes à remettre le lendemain.':
    'The day before, for orders due the next day.',

  // ------------------------------------------------------------- cloche
  'Aucune notification non lue': 'No unread notifications',
  '{n} notifications non lues': {
    one: '{n} unread notification',
    other: '{n} unread notifications',
  },
  'exemple : {exemple}': 'example: {exemple}',
  'Choisissez un pays.': 'Choose a country.',
  '{ecran} — écran à venir': '{ecran} — screen coming soon',

  // --------------------------------------------------------- sous-titres
  'Carnet clients': 'Client book',
  'Fiches, mesures et tissus': 'Records, measurements and fabrics',
  'Suivi de confection': 'Production tracking',
  'Nouvelle commande': 'New order',
  'Modèle, artisan, tarif et échéance': 'Garment, tailor, price and due date',
  'Relevé corporel, tissus apportés et modèle choisi':
    'Body measurements, fabrics brought in and chosen garment',

  // ------------------------------------------------------ authentification
  Connexion: 'Sign in',
  'Connexion…': 'Signing in…',
  'Se connecter': 'Sign in',
  'Accédez à vos commandes, votre planning et vos clients.':
    'Reach your orders, your schedule and your clients.',
  'Pas encore de compte ?': 'No account yet?',
  'Créer un atelier': 'Create a workshop',
  'Mot de passe': 'Password',
  'Mot de passe oublié ?': 'Forgot your password?',
  'Mot de passe oublié': 'Forgotten password',
  'Nous vous envoyons un code pour en choisir un nouveau.':
    'We will send you a code so you can choose a new one.',
  'Vous vous en souvenez ?': 'Remembered it?',
  'Si un compte existe pour {email}, un code de réinitialisation vient d’être envoyé.':
    'If an account exists for {email}, a reset code has just been sent.',
  'J’ai reçu mon code': 'I have my code',
  'Envoi…': 'Sending…',
  'Envoyer le code': 'Send the code',
  'Confirmer la connexion': 'Confirm sign-in',
  'Un code à 8 caractères vient d’être envoyé à {email}.':
    'An 8-character code has just been sent to {email}.',
  'Changer d’adresse': 'Change address',
  'Code reçu par e-mail': 'Code sent by email',
  'Il expire au bout de quelques minutes.': 'It expires after a few minutes.',
  'Nouveau code envoyé. Le précédent ne fonctionne plus.':
    'New code sent. The previous one no longer works.',
  'Vérification…': 'Checking…',
  'Je n’ai rien reçu — renvoyer un code': 'Nothing arrived — send another code',
  'Vérifiez votre e-mail': 'Check your email',
  'Saisissez le code à 8 caractères que nous venons de vous envoyer.':
    'Enter the 8-character code we have just sent you.',
  'Mauvaise adresse ?': 'Wrong address?',
  'Recommencer l’inscription': 'Start signing up again',
  'Code de vérification': 'Verification code',
  'Si un compte existe pour cette adresse, un nouveau code vient d’être envoyé.':
    'If an account exists for this address, a new code has just been sent.',
  'Vérifier mon compte': 'Verify my account',
  'Renvoyer le code': 'Send the code again',
  'Nouveau mot de passe': 'New password',
  'Saisissez le code reçu par e-mail et choisissez votre nouveau mot de passe.':
    'Enter the code sent by email and choose your new password.',
  'Code perdu ?': 'Lost the code?',
  'En demander un autre': 'Request another',
  'Code reçu': 'Code received',
  '10 caractères minimum.': '10 characters minimum.',
  'Changer mon mot de passe': 'Change my password',
  'Retour à l’atelier': 'Back to the workshop',
  ou: 'or',
  'Continuer avec Google': 'Continue with Google',

  // messages renvoyés par l’API, traduits à l’affichage
  'Adresse e-mail ou mot de passe incorrect.': 'Wrong email address or password.',
  'Votre compte n’est pas encore vérifié. Consultez vos e-mails.':
    'Your account is not verified yet. Check your email.',
  'Trop de tentatives. Réessayez dans quelques minutes.':
    'Too many attempts. Try again in a few minutes.',
  'Ce compte est suspendu. Contactez le support.': 'This account is suspended. Contact support.',
  'Le code n’a pas pu être envoyé. Réessayez dans un instant.':
    'The code could not be sent. Try again in a moment.',
  'Code incorrect. Vérifiez les 8 caractères reçus par e-mail.':
    'Wrong code. Check the 8 characters sent to your email.',
  'Ce code a expiré. Demandez-en un nouveau.': 'This code has expired. Request a new one.',
  'Trop d’essais sur ce code. Demandez-en un nouveau.':
    'Too many tries on this code. Request a new one.',
  'Impossible de joindre le serveur.': 'Cannot reach the server.',
  'Code invalide ou expiré. Vérifiez les 8 caractères saisis.':
    'Invalid or expired code. Check the 8 characters you entered.',
  'Le mot de passe doit faire au moins 10 caractères.':
    'The password must be at least 10 characters.',
  'Ce mot de passe est trop courant. Choisissez-en un autre.':
    'This password is too common. Choose another one.',
  'Ce mot de passe a fuité lors d’une brèche connue. Choisissez-en un autre.':
    'This password appeared in a known breach. Choose another one.',

  // ------------------------------------------------------------ téléphone
  'Indicatif du pays': 'Country code',
  'Numéro de téléphone invalide.': 'Invalid phone number.',

  // ------------------------------------------------------- tableau de bord
  'Bonjour {nom}': 'Hello {nom}',
  'Commandes du jour': 'Orders for the day',
  'Commandes en cours': 'Orders in progress',
  'Commandes livrées': 'Orders delivered',
  'Chiffre d’affaires du mois': 'Revenue this month',
  'Livraison à temps': 'On-time delivery',
  'Délai moyen': 'Average turnaround',
  'Calcul des indicateurs…': 'Computing figures…',
  'Indicateurs indisponibles': 'Figures unavailable',
  'Notifications indisponibles': 'Notifications unavailable',
  'Non lue': 'Unread',
  'AtelierPro, accueil': 'AtelierPro, home',
  'Ouvrir le carnet clients': 'Open the client book',

  // -------------------------------------------- commandes · liste et fiche
  Commande: 'Order',
  'Commande en cours': 'Order in progress',
  'Rechercher une commande': 'Search for an order',
  'Rechercher un client, une tenue, une référence…': 'Search a client, a garment, a reference…',
  'Aucune commande ne correspond': 'No order matches',
  'Aucune commande enregistrée.': 'No order recorded.',
  'Cette commande n’existe pas': 'This order does not exist',
  'Chargement de la commande…': 'Loading the order…',
  'Retour aux commandes': 'Back to orders',
  'Retour à la liste': 'Back to the list',
  'Réf.': 'Ref.',
  Statut: 'Status',
  Avancement: 'Progress',
  'Livraison prévue': 'Delivery due',
  'Livraison calculée': 'Computed delivery',
  'Date de création': 'Created on',
  Assigné: 'Assigned',
  'Assigné à': 'Assigned to',
  'Non assigné': 'Unassigned',
  Artisan: 'Tailor',
  Tissu: 'Fabric',
  Instructions: 'Instructions',
  'Modèle choisi': 'Chosen model',
  'Palette de mesures': 'Measurement set',
  'Montant de la commande': 'Order amount',
  'Voir la fiche client': 'View client record',
  'Page précédente': 'Previous page',
  'Page suivante': 'Next page',

  // ------------------------------------------- commandes · notes d’atelier
  'Notes atelier': 'Workshop notes',
  'Chargement des notes…': 'Loading notes…',
  'Ajouter une note ou observation…': 'Add a note or observation…',
  'Nouvelle note d’atelier': 'New workshop note',
  'Publier la note': 'Post the note',

  // ----------------------------------------------------- nouvelle commande
  'Cliente / client': 'Client',
  Client: 'Client',
  'Client concerné': 'Client concerned',
  'Nouveau client': 'New client',
  'Le genre détermine la palette de mesures qui lui sera présentée.':
    'Gender determines which set of measurements is shown.',
  'La référence visuelle que le client souhaite reproduire.':
    'The visual reference the client wants reproduced.',
  'Tissus apportés': 'Fabrics brought in',
  'Photographiez chaque coupon : motif, métrage, couleur réelle.':
    'Photograph each length: pattern, yardage, true colour.',
  'Wax hollandais — 6 yards': 'Dutch wax — 6 yards',
  'Wax 6 yards — marché de Rood Woko': 'Wax 6 yards — Rood Woko market',
  'Notes / instructions': 'Notes / instructions',
  'Ces consignes sont lues par l’artisan au moment de la coupe.':
    'The tailor reads these instructions at cutting time.',
  'Ex : col bateau, fermeture invisible dos, finitions dorées sur les ourlets.':
    'E.g. boat neck, invisible back zip, gold finish on the hems.',
  'Ex : épaule droite légèrement plus basse, prévoir 1 cm de reprise.':
    'E.g. right shoulder slightly lower, allow 1 cm of take-in.',
  'Acompte versé': 'Deposit paid',
  'En francs CFA. Enregistré comme recette dans la caisse.':
    'In CFA francs. Recorded as income in the cash ledger.',
  'Réglé en': 'Paid by',
  'Sert au rapprochement de caisse en fin de mois.':
    'Used for the end-of-month cash reconciliation.',
  'Sert au bouton WhatsApp de la fiche client et de la commande.':
    'Powers the WhatsApp button on the client record and the order.',
  'Robe wax cérémonie — Mariam C.': 'Wax ceremony dress — Mariam C.',

  // --------------------------------------------------------------- clients
  'Rechercher un client': 'Search for a client',
  'Rechercher un client…': 'Search for a client…',
  'Chargement des clients…': 'Loading clients…',
  'Aucun client enregistré': 'No client on file',
  'Aucun numéro enregistré pour ce client.': 'No number on file for this client.',
  'Client fidèle': 'Regular client',
  'Commandes passées': 'Orders placed',
  'Dernière commande': 'Last order',
  Effacer: 'Clear',
  'Effacer la recherche': 'Clear the search',

  // -------------------------------------------------- planning et capacité
  'Chargement du planning…': 'Loading the schedule…',
  'Semaine précédente': 'Previous week',
  'Semaine suivante': 'Next week',
  Jour: 'Day',
  'Légende :': 'Key:',
  Libre: 'Free',
  'Affecter une tâche': 'Assign a task',
  'Intitulé de la tâche': 'Task name',
  'Durée (heures)': 'Duration (hours)',
  'Capacité du jour': 'Capacity for the day',
  'Charge globale de l’atelier': 'Overall workshop load',
  Disponibles: 'Available',
  Saturés: 'Full',
  'Prochaine dispo': 'Next free slot',
  'Aucun artisan actif': 'No active tailor',
  'Composer l’équipe': 'Build the team',

  // ---------------------------------------------- paiements d’une commande
  Paiements: 'Payments',
  'Chargement des versements…': 'Loading payments…',
  'Enregistrer un versement': 'Record a payment',
  'Montant (F CFA)': 'Amount (F CFA)',
  'Date de l’encaissement': 'Date received',
  'Le jour où l’argent est entré, pas celui de la saisie.':
    'The day the money came in, not the day it was typed in.',
  'Réglé par': 'Paid by',
  'Note (facultatif)': 'Note (optional)',
  'Déjà encaissé': 'Already received',
  'Reste à payer': 'Left to pay',
  'Part du montant encaissée': 'Share of the amount received',
  '· date reconstituée': '· date reconstructed',

  // ------------------------------------------------ trésorerie et dépenses
  'Trésorerie indisponible': 'Treasury unavailable',
  'Dépenses indisponibles': 'Expenses unavailable',
  'Calcul du solde…': 'Computing balance…',
  'Chargement du journal…': 'Loading the ledger…',
  Recettes: 'Income',
  Encaissé: 'Received',
  Résultat: 'Net result',
  Prévision: 'Forecast',
  'Six derniers mois': 'Last six months',
  'Total 6 mois': '6-month total',
  'Total facturé': 'Total billed',
  'Total des dépenses': 'Total expenses',
  'Mois précédent': 'Previous month',
  'Mois suivant': 'Next month',
  'Enregistrer une dépense': 'Record an expense',
  Libellé: 'Label',
  'Loyer de l’atelier': 'Workshop rent',
  Poste: 'Category',
  'Par poste': 'By category',
  'Tous les postes': 'All categories',
  'Filtrer par poste': 'Filter by category',
  'Date du décaissement': 'Date paid out',
  'La date est celle où l’argent est sorti, pas celle de la saisie.':
    'The date is when the money left, not when it was typed in.',
  'Charges fixes': 'Fixed charges',
  'Déclarer une charge fixe': 'Declare a fixed charge',
  'Montant mensuel (F CFA)': 'Monthly amount (F CFA)',
  'Jour d’échéance': 'Due day',
  'Entre 1 et 28 — au-delà, février n’aurait pas d’échéance certaines années.':
    'Between 1 and 28 — beyond that, February would have no due date some years.',
  'Elle sert uniquement à la prévision. Aucun mouvement n’est écrit en caisse tant que vous n’avez pas payé.':
    'It feeds the forecast only. Nothing is written to the cash ledger until you actually pay.',
  'solde projeté': 'projected balance',
  '— reste du mois': '— rest of the month',
  encaissé: 'received',
  facturé: 'billed',

  // ----------------------------------------------- téléversement de photos
  'Photo ou glisser-déposer': 'Photo or drag and drop',

  // --------------------------------------- vocabulaire · genres et statuts
  Femme: 'Women',
  Homme: 'Men',
  'En cours': 'In progress',
  Essayage: 'Fitting',
  Livraison: 'Delivery',
  'En retard': 'Late',
  Livré: 'Delivered',
  Terminé: 'Done',
  Planifié: 'Planned',
  Bloqué: 'Blocked',

  // ------------------------- vocabulaire · étapes et jalons d’une commande
  Modèle: 'Model',
  'Commande enregistrée': 'Order recorded',
  Confection: 'Making',

  // --------------------------------------- vocabulaire · postes de dépense
  'Tissus et fournitures': 'Fabrics and supplies',
  'Salaires et main-d’œuvre': 'Wages and labour',
  'Broderie et façon': 'Embroidery and finishing',
  Commissions: 'Commissions',
  Loyer: 'Rent',
  'Électricité et eau': 'Electricity and water',
  'Internet et téléphone': 'Internet and phone',
  'Machines et entretien': 'Machines and upkeep',
  'Transport et livraison': 'Transport and delivery',
  'Taxes et patente': 'Taxes and licence',
  Publicité: 'Advertising',
  Divers: 'Miscellaneous',

  // -------------------------------------- vocabulaire · modes de règlement
  Espèces: 'Cash',
  'Mobile Money': 'Mobile Money',
  Virement: 'Bank transfer',
  Carte: 'Card',

  // ---------------------------------------- palettes de mesures · sections
  Haut: 'Top',
  Bas: 'Bottom',
  'Buste, manches et longueur d’habit': 'Bust, sleeves and garment length',
  Pantalon: 'Trousers',
  'Buste, robe et manches': 'Bust, dress and sleeves',
  'Jupe, pantalon et montant': 'Skirt, trousers and rise',

  // ------------------------------------------ palettes de mesures · relevé
  'Tour de cou': 'Neck',
  Épaule: 'Shoulder',
  Épaules: 'Shoulders',
  'Longueur d’épaule': 'Shoulder width',
  Poitrine: 'Chest',
  'Écart poitrine': 'Bust separation',
  'Hauteur poitrine': 'Bust height',
  'Longueur de manche': 'Sleeve length',
  'Tour de bras': 'Upper arm',
  'Longueur bras': 'Arm length',
  'Longueur bras total plié': 'Full bent arm length',
  Coude: 'Elbow',
  Poignet: 'Wrist',
  'Tour du poignet': 'Wrist girth',
  Taille: 'Waist',
  'Tour de taille': 'Waist girth',
  'Longueur taille devant': 'Front waist length',
  'Longueur taille dos': 'Back waist length',
  'Longueur habit': 'Garment length',
  'Longueur habit A': 'Garment length A',
  'Longueur habit B': 'Garment length B',
  Ceinture: 'Waistband',
  'Tour hanche': 'Hip',
  'Tour de hanches': 'Hips',
  'Hauteur taille-hanches': 'Waist to hip',
  'Hauteur taille-genou': 'Waist to knee',
  'Hauteur taille-cheville': 'Waist to ankle',
  'Hauteur épaules-longueur finie': 'Shoulder to finished length',
  'Hauteur bassin': 'Pelvis height',
  'Hauteur montant assis': 'Seated rise',
  Entrejambe: 'Inseam',
  'Fourche (entrejambe)': 'Rise (crotch)',
  Cuisse: 'Thigh',
  Mollet: 'Calf',
  Cheville: 'Ankle',
  'Longueur pantalon': 'Trouser length',

  // ------------------------------------------------------ prise de mesures
  'Rechercher…': 'Search…',
  'Mesures {palette}': '{palette}’s measurements',
  'Palette {palette} sur un client enregistré comme {client}.':
    'Showing the {palette} set for a client recorded as {client}.',
  '{remplies}/{total} renseignées': '{remplies}/{total} filled in',
  '{remplies}/{total} mesures': '{remplies}/{total} measurements',
  '{n} mesures': { one: '{n} measurement', other: '{n} measurements' },
  '{n} photos de tissu': { one: '{n} fabric photo', other: '{n} fabric photos' },
  'modèle photographié': 'model photographed',
  'aucun modèle': 'no model',
  'Remarques sur la morphologie': 'Notes on body shape',
  'Relevé enregistré': 'Measurements saved',
  'Conservé à l’écran seulement — connectez-vous pour enregistrer.':
    'Kept on screen only — sign in to save.',
  'Créer la commande': 'Create the order',
  'Enregistrer le relevé': 'Save the measurements',

  // --------------------------------------------------------------- landing
  'Essai gratuit': 'Free trial',

  // ---------------------------------------------------- landing · accroche
  'Votre atelier, enfin tenu au clair': 'Your workshop, finally in the clear',
  'Commandes, mesures, acomptes, planning de l’équipe. AtelierPro rassemble ce qui vit aujourd’hui dans des carnets, des SMS et de la mémoire.':
    'Orders, measurements, deposits, team schedule. AtelierPro gathers what today lives in notebooks, text messages and memory.',
  'Trente jours d’essai gratuit. Sans carte bancaire. En français, en anglais ou en arabe, dans le navigateur — rien à installer.':
    'Thirty days free. No bank card. In French, English or Arabic, in the browser — nothing to install.',
  'Créer mon atelier': 'Create my workshop',
  '30 jours': '30 days',
  'D’essai gratuit, sans carte bancaire': 'Free trial, no bank card',
  '0 F': '0 F',
  'À installer — tout passe par le navigateur': 'To install — everything runs in the browser',
  'Écrans de gestion, du planning à la trésorerie': 'Management screens, from schedule to treasury',

  // --------------------------------------------- landing · fonctionnalités
  'Tout ce qu’un atelier a besoin de retenir': 'Everything a workshop needs to remember',
  'De la prise de commande à la livraison. Touchez une carte pour voir l’écran correspondant.':
    'From taking the order to delivery. Tap a card to see the matching screen.',
  'Planification de l’équipe': 'Team scheduling',
  'Affectez les tâches jour par jour et voyez immédiatement qui est saturé. La capacité est propre à chaque artisan : un apprenti à 6 h n’est pas jugé au seuil d’un tailleur senior.':
    'Assign tasks day by day and see at once who is overloaded. Capacity is set per tailor: an apprentice on 6 h is not judged against a senior tailor’s threshold.',
  'Voir le planning': 'See the schedule',
  'Mesures conservées': 'Measurements kept',
  'Un relevé corporel par client, enregistré une fois et repris à chaque commande. Photos des tissus apportés et du modèle choisi.':
    'One body record per client, saved once and reused on every order. Photos of the fabrics brought in and of the chosen model.',
  'Voir le relevé': 'See the measurements',
  'Acomptes et soldes': 'Deposits and balances',
  'Chaque commande porte son montant, son acompte et son reste à payer, en francs CFA. Le solde se lit sans calcul mental.':
    'Every order carries its amount, its deposit and what is left to pay, in CFA francs. The balance reads without mental arithmetic.',
  'Voir les commandes': 'See the orders',
  'Carnet client': 'Client book',
  'Coordonnées, historique des commandes et mesures d’un client au même endroit. Plus de carnet papier à retrouver.':
    'Contact details, order history and measurements of a client in one place. No more paper notebook to hunt down.',
  'Voir le carnet': 'See the book',
  'Rapports d’atelier': 'Workshop reports',
  'Chiffre d’affaires, tenues les plus demandées, délais de livraison — calculés sur vos commandes réelles, jamais sur des exemples.':
    'Revenue, most requested garments, delivery times — computed from your real orders, never from samples.',
  'Voir les rapports': 'See the reports',
  'Pensé pour le téléphone': 'Built for the phone',
  'Chaque écran est conçu d’abord pour un écran de téléphone, puis élargi. L’atelier se gère debout, entre deux essayages.':
    'Every screen is designed for a phone first, then widened. A workshop is run standing up, between two fittings.',
  'Voir le tableau de bord': 'See the dashboard',

  // ------------------------------------------- landing · profils d’atelier
  'Pour tout type d’atelier': 'For every kind of workshop',
  'Que vous cousiez seul ou que vous meniez une équipe de dix personnes.':
    'Whether you sew alone or lead a team of ten.',
  'Atelier de quartier': 'Neighbourhood workshop',
  'Un tailleur seul ou deux à trois couturières. Commandes régulières, clientèle fidèle.':
    'One tailor alone, or two to three seamstresses. Steady orders, loyal customers.',
  'Carnet client, mesures et acomptes au même endroit':
    'Client book, measurements and deposits in one place',
  'Production collective': 'Collective production',
  'Cinq à dix tailleurs, forte charge. Besoin de coordination et de délais tenus.':
    'Five to ten tailors, heavy load. Coordination and kept deadlines required.',
  'Charge de chaque artisan, jour par jour, avec sa capacité propre':
    'Each tailor’s load, day by day, against their own capacity',
  'Maison de mode': 'Fashion house',
  'Pièces de valeur, retouches nombreuses, clientèle exigeante.':
    'Valuable pieces, many alterations, demanding clientele.',
  'Relevé corporel conservé, photos des tissus, solde suivi à l’écriture près':
    'Body record kept, fabric photos, balance tracked to the entry',
  'Ce que ça change': 'What it changes',

  // ------------------------------------------------------ landing · tarifs
  'Des tarifs lisibles': 'Prices you can read',
  'Trente jours d’essai sur tous les plans. Sans engagement.':
    'Thirty-day trial on every plan. No commitment.',
  'Le paiement en ligne n’est pas encore ouvert : l’essai démarre sans moyen de paiement, et nous vous contactons avant tout prélèvement.':
    'Online payment is not open yet: the trial starts without any payment method, and we contact you before charging anything.',
  'Le plus choisi': 'Most chosen',
  'Commencer l’essai': 'Start the trial',
  'Nous écrire': 'Write to us',
  Découverte: 'Starter',
  'Pour un atelier qui démarre': 'For a workshop starting out',
  'Jusqu’à 50 commandes par mois': 'Up to 50 orders a month',
  'Jusqu’à 5 artisans': 'Up to 5 tailors',
  'Mesures et paiements': 'Measurements and payments',
  'Notes d’atelier': 'Workshop notes',
  'Assistance par e-mail': 'Email support',
  'Pour une équipe qui grandit': 'For a growing team',
  'Commandes illimitées': 'Unlimited orders',
  'Jusqu’à 10 artisans': 'Up to 10 tailors',
  'Planning et capacité par artisan': 'Schedule and per-tailor capacity',
  'Rapports complets': 'Full reports',
  'Assistance prioritaire': 'Priority support',
  Maison: 'House',
  'Pour les grands ateliers': 'For large workshops',
  'Sur devis': 'On quote',
  'Artisans illimités': 'Unlimited tailors',
  'Accès à l’API': 'API access',
  'Mise en route accompagnée': 'Guided onboarding',
  'Formation de l’équipe': 'Team training',
  'Interlocuteur dédié': 'Dedicated contact',
  '/mois': '/month',

  // ---------------------------------------- landing · questions fréquentes
  'Questions fréquentes': 'Frequently asked questions',
  'Faut-il un téléphone récent ?': 'Do I need a recent phone?',
  'Non. AtelierPro s’ouvre dans le navigateur, y compris sur un Android ancien et une connexion lente. Aucune installation n’est nécessaire.':
    'No. AtelierPro opens in the browser, including on an old Android and a slow connection. No installation is needed.',
  'Combien ça coûte ?': 'How much does it cost?',
  'Trente jours d’essai gratuit, puis de 2 000 à 5 000 F CFA par mois selon le plan. Moins cher qu’une retouche.':
    'Thirty days free, then 2,000 to 5,000 CFA francs a month depending on the plan. Cheaper than one alteration.',
  'Et si internet est coupé ?': 'What if the internet is down?',
  'L’atelier a besoin d’une connexion pour enregistrer ses commandes. Le travail hors-ligne avec synchronisation différée est prévu, il n’est pas encore disponible.':
    'The workshop needs a connection to save its orders. Offline work with deferred sync is planned; it is not available yet.',
  'Comment reprendre mes anciens clients ?': 'How do I bring over my existing clients?',
  'Le carnet s’alimente au fil des commandes : le premier client se saisit en moins d’une minute, mesures comprises. Un import de fichier est à l’étude.':
    'The book fills up as orders come in: the first client takes under a minute to enter, measurements included. A file import is under consideration.',
  'C’est pour quel pays ?': 'Which country is it for?',
  'Conçu pour l’Afrique de l’Ouest : interface en français, en anglais ou en arabe, montants en francs CFA sans décimales.':
    'Built for West Africa: interface in French, English or Arabic, amounts in CFA francs with no decimals.',

  // ---------------------------------- landing · témoignages et appel final
  'Ce que disent les tailleurs': 'What tailors say',
  'Des ateliers qui ont troqué le carnet contre l’écran.':
    'Workshops that traded the notebook for the screen.',
  'Du fil à la livraison': 'From thread to delivery',
  'Prêt à mettre votre atelier au clair ?': 'Ready to put your workshop in the clear?',
  'Trente jours gratuits, sans moyen de paiement. La première commande se saisit en deux minutes.':
    'Thirty days free, no payment method. The first order takes two minutes to enter.',
  'Une question ? Écrivez-nous sur WhatsApp': 'A question? Write to us on WhatsApp',

  // ---------------------------------- landing · navigation et pied de page
  Fonctionnalités: 'Features',
  Tarifs: 'Pricing',
  Témoignages: 'Testimonials',
  Questions: 'Questions',
  'Liens de bas de page': 'Footer links',
  Confidentialité: 'Privacy',
  'Conditions d’utilisation': 'Terms of use',
  Contact: 'Contact',
  'Fait pour l’Afrique de l’Ouest. © {annee}': 'Made for West Africa. © {annee}',
  'Retour à l’accueil': 'Back to home',

  // ---------------------------------- alertes d’atelier · phrases rejouées
  'Commande {reference} en retard — {client}': 'Order {reference} is late — {client}',
  '{tenue} devait être livrée le {date}.': '{tenue} was due for delivery on {date}.',
  'Livraison demain — {client}': 'Delivery tomorrow — {client}',
  '{tenue} ({reference}) est attendue demain.': '{tenue} ({reference}) is expected tomorrow.',
  'Voir la commande': 'View the order',
  'À l’instant': 'Just now',

  // -------------------------------------------------------- titres d’écran
  'Prise de mesures': 'Measurements',
  'Capacité de l’équipe': 'Team capacity',
  'Trésorerie de l’atelier': 'Workshop treasury',
  'Politique de confidentialité': 'Privacy policy',
  'Retour au dashboard': 'Back to the dashboard',
  'Retour à la connexion': 'Back to sign-in',
  'Échec de connexion': 'Sign-in failed',
  Imprimer: 'Print',
  'Voir tout': 'See all',
  'Voir toutes les commandes': 'See all orders',
  'Réinitialiser les filtres': 'Reset filters',

  // ------------------------------ commandes · liste, fiche et écrans vides
  'Client & tenue': 'Client & garment',
  'Client / Tenue': 'Client / Garment',
  'Chargement des commandes…': 'Loading orders…',
  'Détails de la commande': 'Order details',
  'Détails du modèle': 'Model details',
  'Mesures corporelles': 'Body measurements',
  'Tissus apportés par le client': 'Fabrics brought by the client',
  'Couleur / motif': 'Colour / pattern',
  'Date de livraison': 'Delivery date',
  'C’est la date promise au client — elle sert au planning et aux alertes de retard.':
    'This is the date promised to the client — it drives the schedule and the late alerts.',
  Urgent: 'Urgent',
  Nouvelle: 'New',
  Saisir: 'Enter',
  Montant: 'Amount',
  'Elle a peut-être été supprimée, ou appartient à un autre atelier.':
    'It may have been deleted, or it belongs to another workshop.',
  'Aucun tissu photographié. Les tissus se prennent en photo pendant le relevé de mesures.':
    'No fabric photographed. Fabrics are photographed while taking the measurements.',
  'Confirmée à l’écran seulement — connectez-vous pour l’enregistrer.':
    'Confirmed on screen only — sign in to save it.',
  'Créez d’abord un client dans le carnet : une commande lui sera rattachée.':
    'Create a client in the book first: the order will be attached to them.',
  'En créer un': 'Create one',
  'En ajouter une': 'Add one',
  ', livraison {date}': ', delivery {date}',
  'Commande {reference} enregistrée pour {client} — {tenue}{livraison}.':
    'Order {reference} saved for {client} — {tenue}{livraison}.',
  'Commande confirmée pour {client} — {tenue}{livraison}.':
    'Order confirmed for {client} — {tenue}{livraison}.',

  // ---------------------------------------------------- paiements et notes
  'Aucun acompte': 'No deposit',
  'Aucun versement enregistré. La commande est entièrement due.':
    'No payment recorded. The whole order is still owed.',
  'Ajouter note': 'Add note',
  'Aucune note pour l’instant. Ce qui s’écrit ici suit la commande — essayage, retouche demandée, tissu manquant.':
    'No notes yet. What is written here follows the order — fitting, requested alteration, missing fabric.',
  'Connectez-vous pour lire et écrire les notes de cette commande.':
    'Sign in to read and write the notes on this order.',

  // --------------------------------------------------------------- clients
  'Ajouter le premier client': 'Add the first client',
  'Historique commandes': 'Order history',
  'Aucune commande enregistrée pour ce client.': 'No order recorded for this client.',
  Fidèle: 'Regular',
  'Pas de numéro': 'No number',
  'Les mesures se rattachent à un client. Créez-en un depuis le carnet, puis revenez ici.':
    'Measurements attach to a client. Create one from the book, then come back here.',

  // ---------------------------------------------------- planning et équipe
  'Affecter tâche': 'Assign task',
  'Charge totale': 'Total load',
  'CA généré': 'Revenue generated',
  'Aucune commande assignée pour l’instant.': 'No order assigned yet.',
  'Le planning se remplit par artisan. Composez votre équipe pour commencer à affecter des tâches.':
    'The schedule fills per tailor. Build your team to start assigning tasks.',

  // -------------------------------------------------------------- rapports
  'Chiffre d’affaires mensuel': 'Monthly revenue',
  'Tenues les plus commandées': 'Most ordered garments',
  'Performance par artisan': 'Performance per tailor',
  'Statut des paiements': 'Payment status',
  'Payé intégral': 'Paid in full',
  'Non payé': 'Unpaid',
  'Les rapports se calculent depuis vos commandes réelles. Connectez-vous pour les consulter — afficher des chiffres d’exemple ici induirait en erreur.':
    'Reports are computed from your real orders. Sign in to see them — showing sample figures here would mislead.',

  // ------------------------------------------------ trésorerie et dépenses
  'Argent réellement encaissé, moins les dépenses décaissées, depuis l’ouverture du journal.':
    'Cash actually received, less cash paid out, since the ledger was opened.',
  'Dernier solde connu — vérification en cours…': 'Last known balance — checking…',
  'Entrées attendues d’après le reste à payer de vos commandes, sorties d’après vos charges déclarées. Ce n’est pas un constat.':
    'Inflows expected from what is still owed on your orders, outflows from your declared charges. This is not a statement of fact.',
  'La caisse passe sous zéro dans les mois qui viennent si rien ne change.':
    'The cash box goes below zero in the coming months if nothing changes.',
  'Déclarer une charge': 'Declare a charge',
  'Aucune charge déclarée — la prévision ne compte donc aucune sortie.':
    'No charge declared — the forecast therefore counts no outflow.',
  'Déclarées une fois, elles alimentent la prévision. Elles n’écrivent rien en caisse : c’est la saisie d’une dépense qui fait bouger le solde.':
    'Declared once, they feed the forecast. They write nothing to the cash box: only entering an expense moves the balance.',
  'Enregistrez vos achats de tissu, salaires et charges au fur et à mesure : la trésorerie s’en déduit toute seule.':
    'Record your fabric purchases, wages and charges as you go: the treasury follows on its own.',
  'Le solde de votre atelier ne s’affiche qu’une fois connecté. Aucun jeu d’exemple n’est proposé ici : on prend des décisions d’achat avec ce chiffre.':
    'Your workshop balance shows only once signed in. No sample data is offered here: buying decisions get made on this figure.',
  'Les dépenses de votre atelier ne s’affichent qu’une fois connecté. Aucun jeu d’exemple n’est proposé ici : un chiffre d’argent inventé n’aiderait personne.':
    'Your workshop expenses show only once signed in. No sample data is offered here: an invented money figure would help no one.',

  // --------------------------------------------------------- notifications
  'Chargement des notifications…': 'Loading notifications…',
  'Marquer comme lue': 'Mark as read',
  'Tout marquer comme lu': 'Mark all as read',
  'Rien ne vous a été signalé. Les retards et les livraisons du lendemain sont vérifiés chaque matin — aucune échéance ne tombe aujourd’hui.':
    'Nothing has been flagged. Late orders and next-day deliveries are checked every morning — no due date falls today.',
  'Vos alertes ne s’affichent qu’une fois connecté. Aucun jeu d’exemple n’est proposé ici : une notification affirme un fait daté, et une alerte inventée se confondrait avec une vraie.':
    'Your alerts show only once signed in. No sample data is offered here: a notification asserts a dated fact, and an invented alert would pass for a real one.',

  // ------------------------------------------------- compte et inscription
  'Créer votre atelier': 'Create your workshop',
  'Quelques secondes pour commencer à suivre vos commandes.':
    'A few seconds to start tracking your orders.',
  'Un code de vérification vous sera envoyé par e-mail.':
    'A verification code will be sent to you by email.',
  '10 caractères minimum. Une phrase est plus sûre qu’un mot compliqué.':
    'At least 10 characters. A sentence is safer than a complicated word.',
  'Mot de passe actuel': 'Current password',
  'Confirmer le nouveau mot de passe': 'Confirm the new password',
  'Comptes liés': 'Linked accounts',
  'Lier Google': 'Link Google',
  Lié: 'Linked',

  // --------------------------------------------------------- pages légales
  'Ce document n’est pas encore rédigé. Il le sera avant l’ouverture des inscriptions payantes, et cette page portera alors le texte complet plutôt que cet avis.':
    'This document has not been written yet. It will be before paid sign-ups open, and this page will then carry the full text rather than this notice.',
  'Deux points méritent d’être dits dès maintenant, parce qu’ils engagent les deux parties :':
    'Two points are worth stating now, because they bind both parties:',
  'Le paiement en ligne n’est pas ouvert. Aucun prélèvement n’est possible aujourd’hui, quel que soit le plan affiché sur la page d’accueil.':
    'Online payment is not open. No charge is possible today, whatever plan the home page shows.',
  'Le service est en cours de construction. Certaines fonctions annoncées sur la page d’accueil — travail hors-ligne, import de fichier clients — ne sont pas encore disponibles.':
    'The service is under construction. Some features announced on the home page — offline work, client file import — are not available yet.',
  'En attendant, voici ce que l’application fait réellement des données, tel qu’on peut le vérifier dans son code :':
    'In the meantime, here is what the application actually does with the data, as its code shows:',
  'Les données d’un atelier — clients, mesures, commandes, planning, équipe — sont rattachées à son compte et ne sont jamais lues par un autre atelier.':
    'A workshop’s data — clients, measurements, orders, schedule, team — is attached to its account and is never read by another workshop.',
  'Les mots de passe ne sont pas conservés en clair ; seule une empreinte est stockée.':
    'Passwords are not kept in the clear; only a hash is stored.',
  'Les photos de tissus et de modèles sont hébergées chez Cloudinary. Les e-mails de vérification transitent par Resend.':
    'Fabric and model photos are hosted at Cloudinary. Verification emails go through Resend.',
  'Aucune donnée n’est revendue ni cédée à des fins publicitaires.':
    'No data is resold or handed over for advertising purposes.',
  'Pour une demande de suppression de compte ou d’export de vos données, écrivez-nous depuis la page d’accueil.':
    'To request account deletion or an export of your data, write to us from the home page.',

  // --------------------------- liste des commandes · filtres et pagination
  'Affichage {premiere}–{derniere} sur {total}': 'Showing {premiere}–{derniere} of {total}',
  'Rien ne correspond à « {recherche} »{filtre}.': 'Nothing matches “{recherche}”{filtre}.',
  ' dans le filtre « {nom} »': ' in the “{nom}” filter',
  'Aucune commande avec le statut « {statut} ».': 'No order with status “{statut}”.',
  '{n} commande': { one: '{n} order', other: '{n} orders' },

  // ----------------------------- tableau de bord · indicateurs et capacité
  'Commandes actives': 'Active orders',
  'À livrer': 'To deliver',
  'Clients ce mois': 'Clients this month',
  'chargement…': 'loading…',
  exemples: 'samples',
  'à traiter': 'to handle',
  'Calcul…': 'Computing…',
  'Calcul de la charge du jour…': 'Computing today’s load…',
  'Journée saturée': 'Day is full',
  '{n} place disponible': { one: '{n} slot free', other: '{n} slots free' },
  '{utilisees} h engagées sur {total} h — voir le planning':
    '{utilisees} h committed of {total} h — see the schedule',
  'Équipe de {n} — d’après les tâches du jour': 'Team of {n} — from today’s tasks',
  'Aucun artisan — composez votre équipe.': 'No tailor — build your team.',
  'Aucun artisan actif.': 'No active tailor.',
  'Aucun artisan.': 'No tailor.',
  'Toute l’équipe est saturée aujourd’hui.': 'The whole team is full today.',
  '{n} h encore libres aujourd’hui': '{n} h still free today',
  'Aucune commande en cours.': 'No order in progress.',

  // -------------------------------------------------------------- planning
  'Planning équipe': 'Team schedule',
  'Semaine du {debut} au {fin}': 'Week of {debut} to {fin}',
  'Semaine du {debut} au {fin} {mois} {annee}': 'Week of {debut} to {fin} {mois} {annee}',
  'Revenir à la semaine en cours': 'Back to the current week',
  Affecter: 'Assign',
  'Affectation…': 'Assigning…',
  'Mode démonstration — la tâche restera à l’écran seulement.':
    'Demo mode — the task will stay on screen only.',
  'La charge de l’artisan se met à jour immédiatement.': 'The tailor’s load updates immediately.',
  Saturé: 'Full',
  'Quasi-plein': 'Nearly full',
  Disponible: 'Available',

  // -------------------- fiche commande et carnet · onglets et champs vides
  Infos: 'Info',
  Tissus: 'Fabrics',
  Récapitulatif: 'Summary',
  Suivi: 'Tracking',
  'Commande introuvable': 'Order not found',
  'Commande soldée': 'Order settled',
  'Confirmer la commande': 'Confirm the order',
  'Champ requis': 'Required field',
  'Non renseigné': 'Not provided',
  'Téléphone non renseigné': 'No phone number',
  'Tissu non renseigné': 'No fabric recorded',
  'Tissu apporté par le client': 'Fabric brought by the client',
  'Aucun relevé': 'No measurements',
  Relever: 'Take measurements',
  'Aucune commande': 'No order',
  'Créer le client': 'Create the client',
  'Aucune consigne particulière n’a été saisie.': 'No particular instruction was entered.',
  'Le statut n’a pas pu être enregistré.': 'The status could not be saved.',
  'Les mesures ne sont pas consultables en mode démonstration.':
    'Measurements cannot be viewed in demo mode.',
  'Marquer livrée': 'Mark delivered',
  'Passer à l’essayage': 'Move to fitting',
  'Valider l’essayage': 'Approve the fitting',
  'Aucun artisan actif — composez l’équipe dans les paramètres':
    'No active tailor — build the team in settings',
  'Aucun artisan assigné.': 'No tailor assigned.',

  // ------------------------------------------- notifications et navigation
  'Aucune notification': 'No notification',
  'Aucune notification dans cette catégorie': 'No notification in this category',
  'Ouvrir le menu': 'Open the menu',
  'Fermer le menu': 'Close the menu',
  'Exporter PDF': 'Export PDF',
  'Genre du client': 'Client gender',

  // ---------------------------------- trésorerie et dépenses · compléments
  Déclarer: 'Declare',
  Suspendre: 'Suspend',
  Réactiver: 'Reactivate',
  'Sans poste': 'No category',

  // ------------------------------------------------ rapports · compléments
  'non mesurable': 'not measurable',
  'des livraisons': 'of deliveries',
  'de la commande à la livraison': 'from order to delivery',
  'Indicateurs indisponibles.': 'Figures unavailable.',

  // ------------------------------------------------------- envoi de photos
  local: 'local',
  'Retirer {fichier}': 'Remove {fichier}',
  'Photo affichée localement seulement — connectez-vous pour l’enregistrer durablement.':
    'Photo shown locally only — sign in to store it for good.',
  'L’envoi a échoué — la photo reste visible mais n’est pas enregistrée.':
    'Upload failed — the photo stays visible but is not saved.',
  'Serveur injoignable — la photo reste visible mais n’est pas enregistrée.':
    'Server unreachable — the photo stays visible but is not saved.',
  '« {fichier} » dépasse la taille maximale autorisée.':
    '“{fichier}” exceeds the maximum allowed size.',
  '« {fichier} » n’est pas une image acceptée (JPEG, PNG, WebP).':
    '“{fichier}” is not an accepted image (JPEG, PNG, WebP).',

  // ----------------------------------------------------------- inscription
  'Créer mon compte': 'Create my account',
  'Création…': 'Creating…',

  // ------------------------------------------ messages d’erreur des écrans
  'Planning indisponible.': 'Schedule unavailable.',
  'Trésorerie indisponible.': 'Treasury unavailable.',
  'Journal indisponible.': 'Ledger unavailable.',
  'Charges indisponibles.': 'Charges unavailable.',
  'Notes indisponibles.': 'Notes unavailable.',
  'Réglages indisponibles.': 'Settings unavailable.',
  'Grille tarifaire indisponible.': 'Price list unavailable.',
  'Note non enregistrée.': 'Note not saved.',
  'Réglage non enregistré.': 'Setting not saved.',
  'Modification non enregistrée.': 'Change not saved.',
  'Modification impossible.': 'Change not possible.',
  'Suppression impossible.': 'Deletion not possible.',
  'Commande inconnue.': 'Unknown order.',
  'Aucune mesure renseignée.': 'No measurement entered.',
  'Impossible de charger l’équipe.': 'Could not load the team.',
  'Impossible d’ajouter cet artisan.': 'Could not add this tailor.',
  'Impossible d’enregistrer ce tarif.': 'Could not save this price.',
  'Impossible d’enregistrer l’écriture.': 'Could not save the entry.',
  'Impossible d’enregistrer la charge.': 'Could not save the charge.',
  'Impossible d’enregistrer la tâche.': 'Could not save the task.',
  'Impossible de calculer les indicateurs.': 'Could not compute the figures.',
  'Un artisan porte déjà ce nom.': 'A tailor already has that name.',
  'Un client porte déjà ce nom.': 'A client already has that name.',
  'Cette tenue figure déjà dans la grille.': 'This garment is already in the price list.',
  'Connectez-vous pour composer votre équipe.': 'Sign in to build your team.',
  'Connectez-vous pour composer votre grille.': 'Sign in to build your price list.',
  'Connectez-vous pour régler vos alertes.': 'Sign in to set up your alerts.',
  'Session expirée — reconnectez-vous.': 'Session expired — sign in again.',
  'Session expirée — reconnectez-vous pour écrire une note.':
    'Session expired — sign in again to write a note.',
  'Cette date est déjà passée — la commande naîtrait en retard.':
    'This date has already passed — the order would start late.',
  'L’acompte dépasse le montant de la commande.': 'The deposit exceeds the order amount.',
  'Le tissu n’est pas renseigné.': 'The fabric is not recorded.',
  'Aucun tarif dans votre grille — ajoutez-en un dans Paramètres › Tarification.':
    'No price in your list — add one in Settings › Pricing.',
  'Le montant doit être un nombre supérieur à zéro.':
    'The amount must be a number greater than zero.',
  'Trop de commandes créées en même temps. Réessayez.':
    'Too many orders created at once. Try again.',

  // --------------------------------- compte · mot de passe et comptes liés
  'Connecté en tant que {email}': 'Signed in as {email}',
  'Définir un mot de passe': 'Set a password',
  'Définir le mot de passe': 'Set the password',
  'Tu peux modifier ton mot de passe ici. Les autres sessions seront déconnectées.':
    'You can change your password here. Other sessions will be signed out.',
  'Tu t’es connecté via Google. Définis un mot de passe pour pouvoir aussi te connecter par email.':
    'You signed in with Google. Set a password so you can also sign in by email.',
  'Tu peux te connecter via Google.': 'You can sign in with Google.',
  'Lie ton compte Google pour te connecter en un clic.':
    'Link your Google account to sign in with one click.',
  'Saisis un nouveau mot de passe.': 'Enter a new password.',
  'La confirmation ne correspond pas au nouveau mot de passe.':
    'The confirmation does not match the new password.',
  'Mot de passe mis à jour.': 'Password updated.',
  'Mot de passe défini. Tu peux maintenant te connecter par email.':
    'Password set. You can now sign in by email.',
  'Mot de passe actuel incorrect.': 'Current password is incorrect.',
  'Ce mot de passe est trop courant.': 'This password is too common.',
  'Mot de passe trop court.': 'Password too short.',
  'Ce mot de passe a fuité — choisis-en un autre.':
    'This password has leaked — choose another one.',
  'Un mot de passe est déjà défini. Utilise « changer le mot de passe ».':
    'A password is already set. Use “change the password”.',
  'Champs invalides.': 'Invalid fields.',
  'Erreur réseau. Réessaie.': 'Network error. Try again.',
};
