import type { Dictionnaire } from '@/lib/i18n/traduire';

/**
 * Traductions espagnoles.
 *
 * La clé est la phrase française. Une clé absente n'est pas une erreur : le
 * moteur rend alors le français, et l'écran reste lisible. Voir
 * `traduire.ts` pour le raisonnement complet.
 *
 * Espagnol d'Espagne, et non d'Amérique latine. Le pays hispanophone que cet
 * atelier peut réellement toucher est la Guinée équatoriale, qui suit la norme
 * péninsulaire et partage le franc CFA. D'où « ajustes » et non
 * « configuración », « contraseña » et non « clave », « ordenador » plutôt que
 * « computadora ».
 *
 * Vocabulaire retenu, une fois pour toutes :
 *   atelier → taller        commande → pedido       acompte → anticipo
 *   tenue   → prenda        façon    → hechura      relevé  → medidas
 *   artisan → sastre        échéance → plazo        caisse  → caja
 *   poste   → partida       planning → agenda       tissu   → tela
 *   écriture → apunte       libellé  → concepto
 */
export const es: Dictionnaire = {
  // ---------------------------------------------------------------- commun
  Enregistrer: 'Guardar',
  'Enregistrement…': 'Guardando…',
  'Enregistré.': 'Guardado.',
  Annuler: 'Cancelar',
  Ajouter: 'Añadir',
  'Ajout…': 'Añadiendo…',
  Modifier: 'Editar',
  Supprimer: 'Eliminar',
  Retirer: 'Quitar',
  Changer: 'Cambiar',
  Fermer: 'Cerrar',
  Confirmer: 'Confirmar',
  Rechercher: 'Buscar',
  Filtrer: 'Filtrar',
  'aujourd’hui': 'hoy',
  demain: 'mañana',
  'Chargement…': 'Cargando…',
  Oui: 'Sí',
  Non: 'No',
  Actif: 'Activo',
  Inactif: 'Inactivo',
  Total: 'Total',
  Tous: 'Todos',
  Toutes: 'Todas',
  Aucun: 'Ninguno',
  Aucune: 'Ninguna',
  Optionnel: 'Opcional',
  facultatif: 'opcional',
  'Date invalide.': 'Fecha no válida.',
  'Heure invalide.': 'Hora no válida.',
  'F CFA': 'FCFA',
  à: 'a',

  // ------------------------------------------------------------ navigation
  'Tableau de bord': 'Panel',
  Accueil: 'Inicio',
  Planning: 'Agenda',
  Commandes: 'Pedidos',
  Clients: 'Clientes',
  Mesures: 'Medidas',
  Trésorerie: 'Tesorería',
  Caisse: 'Caja',
  Dépenses: 'Gastos',
  Rapports: 'Informes',
  Paramètres: 'Ajustes',
  Notifications: 'Notificaciones',
  'Navigation principale': 'Navegación principal',
  'Chargement de l’atelier…': 'Cargando el taller…',
  'Mode démonstration — pages accessibles sans connexion. Retirez':
    'Modo de demostración — páginas abiertas sin iniciar sesión. Retire',
  'avant toute mise en ligne.': 'antes de cualquier puesta en producción.',

  // ------------------------------------------------------------- apparence
  'Activer le thème clair': 'Cambiar al tema claro',
  'Activer le thème sombre': 'Cambiar al tema oscuro',
  Apparence: 'Apariencia',
  'Thème de l’interface': 'Tema de la interfaz',
  Sombre: 'Oscuro',
  Clair: 'Claro',
  'Mémorisé sur cet appareil, pas sur votre compte.':
    'Recordado en este dispositivo, no en su cuenta.',

  // ----------------------------------------------------------------- langue
  Langue: 'Idioma',
  'Langue de l’interface': 'Idioma de la interfaz',
  'Choisissez la langue de l’interface.': 'Elija el idioma de la interfaz.',
  'L’arabe se lit de droite à gauche : l’interface se retourne entièrement.':
    'El árabe se lee de derecha a izquierda, así que toda la interfaz se invierte.',

  // ------------------------------------------------- paramètres · atelier
  Atelier: 'Taller',
  Équipe: 'Equipo',
  Tarification: 'Tarifas',
  Compte: 'Cuenta',
  'Informations de l’atelier': 'Datos del taller',
  'Nom de l’atelier': 'Nombre del taller',
  'Mon atelier': 'Mi taller',
  'Le nom n’a pas pu être enregistré.': 'No se ha podido guardar el nombre.',
  'Téléphone de l’atelier': 'Teléfono del taller',
  'Le numéro sur lequel on joint l’atelier.': 'El número por el que se contacta con el taller.',
  'Le numéro n’a pas pu être enregistré.': 'No se ha podido guardar el número.',
  Ville: 'Ciudad',
  'La ville n’a pas pu être enregistrée.': 'No se ha podido guardar la ciudad.',
  Adresse: 'Dirección',
  'L’adresse n’a pas pu être enregistrée.': 'No se ha podido guardar la dirección.',
  Horaires: 'Horario',
  'Heure d’ouverture': 'Hora de apertura',
  'Heure de fermeture': 'Hora de cierre',
  'Les horaires n’ont pas pu être enregistrés.': 'No se ha podido guardar el horario.',
  'Indiquez l’ouverture et la fermeture, ou aucune des deux.':
    'Indique la apertura y el cierre, o ninguno de los dos.',
  'La fermeture doit venir après l’ouverture.': 'El cierre debe ir después de la apertura.',
  Devise: 'Moneda',
  'Tous les montants enregistrés sont en francs CFA.':
    'Todos los importes registrados están en francos CFA.',
  Logo: 'Logotipo',
  'Le logo n’a pas pu être envoyé.': 'No se ha podido subir el logotipo.',
  'Le logo n’a pas pu être retiré.': 'No se ha podido quitar el logotipo.',
  'Session expirée — reconnectez-vous pour enregistrer le logo.':
    'Sesión caducada — inicie sesión de nuevo para guardar el logotipo.',
  '« {fichier} » est trop lourd — réduisez l’image et réessayez.':
    '«{fichier}» pesa demasiado — reduzca la imagen e inténtelo de nuevo.',
  'Format refusé — choisissez une image JPEG, PNG ou WebP.':
    'Formato rechazado — elija una imagen JPEG, PNG o WebP.',
  'Le stockage d’images n’est pas configuré sur ce serveur.':
    'El almacenamiento de imágenes no está configurado en este servidor.',
  'L’envoi a échoué — le logo n’a pas été enregistré.':
    'La subida ha fallado — el logotipo no se ha guardado.',
  'Logo de {atelier}': 'Logotipo de {atelier}',

  // --------------------------------------------------- paramètres · équipe
  '{n} actifs sur {total}': { one: '{n} activo de {total}', other: '{n} activos de {total}' },
  '· exemples': '· ejemplos',
  'Chargement de l’équipe…': 'Cargando el equipo…',
  'Aucun artisan. Ajoutez-en un pour pouvoir assigner des commandes et remplir le planning.':
    'Todavía no hay sastres. Añada uno para poder asignar pedidos y llenar la agenda.',
  'Activer {nom}': 'Activar a {nom}',
  'Ajouter un artisan': 'Añadir un sastre',
  'Les initiales sont déduites du nom ; elles identifient l’artisan sur les commandes et le planning.':
    'Las iniciales se deducen del nombre; identifican al sastre en los pedidos y en la agenda.',
  'Ajouter à l’équipe': 'Añadir al equipo',
  'Nom complet': 'Nombre completo',
  Rôle: 'Función',
  'Tailleur senior': 'Sastre sénior',
  Couturière: 'Costurera',
  'Capacité quotidienne (heures)': 'Capacidad diaria (horas)',
  'Un apprenti ne tient pas les 8 h d’un tailleur senior — le planning s’appuie sur ce chiffre.':
    'Un aprendiz no aguanta las 8 h de un sastre sénior — la agenda se apoya en esta cifra.',
  'Téléphone (facultatif)': 'Teléfono (opcional)',
  'Pour joindre l’artisan quand une tenue est promise pour le lendemain.':
    'Para localizar al sastre cuando una prenda está prometida para el día siguiente.',
  '{n} h / jour': '{n} h / día',

  // ---------------------------------------------- paramètres · tarification
  'Grille tarifaire': 'Tarifario',
  'Ajouter un tarif': 'Añadir un precio',
  'Chargement de la grille…': 'Cargando el tarifario…',
  'Grille d’exemple — connectez-vous pour composer la vôtre.':
    'Tarifario de ejemplo — inicie sesión para componer el suyo.',
  'Aucun tarif enregistré. Ajoutez vos prix de façon : ils seront proposés à chaque nouvelle commande.':
    'Ningún precio registrado. Añada sus precios de hechura: se propondrán en cada pedido nuevo.',
  'Prix de {unite}': 'Precio de {unite}',
  façon: 'hechura',
  'Modifier le tarif {tenue}': 'Editar el precio de {tenue}',
  'Supprimer le tarif {tenue}': 'Eliminar el precio de {tenue}',
  'Nouveau tarif': 'Nuevo precio',
  'Modifier le tarif': 'Editar precio',
  'Prix de façon appliqué par défaut à ce type de tenue.':
    'Precio de hechura aplicado por defecto a este tipo de prenda.',
  'Type de tenue': 'Tipo de prenda',
  'Prix de façon': 'Precio de hechura',
  'En francs CFA, sans décimales.': 'En francos CFA, sin decimales.',

  // --------------------------------------------- paramètres · notifications
  'Rappels automatiques': 'Avisos automáticos',
  'Relevés chaque matin et déposés dans vos notifications.':
    'Comprobados cada mañana y dejados en sus notificaciones.',
  'Chargement des réglages…': 'Cargando los ajustes…',
  'Connectez-vous pour régler vos rappels.': 'Inicie sesión para configurar sus avisos.',

  // --------------------------------------------------- paramètres · compte
  'Votre compte': 'Su cuenta',
  'Propriétaire de l’atelier': 'Propietario del taller',
  'Adresse e-mail': 'Dirección de correo',
  Téléphone: 'Teléfono',
  'Le même que celui de l’onglet Atelier.': 'El mismo de la pestaña Taller.',
  'Changer le mot de passe': 'Cambiar la contraseña',
  'Se déconnecter': 'Cerrar sesión',
  'Déconnexion…': 'Cerrando sesión…',
  'Se déconnecter ?': '¿Cerrar sesión?',
  'Pour revenir, il faudra retaper votre mot de passe puis saisir un code envoyé à votre adresse e-mail.':
    'Para volver, tendrá que escribir de nuevo su contraseña y luego introducir un código enviado a su correo.',
  'Rester connecté': 'Seguir con la sesión',
  'Les commandes, la caisse et les mesures restent enregistrées — c’est l’accès depuis cet appareil qui se ferme.':
    'Los pedidos, la caja y las medidas siguen registrados — lo que se cierra es el acceso desde este dispositivo.',

  // ------------------------------------------------------------- rappels
  'Commande en retard': 'Pedido retrasado',
  'Dès qu’une commande dépasse son échéance de livraison.':
    'En cuanto un pedido supera su fecha de entrega.',
  'Livraison demain': 'Entrega mañana',
  'La veille, pour les commandes à remettre le lendemain.':
    'La víspera, para los pedidos que se entregan al día siguiente.',

  // ------------------------------------------------------------- cloche
  'Aucune notification non lue': 'Ninguna notificación sin leer',
  '{n} notifications non lues': {
    one: '{n} notificación sin leer',
    other: '{n} notificaciones sin leer',
  },
  'exemple : {exemple}': 'ejemplo: {exemple}',
  'Choisissez un pays.': 'Elija un país.',
  '{ecran} — écran à venir': '{ecran} — pantalla próximamente',

  // --------------------------------------------------------- sous-titres
  'Carnet clients': 'Libro de clientes',
  'Fiches, mesures et tissus': 'Fichas, medidas y telas',
  'Suivi de confection': 'Seguimiento de confección',
  'Nouvelle commande': 'Nuevo pedido',
  'Modèle, artisan, tarif et échéance': 'Modelo, sastre, precio y plazo',
  'Relevé corporel, tissus apportés et modèle choisi':
    'Medidas del cuerpo, telas traídas y modelo elegido',

  // ------------------------------------------------------ authentification
  Connexion: 'Iniciar sesión',
  'Connexion…': 'Iniciando sesión…',
  'Se connecter': 'Iniciar sesión',
  'Accédez à vos commandes, votre planning et vos clients.':
    'Acceda a sus pedidos, a su agenda y a sus clientes.',
  'Pas encore de compte ?': '¿Todavía no tiene cuenta?',
  'Créer un atelier': 'Crear un taller',
  'Mot de passe': 'Contraseña',
  'Mot de passe oublié ?': '¿Ha olvidado la contraseña?',
  'Mot de passe oublié': 'Contraseña olvidada',
  'Nous vous envoyons un code pour en choisir un nouveau.':
    'Le enviamos un código para elegir una nueva.',
  'Vous vous en souvenez ?': '¿Ya se acuerda?',
  'Si un compte existe pour {email}, un code de réinitialisation vient d’être envoyé.':
    'Si existe una cuenta para {email}, acabamos de enviar un código de restablecimiento.',
  'J’ai reçu mon code': 'He recibido mi código',
  'Envoi…': 'Enviando…',
  'Envoyer le code': 'Enviar el código',
  'Confirmer la connexion': 'Confirmar el inicio de sesión',
  'Un code à 8 caractères vient d’être envoyé à {email}.':
    'Acabamos de enviar un código de 8 caracteres a {email}.',
  'Changer d’adresse': 'Cambiar la dirección',
  'Code reçu par e-mail': 'Código recibido por correo',
  'Il expire au bout de quelques minutes.': 'Caduca al cabo de unos minutos.',
  'Nouveau code envoyé. Le précédent ne fonctionne plus.':
    'Nuevo código enviado. El anterior ya no funciona.',
  'Vérification…': 'Comprobando…',
  'Je n’ai rien reçu — renvoyer un code': 'No he recibido nada — enviar otro código',
  'Vérifiez votre e-mail': 'Revise su correo',
  'Saisissez le code à 8 caractères que nous venons de vous envoyer.':
    'Introduzca el código de 8 caracteres que acabamos de enviarle.',
  'Mauvaise adresse ?': '¿Dirección equivocada?',
  'Recommencer l’inscription': 'Volver a empezar el registro',
  'Code de vérification': 'Código de verificación',
  'Si un compte existe pour cette adresse, un nouveau code vient d’être envoyé.':
    'Si existe una cuenta para esta dirección, acabamos de enviar un código nuevo.',
  'Vérifier mon compte': 'Verificar mi cuenta',
  'Renvoyer le code': 'Enviar el código de nuevo',
  'Nouveau mot de passe': 'Nueva contraseña',
  'Saisissez le code reçu par e-mail et choisissez votre nouveau mot de passe.':
    'Introduzca el código recibido por correo y elija su nueva contraseña.',
  'Code perdu ?': '¿Ha perdido el código?',
  'En demander un autre': 'Pedir otro',
  'Code reçu': 'Código recibido',
  '10 caractères minimum.': 'Mínimo 10 caracteres.',
  'Changer mon mot de passe': 'Cambiar mi contraseña',
  'Retour à l’atelier': 'Volver al taller',
  ou: 'o',
  'Continuer avec Google': 'Continuar con Google',

  // messages renvoyés par l’API, traduits à l’affichage
  'Adresse e-mail ou mot de passe incorrect.': 'Dirección de correo o contraseña incorrectas.',
  'Votre compte n’est pas encore vérifié. Consultez vos e-mails.':
    'Su cuenta todavía no está verificada. Revise su correo.',
  'Trop de tentatives. Réessayez dans quelques minutes.':
    'Demasiados intentos. Inténtelo de nuevo dentro de unos minutos.',
  'Ce compte est suspendu. Contactez le support.':
    'Esta cuenta está suspendida. Contacte con el soporte.',
  'Le code n’a pas pu être envoyé. Réessayez dans un instant.':
    'No se ha podido enviar el código. Inténtelo de nuevo en un momento.',
  'Code incorrect. Vérifiez les 8 caractères reçus par e-mail.':
    'Código incorrecto. Compruebe los 8 caracteres recibidos por correo.',
  'Ce code a expiré. Demandez-en un nouveau.': 'Este código ha caducado. Pida uno nuevo.',
  'Trop d’essais sur ce code. Demandez-en un nouveau.':
    'Demasiados intentos con este código. Pida uno nuevo.',
  'Impossible de joindre le serveur.': 'No se ha podido contactar con el servidor.',
  'Code invalide ou expiré. Vérifiez les 8 caractères saisis.':
    'Código no válido o caducado. Compruebe los 8 caracteres introducidos.',
  'Le mot de passe doit faire au moins 10 caractères.':
    'La contraseña debe tener al menos 10 caracteres.',
  'Ce mot de passe est trop courant. Choisissez-en un autre.':
    'Esta contraseña es demasiado común. Elija otra.',
  'Ce mot de passe a fuité lors d’une brèche connue. Choisissez-en un autre.':
    'Esta contraseña apareció en una filtración conocida. Elija otra.',

  // ------------------------------------------------------------ téléphone
  'Indicatif du pays': 'Prefijo del país',
  'Numéro de téléphone invalide.': 'Número de teléfono no válido.',

  // ------------------------------------------------------- tableau de bord
  'Bonjour {nom}': 'Hola {nom}',
  'Commandes du jour': 'Pedidos del día',
  'Commandes en cours': 'Pedidos en curso',
  'Commandes livrées': 'Pedidos entregados',
  'Chiffre d’affaires du mois': 'Facturación del mes',
  'Livraison à temps': 'Entregas a tiempo',
  'Délai moyen': 'Plazo medio',
  'Calcul des indicateurs…': 'Calculando los indicadores…',
  'Indicateurs indisponibles': 'Indicadores no disponibles',
  'Notifications indisponibles': 'Notificaciones no disponibles',
  'Non lue': 'Sin leer',
  'AtelierPro, accueil': 'AtelierPro, inicio',
  'Ouvrir le carnet clients': 'Abrir el libro de clientes',

  // -------------------------------------------- commandes · liste et fiche
  Commande: 'Pedido',
  'Commande en cours': 'Pedido en curso',
  'Rechercher une commande': 'Buscar un pedido',
  'Rechercher un client, une tenue, une référence…':
    'Buscar un cliente, una prenda, una referencia…',
  'Aucune commande ne correspond': 'Ningún pedido coincide',
  'Aucune commande enregistrée.': 'Ningún pedido registrado.',
  'Cette commande n’existe pas': 'Este pedido no existe',
  'Chargement de la commande…': 'Cargando el pedido…',
  'Retour aux commandes': 'Volver a los pedidos',
  'Retour à la liste': 'Volver a la lista',
  'Réf.': 'Ref.',
  Statut: 'Estado',
  Avancement: 'Progreso',
  'Livraison prévue': 'Entrega prevista',
  'Livraison calculée': 'Entrega calculada',
  'Date de création': 'Creado el',
  Assigné: 'Asignado',
  'Assigné à': 'Asignado a',
  'Non assigné': 'Sin asignar',
  Artisan: 'Sastre',
  Tissu: 'Tela',
  Instructions: 'Instrucciones',
  'Modèle choisi': 'Modelo elegido',
  'Palette de mesures': 'Conjunto de medidas',
  'Montant de la commande': 'Importe del pedido',
  'Voir la fiche client': 'Ver la ficha del cliente',
  'Page précédente': 'Página anterior',
  'Page suivante': 'Página siguiente',

  // ------------------------------------------- commandes · notes d’atelier
  'Notes atelier': 'Notas del taller',
  'Chargement des notes…': 'Cargando las notas…',
  'Ajouter une note ou observation…': 'Añadir una nota u observación…',
  'Nouvelle note d’atelier': 'Nueva nota de taller',
  'Publier la note': 'Publicar la nota',

  // ----------------------------------------------------- nouvelle commande
  'Cliente / client': 'Cliente',
  Client: 'Cliente',
  'Client concerné': 'Cliente en cuestión',
  'Nouveau client': 'Nuevo cliente',
  'Le genre détermine la palette de mesures qui lui sera présentée.':
    'El género determina el conjunto de medidas que se le presentará.',
  'La référence visuelle que le client souhaite reproduire.':
    'La referencia visual que el cliente quiere reproducir.',
  'Tissus apportés': 'Telas traídas',
  'Photographiez chaque coupon : motif, métrage, couleur réelle.':
    'Fotografíe cada corte: estampado, metraje, color real.',
  'Wax hollandais — 6 yards': 'Wax holandés — 6 yardas',
  'Wax 6 yards — marché de Rood Woko': 'Wax 6 yardas — mercado de Rood Woko',
  'Notes / instructions': 'Notas / instrucciones',
  'Ces consignes sont lues par l’artisan au moment de la coupe.':
    'El sastre lee estas indicaciones en el momento del corte.',
  'Ex : col bateau, fermeture invisible dos, finitions dorées sur les ourlets.':
    'Ej.: escote barco, cremallera invisible en la espalda, acabados dorados en los dobladillos.',
  'Ex : épaule droite légèrement plus basse, prévoir 1 cm de reprise.':
    'Ej.: hombro derecho ligeramente más bajo, prever 1 cm de ajuste.',
  'Acompte versé': 'Anticipo pagado',
  'En francs CFA. Enregistré comme recette dans la caisse.':
    'En francos CFA. Registrado como ingreso en la caja.',
  'Réglé en': 'Pagado en',
  'Sert au rapprochement de caisse en fin de mois.': 'Sirve para el arqueo de caja a fin de mes.',
  'Sert au bouton WhatsApp de la fiche client et de la commande.':
    'Alimenta el botón de WhatsApp de la ficha del cliente y del pedido.',
  'Robe wax cérémonie — Mariam C.': 'Vestido wax de ceremonia — Mariam C.',

  // --------------------------------------------------------------- clients
  'Rechercher un client': 'Buscar un cliente',
  'Rechercher un client…': 'Buscar un cliente…',
  'Chargement des clients…': 'Cargando los clientes…',
  'Aucun client enregistré': 'Ningún cliente registrado',
  'Aucun numéro enregistré pour ce client.': 'Ningún número registrado para este cliente.',
  'Client fidèle': 'Cliente habitual',
  'Commandes passées': 'Pedidos realizados',
  'Dernière commande': 'Último pedido',
  Effacer: 'Borrar',
  'Effacer la recherche': 'Borrar la búsqueda',

  // -------------------------------------------------- planning et capacité
  'Chargement du planning…': 'Cargando la agenda…',
  'Semaine précédente': 'Semana anterior',
  'Semaine suivante': 'Semana siguiente',
  Jour: 'Día',
  'Légende :': 'Leyenda:',
  Libre: 'Libre',
  'Affecter une tâche': 'Asignar una tarea',
  'Intitulé de la tâche': 'Nombre de la tarea',
  'Durée (heures)': 'Duración (horas)',
  'Capacité du jour': 'Capacidad del día',
  'Charge globale de l’atelier': 'Carga global del taller',
  Disponibles: 'Disponibles',
  Saturés: 'Completos',
  'Prochaine dispo': 'Próximo hueco',
  'Aucun artisan actif': 'Ningún sastre activo',
  'Composer l’équipe': 'Formar el equipo',

  // ---------------------------------------------- paiements d’une commande
  Paiements: 'Pagos',
  'Chargement des versements…': 'Cargando los pagos…',
  'Enregistrer un versement': 'Registrar un pago',
  'Montant (F CFA)': 'Importe (FCFA)',
  'Date de l’encaissement': 'Fecha del cobro',
  'Le jour où l’argent est entré, pas celui de la saisie.':
    'El día en que entró el dinero, no el día en que se anotó.',
  'Réglé par': 'Pagado con',
  'Note (facultatif)': 'Nota (opcional)',
  'Déjà encaissé': 'Ya cobrado',
  'Reste à payer': 'Queda por pagar',
  'Part du montant encaissée': 'Parte del importe ya cobrada',
  '· date reconstituée': '· fecha reconstruida',

  // ------------------------------------------------ trésorerie et dépenses
  'Trésorerie indisponible': 'Tesorería no disponible',
  'Dépenses indisponibles': 'Gastos no disponibles',
  'Calcul du solde…': 'Calculando el saldo…',
  'Chargement du journal…': 'Cargando el libro…',
  Recettes: 'Ingresos',
  Encaissé: 'Cobrado',
  Résultat: 'Resultado',
  Prévision: 'Previsión',
  'Six derniers mois': 'Últimos seis meses',
  'Total 6 mois': 'Total de 6 meses',
  'Total facturé': 'Total facturado',
  'Total des dépenses': 'Total de gastos',
  'Mois précédent': 'Mes anterior',
  'Mois suivant': 'Mes siguiente',
  'Enregistrer une dépense': 'Registrar un gasto',
  Libellé: 'Concepto',
  'Loyer de l’atelier': 'Alquiler del taller',
  Poste: 'Partida',
  'Par poste': 'Por partida',
  'Tous les postes': 'Todas las partidas',
  'Filtrer par poste': 'Filtrar por partida',
  'Date du décaissement': 'Fecha del pago',
  'La date est celle où l’argent est sorti, pas celle de la saisie.':
    'La fecha es la del día en que salió el dinero, no la de la anotación.',
  'Charges fixes': 'Gastos fijos',
  'Déclarer une charge fixe': 'Declarar un gasto fijo',
  'Montant mensuel (F CFA)': 'Importe mensual (FCFA)',
  'Jour d’échéance': 'Día de vencimiento',
  'Entre 1 et 28 — au-delà, février n’aurait pas d’échéance certaines années.':
    'Entre 1 y 28 — más allá, febrero no tendría vencimiento algunos años.',
  'Elle sert uniquement à la prévision. Aucun mouvement n’est écrit en caisse tant que vous n’avez pas payé.':
    'Solo sirve para la previsión. No se escribe nada en la caja mientras no haya pagado.',
  'solde projeté': 'saldo previsto',
  '— reste du mois': '— resto del mes',
  encaissé: 'cobrado',
  facturé: 'facturado',

  // ----------------------------------------------- téléversement de photos
  'Photo ou glisser-déposer': 'Foto o arrastrar y soltar',

  // --------------------------------------- vocabulaire · genres et statuts
  Femme: 'Mujer',
  Homme: 'Hombre',
  'En cours': 'En curso',
  Essayage: 'Prueba',
  Livraison: 'Entrega',
  'En retard': 'Retrasado',
  Livré: 'Entregado',
  Terminé: 'Terminada',
  Planifié: 'Planificada',
  Bloqué: 'Bloqueada',

  // ------------------------- vocabulaire · étapes et jalons d’une commande
  Modèle: 'Modelo',
  'Commande enregistrée': 'Pedido registrado',
  Confection: 'Confección',

  // --------------------------------------- vocabulaire · postes de dépense
  'Tissus et fournitures': 'Telas y suministros',
  'Salaires et main-d’œuvre': 'Salarios y mano de obra',
  'Broderie et façon': 'Bordado y hechura',
  Commissions: 'Comisiones',
  Loyer: 'Alquiler',
  'Électricité et eau': 'Electricidad y agua',
  'Internet et téléphone': 'Internet y teléfono',
  'Machines et entretien': 'Máquinas y mantenimiento',
  'Transport et livraison': 'Transporte y entrega',
  'Taxes et patente': 'Impuestos y licencia',
  Publicité: 'Publicidad',
  Divers: 'Varios',

  // -------------------------------------- vocabulaire · modes de règlement
  Espèces: 'Efectivo',
  'Mobile Money': 'Mobile Money',
  Virement: 'Transferencia',
  Carte: 'Tarjeta',

  // ---------------------------------------- palettes de mesures · sections
  Haut: 'Parte de arriba',
  Bas: 'Parte de abajo',
  'Buste, manches et longueur d’habit': 'Busto, mangas y largo de la prenda',
  Pantalon: 'Pantalón',
  'Buste, robe et manches': 'Busto, vestido y mangas',
  'Jupe, pantalon et montant': 'Falda, pantalón y tiro',

  // ------------------------------------------ palettes de mesures · relevé
  'Tour de cou': 'Cuello',
  Épaule: 'Hombro',
  Épaules: 'Hombros',
  'Longueur d’épaule': 'Ancho de hombro',
  Poitrine: 'Pecho',
  'Écart poitrine': 'Separación de pecho',
  'Hauteur poitrine': 'Altura de pecho',
  'Longueur de manche': 'Largo de manga',
  'Tour de bras': 'Contorno de brazo',
  'Longueur bras': 'Largo de brazo',
  'Longueur bras total plié': 'Largo total del brazo doblado',
  Coude: 'Codo',
  Poignet: 'Muñeca',
  'Tour du poignet': 'Contorno de muñeca',
  Taille: 'Cintura',
  'Tour de taille': 'Contorno de cintura',
  'Longueur taille devant': 'Talle delantero',
  'Longueur taille dos': 'Talle de espalda',
  'Longueur habit': 'Largo de la prenda',
  'Longueur habit A': 'Largo de la prenda A',
  'Longueur habit B': 'Largo de la prenda B',
  Ceinture: 'Pretina',
  'Tour hanche': 'Cadera',
  'Tour de hanches': 'Caderas',
  'Hauteur taille-hanches': 'De cintura a cadera',
  'Hauteur taille-genou': 'De cintura a rodilla',
  'Hauteur taille-cheville': 'De cintura a tobillo',
  'Hauteur épaules-longueur finie': 'De hombro al largo final',
  'Hauteur bassin': 'Altura de la pelvis',
  'Hauteur montant assis': 'Tiro sentado',
  Entrejambe: 'Entrepierna',
  'Fourche (entrejambe)': 'Tiro (entrepierna)',
  Cuisse: 'Muslo',
  Mollet: 'Pantorrilla',
  Cheville: 'Tobillo',
  'Longueur pantalon': 'Largo del pantalón',

  // ------------------------------------------------------ prise de mesures
  'Rechercher…': 'Buscar…',
  'Mesures {palette}': 'Medidas de {palette}',
  'Palette {palette} sur un client enregistré comme {client}.':
    'Mostrando el conjunto {palette} para un cliente registrado como {client}.',
  '{remplies}/{total} renseignées': '{remplies}/{total} rellenadas',
  '{remplies}/{total} mesures': '{remplies}/{total} medidas',
  '{n} mesures': { one: '{n} medida', other: '{n} medidas' },
  '{n} photos de tissu': { one: '{n} foto de tela', other: '{n} fotos de tela' },
  'modèle photographié': 'modelo fotografiado',
  'aucun modèle': 'sin modelo',
  'Remarques sur la morphologie': 'Observaciones sobre la morfología',
  'Relevé enregistré': 'Medidas guardadas',
  'Conservé à l’écran seulement — connectez-vous pour enregistrer.':
    'Solo se mantiene en pantalla — inicie sesión para guardar.',
  'Créer la commande': 'Crear el pedido',
  'Enregistrer le relevé': 'Guardar las medidas',

  // --------------------------------------------------------------- landing
  'Essai gratuit': 'Prueba gratuita',

  // ---------------------------------------------------- landing · accroche
  'Votre atelier, enfin tenu au clair': 'Su taller, por fin en orden',
  'Commandes, mesures, acomptes, planning de l’équipe. AtelierPro rassemble ce qui vit aujourd’hui dans des carnets, des SMS et de la mémoire.':
    'Pedidos, medidas, anticipos, agenda del equipo. AtelierPro reúne lo que hoy vive en cuadernos, mensajes y memoria.',
  'Trente jours d’essai gratuit. Sans carte bancaire. En français, en anglais, en espagnol, en portugais ou en arabe, dans le navigateur — rien à installer.':
    'Treinta días de prueba gratuita. Sin tarjeta bancaria. En francés, inglés, español, portugués o árabe, en el navegador — nada que instalar.',
  'Créer mon atelier': 'Crear mi taller',
  '30 jours': '30 días',
  'D’essai gratuit, sans carte bancaire': 'De prueba gratuita, sin tarjeta bancaria',
  '0 F': '0 F',
  'À installer — tout passe par le navigateur': 'Por instalar — todo pasa por el navegador',
  'Écrans de gestion, du planning à la trésorerie':
    'Pantallas de gestión, de la agenda a la tesorería',

  // --------------------------------------------- landing · fonctionnalités
  'Tout ce qu’un atelier a besoin de retenir': 'Todo lo que un taller necesita recordar',
  'De la prise de commande à la livraison. Touchez une carte pour voir l’écran correspondant.':
    'De la toma del pedido a la entrega. Toque una tarjeta para ver la pantalla correspondiente.',
  'Planification de l’équipe': 'Planificación del equipo',
  'Affectez les tâches jour par jour et voyez immédiatement qui est saturé. La capacité est propre à chaque artisan : un apprenti à 6 h n’est pas jugé au seuil d’un tailleur senior.':
    'Asigne las tareas día a día y vea al momento quién está saturado. La capacidad es propia de cada sastre: a un aprendiz de 6 h no se le juzga por el umbral de un sastre sénior.',
  'Voir le planning': 'Ver la agenda',
  'Mesures conservées': 'Medidas guardadas',
  'Un relevé corporel par client, enregistré une fois et repris à chaque commande. Photos des tissus apportés et du modèle choisi.':
    'Un registro de medidas por cliente, guardado una vez y reutilizado en cada pedido. Fotos de las telas traídas y del modelo elegido.',
  'Voir le relevé': 'Ver las medidas',
  'Acomptes et soldes': 'Anticipos y saldos',
  'Chaque commande porte son montant, son acompte et son reste à payer, en francs CFA. Le solde se lit sans calcul mental.':
    'Cada pedido lleva su importe, su anticipo y lo que queda por pagar, en francos CFA. El saldo se lee sin cálculo mental.',
  'Voir les commandes': 'Ver los pedidos',
  'Carnet client': 'Libro de clientes',
  'Coordonnées, historique des commandes et mesures d’un client au même endroit. Plus de carnet papier à retrouver.':
    'Contacto, histórico de pedidos y medidas de un cliente en el mismo sitio. Se acabó buscar el cuaderno de papel.',
  'Voir le carnet': 'Ver el libro',
  'Rapports d’atelier': 'Informes del taller',
  'Chiffre d’affaires, tenues les plus demandées, délais de livraison — calculés sur vos commandes réelles, jamais sur des exemples.':
    'Facturación, prendas más pedidas, plazos de entrega — calculados sobre sus pedidos reales, nunca sobre ejemplos.',
  'Voir les rapports': 'Ver los informes',
  'Pensé pour le téléphone': 'Pensado para el móvil',
  'Chaque écran est conçu d’abord pour un écran de téléphone, puis élargi. L’atelier se gère debout, entre deux essayages.':
    'Cada pantalla se diseña primero para un móvil y solo después se ensancha. Un taller se lleva de pie, entre dos pruebas.',
  'Voir le tableau de bord': 'Ver el panel',

  // ------------------------------------------- landing · profils d’atelier
  'Pour tout type d’atelier': 'Para cualquier tipo de taller',
  'Que vous cousiez seul ou que vous meniez une équipe de dix personnes.':
    'Tanto si cose solo como si dirige un equipo de diez personas.',
  'Atelier de quartier': 'Taller de barrio',
  'Un tailleur seul ou deux à trois couturières. Commandes régulières, clientèle fidèle.':
    'Un sastre solo o dos o tres costureras. Pedidos regulares, clientela fiel.',
  'Carnet client, mesures et acomptes au même endroit':
    'Libro de clientes, medidas y anticipos en el mismo sitio',
  'Production collective': 'Producción colectiva',
  'Cinq à dix tailleurs, forte charge. Besoin de coordination et de délais tenus.':
    'De cinco a diez sastres, carga alta. Hace falta coordinación y cumplir plazos.',
  'Charge de chaque artisan, jour par jour, avec sa capacité propre':
    'Carga de cada sastre, día a día, con su propia capacidad',
  'Maison de mode': 'Casa de moda',
  'Pièces de valeur, retouches nombreuses, clientèle exigeante.':
    'Piezas de valor, muchos arreglos, clientela exigente.',
  'Relevé corporel conservé, photos des tissus, solde suivi à l’écriture près':
    'Medidas del cuerpo guardadas, fotos de las telas, saldo seguido apunte a apunte',
  'Ce que ça change': 'Lo que cambia',

  // ------------------------------------------------------ landing · tarifs
  'Des tarifs lisibles': 'Precios que se entienden',
  'Trente jours d’essai sur tous les plans. Sans engagement.':
    'Treinta días de prueba en todos los planes. Sin compromiso.',
  'Le paiement en ligne n’est pas encore ouvert : l’essai démarre sans moyen de paiement, et nous vous contactons avant tout prélèvement.':
    'El pago en línea todavía no está abierto: la prueba empieza sin medio de pago, y le contactamos antes de cualquier cobro.',
  'Le plus choisi': 'El más elegido',
  'Commencer l’essai': 'Empezar la prueba',
  'Nous écrire': 'Escríbanos',
  Découverte: 'Inicial',
  'Pour un atelier qui démarre': 'Para un taller que empieza',
  'Jusqu’à 50 commandes par mois': 'Hasta 50 pedidos al mes',
  'Jusqu’à 5 artisans': 'Hasta 5 sastres',
  'Mesures et paiements': 'Medidas y pagos',
  'Notes d’atelier': 'Notas de taller',
  'Assistance par e-mail': 'Asistencia por correo',
  'Pour une équipe qui grandit': 'Para un equipo que crece',
  'Commandes illimitées': 'Pedidos ilimitados',
  'Jusqu’à 10 artisans': 'Hasta 10 sastres',
  'Planning et capacité par artisan': 'Agenda y capacidad por sastre',
  'Rapports complets': 'Informes completos',
  'Assistance prioritaire': 'Asistencia prioritaria',
  Maison: 'Casa',
  'Pour les grands ateliers': 'Para talleres grandes',
  'Sur devis': 'Según presupuesto',
  'Artisans illimités': 'Sastres ilimitados',
  'Accès à l’API': 'Acceso a la API',
  'Mise en route accompagnée': 'Puesta en marcha acompañada',
  'Formation de l’équipe': 'Formación del equipo',
  'Interlocuteur dédié': 'Interlocutor dedicado',
  '/mois': '/mes',

  // ---------------------------------------- landing · questions fréquentes
  'Questions fréquentes': 'Preguntas frecuentes',
  'Faut-il un téléphone récent ?': '¿Hace falta un móvil reciente?',
  'Non. AtelierPro s’ouvre dans le navigateur, y compris sur un Android ancien et une connexion lente. Aucune installation n’est nécessaire.':
    'No. AtelierPro se abre en el navegador, incluso en un Android antiguo y con conexión lenta. No hace falta instalar nada.',
  'Combien ça coûte ?': '¿Cuánto cuesta?',
  'Trente jours d’essai gratuit, puis de 2 000 à 5 000 F CFA par mois selon le plan. Moins cher qu’une retouche.':
    'Treinta días de prueba gratuita y luego de 2 000 a 5 000 FCFA al mes según el plan. Más barato que un arreglo.',
  'Et si internet est coupé ?': '¿Y si se corta internet?',
  'L’atelier a besoin d’une connexion pour enregistrer ses commandes. Le travail hors-ligne avec synchronisation différée est prévu, il n’est pas encore disponible.':
    'El taller necesita conexión para guardar sus pedidos. El trabajo sin conexión con sincronización diferida está previsto, pero todavía no está disponible.',
  'Comment reprendre mes anciens clients ?': '¿Cómo traigo mis clientes actuales?',
  'Le carnet s’alimente au fil des commandes : le premier client se saisit en moins d’une minute, mesures comprises. Un import de fichier est à l’étude.':
    'El libro se llena al ritmo de los pedidos: el primer cliente se introduce en menos de un minuto, medidas incluidas. La importación de un fichero está en estudio.',
  'C’est pour quel pays ?': '¿Para qué país es?',
  'Conçu pour l’Afrique de l’Ouest : interface en français, en anglais, en espagnol, en portugais ou en arabe, montants en francs CFA sans décimales.':
    'Pensado para África Occidental: interfaz en francés, inglés, español, portugués o árabe, importes en francos CFA sin decimales.',

  // ---------------------------------- landing · témoignages et appel final
  'Ce que disent les tailleurs': 'Lo que dicen los sastres',
  'Des ateliers qui ont troqué le carnet contre l’écran.':
    'Talleres que han cambiado el cuaderno por la pantalla.',
  'Du fil à la livraison': 'Del hilo a la entrega',
  'Prêt à mettre votre atelier au clair ?': '¿Listo para poner su taller en orden?',
  'Trente jours gratuits, sans moyen de paiement. La première commande se saisit en deux minutes.':
    'Treinta días gratis, sin medio de pago. El primer pedido se introduce en dos minutos.',
  'Une question ? Écrivez-nous sur WhatsApp': '¿Alguna duda? Escríbanos por WhatsApp',

  // ---------------------------------- landing · navigation et pied de page
  Fonctionnalités: 'Funciones',
  Tarifs: 'Precios',
  Témoignages: 'Testimonios',
  Questions: 'Preguntas',
  'Liens de bas de page': 'Enlaces de pie de página',
  Confidentialité: 'Privacidad',
  'Conditions d’utilisation': 'Condiciones de uso',
  Contact: 'Contacto',
  'Fait pour l’Afrique de l’Ouest. © {annee}': 'Hecho para África Occidental. © {annee}',
  'Retour à l’accueil': 'Volver al inicio',

  // ---------------------------------- alertes d’atelier · phrases rejouées
  'Commande {reference} en retard — {client}': 'Pedido {reference} retrasado — {client}',
  '{tenue} devait être livrée le {date}.': '{tenue} debía entregarse el {date}.',
  'Livraison demain — {client}': 'Entrega mañana — {client}',
  '{tenue} ({reference}) est attendue demain.': '{tenue} ({reference}) se espera mañana.',
  'Voir la commande': 'Ver el pedido',
  'À l’instant': 'Ahora mismo',

  // -------------------------------------------------------- titres d’écran
  'Prise de mesures': 'Tomar medidas',
  'Capacité de l’équipe': 'Capacidad del equipo',
  'Trésorerie de l’atelier': 'Tesorería del taller',
  'Politique de confidentialité': 'Política de privacidad',
  'Retour au dashboard': 'Volver al panel',
  'Retour à la connexion': 'Volver al inicio de sesión',
  'Échec de connexion': 'Error al iniciar sesión',
  Imprimer: 'Imprimir',
  'Voir tout': 'Ver todo',
  'Voir toutes les commandes': 'Ver todos los pedidos',
  'Réinitialiser les filtres': 'Restablecer los filtros',

  // ------------------------------ commandes · liste, fiche et écrans vides
  'Client & tenue': 'Cliente y prenda',
  'Client / Tenue': 'Cliente / Prenda',
  'Chargement des commandes…': 'Cargando los pedidos…',
  'Détails de la commande': 'Detalles del pedido',
  'Détails du modèle': 'Detalles del modelo',
  'Mesures corporelles': 'Medidas del cuerpo',
  'Tissus apportés par le client': 'Telas traídas por el cliente',
  'Couleur / motif': 'Color / estampado',
  'Date de livraison': 'Fecha de entrega',
  'C’est la date promise au client — elle sert au planning et aux alertes de retard.':
    'Es la fecha prometida al cliente — de ella dependen la agenda y los avisos de retraso.',
  Urgent: 'Urgente',
  Nouvelle: 'Nuevo',
  Saisir: 'Anotar',
  Montant: 'Importe',
  'Elle a peut-être été supprimée, ou appartient à un autre atelier.':
    'Puede que se haya eliminado, o pertenece a otro taller.',
  'Aucun tissu photographié. Les tissus se prennent en photo pendant le relevé de mesures.':
    'Ninguna tela fotografiada. Las telas se fotografían mientras se toman las medidas.',
  'Confirmée à l’écran seulement — connectez-vous pour l’enregistrer.':
    'Confirmado solo en pantalla — inicie sesión para guardarlo.',
  'Créez d’abord un client dans le carnet : une commande lui sera rattachée.':
    'Cree primero un cliente en el libro: el pedido quedará vinculado a él.',
  'En créer un': 'Crear uno',
  'En ajouter une': 'Añadir uno',
  ', livraison {date}': ', entrega el {date}',
  'Commande {reference} enregistrée pour {client} — {tenue}{livraison}.':
    'Pedido {reference} registrado para {client} — {tenue}{livraison}.',
  'Commande confirmée pour {client} — {tenue}{livraison}.':
    'Pedido confirmado para {client} — {tenue}{livraison}.',

  // ---------------------------------------------------- paiements et notes
  'Aucun acompte': 'Sin anticipo',
  'Aucun versement enregistré. La commande est entièrement due.':
    'Ningún pago registrado. El pedido está pendiente por completo.',
  'Ajouter note': 'Añadir nota',
  'Aucune note pour l’instant. Ce qui s’écrit ici suit la commande — essayage, retouche demandée, tissu manquant.':
    'Todavía no hay notas. Lo que se escribe aquí acompaña al pedido — prueba, arreglo pedido, tela que falta.',
  'Connectez-vous pour lire et écrire les notes de cette commande.':
    'Inicie sesión para leer y escribir las notas de este pedido.',

  // --------------------------------------------------------------- clients
  'Ajouter le premier client': 'Añadir el primer cliente',
  'Historique commandes': 'Histórico de pedidos',
  'Aucune commande enregistrée pour ce client.': 'Ningún pedido registrado para este cliente.',
  Fidèle: 'Habitual',
  'Pas de numéro': 'Sin número',
  'Les mesures se rattachent à un client. Créez-en un depuis le carnet, puis revenez ici.':
    'Las medidas se vinculan a un cliente. Cree uno desde el libro y vuelva aquí.',

  // ---------------------------------------------------- planning et équipe
  'Affecter tâche': 'Asignar tarea',
  'Charge totale': 'Carga total',
  'CA généré': 'Facturación generada',
  'Aucune commande assignée pour l’instant.': 'Ningún pedido asignado por ahora.',
  'Le planning se remplit par artisan. Composez votre équipe pour commencer à affecter des tâches.':
    'La agenda se llena por sastre. Forme su equipo para empezar a asignar tareas.',

  // -------------------------------------------------------------- rapports
  'Chiffre d’affaires mensuel': 'Facturación mensual',
  'Tenues les plus commandées': 'Prendas más pedidas',
  'Performance par artisan': 'Rendimiento por sastre',
  'Statut des paiements': 'Estado de los pagos',
  'Payé intégral': 'Pagado por completo',
  'Non payé': 'Sin pagar',
  'Les rapports se calculent depuis vos commandes réelles. Connectez-vous pour les consulter — afficher des chiffres d’exemple ici induirait en erreur.':
    'Los informes se calculan a partir de sus pedidos reales. Inicie sesión para consultarlos — mostrar aquí cifras de ejemplo llevaría a error.',

  // ------------------------------------------------ trésorerie et dépenses
  'Argent réellement encaissé, moins les dépenses décaissées, depuis l’ouverture du journal.':
    'Dinero realmente cobrado, menos los gastos pagados, desde la apertura del libro.',
  'Dernier solde connu — vérification en cours…': 'Último saldo conocido — comprobando…',
  'Entrées attendues d’après le reste à payer de vos commandes, sorties d’après vos charges déclarées. Ce n’est pas un constat.':
    'Entradas esperadas según lo que queda por pagar de sus pedidos, salidas según sus gastos declarados. No es una constatación.',
  'La caisse passe sous zéro dans les mois qui viennent si rien ne change.':
    'La caja pasa a negativo en los próximos meses si nada cambia.',
  'Déclarer une charge': 'Declarar un gasto',
  'Aucune charge déclarée — la prévision ne compte donc aucune sortie.':
    'Ningún gasto declarado — la previsión no cuenta, por tanto, ninguna salida.',
  'Déclarées une fois, elles alimentent la prévision. Elles n’écrivent rien en caisse : c’est la saisie d’une dépense qui fait bouger le solde.':
    'Declarados una vez, alimentan la previsión. No escriben nada en la caja: es la anotación de un gasto lo que mueve el saldo.',
  'Enregistrez vos achats de tissu, salaires et charges au fur et à mesure : la trésorerie s’en déduit toute seule.':
    'Registre sus compras de tela, salarios y gastos sobre la marcha: la tesorería se deduce sola.',
  'Le solde de votre atelier ne s’affiche qu’une fois connecté. Aucun jeu d’exemple n’est proposé ici : on prend des décisions d’achat avec ce chiffre.':
    'El saldo de su taller solo aparece una vez iniciada la sesión. Aquí no se ofrece ningún juego de ejemplo: con esta cifra se toman decisiones de compra.',
  'Les dépenses de votre atelier ne s’affichent qu’une fois connecté. Aucun jeu d’exemple n’est proposé ici : un chiffre d’argent inventé n’aiderait personne.':
    'Los gastos de su taller solo aparecen una vez iniciada la sesión. Aquí no se ofrece ningún juego de ejemplo: una cifra de dinero inventada no ayudaría a nadie.',

  // --------------------------------------------------------- notifications
  'Chargement des notifications…': 'Cargando las notificaciones…',
  'Marquer comme lue': 'Marcar como leída',
  'Tout marquer comme lu': 'Marcarlo todo como leído',
  'Rien ne vous a été signalé. Les retards et les livraisons du lendemain sont vérifiés chaque matin — aucune échéance ne tombe aujourd’hui.':
    'No se le ha señalado nada. Los retrasos y las entregas del día siguiente se comprueban cada mañana — hoy no vence ningún plazo.',
  'Vos alertes ne s’affichent qu’une fois connecté. Aucun jeu d’exemple n’est proposé ici : une notification affirme un fait daté, et une alerte inventée se confondrait avec une vraie.':
    'Sus avisos solo aparecen una vez iniciada la sesión. Aquí no se ofrece ningún juego de ejemplo: una notificación afirma un hecho con fecha, y un aviso inventado se confundiría con uno real.',

  // ------------------------------------------------- compte et inscription
  'Créer votre atelier': 'Crear su taller',
  'Quelques secondes pour commencer à suivre vos commandes.':
    'Unos segundos para empezar a seguir sus pedidos.',
  'Un code de vérification vous sera envoyé par e-mail.':
    'Se le enviará un código de verificación por correo.',
  '10 caractères minimum. Une phrase est plus sûre qu’un mot compliqué.':
    'Mínimo 10 caracteres. Una frase es más segura que una palabra complicada.',
  'Mot de passe actuel': 'Contraseña actual',
  'Confirmer le nouveau mot de passe': 'Confirmar la nueva contraseña',
  'Comptes liés': 'Cuentas vinculadas',
  'Lier Google': 'Vincular Google',
  Lié: 'Vinculada',

  // --------------------------------------------------------- pages légales
  'Ce document n’est pas encore rédigé. Il le sera avant l’ouverture des inscriptions payantes, et cette page portera alors le texte complet plutôt que cet avis.':
    'Este documento todavía no está redactado. Lo estará antes de que se abran las suscripciones de pago, y esta página llevará entonces el texto completo en lugar de este aviso.',
  'Deux points méritent d’être dits dès maintenant, parce qu’ils engagent les deux parties :':
    'Hay dos puntos que merecen decirse ya, porque obligan a ambas partes:',
  'Le paiement en ligne n’est pas ouvert. Aucun prélèvement n’est possible aujourd’hui, quel que soit le plan affiché sur la page d’accueil.':
    'El pago en línea no está abierto. Hoy no es posible ningún cobro, sea cual sea el plan que muestre la página de inicio.',
  'Le service est en cours de construction. Certaines fonctions annoncées sur la page d’accueil — travail hors-ligne, import de fichier clients — ne sont pas encore disponibles.':
    'El servicio está en construcción. Algunas funciones anunciadas en la página de inicio — trabajo sin conexión, importación de fichero de clientes — todavía no están disponibles.',
  'En attendant, voici ce que l’application fait réellement des données, tel qu’on peut le vérifier dans son code :':
    'Mientras tanto, esto es lo que la aplicación hace realmente con los datos, tal como puede comprobarse en su código:',
  'Les données d’un atelier — clients, mesures, commandes, planning, équipe — sont rattachées à son compte et ne sont jamais lues par un autre atelier.':
    'Los datos de un taller — clientes, medidas, pedidos, agenda, equipo — están vinculados a su cuenta y ningún otro taller los lee nunca.',
  'Les mots de passe ne sont pas conservés en clair ; seule une empreinte est stockée.':
    'Las contraseñas no se guardan en claro; solo se almacena una huella.',
  'Les photos de tissus et de modèles sont hébergées chez Cloudinary. Les e-mails de vérification transitent par Resend.':
    'Las fotos de telas y de modelos están alojadas en Cloudinary. Los correos de verificación pasan por Resend.',
  'Aucune donnée n’est revendue ni cédée à des fins publicitaires.':
    'Ningún dato se revende ni se cede con fines publicitarios.',
  'Pour une demande de suppression de compte ou d’export de vos données, écrivez-nous depuis la page d’accueil.':
    'Para solicitar la eliminación de la cuenta o la exportación de sus datos, escríbanos desde la página de inicio.',

  // --------------------------- liste des commandes · filtres et pagination
  'Affichage {premiere}–{derniere} sur {total}': 'Mostrando {premiere}–{derniere} de {total}',
  'Rien ne correspond à « {recherche} »{filtre}.': 'Nada coincide con «{recherche}»{filtre}.',
  ' dans le filtre « {nom} »': ' en el filtro «{nom}»',
  'Aucune commande avec le statut « {statut} ».': 'Ningún pedido con el estado «{statut}».',
  '{n} commandes': { one: '{n} pedido', other: '{n} pedidos' },

  // ----------------------------- tableau de bord · indicateurs et capacité
  'Commandes actives': 'Pedidos activos',
  'À livrer': 'Por entregar',
  'Clients ce mois': 'Clientes este mes',
  'chargement…': 'cargando…',
  exemples: 'ejemplos',
  'à traiter': 'por atender',
  'Calcul…': 'Calculando…',
  'Calcul de la charge du jour…': 'Calculando la carga del día…',
  'Journée saturée': 'Día completo',
  '{n} place disponible': { one: '{n} hueco libre', other: '{n} huecos libres' },
  '{utilisees} h engagées sur {total} h — voir le planning':
    '{utilisees} h ocupadas de {total} h — ver la agenda',
  'Équipe de {n} — d’après les tâches du jour': 'Equipo de {n} — según las tareas del día',
  'Aucun artisan — composez votre équipe.': 'Ningún sastre — forme su equipo.',
  'Aucun artisan actif.': 'Ningún sastre activo.',
  'Aucun artisan.': 'Ningún sastre.',
  'Toute l’équipe est saturée aujourd’hui.': 'Todo el equipo está completo hoy.',
  '{n} h encore libres aujourd’hui': '{n} h todavía libres hoy',
  'Aucune commande en cours.': 'Ningún pedido en curso.',

  // -------------------------------------------------------------- planning
  'Planning équipe': 'Agenda del equipo',
  'Semaine du {debut} au {fin}': 'Semana del {debut} al {fin}',
  'Semaine du {debut} au {fin} {mois} {annee}': 'Semana del {debut} al {fin} de {mois} de {annee}',
  'Revenir à la semaine en cours': 'Volver a la semana actual',
  Affecter: 'Asignar',
  'Affectation…': 'Asignando…',
  'Mode démonstration — la tâche restera à l’écran seulement.':
    'Modo de demostración — la tarea se queda solo en pantalla.',
  'La charge de l’artisan se met à jour immédiatement.':
    'La carga del sastre se actualiza al momento.',
  Saturé: 'Completo',
  'Quasi-plein': 'Casi lleno',
  Disponible: 'Disponible',

  // -------------------- fiche commande et carnet · onglets et champs vides
  Infos: 'Datos',
  Tissus: 'Telas',
  Récapitulatif: 'Resumen',
  Suivi: 'Seguimiento',
  'Commande introuvable': 'Pedido no encontrado',
  'Commande soldée': 'Pedido liquidado',
  'Confirmer la commande': 'Confirmar el pedido',
  'Champ requis': 'Campo obligatorio',
  'Non renseigné': 'Sin indicar',
  'Téléphone non renseigné': 'Teléfono sin indicar',
  'Tissu non renseigné': 'Tela sin indicar',
  'Tissu apporté par le client': 'Tela traída por el cliente',
  'Aucun relevé': 'Sin medidas',
  Relever: 'Tomar medidas',
  'Aucune commande': 'Ningún pedido',
  'Créer le client': 'Crear el cliente',
  'Aucune consigne particulière n’a été saisie.': 'No se ha anotado ninguna indicación especial.',
  'Le statut n’a pas pu être enregistré.': 'No se ha podido guardar el estado.',
  'Les mesures ne sont pas consultables en mode démonstration.':
    'Las medidas no se pueden consultar en modo de demostración.',
  'Marquer livrée': 'Marcar como entregado',
  'Passer à l’essayage': 'Pasar a la prueba',
  'Valider l’essayage': 'Validar la prueba',
  'Aucun artisan actif — composez l’équipe dans les paramètres':
    'Ningún sastre activo — forme el equipo en los ajustes',
  'Aucun artisan assigné.': 'Ningún sastre asignado.',

  // ------------------------------------------- notifications et navigation
  'Aucune notification': 'Ninguna notificación',
  'Aucune notification dans cette catégorie': 'Ninguna notificación en esta categoría',
  'Ouvrir le menu': 'Abrir el menú',
  'Fermer le menu': 'Cerrar el menú',
  'Exporter PDF': 'Exportar PDF',
  'Genre du client': 'Género del cliente',

  // ---------------------------------- trésorerie et dépenses · compléments
  Déclarer: 'Declarar',
  Suspendre: 'Suspender',
  Réactiver: 'Reactivar',
  'Sans poste': 'Sin partida',

  // ------------------------------------------------ rapports · compléments
  'non mesurable': 'no medible',
  'des livraisons': 'de las entregas',
  'de la commande à la livraison': 'del pedido a la entrega',
  'Indicateurs indisponibles.': 'Indicadores no disponibles.',

  // ------------------------------------------------------- envoi de photos
  local: 'local',
  'Retirer {fichier}': 'Quitar {fichier}',
  'Photo affichée localement seulement — connectez-vous pour l’enregistrer durablement.':
    'Foto mostrada solo en local — inicie sesión para guardarla de forma duradera.',
  'L’envoi a échoué — la photo reste visible mais n’est pas enregistrée.':
    'La subida ha fallado — la foto sigue visible pero no se ha guardado.',
  'Serveur injoignable — la photo reste visible mais n’est pas enregistrée.':
    'Servidor inaccesible — la foto sigue visible pero no se ha guardado.',
  '« {fichier} » dépasse la taille maximale autorisée.':
    '«{fichier}» supera el tamaño máximo permitido.',
  '« {fichier} » n’est pas une image acceptée (JPEG, PNG, WebP).':
    '«{fichier}» no es una imagen aceptada (JPEG, PNG, WebP).',

  // ----------------------------------------------------------- inscription
  'Créer mon compte': 'Crear mi cuenta',
  'Création…': 'Creando…',

  // ------------------------------------------ messages d’erreur des écrans
  'Planning indisponible.': 'Agenda no disponible.',
  'Trésorerie indisponible.': 'Tesorería no disponible.',
  'Journal indisponible.': 'Libro no disponible.',
  'Charges indisponibles.': 'Gastos fijos no disponibles.',
  'Notes indisponibles.': 'Notas no disponibles.',
  'Réglages indisponibles.': 'Ajustes no disponibles.',
  'Grille tarifaire indisponible.': 'Tarifario no disponible.',
  'Note non enregistrée.': 'Nota no guardada.',
  'Réglage non enregistré.': 'Ajuste no guardado.',
  'Modification non enregistrée.': 'Cambio no guardado.',
  'Modification impossible.': 'No se puede modificar.',
  'Suppression impossible.': 'No se puede eliminar.',
  'Commande inconnue.': 'Pedido desconocido.',
  'Aucune mesure renseignée.': 'Ninguna medida indicada.',
  'Impossible de charger l’équipe.': 'No se ha podido cargar el equipo.',
  'Impossible d’ajouter cet artisan.': 'No se ha podido añadir a este sastre.',
  'Impossible d’enregistrer ce tarif.': 'No se ha podido guardar este precio.',
  'Impossible d’enregistrer l’écriture.': 'No se ha podido guardar el apunte.',
  'Impossible d’enregistrer la charge.': 'No se ha podido guardar el gasto fijo.',
  'Impossible d’enregistrer la tâche.': 'No se ha podido guardar la tarea.',
  'Impossible de calculer les indicateurs.': 'No se han podido calcular los indicadores.',
  'Un artisan porte déjà ce nom.': 'Ya hay un sastre con ese nombre.',
  'Un client porte déjà ce nom.': 'Ya hay un cliente con ese nombre.',
  'Cette tenue figure déjà dans la grille.': 'Esta prenda ya está en el tarifario.',
  'Connectez-vous pour composer votre équipe.': 'Inicie sesión para formar su equipo.',
  'Connectez-vous pour composer votre grille.': 'Inicie sesión para componer su tarifario.',
  'Connectez-vous pour régler vos alertes.': 'Inicie sesión para configurar sus avisos.',
  'Session expirée — reconnectez-vous.': 'Sesión caducada — inicie sesión de nuevo.',
  'Session expirée — reconnectez-vous pour écrire une note.':
    'Sesión caducada — inicie sesión de nuevo para escribir una nota.',
  'Cette date est déjà passée — la commande naîtrait en retard.':
    'Esta fecha ya ha pasado — el pedido nacería retrasado.',
  'L’acompte dépasse le montant de la commande.': 'El anticipo supera el importe del pedido.',
  'Le tissu n’est pas renseigné.': 'La tela no está indicada.',
  'Aucun tarif dans votre grille — ajoutez-en un dans Paramètres › Tarification.':
    'Ningún precio en su tarifario — añada uno en Ajustes › Tarifas.',
  'Le montant doit être un nombre supérieur à zéro.':
    'El importe debe ser un número mayor que cero.',
  'Trop de commandes créées en même temps. Réessayez.':
    'Demasiados pedidos creados a la vez. Inténtelo de nuevo.',

  // --------------------------------- compte · mot de passe et comptes liés
  'Connecté en tant que {email}': 'Sesión iniciada como {email}',
  'Définir un mot de passe': 'Establecer una contraseña',
  'Définir le mot de passe': 'Establecer la contraseña',
  'Tu peux modifier ton mot de passe ici. Les autres sessions seront déconnectées.':
    'Puede cambiar aquí su contraseña. Las demás sesiones se cerrarán.',
  'Tu t’es connecté via Google. Définis un mot de passe pour pouvoir aussi te connecter par email.':
    'Ha iniciado sesión con Google. Establezca una contraseña para poder entrar también por correo.',
  'Tu peux te connecter via Google.': 'Puede iniciar sesión con Google.',
  'Lie ton compte Google pour te connecter en un clic.':
    'Vincule su cuenta de Google para entrar con un clic.',
  'Saisis un nouveau mot de passe.': 'Introduzca una nueva contraseña.',
  'La confirmation ne correspond pas au nouveau mot de passe.':
    'La confirmación no coincide con la nueva contraseña.',
  'Mot de passe mis à jour.': 'Contraseña actualizada.',
  'Mot de passe défini. Tu peux maintenant te connecter par email.':
    'Contraseña establecida. Ya puede iniciar sesión por correo.',
  'Mot de passe actuel incorrect.': 'La contraseña actual es incorrecta.',
  'Ce mot de passe est trop courant.': 'Esta contraseña es demasiado común.',
  'Mot de passe trop court.': 'Contraseña demasiado corta.',
  'Ce mot de passe a fuité — choisis-en un autre.': 'Esta contraseña se ha filtrado — elija otra.',
  'Un mot de passe est déjà défini. Utilise « changer le mot de passe ».':
    'Ya hay una contraseña establecida. Use «cambiar la contraseña».',
  'Champs invalides.': 'Campos no válidos.',
  'Erreur réseau. Réessaie.': 'Error de red. Inténtelo de nuevo.',

  // ------------------- phrases interpolées, longtemps restées en français
  '{n} mesures — buste, robe et bas.': '{n} medidas — busto, vestido y parte de abajo.',
  '{n} mesures — buste, manches et pantalon.': '{n} medidas — busto, mangas y pantalón.',
  '{n} clients': { one: '{n} cliente', other: '{n} clientes' },
  'sur {total}': 'de {total}',
  '· palette {genre}': '· conjunto {genre}',
  'Relevé du {date}': 'Medidas del {date}',
  '{n} écritures': { one: '{n} apunte', other: '{n} apuntes' },
  'Aucune mesure relevée pour {client}. Prenez le relevé avant de tailler.':
    'Ninguna medida tomada para {client}. Tome las medidas antes de cortar.',
  'Tarif de façon : {prix}': 'Precio de hechura: {prix}',
  '{utilisees}/{total} h engagées aujourd’hui': '{utilisees}/{total} h ocupadas hoy',
  '{nom} — {utilisees}/{total} h engagées aujourd’hui':
    '{nom} — {utilisees}/{total} h ocupadas hoy',
  'Annuler le versement de {montant}': 'Anular el pago de {montant}',
  'Reste à encaisser : {montant}. Le versement entre aussitôt en trésorerie.':
    'Queda por cobrar: {montant}. El pago entra de inmediato en la tesorería.',
  rapports: 'informes',
  'Dépenses {montant}': 'Gastos {montant}',
  'Charge de {nom}': 'Carga de {nom}',
  'Ces montants comptent l’argent {encaisse}. Le chiffre d’affaires des {rapports} compte l’argent {facture} : une commande de 80 000 F réglée de 20 000 F y pèse 80 000 F. Les deux sont justes et vont différer.':
    'Estos importes cuentan el dinero {encaisse}. La facturación de los {rapports} cuenta el dinero {facture}: un pedido de 80 000 F del que se han pagado 20 000 F pesa allí 80 000 F. Ambos son correctos y van a diferir.',
  '{n} écritures ont été reconstituées depuis un acompte antérieur au journal. Leur date est celle de la commande, faute de mieux : le solde du mois concerné est approximatif.':
    {
      one: '{n} apunte se ha reconstruido a partir de un anticipo anterior al libro. Su fecha es la del pedido, a falta de algo mejor: el saldo de ese mes es aproximado.',
      other:
        '{n} apuntes se han reconstruido a partir de anticipos anteriores al libro. Sus fechas son las de los pedidos, a falta de algo mejor: el saldo de esos meses es aproximado.',
    },

  // --------------------- messages d’erreur restés en français à l’écran
  'Aucun artisan': 'Ningún sastre',
  'Impossible de joindre le serveur. Vérifiez votre connexion.':
    'No se ha podido contactar con el servidor. Compruebe su conexión.',
  'Trop de demandes. Patientez quelques minutes.': 'Demasiadas peticiones. Espere unos minutos.',
  'Trop de tentatives. Réessayez dans une heure.':
    'Demasiados intentos. Inténtelo de nuevo dentro de una hora.',
  'Vérifiez l’adresse e-mail saisie.': 'Compruebe la dirección de correo introducida.',
  'Le numéro doit commencer par un indicatif, par exemple +226.':
    'El número debe empezar por un prefijo, por ejemplo +226.',

  // ------------------------------------------- connexion Google · page d’échec
  "Votre adresse Google n'est pas vérifiée. Vérifiez-la sur votre compte Google, puis réessayez.":
    'Su dirección de Google no está verificada. Verifíquela en su cuenta de Google e inténtelo de nuevo.',
  'La connexion a été interrompue (vérification de sécurité). Cela peut arriver si la page Google est restée ouverte trop longtemps — réessayez.':
    'El inicio de sesión se ha interrumpido (comprobación de seguridad). Puede pasar si la página de Google ha estado abierta demasiado tiempo — inténtelo de nuevo.',
  'Google a refusé la connexion. Réessayez dans un instant.':
    'Google ha rechazado el inicio de sesión. Inténtelo de nuevo en un momento.',
  'La connexion via Google n’est pas activée sur ce serveur. Contactez le support.':
    'El inicio de sesión con Google no está activado en este servidor. Contacte con el soporte.',
  'Une erreur inattendue est survenue pendant la connexion. Réessayez.':
    'Se ha producido un error inesperado durante el inicio de sesión. Inténtelo de nuevo.',
  'Une erreur inconnue est survenue pendant la connexion. Réessayez.':
    'Se ha producido un error desconocido durante el inicio de sesión. Inténtelo de nuevo.',

  // ------------------------------------------- trésorerie · phrases de l’écran
  recettes: 'ingresos',
  dépenses: 'gastos',
  'solde {montant}': 'saldo {montant}',
  'Recettes {montant}': 'Ingresos {montant}',
  'Dépenses de {mois}': 'Gastos de {mois}',
  'Aucune dépense enregistrée ce mois-ci.': 'Ningún gasto registrado este mes.',
  '+{entrees} attendus · −{sorties} de charges': '+{entrees} previstos · −{sorties} de gastos',
  'attendus sur {n} commandes dont l’échéance est dépassée. C’est souvent ce qui explique un solde plus bas que prévu.':
    {
      one: 'previstos en {n} pedido con el plazo superado. Eso es a menudo lo que explica un saldo más bajo de lo previsto.',
      other:
        'previstos en {n} pedidos con el plazo superado. Eso es a menudo lo que explica un saldo más bajo de lo previsto.',
    },
  '{montant} restent à encaisser sur {n} commandes sans date de livraison — impossible de les placer sur le calendrier.':
    {
      one: 'Quedan {montant} por cobrar en {n} pedido sin fecha de entrega — imposible situarlo en el calendario.',
      other:
        'Quedan {montant} por cobrar en {n} pedidos sin fecha de entrega — imposible situarlos en el calendario.',
    },
  '· le {jour} du mois': '· el {jour} de cada mes',
  'Supprimer « {libelle} »': 'Eliminar «{libelle}»',
  '{montant} dû': '{montant} pendientes',
  '· reste {montant}': '· quedan {montant}',

  // ------------------------------------------------------------ inscription
  'Vous avez déjà un compte ?': '¿Ya tiene cuenta?',
  'Plan retenu : {plan}. L’essai de 30 jours démarre sans moyen de paiement — vous pourrez encore en changer.':
    'Plan elegido: {plan}. La prueba de 30 días empieza sin medio de pago — todavía podrá cambiarlo.',

  // ------------------------- derniers textes d’écran restés en français
  'Assigné : {artisan}': 'Asignado a: {artisan}',
  'Livraison {date}': 'Entrega {date}',
  'Aucun client ne correspond à « {recherche} ».': 'Ningún cliente coincide con «{recherche}».',
  'Aucune dépense en {mois}': 'Ningún gasto en {mois}',
  '{montant} au total': '{montant} en total',
  '{nom} est déjà saturé aujourd’hui ({utilisees}/{total} h) — la livraison estimée en tiendra compte.':
    '{nom} ya está completo hoy ({utilisees}/{total} h) — la entrega estimada lo tendrá en cuenta.',
  'Modèle choisi par le client': 'Modelo elegido por el cliente',
  // ------------------------------------------------- paliers d’abonnement
  '2 artisans': '2 sastres',
  '5 artisans': '5 sastres',
  '15 artisans': '15 sastres',
  'Acomptes et soldes suivis': 'Anticipos y saldos controlados',
  'Alertes de retard et de livraison': 'Avisos de retraso y de entrega',
  'Choisir ce palier': 'Elegir este nivel',
  'Cinq langues, dont l’arabe': 'Cinco idiomas, árabe incluido',
  'Clients et commandes illimités': 'Clientes y pedidos ilimitados',
  Commencer: 'Empezar',
  'Dépenses et charges récurrentes': 'Gastos y cargas periódicas',
  Essentiel: 'Esencial',
  'Faut-il payer d’avance ?': '¿Hay que pagar por adelantado?',
  'Formule de règlement': 'Modalidad de pago',
  Freemium: 'Freemium',
  Gratuit: 'Gratis',
  'Grille tarifaire et notes d’atelier': 'Tarifas y notas del taller',
  'Interlocuteur WhatsApp dédié': 'Un contacto de WhatsApp dedicado',
  'Je ne suis plus seul.': 'Ya no trabajo solo.',
  'Je tiens une entreprise.': 'Llevo una empresa.',
  'Le carnet complet, sans limite de durée': 'El cuaderno entero, sin límite de tiempo',
  'Le carnet papier, remplacé.': 'El cuaderno de papel, sustituido.',
  'Logo de l’atelier': 'Logotipo del taller',
  'Mannequin — 15 rendus par mois': 'Maniquí — 15 imágenes al mes',
  'Par mois pour le planning et les photos': 'Al mes para la agenda y las fotos',
  'Photos du tissu et du modèle': 'Fotos de la tela y del modelo',
  'Planning avec capacité par artisan': 'Agenda con la capacidad de cada sastre',
  'Pour toujours': 'Para siempre',
  Premium: 'Premium',
  Pro: 'Pro',
  'Que se passe-t-il si j’arrête de payer ?': '¿Qué pasa si dejo de pagar?',
  'Rapports et export PDF': 'Informes y exportación en PDF',
  'Relevé de mesures, sans photo': 'Medidas, sin fotos',
  'Reprise de votre carnet papier': 'Pasamos su cuaderno de papel',
  'Tout le Freemium, plus': 'Todo lo de Freemium, más',
  'Tout l’Essentiel, plus': 'Todo lo de Esencial, más',
  'Tout le Pro, plus': 'Todo lo de Pro, más',
  'Trésorerie — journal de caisse daté': 'Caja — libro de caja con fechas',
  mois: 'meses',
  'par mois': 'al mes',
  'La vitrine — le seul palier qui aide à trouver des clientes.':
    'El escaparate — el único nivel que ayuda a encontrar clientas.',
  'Le carnet est gratuit, sans limite de durée. Vous ne payez que le jour où l’atelier grandit.':
    'El cuaderno es gratis, sin límite de tiempo. Solo paga el día en que el taller crece.',
  'Le trimestre offre un demi-mois, l’année offre trois mois. Aucun prélèvement automatique : vous payez, la date recule.':
    'El trimestre regala medio mes, el año regala tres. Sin domiciliación: usted paga y la fecha se aplaza.',
  'Le paiement en ligne n’est pas encore ouvert. Créez votre atelier gratuitement : nous vous contactons avant tout encaissement.':
    'El pago en línea aún no está abierto. Cree su taller gratis: le avisamos antes de cobrar nada.',
  'Palier retenu : {plan}. Votre atelier s’ouvre gratuitement — nous vous contactons avant tout encaissement.':
    'Nivel elegido: {plan}. Su taller se abre gratis: le avisamos antes de cobrar nada.',
  'Gratuit pour commencer, sans moyen de paiement. La première commande se saisit en deux minutes.':
    'Gratis para empezar, sin medio de pago. El primer pedido se anota en dos minutos.',
  'Gratuit pour tenir votre carnet, sans carte bancaire. En français, en anglais, en espagnol, en portugais ou en arabe, dans le navigateur — rien à installer.':
    'Gratis para llevar su cuaderno, sin tarjeta bancaria. En francés, inglés, español, portugués o árabe, en el navegador: nada que instalar.',
  'Rien pour tenir votre carnet, vos clientes et vos commandes — sans limite de durée et sans carte bancaire. Le planning d’équipe et les photos commencent à 2 000 F CFA par mois, la trésorerie et les rapports à 5 000 F. Moins cher qu’une retouche.':
    'Nada por llevar su cuaderno, sus clientas y sus pedidos, sin límite de tiempo y sin tarjeta bancaria. La agenda del equipo y las fotos empiezan en 2 000 F CFA al mes; la caja y los informes, en 5 000 F. Más barato que un arreglo.',
  'Vous choisissez : au mois, au trimestre ou à l’année. Le trimestre offre un demi-mois, l’année offre trois mois — vous pouvez refaire le calcul vous-même. Il n’y a aucun prélèvement automatique : vous payez, la date recule, et rien ne se déclenche tout seul.':
    'Usted elige: al mes, al trimestre o al año. El trimestre regala medio mes y el año regala tres; puede rehacer la cuenta usted mismo. No hay domiciliación: usted paga, la fecha se aplaza y nada se activa solo.',
  'Vous revenez au gratuit, et rien n’est effacé. Vos clientes, vos commandes, vos mesures et vos photos restent lisibles. Ce sont les écrans payants et les nouveaux envois de photos qui se ferment, pas vos données.':
    'Vuelve al plan gratis y no se borra nada. Sus clientas, sus pedidos, sus medidas y sus fotos siguen legibles. Lo que se cierra son las pantallas de pago y los nuevos envíos de fotos, no sus datos.',
};
