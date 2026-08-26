/**
 * GET  /api/artisans — l'équipe de l'atelier, avec sa charge du jour.
 * POST /api/artisans — ajoute un artisan.
 *
 * Les initiales servent de clé de rapprochement : `TailoringOrder.assignee` et
 * `WorkshopTask.assignee` les stockent. La route les dérive du nom et les
 * désambiguïse, plutôt que de laisser l'utilisateur inventer un code qui
 * entrerait en collision sans qu'il comprenne pourquoi.
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

/** Bornes de capacité quotidienne — au-delà, c'est une erreur de saisie. */
const HEURES_MIN = 1;
const HEURES_MAX = 16;

const creationSchema = z.object({
  name: z.string().trim().min(1, 'Le nom est requis').max(120),
  role: z.string().trim().min(1, 'Le rôle est requis').max(60),
  dailyHours: z.number().int().min(HEURES_MIN).max(HEURES_MAX).optional(),
  phone: zTelephone.optional(),
});

function formatIssues(err: z.ZodError) {
  return err.issues.map((e) => ({ path: e.path.join('.'), message: e.message }));
}

/** « Moussa Koné » → « MK ». Un seul mot → ses deux premières lettres. */
function initialesDe(nom: string): string {
  const mots = nom.split(/\s+/).filter(Boolean);
  if (mots.length === 0) return '??';
  if (mots.length === 1) return (mots[0] ?? '').slice(0, 2).toUpperCase();
  return mots
    .slice(0, 2)
    .map((m) => m[0] ?? '')
    .join('')
    .toUpperCase();
}

/**
 * Rend les initiales uniques dans l'atelier. Deux « Moussa Koné » et
 * « Mariam Kaboré » donnent MK puis MK2 — laid mais sans ambiguïté, ce qui
 * vaut mieux qu'un refus que l'utilisateur ne saurait pas résoudre.
 */
function desambiguise(base: string, prises: Set<string>): string {
  if (!prises.has(base)) return base;
  for (let n = 2; n < 100; n++) {
    const essai = `${base}${n}`;
    if (!prises.has(essai)) return essai;
  }
  return `${base}${Date.now() % 100}`;
}

/** Minuit UTC du jour courant — même repère que `WorkshopTask.day` (`@db.Date`). */
function aujourdhuiUtc(): Date {
  const n = new Date();
  return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()));
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

export async function GET(req: NextRequest): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const [artisans, chargeDuJour] = await Promise.all([
      prisma.artisan.findMany({
        where: { userId: auth.user.sub },
        select: SELECTION,
        orderBy: [{ active: 'desc' }, { name: 'asc' }],
      }),
      // La charge n'est pas stockée sur l'artisan : elle se déduit des tâches
      // du jour. Un compteur dénormalisé finirait par mentir dès qu'une tâche
      // serait créée ou supprimée ailleurs.
      prisma.workshopTask.groupBy({
        by: ['assignee'],
        where: { userId: auth.user.sub, day: aujourdhuiUtc() },
        _sum: { hours: true },
      }),
    ]);

    const heuresPar = new Map(chargeDuJour.map((c) => [c.assignee, c._sum.hours ?? 0]));

    return NextResponse.json({
      artisans: artisans.map((a) => ({
        ...a,
        heuresAujourdhui: heuresPar.get(a.initials) ?? 0,
      })),
    });
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

    const { name, role, dailyHours, phone } = parsed.data;

    const existants = await prisma.artisan.findMany({
      where: { userId: auth.user.sub },
      select: { name: true, initials: true },
    });

    if (existants.some((a) => a.name.toLowerCase() === name.toLowerCase())) {
      return NextResponse.json(
        { error: 'ARTISAN_ALREADY_EXISTS', message: 'Un artisan porte déjà ce nom.' },
        { status: 409 },
      );
    }

    const initials = desambiguise(initialesDe(name), new Set(existants.map((a) => a.initials)));

    const artisan = await prisma.artisan.create({
      data: {
        userId: auth.user.sub,
        name,
        role,
        initials,
        ...(dailyHours === undefined ? {} : { dailyHours }),
        ...(phone ? { phone } : {}),
      },
      select: SELECTION,
    });

    log.info('artisan ajouté', { artisanId: artisan.id });
    return NextResponse.json({ artisan: { ...artisan, heuresAujourdhui: 0 } }, { status: 201 });
  });
}
