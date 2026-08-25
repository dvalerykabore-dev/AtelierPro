import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/contexts/ToastContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SCRIPT_ANTI_FLASH } from '@/lib/theme';

// Police du système de design Banani (--font-body et --font-headings pointent
// tous deux dessus dans globals.css).
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
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
      className={spaceGrotesk.variable}
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
      </head>
      <body className="bg-background text-foreground font-body antialiased">
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>{children}</AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
