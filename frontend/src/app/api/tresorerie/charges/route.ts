/**
 * GET  /api/tresorerie/charges — les charges fixes déclarées.
 * POST /api/tresorerie/charges — en déclare une.
 *
 * Ces lignes ne créent aucun mouvement de caisse. Elles servent uniquement à la
 * prévision : une charge qui s'écrirait toute seule ferait apparaître un loyer
 * payé alors qu'il ne l'est pas, et le solde cesserait de décrire l'argent
 * réellement disponible.
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
import { CLES_POSTES } from '@/lib/tresorerie';

const MONTANT_MAX = 100_000_000;

const creationSchema = z.object({
  label: z.string().trim().min(1, 'Le libellé est requis').max(120),
  category: z.enum(CLES_POSTES),
  amount: z.number().int().positive('Le montant doit être supérieur à zéro').max(MONTANT_MAX),
  // Borné à 28 : au-delà, février n'aurait pas d'échéance certaines années et
  // la prévision sauterait un mois sans prévenir.
  dayOfMonth: z.number().int().min(1).max(28).optional(),
});

function formatIssues(err: z.ZodError) {
  return err.issues.map((e) => ({ path: e.path.join('.'), message: e.message }));
}

const SELECTION = {
  id: true,
  label: true,
  category: true,
  amount: true,
  dayOfMonth: true,
  active: true,
} as const;

export async function GET(req: NextRequest): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const refus = await exigerCapacite(auth.user.sub, 'tresorerie');
    if (refus) return refus;

    const charges = await prisma.recurringCharge.findMany({
      where: { userId: auth.user.sub },
      select: SELECTION,
      orderBy: [{ active: 'desc' }, { dayOfMonth: 'asc' }, { label: 'asc' }],
    });

    return NextResponse.json({ charges });
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

    const { label, category, amount, dayOfMonth } = parsed.data;

    const charge = await prisma.recurringCharge.create({
      data: {
        userId: auth.user.sub,
        label,
        category,
        amount,
        ...(dayOfMonth === undefined ? {} : { dayOfMonth }),
      },
      select: SELECTION,
    });

    log.info('charge fixe déclarée', { chargeId: charge.id });
    return NextResponse.json({ charge }, { status: 201 });
  });
}
