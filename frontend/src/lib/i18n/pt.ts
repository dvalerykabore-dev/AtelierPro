import type { Dictionnaire } from '@/lib/i18n/traduire';

/**
 * Traductions portugaises.
 *
 * La clé est la phrase française. Une clé absente n'est pas une erreur : le
 * moteur rend alors le français, et l'écran reste lisible. Voir
 * `traduire.ts` pour le raisonnement complet.
 *
 * Portugais européen, et non brésilien. Les pays lusophones que cet atelier
 * peut réellement toucher sont ses voisins — Guinée-Bissau, qui partage le
 * franc CFA, et Cap-Vert. D'où « guardar » et non « salvar », « definições »
 * et non « configurações », « equipa » et non « equipe », « palavra-passe » et
 * non « senha ».
 *
 * Vocabulaire retenu, une fois pour toutes :
 *   atelier → atelier       commande → encomenda    acompte → sinal
 *   tenue   → peça          façon    → feitio       relevé  → medidas
 *   artisan → alfaiate      échéance → prazo        caisse  → caixa
 *   poste   → rubrica       planning → agenda       tissu   → tecido
 */
export const pt: Dictionnaire = {
  // ---------------------------------------------------------------- commun
  Enregistrer: 'Guardar',
  'Enregistrement…': 'A guardar…',
  'Enregistré.': 'Guardado.',
  Annuler: 'Cancelar',
  Ajouter: 'Adicionar',
  'Ajout…': 'A adicionar…',
  Modifier: 'Editar',
  Supprimer: 'Eliminar',
  Retirer: 'Remover',
  Changer: 'Alterar',
  Fermer: 'Fechar',
  Confirmer: 'Confirmar',
  Rechercher: 'Pesquisar',
  Filtrer: 'Filtrar',
  'aujourd’hui': 'hoje',
  demain: 'amanhã',
  'Chargement…': 'A carregar…',
  Oui: 'Sim',
  Non: 'Não',
  Actif: 'Ativo',
  Inactif: 'Inativo',
  Total: 'Total',
  Tous: 'Todos',
  Toutes: 'Todas',
  Aucun: 'Nenhum',
  Aucune: 'Nenhuma',
  Optionnel: 'Opcional',
  facultatif: 'opcional',
  'Date invalide.': 'Data inválida.',
  'Heure invalide.': 'Hora inválida.',
  'F CFA': 'FCFA',
  à: 'a',

  // ------------------------------------------------------------ navigation
  'Tableau de bord': 'Painel',
  Accueil: 'Início',
  Planning: 'Agenda',
  Commandes: 'Encomendas',
  Clients: 'Clientes',
  Mesures: 'Medidas',
  Trésorerie: 'Tesouraria',
  Caisse: 'Caixa',
  Dépenses: 'Despesas',
  Rapports: 'Relatórios',
  Paramètres: 'Definições',
  Notifications: 'Notificações',
  'Navigation principale': 'Navegação principal',
  'Chargement de l’atelier…': 'A carregar o atelier…',
  'Mode démonstration — pages accessibles sans connexion. Retirez':
    'Modo de demonstração — páginas abertas sem sessão iniciada. Remova',
  'avant toute mise en ligne.': 'antes de qualquer colocação em linha.',

  // ------------------------------------------------------------- apparence
  'Activer le thème clair': 'Mudar para o tema claro',
  'Activer le thème sombre': 'Mudar para o tema escuro',
  Apparence: 'Aparência',
  'Thème de l’interface': 'Tema da interface',
  Sombre: 'Escuro',
  Clair: 'Claro',
  'Mémorisé sur cet appareil, pas sur votre compte.':
    'Memorizado neste dispositivo, não na sua conta.',

  // ----------------------------------------------------------------- langue
  Langue: 'Idioma',
  'Langue de l’interface': 'Idioma da interface',
  'Choisissez la langue de l’interface.': 'Escolha o idioma da interface.',
  'L’arabe se lit de droite à gauche : l’interface se retourne entièrement.':
    'O árabe lê-se da direita para a esquerda, por isso toda a interface se inverte.',

  // ------------------------------------------------- paramètres · atelier
  Atelier: 'Atelier',
  Équipe: 'Equipa',
  Tarification: 'Preçário',
  Compte: 'Conta',
  'Informations de l’atelier': 'Dados do atelier',
  'Nom de l’atelier': 'Nome do atelier',
  'Mon atelier': 'O meu atelier',
  'Le nom n’a pas pu être enregistré.': 'Não foi possível guardar o nome.',
  'Téléphone de l’atelier': 'Telefone do atelier',
  'Le numéro sur lequel on joint l’atelier.': 'O número pelo qual se contacta o atelier.',
  'Le numéro n’a pas pu être enregistré.': 'Não foi possível guardar o número.',
  Ville: 'Cidade',
  'La ville n’a pas pu être enregistrée.': 'Não foi possível guardar a cidade.',
  Adresse: 'Morada',
  'L’adresse n’a pas pu être enregistrée.': 'Não foi possível guardar a morada.',
  Horaires: 'Horário',
  'Heure d’ouverture': 'Hora de abertura',
  'Heure de fermeture': 'Hora de fecho',
  'Les horaires n’ont pas pu être enregistrés.': 'Não foi possível guardar o horário.',
  'Indiquez l’ouverture et la fermeture, ou aucune des deux.':
    'Indique a abertura e o fecho, ou nenhum dos dois.',
  'La fermeture doit venir après l’ouverture.': 'O fecho tem de ser depois da abertura.',
  Devise: 'Moeda',
  'Tous les montants enregistrés sont en francs CFA.':
    'Todos os montantes registados estão em francos CFA.',
  Logo: 'Logótipo',
  'Le logo n’a pas pu être envoyé.': 'Não foi possível enviar o logótipo.',
  'Le logo n’a pas pu être retiré.': 'Não foi possível remover o logótipo.',
  'Session expirée — reconnectez-vous pour enregistrer le logo.':
    'Sessão expirada — inicie sessão novamente para guardar o logótipo.',
  '« {fichier} » est trop lourd — réduisez l’image et réessayez.':
    '«{fichier}» é demasiado pesado — reduza a imagem e tente de novo.',
  'Format refusé — choisissez une image JPEG, PNG ou WebP.':
    'Formato recusado — escolha uma imagem JPEG, PNG ou WebP.',
  'Le stockage d’images n’est pas configuré sur ce serveur.':
    'O armazenamento de imagens não está configurado neste servidor.',
  'L’envoi a échoué — le logo n’a pas été enregistré.':
    'O envio falhou — o logótipo não foi guardado.',
  'Logo de {atelier}': 'Logótipo de {atelier}',

  // --------------------------------------------------- paramètres · équipe
  '{n} actifs sur {total}': { one: '{n} ativo de {total}', other: '{n} ativos de {total}' },
  '· exemples': '· exemplos',
  'Chargement de l’équipe…': 'A carregar a equipa…',
  'Aucun artisan. Ajoutez-en un pour pouvoir assigner des commandes et remplir le planning.':
    'Ainda não há alfaiates. Adicione um para poder atribuir encomendas e preencher a agenda.',
  'Activer {nom}': 'Ativar {nom}',
  'Ajouter un artisan': 'Adicionar um alfaiate',
  'Les initiales sont déduites du nom ; elles identifient l’artisan sur les commandes et le planning.':
    'As iniciais são deduzidas do nome; identificam o alfaiate nas encomendas e na agenda.',
  'Ajouter à l’équipe': 'Adicionar à equipa',
  'Nom complet': 'Nome completo',
  Rôle: 'Função',
  'Tailleur senior': 'Alfaiate sénior',
  Couturière: 'Costureira',
  'Capacité quotidienne (heures)': 'Capacidade diária (horas)',
  'Un apprenti ne tient pas les 8 h d’un tailleur senior — le planning s’appuie sur ce chiffre.':
    'Um aprendiz não aguenta as 8 h de um alfaiate sénior — a agenda apoia-se neste número.',
  'Téléphone (facultatif)': 'Telefone (opcional)',
  'Pour joindre l’artisan quand une tenue est promise pour le lendemain.':
    'Para contactar o alfaiate quando uma peça está prometida para o dia seguinte.',
  '{n} h / jour': '{n} h / dia',

  // ---------------------------------------------- paramètres · tarification
  'Grille tarifaire': 'Tabela de preços',
  'Ajouter un tarif': 'Adicionar um preço',
  'Chargement de la grille…': 'A carregar a tabela…',
  'Grille d’exemple — connectez-vous pour composer la vôtre.':
    'Tabela de exemplo — inicie sessão para compor a sua.',
  'Aucun tarif enregistré. Ajoutez vos prix de façon : ils seront proposés à chaque nouvelle commande.':
    'Nenhum preço registado. Adicione os seus preços de feitio: serão propostos em cada nova encomenda.',
  'Prix de {unite}': 'Preço de {unite}',
  façon: 'feitio',
  'Modifier le tarif {tenue}': 'Editar o preço de {tenue}',
  'Supprimer le tarif {tenue}': 'Eliminar o preço de {tenue}',
  'Nouveau tarif': 'Novo preço',
  'Modifier le tarif': 'Editar preço',
  'Prix de façon appliqué par défaut à ce type de tenue.':
    'Preço de feitio aplicado por omissão a este tipo de peça.',
  'Type de tenue': 'Tipo de peça',
  'Prix de façon': 'Preço de feitio',
  'En francs CFA, sans décimales.': 'Em francos CFA, sem decimais.',

  // --------------------------------------------- paramètres · notifications
  'Rappels automatiques': 'Lembretes automáticos',
  'Relevés chaque matin et déposés dans vos notifications.':
    'Verificados todas as manhãs e deixados nas suas notificações.',
  'Chargement des réglages…': 'A carregar as definições…',
  'Connectez-vous pour régler vos rappels.': 'Inicie sessão para configurar os seus lembretes.',

  // --------------------------------------------------- paramètres · compte
  'Votre compte': 'A sua conta',
  'Propriétaire de l’atelier': 'Proprietário do atelier',
  'Adresse e-mail': 'Endereço de e-mail',
  Téléphone: 'Telefone',
  'Le même que celui de l’onglet Atelier.': 'O mesmo do separador Atelier.',
  'Changer le mot de passe': 'Alterar a palavra-passe',
  'Se déconnecter': 'Terminar sessão',
  'Déconnexion…': 'A terminar sessão…',
  'Se déconnecter ?': 'Terminar sessão?',
  'Pour revenir, il faudra retaper votre mot de passe puis saisir un code envoyé à votre adresse e-mail.':
    'Para voltar, terá de escrever novamente a sua palavra-passe e depois introduzir um código enviado para o seu e-mail.',
  'Rester connecté': 'Manter a sessão',
  'Les commandes, la caisse et les mesures restent enregistrées — c’est l’accès depuis cet appareil qui se ferme.':
    'As encomendas, a caixa e as medidas continuam registadas — o que se fecha é o acesso a partir deste dispositivo.',

  // ------------------------------------------------------------- rappels
  'Commande en retard': 'Encomenda atrasada',
  'Dès qu’une commande dépasse son échéance de livraison.':
    'Assim que uma encomenda ultrapassa a sua data de entrega.',
  'Livraison demain': 'Entrega amanhã',
  'La veille, pour les commandes à remettre le lendemain.':
    'Na véspera, para as encomendas a entregar no dia seguinte.',

  // ------------------------------------------------------------- cloche
  'Aucune notification non lue': 'Nenhuma notificação por ler',
  '{n} notifications non lues': {
    one: '{n} notificação por ler',
    other: '{n} notificações por ler',
  },
  'exemple : {exemple}': 'exemplo: {exemple}',
  'Choisissez un pays.': 'Escolha um país.',
  '{ecran} — écran à venir': '{ecran} — ecrã em breve',

  // --------------------------------------------------------- sous-titres
  'Carnet clients': 'Livro de clientes',
  'Fiches, mesures et tissus': 'Fichas, medidas e tecidos',
  'Suivi de confection': 'Acompanhamento da confeção',
  'Nouvelle commande': 'Nova encomenda',
  'Modèle, artisan, tarif et échéance': 'Modelo, alfaiate, preço e prazo',
  'Relevé corporel, tissus apportés et modèle choisi':
    'Medidas do corpo, tecidos trazidos e modelo escolhido',

  // ------------------------------------------------------ authentification
  Connexion: 'Iniciar sessão',
  'Connexion…': 'A iniciar sessão…',
  'Se connecter': 'Iniciar sessão',
  'Accédez à vos commandes, votre planning et vos clients.':
    'Aceda às suas encomendas, à sua agenda e aos seus clientes.',
  'Pas encore de compte ?': 'Ainda não tem conta?',
  'Créer un atelier': 'Criar um atelier',
  'Mot de passe': 'Palavra-passe',
  'Mot de passe oublié ?': 'Esqueceu-se da palavra-passe?',
  'Mot de passe oublié': 'Palavra-passe esquecida',
  'Nous vous envoyons un code pour en choisir un nouveau.':
    'Enviamos-lhe um código para escolher uma nova.',
  'Vous vous en souvenez ?': 'Já se lembrou dela?',
  'Si un compte existe pour {email}, un code de réinitialisation vient d’être envoyé.':
    'Se existir uma conta para {email}, acabámos de enviar um código de reposição.',
  'J’ai reçu mon code': 'Recebi o meu código',
  'Envoi…': 'A enviar…',
  'Envoyer le code': 'Enviar o código',
  'Confirmer la connexion': 'Confirmar o início de sessão',
  'Un code à 8 caractères vient d’être envoyé à {email}.':
    'Acabámos de enviar um código de 8 caracteres para {email}.',
  'Changer d’adresse': 'Alterar o endereço',
  'Code reçu par e-mail': 'Código recebido por e-mail',
  'Il expire au bout de quelques minutes.': 'Expira ao fim de alguns minutos.',
  'Nouveau code envoyé. Le précédent ne fonctionne plus.':
    'Novo código enviado. O anterior deixou de funcionar.',
  'Vérification…': 'A verificar…',
  'Je n’ai rien reçu — renvoyer un code': 'Não recebi nada — enviar outro código',
  'Vérifiez votre e-mail': 'Verifique o seu e-mail',
  'Saisissez le code à 8 caractères que nous venons de vous envoyer.':
    'Introduza o código de 8 caracteres que acabámos de lhe enviar.',
  'Mauvaise adresse ?': 'Endereço errado?',
  'Recommencer l’inscription': 'Recomeçar o registo',
  'Code de vérification': 'Código de verificação',
  'Si un compte existe pour cette adresse, un nouveau code vient d’être envoyé.':
    'Se existir uma conta para este endereço, acabámos de enviar um novo código.',
  'Vérifier mon compte': 'Verificar a minha conta',
  'Renvoyer le code': 'Enviar o código de novo',
  'Nouveau mot de passe': 'Nova palavra-passe',
  'Saisissez le code reçu par e-mail et choisissez votre nouveau mot de passe.':
    'Introduza o código recebido por e-mail e escolha a sua nova palavra-passe.',
  'Code perdu ?': 'Perdeu o código?',
  'En demander un autre': 'Pedir outro',
  'Code reçu': 'Código recebido',
  '10 caractères minimum.': 'Mínimo de 10 caracteres.',
  'Changer mon mot de passe': 'Alterar a minha palavra-passe',
  'Retour à l’atelier': 'Voltar ao atelier',
  ou: 'ou',
  'Continuer avec Google': 'Continuar com o Google',

  // messages renvoyés par l’API, traduits à l’affichage
  'Adresse e-mail ou mot de passe incorrect.': 'Endereço de e-mail ou palavra-passe incorretos.',
  'Votre compte n’est pas encore vérifié. Consultez vos e-mails.':
    'A sua conta ainda não foi verificada. Consulte o seu e-mail.',
  'Trop de tentatives. Réessayez dans quelques minutes.':
    'Demasiadas tentativas. Tente novamente dentro de alguns minutos.',
  'Ce compte est suspendu. Contactez le support.': 'Esta conta está suspensa. Contacte o suporte.',
  'Le code n’a pas pu être envoyé. Réessayez dans un instant.':
    'Não foi possível enviar o código. Tente novamente dentro de instantes.',
  'Code incorrect. Vérifiez les 8 caractères reçus par e-mail.':
    'Código incorreto. Verifique os 8 caracteres recebidos por e-mail.',
  'Ce code a expiré. Demandez-en un nouveau.': 'Este código expirou. Peça um novo.',
  'Trop d’essais sur ce code. Demandez-en un nouveau.':
    'Demasiadas tentativas com este código. Peça um novo.',
  'Impossible de joindre le serveur.': 'Não foi possível contactar o servidor.',
  'Code invalide ou expiré. Vérifiez les 8 caractères saisis.':
    'Código inválido ou expirado. Verifique os 8 caracteres introduzidos.',
  'Le mot de passe doit faire au moins 10 caractères.':
    'A palavra-passe tem de ter pelo menos 10 caracteres.',
  'Ce mot de passe est trop courant. Choisissez-en un autre.':
    'Esta palavra-passe é demasiado comum. Escolha outra.',
  'Ce mot de passe a fuité lors d’une brèche connue. Choisissez-en un autre.':
    'Esta palavra-passe apareceu numa fuga de dados conhecida. Escolha outra.',

  // ------------------------------------------------------------ téléphone
  'Indicatif du pays': 'Indicativo do país',
  'Numéro de téléphone invalide.': 'Número de telefone inválido.',

  // ------------------------------------------------------- tableau de bord
  'Bonjour {nom}': 'Olá {nom}',
  'Commandes du jour': 'Encomendas do dia',
  'Commandes en cours': 'Encomendas em curso',
  'Commandes livrées': 'Encomendas entregues',
  'Chiffre d’affaires du mois': 'Faturação do mês',
  'Livraison à temps': 'Entregas a horas',
  'Délai moyen': 'Prazo médio',
  'Calcul des indicateurs…': 'A calcular os indicadores…',
  'Indicateurs indisponibles': 'Indicadores indisponíveis',
  'Notifications indisponibles': 'Notificações indisponíveis',
  'Non lue': 'Por ler',
  'AtelierPro, accueil': 'AtelierPro, início',
  'Ouvrir le carnet clients': 'Abrir o livro de clientes',

  // -------------------------------------------- commandes · liste et fiche
  Commande: 'Encomenda',
  'Commande en cours': 'Encomenda em curso',
  'Rechercher une commande': 'Pesquisar uma encomenda',
  'Rechercher un client, une tenue, une référence…':
    'Pesquisar um cliente, uma peça, uma referência…',
  'Aucune commande ne correspond': 'Nenhuma encomenda corresponde',
  'Aucune commande enregistrée.': 'Nenhuma encomenda registada.',
  'Cette commande n’existe pas': 'Esta encomenda não existe',
  'Chargement de la commande…': 'A carregar a encomenda…',
  'Retour aux commandes': 'Voltar às encomendas',
  'Retour à la liste': 'Voltar à lista',
  'Réf.': 'Ref.',
  Statut: 'Estado',
  Avancement: 'Progresso',
  'Livraison prévue': 'Entrega prevista',
  'Livraison calculée': 'Entrega calculada',
  'Date de création': 'Criada a',
  Assigné: 'Atribuída',
  'Assigné à': 'Atribuída a',
  'Non assigné': 'Sem atribuição',
  Artisan: 'Alfaiate',
  Tissu: 'Tecido',
  Instructions: 'Instruções',
  'Modèle choisi': 'Modelo escolhido',
  'Palette de mesures': 'Conjunto de medidas',
  'Montant de la commande': 'Valor da encomenda',
  'Voir la fiche client': 'Ver a ficha do cliente',
  'Page précédente': 'Página anterior',
  'Page suivante': 'Página seguinte',

  // ------------------------------------------- commandes · notes d’atelier
  'Notes atelier': 'Notas do atelier',
  'Chargement des notes…': 'A carregar as notas…',
  'Ajouter une note ou observation…': 'Adicionar uma nota ou observação…',
  'Nouvelle note d’atelier': 'Nova nota de atelier',
  'Publier la note': 'Publicar a nota',

  // ----------------------------------------------------- nouvelle commande
  'Cliente / client': 'Cliente',
  Client: 'Cliente',
  'Client concerné': 'Cliente em causa',
  'Nouveau client': 'Novo cliente',
  'Le genre détermine la palette de mesures qui lui sera présentée.':
    'O género determina o conjunto de medidas que lhe será apresentado.',
  'La référence visuelle que le client souhaite reproduire.':
    'A referência visual que o cliente quer reproduzir.',
  'Tissus apportés': 'Tecidos trazidos',
  'Photographiez chaque coupon : motif, métrage, couleur réelle.':
    'Fotografe cada corte: padrão, metragem, cor real.',
  'Wax hollandais — 6 yards': 'Wax holandês — 6 jardas',
  'Wax 6 yards — marché de Rood Woko': 'Wax 6 jardas — mercado de Rood Woko',
  'Notes / instructions': 'Notas / instruções',
  'Ces consignes sont lues par l’artisan au moment de la coupe.':
    'Estas indicações são lidas pelo alfaiate no momento do corte.',
  'Ex : col bateau, fermeture invisible dos, finitions dorées sur les ourlets.':
    'Ex.: decote barco, fecho invisível nas costas, acabamentos dourados nas bainhas.',
  'Ex : épaule droite légèrement plus basse, prévoir 1 cm de reprise.':
    'Ex.: ombro direito ligeiramente mais baixo, prever 1 cm de ajuste.',
  'Acompte versé': 'Sinal pago',
  'En francs CFA. Enregistré comme recette dans la caisse.':
    'Em francos CFA. Registado como receita na caixa.',
  'Réglé en': 'Pago em',
  'Sert au rapprochement de caisse en fin de mois.':
    'Serve para a reconciliação de caixa no fim do mês.',
  'Sert au bouton WhatsApp de la fiche client et de la commande.':
    'Alimenta o botão WhatsApp da ficha do cliente e da encomenda.',
  'Robe wax cérémonie — Mariam C.': 'Vestido wax de cerimónia — Mariam C.',

  // --------------------------------------------------------------- clients
  'Rechercher un client': 'Pesquisar um cliente',
  'Rechercher un client…': 'Pesquisar um cliente…',
  'Chargement des clients…': 'A carregar os clientes…',
  'Aucun client enregistré': 'Nenhum cliente registado',
  'Aucun numéro enregistré pour ce client.': 'Nenhum número registado para este cliente.',
  'Client fidèle': 'Cliente habitual',
  'Commandes passées': 'Encomendas feitas',
  'Dernière commande': 'Última encomenda',
  Effacer: 'Limpar',
  'Effacer la recherche': 'Limpar a pesquisa',

  // -------------------------------------------------- planning et capacité
  'Chargement du planning…': 'A carregar a agenda…',
  'Semaine précédente': 'Semana anterior',
  'Semaine suivante': 'Semana seguinte',
  Jour: 'Dia',
  'Légende :': 'Legenda:',
  Libre: 'Livre',
  'Affecter une tâche': 'Atribuir uma tarefa',
  'Intitulé de la tâche': 'Nome da tarefa',
  'Durée (heures)': 'Duração (horas)',
  'Capacité du jour': 'Capacidade do dia',
  'Charge globale de l’atelier': 'Carga global do atelier',
  Disponibles: 'Disponíveis',
  Saturés: 'Cheios',
  'Prochaine dispo': 'Próxima vaga',
  'Aucun artisan actif': 'Nenhum alfaiate ativo',
  'Composer l’équipe': 'Formar a equipa',

  // ---------------------------------------------- paiements d’une commande
  Paiements: 'Pagamentos',
  'Chargement des versements…': 'A carregar os pagamentos…',
  'Enregistrer un versement': 'Registar um pagamento',
  'Montant (F CFA)': 'Valor (FCFA)',
  'Date de l’encaissement': 'Data do recebimento',
  'Le jour où l’argent est entré, pas celui de la saisie.':
    'O dia em que o dinheiro entrou, não o dia em que foi introduzido.',
  'Réglé par': 'Pago por',
  'Note (facultatif)': 'Nota (opcional)',
  'Déjà encaissé': 'Já recebido',
  'Reste à payer': 'Falta pagar',
  'Part du montant encaissée': 'Parte do valor já recebida',
  '· date reconstituée': '· data reconstituída',

  // ------------------------------------------------ trésorerie et dépenses
  'Trésorerie indisponible': 'Tesouraria indisponível',
  'Dépenses indisponibles': 'Despesas indisponíveis',
  'Calcul du solde…': 'A calcular o saldo…',
  'Chargement du journal…': 'A carregar o diário…',
  Recettes: 'Receitas',
  Encaissé: 'Recebido',
  Résultat: 'Resultado',
  Prévision: 'Previsão',
  'Six derniers mois': 'Últimos seis meses',
  'Total 6 mois': 'Total de 6 meses',
  'Total facturé': 'Total faturado',
  'Total des dépenses': 'Total das despesas',
  'Mois précédent': 'Mês anterior',
  'Mois suivant': 'Mês seguinte',
  'Enregistrer une dépense': 'Registar uma despesa',
  Libellé: 'Descrição',
  'Loyer de l’atelier': 'Renda do atelier',
  Poste: 'Rubrica',
  'Par poste': 'Por rubrica',
  'Tous les postes': 'Todas as rubricas',
  'Filtrer par poste': 'Filtrar por rubrica',
  'Date du décaissement': 'Data do pagamento',
  'La date est celle où l’argent est sorti, pas celle de la saisie.':
    'A data é a do dia em que o dinheiro saiu, não a da introdução.',
  'Charges fixes': 'Encargos fixos',
  'Déclarer une charge fixe': 'Declarar um encargo fixo',
  'Montant mensuel (F CFA)': 'Valor mensal (FCFA)',
  'Jour d’échéance': 'Dia de vencimento',
  'Entre 1 et 28 — au-delà, février n’aurait pas d’échéance certaines années.':
    'Entre 1 e 28 — acima disso, fevereiro não teria vencimento em certos anos.',
  'Elle sert uniquement à la prévision. Aucun mouvement n’est écrit en caisse tant que vous n’avez pas payé.':
    'Serve apenas para a previsão. Nada é escrito na caixa enquanto não pagar.',
  'solde projeté': 'saldo previsto',
  '— reste du mois': '— resto do mês',
  encaissé: 'recebido',
  facturé: 'faturado',

  // ----------------------------------------------- téléversement de photos
  'Photo ou glisser-déposer': 'Foto ou arrastar e largar',

  // --------------------------------------- vocabulaire · genres et statuts
  Femme: 'Mulher',
  Homme: 'Homem',
  'En cours': 'Em curso',
  Essayage: 'Prova',
  Livraison: 'Entrega',
  'En retard': 'Atrasada',
  Livré: 'Entregue',
  Terminé: 'Concluída',
  Planifié: 'Planeada',
  Bloqué: 'Bloqueada',

  // ------------------------- vocabulaire · étapes et jalons d’une commande
  Modèle: 'Modelo',
  'Commande enregistrée': 'Encomenda registada',
  Confection: 'Confeção',

  // --------------------------------------- vocabulaire · postes de dépense
  'Tissus et fournitures': 'Tecidos e materiais',
  'Salaires et main-d’œuvre': 'Salários e mão de obra',
  'Broderie et façon': 'Bordado e feitio',
  Commissions: 'Comissões',
  Loyer: 'Renda',
  'Électricité et eau': 'Eletricidade e água',
  'Internet et téléphone': 'Internet e telefone',
  'Machines et entretien': 'Máquinas e manutenção',
  'Transport et livraison': 'Transporte e entrega',
  'Taxes et patente': 'Impostos e licença',
  Publicité: 'Publicidade',
  Divers: 'Diversos',

  // -------------------------------------- vocabulaire · modes de règlement
  Espèces: 'Dinheiro',
  'Mobile Money': 'Mobile Money',
  Virement: 'Transferência',
  Carte: 'Cartão',

  // ---------------------------------------- palettes de mesures · sections
  Haut: 'Parte de cima',
  Bas: 'Parte de baixo',
  'Buste, manches et longueur d’habit': 'Busto, mangas e comprimento da peça',
  Pantalon: 'Calças',
  'Buste, robe et manches': 'Busto, vestido e mangas',
  'Jupe, pantalon et montant': 'Saia, calças e gancho',

  // ------------------------------------------ palettes de mesures · relevé
  'Tour de cou': 'Pescoço',
  Épaule: 'Ombro',
  Épaules: 'Ombros',
  'Longueur d’épaule': 'Largura do ombro',
  Poitrine: 'Peito',
  'Écart poitrine': 'Distância entre os seios',
  'Hauteur poitrine': 'Altura do busto',
  'Longueur de manche': 'Comprimento da manga',
  'Tour de bras': 'Contorno do braço',
  'Longueur bras': 'Comprimento do braço',
  'Longueur bras total plié': 'Comprimento total do braço dobrado',
  Coude: 'Cotovelo',
  Poignet: 'Punho',
  'Tour du poignet': 'Contorno do punho',
  Taille: 'Cintura',
  'Tour de taille': 'Contorno da cintura',
  'Longueur taille devant': 'Comprimento da cintura à frente',
  'Longueur taille dos': 'Comprimento da cintura atrás',
  'Longueur habit': 'Comprimento da peça',
  'Longueur habit A': 'Comprimento da peça A',
  'Longueur habit B': 'Comprimento da peça B',
  Ceinture: 'Cós',
  'Tour hanche': 'Anca',
  'Tour de hanches': 'Ancas',
  'Hauteur taille-hanches': 'Da cintura à anca',
  'Hauteur taille-genou': 'Da cintura ao joelho',
  'Hauteur taille-cheville': 'Da cintura ao tornozelo',
  'Hauteur épaules-longueur finie': 'Do ombro ao comprimento final',
  'Hauteur bassin': 'Altura da bacia',
  'Hauteur montant assis': 'Gancho sentado',
  Entrejambe: 'Entrepernas',
  'Fourche (entrejambe)': 'Gancho (entrepernas)',
  Cuisse: 'Coxa',
  Mollet: 'Barriga da perna',
  Cheville: 'Tornozelo',
  'Longueur pantalon': 'Comprimento das calças',

  // ------------------------------------------------------ prise de mesures
  'Rechercher…': 'Pesquisar…',
  'Mesures {palette}': 'Medidas de {palette}',
  'Palette {palette} sur un client enregistré comme {client}.':
    'A mostrar o conjunto {palette} para um cliente registado como {client}.',
  '{remplies}/{total} renseignées': '{remplies}/{total} preenchidas',
  '{remplies}/{total} mesures': '{remplies}/{total} medidas',
  '{n} mesures': { one: '{n} medida', other: '{n} medidas' },
  '{n} photos de tissu': { one: '{n} foto de tecido', other: '{n} fotos de tecido' },
  'modèle photographié': 'modelo fotografado',
  'aucun modèle': 'sem modelo',
  'Remarques sur la morphologie': 'Observações sobre a morfologia',
  'Relevé enregistré': 'Medidas guardadas',
  'Conservé à l’écran seulement — connectez-vous pour enregistrer.':
    'Mantido apenas no ecrã — inicie sessão para guardar.',
  'Créer la commande': 'Criar a encomenda',
  'Enregistrer le relevé': 'Guardar as medidas',

  // --------------------------------------------------------------- landing
  'Essai gratuit': 'Teste gratuito',

  // ---------------------------------------------------- landing · accroche
  'Votre atelier, enfin tenu au clair': 'O seu atelier, finalmente em ordem',
  'Commandes, mesures, acomptes, planning de l’équipe. AtelierPro rassemble ce qui vit aujourd’hui dans des carnets, des SMS et de la mémoire.':
    'Encomendas, medidas, sinais, agenda da equipa. O AtelierPro reúne o que hoje vive em cadernos, mensagens e memória.',
  'Trente jours d’essai gratuit. Sans carte bancaire. En français, en anglais, en espagnol, en portugais ou en arabe, dans le navigateur — rien à installer.':
    'Trinta dias de teste gratuito. Sem cartão bancário. Em francês, inglês, espanhol, português ou árabe, no navegador — nada para instalar.',
  'Créer mon atelier': 'Criar o meu atelier',
  '30 jours': '30 dias',
  'D’essai gratuit, sans carte bancaire': 'De teste gratuito, sem cartão bancário',
  '0 F': '0 F',
  'À installer — tout passe par le navigateur': 'A instalar — tudo passa pelo navegador',
  'Écrans de gestion, du planning à la trésorerie': 'Ecrãs de gestão, da agenda à tesouraria',

  // --------------------------------------------- landing · fonctionnalités
  'Tout ce qu’un atelier a besoin de retenir': 'Tudo o que um atelier precisa de reter',
  'De la prise de commande à la livraison. Touchez une carte pour voir l’écran correspondant.':
    'Da receção da encomenda à entrega. Toque num cartão para ver o ecrã correspondente.',
  'Planification de l’équipe': 'Planeamento da equipa',
  'Affectez les tâches jour par jour et voyez immédiatement qui est saturé. La capacité est propre à chaque artisan : un apprenti à 6 h n’est pas jugé au seuil d’un tailleur senior.':
    'Atribua as tarefas dia a dia e veja logo quem está sobrecarregado. A capacidade é própria de cada alfaiate: um aprendiz de 6 h não é avaliado pelo limiar de um alfaiate sénior.',
  'Voir le planning': 'Ver a agenda',
  'Mesures conservées': 'Medidas guardadas',
  'Un relevé corporel par client, enregistré une fois et repris à chaque commande. Photos des tissus apportés et du modèle choisi.':
    'Um registo de medidas por cliente, guardado uma vez e reutilizado em cada encomenda. Fotografias dos tecidos trazidos e do modelo escolhido.',
  'Voir le relevé': 'Ver as medidas',
  'Acomptes et soldes': 'Sinais e saldos',
  'Chaque commande porte son montant, son acompte et son reste à payer, en francs CFA. Le solde se lit sans calcul mental.':
    'Cada encomenda tem o seu valor, o seu sinal e o que falta pagar, em francos CFA. O saldo lê-se sem contas de cabeça.',
  'Voir les commandes': 'Ver as encomendas',
  'Carnet client': 'Livro de clientes',
  'Coordonnées, historique des commandes et mesures d’un client au même endroit. Plus de carnet papier à retrouver.':
    'Contactos, histórico de encomendas e medidas de um cliente no mesmo sítio. Sem mais cadernos de papel para procurar.',
  'Voir le carnet': 'Ver o livro',
  'Rapports d’atelier': 'Relatórios do atelier',
  'Chiffre d’affaires, tenues les plus demandées, délais de livraison — calculés sur vos commandes réelles, jamais sur des exemples.':
    'Faturação, peças mais pedidas, prazos de entrega — calculados a partir das suas encomendas reais, nunca de exemplos.',
  'Voir les rapports': 'Ver os relatórios',
  'Pensé pour le téléphone': 'Pensado para o telemóvel',
  'Chaque écran est conçu d’abord pour un écran de téléphone, puis élargi. L’atelier se gère debout, entre deux essayages.':
    'Cada ecrã é desenhado primeiro para um telemóvel e só depois alargado. Um atelier gere-se de pé, entre duas provas.',
  'Voir le tableau de bord': 'Ver o painel',

  // ------------------------------------------- landing · profils d’atelier
  'Pour tout type d’atelier': 'Para qualquer tipo de atelier',
  'Que vous cousiez seul ou que vous meniez une équipe de dix personnes.':
    'Quer cosa sozinho, quer lidere uma equipa de dez pessoas.',
  'Atelier de quartier': 'Atelier de bairro',
  'Un tailleur seul ou deux à trois couturières. Commandes régulières, clientèle fidèle.':
    'Um alfaiate sozinho ou duas a três costureiras. Encomendas regulares, clientela fiel.',
  'Carnet client, mesures et acomptes au même endroit':
    'Livro de clientes, medidas e sinais no mesmo sítio',
  'Production collective': 'Produção coletiva',
  'Cinq à dix tailleurs, forte charge. Besoin de coordination et de délais tenus.':
    'Cinco a dez alfaiates, carga elevada. Precisa de coordenação e de prazos cumpridos.',
  'Charge de chaque artisan, jour par jour, avec sa capacité propre':
    'Carga de cada alfaiate, dia a dia, com a sua própria capacidade',
  'Maison de mode': 'Casa de moda',
  'Pièces de valeur, retouches nombreuses, clientèle exigeante.':
    'Peças de valor, muitos arranjos, clientela exigente.',
  'Relevé corporel conservé, photos des tissus, solde suivi à l’écriture près':
    'Medidas do corpo guardadas, fotografias dos tecidos, saldo acompanhado ao lançamento',
  'Ce que ça change': 'O que muda',

  // ------------------------------------------------------ landing · tarifs
  'Des tarifs lisibles': 'Preços que se leem',
  'Trente jours d’essai sur tous les plans. Sans engagement.':
    'Trinta dias de teste em todos os planos. Sem compromisso.',
  'Le paiement en ligne n’est pas encore ouvert : l’essai démarre sans moyen de paiement, et nous vous contactons avant tout prélèvement.':
    'O pagamento em linha ainda não está aberto: o teste começa sem meio de pagamento e entramos em contacto consigo antes de qualquer cobrança.',
  'Le plus choisi': 'O mais escolhido',
  'Commencer l’essai': 'Começar o teste',
  'Nous écrire': 'Escreva-nos',
  Découverte: 'Descoberta',
  'Pour un atelier qui démarre': 'Para um atelier a começar',
  'Jusqu’à 50 commandes par mois': 'Até 50 encomendas por mês',
  'Jusqu’à 5 artisans': 'Até 5 alfaiates',
  'Mesures et paiements': 'Medidas e pagamentos',
  'Notes d’atelier': 'Notas de atelier',
  'Assistance par e-mail': 'Apoio por e-mail',
  'Pour une équipe qui grandit': 'Para uma equipa que cresce',
  'Commandes illimitées': 'Encomendas ilimitadas',
  'Jusqu’à 10 artisans': 'Até 10 alfaiates',
  'Planning et capacité par artisan': 'Agenda e capacidade por alfaiate',
  'Rapports complets': 'Relatórios completos',
  'Assistance prioritaire': 'Apoio prioritário',
  Maison: 'Casa',
  'Pour les grands ateliers': 'Para grandes ateliers',
  'Sur devis': 'Sob orçamento',
  'Artisans illimités': 'Alfaiates ilimitados',
  'Accès à l’API': 'Acesso à API',
  'Mise en route accompagnée': 'Arranque acompanhado',
  'Formation de l’équipe': 'Formação da equipa',
  'Interlocuteur dédié': 'Interlocutor dedicado',
  '/mois': '/mês',

  // ---------------------------------------- landing · questions fréquentes
  'Questions fréquentes': 'Perguntas frequentes',
  'Faut-il un téléphone récent ?': 'É preciso um telemóvel recente?',
  'Non. AtelierPro s’ouvre dans le navigateur, y compris sur un Android ancien et une connexion lente. Aucune installation n’est nécessaire.':
    'Não. O AtelierPro abre no navegador, incluindo num Android antigo e com uma ligação lenta. Não é preciso instalar nada.',
  'Combien ça coûte ?': 'Quanto custa?',
  'Trente jours d’essai gratuit, puis de 2 000 à 5 000 F CFA par mois selon le plan. Moins cher qu’une retouche.':
    'Trinta dias de teste gratuito e depois de 2 000 a 5 000 FCFA por mês, conforme o plano. Mais barato do que um arranjo.',
  'Et si internet est coupé ?': 'E se a internet falhar?',
  'L’atelier a besoin d’une connexion pour enregistrer ses commandes. Le travail hors-ligne avec synchronisation différée est prévu, il n’est pas encore disponible.':
    'O atelier precisa de ligação para guardar as suas encomendas. O trabalho sem ligação com sincronização diferida está previsto, mas ainda não está disponível.',
  'Comment reprendre mes anciens clients ?': 'Como trago os meus clientes atuais?',
  'Le carnet s’alimente au fil des commandes : le premier client se saisit en moins d’une minute, mesures comprises. Un import de fichier est à l’étude.':
    'O livro enche-se ao ritmo das encomendas: o primeiro cliente introduz-se em menos de um minuto, medidas incluídas. A importação de um ficheiro está em estudo.',
  'C’est pour quel pays ?': 'Para que país é?',
  'Conçu pour l’Afrique de l’Ouest : interface en français, en anglais, en espagnol, en portugais ou en arabe, montants en francs CFA sans décimales.':
    'Concebido para a África Ocidental: interface em francês, inglês, espanhol, português ou árabe, montantes em francos CFA sem decimais.',

  // ---------------------------------- landing · témoignages et appel final
  'Ce que disent les tailleurs': 'O que dizem os alfaiates',
  'Des ateliers qui ont troqué le carnet contre l’écran.':
    'Ateliers que trocaram o caderno pelo ecrã.',
  'Du fil à la livraison': 'Da linha à entrega',
  'Prêt à mettre votre atelier au clair ?': 'Pronto para pôr o seu atelier em ordem?',
  'Trente jours gratuits, sans moyen de paiement. La première commande se saisit en deux minutes.':
    'Trinta dias gratuitos, sem meio de pagamento. A primeira encomenda introduz-se em dois minutos.',
  'Une question ? Écrivez-nous sur WhatsApp': 'Alguma dúvida? Escreva-nos no WhatsApp',

  // ---------------------------------- landing · navigation et pied de page
  Fonctionnalités: 'Funcionalidades',
  Tarifs: 'Preços',
  Témoignages: 'Testemunhos',
  Questions: 'Perguntas',
  'Liens de bas de page': 'Ligações de rodapé',
  Confidentialité: 'Privacidade',
  'Conditions d’utilisation': 'Condições de utilização',
  Contact: 'Contacto',
  'Fait pour l’Afrique de l’Ouest. © {annee}': 'Feito para a África Ocidental. © {annee}',
  'Retour à l’accueil': 'Voltar ao início',

  // ---------------------------------- alertes d’atelier · phrases rejouées
  'Commande {reference} en retard — {client}': 'Encomenda {reference} atrasada — {client}',
  '{tenue} devait être livrée le {date}.': '{tenue} devia ter sido entregue a {date}.',
  'Livraison demain — {client}': 'Entrega amanhã — {client}',
  '{tenue} ({reference}) est attendue demain.': '{tenue} ({reference}) é esperada amanhã.',
  'Voir la commande': 'Ver a encomenda',
  'À l’instant': 'Agora mesmo',

  // -------------------------------------------------------- titres d’écran
  'Prise de mesures': 'Tirar medidas',
  'Capacité de l’équipe': 'Capacidade da equipa',
  'Trésorerie de l’atelier': 'Tesouraria do atelier',
  'Politique de confidentialité': 'Política de privacidade',
  'Retour au dashboard': 'Voltar ao painel',
  'Retour à la connexion': 'Voltar ao início de sessão',
  'Échec de connexion': 'Falha ao iniciar sessão',
  Imprimer: 'Imprimir',
  'Voir tout': 'Ver tudo',
  'Voir toutes les commandes': 'Ver todas as encomendas',
  'Réinitialiser les filtres': 'Repor os filtros',

  // ------------------------------ commandes · liste, fiche et écrans vides
  'Client & tenue': 'Cliente e peça',
  'Client / Tenue': 'Cliente / Peça',
  'Chargement des commandes…': 'A carregar as encomendas…',
  'Détails de la commande': 'Detalhes da encomenda',
  'Détails du modèle': 'Detalhes do modelo',
  'Mesures corporelles': 'Medidas do corpo',
  'Tissus apportés par le client': 'Tecidos trazidos pelo cliente',
  'Couleur / motif': 'Cor / padrão',
  'Date de livraison': 'Data de entrega',
  'C’est la date promise au client — elle sert au planning et aux alertes de retard.':
    'Esta é a data prometida ao cliente — é ela que alimenta a agenda e os alertas de atraso.',
  Urgent: 'Urgente',
  Nouvelle: 'Nova',
  Saisir: 'Introduzir',
  Montant: 'Valor',
  'Elle a peut-être été supprimée, ou appartient à un autre atelier.':
    'Pode ter sido eliminada ou pertence a outro atelier.',
  'Aucun tissu photographié. Les tissus se prennent en photo pendant le relevé de mesures.':
    'Nenhum tecido fotografado. Os tecidos fotografam-se durante a tomada de medidas.',
  'Confirmée à l’écran seulement — connectez-vous pour l’enregistrer.':
    'Confirmada apenas no ecrã — inicie sessão para a guardar.',
  'Créez d’abord un client dans le carnet : une commande lui sera rattachée.':
    'Crie primeiro um cliente no livro: a encomenda ficará ligada a ele.',
  'En créer un': 'Criar um',
  'En ajouter une': 'Adicionar uma',
  ', livraison {date}': ', entrega a {date}',
  'Commande {reference} enregistrée pour {client} — {tenue}{livraison}.':
    'Encomenda {reference} registada para {client} — {tenue}{livraison}.',
  'Commande confirmée pour {client} — {tenue}{livraison}.':
    'Encomenda confirmada para {client} — {tenue}{livraison}.',

  // ---------------------------------------------------- paiements et notes
  'Aucun acompte': 'Sem sinal',
  'Aucun versement enregistré. La commande est entièrement due.':
    'Nenhum pagamento registado. A encomenda está totalmente por pagar.',
  'Ajouter note': 'Adicionar nota',
  'Aucune note pour l’instant. Ce qui s’écrit ici suit la commande — essayage, retouche demandée, tissu manquant.':
    'Ainda não há notas. O que se escreve aqui segue a encomenda — prova, arranjo pedido, tecido em falta.',
  'Connectez-vous pour lire et écrire les notes de cette commande.':
    'Inicie sessão para ler e escrever as notas desta encomenda.',

  // --------------------------------------------------------------- clients
  'Ajouter le premier client': 'Adicionar o primeiro cliente',
  'Historique commandes': 'Histórico de encomendas',
  'Aucune commande enregistrée pour ce client.': 'Nenhuma encomenda registada para este cliente.',
  Fidèle: 'Habitual',
  'Pas de numéro': 'Sem número',
  'Les mesures se rattachent à un client. Créez-en un depuis le carnet, puis revenez ici.':
    'As medidas ligam-se a um cliente. Crie um a partir do livro e volte aqui.',

  // ---------------------------------------------------- planning et équipe
  'Affecter tâche': 'Atribuir tarefa',
  'Charge totale': 'Carga total',
  'CA généré': 'Faturação gerada',
  'Aucune commande assignée pour l’instant.': 'Nenhuma encomenda atribuída por agora.',
  'Le planning se remplit par artisan. Composez votre équipe pour commencer à affecter des tâches.':
    'A agenda preenche-se por alfaiate. Forme a sua equipa para começar a atribuir tarefas.',

  // -------------------------------------------------------------- rapports
  'Chiffre d’affaires mensuel': 'Faturação mensal',
  'Tenues les plus commandées': 'Peças mais encomendadas',
  'Performance par artisan': 'Desempenho por alfaiate',
  'Statut des paiements': 'Estado dos pagamentos',
  'Payé intégral': 'Pago na totalidade',
  'Non payé': 'Por pagar',
  'Les rapports se calculent depuis vos commandes réelles. Connectez-vous pour les consulter — afficher des chiffres d’exemple ici induirait en erreur.':
    'Os relatórios calculam-se a partir das suas encomendas reais. Inicie sessão para os consultar — mostrar aqui números de exemplo induziria em erro.',

  // ------------------------------------------------ trésorerie et dépenses
  'Argent réellement encaissé, moins les dépenses décaissées, depuis l’ouverture du journal.':
    'Dinheiro efetivamente recebido, menos as despesas pagas, desde a abertura do diário.',
  'Dernier solde connu — vérification en cours…': 'Último saldo conhecido — a verificar…',
  'Entrées attendues d’après le reste à payer de vos commandes, sorties d’après vos charges déclarées. Ce n’est pas un constat.':
    'Entradas esperadas a partir do que falta pagar nas suas encomendas, saídas a partir dos encargos declarados. Não é uma constatação.',
  'La caisse passe sous zéro dans les mois qui viennent si rien ne change.':
    'A caixa passa a negativo nos próximos meses se nada mudar.',
  'Déclarer une charge': 'Declarar um encargo',
  'Aucune charge déclarée — la prévision ne compte donc aucune sortie.':
    'Nenhum encargo declarado — a previsão não conta, portanto, nenhuma saída.',
  'Déclarées une fois, elles alimentent la prévision. Elles n’écrivent rien en caisse : c’est la saisie d’une dépense qui fait bouger le solde.':
    'Declarados uma vez, alimentam a previsão. Não escrevem nada na caixa: é o registo de uma despesa que move o saldo.',
  'Enregistrez vos achats de tissu, salaires et charges au fur et à mesure : la trésorerie s’en déduit toute seule.':
    'Registe as suas compras de tecido, salários e encargos à medida que acontecem: a tesouraria deduz-se sozinha.',
  'Le solde de votre atelier ne s’affiche qu’une fois connecté. Aucun jeu d’exemple n’est proposé ici : on prend des décisions d’achat avec ce chiffre.':
    'O saldo do seu atelier só aparece depois de iniciar sessão. Não há aqui nenhum conjunto de exemplo: é com este número que se tomam decisões de compra.',
  'Les dépenses de votre atelier ne s’affichent qu’une fois connecté. Aucun jeu d’exemple n’est proposé ici : un chiffre d’argent inventé n’aiderait personne.':
    'As despesas do seu atelier só aparecem depois de iniciar sessão. Não há aqui nenhum conjunto de exemplo: um valor inventado não ajudaria ninguém.',

  // --------------------------------------------------------- notifications
  'Chargement des notifications…': 'A carregar as notificações…',
  'Marquer comme lue': 'Marcar como lida',
  'Tout marquer comme lu': 'Marcar tudo como lido',
  'Rien ne vous a été signalé. Les retards et les livraisons du lendemain sont vérifiés chaque matin — aucune échéance ne tombe aujourd’hui.':
    'Nada lhe foi assinalado. Os atrasos e as entregas do dia seguinte são verificados todas as manhãs — hoje não vence nenhum prazo.',
  'Vos alertes ne s’affichent qu’une fois connecté. Aucun jeu d’exemple n’est proposé ici : une notification affirme un fait daté, et une alerte inventée se confondrait avec une vraie.':
    'Os seus alertas só aparecem depois de iniciar sessão. Não há aqui nenhum conjunto de exemplo: uma notificação afirma um facto datado, e um alerta inventado confundir-se-ia com um verdadeiro.',

  // ------------------------------------------------- compte et inscription
  'Créer votre atelier': 'Criar o seu atelier',
  'Quelques secondes pour commencer à suivre vos commandes.':
    'Alguns segundos para começar a acompanhar as suas encomendas.',
  'Un code de vérification vous sera envoyé par e-mail.':
    'Ser-lhe-á enviado um código de verificação por e-mail.',
  '10 caractères minimum. Une phrase est plus sûre qu’un mot compliqué.':
    'Mínimo de 10 caracteres. Uma frase é mais segura do que uma palavra complicada.',
  'Mot de passe actuel': 'Palavra-passe atual',
  'Confirmer le nouveau mot de passe': 'Confirmar a nova palavra-passe',
  'Comptes liés': 'Contas associadas',
  'Lier Google': 'Associar o Google',
  Lié: 'Associada',

  // --------------------------------------------------------- pages légales
  'Ce document n’est pas encore rédigé. Il le sera avant l’ouverture des inscriptions payantes, et cette page portera alors le texte complet plutôt que cet avis.':
    'Este documento ainda não foi redigido. Sê-lo-á antes da abertura das subscrições pagas, e esta página passará então a conter o texto completo em vez deste aviso.',
  'Deux points méritent d’être dits dès maintenant, parce qu’ils engagent les deux parties :':
    'Há dois pontos que merecem ser ditos desde já, porque vinculam ambas as partes:',
  'Le paiement en ligne n’est pas ouvert. Aucun prélèvement n’est possible aujourd’hui, quel que soit le plan affiché sur la page d’accueil.':
    'O pagamento em linha não está aberto. Nenhuma cobrança é possível hoje, seja qual for o plano apresentado na página inicial.',
  'Le service est en cours de construction. Certaines fonctions annoncées sur la page d’accueil — travail hors-ligne, import de fichier clients — ne sont pas encore disponibles.':
    'O serviço está em construção. Algumas funções anunciadas na página inicial — trabalho sem ligação, importação de ficheiro de clientes — ainda não estão disponíveis.',
  'En attendant, voici ce que l’application fait réellement des données, tel qu’on peut le vérifier dans son code :':
    'Entretanto, eis o que a aplicação faz realmente com os dados, tal como se pode verificar no seu código:',
  'Les données d’un atelier — clients, mesures, commandes, planning, équipe — sont rattachées à son compte et ne sont jamais lues par un autre atelier.':
    'Os dados de um atelier — clientes, medidas, encomendas, agenda, equipa — estão ligados à sua conta e nunca são lidos por outro atelier.',
  'Les mots de passe ne sont pas conservés en clair ; seule une empreinte est stockée.':
    'As palavras-passe não são guardadas em claro; apenas é armazenada uma impressão digital.',
  'Les photos de tissus et de modèles sont hébergées chez Cloudinary. Les e-mails de vérification transitent par Resend.':
    'As fotografias de tecidos e de modelos estão alojadas na Cloudinary. Os e-mails de verificação passam pela Resend.',
  'Aucune donnée n’est revendue ni cédée à des fins publicitaires.':
    'Nenhum dado é revendido nem cedido para fins publicitários.',
  'Pour une demande de suppression de compte ou d’export de vos données, écrivez-nous depuis la page d’accueil.':
    'Para pedir a eliminação da conta ou a exportação dos seus dados, escreva-nos a partir da página inicial.',

  // --------------------------- liste des commandes · filtres et pagination
  'Affichage {premiere}–{derniere} sur {total}': 'A mostrar {premiere}–{derniere} de {total}',
  'Rien ne correspond à « {recherche} »{filtre}.': 'Nada corresponde a «{recherche}»{filtre}.',
  ' dans le filtre « {nom} »': ' no filtro «{nom}»',
  'Aucune commande avec le statut « {statut} ».': 'Nenhuma encomenda com o estado «{statut}».',
  '{n} commandes': { one: '{n} encomenda', other: '{n} encomendas' },

  // ----------------------------- tableau de bord · indicateurs et capacité
  'Commandes actives': 'Encomendas ativas',
  'À livrer': 'A entregar',
  'Clients ce mois': 'Clientes este mês',
  'chargement…': 'a carregar…',
  exemples: 'exemplos',
  'à traiter': 'a tratar',
  'Calcul…': 'A calcular…',
  'Calcul de la charge du jour…': 'A calcular a carga do dia…',
  'Journée saturée': 'Dia cheio',
  '{n} place disponible': { one: '{n} vaga livre', other: '{n} vagas livres' },
  '{utilisees} h engagées sur {total} h — voir le planning':
    '{utilisees} h ocupadas de {total} h — ver a agenda',
  'Équipe de {n} — d’après les tâches du jour': 'Equipa de {n} — segundo as tarefas do dia',
  'Aucun artisan — composez votre équipe.': 'Nenhum alfaiate — forme a sua equipa.',
  'Aucun artisan actif.': 'Nenhum alfaiate ativo.',
  'Aucun artisan.': 'Nenhum alfaiate.',
  'Toute l’équipe est saturée aujourd’hui.': 'Toda a equipa está cheia hoje.',
  '{n} h encore libres aujourd’hui': '{n} h ainda livres hoje',
  'Aucune commande en cours.': 'Nenhuma encomenda em curso.',

  // -------------------------------------------------------------- planning
  'Planning équipe': 'Agenda da equipa',
  'Semaine du {debut} au {fin}': 'Semana de {debut} a {fin}',
  'Semaine du {debut} au {fin} {mois} {annee}': 'Semana de {debut} a {fin} de {mois} de {annee}',
  'Revenir à la semaine en cours': 'Voltar à semana atual',
  Affecter: 'Atribuir',
  'Affectation…': 'A atribuir…',
  'Mode démonstration — la tâche restera à l’écran seulement.':
    'Modo de demonstração — a tarefa fica apenas no ecrã.',
  'La charge de l’artisan se met à jour immédiatement.':
    'A carga do alfaiate atualiza-se imediatamente.',
  Saturé: 'Cheio',
  'Quasi-plein': 'Quase cheio',
  Disponible: 'Disponível',

  // -------------------- fiche commande et carnet · onglets et champs vides
  Infos: 'Dados',
  Tissus: 'Tecidos',
  Récapitulatif: 'Resumo',
  Suivi: 'Acompanhamento',
  'Commande introuvable': 'Encomenda não encontrada',
  'Commande soldée': 'Encomenda liquidada',
  'Confirmer la commande': 'Confirmar a encomenda',
  'Champ requis': 'Campo obrigatório',
  'Non renseigné': 'Não indicado',
  'Téléphone non renseigné': 'Telefone não indicado',
  'Tissu non renseigné': 'Tecido não indicado',
  'Tissu apporté par le client': 'Tecido trazido pelo cliente',
  'Aucun relevé': 'Sem medidas',
  Relever: 'Tirar medidas',
  'Aucune commande': 'Nenhuma encomenda',
  'Créer le client': 'Criar o cliente',
  'Aucune consigne particulière n’a été saisie.': 'Não foi introduzida nenhuma indicação especial.',
  'Le statut n’a pas pu être enregistré.': 'Não foi possível guardar o estado.',
  'Les mesures ne sont pas consultables en mode démonstration.':
    'As medidas não podem ser consultadas em modo de demonstração.',
  'Marquer livrée': 'Marcar como entregue',
  'Passer à l’essayage': 'Passar à prova',
  'Valider l’essayage': 'Validar a prova',
  'Aucun artisan actif — composez l’équipe dans les paramètres':
    'Nenhum alfaiate ativo — forme a equipa nas definições',
  'Aucun artisan assigné.': 'Nenhum alfaiate atribuído.',

  // ------------------------------------------- notifications et navigation
  'Aucune notification': 'Nenhuma notificação',
  'Aucune notification dans cette catégorie': 'Nenhuma notificação nesta categoria',
  'Ouvrir le menu': 'Abrir o menu',
  'Fermer le menu': 'Fechar o menu',
  'Exporter PDF': 'Exportar PDF',
  'Genre du client': 'Género do cliente',

  // ---------------------------------- trésorerie et dépenses · compléments
  Déclarer: 'Declarar',
  Suspendre: 'Suspender',
  Réactiver: 'Reativar',
  'Sans poste': 'Sem rubrica',

  // ------------------------------------------------ rapports · compléments
  'non mesurable': 'não mensurável',
  'des livraisons': 'das entregas',
  'de la commande à la livraison': 'da encomenda à entrega',
  'Indicateurs indisponibles.': 'Indicadores indisponíveis.',

  // ------------------------------------------------------- envoi de photos
  local: 'local',
  'Retirer {fichier}': 'Remover {fichier}',
  'Photo affichée localement seulement — connectez-vous pour l’enregistrer durablement.':
    'Foto apresentada apenas localmente — inicie sessão para a guardar de forma duradoura.',
  'L’envoi a échoué — la photo reste visible mais n’est pas enregistrée.':
    'O envio falhou — a foto continua visível mas não foi guardada.',
  'Serveur injoignable — la photo reste visible mais n’est pas enregistrée.':
    'Servidor inacessível — a foto continua visível mas não foi guardada.',
  '« {fichier} » dépasse la taille maximale autorisée.':
    '«{fichier}» excede o tamanho máximo permitido.',
  '« {fichier} » n’est pas une image acceptée (JPEG, PNG, WebP).':
    '«{fichier}» não é uma imagem aceite (JPEG, PNG, WebP).',

  // ----------------------------------------------------------- inscription
  'Créer mon compte': 'Criar a minha conta',
  'Création…': 'A criar…',

  // ------------------------------------------ messages d’erreur des écrans
  'Planning indisponible.': 'Agenda indisponível.',
  'Trésorerie indisponible.': 'Tesouraria indisponível.',
  'Journal indisponible.': 'Diário indisponível.',
  'Charges indisponibles.': 'Encargos indisponíveis.',
  'Notes indisponibles.': 'Notas indisponíveis.',
  'Réglages indisponibles.': 'Definições indisponíveis.',
  'Grille tarifaire indisponible.': 'Tabela de preços indisponível.',
  'Note non enregistrée.': 'Nota não guardada.',
  'Réglage non enregistré.': 'Definição não guardada.',
  'Modification non enregistrée.': 'Alteração não guardada.',
  'Modification impossible.': 'Alteração impossível.',
  'Suppression impossible.': 'Eliminação impossível.',
  'Commande inconnue.': 'Encomenda desconhecida.',
  'Aucune mesure renseignée.': 'Nenhuma medida indicada.',
  'Impossible de charger l’équipe.': 'Não foi possível carregar a equipa.',
  'Impossible d’ajouter cet artisan.': 'Não foi possível adicionar este alfaiate.',
  'Impossible d’enregistrer ce tarif.': 'Não foi possível guardar este preço.',
  'Impossible d’enregistrer l’écriture.': 'Não foi possível guardar o lançamento.',
  'Impossible d’enregistrer la charge.': 'Não foi possível guardar o encargo.',
  'Impossible d’enregistrer la tâche.': 'Não foi possível guardar a tarefa.',
  'Impossible de calculer les indicateurs.': 'Não foi possível calcular os indicadores.',
  'Un artisan porte déjà ce nom.': 'Já existe um alfaiate com esse nome.',
  'Un client porte déjà ce nom.': 'Já existe um cliente com esse nome.',
  'Cette tenue figure déjà dans la grille.': 'Esta peça já consta da tabela.',
  'Connectez-vous pour composer votre équipe.': 'Inicie sessão para formar a sua equipa.',
  'Connectez-vous pour composer votre grille.': 'Inicie sessão para compor a sua tabela.',
  'Connectez-vous pour régler vos alertes.': 'Inicie sessão para configurar os seus alertas.',
  'Session expirée — reconnectez-vous.': 'Sessão expirada — inicie sessão novamente.',
  'Session expirée — reconnectez-vous pour écrire une note.':
    'Sessão expirada — inicie sessão novamente para escrever uma nota.',
  'Cette date est déjà passée — la commande naîtrait en retard.':
    'Esta data já passou — a encomenda nasceria atrasada.',
  'L’acompte dépasse le montant de la commande.': 'O sinal excede o valor da encomenda.',
  'Le tissu n’est pas renseigné.': 'O tecido não está indicado.',
  'Aucun tarif dans votre grille — ajoutez-en un dans Paramètres › Tarification.':
    'Nenhum preço na sua tabela — adicione um em Definições › Preçário.',
  'Le montant doit être un nombre supérieur à zéro.':
    'O valor tem de ser um número superior a zero.',
  'Trop de commandes créées en même temps. Réessayez.':
    'Demasiadas encomendas criadas ao mesmo tempo. Tente novamente.',

  // --------------------------------- compte · mot de passe et comptes liés
  'Connecté en tant que {email}': 'Sessão iniciada como {email}',
  'Définir un mot de passe': 'Definir uma palavra-passe',
  'Définir le mot de passe': 'Definir a palavra-passe',
  'Tu peux modifier ton mot de passe ici. Les autres sessions seront déconnectées.':
    'Pode alterar aqui a sua palavra-passe. As outras sessões serão terminadas.',
  'Tu t’es connecté via Google. Définis un mot de passe pour pouvoir aussi te connecter par email.':
    'Iniciou sessão com o Google. Defina uma palavra-passe para poder entrar também por e-mail.',
  'Tu peux te connecter via Google.': 'Pode iniciar sessão com o Google.',
  'Lie ton compte Google pour te connecter en un clic.':
    'Associe a sua conta Google para entrar com um clique.',
  'Saisis un nouveau mot de passe.': 'Introduza uma nova palavra-passe.',
  'La confirmation ne correspond pas au nouveau mot de passe.':
    'A confirmação não corresponde à nova palavra-passe.',
  'Mot de passe mis à jour.': 'Palavra-passe atualizada.',
  'Mot de passe défini. Tu peux maintenant te connecter par email.':
    'Palavra-passe definida. Já pode iniciar sessão por e-mail.',
  'Mot de passe actuel incorrect.': 'Palavra-passe atual incorreta.',
  'Ce mot de passe est trop courant.': 'Esta palavra-passe é demasiado comum.',
  'Mot de passe trop court.': 'Palavra-passe demasiado curta.',
  'Ce mot de passe a fuité — choisis-en un autre.':
    'Esta palavra-passe foi divulgada — escolha outra.',
  'Un mot de passe est déjà défini. Utilise « changer le mot de passe ».':
    'Já existe uma palavra-passe definida. Use «alterar a palavra-passe».',
  'Champs invalides.': 'Campos inválidos.',
  'Erreur réseau. Réessaie.': 'Erro de rede. Tente novamente.',

  // -------------------- phrases interpolées, longtemps restées en français
  '{n} mesures — buste, robe et bas.': '{n} medidas — busto, vestido e parte de baixo.',
  '{n} mesures — buste, manches et pantalon.': '{n} medidas — busto, mangas e calças.',
  '{n} clients': {
    one: '{n} cliente',
    other: '{n} clientes',
  },
  'sur {total}': 'de {total}',
  '· palette {genre}': '· conjunto {genre}',
  'Relevé du {date}': 'Medidas de {date}',
  '{n} écritures': {
    one: '{n} lançamento',
    other: '{n} lançamentos',
  },
  'Aucune mesure relevée pour {client}. Prenez le relevé avant de tailler.':
    'Nenhuma medida tirada para {client}. Tire as medidas antes de cortar.',
  'Tarif de façon : {prix}': 'Preço de feitio: {prix}',
  '{utilisees}/{total} h engagées aujourd’hui': '{utilisees}/{total} h ocupadas hoje',
  '{nom} — {utilisees}/{total} h engagées aujourd’hui':
    '{nom} — {utilisees}/{total} h ocupadas hoje',
  'Annuler le versement de {montant}': 'Anular o pagamento de {montant}',
  'Reste à encaisser : {montant}. Le versement entre aussitôt en trésorerie.':
    'Falta receber: {montant}. O pagamento entra imediatamente na tesouraria.',
  rapports: 'relatórios',
  'Dépenses {montant}': 'Despesas {montant}',
  'Charge de {nom}': 'Carga de {nom}',
  'Ces montants comptent l’argent {encaisse}. Le chiffre d’affaires des {rapports} compte l’argent {facture} : une commande de 80 000 F réglée de 20 000 F y pèse 80 000 F. Les deux sont justes et vont différer.':
    'Estes montantes contam o dinheiro {encaisse}. A faturação dos {rapports} conta o dinheiro {facture}: uma encomenda de 80 000 F com 20 000 F pagos pesa aí 80 000 F. Ambos estão certos e vão divergir.',
  '{n} écritures ont été reconstituées depuis un acompte antérieur au journal. Leur date est celle de la commande, faute de mieux : le solde du mois concerné est approximatif.':
    {
      one: '{n} lançamento foi reconstituído a partir de um sinal anterior ao diário. A sua data é a da encomenda, por falta de melhor: o saldo desse mês é aproximado.',
      other:
        '{n} lançamentos foram reconstituídos a partir de sinais anteriores ao diário. As suas datas são as das encomendas, por falta de melhor: o saldo desses meses é aproximado.',
    },

  // ------------------------ messages d’erreur restés en français à l’écran
  'Aucun artisan': 'Nenhum alfaiate',
  'Impossible de joindre le serveur. Vérifiez votre connexion.':
    'Não foi possível contactar o servidor. Verifique a sua ligação.',
  'Trop de demandes. Patientez quelques minutes.': 'Demasiados pedidos. Aguarde alguns minutos.',
  'Trop de tentatives. Réessayez dans une heure.':
    'Demasiadas tentativas. Tente novamente dentro de uma hora.',
  'Vérifiez l’adresse e-mail saisie.': 'Verifique o endereço de e-mail introduzido.',
  'Le numéro doit commencer par un indicatif, par exemple +226.':
    'O número tem de começar por um indicativo, por exemplo +226.',

  // --------------------------------------- connexion Google · page d’échec
  "Votre adresse Google n'est pas vérifiée. Vérifiez-la sur votre compte Google, puis réessayez.":
    'O seu endereço Google não está verificado. Verifique-o na sua conta Google e tente de novo.',
  'La connexion a été interrompue (vérification de sécurité). Cela peut arriver si la page Google est restée ouverte trop longtemps — réessayez.':
    'O início de sessão foi interrompido (verificação de segurança). Pode acontecer se a página do Google ficou aberta demasiado tempo — tente de novo.',
  'Google a refusé la connexion. Réessayez dans un instant.':
    'O Google recusou o início de sessão. Tente novamente dentro de instantes.',
  'La connexion via Google n’est pas activée sur ce serveur. Contactez le support.':
    'O início de sessão com o Google não está ativado neste servidor. Contacte o suporte.',
  'Une erreur inattendue est survenue pendant la connexion. Réessayez.':
    'Ocorreu um erro inesperado durante o início de sessão. Tente de novo.',
  'Une erreur inconnue est survenue pendant la connexion. Réessayez.':
    'Ocorreu um erro desconhecido durante o início de sessão. Tente de novo.',

  // --------------------------------------- trésorerie · phrases de l’écran
  recettes: 'receitas',
  dépenses: 'despesas',
  'solde {montant}': 'saldo {montant}',
  'Recettes {montant}': 'Receitas {montant}',
  'Dépenses de {mois}': 'Despesas de {mois}',
  'Aucune dépense enregistrée ce mois-ci.': 'Nenhuma despesa registada este mês.',
  '+{entrees} attendus · −{sorties} de charges': '+{entrees} esperados · −{sorties} de encargos',
  'attendus sur {n} commandes dont l’échéance est dépassée. C’est souvent ce qui explique un solde plus bas que prévu.':
    {
      one: 'esperados numa encomenda com o prazo ultrapassado. É muitas vezes isso que explica um saldo mais baixo do que o previsto.',
      other:
        'esperados em {n} encomendas com o prazo ultrapassado. É muitas vezes isso que explica um saldo mais baixo do que o previsto.',
    },
  '{montant} restent à encaisser sur {n} commandes sans date de livraison — impossible de les placer sur le calendrier.':
    {
      one: 'Faltam receber {montant} numa encomenda sem data de entrega — impossível colocá-la no calendário.',
      other:
        'Faltam receber {montant} em {n} encomendas sem data de entrega — impossível colocá-las no calendário.',
    },
  '· le {jour} du mois': '· no dia {jour} do mês',
  'Supprimer « {libelle} »': 'Eliminar «{libelle}»',
  '{montant} dû': '{montant} em dívida',
  '· reste {montant}': '· faltam {montant}',

  // ----------------------------------------------------------- inscription
  'Vous avez déjà un compte ?': 'Já tem conta?',
  'Plan retenu : {plan}. L’essai de 30 jours démarre sans moyen de paiement — vous pourrez encore en changer.':
    'Plano escolhido: {plan}. O teste de 30 dias começa sem meio de pagamento — ainda o pode mudar.',

  // ---------------------------- derniers textes d’écran restés en français
  'Assigné : {artisan}': 'Atribuída a: {artisan}',
  'Livraison {date}': 'Entrega {date}',
  'Aucun client ne correspond à « {recherche} ».': 'Nenhum cliente corresponde a «{recherche}».',
  'Aucune dépense en {mois}': 'Nenhuma despesa em {mois}',
  '{montant} au total': '{montant} no total',
  '{nom} est déjà saturé aujourd’hui ({utilisees}/{total} h) — la livraison estimée en tiendra compte.':
    '{nom} já está cheio hoje ({utilisees}/{total} h) — a entrega estimada tem isso em conta.',
  'Modèle choisi par le client': 'Modelo escolhido pelo cliente',
  // ------------------------------------------------- paliers d’abonnement
  '2 artisans': '2 alfaiates',
  '5 artisans': '5 alfaiates',
  '15 artisans': '15 alfaiates',
  'Acomptes et soldes suivis': 'Sinais e saldos acompanhados',
  'Alertes de retard et de livraison': 'Alertas de atraso e de entrega',
  'Choisir ce palier': 'Escolher este nível',
  'Cinq langues, dont l’arabe': 'Cinco línguas, incluindo o árabe',
  'Clients et commandes illimités': 'Clientes e encomendas ilimitados',
  Commencer: 'Começar',
  'Dépenses et charges récurrentes': 'Despesas e encargos recorrentes',
  Essentiel: 'Essencial',
  'Faut-il payer d’avance ?': 'É preciso pagar adiantado?',
  'Formule de règlement': 'Modalidade de pagamento',
  Freemium: 'Freemium',
  Gratuit: 'Grátis',
  'Grille tarifaire et notes d’atelier': 'Tabela de preços e notas do atelier',
  'Interlocuteur WhatsApp dédié': 'Um interlocutor dedicado no WhatsApp',
  'Je ne suis plus seul.': 'Já não trabalho sozinho.',
  'Je tiens une entreprise.': 'Tenho uma empresa.',
  'Le carnet complet, sans limite de durée': 'O caderno completo, sem limite de tempo',
  'Le carnet papier, remplacé.': 'O caderno de papel, substituído.',
  'Logo de l’atelier': 'Logótipo do atelier',
  'Mannequin — 15 rendus par mois': 'Manequim — 15 imagens por mês',
  'Par mois pour le planning et les photos': 'Por mês para a agenda e as fotos',
  'Photos du tissu et du modèle': 'Fotos do tecido e do modelo',
  'Planning avec capacité par artisan': 'Agenda com a capacidade de cada alfaiate',
  'Pour toujours': 'Para sempre',
  Premium: 'Premium',
  Pro: 'Pro',
  'Que se passe-t-il si j’arrête de payer ?': 'O que acontece se deixar de pagar?',
  'Rapports et export PDF': 'Relatórios e exportação em PDF',
  'Relevé de mesures, sans photo': 'Medidas, sem fotos',
  'Reprise de votre carnet papier': 'Passamos o seu caderno de papel',
  'Tout le Freemium, plus': 'Tudo o do Freemium, mais',
  'Tout l’Essentiel, plus': 'Tudo o do Essencial, mais',
  'Tout le Pro, plus': 'Tudo o do Pro, mais',
  'Trésorerie — journal de caisse daté': 'Caixa — livro de caixa com datas',
  'par mois': 'por mês',
  'La vitrine — le seul palier qui aide à trouver des clientes.':
    'A montra — o único nível que ajuda a encontrar clientes.',
  'Le carnet est gratuit, sans limite de durée. Vous ne payez que le jour où l’atelier grandit.':
    'O caderno é grátis, sem limite de tempo. Só paga no dia em que o atelier cresce.',
  'Le trimestre offre un demi-mois, l’année offre trois mois. Aucun prélèvement automatique : vous payez, la date recule.':
    'O trimestre oferece meio mês, o ano oferece três. Sem débito automático: paga e a data recua.',
  'Le paiement en ligne n’est pas encore ouvert. Créez votre atelier gratuitement : nous vous contactons avant tout encaissement.':
    'O pagamento em linha ainda não está aberto. Crie o seu atelier grátis: contactamo-lo antes de cobrar seja o que for.',
  'Palier retenu : {plan}. Votre atelier s’ouvre gratuitement — nous vous contactons avant tout encaissement.':
    'Nível escolhido: {plan}. O seu atelier abre grátis — contactamo-lo antes de cobrar seja o que for.',
  'Gratuit pour commencer, sans moyen de paiement. La première commande se saisit en deux minutes.':
    'Grátis para começar, sem meio de pagamento. A primeira encomenda regista-se em dois minutos.',
  'Gratuit pour tenir votre carnet, sans carte bancaire. En français, en anglais, en espagnol, en portugais ou en arabe, dans le navigateur — rien à installer.':
    'Grátis para manter o seu caderno, sem cartão bancário. Em francês, inglês, espanhol, português ou árabe, no navegador — nada para instalar.',
  'Rien pour tenir votre carnet, vos clientes et vos commandes — sans limite de durée et sans carte bancaire. Le planning d’équipe et les photos commencent à 2 000 F CFA par mois, la trésorerie et les rapports à 5 000 F. Moins cher qu’une retouche.':
    'Nada para manter o seu caderno, as suas clientes e as suas encomendas — sem limite de tempo e sem cartão bancário. A agenda da equipa e as fotos começam em 2 000 F CFA por mês; a caixa e os relatórios, em 5 000 F. Mais barato do que um arranjo.',
  'Vous choisissez : au mois, au trimestre ou à l’année. Le trimestre offre un demi-mois, l’année offre trois mois — vous pouvez refaire le calcul vous-même. Il n’y a aucun prélèvement automatique : vous payez, la date recule, et rien ne se déclenche tout seul.':
    'Escolhe: ao mês, ao trimestre ou ao ano. O trimestre oferece meio mês e o ano oferece três — pode refazer a conta você mesmo. Não há débito automático: paga, a data recua, e nada arranca sozinho.',
  'Vous revenez au gratuit, et rien n’est effacé. Vos clientes, vos commandes, vos mesures et vos photos restent lisibles. Ce sont les écrans payants et les nouveaux envois de photos qui se ferment, pas vos données.':
    'Volta ao grátis e nada é apagado. As suas clientes, encomendas, medidas e fotos continuam legíveis. O que fecha são os ecrãs pagos e os novos envios de fotos, não os seus dados.',
  '−{n} mois': {
    one: '−{n} mês',
    other: '−{n} meses',
  },
};
