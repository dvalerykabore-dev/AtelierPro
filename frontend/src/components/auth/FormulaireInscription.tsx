'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import AuthCard from '@/components/auth/AuthCard';
import BoutonGoogle from '@/components/auth/BoutonGoogle';
import Button from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import Traduction from '@/components/ui/Traduction';
import { api, ApiError } from '@/lib/api';
import { PLANS_TARIFAIRES } from '@/lib/landing-contenu';
import { definitionDe } from '@/lib/plans';
import { useT } from '@/contexts/LangueContext';

const MESSAGES: Record<string, string> = {
  PASSWORD_TOO_SHORT: 'Le mot de passe doit faire au moins 10 caractères.',
  PASSWORD_BANNED: 'Ce mot de passe est trop courant. Choisissez-en un autre.',
  PASSWORD_PWNED: 'Ce mot de passe a fuité lors d’une brèche connue. Choisissez-en un autre.',
  VALIDATION_FAILED: 'Vérifiez l’adresse e-mail saisie.',
  TOO_MANY_SIGNUP_ATTEMPTS: 'Trop de tentatives. Réessayez dans une heure.',
};

export default function FormulaireInscription() {
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  // Plan choisi depuis la grille tarifaire de la page d'accueil. La mention
  // reste volontairement neutre : aucune facturation n'est branchée, annoncer
  // un montant ou un engagement ici serait une promesse sans contrepartie.
  // Le plan n'est pas transmis au serveur — `/api/auth/signup` n'a pas de
  // champ pour ça, et en inventer un donnerait l'illusion d'un abonnement.
  const planChoisi = PLANS_TARIFAIRES.find((p) => p.cle === params.get('plan'));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    try {
      await api('/api/auth/signup', {
        method: 'POST',
        body: {
          email,
          password: motDePasse,
          // Intention d’achat, pas un droit : le serveur l’enregistre à part et
          // le compte s’ouvre au gratuit.
          ...(planChoisi ? { plan: planChoisi.cle } : {}),
        },
      });
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
      titre={t('Créer votre atelier')}
      sousTitre={t('Quelques secondes pour commencer à suivre vos commandes.')}
      pied={
        <>
          {t('Vous avez déjà un compte ?')}{' '}
          <Link href="/connexion" className="text-primary font-medium">
            {t('Se connecter')}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {planChoisi && (
          <p className="border-border bg-muted text-muted-foreground rounded-md border px-3 py-2 text-xs">
            <Traduction
              cle="Palier retenu : {plan}. Votre atelier s’ouvre gratuitement — nous vous contactons avant tout encaissement."
              elements={{
                plan: (
                  <span className="text-foreground font-bold">
                    {t(definitionDe(planChoisi.cle).nom)}
                  </span>
                ),
              }}
            />
          </p>
        )}

        <Field
          label={t('Adresse e-mail')}
          type="email"
          required
          autoComplete="email"
          placeholder="vous@atelier.bf"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label={t('Mot de passe')}
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          placeholder="••••••••••"
          aide={t('10 caractères minimum. Une phrase est plus sûre qu’un mot compliqué.')}
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
        />

        {erreur && (
          <p role="alert" className="text-danger flex items-start gap-2 text-sm">
            <AlertCircle size={15} className="mt-0.5 flex-shrink-0" aria-hidden />
            {t(erreur)}
          </p>
        )}

        <Button type="submit" taille="lg" pleineLargeur disabled={envoi}>
          {envoi ? t('Création…') : t('Créer mon compte')}
        </Button>

        <p className="text-muted-foreground text-center text-xs">
          {t('Un code de vérification vous sera envoyé par e-mail.')}
        </p>
      </form>

      <BoutonGoogle />
    </AuthCard>
  );
}
