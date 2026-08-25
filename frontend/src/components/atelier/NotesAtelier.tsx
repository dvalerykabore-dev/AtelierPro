'use client';

import { useState, type FormEvent } from 'react';
import { AlertCircle, Plus, Send } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { InitialesAtelier } from '@/components/atelier/IdentiteAtelier';
import { useNotesCommande } from '@/lib/useNotesCommande';

export interface NotesAtelierProps {
  /** Commande commentée. Les notes lui appartiennent et la suivent. */
  commandeId: string;
}

/**
 * Notes datées d'une commande.
 *
 * Elles vivaient dans l'état du composant, amorcées par un jeu d'exemple, et
 * signées d'un artisan fictif : un artisan écrivait « manches plus courtes »,
 * fermait l'onglet, et l'information n'existait plus — après que le formulaire
 * eut confirmé l'enregistrement. Elles sont maintenant écrites en base et
 * signées du compte connecté.
 */
export default function NotesAtelier({ commandeId }: NotesAtelierProps) {
  const { notes, chargement, session, erreur, ajouter } = useNotesCommande(commandeId);
  const [brouillon, setBrouillon] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [echec, setEchec] = useState<string | null>(null);

  async function soumettre(e: FormEvent) {
    e.preventDefault();
    const texte = brouillon.trim();
    if (!texte || envoi) return;

    setEnvoi(true);
    setEchec(null);
    const message = await ajouter(texte);
    setEnvoi(false);

    // Le brouillon n'est effacé qu'en cas de succès : perdre une note qu'on
    // vient de taper parce que le réseau a lâché serait le pire des deux maux.
    if (message) setEchec(message);
    else setBrouillon('');
  }

  return (
    <section className="px-4 py-5 lg:px-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-headings text-foreground text-sm font-bold">Notes atelier</h2>
        <Button
          variante="contour"
          taille="sm"
          className="border-primary text-primary"
          onClick={() => document.getElementById('nouvelle-note')?.focus()}
        >
          <Plus size={11} aria-hidden />
          Ajouter note
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {chargement && <p className="text-muted-foreground py-3 text-sm">Chargement des notes…</p>}

        {!chargement && notes.length === 0 && session && (
          <p className="text-muted-foreground py-3 text-sm">
            Aucune note pour l’instant. Ce qui s’écrit ici suit la commande — essayage, retouche
            demandée, tissu manquant.
          </p>
        )}

        {!session && (
          <p className="text-muted-foreground py-3 text-sm">
            Connectez-vous pour lire et écrire les notes de cette commande.
          </p>
        )}

        {erreur && (
          <p role="alert" className="text-danger flex items-start gap-2 text-sm">
            <AlertCircle size={15} className="mt-0.5 flex-shrink-0" aria-hidden />
            {erreur}
          </p>
        )}

        {notes.map((n) => (
          <article
            key={n.id}
            className="bg-surface border-border flex items-start gap-3 rounded-lg border px-4 py-3"
          >
            <Avatar initiales={n.initiales} taille="sm" className="mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-foreground text-xs font-bold">{n.auteur}</span>
                <span className="text-muted-foreground text-xs">{n.date}</span>
              </div>
              <p className="text-foreground text-sm">{n.texte}</p>
            </div>
          </article>
        ))}

        {session && (
          <form onSubmit={soumettre} className="flex flex-col gap-2">
            <div className="flex items-start gap-3">
              <Avatar initiales={<InitialesAtelier />} taille="sm" className="mt-1" />
              <div className="bg-input border-border focus-within:border-primary flex min-h-12 flex-1 items-end gap-2 rounded-lg border px-3 py-2 transition-colors">
                <textarea
                  id="nouvelle-note"
                  value={brouillon}
                  onChange={(e) => setBrouillon(e.target.value)}
                  onKeyDown={(e) => {
                    // Entrée envoie, Maj+Entrée passe à la ligne — convention des
                    // fils de discussion, plus rapide au clavier.
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void soumettre(e as unknown as FormEvent);
                    }
                  }}
                  rows={1}
                  placeholder="Ajouter une note ou observation…"
                  aria-label="Nouvelle note d’atelier"
                  className="text-foreground placeholder:text-muted-foreground min-h-6 flex-1 resize-none bg-transparent text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!brouillon.trim() || envoi}
                  aria-label="Publier la note"
                  className="text-primary flex-shrink-0 disabled:opacity-30"
                >
                  <Send size={16} aria-hidden />
                </button>
              </div>
            </div>

            {echec && (
              <p role="alert" className="text-danger flex items-start gap-2 pl-11 text-sm">
                <AlertCircle size={15} className="mt-0.5 flex-shrink-0" aria-hidden />
                {echec}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
