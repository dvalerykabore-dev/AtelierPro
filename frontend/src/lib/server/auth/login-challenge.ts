import 'server-only';
import type { PrismaClient } from '@prisma/client';
import { generateVerificationCode, timingSafeCompare } from '@/lib/server/auth';

/**
 * Code à usage unique envoyé par e-mail pour confirmer une connexion.
 *
 * Le mot de passe ne suffit plus : il prouve ce qu'on sait, le code prouve
 * qu'on a accès à la boîte de l'atelier. Un mot de passe deviné ou réutilisé
 * ailleurs ne donne donc plus l'accès aux commandes et à la caisse.
 *
 * Réutilise la table `VerificationCode` avec un type à part. Le partage est
 * volontaire : le nettoyage horaire, la contrainte d'usage unique et la
 * comparaison en temps constant existent déjà et sont éprouvés. Le type
 * distinct est ce qui empêche un code d'inscription de servir à ouvrir une
 * session, et l'inverse.
 */
export const TYPE_DEFI = 'LOGIN_CHALLENGE';

/** Durée de validité. Plus court que la vérification d'e-mail : on est devant l'écran. */
export const TTL_MS = Number(process.env.AUTH_LOGIN_CHALLENGE_TTL_MIN ?? 10) * 60 * 1000;

/**
 * Nombre de saisies fausses tolérées pour un même code.
 *
 * Le limiteur par adresse est la vraie défense contre le forçage ; ce compteur
 * couvre l'autre cas, celui d'un code intercepté qu'on essaie de compléter à
 * l'aveugle. Au-delà, le code est brûlé — il faut en redemander un.
 */
export const MAX_TENTATIVES = 5;

export interface DefiCree {
  code: string;
  expiresAt: Date;
}

/**
 * Ouvre un défi pour cet utilisateur et invalide les précédents.
 *
 * L'invalidation compte autant que la création : sans elle, tous les codes
 * demandés dans la journée resteraient valables en parallèle, et la fenêtre
 * d'attaque grandirait à chaque tentative de connexion. Après cet appel, seul
 * le dernier e-mail reçu ouvre la session — ce que la personne attend de toute
 * façon.
 */
export async function ouvrirDefi(
  prisma: Pick<PrismaClient, 'verificationCode'>,
  userId: string,
  maintenant = new Date(),
): Promise<DefiCree> {
  const code = generateVerificationCode();
  const expiresAt = new Date(maintenant.getTime() + TTL_MS);

  await prisma.verificationCode.updateMany({
    where: { userId, type: TYPE_DEFI, usedAt: null },
    data: { usedAt: maintenant },
  });

  await prisma.verificationCode.create({
    data: { userId, code, type: TYPE_DEFI, expiresAt },
  });

  return { code, expiresAt };
}

export type ResultatDefi =
  | { ok: true }
  | { ok: false; motif: 'INVALIDE' | 'EXPIRE' | 'TROP_DE_TENTATIVES' };

/**
 * Consomme un code. Rend le motif de refus plutôt que de lever une exception —
 * l'appelant traduit en code d'erreur HTTP stable.
 *
 * `updateMany` avec le garde `usedAt: null` referme la fenêtre entre la lecture
 * et l'écriture : deux requêtes simultanées portant le même code passent toutes
 * deux la recherche, mais une seule met la ligne à jour. Sans ce garde, un code
 * à usage unique en devient un à double usage sous concurrence.
 */
export async function consommerDefi(
  prisma: Pick<PrismaClient, 'verificationCode'>,
  userId: string,
  code: string,
  maintenant = new Date(),
): Promise<ResultatDefi> {
  const ligne = await prisma.verificationCode.findFirst({
    where: { userId, code, type: TYPE_DEFI, usedAt: null },
    select: { id: true, code: true, expiresAt: true, attempts: true },
  });

  // Aucune ligne : code inconnu, déjà consommé, ou remplacé par un plus récent.
  // Les trois se disent « invalide » — distinguer renseignerait qui cherche.
  if (!ligne) {
    await prisma.verificationCode.updateMany({
      where: { userId, type: TYPE_DEFI, usedAt: null },
      data: { attempts: { increment: 1 } },
    });
    return { ok: false, motif: 'INVALIDE' };
  }

  if (ligne.attempts >= MAX_TENTATIVES) {
    await prisma.verificationCode.updateMany({
      where: { id: ligne.id, usedAt: null },
      data: { usedAt: maintenant },
    });
    return { ok: false, motif: 'TROP_DE_TENTATIVES' };
  }

  if (ligne.expiresAt.getTime() < maintenant.getTime()) {
    return { ok: false, motif: 'EXPIRE' };
  }

  // Défensif : la clause `where` a déjà fait l'égalité exacte, mais le jour où
  // quelqu'un remplace la recherche par un parcours, la comparaison naïve
  // fuirait la position du premier caractère faux par son temps de réponse.
  if (!timingSafeCompare(code, ligne.code)) {
    return { ok: false, motif: 'INVALIDE' };
  }

  const consomme = await prisma.verificationCode.updateMany({
    where: { id: ligne.id, usedAt: null },
    data: { usedAt: maintenant },
  });
  if (consomme.count === 0) return { ok: false, motif: 'INVALIDE' };

  return { ok: true };
}
