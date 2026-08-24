'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  THEME_DEFAUT,
  appliquerTheme,
  ecrireTheme,
  lireTheme,
  themeSuivant,
  type Theme,
} from '@/lib/theme';

type ThemeContextValue = {
  theme: Theme;
  basculer: () => void;
  definir: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: THEME_DEFAUT,
  basculer: () => {},
  definir: () => {},
});

/**
 * Fournit le thème courant et la bascule.
 *
 * L'état démarre volontairement sur THEME_DEFAUT plutôt que sur la valeur
 * stockée : le rendu serveur ne peut pas connaître le localStorage, et un état
 * initial divergent provoquerait une erreur d'hydratation. L'apparence, elle,
 * est déjà correcte au premier pixel — SCRIPT_ANTI_FLASH a posé l'attribut sur
 * <html> avant que React ne démarre. On se contente ici de rattraper l'état
 * React après montage.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(THEME_DEFAUT);
  const [monte, setMonte] = useState(false);

  useEffect(() => {
    setTheme(lireTheme(window.localStorage));
    setMonte(true);
  }, []);

  // Synchronise DOM + stockage à chaque changement, jamais avant le montage :
  // écrire pendant le premier rendu écraserait le choix mémorisé par le défaut.
  useEffect(() => {
    if (!monte) return;
    appliquerTheme(document.documentElement, theme);
    ecrireTheme(window.localStorage, theme);
  }, [monte, theme]);

  const basculer = useCallback(() => setTheme(themeSuivant), []);
  const definir = useCallback((suivant: Theme) => setTheme(suivant), []);

  return (
    <ThemeContext.Provider value={{ theme, basculer, definir }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
