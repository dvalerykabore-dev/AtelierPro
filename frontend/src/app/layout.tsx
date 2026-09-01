import type { Metadata } from 'next';
import { Noto_Sans_Arabic, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/contexts/ToastContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LangueProvider } from '@/contexts/LangueContext';
import { SCRIPT_ANTI_FLASH } from '@/lib/theme';
import { SCRIPT_ANTI_FLASH_LANGUE } from '@/lib/langue';

// Police du système de design Banani (--font-body et --font-headings pointent
// tous deux dessus dans globals.css).
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

// Space Grotesk ne dessine aucun caractère arabe. Sans cette famille, le
// navigateur se rabattrait sur une police système sans rapport avec le reste
// de l'écran. globals.css la place en tête de `--font-body` sous [lang='ar'].
const notoArabe = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-arabe',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AtelierPro — gestion d’atelier de couture',
  description:
    'Commandes, mesures, planning d’équipe et clients — la gestion complète de votre atelier de couture.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning : le script ci-dessous pose `data-theme` sur
    // <html> avant l'hydratation, donc l'attribut diffère forcément du HTML
    // rendu côté serveur. C'est voulu, et le silence est limité à cet élément.
    //
    // data-scroll-behavior : globals.css pose `scroll-behavior: smooth` pour
    // les ancres de la page d'accueil. Sans cet attribut, le routeur de Next
    // ne sait pas que le défilement est animé et le laisse s'animer aussi
    // pendant les changements de page — on voit alors la page défiler jusqu'en
    // haut au lieu d'y être. L'attribut lui dit de le neutraliser le temps de
    // la navigation, puis de le rendre aux ancres.
    <html
      lang="fr"
      dir="ltr"
      className={`${spaceGrotesk.variable} ${notoArabe.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/*
         * Applique le thème mémorisé avant le premier pixel. Sans ce script,
         * React ne poserait l'attribut qu'après hydratation et un utilisateur
         * en thème clair verrait un flash bleu nuit à chaque page.
         * Le contenu est une constante du code (lib/theme.ts), sans aucune
         * donnée externe : rien à échapper.
         */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_ANTI_FLASH }} />
        {/*
         * Même principe pour la langue, et l'enjeu y est plus grand : l'arabe
         * retourne la mise en page. Sans ce script, un utilisateur arabophone
         * verrait la page se construire de gauche à droite puis basculer
         * entièrement à l'hydratation. Constante de lib/langue.ts, sans
         * donnée externe.
         */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_ANTI_FLASH_LANGUE }} />
      </head>
      <body className="bg-background text-foreground font-body antialiased">
        <ThemeProvider>
          <LangueProvider>
            <ToastProvider>
              <AuthProvider>{children}</AuthProvider>
            </ToastProvider>
          </LangueProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
