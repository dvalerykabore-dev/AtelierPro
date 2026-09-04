/**
 * GET  /api/clients/[id]/mesures — dernier relevé du client.
 * POST /api/clients/[id]/mesures — enregistre un nouveau relevé.
 *
 * Les relevés sont versionnés : on n'écrase jamais l'ancien. Un client revient
 * six mois plus tard, sa morphologie a changé, et l'atelier doit pouvoir
 * comparer — d'où un `MeasurementSet` par passage plutôt qu'une mise à jour.
 *
 * La propriété est vérifiée en amont : le client doit appartenir à l'atelier de
 * la session. Sans cela, un identifiant deviné donnerait accès aux mesures d'un
 * autre atelier.
 */
export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { verifyCsrf } from '@/lib/server/auth';
import { estUrlStockage } from '@/lib/stockage';
import { requireAuth } from '@/lib/server/middleware';
import { makeRequestContext, withRequestContext } from '@/lib/server/observability/request-context';
import { log } from '@/lib/server/observability/log';
import { prisma } from '@/lib/server/prisma';

const GENRES = ['FEMALE', 'MALE'] as const;

const photoSchema = z.object({
  id: z.string().max(200),
  url: z.string().url().max(2000).refine(estUrlStockage, {
    message: 'Cette photo ne provient pas d’un envoi de l’application.',
  }),
  nomFichier: z.string().max(300).optional(),
});

const releveSchema = z.object({
  gender: z.enum(GENRES),
  /** Valeurs indexées `section::numero` — « Haut::9A ». */
  values: z.record(z.string().max(60), z.string().max(20)),
  notes: z.string().trim().max(2000).optional(),
  fabricPhotos: z.array(photoSchema).max(12).optional(),
  modelPhoto: z
    .string()
    .url()
    .max(2000)
    .refine(estUrlStockage, { message: 'Cette photo ne provient pas d’un envoi de l’application.' })
    .optional(),
});

function formatIssues(err: z.ZodError) {
  return err.issues.map((e) => ({ path: e.path.join('.'), message: e.message }));
}

const SELECTION = {
  id: true,
  gender: true,
  values: true,
  notes: true,
  fabricPhotos: true,
  modelPhoto: true,
  takenAt: true,
} as const;

/** Renvoie le client s'il appartient à l'atelier connecté, sinon `null`. */
async function clientDeLAtelier(clientId: string, userId: string) {
  return prisma.customer.findFirst({
    where: { id: clientId, userId },
    select: { id: true, name: true, gender: true },
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
    const client = await clientDeLAtelier(id, auth.user.sub);
    // 404 plutôt que 403 : un identifiant appartenant à un autre atelier ne
    // doit pas se distinguer d'un identifiant inexistant.
    if (!client) {
      return NextResponse.json({ error: 'CUSTOMER_NOT_FOUND' }, { status: 404 });
    }

    const releve = await prisma.measurementSet.findFirst({
      where: { customerId: id },
      orderBy: { takenAt: 'desc' },
      select: SELECTION,
    });

    return NextResponse.json({ releve });
  });
}

export async function POST(
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
    const client = await clientDeLAtelier(id, auth.user.sub);
    if (!client) {
      return NextResponse.json({ error: 'CUSTOMER_NOT_FOUND' }, { status: 404 });
    }

    let corps: unknown;
    try {
      corps = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'VALIDATION_FAILED', message: 'Corps de requête illisible' },
        { status: 400 },
      );
    }

    const parsed = releveSchema.safeParse(corps);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'VALIDATION_FAILED', issues: formatIssues(parsed.error) },
        { status: 400 },
      );
    }

    const { gender, values, notes, fabricPhotos, modelPhoto } = parsed.data;

    // Un relevé vide n'a pas de sens et masquerait le précédent dans la
    // consultation « dernier relevé ».
    const renseignees = Object.values(values).filter((v) => v.trim() !== '').length;
    if (renseignees === 0) {
      return NextResponse.json(
        { error: 'EMPTY_MEASUREMENT_SET', message: 'Aucune mesure renseignée.' },
        { status: 400 },
      );
    }

    const releve = await prisma.measurementSet.create({
      data: {
        customerId: id,
        gender,
        values,
        ...(notes ? { notes } : {}),
        ...(fabricPhotos?.length ? { fabricPhotos } : {}),
        ...(modelPhoto ? { modelPhoto } : {}),
      },
      select: SELECTION,
    });

    log.info('relevé de mesures enregistré', {
      clientId: id,
      releveId: releve.id,
      mesures: renseignees,
    });

    return NextResponse.json({ releve }, { status: 201 });
  });
}
