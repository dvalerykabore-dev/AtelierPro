'use client';

import { useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Banknote,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Shirt,
  UserPlus,
  X,
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import GenreToggle from '@/components/ui/GenreToggle';
import { Field } from '@/components/ui/Field';
import ChampTelephone from '@/components/ui/ChampTelephone';
import { useClients } from '@/lib/useClients';
import { useCommandes } from '@/lib/useCommandes';
import { useReleveMesures } from '@/lib/useReleveMesures';
import { numeroWhatsApp } from '@/lib/commande-fiche';
import { formaterAffichage } from '@/lib/indicatifs';
import {
  nombreDeChamps,
  paletteDe,
  type Client,
  type Commande,
  type Genre,
} from '@/lib/mock/atelier';
import { cn, formatPrice } from '@/lib/utils';

const ONGLETS = ['Infos', 'Mesures', 'Tissus', 'Commandes'] as const;
type Onglet = (typeof ONGLETS)[number];

/**
 * Décompte et cumul facturé d'un client, calculés depuis ses commandes réelles.
 *
 * Le carnet affichait auparavant `nbCommandes` / `totalFacture` portés par la
 * fiche client, que l'API ne renvoie pas — d'où « 0 commandes · 0 F CFA » sous
 * un historique de cinq lignes. Un compteur et la liste qu'il compte doivent
 * lire la même source.
 */
function bilan(commandes: Commande[]) {
  return {
    nombre: commandes.length,
    total: commandes.reduce((s, c) => s + c.montant, 0),
  };
}

/**
 * Carnet clients — liste à gauche, fiche détaillée à droite.
 * Sources Banani : screens/new_screen3.jsx (desktop) et
 * screens/MobileCarnetClients.jsx (mobile, organisé en onglets).
 *
 * Sur mobile les deux panneaux ne tiennent pas côte à côte : on affiche la
 * liste, puis la fiche remplace l'écran, avec une flèche de retour — c'est le
 * découpage que suit déjà la maquette mobile.
 */
export default function CarnetClients() {
  const { clients, source, chargement, ajouter } = useClients();
  const { commandes } = useCommandes();

  const [selectionneId, setSelectionneId] = useState<string | null>(null);
  const [ficheOuverte, setFicheOuverte] = useState(false);
  const [onglet, setOnglet] = useState<Onglet>('Infos');
  const [recherche, setRecherche] = useState('');

  // Formulaire d'ajout — écran absent des maquettes Banani, déduit du reste
  // du système de design.
  const [ajoutOuvert, setAjoutOuvert] = useState(false);
  const [nouveauNom, setNouveauNom] = useState('');
  const [nouveauTelephone, setNouveauTelephone] = useState('');
  const [nouveauGenre, setNouveauGenre] = useState<Genre>('Femme');
  const [erreurAjout, setErreurAjout] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  // La sélection est conservée par identifiant, pas par objet : la liste est
  // rechargée depuis le serveur et les objets sont remplacés à chaque fetch.
  const selectionne = clients.find((c) => c.id === selectionneId) ?? clients[0];

  // Les commandes portent le nom du client, pas encore sa clé : `TailoringOrder`
  // référence bien `customerId`, mais l'API des commandes expose le nom, et le
  // carnet n'a pas besoin de plus. À revoir le jour où deux clients d'un même
  // atelier pourront être homonymes — `@@unique([userId, name])` l'interdit
  // aujourd'hui, ce qui rend ce rapprochement sûr.
  const parClient = useMemo(() => {
    const carte = new Map<string, Commande[]>();
    for (const c of commandes) {
      const liste = carte.get(c.client);
      if (liste) liste.push(c);
      else carte.set(c.client, [c]);
    }
    return carte;
  }, [commandes]);

  const commandesDuClient = selectionne ? (parClient.get(selectionne.nom) ?? []) : [];
  const bilanClient = bilan(commandesDuClient);
  const whatsapp = numeroWhatsApp(selectionne?.telephone);
  const commandeEnCours = commandesDuClient.find((c) => c.statut !== 'Livré');

  // Dernier relevé du client sélectionné. Hors session les identifiants sont
  // ceux du jeu simulé : le hook ne tente rien, la fiche affiche « Aucun relevé ».
  const { charge: releve } = useReleveMesures(
    selectionne?.id ?? null,
    source === 'serveur' && Boolean(selectionne),
  );

  const tissusDuClient = releve?.tissus ?? [];

  const visibles = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    if (!terme) return clients;
    return clients.filter((c) =>
      [c.nom, c.telephone].some((champ) => champ.toLowerCase().includes(terme)),
    );
  }, [clients, recherche]);

  function choisir(c: Client) {
    setSelectionneId(c.id);
    setFicheOuverte(true);
    setOnglet('Infos');
  }

  async function ajouterClient(e: FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreurAjout(null);

    const probleme = await ajouter({
      nom: nouveauNom.trim(),
      telephone: nouveauTelephone.trim(),
      genre: nouveauGenre,
    });

    setEnvoi(false);
    if (probleme) {
      setErreurAjout(probleme);
      return;
    }

    setNouveauNom('');
    setNouveauTelephone('');
    setNouveauGenre('Femme');
    setAjoutOuvert(false);
    setRecherche('');
  }

  // Ajout d'un client — la maquette Banani montre le bouton sans écran.
  //
  // Déclarée AVANT les retours anticipés, et rendue par les deux branches : le
  // jour où un atelier tout neuf ouvre son carnet, il n'a aucun client, prend
  // donc la branche « Aucun client enregistré » — et si la fenêtre ne vivait
  // qu'en bas du rendu principal, le tout premier bouton du produit ne ferait
  // rien. Une variable JSX, pas un composant local : un composant serait remonté
  // à chaque frappe et volerait le curseur du champ en cours de saisie.
  const modaleAjout = (
    <Modal
      ouvert={ajoutOuvert}
      onFermer={() => setAjoutOuvert(false)}
      titre="Nouveau client"
      description="Le genre détermine la palette de mesures qui lui sera présentée."
      pied={
        <>
          <Button variante="fantome" onClick={() => setAjoutOuvert(false)}>
            Annuler
          </Button>
          <Button
            type="submit"
            form="formulaire-nouveau-client"
            disabled={!nouveauNom.trim() || envoi}
          >
            {envoi ? 'Enregistrement…' : 'Créer le client'}
          </Button>
        </>
      }
    >
      <form id="formulaire-nouveau-client" onSubmit={ajouterClient} className="flex flex-col gap-4">
        <Field
          label="Nom complet"
          required
          autoFocus
          placeholder="Aminata Ouédraogo"
          value={nouveauNom}
          onChange={(e) => setNouveauNom(e.target.value)}
        />
        {/*
          L'aide annonçait « Sert aux rappels d'essayage et de livraison par
          SMS » : aucun envoi SMS n'existe dans le code, et rien n'était prévu
          pour en écrire. Elle dit maintenant l'usage réel — c'est par WhatsApp
          et par appel que l'atelier joint ses clients, depuis la fiche du
          carnet et celle de la commande.
        */}
        <ChampTelephone
          label="Téléphone"
          valeur={nouveauTelephone}
          onChange={setNouveauTelephone}
          aide="Sert au bouton WhatsApp de la fiche client et de la commande."
        />

        <div className="flex flex-col gap-1.5">
          <span className="text-muted-foreground text-xs">Palette de mesures</span>
          <GenreToggle valeur={nouveauGenre} onChange={setNouveauGenre} />
          <p className="text-muted-foreground text-xs">
            {nouveauGenre === 'Femme'
              ? `${nombreDeChamps(paletteDe('Femme'))} mesures — buste, robe et bas.`
              : `${nombreDeChamps(paletteDe('Homme'))} mesures — buste, manches et pantalon.`}
          </p>
        </div>

        {erreurAjout && (
          <p role="alert" className="text-danger text-sm">
            {erreurAjout}
          </p>
        )}
      </form>
    </Modal>
  );

  if (chargement && clients.length === 0) {
    return <p className="text-muted-foreground p-8 text-sm">Chargement des clients…</p>;
  }

  if (!selectionne) {
    return (
      <div className="flex flex-col items-center gap-3 p-12 text-center">
        <p className="text-foreground text-sm font-medium">Aucun client enregistré</p>
        <Button onClick={() => setAjoutOuvert(true)}>
          <UserPlus size={14} aria-hidden />
          Ajouter le premier client
        </Button>
        {modaleAjout}
      </div>
    );
  }

  return (
    <div className="flex min-h-full">
      {/* ============ Liste des clients ============ */}
      <div
        className={cn(
          'border-border bg-surface flex w-full flex-shrink-0 flex-col border-r lg:flex lg:w-72',
          ficheOuverte && 'hidden lg:flex',
        )}
      >
        <div className="border-border border-b px-4 py-4">
          <div className="bg-input border-border focus-within:border-primary flex items-center gap-2 rounded-md border px-3 py-2 transition-colors">
            <Search size={13} className="text-muted-foreground flex-shrink-0" aria-hidden />
            <input
              type="search"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher un client…"
              aria-label="Rechercher un client"
              className="text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm focus:outline-none"
            />
            {recherche && (
              <button
                type="button"
                onClick={() => setRecherche('')}
                aria-label="Effacer la recherche"
                className="text-muted-foreground hover:text-foreground flex-shrink-0"
              >
                <X size={13} aria-hidden />
              </button>
            )}
          </div>
        </div>

        <div className="border-border flex items-center justify-between border-b px-4 py-2.5">
          <span className="text-muted-foreground text-xs">
            {visibles.length} client{visibles.length > 1 ? 's' : ''}
            {recherche && ` sur ${clients.length}`}
            {/* La provenance est annoncée : on ne doit jamais prendre des
                données d'exemple pour le vrai carnet de l'atelier. */}
            {source === 'demonstration' && <span className="text-warning ml-1.5">· exemples</span>}
          </span>
          <button
            type="button"
            onClick={() => setAjoutOuvert(true)}
            className="bg-primary text-primary-foreground hover:bg-accent flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors"
          >
            <UserPlus size={12} aria-hidden />
            Ajouter
          </button>
        </div>

        {visibles.length === 0 && (
          <p className="text-muted-foreground px-4 py-8 text-center text-xs">
            Aucun client ne correspond à « {recherche} ».
          </p>
        )}

        <ul className="flex-1">
          {visibles.map((c) => {
            const actif = c.id === selectionne.id;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => choisir(c)}
                  aria-current={actif ? 'true' : undefined}
                  className={cn(
                    'border-border hover:bg-muted/50 flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors',
                    actif && 'bg-muted',
                  )}
                >
                  <Avatar initiales={c.initiales} taille="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-foreground truncate text-sm font-medium">{c.nom}</span>
                      {c.fidele && (
                        <span
                          className="bg-primary h-1.5 w-1.5 flex-shrink-0 rounded-full"
                          title="Client fidèle"
                        />
                      )}
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {(() => {
                        const siennes = parClient.get(c.nom) ?? [];
                        if (siennes.length === 0) return 'Aucune commande';
                        const derniere = siennes[0];
                        return `${siennes.length} commande${siennes.length > 1 ? 's' : ''} · ${derniere?.livraison ?? '—'}`;
                      })()}
                    </span>
                  </div>
                  {actif && (
                    <span className="bg-primary h-8 w-0.5 flex-shrink-0 rounded-full" aria-hidden />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ============ Fiche client ============ */}
      <div
        className={cn('min-w-0 flex-1 flex-col lg:flex', ficheOuverte ? 'flex' : 'hidden lg:flex')}
      >
        {/* En-tête fiche */}
        <div className="border-border bg-surface flex flex-col gap-3 border-b px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3 lg:gap-4">
            <button
              type="button"
              onClick={() => setFicheOuverte(false)}
              className="border-border text-muted-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border lg:hidden"
              aria-label="Retour à la liste"
            >
              <ArrowLeft size={16} aria-hidden />
            </button>

            <Avatar initiales={selectionne.initiales} taille="lg" className="h-12 w-12 text-base" />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-headings text-foreground truncate text-lg font-bold lg:text-xl">
                  {selectionne.nom}
                </h2>
                {selectionne.fidele && (
                  <span className="bg-primary text-primary-foreground rounded-sm px-2 py-0.5 text-xs font-medium">
                    Client fidèle
                  </span>
                )}
              </div>
              <div className="text-muted-foreground mt-0.5 flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <Phone size={11} aria-hidden />
                  {formaterAffichage(selectionne.telephone)}
                </span>
                <span aria-hidden>·</span>
                <span className="flex items-center gap-1">
                  <Shirt size={11} aria-hidden />
                  {bilanClient.nombre} commande{bilanClient.nombre > 1 ? 's' : ''}
                </span>
                <span aria-hidden>·</span>
                <span className="flex items-center gap-1">
                  <Banknote size={11} aria-hidden />
                  {formatPrice(bilanClient.total, 'F CFA')} au total
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center gap-2">
            {/* Le bouton n'avait aucun gestionnaire. Même logique que sur la
                fiche de commande : sans numéro exploitable, wa.me ouvrirait une
                conversation vide, alors on le dit plutôt que de le laisser
                échouer une fois cliqué. */}
            {whatsapp ? (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border text-foreground hover:bg-muted flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors"
              >
                <MessageCircle size={14} aria-hidden />
                WhatsApp
              </a>
            ) : (
              <button
                type="button"
                disabled
                title="Aucun numéro enregistré pour ce client."
                className="border-border text-muted-foreground flex cursor-not-allowed items-center gap-2 rounded-md border px-3 py-2 text-sm opacity-50"
              >
                <MessageCircle size={14} aria-hidden />
                Pas de numéro
              </button>
            )}
            <Link
              href="/commandes/nouvelle"
              className="bg-primary text-primary-foreground hover:bg-accent flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              <Plus size={14} aria-hidden />
              <span className="hidden sm:inline">Nouvelle commande</span>
              <span className="sm:hidden">Commande</span>
            </Link>
          </div>
        </div>

        {/* Onglets — mobile uniquement, le desktop affiche tout de front */}
        <div className="border-border flex items-center gap-0.5 overflow-x-auto border-b px-4 py-2 lg:hidden">
          {ONGLETS.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setOnglet(o)}
              aria-pressed={onglet === o}
              className={cn(
                'flex-shrink-0 rounded-md px-3 py-2 text-xs font-medium',
                onglet === o ? 'bg-muted text-foreground' : 'text-muted-foreground',
              )}
            >
              {o}
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Mesures + tissus */}
          <div className="border-border flex flex-1 flex-col gap-6 px-4 py-6 lg:border-r lg:px-8">
            <section
              className={cn(
                'bg-surface border-border overflow-hidden rounded-lg border',
                onglet === 'Mesures' ? 'block' : 'hidden',
                'lg:block',
              )}
            >
              <div className="border-border flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3">
                <h3 className="font-headings text-foreground text-sm font-bold">
                  Mesures corporelles
                  <span className="text-muted-foreground ml-2 font-normal">
                    · palette {selectionne.genre.toLowerCase()}
                  </span>
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">
                    {releve ? `Relevé du ${releve.dateReleve}` : 'Aucun relevé'}
                  </span>
                  <Link href="/mesures" className="text-primary text-xs font-medium">
                    {releve ? 'Modifier' : 'Relever'}
                  </Link>
                </div>
              </div>

              {/* Lecture seule ici : le relevé se fait sur /mesures. La palette
                  suit le genre du client — 17 lignes pour un homme, 23 pour une
                  femme, réparties en haut et bas du corps. */}
              {paletteDe(selectionne.genre).map((section) => (
                <div key={section.titre}>
                  <div className="bg-muted border-border flex items-baseline gap-2 border-b px-4 py-1.5">
                    <span className="text-primary text-xs font-bold tracking-wide uppercase">
                      {section.titre}
                    </span>
                    <span className="text-muted-foreground text-xs">{section.precision}</span>
                  </div>
                  <div className="grid sm:grid-cols-2">
                    {section.champs.map((c, i) => (
                      <div
                        key={`${section.titre}-${c.numero}`}
                        className={cn(
                          'border-border flex items-center justify-between gap-3 border-b px-4 py-2.5',
                          i % 4 >= 2 && 'bg-muted',
                        )}
                      >
                        <span className="text-muted-foreground text-sm">
                          <span className="text-muted-foreground/60 mr-1.5 font-mono text-xs">
                            {c.numero}
                          </span>
                          {c.label}
                        </span>
                        {/* Une mesure relevée s'écrit en crème, une absente reste
                            grise : la fiche doit dire d'un coup d'œil ce qui a
                            été pris et ce qui manque avant de tailler. */}
                        {(() => {
                          const valeur = releve?.valeurs[`${section.titre}::${c.numero}`];
                          return valeur ? (
                            <span className="text-foreground text-sm font-medium">
                              {valeur} {c.unite}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">— {c.unite}</span>
                          );
                        })()}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section
              className={cn(
                'bg-surface border-border overflow-hidden rounded-lg border',
                onglet === 'Tissus' ? 'block' : 'hidden',
                'lg:block',
              )}
            >
              <div className="border-border flex items-center justify-between gap-2 border-b px-5 py-3">
                <h3 className="font-headings text-foreground text-sm font-bold">
                  Tissus apportés par le client
                </h3>
                <Link href="/mesures" className="text-primary text-xs font-medium">
                  Ajouter
                </Link>
              </div>

              {/* Les tissus sont les photos prises pendant le relevé de mesures
                  (`MeasurementSet.fabricPhotos`). L'écran listait auparavant un
                  stock d'exemple — un client tout neuf se voyait attribuer six
                  yards de wax qu'il n'avait jamais apportés. */}
              {tissusDuClient.length === 0 ? (
                <p className="text-muted-foreground px-5 py-4 text-xs">
                  Aucun tissu photographié. Les tissus se prennent en photo pendant le relevé de
                  mesures.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3 p-4 sm:grid-cols-4">
                  {tissusDuClient.map((t) => (
                    <figure key={t.id} className="flex flex-col gap-1.5">
                      {/* `unoptimized` comme dans `PhotoUpload` : l'optimiseur
                          exigerait de déclarer le domaine Cloudinary dans
                          next.config, alors que les URL sont déjà servies par
                          leur propre CDN. */}
                      <div className="border-border relative aspect-square w-full overflow-hidden rounded-md border">
                        <Image
                          src={t.url}
                          alt={t.nomFichier ?? 'Tissu apporté par le client'}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      {t.nomFichier && (
                        <figcaption className="text-muted-foreground truncate text-xs">
                          {t.nomFichier}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              )}

              {releve?.modele && (
                <div className="border-border border-t px-4 py-4">
                  <span className="text-muted-foreground mb-2 block text-xs">Modèle choisi</span>
                  <div className="border-border relative h-48 w-full overflow-hidden rounded-md border">
                    <Image
                      src={releve.modele}
                      alt="Modèle choisi par le client"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Onglet « Infos » — mobile uniquement */}
            <section className={cn(onglet === 'Infos' ? 'block' : 'hidden', 'lg:hidden')}>
              <div className="bg-surface border-border flex flex-col gap-3 rounded-lg border p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground text-xs">Téléphone</span>
                  <span className="text-foreground text-sm font-medium">
                    {formaterAffichage(selectionne.telephone)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground text-xs">Commandes passées</span>
                  <span className="text-foreground text-sm font-medium">
                    {selectionne.nbCommandes}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground text-xs">Total facturé</span>
                  <span className="text-primary text-sm font-medium">
                    {formatPrice(selectionne.totalFacture, 'F CFA')}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground text-xs">Dernière commande</span>
                  <span className="text-foreground text-sm font-medium">
                    {selectionne.derniereCommande}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Historique */}
          <div
            className={cn(
              'w-full flex-shrink-0 flex-col gap-4 py-6 lg:flex lg:w-96',
              onglet === 'Commandes' ? 'flex' : 'hidden lg:flex',
            )}
          >
            <div className="px-4 lg:px-6">
              <h3 className="font-headings text-foreground mb-1 text-sm font-bold">
                Historique commandes
              </h3>
              <p className="text-muted-foreground text-xs">
                {bilanClient.nombre} commande{bilanClient.nombre > 1 ? 's' : ''} ·{' '}
                {formatPrice(bilanClient.total, 'F CFA')}
              </p>
            </div>

            <div className="flex flex-1 flex-col">
              {commandesDuClient.length === 0 && (
                <p className="text-muted-foreground px-4 py-3.5 text-xs lg:px-6">
                  Aucune commande enregistrée pour ce client.
                </p>
              )}

              {commandesDuClient.map((h) => (
                <div
                  key={h.id}
                  className="border-border flex items-center gap-4 border-b px-4 py-3.5 lg:px-6"
                >
                  <span className="bg-muted flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md">
                    <Shirt size={14} className="text-muted-foreground" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground truncate text-sm font-medium">{h.tenue}</div>
                    <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
                      <span>{h.reference}</span>
                      <span aria-hidden>·</span>
                      <span>{h.livraison}</span>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-end gap-1">
                    {/* Le vert ne convient qu'aux commandes livrées : il félicitait
                        jusqu'ici une commande en retard. */}
                    <span
                      className={cn(
                        'text-xs font-medium',
                        h.statut === 'Livré'
                          ? 'text-success'
                          : h.statut === 'En retard'
                            ? 'text-danger'
                            : 'text-accent',
                      )}
                    >
                      {h.statut}
                    </span>
                    <span className="text-foreground text-xs font-medium">
                      {formatPrice(h.montant, 'F')}
                    </span>
                  </div>
                </div>
              ))}

              {commandeEnCours && (
                <Link
                  href={`/commandes/${commandeEnCours.id}`}
                  className="bg-surface border-primary hover:bg-muted/40 mx-4 mt-4 rounded-lg border p-4 transition-colors lg:mx-6"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-primary text-xs font-bold">Commande en cours</span>
                    <span className="text-muted-foreground text-xs">
                      {commandeEnCours.reference}
                    </span>
                  </div>
                  <div className="text-foreground text-sm font-medium">{commandeEnCours.tenue}</div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-muted-foreground text-xs">Statut</span>
                    <span className="text-accent text-xs font-medium">
                      {commandeEnCours.statut}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="text-muted-foreground text-xs">Livraison calculée</span>
                    <span className="text-primary text-xs font-medium">
                      {commandeEnCours.livraison}
                    </span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {modaleAjout}
    </div>
  );
}
