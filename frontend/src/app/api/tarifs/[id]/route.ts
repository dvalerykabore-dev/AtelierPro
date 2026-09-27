/**
 * PATCH  /api/tarifs/[id] — modifie une ligne de la grille.
 * DELETE /api/tarifs/[id] — la retire.
 *
 * Les deux passent par `updateMany` / `deleteMany` filtrés sur `userId` plutôt
 * que par `update({ where: { id } })` : un identifiant appartenant à un autre
 * atelier ne doit pas être modifiable, et la forme filtrée rend l'oubli
 * impossible plutôt que seulement improbable.
 */
export const runtime = 'nodejs';

import { Prisma } from '@prisma/client';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { verifyCsrf } from '@/lib/server/auth';
import { requireAuth } from '@/lib/server/middleware';
import { makeRequestContext, withRequestContext } from '@/lib/server/observability/request-context';
import { prisma } from '@/lib/server/prisma';
import { SELECTION_TARIF } from '../route';

const UNITES = ['façon', 'tout compris'] as const;

const modificationSchema = z
  .object({
    garment: z.string().trim().min(1).max(160).optional(),
    price: z.number().int().nonnegative().max(100_000_000).optional(),
    unit: z.enum(UNITES).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'Aucun champ à modifier.' });

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const csrf = verifyCsrf(req);
    if (csrf) return csrf;

    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;

    let brut: unknown;
    try {
      brut = await req.json();
    } catch {
      return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 });
    }

    const parsed = modificationSchema.safeParse(brut);
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

    try {
      // `exactOptionalPropertyTypes` : passer `{ garment: undefined }` n'est pas
      // la même chose que ne pas passer la clé. On ne compose que les champs
      // réellement fournis, sinon Prisma reçoit une écriture vers `undefined`.
      const { garment, price, unit } = parsed.data;
      const { count } = await prisma.priceItem.updateMany({
        where: { id, userId: auth.user.sub },
        data: {
          ...(garment === undefined ? {} : { garment }),
          ...(price === undefined ? {} : { price }),
          ...(unit === undefined ? {} : { unit }),
        },
      });
      if (count === 0) {
        return NextResponse.json({ error: 'TARIF_NOT_FOUND' }, { status: 404 });
      }
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        return NextResponse.json(
          { error: 'TARIF_ALREADY_EXISTS', message: 'Cette tenue figure déjà dans la grille.' },
          { status: 409 },
        );
      }
      throw err;
    }

    const tarif = await prisma.priceItem.findUnique({ where: { id }, select: SELECTION_TARIF });
    return NextResponse.json({ tarif });
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const csrf = verifyCsrf(req);
    if (csrf) return csrf;

    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;

    // Retirer un tarif ne touche à aucune commande : le prix a été recopié sur
    // la commande au moment de la prise, il ne s'y lit pas par référence. Une
    // commande passée garde donc son montant même si la grille change ensuite.
    const { count } = await prisma.priceItem.deleteMany({
      where: { id, userId: auth.user.sub },
    });
    if (count === 0) {
      return NextResponse.json({ error: 'TARIF_NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json({ supprime: true });
  });
}
