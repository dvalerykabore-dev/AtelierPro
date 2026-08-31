'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
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
import { useArtisans } from '@/lib/useArtisans';
import { useReleveMesures } from '@/lib/useReleveMesures';
import { MODES, type ModeCle } from '@/lib/tresorerie';
import { useTarifs } from '@/lib/useTarifs';
import { nombreDeChamps, paletteDe } from '@/lib/mock/atelier';
import { etapesDe } from '@/lib/etapes-commande';
import {
  aujourdhuiISO,
  delaiEnJours,
  libelleEcheance,
  validerEcheance,
  versISO,
} from '@/lib/echeance';
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
  const { artisans } = useArtisans();
  /** Une commande ne s'assigne qu'à un artisan encore en poste. */
  const equipe = artisans.filter((a) => a.actif);
  const surServeur = source === 'serveur';

  const [clientId, setClientId] = useState<string | null>(null);
  const { tarifs, chargement: chargementTarifs } = useTarifs();
  // Vide au premier rendu : la grille vient du serveur. Le premier tarif reçu
  // est retenu par l'effet ci-dessous plutôt que par une valeur initiale, qui
  // se figerait sur une liste encore absente.
  const [typeTenue, setTypeTenue] = useState<string>('');
  const [tissu, setTissu] = useState('Wax hollandais — 6 yards');
  const [couleur, setCouleur] = useState<string>(COULEURS[0]!.label);
  const [assigne, setAssigne] = useState<string>('');
  const [notes, setNotes] = useState('');
  // Echeance : saisie, et surtout ENVOYEE. Le formulaire n en demandait aucune.
  const [echeance, setEcheance] = useState('');
  const [acompte, setAcompte] = useState<string>(String(ACOMPTE_PAR_DEFAUT));
  // L'acompte devient une ligne du journal de caisse : il lui faut un mode de
  // règlement. Espèces par défaut — le cas courant en atelier — mais il est
  // demandé plutôt que supposé, parce que le rapprochement de caisse en fin de
  // mois se fait mode par mode.
  const [modeAcompte, setModeAcompte] = useState<ModeCle>('ESPECES');
  const [confirmee, setConfirmee] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreurServeur, setErreurServeur] = useState<string | null>(null);

  const client = clients.find((c) => c.id === clientId) ?? clients[0];
  const artisan = equipe.find((a) => a.id === assigne) ?? equipe[0];
  const tarif = tarifs.find((t) => t.tenue === typeTenue) ?? tarifs[0] ?? null;
  const prixTenue = tarif?.prix ?? 0;

  // La grille arrive après le premier rendu : on retient sa première ligne dès
  // qu'elle est là, une seule fois. La condition sur `typeTenue` empêche
  // d'écraser un choix déjà fait par l'utilisateur.
  useEffect(() => {
    if (!typeTenue && tarifs[0]) setTypeTenue(tarifs[0].tenue);
  }, [tarifs, typeTenue]);
  const palette = paletteDe(client?.genre ?? 'Femme');
  const couleurChoisie = COULEURS.find((c) => c.label === couleur) ?? COULEURS[0]!;

  const acompteVerse = Number.parseInt(acompte, 10) || 0;
  const resteAPayer = Math.max(0, prixTenue - acompteVerse);

  const aujourdhui = aujourdhuiISO();
  const echeanceProbleme = validerEcheance(echeance, aujourdhui);

  // Le client a-t-il un releve au dossier ? Le fil d etapes en depend, et
  // c est aussi ce qui distingue une commande prete a coudre d une commande
  // qu il faudra reprendre au comptoir.
  const { charge: releve } = useReleveMesures(client?.id ?? null, surServeur && Boolean(client));

  // Le fil d etapes dit ce qui manque, au lieu d etats ecrits en dur.
  const etapes = etapesDe({
    client: Boolean(client),
    modele: Boolean(typeTenue) && tissu.trim() !== '',
    mesures: Boolean(releve),
    planning: echeance !== '' && !echeanceProbleme,
  });

  /** L'artisan est-il déjà saturé aujourd'hui ? Sans équipe, la question ne se pose pas. */
  const surcharge = artisan ? artisan.heuresAujourdhui >= artisan.capacite : false;

  const problemes = useMemo(() => {
    const liste: string[] = [];
    // Sans grille, aucun prix : mieux vaut le dire ici que d'enregistrer une
    // commande à 0 F qu'il faudrait retrouver et corriger.
    if (!chargementTarifs && !tarif) {
      liste.push('Aucun tarif dans votre grille — ajoutez-en un dans Paramètres › Tarification.');
    }
    if (!tissu.trim()) liste.push('Le tissu n’est pas renseigné.');
    if (acompteVerse > prixTenue) liste.push('L’acompte dépasse le montant de la commande.');
    if (echeanceProbleme) liste.push(echeanceProbleme);
    return liste;
  }, [tissu, acompteVerse, prixTenue, tarif, chargementTarifs, echeanceProbleme]);

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
          priceAmount: prixTenue,
          depositAmount: acompteVerse,
          depositMethod: acompteVerse > 0 ? modeAcompte : undefined,
          assignee: artisan?.initiales ?? undefined,
          notes: notes || undefined,
          dueDate: versISO(echeance) ?? undefined,
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
          {etapes.map((etape, i) => {
            const active = etape.active;
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
                {i < etapes.length - 1 && (
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
                aide={`Tarif de façon : ${formatPrice(prixTenue, 'F')}`}
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
                aide={
                  artisan
                    ? `${artisan.heuresAujourdhui}/${artisan.capacite} h engagées aujourd’hui`
                    : 'Aucun artisan actif — composez l’équipe dans les paramètres'
                }
              >
                {equipe.length === 0 && <option value="">Aucun artisan actif</option>}
                {equipe.map((a) => (
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
                aide="En francs CFA. Enregistré comme recette dans la caisse."
              />

              {/* Le mode n'a de sens que s'il y a de l'argent à encaisser. */}
              {acompteVerse > 0 && (
                <SelectField
                  label="Réglé en"
                  value={modeAcompte}
                  onChange={(e) => modifier(setModeAcompte)(e.target.value as ModeCle)}
                  aide="Sert au rapprochement de caisse en fin de mois."
                >
                  {MODES.map((m) => (
                    <option key={m.cle} value={m.cle}>
                      {m.label}
                    </option>
                  ))}
                </SelectField>
              )}
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
                {artisan?.nom} est déjà saturé aujourd’hui ({artisan?.heuresAujourdhui}/
                {artisan?.capacite} h) — la livraison estimée en tiendra compte.
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

          {/*
            Ce bloc annonçait « Date de livraison calculée — basée sur la
            capacité réelle de l'équipe » au-dessus d'une date constante du jeu
            d'exemple : « Mardi 28 jan », identique pour toutes les commandes et
            reprise telle quelle dans le message de confirmation. Pire, la
            commande partait en base SANS échéance — le formulaire n'en envoyait
            aucune. Toutes les commandes enregistrées jusqu'ici ont `dueDate`
            nul, si bien qu'aucune ne peut être signalée en retard par le
            passage quotidien, et que le planning n'a rien à quoi se raccrocher.

            La date est désormais saisie et enregistrée. Elle n'est pas
            calculée : l'estimer demanderait de connaître les heures que la
            tenue réclame, que ce formulaire ne demande pas. On affiche donc la
            charge réelle de l'artisan à côté, ce qui est vrai, plutôt qu'un
            calcul qui ne l'était pas.
          */}
          <div className="px-5">
            <h2 className="font-headings text-foreground mb-1 text-sm font-bold">
              Date de livraison
            </h2>
            <p className="text-muted-foreground mb-3 text-xs">
              C’est la date promise au client — elle sert au planning et aux alertes de retard.
            </p>

            <Field
              label="Livraison prévue"
              type="date"
              value={echeance}
              min={aujourdhui}
              onChange={(e) => setEcheance(e.target.value)}
              {...(echeanceProbleme ? { erreur: echeanceProbleme } : {})}
              aide={
                artisan
                  ? `${artisan.nom} — ${artisan.heuresAujourdhui}/${artisan.capacite} h engagées aujourd’hui`
                  : 'Aucun artisan assigné.'
              }
            />

            {echeance && !echeanceProbleme && (
              <div className="bg-muted border-border mt-3 flex items-center gap-2 rounded-lg border p-3">
                <CalendarCheck size={15} className="text-muted-foreground" aria-hidden />
                <div className="min-w-0">
                  <div className="text-foreground text-sm font-medium">
                    {libelleEcheance(echeance)}
                  </div>
                  <div className="text-muted-foreground text-xs">{delaiEnJours(echeance)}</div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-border mx-5 h-px" />

          <div className="px-5">
            <h2 className="font-headings text-foreground mb-3 text-sm font-bold">Tarification</h2>
            <dl className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3 text-xs">
                <dt className="text-muted-foreground">
                  Façon {(tarif?.tenue ?? '').toLowerCase()}
                </dt>
                <dd className="text-foreground">{formatPrice(prixTenue, 'F')}</dd>
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
                  {/*
                    Le message annonçait « livraison Mardi 28 jan » — la date
                    constante du jeu d'exemple, la même pour toutes les
                    commandes. On n'annonce plus que l'échéance réellement
                    saisie, et rien du tout quand il n'y en a pas.
                  */}
                  {reference
                    ? `Commande ${reference} enregistrée pour ${client.nom} — ${tarif?.tenue ?? ''}${
                        echeance ? `, livraison ${libelleEcheance(echeance)}` : ''
                      }.`
                    : `Commande confirmée pour ${client.nom} — ${tarif?.tenue ?? ''}${
                        echeance ? `, livraison ${libelleEcheance(echeance)}` : ''
                      }.`}
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
