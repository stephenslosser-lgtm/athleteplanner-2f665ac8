import { useState, useEffect, useCallback } from 'react';

export interface ThemePreset {
  name: string;
  primary: string;
  accent: string;
  background: string;
  card: string;
  secondary: string;
  muted: string;
  border: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    name: 'Teal (Default)',
    primary: '174 72% 50%',
    accent: '174 72% 50%',
    background: '220 20% 7%',
    card: '220 18% 11%',
    secondary: '220 16% 16%',
    muted: '220 14% 14%',
    border: '220 14% 18%',
  },
  {
    name: 'Ocean Blue',
    primary: '210 80% 55%',
    accent: '210 80% 55%',
    background: '220 25% 6%',
    card: '220 22% 10%',
    secondary: '220 20% 15%',
    muted: '220 18% 13%',
    border: '220 18% 17%',
  },
  {
    name: 'Purple Haze',
    primary: '270 70% 60%',
    accent: '270 70% 60%',
    background: '260 20% 7%',
    card: '260 18% 11%',
    secondary: '260 16% 16%',
    muted: '260 14% 14%',
    border: '260 14% 18%',
  },
  {
    name: 'Sunset',
    primary: '20 85% 55%',
    accent: '20 85% 55%',
    background: '15 20% 7%',
    card: '15 18% 11%',
    secondary: '15 16% 16%',
    muted: '15 14% 14%',
    border: '15 14% 18%',
  },
  {
    name: 'Rose',
    primary: '340 75% 55%',
    accent: '340 75% 55%',
    background: '340 15% 7%',
    card: '340 12% 11%',
    secondary: '340 10% 16%',
    muted: '340 10% 14%',
    border: '340 10% 18%',
  },
  {
    name: 'Emerald',
    primary: '155 65% 45%',
    accent: '155 65% 45%',
    background: '160 20% 6%',
    card: '160 18% 10%',
    secondary: '160 16% 15%',
    muted: '160 14% 13%',
    border: '160 14% 17%',
  },
];

const STORAGE_KEY = 'athlete-planner-theme';

function applyTheme(theme: ThemePreset) {
  const root = document.documentElement;
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--ring', theme.primary);
  root.style.setProperty('--background', theme.background);
  root.style.setProperty('--card', theme.card);
  root.style.setProperty('--card-foreground', '210 20% 95%');
  root.style.setProperty('--secondary', theme.secondary);
  root.style.setProperty('--muted', theme.muted);
  root.style.setProperty('--border', theme.border);
  root.style.setProperty('--input', theme.border);
  root.style.setProperty('--popover', theme.card);
  root.style.setProperty('--sidebar-background', theme.background);
  root.style.setProperty('--sidebar-primary', theme.primary);
  root.style.setProperty('--sidebar-accent', theme.muted);
  root.style.setProperty('--sidebar-border', theme.border);
  root.style.setProperty('--sidebar-ring', theme.primary);
}

export function useTheme() {
  const [activeTheme, setActiveTheme] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || THEME_PRESETS[0].name;
    } catch {
      return THEME_PRESETS[0].name;
    }
  });

  useEffect(() => {
    const theme = THEME_PRESETS.find(t => t.name === activeTheme) || THEME_PRESETS[0];
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, activeTheme);
  }, [activeTheme]);

  const setTheme = useCallback((name: string) => {
    setActiveTheme(name);
  }, []);

  return { activeTheme, setTheme, themes: THEME_PRESETS };
}
