// Reprise des acomptes antérieurs au journal de caisse.
// Usage : pnpm db:reprise-caisse [--dry]
//
// Avant le journal, `TailoringOrder.depositAmount` était un cumul écrit à la
// création de la commande, SANS DATE. La trésorerie a besoin de mouvements
// datés : ce script crée une écriture d'entrée par commande dont l'acompte
// n'est pas encore couvert par le journal.
//
// ⚠️ La date retenue est celle de la commande, faute de mieux : personne ne
// sait quand l'argent est réellement entré. Les lignes créées portent donc
// `backfilled: true`, et les écrans annoncent cette approximation au lieu de
// la faire passer pour une saisie.
//
// Idempotent : une commande dont les encaissements couvrent déjà l'acompte est
// laissée telle quelle. Relancer le script ne double aucun montant.

import { pathToFileURL } from 'node:url';
import { PrismaClient } from '@prisma/client';

let prismaClient: PrismaClient | null = null;
function getPrisma(): PrismaClient {
  if (!prismaClient) prismaClient = new PrismaClient();
  return prismaClient;
}

/** Minuit UTC du jour d'une date — même repère que la colonne `@db.Date`. */
function jourUtc(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export interface ResultatReprise {
  commandesExaminees: number;
  ecrituresCreees: number;
  montantRepris: number;
  ignorees: number;
}

export async function main(
  argv: string[] = process.argv.slice(2),
  deps: { prisma?: PrismaClient } = {},
): Promise<ResultatReprise> {
  const prisma = deps.prisma ?? getPrisma();
  const simulation = argv.includes('--dry');

  const commandes = await prisma.tailoringOrder.findMany({
    where: { depositAmount: { gt: 0 } },
    select: {
      id: true,
      userId: true,
      sequence: true,
      depositAmount: true,
      createdAt: true,
      customer: { select: { name: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  const resultat: ResultatReprise = {
    commandesExaminees: commandes.length,
    ecrituresCreees: 0,
    montantRepris: 0,
    ignorees: 0,
  };

  for (const c of commandes) {
    const deja = await prisma.cashMovement.aggregate({
      where: { tailoringOrderId: c.id, direction: 'IN' },
      _sum: { amount: true },
    });
    const couvert = deja._sum.amount ?? 0;
    const manquant = c.depositAmount - couvert;

    if (manquant <= 0) {
      resultat.ignorees += 1;
      continue;
    }

    if (!simulation) {
      await prisma.cashMovement.create({
        data: {
          userId: c.userId,
          direction: 'IN',
          amount: manquant,
          occurredAt: jourUtc(c.createdAt),
          // Le mode de règlement n'a pas été conservé à l'époque. « Espèces »
          // serait une invention ; on garde le mode le plus courant en
          // atelier, mais `backfilled` signale que la ligne est reconstituée.
          method: 'ESPECES',
          label: `Acompte commande #${String(c.sequence).padStart(3, '0')} — ${c.customer.name}`,
          notes: 'Reprise automatique : date et mode de règlement approximatifs.',
          tailoringOrderId: c.id,
          backfilled: true,
        },
      });
    }

    resultat.ecrituresCreees += 1;
    resultat.montantRepris += manquant;
  }

  return resultat;
}

/* c8 ignore start — bloc CLI, non exercé par les tests unitaires */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
    .then((r) => {
      const simulation = process.argv.slice(2).includes('--dry');
      console.log(
        `${simulation ? '[simulation] ' : ''}${r.ecrituresCreees} écriture(s) pour ${r.montantRepris} F ` +
          `— ${r.ignorees} commande(s) déjà à jour sur ${r.commandesExaminees}.`,
      );
      return getPrisma().$disconnect();
    })
    .catch(async (err) => {
      console.error('Reprise impossible :', err);
      await getPrisma().$disconnect();
      process.exit(1);
    });
}
/* c8 ignore stop */
