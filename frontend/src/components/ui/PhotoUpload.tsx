'use client';

import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import Image from 'next/image';
import { ImagePlus, Loader2, Trash2, TriangleAlert } from 'lucide-react';
import { COOKIE_PREFIX } from '@/lib/constants';
import { cn } from '@/lib/utils';

export interface PhotoEnvoyee {
  id: string;
  url: string;
  nomFichier: string;
  /** `true` tant que la photo n'existe que dans le navigateur. */
  locale: boolean;
}

export interface PhotoUploadProps {
  label: string;
  description?: string;
  photos: PhotoEnvoyee[];
  onChange: (photos: PhotoEnvoyee[]) => void;
  /** Au-delà, le sélecteur se désactive. `1` donne un emplacement unique. */
  maximum?: number;
  className?: string;
}

/**
 * Jeton CSRF du projet.
 *
 * `getCsrfToken` n'est pas exporté par `lib/api.ts`, fichier protégé par le
 * CLAUDE.md : on relit donc le cookie ici plutôt que de le modifier. Même
 * source, même nom — seul le point de lecture change.
 */
function jetonCsrf(): string | null {
  if (typeof window === 'undefined') return null;
  const cle = `${COOKIE_PREFIX}-csrf`;
  const depuisStockage = localStorage.getItem(cle);
  if (depuisStockage) return depuisStockage;
  const echappe = cle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const trouve = document.cookie.match(new RegExp(`(?:^|;\\s*)${echappe}=([^;]*)`));
  return trouve && trouve[1] ? decodeURIComponent(trouve[1]) : null;
}

const MIMES_ACCEPTES = 'image/jpeg,image/png,image/webp,image/heic,image/heif';

/**
 * Zone d'envoi de photos, branchée sur `POST /api/upload` (Cloudinary).
 *
 * L'aperçu s'affiche immédiatement depuis le fichier local, avant même la
 * réponse du serveur : une prise de mesures se fait souvent sur un téléphone,
 * en 3G, et attendre l'aller-retour rendrait l'écran inutilisable.
 *
 * La route exige une session. En mode démonstration (sans compte), l'envoi
 * échoue en 401 : on conserve alors l'aperçu local et on l'annonce clairement,
 * plutôt que de faire croire à un enregistrement qui n'a pas eu lieu.
 */
export default function PhotoUpload({
  label,
  description,
  photos,
  onChange,
  maximum = 6,
  className,
}: PhotoUploadProps) {
  const champ = useRef<HTMLInputElement>(null);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [survol, setSurvol] = useState(false);
  const [avertissement, setAvertissement] = useState<string | null>(null);

  const complet = photos.length >= maximum;

  async function traiter(fichiers: FileList | null) {
    if (!fichiers?.length) return;
    setAvertissement(null);

    const restants = maximum - photos.length;
    const aTraiter = Array.from(fichiers).slice(0, Math.max(0, restants));
    if (aTraiter.length === 0) return;

    setEnvoiEnCours(true);
    const ajoutees: PhotoEnvoyee[] = [];

    for (const fichier of aTraiter) {
      // Aperçu immédiat, indépendant du réseau.
      const apercuLocal = URL.createObjectURL(fichier);
      let entree: PhotoEnvoyee = {
        id: `local-${Date.now()}-${fichier.name}`,
        url: apercuLocal,
        nomFichier: fichier.name,
        locale: true,
      };

      try {
        const donnees = new FormData();
        donnees.append('file', fichier);

        const entetes: Record<string, string> = {};
        const csrf = jetonCsrf();
        if (csrf) entetes['x-csrf-token'] = csrf;

        const rep = await fetch('/api/upload', {
          method: 'POST',
          body: donnees,
          credentials: 'include',
          headers: entetes,
        });

        if (rep.ok) {
          const corps = (await rep.json()) as { id: string; url: string; filename: string };
          URL.revokeObjectURL(apercuLocal);
          entree = { id: corps.id, url: corps.url, nomFichier: corps.filename, locale: false };
        } else if (rep.status === 401 || rep.status === 403) {
          setAvertissement(
            'Photo affichée localement seulement — connectez-vous pour l’enregistrer durablement.',
          );
        } else if (rep.status === 503) {
          setAvertissement('Le stockage d’images n’est pas configuré sur ce serveur.');
        } else if (rep.status === 413) {
          setAvertissement(`« ${fichier.name} » dépasse la taille maximale autorisée.`);
          URL.revokeObjectURL(apercuLocal);
          continue;
        } else if (rep.status === 415) {
          setAvertissement(`« ${fichier.name} » n’est pas une image acceptée (JPEG, PNG, WebP).`);
          URL.revokeObjectURL(apercuLocal);
          continue;
        } else {
          setAvertissement('L’envoi a échoué — la photo reste visible mais n’est pas enregistrée.');
        }
      } catch {
        setAvertissement(
          'Serveur injoignable — la photo reste visible mais n’est pas enregistrée.',
        );
      }

      ajoutees.push(entree);
    }

    onChange([...photos, ...ajoutees]);
    setEnvoiEnCours(false);
    if (champ.current) champ.current.value = '';
  }

  function surDepot(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setSurvol(false);
    void traiter(e.dataTransfer.files);
  }

  function retirer(id: string) {
    const cible = photos.find((p) => p.id === id);
    if (cible?.locale) URL.revokeObjectURL(cible.url);
    onChange(photos.filter((p) => p.id !== id));
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div>
        <h3 className="font-headings text-foreground text-sm font-bold">{label}</h3>
        {description && <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>}
      </div>

      {/* Deux colonnes au maximum : ce composant vit dans une colonne étroite
          (384px), où les points de rupture — qui mesurent la fenêtre et non le
          conteneur — donneraient des vignettes de 110px illisibles. */}
      <div className={cn('grid gap-3', maximum === 1 ? 'grid-cols-1' : 'grid-cols-2')}>
        {photos.map((p) => (
          <figure
            key={p.id}
            className="border-border bg-muted group relative overflow-hidden rounded-lg border"
          >
            <div className={cn('relative w-full', maximum === 1 ? 'aspect-4/3' : 'aspect-square')}>
              {/* `unoptimized` : les URL Cloudinary et les aperçus blob ne passent
                  pas par l'optimiseur de Next sans configuration de domaines. */}
              <Image src={p.url} alt={p.nomFichier} fill unoptimized className="object-cover" />
            </div>

            <figcaption className="bg-background/80 absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-2 py-1.5">
              <span className="text-foreground truncate text-[10px]">{p.nomFichier}</span>
              {p.locale && (
                <span className="text-warning flex-shrink-0 text-[10px] font-medium">local</span>
              )}
            </figcaption>

            <button
              type="button"
              onClick={() => retirer(p.id)}
              aria-label={`Retirer ${p.nomFichier}`}
              className="bg-background/80 text-muted-foreground hover:text-danger absolute top-1.5 right-1.5 rounded-md p-1.5"
            >
              <Trash2 size={13} aria-hidden />
            </button>
          </figure>
        ))}

        {!complet && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setSurvol(true);
            }}
            onDragLeave={() => setSurvol(false)}
            onDrop={surDepot}
            className={cn(
              'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4 transition-colors',
              maximum === 1 ? 'aspect-4/3' : 'aspect-square',
              survol ? 'border-primary bg-primary/5' : 'border-border bg-input',
            )}
          >
            <input
              ref={champ}
              type="file"
              accept={MIMES_ACCEPTES}
              multiple={maximum > 1}
              onChange={(e: ChangeEvent<HTMLInputElement>) => void traiter(e.target.files)}
              className="hidden"
              id={`photo-${label}`}
            />
            <label
              htmlFor={`photo-${label}`}
              className="text-muted-foreground hover:text-primary flex cursor-pointer flex-col items-center gap-2 text-center"
            >
              {envoiEnCours ? (
                <Loader2 size={20} className="animate-spin" aria-hidden />
              ) : (
                <ImagePlus size={20} aria-hidden />
              )}
              <span className="text-xs font-medium">{envoiEnCours ? 'Envoi…' : 'Ajouter'}</span>
              <span className="text-[10px] leading-tight">Photo ou glisser-déposer</span>
            </label>
          </div>
        )}
      </div>

      {avertissement && (
        <p className="text-warning flex items-start gap-2 text-xs">
          <TriangleAlert size={13} className="mt-0.5 flex-shrink-0" aria-hidden />
          {avertissement}
        </p>
      )}
    </div>
  );
}
