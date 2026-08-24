/**
 * PATCH  /api/tresorerie/charges/[id] — modifie une charge fixe, ou la désactive.
 * DELETE /api/tresorerie/charges/[id] — la retire définitivement.
 *
 * Les deux existent parce qu'ils ne disent pas la même chose : un loyer qui
 * augmente se modifie, un abonnement résilié se désactive — la prévision cesse
 * de le compter mais on garde la trace de ce qu'il coûtait. La suppression est
 * pour les erreurs de saisie.
 */
export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { verifyCsrf } from '@/lib/server/auth';
import { requireAuth } from '@/lib/server/middleware';
import { makeRequestContext, withRequestContext } from '@/lib/server/observability/request-context';
import { log } from '@/lib/server/observability/log';
import { prisma } from '@/lib/server/prisma';
import { CLES_POSTES } from '@/lib/tresorerie';

const MONTANT_MAX = 100_000_000;

const modificationSchema = z
  .object({
    label: z.string().trim().min(1).max(120).optional(),
    category: z.enum(CLES_POSTES).optional(),
    amount: z.number().int().positive().max(MONTANT_MAX).optional(),
    dayOfMonth: z.number().int().min(1).max(28).optional(),
    active: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, 'Aucune modification fournie');

const SELECTION = {
  id: true,
  label: true,
  category: true,
  amount: true,
  dayOfMonth: true,
  active: true,
} as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const csrfFail = verifyCsrf(req);
    if (csrfFail) return csrfFail;

    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;

    let corps: unknown;
    try {
      corps = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'VALIDATION_FAILED', message: 'Corps de requête illisible' },
        { status: 400 },
      );
    }

    const parsed = modificationSchema.safeParse(corps);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'VALIDATION_FAILED',
          issues: parsed.error.issues.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 },
      );
    }

    const existante = await prisma.recurringCharge.findFirst({
      where: { id, userId: auth.user.sub },
      select: { id: true },
    });
    if (!existante) {
      return NextResponse.json(
        { error: 'CHARGE_NOT_FOUND', message: 'Charge introuvable.' },
        { status: 404 },
      );
    }

    const { label, category, amount, dayOfMonth, active } = parsed.data;

    // Étalement explicite plutôt qu'un `...parsed.data` : sous
    // `exactOptionalPropertyTypes`, une clé présente avec la valeur `undefined`
    // n'est pas le même type qu'une clé absente, et Prisma refuse la première.
    const charge = await prisma.recurringCharge.update({
      where: { id: existante.id },
      data: {
        ...(label === undefined ? {} : { label }),
        ...(category === undefined ? {} : { category }),
        ...(amount === undefined ? {} : { amount }),
        ...(dayOfMonth === undefined ? {} : { dayOfMonth }),
        ...(active === undefined ? {} : { active }),
      },
      select: SELECTION,
    });

    log.info('charge fixe modifiée', { chargeId: charge.id });
    return NextResponse.json({ charge });
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const csrfFail = verifyCsrf(req);
    if (csrfFail) return csrfFail;

    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;

    const existante = await prisma.recurringCharge.findFirst({
      where: { id, userId: auth.user.sub },
      select: { id: true },
    });
    if (!existante) {
      return NextResponse.json(
        { error: 'CHARGE_NOT_FOUND', message: 'Charge introuvable.' },
        { status: 404 },
      );
    }

    await prisma.recurringCharge.delete({ where: { id: existante.id } });

    log.info('charge fixe supprimée', { chargeId: id });
    return NextResponse.json({ supprime: true });
  });
}
