/**
 * GET  /api/commandes — commandes de l'atelier connecté.
 * POST /api/commandes — enregistre une commande de couture.
 *
 * À ne pas confondre avec `/api/orders`, qui reste la commande de PAIEMENT du
 * starter. Ici il s'agit de la commande de confection.
 */
export const runtime = 'nodejs';

import { Prisma } from '@prisma/client';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { verifyCsrf } from '@/lib/server/auth';
import { requireAuth } from '@/lib/server/middleware';
import { makeRequestContext, withRequestContext } from '@/lib/server/observability/request-context';
import { log } from '@/lib/server/observability/log';
import { prisma } from '@/lib/server/prisma';

const STATUTS = ['IN_PROGRESS', 'FITTING', 'DELIVERY', 'LATE', 'DELIVERED'] as const;

const creationSchema = z.object({
  customerId: z.string().min(1),
  garment: z.string().trim().min(1, 'Le type de tenue est requis').max(160),
  fabric: z.string().trim().max(200).optional(),
  color: z.string().trim().max(120).optional(),
  status: z.enum(STATUTS).optional(),
  // Entiers : le franc CFA n'a pas de décimales (invariant du CLAUDE.md).
  priceAmount: z.number().int().nonnegative(),
  depositAmount: z.number().int().nonnegative().optional(),
  assignee: z.string().trim().max(80).optional(),
  dueDate: z.string().datetime().optional(),
  notes: z.string().trim().max(2000).optional(),
});

function formatIssues(err: z.ZodError) {
  return err.issues.map((e) => ({ path: e.path.join('.'), message: e.message }));
}

const SELECTION = {
  id: true,
  sequence: true,
  garment: true,
  fabric: true,
  color: true,
  status: true,
  priceAmount: true,
  depositAmount: true,
  assignee: true,
  dueDate: true,
  notes: true,
  createdAt: true,
  customer: { select: { id: true, name: true, gender: true } },
} as const;

export async function GET(req: NextRequest): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const commandes = await prisma.tailoringOrder.findMany({
      where: { userId: auth.user.sub },
      select: SELECTION,
      orderBy: { sequence: 'desc' },
    });

    return NextResponse.json({ commandes });
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const csrfFail = verifyCsrf(req);
    if (csrfFail) return csrfFail;

    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    let corps: unknown;
    try {
      corps = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'VALIDATION_FAILED', message: 'Corps de requête illisible' },
        { status: 400 },
      );
    }

    const parsed = creationSchema.safeParse(corps);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'VALIDATION_FAILED', issues: formatIssues(parsed.error) },
        { status: 400 },
      );
    }

    const donnees = parsed.data;

    // Le client doit appartenir à l'atelier : sans ce contrôle, on rattacherait
    // une commande au client d'un autre compte.
    const client = await prisma.customer.findFirst({
      where: { id: donnees.customerId, userId: auth.user.sub },
      select: { id: true },
    });
    if (!client) {
      return NextResponse.json({ error: 'CUSTOMER_NOT_FOUND' }, { status: 404 });
    }

    if (donnees.depositAmount !== undefined && donnees.depositAmount > donnees.priceAmount) {
      return NextResponse.json(
        { error: 'DEPOSIT_EXCEEDS_PRICE', message: 'L’acompte dépasse le montant de la commande.' },
        { status: 400 },
      );
    }

    // Numérotation séquentielle par atelier.
    //
    // Deux approches ont été écartées, mesurées sous 6 à 8 créations simultanées :
    //
    //  - un verrou consultatif dans une transaction interactive (le motif des
    //    retraits) : `connection_limit=1`, imposé par Neon en serverless, ne
    //    laisse qu'UNE connexion. Huit transactions concurrentes font la queue
    //    et expirent avant de démarrer (P2028) — 6 échecs sur 8.
    //  - une simple boucle de reprise à 5 essais : une requête épuisait ses
    //    tentatives sous forte contention et rendait un 500.
    //
    // Retenu : pas de transaction (une connexion n'est prise que le temps d'une
    // requête), reprise avec attente croissante et désynchronisée, et un code
    // métier explicite si la contention persiste. `@@unique([userId, sequence])`
    // reste le garant : jamais deux commandes du même atelier au même numéro.
    const MAX_TENTATIVES = 12;

    for (let tentative = 1; tentative <= MAX_TENTATIVES; tentative++) {
      const derniere = await prisma.tailoringOrder.findFirst({
        where: { userId: auth.user.sub },
        select: { sequence: true },
        orderBy: { sequence: 'desc' },
      });

      try {
        const commande = await prisma.tailoringOrder.create({
          data: {
            userId: auth.user.sub,
            customerId: donnees.customerId,
            sequence: (derniere?.sequence ?? 0) + 1,
            garment: donnees.garment,
            priceAmount: donnees.priceAmount,
            ...(donnees.fabric ? { fabric: donnees.fabric } : {}),
            ...(donnees.color ? { color: donnees.color } : {}),
            ...(donnees.status ? { status: donnees.status } : {}),
            ...(donnees.depositAmount === undefined
              ? {}
              : { depositAmount: donnees.depositAmount }),
            ...(donnees.assignee ? { assignee: donnees.assignee } : {}),
            ...(donnees.dueDate ? { dueDate: new Date(donnees.dueDate) } : {}),
            ...(donnees.notes ? { notes: donnees.notes } : {}),
          },
          select: SELECTION,
        });

        log.info('commande de couture créée', {
          commandeId: commande.id,
          sequence: commande.sequence,
          tentatives: tentative,
        });
        return NextResponse.json({ commande }, { status: 201 });
      } catch (err) {
        const collision =
          err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';
        if (!collision) throw err;

        if (tentative === MAX_TENTATIVES) {
          log.warn('numérotation de commande : contention persistante', { tentatives: tentative });
          return NextResponse.json(
            {
              error: 'SEQUENCE_CONFLICT',
              message: 'Trop de commandes créées en même temps. Réessayez.',
            },
            { status: 409 },
          );
        }

        // Attente croissante et désynchronisée : sans le hasard, deux requêtes
        // en collision repartiraient ensemble et se heurteraient à nouveau.
        const attente = 15 * tentative + Math.floor(Math.random() * 40);
        await new Promise((r) => setTimeout(r, attente));
      }
    }

    // Inatteignable : la boucle retourne dans tous les cas.
    return NextResponse.json({ error: 'SEQUENCE_CONFLICT' }, { status: 409 });
  });
}
