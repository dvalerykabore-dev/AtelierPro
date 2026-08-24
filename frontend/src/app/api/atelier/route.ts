/**
 * PATCH /api/atelier — nom commercial de l'atelier connecté.
 *
 * Il s'affichait en constante (« Atelier Koné ») sur le tableau de bord, les
 * rapports, la trésorerie et les dépenses, quel que soit le compte. Le rendre
 * lisible depuis le compte ne suffisait pas : sans moyen de l'écrire, il
 * serait resté vide pour tout le monde.
 */
export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { verifyCsrf } from '@/lib/server/auth';
import { requireAuth } from '@/lib/server/middleware';
import { makeRequestContext, withRequestContext } from '@/lib/server/observability/request-context';
import { log } from '@/lib/server/observability/log';
import { prisma } from '@/lib/server/prisma';

const schema = z.object({
  // Une chaîne vide efface le nom et fait revenir « Mon atelier » : c'est un
  // retrait volontaire, pas une erreur de saisie.
  workshopName: z.string().trim().max(120, 'Le nom ne peut pas dépasser 120 caractères'),
});

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const csrfFail = verifyCsrf(req);
    if (csrfFail) return csrfFail;

    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const corps = await req.json().catch(() => null);
    const parsed = schema.safeParse(corps);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'VALIDATION_FAILED',
          message: parsed.error.issues[0]?.message ?? 'Nom d’atelier invalide.',
        },
        { status: 400, headers: { 'x-request-id': ctx.requestId } },
      );
    }

    const nom = parsed.data.workshopName;
    const atelier = await prisma.user.update({
      where: { id: auth.user.sub },
      data: { workshopName: nom === '' ? null : nom },
      select: { workshopName: true },
    });

    log.info('nom d’atelier modifié', { renseigne: atelier.workshopName !== null });

    return NextResponse.json(
      { atelier },
      { status: 200, headers: { 'x-request-id': ctx.requestId } },
    );
  });
}
