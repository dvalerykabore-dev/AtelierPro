import 'server-only';

/**
 * Réglages qui n'ont d'importance qu'en production, et qui échouent en silence.
 *
 * Chacun de ces défauts laisse l'application démarrer, répondre 200 et paraître
 * saine — c'est précisément ce qui les rend coûteux. Un expéditeur de bac à
 * sable ne bloque rien au démarrage : il bloque le premier inscrit, des jours
 * plus tard, sans laisser de trace.
 *
 * On n'interrompt pas le démarrage pour autant. Une prod qui refuse de monter
 * pour un lien d'email mal formé est un incident plus grave que le lien.
 */

export interface AnomalieConfig {
  /** Variable en cause — sert de clé stable pour un test ou une alerte. */
  variable: string;
  probleme: string;
  correctif: string;
}

/** Expéditeurs de test des fournisseurs d'email : ne délivrent qu'au propriétaire du compte. */
const EXPEDITEURS_BAC_A_SABLE = ['@resend.dev', '@example.com'];

function estLocal(url: string): boolean {
  return url.includes('localhost') || url.includes('127.0.0.1');
}

/**
 * Contrôle la configuration destinée à la production.
 *
 * Rend la liste des anomalies plutôt que de journaliser elle-même : une
 * fonction pure se teste sans capturer les logs, et l'appelant décide du
 * niveau.
 */
export function anomaliesProduction(vars: NodeJS.ProcessEnv): AnomalieConfig[] {
  if (vars['NODE_ENV'] !== 'production') return [];

  const anomalies: AnomalieConfig[] = [];
  const appUrl = vars['APP_URL'] ?? '';
  const expediteur = vars['EMAIL_FROM'] ?? '';
  const demo = vars['NEXT_PUBLIC_ATELIER_DEMO'] ?? '';
  const prefixes = (vars['AUTH_PROTECTED_PREFIXES'] ?? '').trim();

  if (appUrl === '' || estLocal(appUrl)) {
    anomalies.push({
      variable: 'APP_URL',
      probleme:
        appUrl === ''
          ? 'APP_URL est absente'
          : `APP_URL pointe encore sur la machine locale (${appUrl})`,
      correctif:
        'Poser APP_URL sur l’URL publique. Elle sert aux liens des e-mails de ' +
        'vérification et à la base de redirection OAuth : sur localhost, ces liens ' +
        'ramènent le destinataire sur sa propre machine.',
    });
  }

  if (expediteur === '') {
    anomalies.push({
      variable: 'EMAIL_FROM',
      probleme: 'EMAIL_FROM est absente',
      correctif: 'Poser une adresse d’un domaine vérifié chez le fournisseur d’e-mail.',
    });
  } else if (EXPEDITEURS_BAC_A_SABLE.some((suffixe) => expediteur.endsWith(suffixe))) {
    anomalies.push({
      variable: 'EMAIL_FROM',
      probleme: `EMAIL_FROM est un expéditeur de test (${expediteur})`,
      correctif:
        'Vérifier un domaine chez le fournisseur et l’utiliser ici. Un expéditeur ' +
        'de bac à sable ne délivre qu’au propriétaire du compte : personne d’autre ' +
        'ne recevra son code de vérification, donc personne ne pourra s’inscrire.',
    });
  }

  if (demo !== '') {
    anomalies.push({
      variable: 'NEXT_PUBLIC_ATELIER_DEMO',
      probleme: 'le mode démonstration est déclaré en production',
      correctif:
        'Retirer la variable. Le code l’ignore déjà quand NODE_ENV vaut ' +
        '« production », mais la laisser posée entretient une fausse idée de ce ' +
        'que fait le déploiement.',
    });
  }

  if (prefixes === '') {
    anomalies.push({
      variable: 'AUTH_PROTECTED_PREFIXES',
      probleme: 'aucun préfixe de page protégé',
      correctif:
        'Lister les routes de l’atelier. Sans elles, le middleware laisse passer ' +
        'la requête et le rideau d’authentification ne tombe que dans le ' +
        'navigateur, après que le HTML a été transmis.',
    });
  }

  return anomalies;
}
