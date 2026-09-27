// Récupère le code de vérification d'un compte directement en base.
//
// En développement local, l'e-mail de vérification n'est jamais envoyé : il est
// déposé dans la file d'attente (table EmailJob) puis drainé par le cron Vercel
// `/api/cron/email-queue-drain`, qui ne tourne pas sur une machine de dev. Le
// code, lui, est bien créé en base — ce script va le chercher.
//
// Usage :
//   pnpm --filter frontend exec tsx --env-file=.env scripts/code-verification.ts <email>
//
// Ne PAS déployer : ce script contourne la vérification par e-mail.

import { pathToFileURL } from 'node:url';
import { PrismaClient } from '@prisma/client';

export async function main(email: string): Promise<number> {
  if (!email) {
    console.error('\n  Usage : tsx scripts/code-verification.ts <email>\n');
    return 1;
  }

  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, emailVerifiedAt: true },
    });

    if (!user) {
      console.error(`\n  Aucun compte pour « ${email} ».`);
      console.error('  Crée-le d’abord sur http://localhost:3000/inscription\n');
      return 1;
    }

    if (user.emailVerifiedAt) {
      console.log(`\n  ✓ ${email} est déjà vérifié — connecte-toi directement.`);
      console.log('    http://localhost:3000/connexion\n');
      return 0;
    }

    const code = await prisma.verificationCode.findFirst({
      where: { userId: user.id, type: 'EMAIL_VERIFY', usedAt: null },
      orderBy: { createdAt: 'desc' },
      select: { code: true, expiresAt: true },
    });

    if (!code) {
      console.error('\n  Aucun code actif. Demande un nouvel envoi depuis');
      console.error('  http://localhost:3000/verification\n');
      return 1;
    }

    const minutes = Math.round((code.expiresAt.getTime() - Date.now()) / 60000);
    console.log(`\n  Code de vérification pour ${email}`);
    console.log(`  ┌────────────┐`);
    console.log(`  │  ${code.code}  │`);
    console.log(`  └────────────┘`);
    console.log(
      minutes > 0 ? `  Valable encore ${minutes} minutes.` : '  ⚠️ Expiré — demande un renvoi.',
    );
    console.log(`\n  À saisir sur http://localhost:3000/verification\n`);
    return 0;
  } finally {
    await prisma.$disconnect();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main(process.argv[2] ?? '')
    .then((code) => process.exit(code))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
