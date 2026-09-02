'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { AlertCircle, Check, Plus, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Field, SelectField } from '@/components/ui/Field';
import { MODES, libelleMode } from '@/lib/tresorerie';
import { aujourdhuiIso, useMouvements } from '@/lib/useTresorerie';
import { cn, formatPrice } from '@/lib/utils';
import { useLangue } from '@/contexts/LangueContext';
import { ETIQUETTE_INTL, type Langue } from '@/lib/langue';

export interface PaiementsCommandeProps {
  /** Identifiant de la commande — clé du journal des encaissements. */
  commandeId: string;
  /** Montant total dû, en francs CFA. */
  montant: number;
  /** Somme déjà encaissée, telle que la commande la porte. */
  encaisse: number;
}

/**
 * « 2026-08-23 » → « 23 août », dans la langue de l’écran.
 *
 * Remplace un tableau de mois français : le journal des versements gardait ses
 * « août » et « déc. » au milieu d’un écran arabe.
 */
function jourLisible(iso: string, langue: Langue): string {
  const [a, m, j] = iso.split('-').map(Number);
  if (!a || !m || !j) return iso;
  return new Intl.DateTimeFormat(ETIQUETTE_INTL[langue], {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(a, m - 1, j)));
}

/**
 * Encaissements d'une commande.
 *
 * Cet écran affichait jusqu'ici un jeu simulé : ce qu'on y saisissait
 * disparaissait au rechargement, et la trésorerie n'avait aucune recette à
 * compter. Chaque versement écrit désormais une entrée dans le journal de
 * caisse, et le serveur recale l'acompte de la commande dans la même
 * transaction — le montant affiché ici et celui de la liste des commandes ne
 * peuvent plus se contredire.
 *
 * Le total encaissé se lit sur le journal, pas sur la propriété reçue : après
 * un ajout, la commande parente n'est pas rechargée, seul le journal l'est.
 */
export default function PaiementsCommande({
  commandeId,
  montant,
  encaisse,
}: PaiementsCommandeProps) {
  const { t, langue } = useLangue();
  const filtres = useMemo(() => ({ commande: commandeId }), [commandeId]);
  const { mouvements, chargement, erreur, ajouter, supprimer } = useMouvements(filtres);

  const [ouvert, setOuvert] = useState(false);
  const [saisi, setSaisi] = useState('');
  const [date, setDate] = useState(aujourdhuiIso);
  const [mode, setMode] = useState<string>(MODES[0].cle);
  const [envoi, setEnvoi] = useState(false);
  const [erreurForm, setErreurForm] = useState<string | null>(null);

  // Le journal fait foi dès qu'il est chargé ; la propriété sert de valeur
  // d'attente pour éviter que la barre ne parte de zéro à chaque affichage.
  const total = chargement ? encaisse : mouvements.reduce((s, m) => s + m.amount, 0);
  const restant = Math.max(montant - total, 0);
  const pourcentage = montant > 0 ? Math.min(Math.round((total / montant) * 100), 100) : 0;

  async function enregistrer(e: FormEvent) {
    e.preventDefault();
    setErreurForm(null);

    const valeur = Number.parseInt(saisi, 10);
    if (Number.isNaN(valeur) || valeur <= 0) {
      setErreurForm('Le montant doit être un nombre supérieur à zéro.');
      return;
    }

    setEnvoi(true);
    const echec = await ajouter({
      direction: 'IN',
      amount: valeur,
      occurredAt: date,
      method: mode,
      label: `Versement — ${libelleMode(mode)}`,
      tailoringOrderId: commandeId,
    });
    setEnvoi(false);

    if (echec) {
      setErreurForm(echec);
      return;
    }
    setSaisi('');
    setOuvert(false);
  }

  return (
    <section className="border-border border-b px-4 py-5 lg:px-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-headings text-foreground text-sm font-bold">{t('Paiements')}</h2>
        <span className="text-muted-foreground text-xs">{formatPrice(montant, 'F')} dû</span>
      </div>

      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-muted-foreground text-xs">{t('Encaissé')}</span>
          <span className="text-success text-xs font-medium">
            {formatPrice(total, 'F')}
            {restant > 0 && (
              <span className="text-muted-foreground"> · reste {formatPrice(restant, 'F')}</span>
            )}
          </span>
        </div>
        <div
          className="bg-border h-2 overflow-hidden rounded-full"
          role="progressbar"
          aria-valuenow={pourcentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t('Part du montant encaissée')}
        >
          <div className="bg-success h-full rounded-full" style={{ width: `${pourcentage}%` }} />
        </div>
      </div>

      {erreur && (
        <p role="alert" className="text-danger mb-3 flex items-start gap-2 text-xs">
          <AlertCircle size={13} className="mt-0.5 flex-shrink-0" aria-hidden />
          {t(erreur)}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {chargement ? (
          <p className="text-muted-foreground text-xs">{t('Chargement des versements…')}</p>
        ) : mouvements.length === 0 ? (
          <p className="text-muted-foreground text-xs">
            {t('Aucun versement enregistré. La commande est entièrement due.')}
          </p>
        ) : (
          mouvements.map((p) => (
            <div
              key={p.id}
              className="border-border bg-surface flex items-center gap-3 rounded-lg border px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <div className="text-foreground text-xs font-medium">{p.label}</div>
                <div className="text-muted-foreground text-xs">
                  {jourLisible(p.occurredAt, langue)} · {libelleMode(p.method)}
                  {p.backfilled && (
                    <span className="text-warning"> {t('· date reconstituée')}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-shrink-0 flex-col items-end">
                <span className="text-foreground text-sm font-bold">
                  {formatPrice(p.amount, 'F')}
                </span>
                <span className="text-success flex items-center gap-1 text-xs font-medium">
                  <Check size={10} aria-hidden />
                  {t('Encaissé')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => void supprimer(p.id)}
                aria-label={`Annuler le versement de ${formatPrice(p.amount, 'F')}`}
                className={cn(
                  'text-muted-foreground hover:text-danger flex h-8 w-8 flex-shrink-0',
                  'items-center justify-center rounded-md transition-colors',
                )}
              >
                <Trash2 size={14} aria-hidden />
              </button>
            </div>
          ))
        )}
      </div>

      <Button
        variante="contour"
        taille="sm"
        pleineLargeur
        className="mt-3"
        disabled={restant === 0}
        onClick={() => {
          setSaisi(restant > 0 ? String(restant) : '');
          setOuvert(true);
        }}
      >
        <Plus size={12} aria-hidden />
        {restant === 0 ? t('Commande soldée') : 'Enregistrer un versement'}
      </Button>

      <Modal
        ouvert={ouvert}
        onFermer={() => setOuvert(false)}
        titre={t('Enregistrer un versement')}
        description={`Reste à encaisser : ${formatPrice(restant, 'F CFA')}. Le versement entre aussitôt en trésorerie.`}
      >
        <form onSubmit={enregistrer} className="flex flex-col gap-4">
          <Field
            label={t('Montant (F CFA)')}
            type="number"
            inputMode="numeric"
            min={1}
            max={restant}
            required
            value={saisi}
            onChange={(e) => setSaisi(e.target.value)}
          />
          <Field
            label={t('Date de l’encaissement')}
            type="date"
            required
            aide={t('Le jour où l’argent est entré, pas celui de la saisie.')}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <SelectField
            label={t('Réglé par')}
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            {MODES.map((m) => (
              <option key={m.cle} value={m.cle}>
                {t(m.label)}
              </option>
            ))}
          </SelectField>

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
    </section>
  );
}
