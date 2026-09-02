'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { AlertCircle, ChevronLeft, ChevronRight, Lock, Plus, Trash2, Wallet } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Field, SelectField, TextareaField } from '@/components/ui/Field';
import { MODES, POSTES, libelleMode, libelleMois, libellePoste, moisIso } from '@/lib/tresorerie';
import { aujourdhuiIso, useMouvements } from '@/lib/useTresorerie';
import { cn, formatPrice } from '@/lib/utils';
import { useT } from '@/contexts/LangueContext';

/** Décale une clé « AAAA-MM » de `n` mois. */
function decaler(cle: string, n: number): string {
  const [a, m] = cle.split('-').map(Number);
  return moisIso(new Date(a ?? 1970, (m ?? 1) - 1 + n, 1));
}

/** « 2026-08-23 » → « 23 août ». */
const MOIS_COURTS = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
];
function jourLisible(iso: string): string {
  const [, m, j] = iso.split('-');
  return `${Number(j)} ${MOIS_COURTS[Number(m) - 1] ?? ''}`;
}

/**
 * Saisie et historique des dépenses de l'atelier.
 *
 * Le poste est obligatoire, et c'est délibéré : une dépense sans poste gonfle
 * le total du mois sans jamais expliquer où l'argent est parti. Mieux vaut un
 * choix de plus à la saisie qu'un « divers » de 200 000 F en fin de mois.
 *
 * Aucun repli sur des données d'exemple — même règle que les rapports et la
 * trésorerie : un chiffre d'argent est exact ou absent.
 */
export default function Depenses() {
  const t = useT();
  const [mois, setMois] = useState(() => moisIso(new Date()));
  const [poste, setPoste] = useState('');

  const filtres = useMemo(
    () => ({ mois, sens: 'OUT' as const, ...(poste ? { poste } : {}) }),
    [mois, poste],
  );
  const { mouvements, chargement, erreur, session, ajouter, supprimer } = useMouvements(filtres);

  const [ouvert, setOuvert] = useState(false);
  const [montant, setMontant] = useState('');
  const [date, setDate] = useState(aujourdhuiIso);
  const [posteSaisi, setPosteSaisi] = useState<string>(POSTES[0].cle);
  const [mode, setMode] = useState<string>(MODES[0].cle);
  const [libelle, setLibelle] = useState('');
  const [note, setNote] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [erreurForm, setErreurForm] = useState<string | null>(null);

  const total = mouvements.reduce((s, m) => s + m.amount, 0);

  const parPoste = useMemo(() => {
    const carte = new Map<string, number>();
    for (const m of mouvements) {
      const cle = m.category ?? 'DIVERS';
      carte.set(cle, (carte.get(cle) ?? 0) + m.amount);
    }
    return [...carte.entries()].sort((a, b) => b[1] - a[1]);
  }, [mouvements]);

  async function enregistrer(e: FormEvent) {
    e.preventDefault();
    setErreurForm(null);

    const valeur = Number.parseInt(montant, 10);
    if (Number.isNaN(valeur) || valeur <= 0) {
      setErreurForm('Le montant doit être un nombre supérieur à zéro.');
      return;
    }

    setEnvoi(true);
    const echec = await ajouter({
      direction: 'OUT',
      amount: valeur,
      occurredAt: date,
      category: posteSaisi,
      method: mode,
      label: libelle.trim(),
      ...(note.trim() ? { notes: note.trim() } : {}),
    });
    setEnvoi(false);

    if (echec) {
      setErreurForm(echec);
      return;
    }
    setMontant('');
    setLibelle('');
    setNote('');
    setOuvert(false);
  }

  // Déclarée avant les retours anticipés et rendue par toutes les branches :
  // sur un atelier qui n'a encore aucune dépense, c'est la branche « liste
  // vide » qui s'affiche — si la fenêtre ne vivait qu'en bas du rendu
  // principal, le tout premier bouton de l'écran ne ferait rien.
  const fenetreSaisie = (
    <Modal
      ouvert={ouvert}
      onFermer={() => setOuvert(false)}
      titre={t('Enregistrer une dépense')}
      description={t('La date est celle où l’argent est sorti, pas celle de la saisie.')}
    >
      <form onSubmit={enregistrer} className="flex flex-col gap-4">
        <Field
          label={t('Montant (F CFA)')}
          type="number"
          inputMode="numeric"
          min={1}
          required
          placeholder="15000"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
        />
        <Field
          label={t('Date du décaissement')}
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <SelectField
          label={t('Poste')}
          required
          value={posteSaisi}
          onChange={(e) => setPosteSaisi(e.target.value)}
        >
          {POSTES.map((p) => (
            <option key={p.cle} value={p.cle}>
              {t(p.label)}
            </option>
          ))}
        </SelectField>
        <SelectField label={t('Réglé par')} value={mode} onChange={(e) => setMode(e.target.value)}>
          {MODES.map((m) => (
            <option key={m.cle} value={m.cle}>
              {t(m.label)}
            </option>
          ))}
        </SelectField>
        <Field
          label={t('Libellé')}
          required
          maxLength={160}
          placeholder={t('Wax 6 yards — marché de Rood Woko')}
          value={libelle}
          onChange={(e) => setLibelle(e.target.value)}
        />
        <TextareaField
          label={t('Note (facultatif)')}
          rows={2}
          maxLength={500}
          value={note}
          onChange={(e) => setNote(e.target.value)}
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
            {envoi ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </Modal>
  );

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <Lock size={26} className="text-muted-foreground mb-3" aria-hidden />
        <p className="text-foreground mb-1 text-sm font-bold">{t('Dépenses indisponibles')}</p>
        <p className="text-muted-foreground max-w-md text-xs">
          {t(
            'Les dépenses de votre atelier ne s’affichent qu’une fois connecté. Aucun jeu d’exemple n’est proposé ici : un chiffre d’argent inventé n’aiderait personne.',
          )}
        </p>
        <Link href="/connexion" className="text-primary mt-4 text-sm font-medium">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 px-4 py-5 lg:px-6">
      {/* Sélecteur de mois + total */}
      <section className="border-border bg-surface rounded-xl border p-4 lg:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setMois((m) => decaler(m, -1))}
            className="border-border text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-md border transition-colors"
            aria-label={t('Mois précédent')}
          >
            <ChevronLeft size={16} aria-hidden />
          </button>
          <span className="font-headings text-foreground text-sm font-bold">
            {libelleMois(mois)}
          </span>
          <button
            type="button"
            onClick={() => setMois((m) => decaler(m, 1))}
            className="border-border text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-md border transition-colors"
            aria-label={t('Mois suivant')}
          >
            <ChevronRight size={16} aria-hidden />
          </button>
        </div>

        <div className="text-center">
          <div className="text-muted-foreground mb-1 text-xs">{t('Total des dépenses')}</div>
          <div className="font-headings text-danger text-3xl font-bold">
            {chargement ? '—' : formatPrice(total, 'F')}
          </div>
          <div className="text-muted-foreground mt-1 text-xs">
            {chargement
              ? 'Chargement…'
              : `${mouvements.length} écriture${mouvements.length > 1 ? 's' : ''}`}
          </div>
        </div>
      </section>

      {/* Répartition par poste */}
      {parPoste.length > 0 && (
        <section className="border-border bg-surface rounded-xl border p-4 lg:p-5">
          <h2 className="font-headings text-foreground mb-3 text-sm font-bold">{t('Par poste')}</h2>
          <ul className="flex flex-col gap-2.5">
            {parPoste.map(([cle, montantPoste]) => {
              const pourcentage = total > 0 ? Math.round((montantPoste / total) * 100) : 0;
              return (
                <li key={cle}>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <span className="text-foreground text-xs">{libellePoste(cle)}</span>
                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      {formatPrice(montantPoste, 'F')} · {pourcentage}%
                    </span>
                  </div>
                  <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${pourcentage}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Filtre par poste + saisie */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={poste}
          onChange={(e) => setPoste(e.target.value)}
          aria-label={t('Filtrer par poste')}
          className="border-border bg-input text-foreground rounded-md border px-3 py-2 text-xs"
        >
          <option value="">{t('Tous les postes')}</option>
          {POSTES.map((p) => (
            <option key={p.cle} value={p.cle}>
              {t(p.label)}
            </option>
          ))}
        </select>
        <Button onClick={() => setOuvert(true)} className="ml-auto">
          <Plus size={14} aria-hidden />
          {t('Enregistrer une dépense')}
        </Button>
      </div>

      {erreur && (
        <p role="alert" className="text-danger flex items-start gap-2 text-sm">
          <AlertCircle size={15} className="mt-0.5 flex-shrink-0" aria-hidden />
          {erreur}
        </p>
      )}

      {/* Journal */}
      {chargement ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          {t('Chargement du journal…')}
        </p>
      ) : mouvements.length === 0 ? (
        <div className="border-border flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center">
          <Wallet size={24} className="text-muted-foreground mb-3" aria-hidden />
          <p className="text-foreground mb-1 text-sm font-bold">
            Aucune dépense en {libelleMois(mois)}
          </p>
          <p className="text-muted-foreground mb-4 max-w-sm text-xs">
            {t(
              'Enregistrez vos achats de tissu, salaires et charges au fur et à mesure : la trésorerie s’en déduit toute seule.',
            )}
          </p>
          <Button onClick={() => setOuvert(true)}>
            <Plus size={14} aria-hidden />
            {t('Enregistrer une dépense')}
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {mouvements.map((m) => (
            <li
              key={m.id}
              className="border-border bg-surface flex items-center gap-3 rounded-lg border p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="text-foreground truncate text-sm font-medium">{m.label}</div>
                <div className="text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-2 text-xs">
                  <span>{jourLisible(m.occurredAt)}</span>
                  <span aria-hidden>·</span>
                  <span>{libellePoste(m.category)}</span>
                  <span aria-hidden>·</span>
                  <span>{libelleMode(m.method)}</span>
                </div>
                {m.notes && <p className="text-muted-foreground mt-1 text-xs">{m.notes}</p>}
              </div>
              <span className="text-danger text-sm font-bold whitespace-nowrap">
                −{formatPrice(m.amount, 'F')}
              </span>
              <button
                type="button"
                onClick={() => void supprimer(m.id)}
                aria-label={`Supprimer « ${m.label} »`}
                className={cn(
                  'text-muted-foreground hover:text-danger flex h-9 w-9 flex-shrink-0',
                  'items-center justify-center rounded-md transition-colors',
                )}
              >
                <Trash2 size={15} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {fenetreSaisie}
    </div>
  );
}
