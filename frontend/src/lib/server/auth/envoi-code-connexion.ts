import 'server-only';
import { createMailer } from '@/lib/server/email';
import { loginCodeEmail } from './email-templates';
import { log } from '@/lib/server/observability/log';

export type ResultatEnvoi =
  | { etat: 'envoye' }
  /** Aucun fournisseur d'e-mail configuré — l'appelant décide de la suite. */
  | { etat: 'non-configure' }
  | { etat: 'echec' };

export interface EnvoiCodeConnexion {
  to: string;
  code: string;
  expiresAt: Date;
}

/**
 * Envoie le code de connexion immédiatement, sans passer par l'outbox.
 *
 * C'est la seule exception au chemin habituel, et elle est dictée par l'usage :
 * l'outbox est vidée par un passage toutes les minutes, puis la file d'e-mails
 * par un second — un code de connexion pourrait mettre deux minutes à partir.
 * Personne n'attend deux minutes devant un écran de connexion ; on abandonne,
 * on recommence, et chaque tentative invalide le code précédent. L'envoi direct
 * coûte une seconde d'attente à la connexion et rend le dispositif utilisable.
 *
 * En contrepartie, il n'y a ni file d'attente ni reprise : un échec est un
 * échec, et l'appelant doit le dire à l'utilisateur plutôt que de le laisser
 * attendre un e-mail qui ne viendra pas.
 */
export async function envoyerCodeConnexion(args: EnvoiCodeConnexion): Promise<ResultatEnvoi> {
  const cle = process.env.RESEND_API_KEY ?? '';
  const expediteur = process.env.EMAIL_FROM ?? '';

  if (!cle || !expediteur) {
    log.warn('code de connexion non envoyé : aucun fournisseur d’e-mail configuré', {
      raison: !cle ? 'RESEND_API_KEY' : 'EMAIL_FROM',
    });
    return { etat: 'non-configure' };
  }

  const modele = loginCodeEmail({
    code: args.code,
    email: args.to,
    expiresAt: args.expiresAt.toISOString(),
  });

  try {
    const mailer = createMailer({ RESEND_API_KEY: cle, EMAIL_FROM: expediteur });
    await mailer.send({
      to: args.to,
      subject: modele.subject,
      html: modele.html,
      text: modele.text,
    });
    return { etat: 'envoye' };
  } catch (err) {
    // Le code lui-même ne va pas dans le journal : il ouvrirait la session à qui
    // lit les logs, ce qui est précisément le contraire du but recherché.
    log.error('échec d’envoi du code de connexion', {
      erreur: err instanceof Error ? err.message : String(err),
    });
    return { etat: 'echec' };
  }
}
