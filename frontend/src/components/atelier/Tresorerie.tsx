'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Info,
  Lock,
  Plus,
  Trash2,
  Wallet,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Field, SelectField } from '@/components/ui/Field';
import { POSTES, libelleMois, libelleMoisCourt, libellePoste } from '@/lib/tresorerie';
import { useCharges, useTresorerie } from '@/lib/useTresorerie';
import { cn, formatPrice } from '@/lib/utils';
import { useT } from '@/contexts/LangueContext';

/** Montant signé, coloré selon son sens. */
function Signe({ valeur, gras = false }: { valeur: number; gras?: boolean }) {
  return (
    <span
      className={cn(
        valeur > 0 ? 'text-success' : valeur < 0 ? 'text-danger' : 'text-muted-foreground',
        gras && 'font-bold',
      )}
    >
      {valeur > 0 ? '+' : valeur < 0 ? '−' : ''}
      {formatPrice(Math.abs(valeur), 'F')}
    </span>
  );
}

/**
 * Le recoupement recettes / dépenses de l'atelier.
 *
 * Deux règles gouvernent l'écran, et elles sont écrites dessus plutôt que
 * seulement dans le code :
 *
 * — **On compte l'argent encaissé, pas l'argent facturé.** Une commande de
 *   80 000 F réglée de 20 000 F pèse 20 000 F ici et 80 000 F dans les
 *   rapports. Les deux sont justes ; sans explication l'écart passerait pour
 *   une anomalie.
 * — **Le constaté et le prévu ne se touchent pas.** Le solde est mesuré. La
 *   projection est une projection, et son bloc le dit.
 */
export default function Tresorerie() {
  const t = useT();
  const { donnees, chargement, revalidation, erreur, session, recharger } = useTresorerie();
  const { charges, ajouter: ajouterCharge, basculer, supprimer: supprimerCharge } = useCharges();

  const [ouvert, setOuvert] = useState(false);
  const [libelle, setLibelle] = useState('');
  const [poste, setPoste] = useState<string>('LOYER');
  const [montant, setMontant] = useState('');
  const [jour, setJour] = useState('1');
  const [envoi, setEnvoi] = useState(false);
  const [erreurForm, setErreurForm] = useState<string | null>(null);

  async function enregistrerCharge(e: FormEvent) {
    e.preventDefault();
    setErreurForm(null);
    const valeur = Number.parseInt(montant, 10);
    if (Number.isNaN(valeur) || valeur <= 0) {
      setErreurForm('Le montant doit être un nombre supérieur à zéro.');
      return;
    }
    setEnvoi(true);
    const echec = await ajouterCharge({
      label: libelle.trim(),
      category: poste,
      amount: valeur,
      dayOfMonth: Number.parseInt(jour, 10) || 1,
    });
    setEnvoi(false);
    if (echec) {
      setErreurForm(echec);
      return;
    }
    setLibelle('');
    setMontant('');
    setOuvert(false);
    // La prévision dépend des charges : elle doit être recalculée côté serveur.
    recharger();
  }

  const fenetreCharge = (
    <Modal
      ouvert={ouvert}
      onFermer={() => setOuvert(false)}
      titre={t('Déclarer une charge fixe')}
      description={t(
        'Elle sert uniquement à la prévision. Aucun mouvement n’est écrit en caisse tant que vous n’avez pas payé.',
      )}
    >
      <form onSubmit={enregistrerCharge} className="flex flex-col gap-4">
        <Field
          label={t('Libellé')}
          required
          maxLength={120}
          placeholder={t('Loyer de l’atelier')}
          value={libelle}
          onChange={(e) => setLibelle(e.target.value)}
        />
        <SelectField label={t('Poste')} value={poste} onChange={(e) => setPoste(e.target.value)}>
          {POSTES.map((p) => (
            <option key={p.cle} value={p.cle}>
              {p.label}
            </option>
          ))}
        </SelectField>
        <Field
          label={t('Montant mensuel (F CFA)')}
          type="number"
          inputMode="numeric"
          min={1}
          required
          placeholder="50000"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
        />
        <Field
          label={t('Jour d’échéance')}
          type="number"
          min={1}
          max={28}
          required
          aide={t('Entre 1 et 28 — au-delà, février n’aurait pas d’échéance certaines années.')}
          value={jour}
          onChange={(e) => setJour(e.target.value)}
        />

        {erreurForm && (
          <p role="alert" className="text-danger flex items-start gap-2 text-sm">
            <AlertCircle size={15} className="mt-0.5 flex-shrink-0" aria-hidden />
            {erreurForm}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variante="contour" onClick={() => setOuvert(false)}>
            {t('Annuler')}
          </Button>
          <Button type="submit" disabled={envoi}>
            {envoi ? 'Enregistrement…' : 'Déclarer'}
          </Button>
        </div>
      </form>
    </Modal>
  );

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <Lock size={26} className="text-muted-foreground mb-3" aria-hidden />
        <p className="text-foreground mb-1 text-sm font-bold">{t('Trésorerie indisponible')}</p>
        <p className="text-muted-foreground max-w-md text-xs">
          {t(
            'Le solde de votre atelier ne s’affiche qu’une fois connecté. Aucun jeu d’exemple n’est proposé ici : on prend des décisions d’achat avec ce chiffre.',
          )}
        </p>
        <Link href="/connexion" className="text-primary mt-4 text-sm font-medium">
          Se connecter
        </Link>
      </div>
    );
  }

  if (erreur) {
    return (
      <p role="alert" className="text-danger flex items-start gap-2 px-4 py-8 text-sm lg:px-6">
        <AlertCircle size={15} className="mt-0.5 flex-shrink-0" aria-hidden />
        {erreur}
      </p>
    );
  }

  if (chargement || !donnees) {
    return (
      <p className="text-muted-foreground px-4 py-12 text-center text-sm">
        {t('Calcul du solde…')}
      </p>
    );
  }

  const { solde, moisCourant, mois, repartition, prevision, reprises } = donnees;
  const maxBarre = Math.max(...mois.map((m) => Math.max(m.recettes, m.depenses)), 1);

  return (
    <div className="flex flex-col gap-5 px-4 py-5 lg:px-6">
      {/* Solde constaté */}
      <section className="border-border bg-surface rounded-xl border p-5 text-center">
        <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1.5 text-xs">
          <Wallet size={13} aria-hidden />
          {t('Trésorerie de l’atelier')}
        </div>
        <div
          className={cn(
            'font-headings text-4xl font-bold',
            solde < 0 ? 'text-danger' : 'text-foreground',
          )}
        >
          {formatPrice(solde, 'F')}
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          {t(
            'Argent réellement encaissé, moins les dépenses décaissées, depuis l’ouverture du journal.',
          )}
        </p>
        {/*
         * Au retour sur cet écran, le solde affiché est le dernier connu et la
         * vérification est en cours. Les autres écrans revalident en silence ;
         * pas celui-ci. Ce chiffre sert à décider d'un achat : le montrer sans
         * dire qu'il n'est pas encore reconfirmé, c'est répondre à une question
         * qu'on n'a pas posée. Une mention, pas un squelette — masquer le solde
         * pour le réafficher identique une seconde plus tard ne rend service à
         * personne.
         */}
        {revalidation && (
          <p className="text-muted-foreground mt-1 text-[11px] italic" aria-live="polite">
            {t('Dernier solde connu — vérification en cours…')}
          </p>
        )}
      </section>

      {/* Mois en cours */}
      <section className="grid grid-cols-3 gap-3">
        <div className="border-border bg-surface rounded-lg border p-3 text-center">
          <ArrowUpRight size={14} className="text-success mx-auto mb-1" aria-hidden />
          <div className="font-headings text-success text-lg font-bold">
            {formatPrice(moisCourant.recettes, 'F')}
          </div>
          <div className="text-muted-foreground text-xs">{t('Recettes')}</div>
        </div>
        <div className="border-border bg-surface rounded-lg border p-3 text-center">
          <ArrowDownRight size={14} className="text-danger mx-auto mb-1" aria-hidden />
          <div className="font-headings text-danger text-lg font-bold">
            {formatPrice(moisCourant.depenses, 'F')}
          </div>
          <div className="text-muted-foreground text-xs">{t('Dépenses')}</div>
        </div>
        <div className="border-border bg-surface rounded-lg border p-3 text-center">
          <div className="font-headings mb-1 text-lg font-bold">
            <Signe valeur={moisCourant.resultat} gras />
          </div>
          <div className="text-muted-foreground text-xs">{t('Résultat')}</div>
          <div className="text-muted-foreground mt-0.5 text-[10px]">
            {libelleMois(moisCourant.cle)}
          </div>
        </div>
      </section>

      {/* Pourquoi ce chiffre diffère des rapports */}
      <p className="border-border bg-muted text-muted-foreground flex items-start gap-2 rounded-lg border px-3 py-2 text-xs">
        <Info size={13} className="mt-0.5 flex-shrink-0" aria-hidden />
        <span>
          Ces montants comptent l’argent{' '}
          <strong className="text-foreground">{t('encaissé')}</strong>. Le chiffre d’affaires des{' '}
          <Link href="/rapports" className="text-primary underline">
            rapports
          </Link>{' '}
          compte l’argent <strong className="text-foreground">{t('facturé')}</strong> : une commande
          de 80 000 F réglée de 20 000 F y pèse 80 000 F. Les deux sont justes et vont différer.
        </span>
      </p>

      {reprises > 0 && (
        <p className="border-warning/40 bg-warning/10 text-muted-foreground flex items-start gap-2 rounded-lg border px-3 py-2 text-xs">
          <AlertTriangle size={13} className="text-warning mt-0.5 flex-shrink-0" aria-hidden />
          <span>
            {reprises} écriture{reprises > 1 ? 's ont' : ' a'} été reconstituée
            {reprises > 1 ? 's' : ''} depuis un acompte antérieur au journal. Leur date est celle de
            la commande, faute de mieux : le solde du mois concerné est approximatif.
          </span>
        </p>
      )}

      {/* Six mois */}
      <section className="border-border bg-surface rounded-xl border p-4 lg:p-5">
        <h2 className="font-headings text-foreground mb-4 text-sm font-bold">
          {t('Six derniers mois')}
        </h2>
        <ul className="flex flex-col gap-3">
          {mois.map((m) => (
            <li key={m.cle}>
              <div className="mb-1 flex items-center justify-between gap-3">
                <span
                  className={cn(
                    'text-xs',
                    m.courant ? 'text-primary font-bold' : 'text-muted-foreground',
                  )}
                >
                  {libelleMoisCourt(m.cle)}
                </span>
                <span className="text-muted-foreground text-xs whitespace-nowrap">
                  solde {formatPrice(m.soldeFin, 'F')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="bg-success h-2 rounded-sm"
                  style={{ width: `${(m.recettes / maxBarre) * 50}%` }}
                  title={`Recettes ${formatPrice(m.recettes, 'F')}`}
                />
                <div
                  className="bg-danger h-2 rounded-sm"
                  style={{ width: `${(m.depenses / maxBarre) * 50}%` }}
                  title={`Dépenses ${formatPrice(m.depenses, 'F')}`}
                />
              </div>
            </li>
          ))}
        </ul>
        <div className="text-muted-foreground mt-4 flex items-center gap-4 text-[10px]">
          <span className="flex items-center gap-1.5">
            <span className="bg-success h-2 w-3 rounded-sm" aria-hidden /> recettes
          </span>
          <span className="flex items-center gap-1.5">
            <span className="bg-danger h-2 w-3 rounded-sm" aria-hidden /> dépenses
          </span>
        </div>
      </section>

      {/* Répartition des dépenses du mois */}
      <section className="border-border bg-surface rounded-xl border p-4 lg:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-headings text-foreground text-sm font-bold">
            Dépenses de {libelleMois(moisCourant.cle)}
          </h2>
          <Link href="/depenses" className="text-primary text-xs font-medium">
            {t('Saisir')}
          </Link>
        </div>
        {repartition.length === 0 ? (
          <p className="text-muted-foreground text-xs">
            Aucune dépense enregistrée ce mois-ci.{' '}
            <Link href="/depenses" className="text-primary underline">
              {t('En ajouter une')}
            </Link>
            .
          </p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {repartition.map((r) => (
              <li key={r.poste}>
                <div className="mb-1 flex items-center justify-between gap-3">
                  <span className="text-foreground text-xs">{libellePoste(r.poste)}</span>
                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {formatPrice(r.montant, 'F')} · {r.pourcentage}%
                  </span>
                </div>
                <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${r.pourcentage}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Prévision */}
      <section className="border-primary/40 bg-surface rounded-xl border p-4 lg:p-5">
        <h2 className="font-headings text-foreground mb-1 text-sm font-bold">{t('Prévision')}</h2>
        <p className="text-muted-foreground mb-4 text-xs">
          {t(
            'Entrées attendues d’après le reste à payer de vos commandes, sorties d’après vos charges déclarées. Ce n’est pas un constat.',
          )}
        </p>

        <ul className="mb-4 flex flex-col gap-2">
          {prevision.mois.map((m) => (
            <li
              key={m.cle}
              className="border-border bg-background flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
            >
              <div className="min-w-0">
                <div className="text-foreground text-xs font-medium">
                  {libelleMois(m.cle)}
                  {m.partiel && (
                    <span className="text-muted-foreground font-normal">
                      {' '}
                      {t('— reste du mois')}
                    </span>
                  )}
                </div>
                <div className="text-muted-foreground mt-0.5 text-[10px]">
                  +{formatPrice(m.encaissements, 'F')} attendus · −{formatPrice(m.charges, 'F')} de
                  charges
                </div>
              </div>
              <div className="text-right">
                <div
                  className={cn(
                    'font-headings text-sm font-bold',
                    m.soldeProjete < 0 ? 'text-danger' : 'text-foreground',
                  )}
                >
                  {formatPrice(m.soldeProjete, 'F')}
                </div>
                <div className="text-muted-foreground text-[10px]">{t('solde projeté')}</div>
              </div>
            </li>
          ))}
        </ul>

        {prevision.mois.some((m) => m.soldeProjete < 0) && (
          <p className="border-danger/40 bg-danger/10 text-danger mb-4 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs">
            <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" aria-hidden />
            {t('La caisse passe sous zéro dans les mois qui viennent si rien ne change.')}
          </p>
        )}

        {prevision.enRetard.nombre > 0 && (
          <p className="text-muted-foreground mb-3 text-xs">
            <span className="text-warning font-bold">
              {formatPrice(prevision.enRetard.montant, 'F')}
            </span>{' '}
            attendus sur {prevision.enRetard.nombre} commande
            {prevision.enRetard.nombre > 1 ? 's' : ''} dont l’échéance est dépassée. C’est souvent
            ce qui explique un solde plus bas que prévu.
          </p>
        )}

        {prevision.sansEcheance.nombre > 0 && (
          <p className="text-muted-foreground text-xs">
            {formatPrice(prevision.sansEcheance.montant, 'F')} restent à encaisser sur{' '}
            {prevision.sansEcheance.nombre} commande
            {prevision.sansEcheance.nombre > 1 ? 's' : ''} sans date de livraison — impossible de
            les placer sur le calendrier.
          </p>
        )}
      </section>

      {/* Charges fixes */}
      <section className="border-border bg-surface rounded-xl border p-4 lg:p-5">
        <div className="mb-1 flex items-center justify-between gap-3">
          <h2 className="font-headings text-foreground text-sm font-bold">{t('Charges fixes')}</h2>
          <span className="text-muted-foreground text-xs">
            {formatPrice(prevision.chargesMensuelles, 'F')} / mois
          </span>
        </div>
        <p className="text-muted-foreground mb-4 text-xs">
          {t(
            'Déclarées une fois, elles alimentent la prévision. Elles n’écrivent rien en caisse : c’est la saisie d’une dépense qui fait bouger le solde.',
          )}
        </p>

        {charges.length === 0 ? (
          <p className="text-muted-foreground mb-4 text-xs">
            {t('Aucune charge déclarée — la prévision ne compte donc aucune sortie.')}
          </p>
        ) : (
          <ul className="mb-4 flex flex-col gap-2">
            {charges.map((c) => (
              <li
                key={c.id}
                className="border-border bg-background flex items-center gap-3 rounded-lg border px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <div
                    className={cn(
                      'truncate text-xs font-medium',
                      c.active ? 'text-foreground' : 'text-muted-foreground line-through',
                    )}
                  >
                    {c.label}
                  </div>
                  <div className="text-muted-foreground text-[10px]">
                    {libellePoste(c.category)} · le {c.dayOfMonth} du mois
                  </div>
                </div>
                <span className="text-foreground text-xs font-bold whitespace-nowrap">
                  {formatPrice(c.amount, 'F')}
                </span>
                <button
                  type="button"
                  onClick={() => void basculer(c.id, !c.active).then(recharger)}
                  className="text-muted-foreground hover:text-foreground flex h-8 items-center rounded-md px-2 text-[10px] transition-colors"
                >
                  {c.active ? 'Suspendre' : 'Réactiver'}
                </button>
                <button
                  type="button"
                  onClick={() => void supprimerCharge(c.id).then(recharger)}
                  aria-label={`Supprimer « ${c.label} »`}
                  className="text-muted-foreground hover:text-danger flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md transition-colors"
                >
                  <Trash2 size={14} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}

        <Button variante="contour" onClick={() => setOuvert(true)}>
          <Plus size={14} aria-hidden />
          {t('Déclarer une charge')}
        </Button>
      </section>

      {fenetreCharge}
    </div>
  );
}
