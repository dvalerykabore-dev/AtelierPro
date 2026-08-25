/**
 * GET  /api/tarifs — grille tarifaire de l'atelier connecté.
 * POST /api/tarifs — ajoute une ligne à la grille.
 *
 * La grille était une constante partagée : tous les ateliers facturaient les
 * mêmes prix, et toute modification disparaissait au rechargement — y compris
 * celles déjà utilisées pour chiffrer une commande.
 */
export const runtime = 'nodejs';

import { Prisma } from '@prisma/client';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { verifyCsrf } from '@/lib/server/auth';
import { requireAuth } from '@/lib/server/middleware';
import { makeRequestContext, withRequestContext } from '@/lib/server/observability/request-context';
import { prisma } from '@/lib/server/prisma';

/**
 * Ce que le prix couvre. « Façon » quand le client apporte son tissu, « tout
 * compris » quand l'atelier le fournit : la distinction change le montant du
 * simple au double, elle ne peut pas rester implicite.
 */
const UNITES = ['façon', 'tout compris'] as const;

const creationSchema = z.object({
  garment: z.string().trim().min(1, 'Le type de tenue est requis').max(160),
  // Entier : le franc CFA n'a pas de décimales (invariant du CLAUDE.md).
  price: z.number().int().nonnegative().max(100_000_000),
  unit: z.enum(UNITES).optional(),
});

export const SELECTION_TARIF = {
  id: true,
  garment: true,
  price: true,
  unit: true,
} satisfies Prisma.PriceItemSelect;

function formatIssues(err: z.ZodError) {
  return err.issues.map((e) => ({ path: e.path.join('.'), message: e.message }));
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const tarifs = await prisma.priceItem.findMany({
      where: { userId: auth.user.sub },
      select: SELECTION_TARIF,
      orderBy: { garment: 'asc' },
    });

    return NextResponse.json({ tarifs });
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const csrf = verifyCsrf(req);
    if (csrf) return csrf;

    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    let brut: unknown;
    try {
      brut = await req.json();
    } catch {
      return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 });
    }

    const parsed = creationSchema.safeParse(brut);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'VALIDATION_FAILED', issues: formatIssues(parsed.error) },
        { status: 400 },
      );
    }

    try {
      const tarif = await prisma.priceItem.create({
        data: {
          userId: auth.user.sub,
          garment: parsed.data.garment,
          price: parsed.data.price,
          ...(parsed.data.unit ? { unit: parsed.data.unit } : {}),
        },
        select: SELECTION_TARIF,
      });
      return NextResponse.json({ tarif }, { status: 201 });
    } catch (err) {
      // `@@unique([userId, garment])` : deux lignes au même nom rendraient le
      // choix ambigu dans le formulaire de commande.
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        return NextResponse.json(
          { error: 'TARIF_ALREADY_EXISTS', message: 'Cette tenue figure déjà dans la grille.' },
          { status: 409 },
        );
      }
      throw err;
    }
  });
}
