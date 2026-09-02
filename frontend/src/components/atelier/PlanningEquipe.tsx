'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Plus, TriangleAlert } from 'lucide-react';
import AppShell from '@/components/atelier/AppShell';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Field, SelectField } from '@/components/ui/Field';
import { HEURES_PAR_JOUR, STATUTS_TACHE, styleTache, type StatutTache } from '@/lib/mock/atelier';
import { useArtisans } from '@/lib/useArtisans';
import { usePlanning, type JourSemaine, type TachePlanifiee } from '@/lib/usePlanning';
import { cn } from '@/lib/utils';
import { useT } from '@/contexts/LangueContext';

/** Largeur d'une colonne-jour dans la grille desktop (px, comme la maquette). */
const LARGEUR_COLONNE = 160;

function tachesDe(liste: TachePlanifiee[], initiales: string, iso: string) {
  return liste.filter((t) => t.assignee === initiales && t.iso === iso);
}

/**
 * Charge d'un artisan rapportée à SA capacité : un apprenti à 6 h n'est pas
 * jugé sur la journée de 8 h d'un tailleur senior.
 */
function charge(heures: number, capacite: number) {
  const plafond = capacite > 0 ? capacite : HEURES_PAR_JOUR;
  const sature = heures >= plafond;
  const tendu = heures >= plafond * 0.75 && !sature;
  return {
    sature,
    couleur: sature ? 'bg-danger' : tendu ? 'bg-warning' : 'bg-success',
    pourcentage: Math.min(Math.round((heures / plafond) * 100), 100),
  };
}

const MOIS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

/**
 * « Semaine du 17 au 22 août 2026 » — et « du 30 juin au 5 juillet 2026 »
 * quand la semaine enjambe deux mois, cas que la maquette n'envisageait pas.
 */
function libelleSemaine(jours: JourSemaine[]): string {
  const premier = jours[0];
  const dernier = jours[jours.length - 1];
  if (!premier || !dernier) return '';
  // La semaine d'exemple n'a pas de vraies dates : on garde le libellé Banani.
  if (premier.iso.startsWith('exemple-')) return `Semaine du ${premier.date} au ${dernier.date}`;

  const [aD, mD] = premier.iso.split('-').map(Number);
  const [aF, mF] = dernier.iso.split('-').map(Number);
  const moisDebut = MOIS[(mD ?? 1) - 1] ?? '';
  const moisFin = MOIS[(mF ?? 1) - 1] ?? '';

  const debut = mD === mF && aD === aF ? premier.date : `${premier.date} ${moisDebut}`;
  return `Semaine du ${debut} au ${dernier.date} ${moisFin} ${aF}`;
}

/** « Août 2026 » pour la pastille de navigation entre semaines. */
function libelleMois(jours: JourSemaine[]): string {
  const dernier = jours[jours.length - 1];
  if (!dernier || dernier.iso.startsWith('exemple-')) return '';
  const [annee, mois] = dernier.iso.split('-').map(Number);
  const nom = MOIS[(mois ?? 1) - 1] ?? '';
  return `${nom.charAt(0).toUpperCase()}${nom.slice(1)} ${annee}`;
}

/**
 * Planning hebdomadaire de l'équipe.
 * Sources Banani : screens/new_screen2.jsx (grille desktop) et
 * screens/MobilePlanningEquipe.jsx (vue mobile).
 *
 * Une grille de 6 jours × 5 artisans est illisible sous 1024px : sur mobile on
 * sélectionne un jour et l'on déroule la charge de chaque artisan pour ce jour.
 *
 * Les jours viennent du serveur (`/api/planning`) et non d'un tableau figé : la
 * maquette numérotait les colonnes de 0 à 5, ce qui donnait un planning faux
 * dès la semaine suivante.
 */
export default function PlanningEquipe() {
  const t = useT();
  const {
    semaine,
    taches,
    source,
    chargement,
    erreur,
    affecter,
    decaler,
    revenirAujourdhui,
    decale,
  } = usePlanning();

  const { artisans, chargement: chargementEquipe } = useArtisans();
  /** Seuls les artisans actifs occupent une ligne : un partant ne doit plus recevoir de tâche. */
  const equipe = artisans.filter((a) => a.actif);

  const [jourActif, setJourActif] = useState(0);

  // Affectation d'une tâche — écran absent des maquettes Banani, qui montrent
  // le bouton sans destination.
  const [affectationOuverte, setAffectationOuverte] = useState(false);
  const [artisanChoisi, setArtisanChoisi] = useState('');
  const [jourChoisi, setJourChoisi] = useState('');
  const [libelle, setLibelle] = useState('');
  const [duree, setDuree] = useState('3');
  const [statutChoisi, setStatutChoisi] = useState<StatutTache>('Planifié');
  const [envoi, setEnvoi] = useState(false);
  const [echec, setEchec] = useState<string | null>(null);

  // L'équipe arrive elle aussi après le premier rendu : on cale le choix par
  // défaut du formulaire sur le premier artisan actif dès qu'il est connu.
  useEffect(() => {
    if (equipe.length === 0) return;
    setArtisanChoisi((prec) => prec || (equipe[0]?.initiales ?? ''));
  }, [equipe]);

  // La semaine arrive après le premier rendu : on cale la sélection sur
  // aujourd'hui dès qu'elle est connue, sans écraser un choix de l'utilisateur.
  useEffect(() => {
    if (semaine.length === 0) return;
    const index = Math.max(
      0,
      semaine.findIndex((j) => j.aujourdhui),
    );
    setJourActif(index);
    setJourChoisi((prec) => prec || (semaine[index]?.iso ?? ''));
  }, [semaine]);

  async function soumettre(e: FormEvent) {
    e.preventDefault();
    const heures = Number.parseInt(duree, 10);
    if (!libelle.trim() || Number.isNaN(heures) || heures <= 0 || !jourChoisi) return;

    setEnvoi(true);
    setEchec(null);
    const message = await affecter({
      assignee: artisanChoisi,
      iso: jourChoisi,
      duree: heures,
      label: libelle.trim(),
      statut: statutChoisi,
    });
    setEnvoi(false);

    if (message) {
      setEchec(message);
      return;
    }
    setLibelle('');
    setAffectationOuverte(false);
  }

  /** Heures déjà engagées pour l'artisan et le jour sélectionnés dans le formulaire. */
  const chargeCible = tachesDe(taches, artisanChoisi, jourChoisi).reduce((s, t) => s + t.duree, 0);
  /** Capacité de l'artisan visé — le plafond n'est plus le même pour tous. */
  const capaciteCible =
    equipe.find((a) => a.initiales === artisanChoisi)?.capacite ?? HEURES_PAR_JOUR;

  // L'en-tête vit ici plutôt que dans la page serveur : le libellé de semaine
  // et les flèches doivent lire la MÊME semaine que la grille. Séparés, ils
  // affichaient « Jan 2025 » au-dessus d'un planning d'août.
  const navigationDesactivee = source === 'demonstration';
  const entete = {
    titre: 'Planning équipe',
    sousTitre: chargement && semaine.length === 0 ? 'Chargement…' : libelleSemaine(semaine),
    actions: (
      <>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground px-2 py-2 disabled:opacity-40"
          aria-label={t('Semaine précédente')}
          disabled={navigationDesactivee}
          onClick={() => decaler(-1)}
        >
          <ChevronLeft size={16} aria-hidden />
        </button>
        <button
          type="button"
          className={cn(
            'text-foreground text-sm font-medium',
            decale && 'text-primary underline underline-offset-4',
          )}
          onClick={revenirAujourdhui}
          // Revenir à la semaine en cours n'a de sens que si l'on s'en est éloigné.
          disabled={!decale}
          title={decale ? 'Revenir à la semaine en cours' : undefined}
        >
          {libelleMois(semaine)}
        </button>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground px-2 py-2 disabled:opacity-40"
          aria-label={t('Semaine suivante')}
          disabled={navigationDesactivee}
          onClick={() => decaler(1)}
        >
          <ChevronRight size={16} aria-hidden />
        </button>
      </>
    ),
  };

  if (chargement || chargementEquipe) {
    return (
      <AppShell {...entete}>
        <p className="text-muted-foreground p-12 text-center text-sm">
          {t('Chargement du planning…')}
        </p>
      </AppShell>
    );
  }

  // Sans équipe, la grille n'a aucune ligne à afficher : on renvoie vers
  // l'endroit où l'on compose l'équipe plutôt que de montrer un tableau vide.
  if (equipe.length === 0) {
    return (
      <AppShell {...entete}>
        <div className="flex flex-col items-center gap-3 p-12 text-center">
          <p className="text-foreground text-sm font-medium">{t('Aucun artisan actif')}</p>
          <p className="text-muted-foreground max-w-sm text-xs">
            {t(
              'Le planning se remplit par artisan. Composez votre équipe pour commencer à affecter des tâches.',
            )}
          </p>
          <Link href="/parametres">
            <Button>{t('Composer l’équipe')}</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  if (erreur) {
    return (
      <AppShell {...entete}>
        <p className="text-danger flex items-center justify-center gap-2 p-12 text-center text-sm">
          <TriangleAlert size={15} aria-hidden />
          {erreur}
        </p>
      </AppShell>
    );
  }

  const jourSelectionne: JourSemaine | undefined = semaine[jourActif];

  return (
    <AppShell {...entete}>
      <div className="flex min-h-full flex-col">
        {/* Légende + affectation */}
        <div className="border-border bg-background flex items-center gap-4 border-b px-4 py-2.5 lg:px-8">
          <div className="flex flex-1 items-center gap-4 overflow-x-auto">
            <span className="text-muted-foreground flex-shrink-0 text-xs">{t('Légende :')}</span>
            {STATUTS_TACHE.map((s) => (
              <span key={s} className="flex flex-shrink-0 items-center gap-1.5">
                <span className={cn('h-3 w-3 rounded-sm', styleTache[s])} aria-hidden />
                <span className="text-muted-foreground text-xs">{t(s)}</span>
              </span>
            ))}
            {source === 'demonstration' && (
              <span className="text-warning flex-shrink-0 text-xs">· exemples</span>
            )}
          </div>
          <Button taille="sm" className="flex-shrink-0" onClick={() => setAffectationOuverte(true)}>
            <Plus size={12} aria-hidden />
            {t('Affecter tâche')}
          </Button>
        </div>

        {/* ================= Mobile : un jour à la fois ================= */}
        <div className="lg:hidden">
          <div className="border-border flex gap-1 overflow-x-auto border-b px-4 py-3">
            {semaine.map((j, i) => (
              <button
                key={j.iso}
                type="button"
                onClick={() => setJourActif(i)}
                aria-pressed={i === jourActif}
                className={cn(
                  'flex min-w-14 flex-shrink-0 flex-col items-center gap-0.5 rounded-md px-3 py-2',
                  i === jourActif
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                <span className="text-xs tracking-wide uppercase">{j.jour}</span>
                <span className="font-headings text-lg font-bold">{j.date}</span>
              </button>
            ))}
          </div>

          <ul className="flex flex-col">
            {equipe.map((a) => {
              const duJour = tachesDe(taches, a.initiales, jourSelectionne?.iso ?? '');
              const heures = duJour.reduce((s, t) => s + t.duree, 0);
              const { couleur, pourcentage } = charge(heures, a.capacite);

              return (
                <li key={a.id} className="border-border border-b px-4 py-3">
                  <div className="mb-2 flex items-center gap-3">
                    <Avatar initiales={a.initiales} taille="md" />
                    <div className="min-w-0 flex-1">
                      <div className="text-foreground truncate text-sm font-medium">{a.nom}</div>
                      <div className="text-muted-foreground text-xs">{a.role}</div>
                    </div>
                    <span className="text-muted-foreground flex-shrink-0 text-xs">
                      {heures}/{a.capacite}h
                    </span>
                  </div>

                  <div className="bg-border mb-2 h-1 overflow-hidden rounded-full">
                    <div
                      className={cn('h-full rounded-full', couleur)}
                      style={{ width: `${pourcentage}%` }}
                    />
                  </div>

                  {duJour.length === 0 ? (
                    <p className="text-muted-foreground text-xs">{t('Libre')}</p>
                  ) : (
                    <ul className="flex flex-col gap-1">
                      {duJour.map((tache) => (
                        <li
                          key={tache.id}
                          className={cn('rounded-sm px-2 py-1.5', styleTache[tache.statut])}
                        >
                          <div className="text-xs leading-tight font-medium">{tache.label}</div>
                          <div className="text-xs opacity-70">
                            {tache.duree}h · {t(tache.statut)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* ================= Desktop : grille hebdomadaire ================= */}
        <div className="hidden flex-1 flex-col overflow-x-auto lg:flex">
          {/* Entête des jours */}
          <div className="border-border bg-surface flex flex-shrink-0 border-b">
            <div className="border-border w-48 flex-shrink-0 border-r px-4 py-3">
              <span className="text-muted-foreground text-xs tracking-wide uppercase">
                {t('Artisan')}
              </span>
            </div>
            {semaine.map((j) => (
              <div
                key={j.iso}
                className={cn(
                  'border-border flex flex-shrink-0 flex-col items-center justify-center gap-0.5 border-r px-3 py-3',
                  j.aujourdhui && 'bg-muted',
                )}
                style={{ width: LARGEUR_COLONNE }}
              >
                <span
                  className={cn(
                    'text-xs tracking-wide uppercase',
                    j.aujourdhui ? 'text-primary font-bold' : 'text-muted-foreground',
                  )}
                >
                  {j.jour}
                </span>
                <span
                  className={cn(
                    'font-headings text-lg font-bold',
                    j.aujourdhui ? 'text-primary' : 'text-foreground',
                  )}
                >
                  {j.date}
                </span>
                {j.aujourdhui && (
                  <span className="bg-primary mt-0.5 h-0.5 w-4 rounded-full" aria-hidden />
                )}
              </div>
            ))}
          </div>

          {/* Une ligne par artisan */}
          {equipe.map((a) => (
            <div key={a.id} className="border-border flex min-h-18 border-b">
              <div className="border-border bg-surface flex w-48 flex-shrink-0 items-center gap-3 border-r px-4 py-3">
                <Avatar initiales={a.initiales} taille="sm" className="h-8 w-8" />
                <div className="min-w-0">
                  <div className="text-foreground truncate text-sm font-medium">{a.nom}</div>
                  <div className="text-muted-foreground text-xs">{a.role}</div>
                </div>
              </div>

              {semaine.map((j) => {
                const duJour = tachesDe(taches, a.initiales, j.iso);
                const heures = duJour.reduce((s, t) => s + t.duree, 0);
                const { couleur, pourcentage } = charge(heures, a.capacite);

                return (
                  <div
                    key={j.iso}
                    className={cn(
                      'border-border flex flex-shrink-0 flex-col gap-1 border-r px-2 py-2',
                      j.aujourdhui && 'bg-muted',
                    )}
                    style={{ width: LARGEUR_COLONNE }}
                  >
                    {duJour.length === 0 ? (
                      <div className="flex flex-1 items-center justify-center">
                        <span className="text-muted-foreground text-xs">{t('Libre')}</span>
                      </div>
                    ) : (
                      <>
                        {duJour.map((tache) => (
                          <div
                            key={tache.id}
                            className={cn('min-h-7 rounded-sm px-2 py-1', styleTache[tache.statut])}
                            title={`${tache.label} — ${tache.duree}h · ${t(tache.statut)}`}
                          >
                            <div className="truncate text-xs leading-tight font-medium">
                              {tache.label}
                            </div>
                            <div className="text-xs opacity-70">{tache.duree}h</div>
                          </div>
                        ))}
                        <div className="bg-border mt-0.5 h-1 overflow-hidden rounded-full">
                          <div
                            className={cn('h-full rounded-full', couleur)}
                            style={{ width: `${pourcentage}%` }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Charge totale par jour */}
          <div className="border-border bg-surface flex flex-shrink-0 border-b">
            <div className="border-border w-48 flex-shrink-0 border-r px-4 py-3">
              <span className="text-muted-foreground text-xs tracking-wide uppercase">
                {t('Charge totale')}
              </span>
            </div>
            {semaine.map((j) => {
              const total = taches.filter((t) => t.iso === j.iso).reduce((s, t) => s + t.duree, 0);
              const maximum = equipe.reduce((s, a) => s + a.capacite, 0) || 1;
              const pct = Math.round((total / maximum) * 100);
              const couleur = pct >= 100 ? 'bg-danger' : pct >= 75 ? 'bg-warning' : 'bg-success';

              return (
                <div
                  key={j.iso}
                  className={cn(
                    'border-border flex flex-shrink-0 flex-col justify-center gap-1 border-r px-3 py-3',
                    j.aujourdhui && 'bg-muted',
                  )}
                  style={{ width: LARGEUR_COLONNE }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">
                      {total}/{maximum}h
                    </span>
                    <span className="text-foreground text-xs font-medium">{pct}%</span>
                  </div>
                  <div className="bg-border h-1.5 overflow-hidden rounded-full">
                    <div
                      className={cn('h-full rounded-full', couleur)}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Affectation d'une tâche */}
        <Modal
          ouvert={affectationOuverte}
          onFermer={() => setAffectationOuverte(false)}
          titre={t('Affecter une tâche')}
          description={
            source === 'demonstration'
              ? 'Mode démonstration — la tâche restera à l’écran seulement.'
              : 'La charge de l’artisan se met à jour immédiatement.'
          }
          pied={
            <>
              <Button variante="fantome" onClick={() => setAffectationOuverte(false)}>
                {t('Annuler')}
              </Button>
              <Button
                type="submit"
                form="formulaire-affectation"
                disabled={!libelle.trim() || envoi}
              >
                {envoi ? 'Affectation…' : 'Affecter'}
              </Button>
            </>
          }
        >
          <form id="formulaire-affectation" onSubmit={soumettre} className="flex flex-col gap-4">
            <Field
              label={t('Intitulé de la tâche')}
              required
              autoFocus
              placeholder={t('Robe wax cérémonie — Mariam C.')}
              value={libelle}
              onChange={(e) => setLibelle(e.target.value)}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label={t('Artisan')}
                value={artisanChoisi}
                onChange={(e) => setArtisanChoisi(e.target.value)}
              >
                {equipe.map((a) => (
                  <option key={a.id} value={a.initiales}>
                    {a.nom}
                  </option>
                ))}
              </SelectField>

              <SelectField
                label={t('Jour')}
                value={jourChoisi}
                onChange={(e) => setJourChoisi(e.target.value)}
              >
                {semaine.map((j) => (
                  <option key={j.iso} value={j.iso}>
                    {j.jour} {j.date}
                  </option>
                ))}
              </SelectField>

              <Field
                label={t('Durée (heures)')}
                type="number"
                required
                min={1}
                max={capaciteCible}
                value={duree}
                onChange={(e) => setDuree(e.target.value)}
              />

              <SelectField
                label={t('Statut')}
                value={statutChoisi}
                onChange={(e) => setStatutChoisi(e.target.value as StatutTache)}
              >
                {STATUTS_TACHE.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </SelectField>
            </div>

            {/* Alerte de surcharge : la promesse du produit est de calculer des
              délais réalistes — affecter au-delà de 8 h la casserait en silence.
              Le serveur refuse de son côté (409 DAY_CAPACITY_EXCEEDED) : cet
              avertissement prévient, il ne garde pas la porte. */}
            {chargeCible + Number.parseInt(duree || '0', 10) > capaciteCible && (
              <p className="text-warning text-xs">
                Cette affectation porterait la journée à{' '}
                {chargeCible + Number.parseInt(duree || '0', 10)} h sur {capaciteCible} h —
                l’artisan serait en surcharge.
              </p>
            )}

            {echec && <p className="text-danger text-xs">{echec}</p>}
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}
