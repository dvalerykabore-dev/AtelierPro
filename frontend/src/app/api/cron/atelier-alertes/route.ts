export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { verifyCronSecret } from '@/lib/server/cron/auth';
import { withLease } from '@/lib/server/leader-lease';
import { signalerEcheances } from '@/lib/server/atelier/alertes';
import { prisma } from '@/lib/server/prisma';
import { redis } from '@/lib/server/redis';
import { createLogger } from '@/lib/server/logger';
import { makeRequestContext, withRequestContext } from '@/lib/server/observability/request-context';

const log = createLogger();
const LEASE_TTL_MS = 60_000; // ~2 × maxDuration

/**
 * Alertes d'échéance de l'atelier — une fois par jour.
 *
 * Passe à 6h UTC : l'atelier ouvre avec ses retards de la veille déjà posés,
 * plutôt que de les découvrir en fin de journée. Le bail Redis évite qu'un
 * déploiement multi-instance envoie l'alerte en double — la clé de
 * déduplication la rattraperait, mais autant ne pas écrire pour rien.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const fail = verifyCronSecret(req);
  if (fail) return fail;

  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    let resultat = { retards: 0, livraisons: 0, marqueesEnRetard: 0 };

    await withLease(redis ?? undefined, 'atelier-alertes', LEASE_TTL_MS, async () => {
      resultat = await signalerEcheances({ prisma });
      log.info('atelier-alertes tick', { ...resultat, requestId: ctx.requestId });
    });

    return NextResponse.json(
      { ok: true, ...resultat },
      { headers: { 'x-request-id': ctx.requestId } },
    );
  });
}
