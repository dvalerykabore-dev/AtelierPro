/**
 * GET  /api/tresorerie/mouvements — le journal de caisse, filtrable.
 * POST /api/tresorerie/mouvements — enregistre une entrée ou une sortie.
 *
 * Un seul registre pour les deux sens : la trésorerie est la somme signée des
 * mouvements, elle doit se lire d'une seule requête. Deux tables auraient
 * demandé deux écritures à chaque encaissement de commande, et fini par
 * diverger.
 */
export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { verifyCsrf } from '@/lib/server/auth';
import { requireAuth } from '@/lib/server/middleware';
import { exigerCapacite } from '@/lib/server/plans';
import { makeRequestContext, withRequestContext } from '@/lib/server/observability/request-context';
import { log } from '@/lib/server/observability/log';
import { prisma } from '@/lib/server/prisma';
import {
  SELECTION_MOUVEMENT,
  cleJourUtc,
  debutDeMoisUtc,
  jourUtc,
  moisSuivantUtc,
  recalerAcompte,
} from '@/lib/server/tresorerie/journal';
import { CLES_MODES, CLES_POSTES } from '@/lib/tresorerie';

/** Garde-fou de saisie : 100 millions de francs sur une ligne est une faute de frappe. */
const MONTANT_MAX = 100_000_000;

const jourSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date attendue au format AAAA-MM-JJ')
  .refine((v) => !Number.isNaN(jourUtc(v).getTime()), 'Date invalide');

const creationSchema = z
  .object({
    direction: z.enum(['IN', 'OUT']),
    amount: z.number().int().positive('Le montant doit être supérieur à zéro').max(MONTANT_MAX),
    occurredAt: jourSchema,
    category: z.enum(CLES_POSTES).optional(),
    method: z.enum(CLES_MODES),
    label: z.string().trim().min(1, 'Le libellé est requis').max(160),
    notes: z.string().trim().max(500).optional(),
    tailoringOrderId: z.string().trim().min(1).optional(),
  })
  .superRefine((v, ctx) => {
    // Une dépense sans poste ne se retrouve dans aucune répartition : elle
    // gonflerait le total sans jamais expliquer où l'argent est parti.
    if (v.direction === 'OUT' && !v.category) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['category'],
        message: 'Une dépense doit porter un poste',
      });
    }
    if (v.direction === 'IN' && v.category) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['category'],
        message: 'Une recette n’a pas de poste de dépense',
      });
    }
    if (v.direction === 'OUT' && v.tailoringOrderId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['tailoringOrderId'],
        message: 'Une dépense ne se rattache pas à une commande',
      });
    }
  });

const filtreSchema = z.object({
  mois: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .optional(),
  sens: z.enum(['IN', 'OUT']).optional(),
  poste: z.enum(CLES_POSTES).optional(),
  commande: z.string().trim().min(1).optional(),
});

function formatIssues(err: z.ZodError) {
  return err.issues.map((e) => ({ path: e.path.join('.'), message: e.message }));
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const refus = await exigerCapacite(auth.user.sub, 'tresorerie');
    if (refus) return refus;

    const url = new URL(req.url);
    const parsed = filtreSchema.safeParse({
      mois: url.searchParams.get('mois') ?? undefined,
      sens: url.searchParams.get('sens') ?? undefined,
      poste: url.searchParams.get('poste') ?? undefined,
      commande: url.searchParams.get('commande') ?? undefined,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'VALIDATION_FAILED', issues: formatIssues(parsed.error) },
        { status: 400 },
      );
    }

    const { mois, sens, poste, commande } = parsed.data;

    const mouvements = await prisma.cashMovement.findMany({
      where: {
        userId: auth.user.sub,
        ...(sens ? { direction: sens } : {}),
        ...(poste ? { category: poste } : {}),
        ...(commande ? { tailoringOrderId: commande } : {}),
        ...(mois ? { occurredAt: { gte: debutDeMoisUtc(mois), lt: moisSuivantUtc(mois) } } : {}),
      },
      select: {
        ...SELECTION_MOUVEMENT,
        tailoringOrder: { select: { sequence: true, customer: { select: { name: true } } } },
      },
      orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
      take: 500,
    });

    return NextResponse.json({
      mouvements: mouvements.map((m) => ({
        id: m.id,
        direction: m.direction,
        amount: m.amount,
        occurredAt: cleJourUtc(m.occurredAt),
        category: m.category,
        method: m.method,
        label: m.label,
        notes: m.notes,
        backfilled: m.backfilled,
        commande: m.tailoringOrder
          ? { numero: m.tailoringOrder.sequence, client: m.tailoringOrder.customer.name }
          : null,
      })),
    });
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const csrfFail = verifyCsrf(req);
    if (csrfFail) return csrfFail;

    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const refus = await exigerCapacite(auth.user.sub, 'tresorerie');
    if (refus) return refus;

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

    // L'écriture et le recalage de l'acompte tiennent dans une transaction :
    // un mouvement enregistré sans que la commande suive ferait apparaître de
    // l'argent en caisse tout en laissant la commande impayée.
    try {
      const resultat = await prisma.$transaction(async (tx) => {
        if (donnees.tailoringOrderId) {
          const commande = await tx.tailoringOrder.findFirst({
            where: { id: donnees.tailoringOrderId, userId: auth.user.sub },
            select: { id: true, priceAmount: true, depositAmount: true },
          });
          if (!commande) return { erreur: 'ORDER_NOT_FOUND' as const };

          const restant = commande.priceAmount - commande.depositAmount;
          if (donnees.amount > restant) {
            return { erreur: 'OVERPAYMENT' as const, restant };
          }
        }

        const mouvement = await tx.cashMovement.create({
          data: {
            userId: auth.user.sub,
            direction: donnees.direction,
            amount: donnees.amount,
            occurredAt: jourUtc(donnees.occurredAt),
            method: donnees.method,
            label: donnees.label,
            ...(donnees.category === undefined ? {} : { category: donnees.category }),
            ...(donnees.notes === undefined || donnees.notes === ''
              ? {}
              : { notes: donnees.notes }),
            ...(donnees.tailoringOrderId === undefined
              ? {}
              : { tailoringOrderId: donnees.tailoringOrderId }),
          },
          select: SELECTION_MOUVEMENT,
        });

        const encaisse = donnees.tailoringOrderId
          ? await recalerAcompte(tx, donnees.tailoringOrderId)
          : null;

        return { mouvement, encaisse };
      });

      if ('erreur' in resultat) {
        if (resultat.erreur === 'ORDER_NOT_FOUND') {
          return NextResponse.json(
            { error: 'ORDER_NOT_FOUND', message: 'Commande introuvable.' },
            { status: 404 },
          );
        }
        return NextResponse.json(
          {
            error: 'OVERPAYMENT',
            message: `Il ne reste que ${resultat.restant} F à encaisser sur cette commande.`,
          },
          { status: 409 },
        );
      }

      log.info('mouvement de caisse enregistré', {
        mouvementId: resultat.mouvement.id,
        sens: donnees.direction,
      });

      return NextResponse.json(
        {
          mouvement: {
            ...resultat.mouvement,
            occurredAt: cleJourUtc(resultat.mouvement.occurredAt),
          },
          encaisse: resultat.encaisse,
        },
        { status: 201 },
      );
    } catch (err) {
      log.error('écriture de caisse impossible', { err: String(err) });
      return NextResponse.json(
        { error: 'CASH_WRITE_FAILED', message: 'Enregistrement impossible. Réessayez.' },
        { status: 500 },
      );
    }
  });
}
