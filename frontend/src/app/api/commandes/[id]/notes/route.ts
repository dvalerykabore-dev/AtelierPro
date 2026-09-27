/**
 * GET  /api/commandes/[id]/notes — journal des notes d'une commande.
 * POST /api/commandes/[id]/notes — ajoute une note.
 *
 * Les notes vivaient dans l'état du composant : un artisan écrivait « manches
 * plus courtes », fermait l'onglet, et l'information n'existait plus — après
 * que le formulaire eut confirmé l'enregistrement.
 */
export const runtime = 'nodejs';

import { Prisma } from '@prisma/client';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { verifyCsrf } from '@/lib/server/auth';
import { requireAuth } from '@/lib/server/middleware';
import { makeRequestContext, withRequestContext } from '@/lib/server/observability/request-context';
import { prisma } from '@/lib/server/prisma';

const creationSchema = z.object({
  body: z.string().trim().min(1, 'La note est vide').max(2000),
});

const SELECTION_NOTE = {
  id: true,
  author: true,
  body: true,
  createdAt: true,
} satisfies Prisma.OrderNoteSelect;

/**
 * La commande appartient-elle à l'atelier connecté ?
 *
 * Renvoie `null` sinon — les appelants répondent alors 404 et non 403 : dire
 * « interdit » confirmerait que la commande existe, ce qu'un atelier n'a pas à
 * apprendre sur un autre.
 */
async function commandeDeLAtelier(id: string, userId: string) {
  return prisma.tailoringOrder.findFirst({
    where: { id, userId },
    select: { id: true },
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const commande = await commandeDeLAtelier(id, auth.user.sub);
    if (!commande) return NextResponse.json({ error: 'ORDER_NOT_FOUND' }, { status: 404 });

    const notes = await prisma.orderNote.findMany({
      where: { tailoringOrderId: id },
      select: SELECTION_NOTE,
      // La plus récente en tête : sur une commande en cours, c'est la dernière
      // consigne qui vaut.
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ notes });
  });
}

export async function POST(
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
    const commande = await commandeDeLAtelier(id, auth.user.sub);
    if (!commande) return NextResponse.json({ error: 'ORDER_NOT_FOUND' }, { status: 404 });

    let brut: unknown;
    try {
      brut = await req.json();
    } catch {
      return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 });
    }

    const parsed = creationSchema.safeParse(brut);
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

    // L'auteur est figé à l'écriture : renommer l'atelier plus tard ne doit pas
    // réattribuer ses anciennes notes. À défaut de nom, la partie locale de
    // l'adresse — jamais l'adresse entière, qui s'exposerait à qui regarde
    // par-dessus l'épaule, en atelier.
    const compte = await prisma.user.findUnique({
      where: { id: auth.user.sub },
      select: { workshopName: true, email: true },
    });
    const auteur = compte?.workshopName?.trim() || (compte?.email ?? '').split('@')[0] || 'Atelier';

    const note = await prisma.orderNote.create({
      data: {
        userId: auth.user.sub,
        tailoringOrderId: id,
        author: auteur,
        body: parsed.data.body,
      },
      select: SELECTION_NOTE,
    });

    return NextResponse.json({ note }, { status: 201 });
  });
}
