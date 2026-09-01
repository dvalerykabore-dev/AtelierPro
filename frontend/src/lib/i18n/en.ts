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
};
