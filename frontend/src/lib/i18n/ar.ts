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
};
