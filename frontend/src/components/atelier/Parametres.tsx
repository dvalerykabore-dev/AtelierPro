'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Moon, Pencil, Plus, Sun, Trash2, UserPlus } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Field } from '@/components/ui/Field';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { NOM_ATELIER_DEFAUT } from '@/lib/atelier-identite';
import { messageErreur } from '@/lib/message-erreur';
import { useTheme } from '@/contexts/ThemeContext';
import { THEMES } from '@/lib/theme';
import { useArtisans } from '@/lib/useArtisans';
import { useTarifs, type Tarif } from '@/lib/useTarifs';
import { usePreferencesNotifications } from '@/lib/usePreferencesNotifications';
import { atelier } from '@/lib/mock/atelier';
import { cn, formatPrice } from '@/lib/utils';

const ONGLETS = ['Atelier', 'Équipe', 'Tarification', 'Notifications', 'Compte'] as const;
type Onglet = (typeof ONGLETS)[number];

/** Champ en lecture seule — la maquette ne prévoit pas de saisie active. */
/**
 * Champ enregistrable — le seul de cet écran, pour l'instant.
 *
 * Les autres restent en lecture : ils affichent des valeurs simulées et rien
 * en base ne les porte. Les rendre modifiables donnerait l'impression de
 * réglages qui ne survivraient pas au rechargement.
 */
function ChampEnregistrable({
  label,
  valeur,
  placeholder,
  onEnregistrer,
}: {
  label: string;
  valeur: string;
  placeholder: string;
  onEnregistrer: (valeur: string) => Promise<void>;
}) {
  const [saisie, setSaisie] = useState(valeur);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [enregistre, setEnregistre] = useState(false);

  // La valeur du serveur reprend la main quand elle arrive après le montage.
  useEffect(() => {
    setSaisie(valeur);
  }, [valeur]);

  const modifie = saisie.trim() !== valeur.trim();

  async function soumettre() {
    setEnvoi(true);
    setErreur(null);
    try {
      await onEnregistrer(saisie.trim());
      setEnregistre(true);
    } catch (err) {
      setErreur(messageErreur(err, 'Le nom n’a pas pu être enregistré.'));
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div>
      <span className="text-muted-foreground mb-1 block text-xs">{label}</span>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={saisie}
          placeholder={placeholder}
          onChange={(e) => {
            setSaisie(e.target.value);
            setEnregistre(false);
          }}
          className="bg-input border-border text-foreground min-w-0 flex-1 rounded-md border px-3 py-2.5 text-sm"
        />
        <Button type="button" onClick={() => void soumettre()} disabled={!modifie || envoi}>
          {envoi ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
      {erreur && (
        <p role="alert" className="text-danger mt-1 text-xs">
          {erreur}
        </p>
      )}
      {enregistre && !modifie && !erreur && (
        <p className="text-success mt-1 text-xs">Enregistré.</p>
      )}
    </div>
  );
}

function Champ({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div>
      <span className="text-muted-foreground mb-1 block text-xs">{label}</span>
      <div className="bg-input border-border rounded-md border px-3 py-2.5">
        <span className="text-foreground text-sm">{valeur}</span>
      </div>
    </div>
  );
}

/** Interrupteur binaire, réellement actionnable. */
function Interrupteur({
  actif,
  onChange,
  label,
}: {
  actif: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={actif}
      aria-label={label}
      onClick={onChange}
      className={cn(
        'relative h-6 w-11 flex-shrink-0 rounded-full transition-colors',
        actif ? 'bg-primary' : 'bg-muted border-border border',
      )}
    >
      <span
        className={cn(
          'absolute top-1 h-4 w-4 rounded-full transition-all',
          actif ? 'bg-primary-foreground left-6' : 'bg-muted-foreground left-1',
        )}
      />
    </button>
  );
}

/**
 * Paramètres de l'atelier, organisés en onglets.
 * Source Banani : screens/new_screen6.jsx (« Paramètres — AtelierPro »).
 */
export default function Parametres() {
  const router = useRouter();
  const { user, logout, loggingOut, refresh } = useAuth();

  /**
   * Enregistre le nom de l'atelier, puis relit la session.
   *
   * Le relire plutôt que de poser la valeur localement : le nom s'affiche dans
   * le rail et le sous-titre de quatre écrans, tous alimentés par le contexte
   * d'authentification. Un seul point de vérité évite qu'un écran affiche
   * l'ancien nom et son voisin le nouveau.
   */
  async function enregistrerNom(nom: string) {
    await api('/api/atelier', { method: 'PATCH', body: { workshopName: nom } });
    await refresh();
  }
  const { theme, definir: definirTheme } = useTheme();

  const {
    artisans: equipe,
    source: sourceEquipe,
    chargement: chargementEquipe,
    ajouter: ajouterArtisan,
    basculer: basculerArtisan,
  } = useArtisans();

  const [onglet, setOnglet] = useState<Onglet>('Atelier');

  const {
    alertes,
    estActif: alerteActive,
    basculer: basculerAlerte,
    chargement: chargementAlertes,
    session: sessionAlertes,
    erreur: erreurAlertes,
  } = usePreferencesNotifications();
  const [echecAlerte, setEchecAlerte] = useState<string | null>(null);

  // La déconnexion demande confirmation. Le bouton est collé au reste des
  // réglages, et depuis que la reconnexion passe par un code envoyé par
  // e-mail, un clic de travers ne coûte plus un mot de passe à retaper mais
  // une boîte mail à aller consulter — parfois sur un téléphone resté à la
  // maison, au milieu d'une journée d'atelier.
  const [deconnexionOuverte, setDeconnexionOuverte] = useState(false);

  const {
    tarifs,
    source: sourceTarifs,
    chargement: chargementTarifs,
    ajouter: ajouterTarif,
    modifier: modifierTarif,
    supprimer: retirerTarif,
  } = useTarifs();
  const [echecTarif, setEchecTarif] = useState<string | null>(null);

  // Formulaire de tarif — création et édition partagent la même fenêtre.
  const [tarifOuvert, setTarifOuvert] = useState(false);
  const [tarifEdite, setTarifEdite] = useState<Tarif | null>(null);
  const [nomTenue, setNomTenue] = useState('');
  const [prix, setPrix] = useState('');

  // Ajout d'un artisan — la maquette Banani montre le bouton sans destination.
  const [artisanOuvert, setArtisanOuvert] = useState(false);
  const [nomArtisan, setNomArtisan] = useState('');
  const [roleArtisan, setRoleArtisan] = useState('Couturière');
  const [capaciteArtisan, setCapaciteArtisan] = useState('8');
  const [echecEquipe, setEchecEquipe] = useState<string | null>(null);
  const [envoiArtisan, setEnvoiArtisan] = useState(false);

  async function soumettreArtisan(e: FormEvent) {
    e.preventDefault();
    const capacite = Number.parseInt(capaciteArtisan, 10);
    if (!nomArtisan.trim() || !roleArtisan.trim() || Number.isNaN(capacite)) return;

    setEnvoiArtisan(true);
    setEchecEquipe(null);
    const probleme = await ajouterArtisan({
      nom: nomArtisan.trim(),
      role: roleArtisan.trim(),
      capacite,
    });
    setEnvoiArtisan(false);

    if (probleme) {
      setEchecEquipe(probleme);
      return;
    }
    setNomArtisan('');
    setArtisanOuvert(false);
  }

  /** L'interrupteur est optimiste ; le hook revient en arrière si le serveur refuse. */
  async function basculerMembre(id: string) {
    const probleme = await basculerArtisan(id);
    if (probleme) setEchecEquipe(probleme);
  }

  /** Comme pour l'équipe : bascule optimiste, le hook revient en arrière si le serveur refuse. */
  async function basculerRappel(type: string) {
    setEchecAlerte(await basculerAlerte(type));
  }

  function ouvrirTarif(t?: Tarif) {
    setTarifEdite(t ?? null);
    setNomTenue(t?.tenue ?? '');
    setPrix(t ? String(t.prix) : '');
    setEchecTarif(null);
    setTarifOuvert(true);
  }

  async function enregistrerTarif(e: FormEvent) {
    e.preventDefault();
    const montant = Number.parseInt(prix, 10);
    if (!nomTenue.trim() || Number.isNaN(montant)) return;

    const entree = { tenue: nomTenue.trim(), prix: montant, unite: 'façon' };
    // La fenêtre ne se ferme qu'en cas de succès : la refermer sur un échec
    // ferait croire le tarif enregistré, et il faudrait tout retaper.
    const message = tarifEdite
      ? await modifierTarif(tarifEdite.id, entree)
      : await ajouterTarif(entree);
    if (message) setEchecTarif(message);
    else setTarifOuvert(false);
  }

  async function supprimerTarif(t: Tarif) {
    const message = await retirerTarif(t.id);
    if (message) setEchecTarif(message);
  }

  async function seDeconnecter() {
    setDeconnexionOuverte(false);
    await logout();
    router.push('/connexion');
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Onglets */}
      <div className="border-border bg-background flex overflow-x-auto border-b px-4 lg:px-8">
        {ONGLETS.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setOnglet(o)}
            aria-current={onglet === o ? 'true' : undefined}
            className={cn(
              'flex-shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
              onglet === o
                ? 'border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground border-transparent',
            )}
          >
            {o}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 px-4 py-6 lg:px-8">
        {/* ---------- Atelier ---------- */}
        {onglet === 'Atelier' && (
          <section className="bg-surface border-border rounded-lg border p-5">
            <h2 className="font-headings text-foreground mb-4 text-sm font-bold">
              Informations de l’atelier
            </h2>

            <div className="mb-4 flex flex-col gap-5 sm:flex-row">
              <div className="bg-muted border-border flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center gap-1 rounded-lg border">
                <span className="bg-primary flex h-8 w-8 items-center justify-center rounded-md">
                  <span className="text-primary-foreground font-headings text-lg font-bold">A</span>
                </span>
                <span className="text-muted-foreground text-xs">Logo</span>
              </div>

              <div className="flex flex-1 flex-col gap-3">
                <ChampEnregistrable
                  label="Nom de l’atelier"
                  valeur={user?.workshopName ?? ''}
                  placeholder={NOM_ATELIER_DEFAUT}
                  onEnregistrer={enregistrerNom}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Champ label="Téléphone" valeur={atelier.telephone} />
                  <Champ label="Ville" valeur={atelier.ville} />
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Champ label="Adresse" valeur={atelier.adresse} />
              <Champ label="Horaires" valeur={atelier.heuresOuverture} />
              <Champ label="Devise" valeur={atelier.devise} />
            </div>
          </section>
        )}

        {/* ---------- Équipe ---------- */}
        {onglet === 'Équipe' && (
          <section className="bg-surface border-border overflow-hidden rounded-lg border">
            <div className="border-border flex items-center justify-between gap-3 border-b px-5 py-3">
              <h2 className="font-headings text-foreground text-sm font-bold">
                Équipe ({equipe.filter((m) => m.actif).length} actif
                {equipe.filter((m) => m.actif).length > 1 ? 's' : ''} sur {equipe.length})
                {sourceEquipe === 'demonstration' && (
                  <span className="text-warning ml-1.5 font-normal">· exemples</span>
                )}
              </h2>
              <button
                type="button"
                onClick={() => setArtisanOuvert(true)}
                className="bg-primary text-primary-foreground flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium"
              >
                <UserPlus size={12} aria-hidden />
                Ajouter
              </button>
            </div>

            {echecEquipe && (
              <p role="alert" className="text-danger border-border border-b px-5 py-2.5 text-xs">
                {echecEquipe}
              </p>
            )}

            {chargementEquipe && equipe.length === 0 && (
              <p className="text-muted-foreground px-5 py-4 text-xs">Chargement de l’équipe…</p>
            )}

            {/* Un atelier qui vient d'ouvrir n'a personne : c'est ici qu'il
                compose son équipe, et le planning en dépend entièrement. */}
            {!chargementEquipe && equipe.length === 0 && (
              <p className="text-muted-foreground px-5 py-4 text-xs">
                Aucun artisan. Ajoutez-en un pour pouvoir assigner des commandes et remplir le
                planning.
              </p>
            )}

            <ul>
              {equipe.map((m) => (
                <li key={m.id} className="border-border flex items-center gap-3 border-b px-5 py-3">
                  <Avatar initiales={m.initiales} taille="md" />
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground truncate text-sm font-medium">{m.nom}</div>
                    <div className="text-muted-foreground text-xs">
                      {m.role} · {m.capacite} h / jour
                    </div>
                  </div>
                  <span
                    className={cn(
                      'hidden text-xs font-medium sm:block',
                      m.actif ? 'text-success' : 'text-muted-foreground',
                    )}
                  >
                    {m.actif ? 'Actif' : 'Inactif'}
                  </span>
                  <Interrupteur
                    actif={m.actif}
                    onChange={() => basculerMembre(m.id)}
                    label={`Activer ${m.nom}`}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---------- Tarification ---------- */}
        {onglet === 'Tarification' && (
          <section className="bg-surface border-border overflow-hidden rounded-lg border">
            <div className="border-border flex items-center justify-between gap-3 border-b px-5 py-3">
              <h2 className="font-headings text-foreground text-sm font-bold">Grille tarifaire</h2>
              <button
                type="button"
                onClick={() => ouvrirTarif()}
                className="text-primary border-primary hover:bg-primary/10 flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors"
              >
                <Plus size={11} aria-hidden />
                Ajouter un tarif
              </button>
            </div>

            {chargementTarifs && (
              <p className="text-muted-foreground px-5 py-6 text-sm">Chargement de la grille…</p>
            )}

            {!chargementTarifs && sourceTarifs === 'demonstration' && (
              <p className="text-muted-foreground border-border border-b px-5 py-3 text-xs">
                Grille d’exemple — connectez-vous pour composer la vôtre.
              </p>
            )}

            {!chargementTarifs && sourceTarifs === 'serveur' && tarifs.length === 0 && (
              <p className="text-muted-foreground px-5 py-6 text-sm">
                Aucun tarif enregistré. Ajoutez vos prix de façon : ils seront proposés à chaque
                nouvelle commande.
              </p>
            )}

            {echecTarif && !tarifOuvert && (
              <p role="alert" className="text-danger border-border border-b px-5 py-3 text-sm">
                {echecTarif}
              </p>
            )}

            <ul>
              {tarifs.map((t) => (
                <li key={t.id} className="border-border flex items-center gap-3 border-b px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground truncate text-sm font-medium">{t.tenue}</div>
                    <div className="text-muted-foreground text-xs">Prix de {t.unite}</div>
                  </div>
                  <span className="text-foreground text-sm font-medium">
                    {formatPrice(t.prix, 'F')}
                  </span>
                  <button
                    type="button"
                    onClick={() => ouvrirTarif(t)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil size={13} aria-hidden />
                    <span className="sr-only">Modifier le tarif {t.tenue}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => void supprimerTarif(t)}
                    className="text-muted-foreground hover:text-danger"
                  >
                    <Trash2 size={13} aria-hidden />
                    <span className="sr-only">Supprimer le tarif {t.tenue}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/*
          ---------- Notifications ----------
          La liste précédente comptait cinq réglages, dont trois pour des envois
          qui n'existent nulle part dans le code — SMS au client, alerte de
          saturation, récapitulatif du lundi. On n'énumère que les deux alertes
          que le passage quotidien émet vraiment : un interrupteur pour un envoi
          qui n'a jamais lieu se coupe sans rien changer, et c'est en cas de
          panne qu'on s'en aperçoit.
        */}
        {onglet === 'Notifications' && (
          <section className="bg-surface border-border overflow-hidden rounded-lg border">
            <div className="border-border border-b px-5 py-3">
              <h2 className="font-headings text-foreground text-sm font-bold">
                Rappels automatiques
              </h2>
              <p className="text-muted-foreground mt-1 text-xs">
                Relevés chaque matin et déposés dans vos notifications.
              </p>
            </div>

            {chargementAlertes && (
              <p className="text-muted-foreground px-5 py-6 text-sm">Chargement des réglages…</p>
            )}

            {!chargementAlertes && !sessionAlertes && (
              <p className="text-muted-foreground px-5 py-6 text-sm">
                Connectez-vous pour régler vos rappels.
              </p>
            )}

            {(erreurAlertes ?? echecAlerte) && (
              <p role="alert" className="text-danger border-border border-b px-5 py-3 text-sm">
                {erreurAlertes ?? echecAlerte}
              </p>
            )}

            {!chargementAlertes && sessionAlertes && (
              <ul>
                {alertes.map((a) => (
                  <li
                    key={a.type}
                    className="border-border flex items-center gap-4 border-b px-5 py-3.5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-foreground text-sm font-medium">{a.label}</div>
                      <div className="text-muted-foreground text-xs">{a.description}</div>
                    </div>
                    <Interrupteur
                      actif={alerteActive(a.type)}
                      onChange={() => void basculerRappel(a.type)}
                      label={a.label}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* ---------- Compte ---------- */}
        {onglet === 'Compte' && (
          <section className="bg-surface border-border rounded-lg border p-5">
            <h2 className="font-headings text-foreground mb-4 text-sm font-bold">Votre compte</h2>

            <div className="mb-5 flex items-center gap-4">
              <Avatar initiales="MK" taille="lg" className="h-12 w-12 text-base" accentue />
              <div>
                <div className="text-foreground text-sm font-medium">Moussa Koné</div>
                <div className="text-muted-foreground text-xs">Propriétaire · Tailleur senior</div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Champ label="Adresse e-mail" valeur="moussa.kone@atelierpro.bf" />
              <Champ label="Téléphone" valeur="+226 70 12 34 56" />
            </div>

            {/*
              Apparence — la bascule de la barre haute suffit à l'usage courant,
              mais c'est ici qu'on cherche une préférence. Radios natives plutôt
              que role="radio" : la navigation aux flèches vient gratuitement et
              sans code ARIA à maintenir.
            */}
            <div className="border-border mt-5 border-t pt-5">
              <h3 className="font-headings text-foreground text-sm font-bold">Apparence</h3>
              <p className="text-muted-foreground mt-1 mb-3 text-xs">
                Mémorisé sur cet appareil, pas sur votre compte.
              </p>
              <div role="radiogroup" aria-label="Thème de l’interface" className="flex gap-2">
                {THEMES.map((valeur) => {
                  const actif = theme === valeur;
                  const Icone = valeur === 'dark' ? Moon : Sun;
                  return (
                    <label
                      key={valeur}
                      className={cn(
                        'flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
                        'has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2',
                        actif
                          ? 'border-primary bg-muted text-foreground font-medium'
                          : 'border-border text-muted-foreground hover:bg-muted',
                      )}
                    >
                      <input
                        type="radio"
                        name="theme-interface"
                        value={valeur}
                        checked={actif}
                        onChange={() => definirTheme(valeur)}
                        className="sr-only"
                      />
                      <Icone size={14} aria-hidden />
                      {valeur === 'dark' ? 'Sombre' : 'Clair'}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="border-border mt-5 flex flex-wrap gap-2 border-t pt-5">
              {/*
                Le bouton n'avait aucun gestionnaire : cliquer dessus ne faisait
                rien, ce qui se lit comme une panne. L'écran /settings porte déjà
                les deux cas — définir un mot de passe pour un compte ouvert via
                Google, le changer pour les autres — plutôt que d'en refaire un
                troisième formulaire ici.
              */}
              <Link
                href="/settings"
                className="border-border text-foreground hover:bg-muted rounded-md border px-3 py-2 text-sm transition-colors"
              >
                Changer le mot de passe
              </Link>
              <Button
                variante="danger"
                onClick={() => setDeconnexionOuverte(true)}
                disabled={loggingOut}
              >
                {loggingOut ? 'Déconnexion…' : 'Se déconnecter'}
              </Button>
            </div>
          </section>
        )}
      </div>

      {/*
        Confirmation de déconnexion.
        La description dit ce que la déconnexion coûte réellement plutôt que de
        demander « êtes-vous sûr ? » : c'est le retour par un code envoyé par
        e-mail qui décide si l'on clique, pas la question elle-même.
      */}
      <Modal
        ouvert={deconnexionOuverte}
        onFermer={() => setDeconnexionOuverte(false)}
        titre="Se déconnecter ?"
        description="Pour revenir, il faudra retaper votre mot de passe puis saisir un code envoyé à votre adresse e-mail."
        pied={
          <>
            <Button variante="fantome" onClick={() => setDeconnexionOuverte(false)}>
              Rester connecté
            </Button>
            <Button variante="danger" onClick={() => void seDeconnecter()} disabled={loggingOut}>
              {loggingOut ? 'Déconnexion…' : 'Se déconnecter'}
            </Button>
          </>
        }
      >
        <p className="text-muted-foreground text-sm">
          Les commandes, la caisse et les mesures restent enregistrées — c’est l’accès depuis cet
          appareil qui se ferme.
        </p>
      </Modal>

      {/* Création / édition d'un tarif — écran absent des maquettes Banani. */}
      <Modal
        ouvert={tarifOuvert}
        onFermer={() => setTarifOuvert(false)}
        titre={tarifEdite ? 'Modifier le tarif' : 'Nouveau tarif'}
        description="Prix de façon appliqué par défaut à ce type de tenue."
        pied={
          <>
            <Button variante="fantome" onClick={() => setTarifOuvert(false)}>
              Annuler
            </Button>
            <Button type="submit" form="formulaire-tarif">
              {tarifEdite ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </>
        }
      >
        <form
          id="formulaire-tarif"
          onSubmit={(e) => void enregistrerTarif(e)}
          className="flex flex-col gap-4"
        >
          <Field
            label="Type de tenue"
            required
            autoFocus
            placeholder="Boubou bazin brodé"
            value={nomTenue}
            onChange={(e) => setNomTenue(e.target.value)}
          />
          <Field
            label="Prix de façon"
            type="number"
            required
            min={0}
            step={500}
            placeholder="25000"
            aide="En francs CFA, sans décimales."
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
          />
          {echecTarif && (
            <p role="alert" className="text-danger text-sm">
              {echecTarif}
            </p>
          )}
        </form>
      </Modal>

      {/* Ajout d'un artisan — écran absent des maquettes Banani. */}
      <Modal
        ouvert={artisanOuvert}
        onFermer={() => setArtisanOuvert(false)}
        titre="Ajouter un artisan"
        description="Les initiales sont déduites du nom ; elles identifient l’artisan sur les commandes et le planning."
        pied={
          <>
            <Button variante="fantome" onClick={() => setArtisanOuvert(false)}>
              Annuler
            </Button>
            <Button
              type="submit"
              form="formulaire-artisan"
              disabled={!nomArtisan.trim() || envoiArtisan}
            >
              {envoiArtisan ? 'Ajout…' : 'Ajouter à l’équipe'}
            </Button>
          </>
        }
      >
        <form id="formulaire-artisan" onSubmit={soumettreArtisan} className="flex flex-col gap-4">
          <Field
            label="Nom complet"
            required
            autoFocus
            placeholder="Moussa Koné"
            value={nomArtisan}
            onChange={(e) => setNomArtisan(e.target.value)}
          />
          <Field
            label="Rôle"
            required
            placeholder="Tailleur senior"
            value={roleArtisan}
            onChange={(e) => setRoleArtisan(e.target.value)}
          />
          <Field
            label="Capacité quotidienne (heures)"
            type="number"
            required
            min={1}
            max={16}
            aide="Un apprenti ne tient pas les 8 h d’un tailleur senior — le planning s’appuie sur ce chiffre."
            value={capaciteArtisan}
            onChange={(e) => setCapaciteArtisan(e.target.value)}
          />

          {echecEquipe && (
            <p role="alert" className="text-danger text-sm">
              {echecEquipe}
            </p>
          )}
        </form>
      </Modal>
    </div>
  );
}
