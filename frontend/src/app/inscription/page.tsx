'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import Button from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { api, ApiError } from '@/lib/api';

const MESSAGES: Record<string, string> = {
  PASSWORD_TOO_SHORT: 'Le mot de passe doit faire au moins 10 caractères.',
  PASSWORD_BANNED: 'Ce mot de passe est trop courant. Choisissez-en un autre.',
  PASSWORD_PWNED: 'Ce mot de passe a fuité lors d’une brèche connue. Choisissez-en un autre.',
  VALIDATION_FAILED: 'Vérifiez l’adresse e-mail saisie.',
  TOO_MANY_SIGNUP_ATTEMPTS: 'Trop de tentatives. Réessayez dans une heure.',
};

export default function InscriptionPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    try {
      await api('/api/auth/signup', { method: 'POST', body: { email, password: motDePasse } });
      // L'inscription ne pose aucun cookie et renvoie 201 même si l'adresse
      // existe déjà (résistance à l'énumération) : on redirige donc toujours
      // vers la saisie du code, sans révéler si le compte était nouveau.
      router.push(`/verification?email=${encodeURIComponent(email)}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setErreur(MESSAGES[err.code ?? ''] ?? err.message);
      } else {
        setErreur('Impossible de joindre le serveur. Vérifiez votre connexion.');
      }
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <AuthCard
      titre="Créer votre atelier"
      sousTitre="Quelques secondes pour commencer à suivre vos commandes."
      pied={
        <>
          Vous avez déjà un compte ?{' '}
          <Link href="/connexion" className="text-primary font-medium">
            Se connecter
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field
          label="Adresse e-mail"
          type="email"
          required
          autoComplete="email"
          placeholder="vous@atelier.bf"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label="Mot de passe"
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          placeholder="••••••••••"
          aide="10 caractères minimum. Une phrase est plus sûre qu’un mot compliqué."
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
        />

        {erreur && (
          <p role="alert" className="text-danger flex items-start gap-2 text-sm">
            <AlertCircle size={15} className="mt-0.5 flex-shrink-0" aria-hidden />
            {erreur}
          </p>
        )}

        <Button type="submit" taille="lg" pleineLargeur disabled={envoi}>
          {envoi ? 'Création…' : 'Créer mon compte'}
        </Button>

        <p className="text-muted-foreground text-center text-xs">
          Un code de vérification vous sera envoyé par e-mail.
        </p>
      </form>
    </AuthCard>
  );
}
