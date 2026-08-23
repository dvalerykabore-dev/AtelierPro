/**
 * GET /api/rapports — indicateurs de l'atelier, calculés depuis les commandes.
 *
 * Aucun modèle dédié : tout se dérive de `TailoringOrder`. Un tableau de bord
 * qui stocke ses propres totaux finit toujours par diverger de la source.
 *
 * L'agrégation se fait en mémoire après une seule lecture. C'est délibéré à
 * cette échelle — un atelier compte des centaines de commandes par an, pas des
 * millions. Au-delà, il faudra passer à des `groupBy` SQL et un cache.
 */
export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';

import { requireAuth } from '@/lib/server/middleware';
import { makeRequestContext, withRequestContext } from '@/lib/server/observability/request-context';
import { prisma } from '@/lib/server/prisma';

/** Nombre de mois affichés dans l'histogramme du chiffre d'affaires. */
const MOIS_HISTORIQUE = 6;

const MOIS_COURTS = [
  'Jan',
  'Fév',
  'Mar',
  'Avr',
  'Mai',
  'Juin',
  'Juil',
  'Août',
  'Sep',
  'Oct',
  'Nov',
  'Déc',
];

interface CommandeAgregat {
  garment: string;
  status: string;
  priceAmount: number;
  depositAmount: number;
  assignee: string | null;
  dueDate: Date | null;
  createdAt: Date;
  deliveredAt: Date | null;
}

/** Clé « année-mois » pour regrouper sans dépendre du fuseau d'affichage. */
function cleMois(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function chiffreAffairesMensuel(commandes: CommandeAgregat[]) {
  const maintenant = new Date();
  const mois: { label: string; chiffreAffaires: number; commandes: number; courant: boolean }[] =
    [];

  for (let recul = MOIS_HISTORIQUE - 1; recul >= 0; recul--) {
    const date = new Date(maintenant.getFullYear(), maintenant.getMonth() - recul, 1);
    const cle = cleMois(date);
    const duMois = commandes.filter((c) => cleMois(c.createdAt) === cle);

    mois.push({
      label: MOIS_COURTS[date.getMonth()] ?? '?',
      chiffreAffaires: duMois.reduce((s, c) => s + c.priceAmount, 0),
      commandes: duMois.length,
      courant: recul === 0,
    });
  }

  return mois;
}

function tenuesPopulaires(commandes: CommandeAgregat[]) {
  const parTenue = new Map<string, number>();
  for (const c of commandes) parTenue.set(c.garment, (parTenue.get(c.garment) ?? 0) + 1);

  const classees = [...parTenue.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maximum = classees[0]?.[1] ?? 1;

  return classees.map(([label, nombre]) => ({
    label,
    nombre,
    // Part relative à la tenue la plus commandée : c'est ce que la barre montre.
    pourcentage: Math.round((nombre / maximum) * 100),
  }));
}

function performancesArtisans(commandes: CommandeAgregat[]) {
  const parArtisan = new Map<string, { commandes: number; chiffreAffaires: number }>();

  for (const c of commandes) {
    // Une commande non assignée ne doit pas gonfler le total d'un artisan.
    if (!c.assignee) continue;
    const actuel = parArtisan.get(c.assignee) ?? { commandes: 0, chiffreAffaires: 0 };
    actuel.commandes += 1;
    actuel.chiffreAffaires += c.priceAmount;
    parArtisan.set(c.assignee, actuel);
  }

  return [...parArtisan.entries()]
    .map(([initiales, v]) => ({ initiales, ...v }))
    .sort((a, b) => b.chiffreAffaires - a.chiffreAffaires);
}

function repartitionPaiements(commandes: CommandeAgregat[]) {
  let integral = 0;
  let acompte = 0;
  let impaye = 0;

  for (const c of commandes) {
    if (c.depositAmount >= c.priceAmount && c.priceAmount > 0) integral += 1;
    else if (c.depositAmount > 0) acompte += 1;
    else impaye += 1;
  }

  const total = commandes.length || 1;
  const part = (n: number) => Math.round((n / total) * 100);

  return [
    { label: 'Payé intégral', nombre: integral, pourcentage: part(integral) },
    { label: 'Acompte versé', nombre: acompte, pourcentage: part(acompte) },
    { label: 'Non payé', nombre: impaye, pourcentage: part(impaye) },
  ];
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const ctx = makeRequestContext(req.headers);
  return withRequestContext(ctx, async () => {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const commandes: CommandeAgregat[] = await prisma.tailoringOrder.findMany({
      where: { userId: auth.user.sub },
      select: {
        garment: true,
        status: true,
        priceAmount: true,
        depositAmount: true,
        assignee: true,
        dueDate: true,
        createdAt: true,
        deliveredAt: true,
      },
    });

    const maintenant = new Date();
    const cleCourante = cleMois(maintenant);
    const duMoisCourant = commandes.filter((c) => cleMois(c.createdAt) === cleCourante);
    const livrees = commandes.filter((c) => c.status === 'DELIVERED');

    // Ponctualité : seules les commandes livrées ET dotées d'une échéance sont
    // jugeables. Compter les autres comme « à temps » flatterait le chiffre.
    const jugeables = livrees.filter((c) => c.dueDate && c.deliveredAt);
    const aLHeure = jugeables.filter((c) => c.deliveredAt! <= c.dueDate!).length;

    const delais = livrees
      .filter((c) => c.deliveredAt)
      .map((c) => (c.deliveredAt!.getTime() - c.createdAt.getTime()) / 86_400_000);
    const delaiMoyen = delais.length
      ? Math.round((delais.reduce((s, d) => s + d, 0) / delais.length) * 10) / 10
      : null;

    return NextResponse.json({
      indicateurs: {
        chiffreAffairesMois: duMoisCourant.reduce((s, c) => s + c.priceAmount, 0),
        commandesLivrees: livrees.length,
        // `null` plutôt que 0 quand rien n'est mesurable : un « 0 % » laisserait
        // croire à une contre-performance là où il n'y a pas encore de données.
        tauxPonctualite: jugeables.length ? Math.round((aLHeure / jugeables.length) * 100) : null,
        delaiMoyenJours: delaiMoyen,
        totalCommandes: commandes.length,
      },
      chiffreAffairesMensuel: chiffreAffairesMensuel(commandes),
      tenuesPopulaires: tenuesPopulaires(commandes),
      performancesArtisans: performancesArtisans(commandes),
      repartitionPaiements: repartitionPaiements(commandes),
    });
  });
}
