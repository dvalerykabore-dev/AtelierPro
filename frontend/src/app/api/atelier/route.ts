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
import { zTelephone } from '@/lib/server/telephone';

const schema = z
  .object({
    // Une chaîne vide efface le nom et fait revenir « Mon atelier » : c'est un
    // retrait volontaire, pas une erreur de saisie.
    workshopName: z
      .string()
      .trim()
      .max(120, 'Le nom ne peut pas dépasser 120 caractères')
      .optional(),
    // Idem : vider le champ retire le numéro.
    phone: zTelephone.optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: 'Aucune modification fournie' });

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

    // Recomposé champ par champ : sous `exactOptionalPropertyTypes`, une clé
    // présente valant `undefined` n'est pas une clé absente, et Prisma
    // n'accepte que la seconde. Un PATCH qui ne porte que le téléphone ne doit
    // surtout pas effacer le nom au passage.
    const { workshopName: nom, phone } = parsed.data;
    const atelier = await prisma.user.update({
      where: { id: auth.user.sub },
      data: {
        ...(nom === undefined ? {} : { workshopName: nom === '' ? null : nom }),
        ...(phone === undefined ? {} : { phone: phone === '' ? null : phone }),
      },
      select: { workshopName: true, phone: true },
    });

    log.info('informations d’atelier modifiées', {
      nomRenseigne: atelier.workshopName !== null,
      telephoneRenseigne: atelier.phone !== null,
    });

    return NextResponse.json(
      { atelier },
      { status: 200, headers: { 'x-request-id': ctx.requestId } },
    );
  });
}
