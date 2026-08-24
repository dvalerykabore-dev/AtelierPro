'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import BoutonGoogle from '@/components/auth/BoutonGoogle';
import Button from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { api, ApiError, storeCsrfToken } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

/** Messages métier — l'API renvoie des codes stables, pas du texte à afficher. */
const MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Adresse e-mail ou mot de passe incorrect.',
  EMAIL_NOT_VERIFIED: 'Votre compte n’est pas encore vérifié. Consultez vos e-mails.',
  LOCKED_OUT: 'Trop de tentatives. Réessayez dans quelques minutes.',
  TOO_MANY_LOGIN_ATTEMPTS: 'Trop de tentatives. Réessayez dans quelques minutes.',
};

export default function ConnexionPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    try {
      const res = await api<{ csrfToken?: string }>('/api/auth/login', {
        method: 'POST',
        body: { email, password: motDePasse },
      });
      if (res.csrfToken) storeCsrfToken(res.csrfToken);
      await refresh();
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === 'EMAIL_NOT_VERIFIED') {
          router.push(`/verification?email=${encodeURIComponent(email)}`);
          return;
        }
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
      titre="Connexion"
      sousTitre="Accédez à vos commandes, votre planning et vos clients."
      pied={
        <>
          Pas encore de compte ?{' '}
          <Link href="/inscription" className="text-primary font-medium">
            Créer un atelier
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

        <div className="flex flex-col gap-1.5">
          <Field
            label="Mot de passe"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••••"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
          />
          <Link
            href="/mot-de-passe-oublie"
            className="text-muted-foreground hover:text-primary self-end text-xs"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        {erreur && (
          <p role="alert" className="text-danger flex items-start gap-2 text-sm">
            <AlertCircle size={15} className="mt-0.5 flex-shrink-0" aria-hidden />
            {erreur}
          </p>
        )}

        <Button type="submit" taille="lg" pleineLargeur disabled={envoi}>
          {envoi ? 'Connexion…' : 'Se connecter'}
        </Button>
      </form>

      <BoutonGoogle />
    </AuthCard>
  );
}
