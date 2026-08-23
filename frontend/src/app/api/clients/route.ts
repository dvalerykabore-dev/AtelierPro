/**
 * GET  /api/clients — liste les clients de l'atelier connecté.
 * POST /api/clients — enregistre un nouveau client.
 *
 * Les clients sont cloisonnés par `userId` : un compte = un atelier. Aucune
 * requête ne lit ni n'écrit hors du périmètre de la session — le filtre n'est
 * jamais dérivé d'un paramètre fourni par le client.
 */
export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { verifyCsrf } from '@/lib/server/auth';
import { requireAuth } from '@/lib/server/middleware';
import { makeRequestContext, withRequestContext } from '@/lib/server/observability/request-context';
import { log } from '@/lib/server/observability/log';
import { prisma } from '@/lib/server/prisma';

/** Genres acceptés — miroir de la palette de mesures présentée à l'écran. */
const GENRES = ['FEMALE', 'MALE'] as const;

const creationSchema = z.object({
  name: z.string().trim().min(1, 'Le nom est requis').max(120),
  phone: z.string().trim().max(40).optional(),
  gender: z.enum(GENRES),
  loyal: z.boolean().optional(),
  notes: z.string().trim().max(2000).optional(),
});

/** Le projet formate ses erreurs de validation route par route (cf. signup). */
function formatIssues(err: z.ZodError) {
  return err.issues.map((e) => ({ path: e.path.join('.'), message: e.message }));
}

const SELECTION = {
  id: true,
  name: true,
  phone: true,
  gender: true,
  loyal: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function GET(req: NextRequest): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const clients = await prisma.customer.findMany({
      where: { userId: auth.user.sub },
      select: SELECTION,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ clients });
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const csrfFail = verifyCsrf(req);
    if (csrfFail) return csrfFail;

    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

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

    const { name, phone, gender, loyal, notes } = parsed.data;

    // `@@unique([userId, name])` : deux ateliers peuvent avoir un homonyme, un
    // même atelier non. On traduit la violation en message métier plutôt que
    // de laisser fuiter une erreur Prisma.
    const existant = await prisma.customer.findFirst({
      where: { userId: auth.user.sub, name },
      select: { id: true },
    });
    if (existant) {
      return NextResponse.json(
        { error: 'CUSTOMER_ALREADY_EXISTS', message: 'Un client porte déjà ce nom.' },
        { status: 409 },
      );
    }

    const client = await prisma.customer.create({
      data: {
        userId: auth.user.sub,
        name,
        gender,
        ...(phone ? { phone } : {}),
        ...(loyal === undefined ? {} : { loyal }),
        ...(notes ? { notes } : {}),
      },
      select: SELECTION,
    });

    log.info('client créé', { clientId: client.id });
    return NextResponse.json({ client }, { status: 201 });
  });
}
