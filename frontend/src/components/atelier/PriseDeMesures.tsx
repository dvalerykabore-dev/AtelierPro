'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Check, ChevronDown, Ruler, Save, Scissors, Search, Shirt, X } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import GenreToggle from '@/components/ui/GenreToggle';
import PhotoUpload, { type PhotoEnvoyee } from '@/components/ui/PhotoUpload';
import { useClients } from '@/lib/useClients';
import { useReleveMesures } from '@/lib/useReleveMesures';
import { nombreDeChamps, paletteDe, type Client, type Genre } from '@/lib/mock/atelier';
import { cn } from '@/lib/utils';
import { useLangue } from '@/contexts/LangueContext';

/** Clé d'une mesure : la section lève l'ambiguïté des libellés répétés. */
function cle(section: string, numero: string): string {
  return `${section}::${numero}`;
}

/**
 * Fiche de prise de mesures.
 *
 * Écran absent des maquettes Banani : le flow y renvoyait vers le carnet
 * clients, où les mesures sont en lecture seule. Il manquait un endroit pour
 * *relever* des mesures et photographier le tissu apporté ainsi que le modèle
 * choisi — c'est le geste quotidien de l'atelier.
 *
 * Deux palettes distinctes : 17 lignes pour un homme, 23 pour une femme. Le
 * genre du client la sélectionne automatiquement ; le bouton segmenté permet
 * d'en changer (un tailleur relève parfois une tenue masculine pour une
 * cliente). Chaque palette est scindée en « Haut » et « Bas » — sans ce
 * découpage, la liste féminine ferait 23 champs d'affilée sur un téléphone,
 * et ses libellés répétés (Tour de hanches, Hauteur taille-hanches) seraient
 * indiscernables.
 */
export default function PriseDeMesures() {
  const { t, tp } = useLangue();
  const { clients, source } = useClients();
  const surServeur = source === 'serveur';

  const [clientId, setClientId] = useState<string | null>(null);
  const [genreChoisi, setGenreChoisi] = useState<Genre | null>(null);
  const [recherche, setRecherche] = useState('');
  const [listeOuverte, setListeOuverte] = useState(false);

  /** Valeurs saisies, indexées par `section::numero`. */
  const [valeurs, setValeurs] = useState<Record<string, string>>({});
  const [tissus, setTissus] = useState<PhotoEnvoyee[]>([]);
  const [modele, setModele] = useState<PhotoEnvoyee[]>([]);
  const [notes, setNotes] = useState('');
  const [etat, setEtat] = useState<'saisie' | 'envoi' | 'enregistre' | 'local'>('saisie');
  const [erreur, setErreur] = useState<string | null>(null);

  const client = clients.find((c) => c.id === clientId) ?? clients[0];
  const { charge, enregistrer: envoyerReleve } = useReleveMesures(client?.id ?? null, surServeur);

  // Le genre du client fait foi tant que l'utilisateur n'a pas choisi lui-même.
  // `client?` ici : la garde « aucun client » n'intervient qu'après les hooks,
  // qui doivent tous être appelés inconditionnellement.
  const genre = genreChoisi ?? charge?.genre ?? client?.genre ?? 'Femme';

  // Reprise du dernier relevé : un client qui revient conserve ses mesures, on
  // ne les ressaisit que si elles ont changé.
  useEffect(() => {
    if (!charge) return;
    setValeurs(charge.valeurs);
    setNotes(charge.notes);
    setEtat('saisie');
  }, [charge]);

  const palette = paletteDe(genre);
  const total = nombreDeChamps(palette);

  const visibles = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    if (!terme) return clients;
    return clients.filter((c) => c.nom.toLowerCase().includes(terme));
  }, [clients, recherche]);

  const remplies = palette.reduce(
    (n, s) =>
      n + s.champs.filter((c) => (valeurs[cle(s.titre, c.numero)] ?? '').trim() !== '').length,
    0,
  );

  function majValeur(k: string, v: string) {
    setValeurs((prec) => ({ ...prec, [k]: v }));
    setEtat('saisie');
  }

  function choisirClient(c: Client) {
    setClientId(c.id);
    // Le genre du client redevient la référence : changer de client remet la
    // bonne palette, sans traîner le choix manuel fait pour le précédent.
    setGenreChoisi(null);
    setValeurs({});
    setNotes('');
    setListeOuverte(false);
    setRecherche('');
    setEtat('saisie');
    setErreur(null);
  }

  function changerGenre(g: Genre) {
    if (g === genre) return;
    // Les deux palettes n'ont ni le même nombre ni les mêmes libellés : garder
    // les valeurs déjà saisies les attribuerait à d'autres mesures.
    setGenreChoisi(g);
    setValeurs({});
    setEtat('saisie');
  }

  async function enregistrer() {
    setEtat('envoi');
    setErreur(null);

    const probleme = await envoyerReleve({
      genre,
      valeurs,
      notes,
      // Seules les photos réellement envoyées sur Cloudinary sont transmises :
      // une URL `blob:` locale ne vaudrait rien après rechargement.
      tissus: tissus
        .filter((p) => !p.locale)
        .map((p) => ({ id: p.id, url: p.url, nomFichier: p.nomFichier })),
      modele: modele.find((p) => !p.locale)?.url ?? null,
    });

    if (probleme === null) {
      setEtat('enregistre');
    } else if (probleme === 'demonstration') {
      setEtat('local');
    } else {
      setEtat('saisie');
      setErreur(probleme);
    }
  }

  // Sans client, rien à relever. Une garde unique évite d'éparpiller des
  // valeurs par défaut dans tout le rendu.
  if (!client) {
    return (
      <div className="flex flex-col items-center gap-3 p-12 text-center">
        <p className="text-foreground text-sm font-medium">{t('Aucun client enregistré')}</p>
        <p className="text-muted-foreground max-w-sm text-xs">
          {t(
            'Les mesures se rattachent à un client. Créez-en un depuis le carnet, puis revenez ici.',
          )}
        </p>
        <Link href="/clients">
          <Button>{t('Ouvrir le carnet clients')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-8">
      {/* ---------- Client + palette ---------- */}
      <section className="bg-surface border-border rounded-lg border p-5">
        <h2 className="font-headings text-foreground mb-4 text-sm font-bold">
          {t('Client concerné')}
        </h2>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => setListeOuverte((o) => !o)}
              aria-expanded={listeOuverte}
              className="bg-input border-border hover:border-primary flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-colors"
            >
              <Avatar initiales={client.initiales} taille="md" />
              <div className="min-w-0 flex-1">
                <div className="text-foreground truncate text-sm font-medium">{client.nom}</div>
                <div className="text-muted-foreground text-xs">
                  {client.telephone} · {t(client.genre)}
                </div>
              </div>
              <ChevronDown
                size={16}
                className={cn(
                  'text-muted-foreground flex-shrink-0 transition-transform',
                  listeOuverte && 'rotate-180',
                )}
                aria-hidden
              />
            </button>

            {listeOuverte && (
              <div className="bg-surface border-border absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-md border shadow-lg">
                <div className="border-border bg-input flex items-center gap-2 border-b px-3 py-2">
                  <Search size={13} className="text-muted-foreground flex-shrink-0" aria-hidden />
                  <input
                    autoFocus
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    placeholder={t('Rechercher…')}
                    aria-label={t('Rechercher un client')}
                    className="text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm focus:outline-none"
                  />
                  {recherche && (
                    <button
                      type="button"
                      onClick={() => setRecherche('')}
                      aria-label={t('Effacer')}
                    >
                      <X size={13} className="text-muted-foreground" aria-hidden />
                    </button>
                  )}
                </div>

                {visibles.length === 0 ? (
                  <p className="text-muted-foreground px-3 py-4 text-center text-xs">
                    Aucun client trouvé.{' '}
                    <Link href="/clients" className="text-primary">
                      {t('En créer un')}
                    </Link>
                  </p>
                ) : (
                  visibles.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => choisirClient(c)}
                      className={cn(
                        'border-border hover:bg-muted flex w-full items-center gap-3 border-b px-3 py-2.5 text-left transition-colors',
                        c.id === client.id && 'bg-muted',
                      )}
                    >
                      <Avatar initiales={c.initiales} taille="sm" />
                      <span className="text-foreground min-w-0 flex-1 truncate text-sm">
                        {c.nom}
                      </span>
                      <span className="text-muted-foreground flex-shrink-0 text-xs">
                        {t(c.genre)}
                      </span>
                      {c.id === client.id && (
                        <Check size={14} className="text-primary flex-shrink-0" aria-hidden />
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sélecteur de palette */}
          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-xs">{t('Palette de mesures')}</span>
            <GenreToggle
              valeur={genre}
              onChange={changerGenre}
              taille="md"
              label={t('Palette de mesures')}
            />
            {genre !== client.genre && (
              <p className="text-warning text-xs">
                {t('Palette {palette} sur un client enregistré comme {client}.', {
                  palette: t(genre).toLowerCase(),
                  client: t(client.genre).toLowerCase(),
                })}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-6 xl:flex-row">
        {/* ---------- Mesures ---------- */}
        <section className="bg-surface border-border flex-1 overflow-hidden rounded-lg border">
          <div className="border-border flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3">
            <h2 className="font-headings text-foreground flex items-center gap-2 text-sm font-bold">
              <Ruler size={14} className="text-primary" aria-hidden />
              {t('Mesures {palette}', { palette: t(genre).toLowerCase() })}
            </h2>
            <span className="text-muted-foreground text-xs">
              {t('{remplies}/{total} renseignées', { remplies, total })}
            </span>
          </div>

          {palette.map((section) => (
            <div key={section.titre}>
              <div className="bg-muted border-border flex flex-wrap items-baseline gap-2 border-b px-5 py-2">
                <span className="text-primary text-xs font-bold tracking-wide uppercase">
                  {t(section.titre)}
                </span>
                <span className="text-muted-foreground text-xs">{t(section.precision)}</span>
                <span className="text-muted-foreground ml-auto text-xs">
                  {tp('{n} mesure', '{n} mesures', section.champs.length)}
                </span>
              </div>

              <div className="grid sm:grid-cols-2">
                {section.champs.map((champ, i) => {
                  const k = cle(section.titre, champ.numero);
                  return (
                    <label
                      key={k}
                      className={cn(
                        'border-border flex items-center justify-between gap-3 border-b px-4 py-2',
                        i % 4 >= 2 && 'bg-muted/50',
                      )}
                    >
                      <span className="flex min-w-0 items-baseline gap-2">
                        {/* Le repère numérique reproduit l'ordre du carnet papier :
                            l'artisan dicte « le 9B », pas « longueur habit B ».
                            `dir="ltr"` parce que l'algorithme bidirectionnel
                            retourne « 9B » en « B9 » dans une page arabe — le
                            repère cesserait de correspondre au carnet. */}
                        <span
                          dir="ltr"
                          className="text-muted-foreground/60 w-6 flex-shrink-0 font-mono text-xs"
                        >
                          {champ.numero}
                        </span>
                        <span className="text-muted-foreground truncate text-sm">
                          {t(champ.label)}
                        </span>
                      </span>
                      <span className="flex flex-shrink-0 items-center gap-1.5">
                        <input
                          inputMode="decimal"
                          value={valeurs[k] ?? ''}
                          onChange={(e) => majValeur(k, e.target.value)}
                          placeholder="—"
                          aria-label={`${champ.numero} ${t(champ.label)}`}
                          className="bg-input border-border text-foreground placeholder:text-muted-foreground/40 focus:border-primary w-16 rounded-md border px-2 py-1 text-right text-sm transition-colors focus:outline-none"
                        />
                        <span className="text-muted-foreground w-5 text-xs">{champ.unite}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="px-5 py-4">
            <label className="text-muted-foreground mb-1.5 block text-xs">
              {t('Remarques sur la morphologie')}
            </label>
            <textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setEtat('saisie');
              }}
              rows={3}
              placeholder={t('Ex : épaule droite légèrement plus basse, prévoir 1 cm de reprise.')}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary w-full resize-y rounded-md border px-3 py-2.5 text-sm transition-colors focus:outline-none"
            />
          </div>
        </section>

        {/* ---------- Photos ---------- */}
        <div className="flex flex-col gap-6 xl:w-96">
          <section className="bg-surface border-border rounded-lg border p-5">
            <PhotoUpload
              label={t('Tissus apportés')}
              description={t('Photographiez chaque coupon : motif, métrage, couleur réelle.')}
              photos={tissus}
              onChange={(p) => {
                setTissus(p);
                setEtat('saisie');
              }}
              maximum={6}
            />
          </section>

          <section className="bg-surface border-border rounded-lg border p-5">
            <PhotoUpload
              label={t('Modèle choisi')}
              description={t('La référence visuelle que le client souhaite reproduire.')}
              photos={modele}
              onChange={(p) => {
                setModele(p);
                setEtat('saisie');
              }}
              maximum={1}
            />
          </section>
        </div>
      </div>

      {/* ---------- Actions ---------- */}
      <div className="bg-surface border-border flex flex-col gap-3 rounded-lg border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Scissors size={16} className="text-primary flex-shrink-0" aria-hidden />
          <p className="text-muted-foreground text-xs">
            {t('{remplies}/{total} mesures', { remplies, total })} ·{' '}
            {tp('{n} photo de tissu', '{n} photos de tissu', tissus.length)} ·{' '}
            {modele.length > 0 ? t('modèle photographié') : t('aucun modèle')}
          </p>
        </div>

        <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
          {etat === 'enregistre' && (
            <span className="text-success flex items-center gap-1.5 text-xs font-medium">
              <Check size={13} aria-hidden />
              {t('Relevé enregistré')}
            </span>
          )}
          {/* En démonstration, aucun client n'existe en base : on le dit plutôt
              que d'afficher un succès qui n'a pas eu lieu. */}
          {etat === 'local' && (
            <span className="text-warning text-xs font-medium">
              {t('Conservé à l’écran seulement — connectez-vous pour enregistrer.')}
            </span>
          )}
          {erreur && <span className="text-danger text-xs font-medium">{erreur}</span>}

          <Link href="/commandes/nouvelle">
            <Button variante="contour" taille="md">
              <Shirt size={14} aria-hidden />
              {t('Créer la commande')}
            </Button>
          </Link>
          <Button onClick={enregistrer} disabled={remplies === 0 || etat === 'envoi'}>
            <Save size={14} aria-hidden />
            {etat === 'envoi' ? t('Enregistrement…') : t('Enregistrer le relevé')}
          </Button>
        </div>
      </div>
    </div>
  );
}
