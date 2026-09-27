/**
 * PATCH /api/atelier — informations de l'atelier connecté.
 *
 * Elles s'affichaient en constantes (« Atelier Koné », « Ouagadougou »,
 * « Secteur 15, rue 15.42 », « 08h00 — 18h00 ») sur le tableau de bord, les
 * rapports, la trésorerie et les réglages, quel que soit le compte. Les rendre
 * lisibles depuis le compte ne suffisait pas : sans moyen de les écrire, elles
 * seraient restées vides pour tout le monde.
 *
 * Partout ici, la chaîne vide vaut effacement — un retrait volontaire, pas une
 * erreur de saisie. La clé absente, elle, ne touche à rien.
 */
export const runtime = 'nodejs';

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { verifyCsrf } from '@/lib/server/auth';
import { validerHoraires } from '@/lib/horaires';
import { validerLogo } from '@/lib/logo-atelier';
import { requireAuth } from '@/lib/server/middleware';
import { makeRequestContext, withRequestContext } from '@/lib/server/observability/request-context';
import { log } from '@/lib/server/observability/log';
import { prisma } from '@/lib/server/prisma';
import { zTelephone } from '@/lib/server/telephone';

/** `''` ou `HH:MM` — le format stocké, celui que produit le dérouleur. */
const zHeure = z
  .string()
  .trim()
  .refine((v) => v === '' || /^([01]\d|2[0-3]):([0-5]\d)$/.test(v), { message: 'Heure invalide.' });

const schema = z
  .object({
    // Une chaîne vide efface le nom et fait revenir « Mon atelier ».
    workshopName: z
      .string()
      .trim()
      .max(120, 'Le nom ne peut pas dépasser 120 caractères')
      .optional(),
    phone: zTelephone.optional(),
    city: z.string().trim().max(120, 'La ville ne peut pas dépasser 120 caractères').optional(),
    address: z.string().trim().max(240, 'L’adresse ne peut pas dépasser 240 caractères').optional(),
    opensAt: zHeure.optional(),
    closesAt: zHeure.optional(),
    logoUrl: z.string().trim().max(500).optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: 'Aucune modification fournie' })
  // Les deux heures s'écrivent ensemble ou pas du tout. En envoyer une seule
  // laisserait la seconde à sa valeur précédente et produirait un intervalle
  // que personne n'a demandé — « 18h00 — 08h00 » après avoir seulement bougé
  // l'ouverture.
  .refine((o) => (o.opensAt === undefined) === (o.closesAt === undefined), {
    message: 'L’ouverture et la fermeture s’enregistrent ensemble.',
  })
  .refine((o) => o.opensAt === undefined || validerHoraires(o.opensAt, o.closesAt ?? '') === null, {
    message: 'La fermeture doit venir après l’ouverture.',
  })
  .refine((o) => o.logoUrl === undefined || validerLogo(o.logoUrl) === null, {
    message: 'Ce logo ne provient pas d’un envoi de l’application.',
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
          message: parsed.error.issues[0]?.message ?? 'Informations d’atelier invalides.',
        },
        { status: 400, headers: { 'x-request-id': ctx.requestId } },
      );
    }

    // Recomposé champ par champ : sous `exactOptionalPropertyTypes`, une clé
    // présente valant `undefined` n'est pas une clé absente, et Prisma
    // n'accepte que la seconde. Un PATCH qui ne porte que le téléphone ne doit
    // surtout pas effacer le nom au passage.
    const { workshopName: nom, phone, city, address, opensAt, closesAt, logoUrl } = parsed.data;
    const vide = (v: string) => (v === '' ? null : v);
    const atelier = await prisma.user.update({
      where: { id: auth.user.sub },
      data: {
        ...(nom === undefined ? {} : { workshopName: vide(nom) }),
        ...(phone === undefined ? {} : { phone: vide(phone) }),
        ...(city === undefined ? {} : { workshopCity: vide(city) }),
        ...(address === undefined ? {} : { workshopAddress: vide(address) }),
        ...(opensAt === undefined ? {} : { workshopOpensAt: vide(opensAt) }),
        ...(closesAt === undefined ? {} : { workshopClosesAt: vide(closesAt) }),
        ...(logoUrl === undefined ? {} : { workshopLogoUrl: vide(logoUrl) }),
      },
      select: {
        workshopName: true,
        phone: true,
        workshopCity: true,
        workshopAddress: true,
        workshopOpensAt: true,
        workshopClosesAt: true,
        workshopLogoUrl: true,
      },
    });

    // On journalise ce qui est renseigné, jamais la valeur : l'adresse d'un
    // atelier et son numéro n'ont rien à faire dans les journaux.
    log.info('informations d’atelier modifiées', {
      nomRenseigne: atelier.workshopName !== null,
      telephoneRenseigne: atelier.phone !== null,
      villeRenseignee: atelier.workshopCity !== null,
      adresseRenseignee: atelier.workshopAddress !== null,
      horairesRenseignes: atelier.workshopOpensAt !== null,
      logoRenseigne: atelier.workshopLogoUrl !== null,
    });

    return NextResponse.json(
      { atelier },
      { status: 200, headers: { 'x-request-id': ctx.requestId } },
    );
  });
}
