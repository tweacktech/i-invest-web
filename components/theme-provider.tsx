'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{ theme: Theme; toggle: () => void; setTheme: (t: Theme) => void } | null>(null);

const STORAGE_KEY = 'i-invest-theme';

function applyClass(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)) as Theme | null;
    const prefersDark =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const initial = stored === 'dark' || stored === 'light' ? stored : prefersDark ? 'dark' : 'light';
    setThemeState(initial);
    applyClass(initial);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
    applyClass(t);
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, next);
      applyClass(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggle, setTheme }), [theme, toggle, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
