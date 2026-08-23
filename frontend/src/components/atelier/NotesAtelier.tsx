'use client';

import { useState, type FormEvent } from 'react';
import { Plus, Send } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { notesAtelier as notesInitiales, type NoteAtelier } from '@/lib/mock/atelier';

const AUTEUR = { nom: 'Moussa K.', initiales: 'MK' };

/**
 * Notes d'atelier d'une commande.
 *
 * La maquette Banani montre une zone « Ajouter une note… » inerte et un bouton
 * « Ajouter note » sans destination : ici la saisie fonctionne réellement et la
 * note s'ajoute en tête de liste.
 */
export default function NotesAtelier() {
  const [notes, setNotes] = useState<NoteAtelier[]>(notesInitiales);
  const [brouillon, setBrouillon] = useState('');

  function ajouter(e: FormEvent) {
    e.preventDefault();
    const texte = brouillon.trim();
    if (!texte) return;

    setNotes((prec) => [
      {
        auteur: AUTEUR.nom,
        initiales: AUTEUR.initiales,
        date: "À l'instant",
        texte,
      },
      ...prec,
    ]);
    setBrouillon('');
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
        {notes.map((n, i) => (
          <article
            key={`${n.auteur}-${n.date}-${i}`}
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

        <form onSubmit={ajouter} className="flex items-start gap-3">
          <Avatar initiales={AUTEUR.initiales} taille="sm" className="mt-1" />
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
                  ajouter(e as unknown as FormEvent);
                }
              }}
              rows={1}
              placeholder="Ajouter une note ou observation…"
              aria-label="Nouvelle note d’atelier"
              className="text-foreground placeholder:text-muted-foreground min-h-6 flex-1 resize-none bg-transparent text-sm focus:outline-none"
            />
            <button
              type="submit"
              disabled={!brouillon.trim()}
              aria-label="Publier la note"
              className="text-primary flex-shrink-0 disabled:opacity-30"
            >
              <Send size={16} aria-hidden />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
