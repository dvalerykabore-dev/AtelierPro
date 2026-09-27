import type { Dictionnaire } from '@/lib/i18n/traduire';

/**
 * Traductions arabes — arabe standard moderne.
 *
 * L'arabe standard plutôt qu'un dialecte : c'est la langue écrite comprise du
 * Maghreb au Golfe, et un atelier de Ouagadougou peut employer aussi bien un
 * arabophone du Mali que du Tchad.
 *
 * Deux rappels pour qui reprend ce fichier :
 *
 *  · Le sens de lecture ne se règle PAS ici. `dir="rtl"` est posé sur <html>
 *    par `lib/langue.ts` avant le premier pixel ; le CSS suit par propriétés
 *    logiques. Ajouter des marques de direction dans les chaînes ne ferait que
 *    déplacer le problème dans le texte.
 *
 *  · Les nombres restent en chiffres latins (voir `ETIQUETTE_INTL`). Un montant
 *    en francs CFA doit se retrouver à l'identique sur la facture et dans la
 *    caisse, quelle que soit la langue de celui qui regarde l'écran.
 *
 * Vocabulaire retenu :
 *   atelier → ورشة        commande → طلب         acompte → عربون
 *   tenue   → ثوب         façon    → خياطة        artisan → خياط
 */
export const ar: Dictionnaire = {
  // ---------------------------------------------------------------- commun
  Enregistrer: 'حفظ',
  'Enregistrement…': 'جارٍ الحفظ…',
  'Enregistré.': 'تم الحفظ.',
  Annuler: 'إلغاء',
  Ajouter: 'إضافة',
  'Ajout…': 'جارٍ الإضافة…',
  Modifier: 'تعديل',
  Supprimer: 'حذف',
  Retirer: 'إزالة',
  Changer: 'تغيير',
  Fermer: 'إغلاق',
  Confirmer: 'تأكيد',
  Rechercher: 'بحث',
  Filtrer: 'تصفية',
  'aujourd’hui': 'اليوم',
  demain: 'غدًا',
  'Chargement…': 'جارٍ التحميل…',
  Oui: 'نعم',
  Non: 'لا',
  Actif: 'نشط',
  Inactif: 'غير نشط',
  Total: 'المجموع',
  Tous: 'الكل',
  Toutes: 'الكل',
  Aucun: 'لا شيء',
  Aucune: 'لا شيء',
  Optionnel: 'اختياري',
  facultatif: 'اختياري',
  'Date invalide.': 'تاريخ غير صالح.',
  'Heure invalide.': 'وقت غير صالح.',
  'F CFA': 'فرنك أفريقي',
  à: 'إلى',

  // ------------------------------------------------------------ navigation
  'Tableau de bord': 'لوحة القيادة',
  Accueil: 'الرئيسية',
  Planning: 'الجدول',
  Commandes: 'الطلبات',
  Clients: 'الزبائن',
  Mesures: 'المقاسات',
  Trésorerie: 'الخزينة',
  Caisse: 'الصندوق',
  Dépenses: 'المصاريف',
  Rapports: 'التقارير',
  Paramètres: 'الإعدادات',
  Notifications: 'الإشعارات',
  'Navigation principale': 'التنقل الرئيسي',
  'Chargement de l’atelier…': 'جارٍ تحميل الورشة…',
  'Mode démonstration — pages accessibles sans connexion. Retirez':
    'وضع العرض — الصفحات متاحة دون تسجيل الدخول. احذف',
  'avant toute mise en ligne.': 'قبل النشر.',

  // ------------------------------------------------------------- apparence
  'Activer le thème clair': 'تفعيل المظهر الفاتح',
  'Activer le thème sombre': 'تفعيل المظهر الداكن',
  Apparence: 'المظهر',
  'Thème de l’interface': 'مظهر الواجهة',
  Sombre: 'داكن',
  Clair: 'فاتح',
  'Mémorisé sur cet appareil, pas sur votre compte.': 'محفوظ على هذا الجهاز، لا على حسابك.',

  // ----------------------------------------------------------------- langue
  Langue: 'اللغة',
  'Langue de l’interface': 'لغة الواجهة',
  'Choisissez la langue de l’interface.': 'اختر لغة الواجهة.',
  'L’arabe se lit de droite à gauche : l’interface se retourne entièrement.':
    'العربية تُقرأ من اليمين إلى اليسار، لذا تنقلب الواجهة بأكملها.',

  // ------------------------------------------------- paramètres · atelier
  Atelier: 'الورشة',
  Équipe: 'الفريق',
  Tarification: 'الأسعار',
  Compte: 'الحساب',
  'Informations de l’atelier': 'معلومات الورشة',
  'Nom de l’atelier': 'اسم الورشة',
  'Mon atelier': 'ورشتي',
  'Le nom n’a pas pu être enregistré.': 'تعذّر حفظ الاسم.',
  'Téléphone de l’atelier': 'هاتف الورشة',
  'Le numéro sur lequel on joint l’atelier.': 'الرقم الذي يُتّصل به بالورشة.',
  'Le numéro n’a pas pu être enregistré.': 'تعذّر حفظ الرقم.',
  Ville: 'المدينة',
  'La ville n’a pas pu être enregistrée.': 'تعذّر حفظ المدينة.',
  Adresse: 'العنوان',
  'L’adresse n’a pas pu être enregistrée.': 'تعذّر حفظ العنوان.',
  Horaires: 'ساعات العمل',
  'Heure d’ouverture': 'وقت الفتح',
  'Heure de fermeture': 'وقت الإغلاق',
  'Les horaires n’ont pas pu être enregistrés.': 'تعذّر حفظ ساعات العمل.',
  'Indiquez l’ouverture et la fermeture, ou aucune des deux.':
    'حدّد وقت الفتح والإغلاق معًا، أو اتركهما فارغين.',
  'La fermeture doit venir après l’ouverture.': 'يجب أن يأتي الإغلاق بعد الفتح.',
  Devise: 'العملة',
  'Tous les montants enregistrés sont en francs CFA.': 'جميع المبالغ المسجّلة بالفرنك الأفريقي.',
  Logo: 'الشعار',
  'Le logo n’a pas pu être envoyé.': 'تعذّر رفع الشعار.',
  'Le logo n’a pas pu être retiré.': 'تعذّر إزالة الشعار.',
  'Session expirée — reconnectez-vous pour enregistrer le logo.':
    'انتهت الجلسة — سجّل الدخول من جديد لحفظ الشعار.',
  '« {fichier} » est trop lourd — réduisez l’image et réessayez.':
    '«{fichier}» كبير جدًا — صغّر الصورة وأعد المحاولة.',
  'Format refusé — choisissez une image JPEG, PNG ou WebP.':
    'صيغة مرفوضة — اختر صورة JPEG أو PNG أو WebP.',
  'Le stockage d’images n’est pas configuré sur ce serveur.':
    'تخزين الصور غير مُهيَّأ على هذا الخادم.',
  'L’envoi a échoué — le logo n’a pas été enregistré.': 'فشل الرفع — لم يُحفظ الشعار.',
  'Logo de {atelier}': 'شعار {atelier}',

  // --------------------------------------------------- paramètres · équipe
  '{n} actifs sur {total}': {
    zero: 'لا أحد نشط من {total}',
    one: 'واحد نشط من {total}',
    two: 'اثنان نشطان من {total}',
    few: '{n} نشطين من {total}',
    many: '{n} نشطًا من {total}',
    other: '{n} نشط من {total}',
  },
  '· exemples': '· أمثلة',
  'Chargement de l’équipe…': 'جارٍ تحميل الفريق…',
  'Aucun artisan. Ajoutez-en un pour pouvoir assigner des commandes et remplir le planning.':
    'لا خيّاطين بعد. أضف واحدًا لتوزيع الطلبات وملء الجدول.',
  'Activer {nom}': 'تفعيل {nom}',
  'Ajouter un artisan': 'إضافة خيّاط',
  'Les initiales sont déduites du nom ; elles identifient l’artisan sur les commandes et le planning.':
    'تُشتقّ الأحرف الأولى من الاسم، وهي تُعرّف الخيّاط في الطلبات والجدول.',
  'Ajouter à l’équipe': 'إضافة إلى الفريق',
  'Nom complet': 'الاسم الكامل',
  Rôle: 'الدور',
  'Tailleur senior': 'خيّاط أول',
  Couturière: 'خيّاطة',
  'Capacité quotidienne (heures)': 'الطاقة اليومية (ساعات)',
  'Un apprenti ne tient pas les 8 h d’un tailleur senior — le planning s’appuie sur ce chiffre.':
    'المتدرّب لا يتحمّل ثماني ساعات كخيّاط أول — والجدول يعتمد على هذا الرقم.',
  'Téléphone (facultatif)': 'الهاتف (اختياري)',
  'Pour joindre l’artisan quand une tenue est promise pour le lendemain.':
    'للاتصال بالخيّاط حين يكون الثوب موعودًا في الغد.',
  '{n} h / jour': '{n} ساعة / يوم',

  // ---------------------------------------------- paramètres · tarification
  'Grille tarifaire': 'قائمة الأسعار',
  'Ajouter un tarif': 'إضافة سعر',
  'Chargement de la grille…': 'جارٍ تحميل القائمة…',
  'Grille d’exemple — connectez-vous pour composer la vôtre.':
    'قائمة نموذجية — سجّل الدخول لتكوين قائمتك.',
  'Aucun tarif enregistré. Ajoutez vos prix de façon : ils seront proposés à chaque nouvelle commande.':
    'لا أسعار مسجّلة. أضف أسعار الخياطة: ستُقترح في كل طلب جديد.',
  'Prix de {unite}': 'سعر {unite}',
  façon: 'الخياطة',
  'Modifier le tarif {tenue}': 'تعديل سعر {tenue}',
  'Supprimer le tarif {tenue}': 'حذف سعر {tenue}',
  'Nouveau tarif': 'سعر جديد',
  'Modifier le tarif': 'تعديل السعر',
  'Prix de façon appliqué par défaut à ce type de tenue.':
    'سعر الخياطة الافتراضي لهذا النوع من الثياب.',
  'Type de tenue': 'نوع الثوب',
  'Prix de façon': 'سعر الخياطة',
  'En francs CFA, sans décimales.': 'بالفرنك الأفريقي، دون كسور.',

  // --------------------------------------------- paramètres · notifications
  'Rappels automatiques': 'التنبيهات التلقائية',
  'Relevés chaque matin et déposés dans vos notifications.': 'تُراجَع كل صباح وتُوضع في إشعاراتك.',
  'Chargement des réglages…': 'جارٍ تحميل الإعدادات…',
  'Connectez-vous pour régler vos rappels.': 'سجّل الدخول لضبط تنبيهاتك.',

  // --------------------------------------------------- paramètres · compte
  'Votre compte': 'حسابك',
  'Propriétaire de l’atelier': 'صاحب الورشة',
  'Adresse e-mail': 'البريد الإلكتروني',
  Téléphone: 'الهاتف',
  'Le même que celui de l’onglet Atelier.': 'نفس الرقم الموجود في تبويب الورشة.',
  'Changer le mot de passe': 'تغيير كلمة المرور',
  'Se déconnecter': 'تسجيل الخروج',
  'Déconnexion…': 'جارٍ تسجيل الخروج…',
  'Se déconnecter ?': 'تسجيل الخروج؟',
  'Pour revenir, il faudra retaper votre mot de passe puis saisir un code envoyé à votre adresse e-mail.':
    'للعودة ستحتاج إلى كلمة المرور من جديد، ثم رمز يُرسل إلى بريدك الإلكتروني.',
  'Rester connecté': 'البقاء متصلًا',
  'Les commandes, la caisse et les mesures restent enregistrées — c’est l’accès depuis cet appareil qui se ferme.':
    'تبقى الطلبات والصندوق والمقاسات محفوظة — ما يُغلق هو الدخول من هذا الجهاز.',

  // ------------------------------------------------------------- rappels
  'Commande en retard': 'طلب متأخر',
  'Dès qu’une commande dépasse son échéance de livraison.': 'بمجرد تجاوز الطلب موعد تسليمه.',
  'Livraison demain': 'التسليم غدًا',
  'La veille, pour les commandes à remettre le lendemain.':
    'في اليوم السابق، للطلبات المستحقة غدًا.',

  // ------------------------------------------------------------- cloche
  'Aucune notification non lue': 'لا إشعارات غير مقروءة',
  '{n} notifications non lues': {
    zero: 'لا إشعارات غير مقروءة',
    one: 'إشعار واحد غير مقروء',
    two: 'إشعاران غير مقروءين',
    few: '{n} إشعارات غير مقروءة',
    many: '{n} إشعارًا غير مقروء',
    other: '{n} إشعار غير مقروء',
  },
  'exemple : {exemple}': 'مثال: {exemple}',
  'Choisissez un pays.': 'اختر دولة.',
  '{ecran} — écran à venir': '{ecran} — شاشة قادمة',

  // --------------------------------------------------------- sous-titres
  'Carnet clients': 'دفتر الزبائن',
  'Fiches, mesures et tissus': 'البطاقات والمقاسات والأقمشة',
  'Suivi de confection': 'متابعة التفصيل',
  'Nouvelle commande': 'طلب جديد',
  'Modèle, artisan, tarif et échéance': 'الثوب والخيّاط والسعر وموعد التسليم',
  'Relevé corporel, tissus apportés et modèle choisi':
    'مقاسات الجسم والأقمشة المُحضَرة والثوب المختار',

  // ------------------------------------------------------ authentification
  Connexion: 'تسجيل الدخول',
  'Connexion…': 'جارٍ تسجيل الدخول…',
  'Se connecter': 'تسجيل الدخول',
  'Accédez à vos commandes, votre planning et vos clients.': 'ادخل إلى طلباتك وجدولك وزبائنك.',
  'Pas encore de compte ?': 'ليس لديك حساب بعد؟',
  'Créer un atelier': 'إنشاء ورشة',
  'Mot de passe': 'كلمة المرور',
  'Mot de passe oublié ?': 'نسيت كلمة المرور؟',
  'Mot de passe oublié': 'كلمة المرور المنسية',
  'Nous vous envoyons un code pour en choisir un nouveau.':
    'سنرسل لك رمزًا لاختيار كلمة مرور جديدة.',
  'Vous vous en souvenez ?': 'تذكّرتها؟',
  'Si un compte existe pour {email}, un code de réinitialisation vient d’être envoyé.':
    'إذا كان هناك حساب مرتبط بـ {email}، فقد أُرسل رمز إعادة التعيين للتو.',
  'J’ai reçu mon code': 'وصلني الرمز',
  'Envoi…': 'جارٍ الإرسال…',
  'Envoyer le code': 'إرسال الرمز',
  'Confirmer la connexion': 'تأكيد تسجيل الدخول',
  'Un code à 8 caractères vient d’être envoyé à {email}.':
    'أُرسل للتو رمز من ثمانية أحرف إلى {email}.',
  'Changer d’adresse': 'تغيير العنوان',
  'Code reçu par e-mail': 'الرمز المُرسل بالبريد',
  'Il expire au bout de quelques minutes.': 'ينتهي مفعوله بعد بضع دقائق.',
  'Nouveau code envoyé. Le précédent ne fonctionne plus.':
    'أُرسل رمز جديد. الرمز السابق لم يعد صالحًا.',
  'Vérification…': 'جارٍ التحقق…',
  'Je n’ai rien reçu — renvoyer un code': 'لم يصلني شيء — أرسل رمزًا آخر',
  'Vérifiez votre e-mail': 'تحقّق من بريدك الإلكتروني',
  'Saisissez le code à 8 caractères que nous venons de vous envoyer.':
    'أدخل الرمز المكوّن من ثمانية أحرف الذي أرسلناه إليك للتو.',
  'Mauvaise adresse ?': 'العنوان خاطئ؟',
  'Recommencer l’inscription': 'إعادة التسجيل',
  'Code de vérification': 'رمز التحقق',
  'Si un compte existe pour cette adresse, un nouveau code vient d’être envoyé.':
    'إذا كان هناك حساب بهذا العنوان، فقد أُرسل رمز جديد للتو.',
  'Vérifier mon compte': 'تأكيد حسابي',
  'Renvoyer le code': 'إعادة إرسال الرمز',
  'Nouveau mot de passe': 'كلمة مرور جديدة',
  'Saisissez le code reçu par e-mail et choisissez votre nouveau mot de passe.':
    'أدخل الرمز المُرسل بالبريد واختر كلمة المرور الجديدة.',
  'Code perdu ?': 'ضاع الرمز؟',
  'En demander un autre': 'اطلب رمزًا آخر',
  'Code reçu': 'الرمز المُستلم',
  '10 caractères minimum.': 'عشرة أحرف على الأقل.',
  'Changer mon mot de passe': 'تغيير كلمة المرور',
  'Retour à l’atelier': 'العودة إلى الورشة',
  ou: 'أو',
  'Continuer avec Google': 'المتابعة عبر Google',

  // messages renvoyés par l’API, traduits à l’affichage
  'Adresse e-mail ou mot de passe incorrect.': 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
  'Votre compte n’est pas encore vérifié. Consultez vos e-mails.':
    'لم يتم تأكيد حسابك بعد. راجع بريدك الإلكتروني.',
  'Trop de tentatives. Réessayez dans quelques minutes.':
    'محاولات كثيرة. أعد المحاولة بعد بضع دقائق.',
  'Ce compte est suspendu. Contactez le support.': 'هذا الحساب موقوف. تواصل مع الدعم.',
  'Le code n’a pas pu être envoyé. Réessayez dans un instant.':
    'تعذّر إرسال الرمز. أعد المحاولة بعد قليل.',
  'Code incorrect. Vérifiez les 8 caractères reçus par e-mail.':
    'رمز خاطئ. تحقّق من الأحرف الثمانية التي وصلتك بالبريد.',
  'Ce code a expiré. Demandez-en un nouveau.': 'انتهى مفعول هذا الرمز. اطلب رمزًا جديدًا.',
  'Trop d’essais sur ce code. Demandez-en un nouveau.':
    'محاولات كثيرة على هذا الرمز. اطلب رمزًا جديدًا.',
  'Impossible de joindre le serveur.': 'تعذّر الاتصال بالخادم.',
  'Code invalide ou expiré. Vérifiez les 8 caractères saisis.':
    'رمز غير صالح أو منتهٍ. تحقّق من الأحرف الثمانية التي أدخلتها.',
  'Le mot de passe doit faire au moins 10 caractères.': 'يجب ألا تقلّ كلمة المرور عن عشرة أحرف.',
  'Ce mot de passe est trop courant. Choisissez-en un autre.':
    'كلمة المرور هذه شائعة جدًا. اختر غيرها.',
  'Ce mot de passe a fuité lors d’une brèche connue. Choisissez-en un autre.':
    'ظهرت كلمة المرور هذه في تسريب معروف. اختر غيرها.',

  // ------------------------------------------------------------ téléphone
  'Indicatif du pays': 'رمز الدولة',
  'Numéro de téléphone invalide.': 'رقم هاتف غير صالح.',

  // ------------------------------------------------------- tableau de bord
  'Bonjour {nom}': 'مرحبًا {nom}',
  'Commandes du jour': 'طلبات اليوم',
  'Commandes en cours': 'الطلبات الجارية',
  'Commandes livrées': 'الطلبات المسلَّمة',
  'Chiffre d’affaires du mois': 'إيرادات الشهر',
  'Livraison à temps': 'التسليم في الموعد',
  'Délai moyen': 'متوسط المهلة',
  'Calcul des indicateurs…': 'جارٍ حساب المؤشرات…',
  'Indicateurs indisponibles': 'المؤشرات غير متاحة',
  'Notifications indisponibles': 'الإشعارات غير متاحة',
  'Non lue': 'غير مقروء',
  'AtelierPro, accueil': 'أتولييه برو، الصفحة الرئيسية',
  'Ouvrir le carnet clients': 'فتح دفتر العملاء',

  // -------------------------------------------- commandes · liste et fiche
  Commande: 'الطلب',
  'Commande en cours': 'طلب قيد التنفيذ',
  'Rechercher une commande': 'البحث عن طلب',
  'Rechercher un client, une tenue, une référence…': 'ابحث عن عميل أو ثوب أو مرجع…',
  'Aucune commande ne correspond': 'لا يوجد طلب مطابق',
  'Aucune commande enregistrée.': 'لا توجد طلبات مسجّلة.',
  'Cette commande n’existe pas': 'هذا الطلب غير موجود',
  'Chargement de la commande…': 'جارٍ تحميل الطلب…',
  'Retour aux commandes': 'العودة إلى الطلبات',
  'Retour à la liste': 'العودة إلى القائمة',
  'Réf.': 'المرجع',
  Statut: 'الحالة',
  Avancement: 'التقدّم',
  'Livraison prévue': 'التسليم المقرّر',
  'Livraison calculée': 'التسليم المحتسب',
  'Date de création': 'تاريخ الإنشاء',
  Assigné: 'مُسنَد',
  'Assigné à': 'مُسنَد إلى',
  'Non assigné': 'غير مُسنَد',
  Artisan: 'خياط',
  Tissu: 'القماش',
  Instructions: 'التعليمات',
  'Modèle choisi': 'الموديل المختار',
  'Palette de mesures': 'مجموعة المقاسات',
  'Montant de la commande': 'مبلغ الطلب',
  'Voir la fiche client': 'عرض بطاقة العميل',
  'Page précédente': 'الصفحة السابقة',
  'Page suivante': 'الصفحة التالية',

  // ------------------------------------------- commandes · notes d’atelier
  'Notes atelier': 'ملاحظات الورشة',
  'Chargement des notes…': 'جارٍ تحميل الملاحظات…',
  'Ajouter une note ou observation…': 'أضف ملاحظة أو ملحوظة…',
  'Nouvelle note d’atelier': 'ملاحظة ورشة جديدة',
  'Publier la note': 'نشر الملاحظة',

  // ----------------------------------------------------- nouvelle commande
  'Cliente / client': 'العميلة / العميل',
  Client: 'العميل',
  'Client concerné': 'العميل المعني',
  'Nouveau client': 'عميل جديد',
  'Le genre détermine la palette de mesures qui lui sera présentée.':
    'يحدّد النوع مجموعة المقاسات التي ستُعرض.',
  'La référence visuelle que le client souhaite reproduire.':
    'المرجع البصري الذي يريد العميل تنفيذه.',
  'Tissus apportés': 'الأقمشة المُحضَرة',
  'Photographiez chaque coupon : motif, métrage, couleur réelle.':
    'صوّر كل قطعة قماش: النقشة، الطول، اللون الحقيقي.',
  'Wax hollandais — 6 yards': 'واكس هولندي — 6 ياردات',
  'Wax 6 yards — marché de Rood Woko': 'واكس 6 ياردات — سوق رود ووكو',
  'Notes / instructions': 'ملاحظات / تعليمات',
  'Ces consignes sont lues par l’artisan au moment de la coupe.':
    'يقرأ الخياط هذه التعليمات عند القصّ.',
  'Ex : col bateau, fermeture invisible dos, finitions dorées sur les ourlets.':
    'مثال: ياقة قارب، سحّاب خفي في الظهر، تشطيب ذهبي على الأطراف.',
  'Ex : épaule droite légèrement plus basse, prévoir 1 cm de reprise.':
    'مثال: الكتف الأيمن أخفض قليلًا، احسب 1 سم للتضييق.',
  'Acompte versé': 'العربون المدفوع',
  'En francs CFA. Enregistré comme recette dans la caisse.':
    'بالفرنك الأفريقي. يُسجَّل كإيراد في الصندوق.',
  'Réglé en': 'طريقة الدفع',
  'Sert au rapprochement de caisse en fin de mois.': 'يُستخدم لمطابقة الصندوق في نهاية الشهر.',
  'Sert au bouton WhatsApp de la fiche client et de la commande.':
    'يُستخدم لزر واتساب في بطاقة العميل وفي الطلب.',
  'Robe wax cérémonie — Mariam C.': 'فستان واكس للمناسبات — Mariam C.',

  // --------------------------------------------------------------- clients
  'Rechercher un client': 'البحث عن عميل',
  'Rechercher un client…': 'ابحث عن عميل…',
  'Chargement des clients…': 'جارٍ تحميل العملاء…',
  'Aucun client enregistré': 'لا يوجد عميل مسجّل',
  'Aucun numéro enregistré pour ce client.': 'لا يوجد رقم مسجّل لهذا العميل.',
  'Client fidèle': 'عميل وفي',
  'Commandes passées': 'الطلبات السابقة',
  'Dernière commande': 'آخر طلب',
  Effacer: 'مسح',
  'Effacer la recherche': 'مسح البحث',

  // -------------------------------------------------- planning et capacité
  'Chargement du planning…': 'جارٍ تحميل الجدول…',
  'Semaine précédente': 'الأسبوع السابق',
  'Semaine suivante': 'الأسبوع التالي',
  Jour: 'اليوم',
  'Légende :': 'الدليل:',
  Libre: 'متفرّغ',
  'Affecter une tâche': 'إسناد مهمة',
  'Intitulé de la tâche': 'عنوان المهمة',
  'Durée (heures)': 'المدة (بالساعات)',
  'Capacité du jour': 'طاقة اليوم',
  'Charge globale de l’atelier': 'الحِمل الإجمالي للورشة',
  Disponibles: 'متاحون',
  Saturés: 'محمَّلون بالكامل',
  'Prochaine dispo': 'أقرب موعد متاح',
  'Aucun artisan actif': 'لا يوجد خياط نشط',
  'Composer l’équipe': 'تكوين الفريق',

  // ---------------------------------------------- paiements d’une commande
  Paiements: 'المدفوعات',
  'Chargement des versements…': 'جارٍ تحميل الدفعات…',
  'Enregistrer un versement': 'تسجيل دفعة',
  'Montant (F CFA)': 'المبلغ (فرنك أفريقي)',
  'Date de l’encaissement': 'تاريخ القبض',
  'Le jour où l’argent est entré, pas celui de la saisie.': 'يوم دخول المال، لا يوم إدخاله.',
  'Réglé par': 'طريقة الدفع',
  'Note (facultatif)': 'ملاحظة (اختياري)',
  'Déjà encaissé': 'المقبوض حتى الآن',
  'Reste à payer': 'المتبقّي للدفع',
  'Part du montant encaissée': 'نسبة المبلغ المقبوض',
  '· date reconstituée': '· تاريخ مُستنتَج',

  // ------------------------------------------------ trésorerie et dépenses
  'Trésorerie indisponible': 'الخزينة غير متاحة',
  'Dépenses indisponibles': 'المصاريف غير متاحة',
  'Calcul du solde…': 'جارٍ حساب الرصيد…',
  'Chargement du journal…': 'جارٍ تحميل السجل…',
  Recettes: 'الإيرادات',
  Encaissé: 'مقبوض',
  Résultat: 'النتيجة',
  Prévision: 'التوقّع',
  'Six derniers mois': 'آخر ستة أشهر',
  'Total 6 mois': 'إجمالي ستة أشهر',
  'Total facturé': 'إجمالي الفوترة',
  'Total des dépenses': 'إجمالي المصاريف',
  'Mois précédent': 'الشهر السابق',
  'Mois suivant': 'الشهر التالي',
  'Enregistrer une dépense': 'تسجيل مصروف',
  Libellé: 'البيان',
  'Loyer de l’atelier': 'إيجار الورشة',
  Poste: 'البند',
  'Par poste': 'حسب البند',
  'Tous les postes': 'كل البنود',
  'Filtrer par poste': 'تصفية حسب البند',
  'Date du décaissement': 'تاريخ الصرف',
  'La date est celle où l’argent est sorti, pas celle de la saisie.':
    'التاريخ هو يوم خروج المال، لا يوم إدخاله.',
  'Charges fixes': 'المصاريف الثابتة',
  'Déclarer une charge fixe': 'تسجيل مصروف ثابت',
  'Montant mensuel (F CFA)': 'المبلغ الشهري (فرنك أفريقي)',
  'Jour d’échéance': 'يوم الاستحقاق',
  'Entre 1 et 28 — au-delà, février n’aurait pas d’échéance certaines années.':
    'بين 1 و28 — بعد ذلك لن يكون لفبراير موعد استحقاق في بعض السنوات.',
  'Elle sert uniquement à la prévision. Aucun mouvement n’est écrit en caisse tant que vous n’avez pas payé.':
    'تُستخدم للتوقّع فقط. لا يُسجَّل أي مبلغ في الصندوق ما لم تدفع فعلًا.',
  'solde projeté': 'الرصيد المتوقّع',
  '— reste du mois': '— بقية الشهر',
  encaissé: 'مقبوض',
  facturé: 'مفوتَر',

  // ----------------------------------------------- téléversement de photos
  'Photo ou glisser-déposer': 'صورة أو سحب وإفلات',

  // --------------------------------------- vocabulaire · genres et statuts
  Femme: 'نساء',
  Homme: 'رجال',
  'En cours': 'قيد التنفيذ',
  Essayage: 'بروفة',
  Livraison: 'التسليم',
  'En retard': 'متأخر',
  Livré: 'تم التسليم',
  Terminé: 'منجز',
  Planifié: 'مجدول',
  Bloqué: 'معطّل',

  // ------------------------- vocabulaire · étapes et jalons d’une commande
  Modèle: 'الموديل',
  'Commande enregistrée': 'تم تسجيل الطلب',
  Confection: 'التنفيذ',

  // --------------------------------------- vocabulaire · postes de dépense
  'Tissus et fournitures': 'الأقمشة واللوازم',
  'Salaires et main-d’œuvre': 'الأجور واليد العاملة',
  'Broderie et façon': 'التطريز والخياطة',
  Commissions: 'العمولات',
  Loyer: 'الإيجار',
  'Électricité et eau': 'الكهرباء والماء',
  'Internet et téléphone': 'الإنترنت والهاتف',
  'Machines et entretien': 'الآلات والصيانة',
  'Transport et livraison': 'النقل والتسليم',
  'Taxes et patente': 'الضرائب والرخصة',
  Publicité: 'الإعلان',
  Divers: 'متفرقات',

  // -------------------------------------- vocabulaire · modes de règlement
  Espèces: 'نقدًا',
  'Mobile Money': 'الدفع عبر الهاتف',
  Virement: 'تحويل بنكي',
  Carte: 'بطاقة',

  // ---------------------------------------- palettes de mesures · sections
  Haut: 'الأعلى',
  Bas: 'الأسفل',
  'Buste, manches et longueur d’habit': 'الصدر والأكمام وطول الثوب',
  Pantalon: 'البنطلون',
  'Buste, robe et manches': 'الصدر والفستان والأكمام',
  'Jupe, pantalon et montant': 'التنورة والبنطلون والارتفاع',

  // ------------------------------------------ palettes de mesures · relevé
  'Tour de cou': 'محيط الرقبة',
  Épaule: 'الكتف',
  Épaules: 'الكتفان',
  'Longueur d’épaule': 'طول الكتف',
  Poitrine: 'محيط الصدر',
  'Écart poitrine': 'المسافة بين الصدرين',
  'Hauteur poitrine': 'ارتفاع الصدر',
  'Longueur de manche': 'طول الكم',
  'Tour de bras': 'محيط الذراع',
  'Longueur bras': 'طول الذراع',
  'Longueur bras total plié': 'طول الذراع كاملًا مثنيًا',
  Coude: 'المرفق',
  Poignet: 'المعصم',
  'Tour du poignet': 'محيط المعصم',
  Taille: 'الخصر',
  'Tour de taille': 'محيط الخصر',
  'Longueur taille devant': 'طول الخصر الأمامي',
  'Longueur taille dos': 'طول الخصر الخلفي',
  'Longueur habit': 'طول الثوب',
  'Longueur habit A': 'طول الثوب أ',
  'Longueur habit B': 'طول الثوب ب',
  Ceinture: 'الحزام',
  'Tour hanche': 'محيط الورك',
  'Tour de hanches': 'محيط الوركين',
  'Hauteur taille-hanches': 'من الخصر إلى الورك',
  'Hauteur taille-genou': 'من الخصر إلى الركبة',
  'Hauteur taille-cheville': 'من الخصر إلى الكاحل',
  'Hauteur épaules-longueur finie': 'من الكتف إلى الطول النهائي',
  'Hauteur bassin': 'ارتفاع الحوض',
  'Hauteur montant assis': 'ارتفاع الجلوس',
  Entrejambe: 'طول الساق الداخلي',
  'Fourche (entrejambe)': 'المسافة بين الساقين',
  Cuisse: 'الفخذ',
  Mollet: 'السمانة',
  Cheville: 'الكاحل',
  'Longueur pantalon': 'طول البنطلون',

  // ------------------------------------------------------ prise de mesures
  'Rechercher…': 'ابحث…',
  'Mesures {palette}': 'مقاسات {palette}',
  'Palette {palette} sur un client enregistré comme {client}.':
    'مجموعة {palette} لعميل مسجَّل بصفة {client}.',
  '{remplies}/{total} renseignées': '{remplies}/{total} مُدخَلة',
  '{remplies}/{total} mesures': '{remplies}/{total} مقاس',
  '{n} mesures': {
    zero: 'لا مقاسات',
    one: 'مقاس واحد',
    two: 'مقاسان',
    few: '{n} مقاسات',
    many: '{n} مقاسًا',
    other: '{n} مقاس',
  },
  '{n} photos de tissu': {
    zero: 'لا صور قماش',
    one: 'صورة قماش واحدة',
    two: 'صورتا قماش',
    few: '{n} صور قماش',
    many: '{n} صورة قماش',
    other: '{n} صورة قماش',
  },
  'modèle photographié': 'تم تصوير الموديل',
  'aucun modèle': 'لا يوجد موديل',
  'Remarques sur la morphologie': 'ملاحظات حول القياسات الجسدية',
  'Relevé enregistré': 'تم حفظ المقاسات',
  'Conservé à l’écran seulement — connectez-vous pour enregistrer.':
    'محفوظ على الشاشة فقط — سجّل الدخول للحفظ.',
  'Créer la commande': 'إنشاء الطلب',
  'Enregistrer le relevé': 'حفظ المقاسات',

  // --------------------------------------------------------------- landing
  'Essai gratuit': 'تجربة مجانية',

  // ---------------------------------------------------- landing · accroche
  'Votre atelier, enfin tenu au clair': 'ورشتك، أخيرًا تحت السيطرة',
  'Commandes, mesures, acomptes, planning de l’équipe. AtelierPro rassemble ce qui vit aujourd’hui dans des carnets, des SMS et de la mémoire.':
    'الطلبات والمقاسات والعرابين وجدول الفريق. يجمع أتولييه برو ما يعيش اليوم في الدفاتر والرسائل والذاكرة.',
  'Trente jours d’essai gratuit. Sans carte bancaire. En français, en anglais, en espagnol, en portugais ou en arabe, dans le navigateur — rien à installer.':
    'ثلاثون يومًا مجانًا. دون بطاقة بنكية. بالفرنسية أو الإنجليزية أو الإسبانية أو البرتغالية أو العربية، في المتصفح — دون أي تثبيت.',
  'Créer mon atelier': 'إنشاء ورشتي',
  '30 jours': '30 يومًا',
  'D’essai gratuit, sans carte bancaire': 'تجربة مجانية دون بطاقة بنكية',
  '0 F': '0 F',
  'À installer — tout passe par le navigateur': 'للتثبيت — كل شيء يجري في المتصفح',
  'Écrans de gestion, du planning à la trésorerie': 'شاشات إدارية، من الجدولة إلى الخزينة',

  // --------------------------------------------- landing · fonctionnalités
  'Tout ce qu’un atelier a besoin de retenir': 'كل ما تحتاج الورشة إلى تذكّره',
  'De la prise de commande à la livraison. Touchez une carte pour voir l’écran correspondant.':
    'من تسجيل الطلب إلى التسليم. المس بطاقة لرؤية الشاشة المقابلة.',
  'Planification de l’équipe': 'جدولة الفريق',
  'Affectez les tâches jour par jour et voyez immédiatement qui est saturé. La capacité est propre à chaque artisan : un apprenti à 6 h n’est pas jugé au seuil d’un tailleur senior.':
    'وزّع المهام يومًا بيوم وشاهد فورًا من تجاوز طاقته. الطاقة خاصة بكل خياط: المتدرّب بست ساعات لا يُقاس بعتبة خياط متمرّس.',
  'Voir le planning': 'عرض الجدول',
  'Mesures conservées': 'مقاسات محفوظة',
  'Un relevé corporel par client, enregistré une fois et repris à chaque commande. Photos des tissus apportés et du modèle choisi.':
    'سجل قياسات واحد لكل عميل، يُحفظ مرة ويُستعمل في كل طلب. صور للأقمشة المُحضَرة وللموديل المختار.',
  'Voir le relevé': 'عرض المقاسات',
  'Acomptes et soldes': 'العرابين والأرصدة',
  'Chaque commande porte son montant, son acompte et son reste à payer, en francs CFA. Le solde se lit sans calcul mental.':
    'كل طلب يحمل مبلغه وعربونه والمتبقّي منه، بالفرنك الأفريقي. يُقرأ الرصيد دون حساب ذهني.',
  'Voir les commandes': 'عرض الطلبات',
  'Carnet client': 'دفتر العملاء',
  'Coordonnées, historique des commandes et mesures d’un client au même endroit. Plus de carnet papier à retrouver.':
    'بيانات الاتصال وسجل الطلبات والمقاسات في مكان واحد. لا دفتر ورقي تبحث عنه بعد اليوم.',
  'Voir le carnet': 'عرض الدفتر',
  'Rapports d’atelier': 'تقارير الورشة',
  'Chiffre d’affaires, tenues les plus demandées, délais de livraison — calculés sur vos commandes réelles, jamais sur des exemples.':
    'الإيرادات، والأثواب الأكثر طلبًا، ومهل التسليم — محسوبة من طلباتك الحقيقية، لا من أمثلة.',
  'Voir les rapports': 'عرض التقارير',
  'Pensé pour le téléphone': 'مصمّم للهاتف',
  'Chaque écran est conçu d’abord pour un écran de téléphone, puis élargi. L’atelier se gère debout, entre deux essayages.':
    'كل شاشة مصمّمة للهاتف أولًا ثم موسّعة. تُدار الورشة وقوفًا، بين بروفة وأخرى.',
  'Voir le tableau de bord': 'عرض لوحة القيادة',

  // ------------------------------------------- landing · profils d’atelier
  'Pour tout type d’atelier': 'لكل نوع من الورشات',
  'Que vous cousiez seul ou que vous meniez une équipe de dix personnes.':
    'سواء كنت تخيط وحدك أو تقود فريقًا من عشرة.',
  'Atelier de quartier': 'ورشة الحي',
  'Un tailleur seul ou deux à trois couturières. Commandes régulières, clientèle fidèle.':
    'خياط بمفرده أو خيّاطتان إلى ثلاث. طلبات منتظمة وزبائن أوفياء.',
  'Carnet client, mesures et acomptes au même endroit':
    'دفتر العملاء والمقاسات والعرابين في مكان واحد',
  'Production collective': 'إنتاج جماعي',
  'Cinq à dix tailleurs, forte charge. Besoin de coordination et de délais tenus.':
    'من خمسة إلى عشرة خياطين، حِمل ثقيل. تحتاج تنسيقًا ومواعيد محترمة.',
  'Charge de chaque artisan, jour par jour, avec sa capacité propre':
    'حِمل كل خياط، يومًا بيوم، مقابل طاقته الخاصة',
  'Maison de mode': 'دار أزياء',
  'Pièces de valeur, retouches nombreuses, clientèle exigeante.':
    'قطع ثمينة، تعديلات كثيرة، زبائن متطلّبون.',
  'Relevé corporel conservé, photos des tissus, solde suivi à l’écriture près':
    'سجل قياسات محفوظ، صور للأقمشة، رصيد متابَع حتى آخر قيد',
  'Ce que ça change': 'ما الذي يتغيّر',

  // ------------------------------------------------------ landing · tarifs
  'Des tarifs lisibles': 'أسعار واضحة',
  'Trente jours d’essai sur tous les plans. Sans engagement.':
    'تجربة ثلاثين يومًا على كل الخطط. دون التزام.',
  'Le paiement en ligne n’est pas encore ouvert : l’essai démarre sans moyen de paiement, et nous vous contactons avant tout prélèvement.':
    'الدفع الإلكتروني غير متاح بعد: تبدأ التجربة دون وسيلة دفع، ونتواصل معك قبل أي خصم.',
  'Le plus choisi': 'الأكثر اختيارًا',
  'Commencer l’essai': 'ابدأ التجربة',
  'Nous écrire': 'راسلنا',
  Découverte: 'البداية',
  'Pour un atelier qui démarre': 'لورشة في بدايتها',
  'Jusqu’à 50 commandes par mois': 'حتى 50 طلبًا شهريًا',
  'Jusqu’à 5 artisans': 'حتى 5 خياطين',
  'Mesures et paiements': 'المقاسات والمدفوعات',
  'Notes d’atelier': 'ملاحظات الورشة',
  'Assistance par e-mail': 'الدعم عبر البريد',
  'Pour une équipe qui grandit': 'لفريق يكبر',
  'Commandes illimitées': 'طلبات غير محدودة',
  'Jusqu’à 10 artisans': 'حتى 10 خياطين',
  'Planning et capacité par artisan': 'الجدولة والطاقة لكل خياط',
  'Rapports complets': 'تقارير كاملة',
  'Assistance prioritaire': 'دعم ذو أولوية',
  Maison: 'الدار',
  'Pour les grands ateliers': 'للورشات الكبيرة',
  'Sur devis': 'حسب الطلب',
  'Artisans illimités': 'خياطون غير محدودين',
  'Accès à l’API': 'الوصول إلى الواجهة البرمجية',
  'Mise en route accompagnée': 'مرافقة عند الانطلاق',
  'Formation de l’équipe': 'تدريب الفريق',
  'Interlocuteur dédié': 'مسؤول مخصّص',
  '/mois': '/شهر',

  // ---------------------------------------- landing · questions fréquentes
  'Questions fréquentes': 'أسئلة شائعة',
  'Faut-il un téléphone récent ?': 'هل أحتاج هاتفًا حديثًا؟',
  'Non. AtelierPro s’ouvre dans le navigateur, y compris sur un Android ancien et une connexion lente. Aucune installation n’est nécessaire.':
    'لا. يفتح أتولييه برو في المتصفح، حتى على أندرويد قديم واتصال بطيء. لا حاجة إلى أي تثبيت.',
  'Combien ça coûte ?': 'كم يكلّف؟',
  'Trente jours d’essai gratuit, puis de 2 000 à 5 000 F CFA par mois selon le plan. Moins cher qu’une retouche.':
    'ثلاثون يومًا مجانًا، ثم من 2000 إلى 5000 فرنك أفريقي شهريًا حسب الخطة. أرخص من تعديل واحد.',
  'Et si internet est coupé ?': 'وإن انقطع الإنترنت؟',
  'L’atelier a besoin d’une connexion pour enregistrer ses commandes. Le travail hors-ligne avec synchronisation différée est prévu, il n’est pas encore disponible.':
    'تحتاج الورشة إلى اتصال لحفظ طلباتها. العمل دون اتصال مع مزامنة لاحقة مُخطَّط له، وليس متاحًا بعد.',
  'Comment reprendre mes anciens clients ?': 'كيف أنقل عملائي السابقين؟',
  'Le carnet s’alimente au fil des commandes : le premier client se saisit en moins d’une minute, mesures comprises. Un import de fichier est à l’étude.':
    'يمتلئ الدفتر مع تدفّق الطلبات: يُدخَل العميل الأول في أقل من دقيقة، بمقاساته. استيراد ملف قيد الدراسة.',
  'C’est pour quel pays ?': 'لأي بلد هو؟',
  'Conçu pour l’Afrique de l’Ouest : interface en français, en anglais, en espagnol, en portugais ou en arabe, montants en francs CFA sans décimales.':
    'مصمَّم لغرب أفريقيا: واجهة بالفرنسية أو الإنجليزية أو الإسبانية أو البرتغالية أو العربية، ومبالغ بالفرنك الأفريقي دون كسور.',

  // ---------------------------------- landing · témoignages et appel final
  'Ce que disent les tailleurs': 'ما يقوله الخياطون',
  'Des ateliers qui ont troqué le carnet contre l’écran.': 'ورشات استبدلت الدفتر بالشاشة.',
  'Du fil à la livraison': 'من الخيط إلى التسليم',
  'Prêt à mettre votre atelier au clair ?': 'مستعد لترتيب ورشتك؟',
  'Trente jours gratuits, sans moyen de paiement. La première commande se saisit en deux minutes.':
    'ثلاثون يومًا مجانًا، دون وسيلة دفع. يُدخَل الطلب الأول في دقيقتين.',
  'Une question ? Écrivez-nous sur WhatsApp': 'سؤال؟ راسلنا على واتساب',

  // ---------------------------------- landing · navigation et pied de page
  Fonctionnalités: 'المزايا',
  Tarifs: 'الأسعار',
  Témoignages: 'الشهادات',
  Questions: 'الأسئلة',
  'Liens de bas de page': 'روابط أسفل الصفحة',
  Confidentialité: 'الخصوصية',
  'Conditions d’utilisation': 'شروط الاستخدام',
  Contact: 'اتصل بنا',
  'Fait pour l’Afrique de l’Ouest. © {annee}': 'صُنع لغرب أفريقيا. © {annee}',
  'Retour à l’accueil': 'العودة إلى الرئيسية',

  // ---------------------------------- alertes d’atelier · phrases rejouées
  'Commande {reference} en retard — {client}': 'الطلب {reference} متأخر — {client}',
  '{tenue} devait être livrée le {date}.': 'كان من المفترض تسليم {tenue} في {date}.',
  'Livraison demain — {client}': 'التسليم غدًا — {client}',
  '{tenue} ({reference}) est attendue demain.': '{tenue} ({reference}) متوقَّع غدًا.',
  'Voir la commande': 'عرض الطلب',
  'À l’instant': 'الآن',

  // -------------------------------------------------------- titres d’écran
  'Prise de mesures': 'أخذ المقاسات',
  'Capacité de l’équipe': 'طاقة الفريق',
  'Trésorerie de l’atelier': 'خزينة الورشة',
  'Politique de confidentialité': 'سياسة الخصوصية',
  'Retour au dashboard': 'العودة إلى لوحة القيادة',
  'Retour à la connexion': 'العودة إلى تسجيل الدخول',
  'Échec de connexion': 'فشل تسجيل الدخول',
  Imprimer: 'طباعة',
  'Voir tout': 'عرض الكل',
  'Voir toutes les commandes': 'عرض كل الطلبات',
  'Réinitialiser les filtres': 'إعادة ضبط عوامل التصفية',

  // ------------------------------ commandes · liste, fiche et écrans vides
  'Client & tenue': 'العميل والثوب',
  'Client / Tenue': 'العميل / الثوب',
  'Chargement des commandes…': 'جارٍ تحميل الطلبات…',
  'Détails de la commande': 'تفاصيل الطلب',
  'Détails du modèle': 'تفاصيل الموديل',
  'Mesures corporelles': 'مقاسات الجسم',
  'Tissus apportés par le client': 'أقمشة أحضرها العميل',
  'Couleur / motif': 'اللون / النقشة',
  'Date de livraison': 'تاريخ التسليم',
  'C’est la date promise au client — elle sert au planning et aux alertes de retard.':
    'هذا هو التاريخ الموعود للعميل — يُستخدم في الجدولة وتنبيهات التأخير.',
  Urgent: 'عاجل',
  Nouvelle: 'جديد',
  Saisir: 'إدخال',
  Montant: 'المبلغ',
  'Elle a peut-être été supprimée, ou appartient à un autre atelier.':
    'ربما حُذف، أو أنه يخصّ ورشة أخرى.',
  'Aucun tissu photographié. Les tissus se prennent en photo pendant le relevé de mesures.':
    'لا صور للأقمشة. تُصوَّر الأقمشة أثناء أخذ المقاسات.',
  'Confirmée à l’écran seulement — connectez-vous pour l’enregistrer.':
    'مؤكَّد على الشاشة فقط — سجّل الدخول لحفظه.',
  'Créez d’abord un client dans le carnet : une commande lui sera rattachée.':
    'أنشئ عميلًا في الدفتر أولًا: سيُربط الطلب به.',
  'En créer un': 'أنشئ واحدًا',
  'En ajouter une': 'أضف واحدة',
  ', livraison {date}': '، التسليم {date}',
  'Commande {reference} enregistrée pour {client} — {tenue}{livraison}.':
    'تم تسجيل الطلب {reference} لـ {client} — {tenue}{livraison}.',
  'Commande confirmée pour {client} — {tenue}{livraison}.':
    'تم تأكيد الطلب لـ {client} — {tenue}{livraison}.',

  // ---------------------------------------------------- paiements et notes
  'Aucun acompte': 'لا يوجد عربون',
  'Aucun versement enregistré. La commande est entièrement due.':
    'لا دفعات مسجّلة. الطلب مستحق بالكامل.',
  'Ajouter note': 'إضافة ملاحظة',
  'Aucune note pour l’instant. Ce qui s’écrit ici suit la commande — essayage, retouche demandée, tissu manquant.':
    'لا ملاحظات بعد. ما يُكتب هنا يرافق الطلب — بروفة، تعديل مطلوب، قماش ناقص.',
  'Connectez-vous pour lire et écrire les notes de cette commande.':
    'سجّل الدخول لقراءة ملاحظات هذا الطلب وكتابتها.',

  // --------------------------------------------------------------- clients
  'Ajouter le premier client': 'أضف أول عميل',
  'Historique commandes': 'سجل الطلبات',
  'Aucune commande enregistrée pour ce client.': 'لا طلبات مسجّلة لهذا العميل.',
  Fidèle: 'وفي',
  'Pas de numéro': 'لا يوجد رقم',
  'Les mesures se rattachent à un client. Créez-en un depuis le carnet, puis revenez ici.':
    'ترتبط المقاسات بعميل. أنشئ عميلًا من الدفتر ثم عد إلى هنا.',

  // ---------------------------------------------------- planning et équipe
  'Affecter tâche': 'إسناد مهمة',
  'Charge totale': 'الحِمل الإجمالي',
  'CA généré': 'الإيرادات المحقّقة',
  'Aucune commande assignée pour l’instant.': 'لا طلبات مُسنَدة بعد.',
  'Le planning se remplit par artisan. Composez votre équipe pour commencer à affecter des tâches.':
    'يُملأ الجدول حسب الخياط. كوّن فريقك لتبدأ إسناد المهام.',

  // -------------------------------------------------------------- rapports
  'Chiffre d’affaires mensuel': 'الإيرادات الشهرية',
  'Tenues les plus commandées': 'الأثواب الأكثر طلبًا',
  'Performance par artisan': 'الأداء حسب الخياط',
  'Statut des paiements': 'حالة المدفوعات',
  'Payé intégral': 'مدفوع بالكامل',
  'Non payé': 'غير مدفوع',
  'Les rapports se calculent depuis vos commandes réelles. Connectez-vous pour les consulter — afficher des chiffres d’exemple ici induirait en erreur.':
    'تُحسب التقارير من طلباتك الحقيقية. سجّل الدخول للاطّلاع عليها — عرض أرقام تجريبية هنا سيكون مضلّلًا.',

  // ------------------------------------------------ trésorerie et dépenses
  'Argent réellement encaissé, moins les dépenses décaissées, depuis l’ouverture du journal.':
    'المال المقبوض فعلًا، ناقص المصروف، منذ فتح السجل.',
  'Dernier solde connu — vérification en cours…': 'آخر رصيد معروف — جارٍ التحقّق…',
  'Entrées attendues d’après le reste à payer de vos commandes, sorties d’après vos charges déclarées. Ce n’est pas un constat.':
    'المداخيل متوقّعة من المتبقّي على طلباتك، والمصاريف من أعبائك المصرّح بها. هذا ليس واقعًا مثبتًا.',
  'La caisse passe sous zéro dans les mois qui viennent si rien ne change.':
    'سينزل الصندوق تحت الصفر في الأشهر القادمة إن لم يتغيّر شيء.',
  'Déclarer une charge': 'تسجيل عبء',
  'Aucune charge déclarée — la prévision ne compte donc aucune sortie.':
    'لا أعباء مصرَّح بها — لذا لا يحسب التوقّع أي صرف.',
  'Déclarées une fois, elles alimentent la prévision. Elles n’écrivent rien en caisse : c’est la saisie d’une dépense qui fait bouger le solde.':
    'تُصرَّح مرة وتغذّي التوقّع. لا تكتب شيئًا في الصندوق: إدخال المصروف وحده يحرّك الرصيد.',
  'Enregistrez vos achats de tissu, salaires et charges au fur et à mesure : la trésorerie s’en déduit toute seule.':
    'سجّل مشتريات القماش والأجور والأعباء أولًا بأول: تُستنتج الخزينة وحدها.',
  'Le solde de votre atelier ne s’affiche qu’une fois connecté. Aucun jeu d’exemple n’est proposé ici : on prend des décisions d’achat avec ce chiffre.':
    'لا يظهر رصيد ورشتك إلا بعد تسجيل الدخول. لا تُعرض بيانات تجريبية هنا: تُتّخذ قرارات الشراء بهذا الرقم.',
  'Les dépenses de votre atelier ne s’affichent qu’une fois connecté. Aucun jeu d’exemple n’est proposé ici : un chiffre d’argent inventé n’aiderait personne.':
    'لا تظهر مصاريف ورشتك إلا بعد تسجيل الدخول. لا تُعرض بيانات تجريبية هنا: رقم مالي مختلَق لن يفيد أحدًا.',

  // --------------------------------------------------------- notifications
  'Chargement des notifications…': 'جارٍ تحميل الإشعارات…',
  'Marquer comme lue': 'وضع علامة مقروء',
  'Tout marquer comme lu': 'وضع علامة مقروء على الكل',
  'Rien ne vous a été signalé. Les retards et les livraisons du lendemain sont vérifiés chaque matin — aucune échéance ne tombe aujourd’hui.':
    'لم يُبلَّغ عن شيء. تُفحَص التأخيرات وتسليمات الغد كل صباح — لا موعد استحقاق اليوم.',
  'Vos alertes ne s’affichent qu’une fois connecté. Aucun jeu d’exemple n’est proposé ici : une notification affirme un fait daté, et une alerte inventée se confondrait avec une vraie.':
    'لا تظهر تنبيهاتك إلا بعد تسجيل الدخول. لا تُعرض بيانات تجريبية هنا: الإشعار يؤكّد واقعة مؤرّخة، والتنبيه المختلَق سيُخلط بالحقيقي.',

  // ------------------------------------------------- compte et inscription
  'Créer votre atelier': 'أنشئ ورشتك',
  'Quelques secondes pour commencer à suivre vos commandes.': 'ثوانٍ قليلة لتبدأ متابعة طلباتك.',
  'Un code de vérification vous sera envoyé par e-mail.':
    'سيُرسَل إليك رمز تحقّق بالبريد الإلكتروني.',
  '10 caractères minimum. Une phrase est plus sûre qu’un mot compliqué.':
    'عشرة أحرف على الأقل. الجملة أأمن من كلمة معقّدة.',
  'Mot de passe actuel': 'كلمة المرور الحالية',
  'Confirmer le nouveau mot de passe': 'تأكيد كلمة المرور الجديدة',
  'Comptes liés': 'الحسابات المرتبطة',
  'Lier Google': 'ربط جوجل',
  Lié: 'مرتبط',

  // --------------------------------------------------------- pages légales
  'Ce document n’est pas encore rédigé. Il le sera avant l’ouverture des inscriptions payantes, et cette page portera alors le texte complet plutôt que cet avis.':
    'لم تُكتب هذه الوثيقة بعد. ستُكتب قبل فتح الاشتراكات المدفوعة، وستحمل هذه الصفحة عندئذٍ النص الكامل بدل هذا التنويه.',
  'Deux points méritent d’être dits dès maintenant, parce qu’ils engagent les deux parties :':
    'نقطتان تستحقّان الذكر الآن، لأنهما تُلزمان الطرفين:',
  'Le paiement en ligne n’est pas ouvert. Aucun prélèvement n’est possible aujourd’hui, quel que soit le plan affiché sur la page d’accueil.':
    'الدفع الإلكتروني غير مفتوح. لا خصم ممكن اليوم، أيًّا كانت الخطة المعروضة في الصفحة الرئيسية.',
  'Le service est en cours de construction. Certaines fonctions annoncées sur la page d’accueil — travail hors-ligne, import de fichier clients — ne sont pas encore disponibles.':
    'الخدمة قيد الإنشاء. بعض المزايا المعلنة في الصفحة الرئيسية — العمل دون اتصال، استيراد ملف العملاء — ليست متاحة بعد.',
  'En attendant, voici ce que l’application fait réellement des données, tel qu’on peut le vérifier dans son code :':
    'في هذه الأثناء، إليك ما يفعله التطبيق فعليًا بالبيانات، كما يمكن التحقّق منه في شيفرته:',
  'Les données d’un atelier — clients, mesures, commandes, planning, équipe — sont rattachées à son compte et ne sont jamais lues par un autre atelier.':
    'بيانات الورشة — العملاء والمقاسات والطلبات والجدول والفريق — مرتبطة بحسابها ولا تقرأها ورشة أخرى أبدًا.',
  'Les mots de passe ne sont pas conservés en clair ; seule une empreinte est stockée.':
    'لا تُحفظ كلمات المرور بنصّها؛ تُخزَّن بصمتها فقط.',
  'Les photos de tissus et de modèles sont hébergées chez Cloudinary. Les e-mails de vérification transitent par Resend.':
    'تُستضاف صور الأقمشة والموديلات لدى Cloudinary. وتمرّ رسائل التحقّق عبر Resend.',
  'Aucune donnée n’est revendue ni cédée à des fins publicitaires.':
    'لا تُباع أي بيانات ولا تُسلَّم لأغراض إعلانية.',
  'Pour une demande de suppression de compte ou d’export de vos données, écrivez-nous depuis la page d’accueil.':
    'لطلب حذف الحساب أو تصدير بياناتك، راسلنا من الصفحة الرئيسية.',

  // --------------------------- liste des commandes · filtres et pagination
  'Affichage {premiere}–{derniere} sur {total}': 'عرض {premiere}–{derniere} من {total}',
  'Rien ne correspond à « {recherche} »{filtre}.': 'لا شيء يطابق «{recherche}»{filtre}.',
  ' dans le filtre « {nom} »': ' في مرشّح «{nom}»',
  'Aucune commande avec le statut « {statut} ».': 'لا طلب بحالة «{statut}».',
  '{n} commandes': {
    zero: 'لا طلبات',
    one: 'طلب واحد',
    two: 'طلبان',
    few: '{n} طلبات',
    many: '{n} طلبًا',
    other: '{n} طلب',
  },

  // ----------------------------- tableau de bord · indicateurs et capacité
  'Commandes actives': 'الطلبات النشطة',
  'À livrer': 'للتسليم',
  'Clients ce mois': 'عملاء هذا الشهر',
  'chargement…': 'جارٍ التحميل…',
  exemples: 'أمثلة',
  'à traiter': 'بانتظار المعالجة',
  'Calcul…': 'جارٍ الحساب…',
  'Calcul de la charge du jour…': 'جارٍ حساب حِمل اليوم…',
  'Journée saturée': 'اليوم مكتمل',
  '{n} place disponible': {
    zero: 'لا أماكن متاحة',
    one: 'مكان واحد متاح',
    two: 'مكانان متاحان',
    few: '{n} أماكن متاحة',
    many: '{n} مكانًا متاحًا',
    other: '{n} مكان متاح',
  },
  '{utilisees} h engagées sur {total} h — voir le planning':
    '{utilisees} س مشغولة من {total} س — عرض الجدول',
  'Équipe de {n} — d’après les tâches du jour': 'فريق من {n} — حسب مهام اليوم',
  'Aucun artisan — composez votre équipe.': 'لا خياط — كوّن فريقك.',
  'Aucun artisan actif.': 'لا يوجد خياط نشط.',
  'Aucun artisan.': 'لا يوجد خياط.',
  'Toute l’équipe est saturée aujourd’hui.': 'الفريق بأكمله مشغول اليوم.',
  '{n} h encore libres aujourd’hui': '{n} س ما زالت متاحة اليوم',
  'Aucune commande en cours.': 'لا طلبات جارية.',

  // -------------------------------------------------------------- planning
  'Planning équipe': 'جدول الفريق',
  'Semaine du {debut} au {fin}': 'أسبوع من {debut} إلى {fin}',
  'Semaine du {debut} au {fin} {mois} {annee}': 'أسبوع من {debut} إلى {fin} {mois} {annee}',
  'Revenir à la semaine en cours': 'العودة إلى الأسبوع الحالي',
  Affecter: 'إسناد',
  'Affectation…': 'جارٍ الإسناد…',
  'Mode démonstration — la tâche restera à l’écran seulement.':
    'وضع العرض — ستبقى المهمة على الشاشة فقط.',
  'La charge de l’artisan se met à jour immédiatement.': 'يُحدَّث حِمل الخياط فورًا.',
  Saturé: 'مكتمل',
  'Quasi-plein': 'شبه مكتمل',
  Disponible: 'متاح',

  // -------------------- fiche commande et carnet · onglets et champs vides
  Infos: 'معلومات',
  Tissus: 'الأقمشة',
  Récapitulatif: 'الملخّص',
  Suivi: 'المتابعة',
  'Commande introuvable': 'الطلب غير موجود',
  'Commande soldée': 'الطلب مسدَّد',
  'Confirmer la commande': 'تأكيد الطلب',
  'Champ requis': 'حقل مطلوب',
  'Non renseigné': 'غير محدَّد',
  'Téléphone non renseigné': 'الهاتف غير محدَّد',
  'Tissu non renseigné': 'القماش غير محدَّد',
  'Tissu apporté par le client': 'قماش أحضره العميل',
  'Aucun relevé': 'لا مقاسات',
  Relever: 'أخذ المقاسات',
  'Aucune commande': 'لا طلبات',
  'Créer le client': 'إنشاء العميل',
  'Aucune consigne particulière n’a été saisie.': 'لم تُدخَل أي تعليمات خاصة.',
  'Le statut n’a pas pu être enregistré.': 'تعذّر حفظ الحالة.',
  'Les mesures ne sont pas consultables en mode démonstration.':
    'لا يمكن الاطّلاع على المقاسات في وضع العرض.',
  'Marquer livrée': 'وضع علامة مُسلَّم',
  'Passer à l’essayage': 'الانتقال إلى البروفة',
  'Valider l’essayage': 'اعتماد البروفة',
  'Aucun artisan actif — composez l’équipe dans les paramètres':
    'لا خياط نشط — كوّن الفريق في الإعدادات',
  'Aucun artisan assigné.': 'لا خياط مُسنَد.',

  // ------------------------------------------- notifications et navigation
  'Aucune notification': 'لا إشعارات',
  'Aucune notification dans cette catégorie': 'لا إشعارات في هذه الفئة',
  'Ouvrir le menu': 'فتح القائمة',
  'Fermer le menu': 'إغلاق القائمة',
  'Exporter PDF': 'تصدير PDF',
  'Genre du client': 'نوع العميل',

  // ---------------------------------- trésorerie et dépenses · compléments
  Déclarer: 'تسجيل',
  Suspendre: 'تعليق',
  Réactiver: 'إعادة التفعيل',
  'Sans poste': 'بدون بند',

  // ------------------------------------------------ rapports · compléments
  'non mesurable': 'غير قابل للقياس',
  'des livraisons': 'من التسليمات',
  'de la commande à la livraison': 'من الطلب إلى التسليم',
  'Indicateurs indisponibles.': 'المؤشرات غير متاحة.',

  // ------------------------------------------------------- envoi de photos
  local: 'محلي',
  'Retirer {fichier}': 'إزالة {fichier}',
  'Photo affichée localement seulement — connectez-vous pour l’enregistrer durablement.':
    'الصورة معروضة محليًا فقط — سجّل الدخول لحفظها نهائيًا.',
  'L’envoi a échoué — la photo reste visible mais n’est pas enregistrée.':
    'فشل الرفع — تبقى الصورة ظاهرة لكنها غير محفوظة.',
  'Serveur injoignable — la photo reste visible mais n’est pas enregistrée.':
    'تعذّر الوصول إلى الخادم — تبقى الصورة ظاهرة لكنها غير محفوظة.',
  '« {fichier} » dépasse la taille maximale autorisée.': '«{fichier}» يتجاوز الحجم الأقصى المسموح.',
  '« {fichier} » n’est pas une image acceptée (JPEG, PNG, WebP).':
    '«{fichier}» ليس صورة مقبولة (JPEG أو PNG أو WebP).',

  // ----------------------------------------------------------- inscription
  'Créer mon compte': 'إنشاء حسابي',
  'Création…': 'جارٍ الإنشاء…',

  // ------------------------------------------ messages d’erreur des écrans
  'Planning indisponible.': 'الجدول غير متاح.',
  'Trésorerie indisponible.': 'الخزينة غير متاحة.',
  'Journal indisponible.': 'السجل غير متاح.',
  'Charges indisponibles.': 'الأعباء غير متاحة.',
  'Notes indisponibles.': 'الملاحظات غير متاحة.',
  'Réglages indisponibles.': 'الإعدادات غير متاحة.',
  'Grille tarifaire indisponible.': 'قائمة الأسعار غير متاحة.',
  'Note non enregistrée.': 'لم تُحفظ الملاحظة.',
  'Réglage non enregistré.': 'لم يُحفظ الإعداد.',
  'Modification non enregistrée.': 'لم يُحفظ التعديل.',
  'Modification impossible.': 'التعديل غير ممكن.',
  'Suppression impossible.': 'الحذف غير ممكن.',
  'Commande inconnue.': 'طلب غير معروف.',
  'Aucune mesure renseignée.': 'لم تُدخَل أي مقاسات.',
  'Impossible de charger l’équipe.': 'تعذّر تحميل الفريق.',
  'Impossible d’ajouter cet artisan.': 'تعذّرت إضافة هذا الخياط.',
  'Impossible d’enregistrer ce tarif.': 'تعذّر حفظ هذا السعر.',
  'Impossible d’enregistrer l’écriture.': 'تعذّر حفظ القيد.',
  'Impossible d’enregistrer la charge.': 'تعذّر حفظ العبء.',
  'Impossible d’enregistrer la tâche.': 'تعذّر حفظ المهمة.',
  'Impossible de calculer les indicateurs.': 'تعذّر حساب المؤشرات.',
  'Un artisan porte déjà ce nom.': 'يوجد خياط بهذا الاسم.',
  'Un client porte déjà ce nom.': 'يوجد عميل بهذا الاسم.',
  'Cette tenue figure déjà dans la grille.': 'هذا الثوب موجود في قائمة الأسعار.',
  'Connectez-vous pour composer votre équipe.': 'سجّل الدخول لتكوين فريقك.',
  'Connectez-vous pour composer votre grille.': 'سجّل الدخول لتكوين قائمة أسعارك.',
  'Connectez-vous pour régler vos alertes.': 'سجّل الدخول لضبط تنبيهاتك.',
  'Session expirée — reconnectez-vous.': 'انتهت الجلسة — سجّل الدخول من جديد.',
  'Session expirée — reconnectez-vous pour écrire une note.':
    'انتهت الجلسة — سجّل الدخول من جديد لكتابة ملاحظة.',
  'Cette date est déjà passée — la commande naîtrait en retard.':
    'هذا التاريخ قد مضى — سيبدأ الطلب متأخرًا.',
  'L’acompte dépasse le montant de la commande.': 'العربون يتجاوز مبلغ الطلب.',
  'Le tissu n’est pas renseigné.': 'القماش غير محدَّد.',
  'Aucun tarif dans votre grille — ajoutez-en un dans Paramètres › Tarification.':
    'لا سعر في قائمتك — أضف واحدًا في الإعدادات › التسعير.',
  'Le montant doit être un nombre supérieur à zéro.': 'يجب أن يكون المبلغ رقمًا أكبر من الصفر.',
  'Trop de commandes créées en même temps. Réessayez.':
    'طلبات كثيرة أُنشئت دفعة واحدة. أعد المحاولة.',

  // --------------------------------- compte · mot de passe et comptes liés
  'Connecté en tant que {email}': 'مسجَّل الدخول باسم {email}',
  'Définir un mot de passe': 'تعيين كلمة مرور',
  'Définir le mot de passe': 'تعيين كلمة المرور',
  'Tu peux modifier ton mot de passe ici. Les autres sessions seront déconnectées.':
    'يمكنك تغيير كلمة مرورك هنا. ستُنهى الجلسات الأخرى.',
  'Tu t’es connecté via Google. Définis un mot de passe pour pouvoir aussi te connecter par email.':
    'سجّلت الدخول عبر جوجل. عيّن كلمة مرور لتتمكّن من الدخول بالبريد أيضًا.',
  'Tu peux te connecter via Google.': 'يمكنك تسجيل الدخول عبر جوجل.',
  'Lie ton compte Google pour te connecter en un clic.':
    'اربط حساب جوجل لتسجّل الدخول بنقرة واحدة.',
  'Saisis un nouveau mot de passe.': 'أدخل كلمة مرور جديدة.',
  'La confirmation ne correspond pas au nouveau mot de passe.':
    'التأكيد لا يطابق كلمة المرور الجديدة.',
  'Mot de passe mis à jour.': 'تم تحديث كلمة المرور.',
  'Mot de passe défini. Tu peux maintenant te connecter par email.':
    'تم تعيين كلمة المرور. يمكنك الآن الدخول بالبريد.',
  'Mot de passe actuel incorrect.': 'كلمة المرور الحالية غير صحيحة.',
  'Ce mot de passe est trop courant.': 'كلمة المرور هذه شائعة جدًا.',
  'Mot de passe trop court.': 'كلمة المرور قصيرة جدًا.',
  'Ce mot de passe a fuité — choisis-en un autre.': 'تسرّبت كلمة المرور هذه — اختر غيرها.',
  'Un mot de passe est déjà défini. Utilise « changer le mot de passe ».':
    'توجد كلمة مرور بالفعل. استخدم «تغيير كلمة المرور».',
  'Champs invalides.': 'حقول غير صالحة.',
  'Erreur réseau. Réessaie.': 'خطأ في الشبكة. أعد المحاولة.',

  // -------------------- phrases interpolées, longtemps restées en français
  '{n} mesures — buste, robe et bas.': '{n} مقاسًا — الصدر والفستان والجزء السفلي.',
  '{n} mesures — buste, manches et pantalon.': '{n} مقاسًا — الصدر والأكمام والسروال.',
  '{n} clients': {
    zero: 'لا عملاء',
    one: 'عميل واحد',
    two: 'عميلان',
    few: '{n} عملاء',
    many: '{n} عميلًا',
    other: '{n} عميل',
  },
  'sur {total}': 'من {total}',
  '· palette {genre}': '· مجموعة {genre}',
  'Relevé du {date}': 'مقاسات بتاريخ {date}',
  '{n} écritures': {
    zero: 'لا قيود',
    one: 'قيد واحد',
    two: 'قيدان',
    few: '{n} قيود',
    many: '{n} قيدًا',
    other: '{n} قيد',
  },
  'Aucune mesure relevée pour {client}. Prenez le relevé avant de tailler.':
    'لا توجد مقاسات مسجَّلة لـ{client}. خذ المقاسات قبل القص.',
  'Tarif de façon : {prix}': 'سعر الخياطة: {prix}',
  '{utilisees}/{total} h engagées aujourd’hui': '{utilisees}/{total} س مشغولة اليوم',
  '{nom} — {utilisees}/{total} h engagées aujourd’hui':
    '{nom} — {utilisees}/{total} س مشغولة اليوم',
  'Annuler le versement de {montant}': 'إلغاء الدفعة البالغة {montant}',
  'Reste à encaisser : {montant}. Le versement entre aussitôt en trésorerie.':
    'المتبقّي للتحصيل: {montant}. تدخل الدفعة الخزينة فورًا.',
  rapports: 'التقارير',
  'Dépenses {montant}': 'مصروفات {montant}',
  'Charge de {nom}': 'حِمل {nom}',
  'Ces montants comptent l’argent {encaisse}. Le chiffre d’affaires des {rapports} compte l’argent {facture} : une commande de 80 000 F réglée de 20 000 F y pèse 80 000 F. Les deux sont justes et vont différer.':
    'هذه المبالغ تحسب المال {encaisse}. أمّا رقم الأعمال في {rapports} فيحسب المال {facture}: طلب بقيمة 80 000 ف دُفع منه 20 000 ف يزن فيها 80 000 ف. كلاهما صحيح، وسيختلفان.',
  '{n} écritures ont été reconstituées depuis un acompte antérieur au journal. Leur date est celle de la commande, faute de mieux : le solde du mois concerné est approximatif.':
    {
      one: 'أُعيد بناء قيد واحد انطلاقًا من عربون سابق للدفتر. تاريخه هو تاريخ الطلب، لعدم توفّر أفضل: رصيد ذلك الشهر تقريبي.',
      two: 'أُعيد بناء قيدين انطلاقًا من عربونين سابقين للدفتر. تاريخهما هو تاريخ الطلب، لعدم توفّر أفضل: رصيد الشهر المعني تقريبي.',
      few: 'أُعيد بناء {n} قيود انطلاقًا من عرابين سابقة للدفتر. تواريخها هي تواريخ الطلبات، لعدم توفّر أفضل: رصيد الأشهر المعنية تقريبي.',
      many: 'أُعيد بناء {n} قيدًا انطلاقًا من عرابين سابقة للدفتر. تواريخها هي تواريخ الطلبات، لعدم توفّر أفضل: رصيد الأشهر المعنية تقريبي.',
      other:
        'أُعيد بناء {n} قيد انطلاقًا من عرابين سابقة للدفتر. تواريخها هي تواريخ الطلبات، لعدم توفّر أفضل: رصيد الأشهر المعنية تقريبي.',
    },

  // ------------------------ messages d’erreur restés en français à l’écran
  'Aucun artisan': 'لا يوجد حِرفي',
  'Impossible de joindre le serveur. Vérifiez votre connexion.':
    'تعذّر الاتصال بالخادم. تحقّق من اتصالك.',
  'Trop de demandes. Patientez quelques minutes.': 'طلبات كثيرة جدًا. انتظر بضع دقائق.',
  'Trop de tentatives. Réessayez dans une heure.': 'محاولات كثيرة جدًا. أعد المحاولة بعد ساعة.',
  'Vérifiez l’adresse e-mail saisie.': 'تحقّق من عنوان البريد الإلكتروني المُدخَل.',
  'Le numéro doit commencer par un indicatif, par exemple +226.':
    'يجب أن يبدأ الرقم بمفتاح دولي، مثل +226.',

  // --------------------------------------- connexion Google · page d’échec
  "Votre adresse Google n'est pas vérifiée. Vérifiez-la sur votre compte Google, puis réessayez.":
    'عنوان جوجل الخاص بك غير مُوثَّق. وثّقه في حسابك على جوجل ثم أعد المحاولة.',
  'La connexion a été interrompue (vérification de sécurité). Cela peut arriver si la page Google est restée ouverte trop longtemps — réessayez.':
    'انقطع تسجيل الدخول (تحقّق أمني). قد يحدث هذا إذا بقيت صفحة جوجل مفتوحة مدة طويلة — أعد المحاولة.',
  'Google a refusé la connexion. Réessayez dans un instant.':
    'رفض جوجل تسجيل الدخول. أعد المحاولة بعد لحظات.',
  'La connexion via Google n’est pas activée sur ce serveur. Contactez le support.':
    'تسجيل الدخول عبر جوجل غير مُفعَّل على هذا الخادم. تواصل مع الدعم.',
  'Une erreur inattendue est survenue pendant la connexion. Réessayez.':
    'حدث خطأ غير متوقّع أثناء تسجيل الدخول. أعد المحاولة.',
  'Une erreur inconnue est survenue pendant la connexion. Réessayez.':
    'حدث خطأ غير معروف أثناء تسجيل الدخول. أعد المحاولة.',

  // --------------------------------------- trésorerie · phrases de l’écran
  recettes: 'مداخيل',
  dépenses: 'مصروفات',
  'solde {montant}': 'الرصيد {montant}',
  'Recettes {montant}': 'مداخيل {montant}',
  'Dépenses de {mois}': 'مصروفات {mois}',
  'Aucune dépense enregistrée ce mois-ci.': 'لا مصروفات مسجَّلة هذا الشهر.',
  '+{entrees} attendus · −{sorties} de charges': '+{entrees} متوقَّعة · −{sorties} أعباء',
  'attendus sur {n} commandes dont l’échéance est dépassée. C’est souvent ce qui explique un solde plus bas que prévu.':
    {
      one: 'متوقَّعة على طلب واحد تجاوز أجله. هذا ما يفسّر غالبًا رصيدًا أدنى من المتوقَّع.',
      two: 'متوقَّعة على طلبين تجاوزا أجلهما. هذا ما يفسّر غالبًا رصيدًا أدنى من المتوقَّع.',
      few: 'متوقَّعة على {n} طلبات تجاوزت آجالها. هذا ما يفسّر غالبًا رصيدًا أدنى من المتوقَّع.',
      many: 'متوقَّعة على {n} طلبًا تجاوزت آجالها. هذا ما يفسّر غالبًا رصيدًا أدنى من المتوقَّع.',
      other: 'متوقَّعة على {n} طلب تجاوزت آجالها. هذا ما يفسّر غالبًا رصيدًا أدنى من المتوقَّع.',
    },
  '{montant} restent à encaisser sur {n} commandes sans date de livraison — impossible de les placer sur le calendrier.':
    {
      one: 'يتبقّى تحصيل {montant} على طلب واحد بلا تاريخ تسليم — يتعذّر وضعه في الرزنامة.',
      two: 'يتبقّى تحصيل {montant} على طلبين بلا تاريخ تسليم — يتعذّر وضعهما في الرزنامة.',
      few: 'يتبقّى تحصيل {montant} على {n} طلبات بلا تاريخ تسليم — يتعذّر وضعها في الرزنامة.',
      many: 'يتبقّى تحصيل {montant} على {n} طلبًا بلا تاريخ تسليم — يتعذّر وضعها في الرزنامة.',
      other: 'يتبقّى تحصيل {montant} على {n} طلب بلا تاريخ تسليم — يتعذّر وضعها في الرزنامة.',
    },
  '· le {jour} du mois': '· في اليوم {jour} من الشهر',
  'Supprimer « {libelle} »': 'حذف «{libelle}»',
  '{montant} dû': '{montant} مستحقّة',
  '· reste {montant}': '· يتبقّى {montant}',

  // ----------------------------------------------------------- inscription
  'Vous avez déjà un compte ?': 'لديك حساب بالفعل؟',
  'Plan retenu : {plan}. L’essai de 30 jours démarre sans moyen de paiement — vous pourrez encore en changer.':
    'الخطة المختارة: {plan}. تبدأ تجربة الثلاثين يومًا دون وسيلة دفع — ويمكنك تغييرها لاحقًا.',

  // ---------------------------- derniers textes d’écran restés en français
  'Assigné : {artisan}': 'مُسنَد إلى: {artisan}',
  'Livraison {date}': 'التسليم {date}',
  'Aucun client ne correspond à « {recherche} ».': 'لا يوجد عميل يطابق «{recherche}».',
  'Aucune dépense en {mois}': 'لا مصروفات في {mois}',
  '{montant} au total': '{montant} في المجموع',
  '{nom} est déjà saturé aujourd’hui ({utilisees}/{total} h) — la livraison estimée en tiendra compte.':
    '{nom} مشغول بالكامل اليوم ({utilisees}/{total} س) — سيأخذ التسليم المُقدَّر ذلك في الحسبان.',
  'Modèle choisi par le client': 'الموديل الذي اختاره العميل',
  // ------------------------------------------------- paliers d’abonnement
  '2 artisans': '2 خيّاطين',
  '5 artisans': '5 خيّاطين',
  '15 artisans': '15 خيّاطًا',
  'Acomptes et soldes suivis': 'متابعة العرابين والأرصدة',
  'Alertes de retard et de livraison': 'تنبيهات التأخّر والتسليم',
  'Choisir ce palier': 'اختيار هذه الباقة',
  'Cinq langues, dont l’arabe': 'خمس لغات، منها العربية',
  'Clients et commandes illimités': 'عملاء وطلبات بلا حدّ',
  Commencer: 'ابدأ',
  'Dépenses et charges récurrentes': 'المصروفات والأعباء المتكرّرة',
  Essentiel: 'الأساسية',
  'Faut-il payer d’avance ?': 'هل يجب الدفع مسبقًا؟',
  'Formule de règlement': 'صيغة الدفع',
  Freemium: 'المجانية',
  Gratuit: 'مجاني',
  'Grille tarifaire et notes d’atelier': 'قائمة الأسعار وملاحظات الورشة',
  'Interlocuteur WhatsApp dédié': 'مسؤول تواصل مخصّص على واتساب',
  'Je ne suis plus seul.': 'لم أعد أعمل وحدي.',
  'Je tiens une entreprise.': 'أنا أدير مشروعًا.',
  'Le carnet complet, sans limite de durée': 'الدفتر كاملًا، بلا حدّ زمني',
  'Le carnet papier, remplacé.': 'الدفتر الورقي، وقد استُبدل.',
  'Logo de l’atelier': 'شعار الورشة',
  'Mannequin — 15 rendus par mois': 'عارض — 15 صورة شهريًا',
  'Par mois pour le planning et les photos': 'شهريًا للجدولة والصور',
  'Photos du tissu et du modèle': 'صور القماش والموديل',
  'Planning avec capacité par artisan': 'جدولة بطاقة كلّ خيّاط',
  'Pour toujours': 'إلى الأبد',
  Premium: 'المتميّزة',
  Pro: 'الاحترافية',
  'Que se passe-t-il si j’arrête de payer ?': 'ماذا يحدث إن توقّفت عن الدفع؟',
  'Rapports et export PDF': 'التقارير والتصدير إلى PDF',
  'Relevé de mesures, sans photo': 'المقاسات، بدون صور',
  'Reprise de votre carnet papier': 'ندخل لك دفترك الورقي',
  'Tout le Freemium, plus': 'كلّ ما في المجانية، إضافةً إلى',
  'Tout l’Essentiel, plus': 'كلّ ما في الأساسية، إضافةً إلى',
  'Tout le Pro, plus': 'كلّ ما في الاحترافية، إضافةً إلى',
  'Trésorerie — journal de caisse daté': 'الخزينة — دفتر صندوق مؤرَّخ',
  'par mois': 'شهريًا',
  'La vitrine — le seul palier qui aide à trouver des clientes.':
    'الواجهة — الباقة الوحيدة التي تساعدك على جلب زبونات جديدات.',
  'Le carnet est gratuit, sans limite de durée. Vous ne payez que le jour où l’atelier grandit.':
    'الدفتر مجاني بلا حدّ زمني. لا تدفع إلّا يوم تكبر فيه الورشة.',
  'Le trimestre offre un demi-mois, l’année offre trois mois. Aucun prélèvement automatique : vous payez, la date recule.':
    'الفصل يمنحك نصف شهر، والسنة تمنحك ثلاثة أشهر. لا خصم تلقائي: تدفع، فيتأخّر التاريخ.',
  'Le paiement en ligne n’est pas encore ouvert. Créez votre atelier gratuitement : nous vous contactons avant tout encaissement.':
    'الدفع عبر الإنترنت لم يُفتح بعد. أنشئ ورشتك مجانًا: سنتواصل معك قبل أيّ تحصيل.',
  'Palier retenu : {plan}. Votre atelier s’ouvre gratuitement — nous vous contactons avant tout encaissement.':
    'الباقة المختارة: {plan}. تُفتح ورشتك مجانًا — سنتواصل معك قبل أيّ تحصيل.',
  'Gratuit pour commencer, sans moyen de paiement. La première commande se saisit en deux minutes.':
    'مجاني للبدء، دون وسيلة دفع. أوّل طلب يُسجَّل في دقيقتين.',
  'Gratuit pour tenir votre carnet, sans carte bancaire. En français, en anglais, en espagnol, en portugais ou en arabe, dans le navigateur — rien à installer.':
    'مجاني لمسك دفترك، دون بطاقة بنكية. بالفرنسية أو الإنجليزية أو الإسبانية أو البرتغالية أو العربية، في المتصفّح — لا شيء يُثبَّت.',
  'Rien pour tenir votre carnet, vos clientes et vos commandes — sans limite de durée et sans carte bancaire. Le planning d’équipe et les photos commencent à 2 000 F CFA par mois, la trésorerie et les rapports à 5 000 F. Moins cher qu’une retouche.':
    'لا شيء لمسك دفترك وزبوناتك وطلباتك — بلا حدّ زمني ودون بطاقة بنكية. جدولة الفريق والصور تبدأ من 2 000 فرنك إفريقي شهريًا، والخزينة والتقارير من 5 000 فرنك. أرخص من تعديل واحد.',
  'Vous choisissez : au mois, au trimestre ou à l’année. Le trimestre offre un demi-mois, l’année offre trois mois — vous pouvez refaire le calcul vous-même. Il n’y a aucun prélèvement automatique : vous payez, la date recule, et rien ne se déclenche tout seul.':
    'أنت تختار: شهريًا أو فصليًا أو سنويًا. الفصل يمنحك نصف شهر والسنة تمنحك ثلاثة أشهر — ويمكنك إعادة الحساب بنفسك. لا خصم تلقائي: تدفع، فيتأخّر التاريخ، ولا شيء ينطلق من تلقاء نفسه.',
  'Vous revenez au gratuit, et rien n’est effacé. Vos clientes, vos commandes, vos mesures et vos photos restent lisibles. Ce sont les écrans payants et les nouveaux envois de photos qui se ferment, pas vos données.':
    'تعود إلى المجانية، ولا يُمحى شيء. زبوناتك وطلباتك ومقاساتك وصورك تبقى مقروءة. ما يُغلق هو الشاشات المدفوعة وإرسال صور جديدة، لا بياناتك.',
  // Le singulier garde `{n}` au lieu du « شهر واحد » idiomatique : c'est la
  // remise d'une demie qui passe par cette forme, et « un mois » y annoncerait
  // le double de ce qui est offert.
  '−{n} mois': {
    zero: '−{n} شهر',
    one: '−{n} شهر',
    two: '−شهران',
    few: '−{n} أشهر',
    many: '−{n} شهرًا',
    other: '−{n} شهر',
  },
  'Inclus à partir du palier {palier}': 'مُضمَّن ابتداءً من باقة {palier}',
  'Voir les paliers': 'عرض الباقات',
  'À partir de {prix} par mois': 'ابتداءً من {prix} شهريًا',
  '{ecran} — inclus dans un palier supérieur': '{ecran} — مُضمَّن في باقة أعلى',
};
