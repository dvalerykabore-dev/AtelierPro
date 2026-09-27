/**
 * PATCH /api/commandes/[id] — fait avancer une commande de couture.
 *
 * Seul le statut est modifiable ici. C'est la seule mutation dont l'atelier
 * avait besoin et qui n'existait pas : jusqu'ici une commande naissait
 * « En cours » et ne pouvait plus jamais bouger, ce qui rendait muet le bouton
 * « Valider essayage » de la fiche.
 *
 * Les corrections de montant, d'échéance ou de tissu passeront par un autre
 * verbe le jour où l'écran les proposera — les ajouter d'avance, c'est ouvrir
 * une surface d'écriture que rien n'appelle.
 */
export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { verifyCsrf } from '@/lib/server/auth';
import { requireAuth } from '@/lib/server/middleware';
import { makeRequestContext, withRequestContext } from '@/lib/server/observability/request-context';
import { log } from '@/lib/server/observability/log';
import { prisma } from '@/lib/server/prisma';

const STATUTS = ['IN_PROGRESS', 'FITTING', 'DELIVERY', 'LATE', 'DELIVERED'] as const;

const schemaModification = z.object({
  status: z.enum(STATUTS),
});

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

    const corps = await req.json().catch(() => null);
    const parsed = schemaModification.safeParse(corps);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'VALIDATION_FAILED',
          message: 'Statut de commande invalide.',
          issues: parsed.error.issues.map((e) => ({ path: e.path.join('.'), message: e.message })),
        },
        { status: 400, headers: { 'x-request-id': ctx.requestId } },
      );
    }

    // La commande d'un autre atelier répond 404, jamais 403 : un 403 confirmerait
    // qu'elle existe.
    const existante = await prisma.tailoringOrder.findFirst({
      where: { id, userId: auth.user.sub },
      select: { id: true, status: true },
    });
    if (!existante) {
      return NextResponse.json(
        { error: 'ORDER_NOT_FOUND' },
        { status: 404, headers: { 'x-request-id': ctx.requestId } },
      );
    }

    const statut = parsed.data.status;

    // `deliveredAt` suit le statut dans les deux sens : une commande sortie de
    // « livrée » par correction d'erreur ne doit pas garder sa date de
    // livraison, sinon les rapports comptent une livraison qui n'a pas eu lieu.
    const commande = await prisma.tailoringOrder.update({
      where: { id: existante.id },
      data: {
        status: statut,
        deliveredAt: statut === 'DELIVERED' ? new Date() : null,
      },
      select: SELECTION,
    });

    log.info('statut de commande modifié', {
      commandeId: commande.id,
      avant: existante.status,
      apres: statut,
    });

    return NextResponse.json(
      { commande },
      { status: 200, headers: { 'x-request-id': ctx.requestId } },
    );
  });
}
