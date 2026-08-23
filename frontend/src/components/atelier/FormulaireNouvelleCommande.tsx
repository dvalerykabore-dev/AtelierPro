'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarCheck,
  Check,
  CheckCircle2,
  ExternalLink,
  TriangleAlert,
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import MeasureRow from '@/components/ui/MeasureRow';
import { Field, SelectField, TextareaField } from '@/components/ui/Field';
import { api, ApiError } from '@/lib/api';
import { useClients } from '@/lib/useClients';
import {
  artisans,
  etapeCourante,
  etapesNouvelleCommande,
  livraisonEstimee,
  nombreDeChamps,
  paletteDe,
  tarifs,
} from '@/lib/mock/atelier';
import { cn, formatPrice } from '@/lib/utils';

/** Couleurs de tissu proposées — pastille + libellé, comme la maquette. */
const COULEURS = [
  { label: 'Ankara orange & bleu', classe: 'bg-warning' },
  { label: 'Bazin riche bleu', classe: 'bg-secondary' },
  { label: 'Bogolan naturel', classe: 'bg-muted-foreground' },
  { label: 'Wax vert émeraude', classe: 'bg-success' },
  { label: 'Uni noir', classe: 'bg-background' },
];

const ACOMPTE_PAR_DEFAUT = 10000;

/**
 * Tunnel de création d'une commande.
 *
 * La maquette Banani présentait des champs figés — des `<span>` habillés en
 * champs de saisie. Tout est ici réellement modifiable : le type de tenue et
 * l'artisan sont des listes déroulantes, le tarif suit la tenue choisie, et la
 * confirmation valide la cohérence de l'ensemble avant de conclure.
 */
export default function FormulaireNouvelleCommande() {
  const { clients, source } = useClients();
  const surServeur = source === 'serveur';

  const [clientId, setClientId] = useState<string | null>(null);
  const [typeTenue, setTypeTenue] = useState<string>(tarifs[0]!.tenue);
  const [tissu, setTissu] = useState('Wax hollandais — 6 yards');
  const [couleur, setCouleur] = useState<string>(COULEURS[0]!.label);
  const [assigne, setAssigne] = useState<string>(artisans[0]!.id);
  const [notes, setNotes] = useState('');
  const [acompte, setAcompte] = useState<string>(String(ACOMPTE_PAR_DEFAUT));
  const [confirmee, setConfirmee] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreurServeur, setErreurServeur] = useState<string | null>(null);

  const client = clients.find((c) => c.id === clientId) ?? clients[0];
  const artisan = artisans.find((a) => a.id === assigne) ?? artisans[0]!;
  const tarif = tarifs.find((t) => t.tenue === typeTenue) ?? tarifs[0]!;
  const palette = paletteDe(client?.genre ?? 'Femme');
  const couleurChoisie = COULEURS.find((c) => c.label === couleur) ?? COULEURS[0]!;

  const acompteVerse = Number.parseInt(acompte, 10) || 0;
  const resteAPayer = Math.max(0, tarif.prix - acompteVerse);

  /** L'artisan est-il déjà saturé aujourd'hui ? */
  const surcharge = artisan.heuresUtilisees >= artisan.heuresTotal;

  const problemes = useMemo(() => {
    const liste: string[] = [];
    if (!tissu.trim()) liste.push('Le tissu n’est pas renseigné.');
    if (acompteVerse > tarif.prix) liste.push('L’acompte dépasse le montant de la commande.');
    return liste;
  }, [tissu, acompteVerse, tarif.prix]);

  async function confirmer(e: FormEvent) {
    e.preventDefault();
    if (problemes.length > 0 || !client) return;

    // Hors session, aucun client n'existe en base : on confirme à l'écran sans
    // prétendre avoir enregistré. La provenance est annoncée plus bas.
    if (!surServeur) {
      setReference(null);
      setConfirmee(true);
      return;
    }

    setEnvoi(true);
    setErreurServeur(null);

    try {
      const res = await api<{ commande: { sequence: number } }>('/api/commandes', {
        method: 'POST',
        body: {
          customerId: client.id,
          garment: typeTenue,
          fabric: tissu,
          color: couleur,
          priceAmount: tarif.prix,
          depositAmount: acompteVerse,
          assignee: artisan.initiales,
          notes: notes || undefined,
        },
      });
      setReference(`#${String(res.commande.sequence).padStart(3, '0')}`);
      setConfirmee(true);
    } catch (err) {
      if (err instanceof ApiError) {
        // Le serveur revalide ce que l'écran a déjà contrôlé : c'est lui qui
        // fait foi, l'interface pouvant être contournée.
        if (err.code === 'DEPOSIT_EXCEEDS_PRICE') {
          setErreurServeur('L’acompte dépasse le montant de la commande.');
        } else if (err.code === 'SEQUENCE_CONFLICT') {
          setErreurServeur('Trop de commandes créées en même temps. Réessayez.');
        } else if (err.status === 401) {
          setReference(null);
          setConfirmee(true);
        } else {
          setErreurServeur(err.message);
        }
      } else {
        setErreurServeur('Impossible de joindre le serveur.');
      }
    } finally {
      setEnvoi(false);
    }
  }

  function modifier<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setConfirmee(false);
    };
  }

  // Une commande se rattache à un client : sans carnet, l'écran n'a pas d'objet.
  // Une garde unique évite d'éparpiller des valeurs par défaut dans le rendu.
  if (!client) {
    return (
      <div className="flex flex-col items-center gap-3 p-12 text-center">
        <p className="text-foreground text-sm font-medium">Aucun client enregistré</p>
        <p className="text-muted-foreground max-w-sm text-xs">
          Créez d’abord un client dans le carnet : une commande lui sera rattachée.
        </p>
        <Link href="/clients">
          <Button>Ouvrir le carnet clients</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={confirmer}>
      {/* Fil d'étapes */}
      <div className="border-border bg-background border-b">
        <ol className="flex items-center gap-4 overflow-x-auto px-4 py-4 lg:gap-8 lg:px-8">
          {etapesNouvelleCommande.map((etape, i) => {
            const active = etape.numero === etapeCourante;
            return (
              <li key={etape.numero} className="flex flex-shrink-0 items-center gap-2">
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                    etape.terminee
                      ? 'bg-primary text-primary-foreground'
                      : active
                        ? 'bg-secondary border-primary text-primary border-2'
                        : 'bg-muted text-muted-foreground',
                  )}
                >
                  {etape.terminee ? <Check size={12} aria-hidden /> : etape.numero}
                </span>
                <span
                  className={cn(
                    'text-sm font-medium',
                    active
                      ? 'text-foreground'
                      : etape.terminee
                        ? 'text-primary'
                        : 'text-muted-foreground',
                  )}
                >
                  {etape.label}
                </span>
                {i < etapesNouvelleCommande.length - 1 && (
                  <span className="bg-border ml-2 hidden h-px w-12 lg:block" aria-hidden />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* ---- Colonne formulaire ---- */}
        <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8">
          <section className="bg-surface border-border rounded-lg border p-5">
            <h2 className="font-headings text-foreground mb-4 text-sm font-bold">
              Détails du modèle
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Cliente / client"
                value={client.id}
                onChange={(e) => {
                  modifier(setClientId)(e.target.value);
                }}
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom} · {c.genre}
                  </option>
                ))}
              </SelectField>

              <SelectField
                label="Type de tenue"
                value={typeTenue}
                onChange={(e) => modifier(setTypeTenue)(e.target.value)}
                aide={`Tarif de façon : ${formatPrice(tarif.prix, 'F')}`}
              >
                {tarifs.map((t) => (
                  <option key={t.tenue} value={t.tenue}>
                    {t.tenue}
                  </option>
                ))}
              </SelectField>

              <Field
                label="Tissu"
                value={tissu}
                onChange={(e) => modifier(setTissu)(e.target.value)}
                placeholder="Wax hollandais — 6 yards"
                erreur={!tissu.trim() ? 'Champ requis' : undefined}
              />

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="couleur-tissu"
                  className="text-muted-foreground flex items-center gap-2 text-xs"
                >
                  Couleur / motif
                  <span className={cn('h-3 w-3 rounded-sm', couleurChoisie.classe)} aria-hidden />
                </label>
                <select
                  id="couleur-tissu"
                  value={couleur}
                  onChange={(e) => modifier(setCouleur)(e.target.value)}
                  className="bg-input border-border text-foreground focus:border-primary w-full rounded-md border px-3 py-2.5 text-sm transition-colors focus:outline-none"
                >
                  {COULEURS.map((c) => (
                    <option key={c.label} value={c.label}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <SelectField
                label="Assigné à"
                value={assigne}
                onChange={(e) => modifier(setAssigne)(e.target.value)}
                aide={`${artisan.heuresUtilisees}/${artisan.heuresTotal} h engagées aujourd’hui`}
              >
                {artisans.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nom} — {a.role}
                  </option>
                ))}
              </SelectField>

              <Field
                label="Acompte versé"
                type="number"
                min={0}
                step={500}
                value={acompte}
                onChange={(e) => modifier(setAcompte)(e.target.value)}
                aide="En francs CFA."
              />
            </div>

            <div className="mt-4">
              <TextareaField
                label="Notes / instructions"
                value={notes}
                onChange={(e) => modifier(setNotes)(e.target.value)}
                placeholder="Ex : col bateau, fermeture invisible dos, finitions dorées sur les ourlets."
                aide="Ces consignes sont lues par l’artisan au moment de la coupe."
              />
            </div>

            {surcharge && (
              <p className="text-warning mt-4 flex items-start gap-2 text-xs">
                <TriangleAlert size={13} className="mt-0.5 flex-shrink-0" aria-hidden />
                {artisan.nom} est déjà saturé aujourd’hui ({artisan.heuresUtilisees}/
                {artisan.heuresTotal} h) — la livraison estimée en tiendra compte.
              </p>
            )}
          </section>

          {/* Mesures — lecture seule, relevées sur /mesures */}
          <section className="bg-surface border-border overflow-hidden rounded-lg border">
            <div className="border-border flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3">
              <h2 className="font-headings text-foreground text-sm font-bold">
                Mesures
                <span className="text-muted-foreground ml-2 font-normal">
                  · palette {client.genre.toLowerCase()}
                </span>
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-success flex items-center gap-1 text-xs">
                  <CheckCircle2 size={12} aria-hidden />
                  {nombreDeChamps(palette)} mesures au dossier
                </span>
                <Link href="/mesures" className="text-primary text-xs font-medium">
                  Modifier
                </Link>
              </div>
            </div>

            {palette.map((section) => (
              <div key={section.titre}>
                <div className="bg-muted border-border flex items-baseline gap-2 border-b px-5 py-1.5">
                  <span className="text-primary text-xs font-bold tracking-wide uppercase">
                    {section.titre}
                  </span>
                  <span className="text-muted-foreground text-xs">{section.precision}</span>
                </div>
                <div className="grid sm:grid-cols-2">
                  {section.champs.map((c, i) => (
                    <MeasureRow
                      key={`${section.titre}-${c.numero}`}
                      label={`${c.numero}. ${c.label}`}
                      valeur="—"
                      unite={c.unite}
                      contraste={i % 4 >= 2}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* ---- Colonne récapitulatif ---- */}
        <aside className="border-border bg-surface flex w-full flex-shrink-0 flex-col gap-5 border-t py-6 lg:w-80 lg:border-t-0 lg:border-l">
          <div className="px-5">
            <h2 className="font-headings text-foreground mb-3 text-sm font-bold">Client</h2>
            <div className="bg-muted flex items-center gap-3 rounded-lg p-3">
              <Avatar initiales={client.initiales} taille="lg" />
              <div className="min-w-0">
                <div className="text-foreground truncate text-sm font-medium">{client.nom}</div>
                <div className="text-muted-foreground text-xs">
                  {client.nbCommandes} commandes · {client.genre}
                </div>
              </div>
              <Link href="/clients" className="text-muted-foreground hover:text-foreground ml-auto">
                <ExternalLink size={14} aria-hidden />
                <span className="sr-only">Voir la fiche client</span>
              </Link>
            </div>
          </div>

          <div className="bg-border mx-5 h-px" />

          <div className="px-5">
            <h2 className="font-headings text-foreground mb-1 text-sm font-bold">
              Date de livraison calculée
            </h2>
            <p className="text-muted-foreground mb-4 text-xs">
              Basée sur la capacité réelle de l’équipe
            </p>

            <div className="bg-muted border-border rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <CalendarCheck size={15} className="text-muted-foreground" aria-hidden />
                <span className="text-muted-foreground text-xs">Livraison estimée</span>
              </div>
              <div className="font-headings text-primary text-2xl font-bold">
                {livraisonEstimee.date}
              </div>
              <div className="text-muted-foreground mt-1 text-xs">
                {livraisonEstimee.dureeEstimee} · {artisan.nom}
              </div>
            </div>
          </div>

          <div className="bg-border mx-5 h-px" />

          <div className="px-5">
            <h2 className="font-headings text-foreground mb-3 text-sm font-bold">Tarification</h2>
            <dl className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3 text-xs">
                <dt className="text-muted-foreground">Façon {tarif.tenue.toLowerCase()}</dt>
                <dd className="text-foreground">{formatPrice(tarif.prix, 'F')}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 text-xs">
                <dt className="text-muted-foreground">Acompte versé</dt>
                <dd className="text-success">− {formatPrice(acompteVerse, 'F')}</dd>
              </div>
              <div className="bg-border my-1 h-px" />
              <div className="flex items-center justify-between gap-3 text-sm font-bold">
                <dt className="text-foreground">Reste à payer</dt>
                <dd className="text-primary">{formatPrice(resteAPayer, 'F CFA')}</dd>
              </div>
            </dl>
          </div>

          <div className="border-border mt-auto border-t px-5 pt-4">
            {problemes.length > 0 && (
              <ul className="text-danger mb-3 flex flex-col gap-1 text-xs">
                {problemes.map((p) => (
                  <li key={p} className="flex items-start gap-1.5">
                    <TriangleAlert size={12} className="mt-0.5 flex-shrink-0" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            )}

            {erreurServeur && (
              <p role="alert" className="text-danger mb-3 flex items-start gap-1.5 text-xs">
                <TriangleAlert size={12} className="mt-0.5 flex-shrink-0" aria-hidden />
                {erreurServeur}
              </p>
            )}

            {confirmee ? (
              <div className="flex flex-col gap-3">
                <p className="text-success flex items-start gap-2 text-sm">
                  <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0" aria-hidden />
                  {reference
                    ? `Commande ${reference} enregistrée pour ${client.nom} — ${tarif.tenue}.`
                    : `Commande confirmée pour ${client.nom} — ${tarif.tenue}, livraison ${livraisonEstimee.date}.`}
                </p>
                {/* Sans numéro, c'est que rien n'est parti en base : on le dit
                    plutôt que de laisser croire à un enregistrement. */}
                {!reference && (
                  <p className="text-warning text-xs">
                    Confirmée à l’écran seulement — connectez-vous pour l’enregistrer.
                  </p>
                )}
                <Link href="/commandes">
                  <Button variante="contour" pleineLargeur>
                    Voir toutes les commandes
                    <ArrowRight size={14} aria-hidden />
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Button
                  type="submit"
                  taille="lg"
                  pleineLargeur
                  disabled={problemes.length > 0 || envoi}
                  className="font-bold"
                >
                  <Check size={15} aria-hidden />
                  {envoi ? 'Enregistrement…' : 'Confirmer la commande'}
                </Button>
                <p className="text-muted-foreground mt-2 text-center text-xs">
                  Un SMS sera envoyé à {client.nom.split(' ')[0]}.
                </p>
              </>
            )}
          </div>
        </aside>
      </div>
    </form>
  );
}
