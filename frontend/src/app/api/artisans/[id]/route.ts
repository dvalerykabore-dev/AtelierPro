/**
 * PATCH /api/artisans/[id] — modifie un artisan (activation, rôle, capacité).
 *
 * Pas de DELETE : un artisan qui quitte l'atelier est désactivé. Ses commandes
 * et ses tâches passées le référencent par ses initiales, et un rapport d'il y
 * a six mois doit rester lisible. `active: false` le retire des listes de choix
 * sans effacer l'histoire.
 *
 * Les initiales ne sont pas modifiables ici : elles sont la clé de
 * rapprochement des commandes et des tâches, les changer orphelinerait tout
 * le travail déjà assigné.
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

const HEURES_MIN = 1;
const HEURES_MAX = 16;

const majSchema = z
  .object({
    role: z.string().trim().min(1).max(60).optional(),
    dailyHours: z.number().int().min(HEURES_MIN).max(HEURES_MAX).optional(),
    active: z.boolean().optional(),
    phone: zTelephone.optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: 'Aucune modification fournie' });

function formatIssues(err: z.ZodError) {
  return err.issues.map((e) => ({ path: e.path.join('.'), message: e.message }));
}

const SELECTION = {
  id: true,
  name: true,
  role: true,
  initials: true,
  dailyHours: true,
  active: true,
  phone: true,
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

    const parsed = majSchema.safeParse(corps);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'VALIDATION_FAILED', issues: formatIssues(parsed.error) },
        { status: 400 },
      );
    }

    // Le filtre porte sur `userId` autant que sur l'identifiant : 404 plutôt
    // que 403 pour un artisan d'un autre atelier, afin de ne pas confirmer
    // son existence.
    const cible = await prisma.artisan.findFirst({
      where: { id, userId: auth.user.sub },
      select: { id: true },
    });
    if (!cible) {
      return NextResponse.json(
        { error: 'ARTISAN_NOT_FOUND', message: 'Artisan introuvable.' },
        { status: 404 },
      );
    }

    // Les champs sont recomposés un par un plutôt que par étalement de
    // `parsed.data` : sous `exactOptionalPropertyTypes`, une clé présente et
    // valant `undefined` n'est pas la même chose qu'une clé absente, et Prisma
    // n'accepte que la seconde.
    const { role, dailyHours, active, phone } = parsed.data;
    const artisan = await prisma.artisan.update({
      where: { id: cible.id },
      data: {
        ...(role === undefined ? {} : { role }),
        ...(dailyHours === undefined ? {} : { dailyHours }),
        ...(active === undefined ? {} : { active }),
        // Une chaine vide efface le numero : c est un retrait volontaire.
        ...(phone === undefined ? {} : { phone: phone === '' ? null : phone }),
      },
      select: SELECTION,
    });

    log.info('artisan modifié', { artisanId: artisan.id });
    return NextResponse.json({ artisan });
  });
}
