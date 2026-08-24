/**
 * DELETE /api/tresorerie/mouvements/[id] — annule une écriture.
 *
 * Pas de modification : une ligne de caisse fausse se supprime et se ressaisit.
 * Un `PATCH` sur un montant déjà rapproché d'une commande obligerait à rejouer
 * le contrôle de dépassement dans les deux sens pour un gain nul — la saisie
 * prend cinq secondes.
 */
export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';

import { verifyCsrf } from '@/lib/server/auth';
import { requireAuth } from '@/lib/server/middleware';
import { makeRequestContext, withRequestContext } from '@/lib/server/observability/request-context';
import { log } from '@/lib/server/observability/log';
import { prisma } from '@/lib/server/prisma';
import { recalerAcompte } from '@/lib/server/tresorerie/journal';

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

    const resultat = await prisma.$transaction(async (tx) => {
      // Le filtre porte sur `userId` autant que sur l'identifiant : sans lui,
      // connaître un cuid suffirait à supprimer l'écriture d'un autre atelier.
      const mouvement = await tx.cashMovement.findFirst({
        where: { id, userId: auth.user.sub },
        select: { id: true, tailoringOrderId: true },
      });
      if (!mouvement) return null;

      await tx.cashMovement.delete({ where: { id: mouvement.id } });

      // La commande doit suivre dans la même transaction, sinon son acompte
      // continuerait d'annoncer un encaissement qui n'existe plus.
      if (mouvement.tailoringOrderId) {
        await recalerAcompte(tx, mouvement.tailoringOrderId);
      }
      return mouvement;
    });

    if (!resultat) {
      return NextResponse.json(
        { error: 'MOVEMENT_NOT_FOUND', message: 'Écriture introuvable.' },
        { status: 404 },
      );
    }

    log.info('mouvement de caisse supprimé', { mouvementId: id });
    return NextResponse.json({ supprime: true });
  });
}
