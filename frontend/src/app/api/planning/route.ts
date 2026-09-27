/**
 * GET  /api/planning?debut=YYYY-MM-DD — tâches de la semaine ouvrée.
 * POST /api/planning — affecte une tâche à un artisan pour un jour donné.
 *
 * Le planning est cloisonné par `userId`, comme le reste de l'atelier.
 *
 * Les tâches sont datées au jour (`@db.Date`), pas indexées sur une colonne de
 * grille : la maquette Banani numérotait les jours de 0 à 5, ce qui rendait le
 * planning faux dès le lundi suivant. La grille se reconstruit ici depuis la
 * date, et non l'inverse.
 */
export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { verifyCsrf } from '@/lib/server/auth';
import { requireAuth } from '@/lib/server/middleware';
import { exigerCapacite } from '@/lib/server/plans';
import { makeRequestContext, withRequestContext } from '@/lib/server/observability/request-context';
import { log } from '@/lib/server/observability/log';
import { prisma } from '@/lib/server/prisma';

/** Statuts de tâche — miroir exact des pastilles de la légende à l'écran. */
const STATUTS = ['DONE', 'IN_PROGRESS', 'FITTING', 'PLANNED', 'BLOCKED'] as const;

/** Journées ouvrées affichées : du lundi au samedi, l'atelier ferme le dimanche. */
export const JOURS_OUVRES = 6;

/** Heures ouvrables par artisan et par jour. */
const HEURES_PAR_JOUR = 8;

const jourSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date attendue au format AAAA-MM-JJ');

const creationSchema = z.object({
  assignee: z.string().trim().min(1, "L'artisan est requis").max(10),
  day: jourSchema,
  hours: z.number().int().min(1).max(HEURES_PAR_JOUR),
  label: z.string().trim().min(1, 'Un intitulé est requis').max(160),
  status: z.enum(STATUTS).optional(),
});

function formatIssues(err: z.ZodError) {
  return err.issues.map((e) => ({ path: e.path.join('.'), message: e.message }));
}

/**
 * Construit une date UTC à minuit depuis « AAAA-MM-JJ ».
 *
 * `new Date('2026-08-21')` donne déjà minuit UTC, mais passer par les
 * composantes rend l'intention explicite : la colonne est un `DATE`, aucune
 * heure locale ne doit s'y glisser et décaler la tâche d'une case.
 */
function jourUtc(iso: string): Date {
  const [a, m, j] = iso.split('-').map(Number);
  return new Date(Date.UTC(a ?? 0, (m ?? 1) - 1, j ?? 1));
}

/** Lundi de la semaine contenant `date`, en UTC. */
function lundiDe(date: Date): Date {
  const jour = date.getUTCDay(); // 0 = dimanche
  // Dimanche appartient à la semaine qui s'achève : on recule de 6, pas de -1.
  const recul = jour === 0 ? 6 : jour - 1;
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - recul));
}

function ajouteJours(date: Date, n: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + n));
}

function enIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const SELECTION = {
  id: true,
  assignee: true,
  day: true,
  hours: true,
  label: true,
  status: true,
} as const;

export async function GET(req: NextRequest): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const refus = await exigerCapacite(auth.user.sub, 'planning');
    if (refus) return refus;

    // Un paramètre illisible ne mérite pas un 400 : la semaine courante est un
    // repli sûr et l'écran reste utilisable.
    const demande = req.nextUrl.searchParams.get('debut');
    const reference =
      demande && jourSchema.safeParse(demande).success ? jourUtc(demande) : new Date();
    const lundi = lundiDe(reference);
    const finExclue = ajouteJours(lundi, JOURS_OUVRES);

    const taches = await prisma.workshopTask.findMany({
      where: { userId: auth.user.sub, day: { gte: lundi, lt: finExclue } },
      select: SELECTION,
      orderBy: [{ day: 'asc' }, { createdAt: 'asc' }],
    });

    const aujourdhui = enIso(new Date());

    return NextResponse.json({
      // La semaine est renvoyée par le serveur pour que la grille et les tâches
      // proviennent de la même horloge — un navigateur mal réglé décalerait la
      // colonne « aujourd'hui » sans que rien ne le signale.
      semaine: Array.from({ length: JOURS_OUVRES }, (_, i) => {
        const jour = ajouteJours(lundi, i);
        const iso = enIso(jour);
        return { iso, aujourdhui: iso === aujourdhui };
      }),
      taches: taches.map((t) => ({ ...t, day: enIso(t.day) })),
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

    const refus = await exigerCapacite(auth.user.sub, 'planning');
    if (refus) return refus;

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

    const { assignee, day, hours, label, status } = parsed.data;
    const jour = jourUtc(day);

    // Garde-fou métier : la capacité est celle de l'artisan, pas une constante.
    // Un apprenti à 6 h ne doit pas se voir imposer la journée d'un senior.
    // Refuser la surcharge ici plutôt qu'à l'écran, sinon deux onglets ouverts
    // la contournent.
    const [artisan, engagees] = await Promise.all([
      prisma.artisan.findFirst({
        where: { userId: auth.user.sub, initials: assignee },
        select: { dailyHours: true, active: true },
      }),
      prisma.workshopTask.aggregate({
        where: { userId: auth.user.sub, assignee, day: jour },
        _sum: { hours: true },
      }),
    ]);

    // Un artisan désactivé ne reçoit plus de travail — sinon le planning
    // continuerait de charger quelqu'un qui a quitté l'atelier.
    if (artisan && !artisan.active) {
      return NextResponse.json(
        {
          error: 'ARTISAN_INACTIVE',
          message: `${assignee} ne fait plus partie de l’équipe active.`,
        },
        { status: 409 },
      );
    }

    // Artisan inconnu : on retient le plafond par défaut plutôt que de refuser.
    // Des tâches ont pu être créées avant que l'équipe ne soit constituée.
    const capacite = artisan?.dailyHours ?? HEURES_PAR_JOUR;
    const dejaPrises = engagees._sum.hours ?? 0;
    if (dejaPrises + hours > capacite) {
      return NextResponse.json(
        {
          error: 'DAY_CAPACITY_EXCEEDED',
          message: `${assignee} a déjà ${dejaPrises} h engagées ce jour-là (${capacite} h maximum).`,
        },
        { status: 409 },
      );
    }

    const tache = await prisma.workshopTask.create({
      data: {
        userId: auth.user.sub,
        assignee,
        day: jour,
        hours,
        label,
        ...(status ? { status } : {}),
      },
      select: SELECTION,
    });

    log.info('tâche planifiée', { tacheId: tache.id });
    return NextResponse.json({ tache: { ...tache, day: enIso(tache.day) } }, { status: 201 });
  });
}
