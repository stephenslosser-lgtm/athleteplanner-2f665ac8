import { useState, useEffect, useCallback } from 'react';

export interface ThemePreset {
  name: string;
  mode: 'dark' | 'light';
  primary: string;
  accent: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  destructiveForeground: string;
  primaryForeground: string;
  popoverForeground: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  // Dark themes
  {
    name: 'Teal (Default)',
    mode: 'dark',
    primary: '174 72% 50%',
    accent: '174 72% 50%',
    background: '220 20% 7%',
    foreground: '210 20% 95%',
    card: '220 18% 11%',
    cardForeground: '210 20% 95%',
    secondary: '220 16% 16%',
    secondaryForeground: '210 20% 85%',
    muted: '220 14% 14%',
    mutedForeground: '215 15% 55%',
    border: '220 14% 18%',
    destructiveForeground: '210 20% 95%',
    primaryForeground: '220 20% 7%',
    popoverForeground: '210 20% 95%',
  },
  {
    name: 'Ocean Blue',
    mode: 'dark',
    primary: '210 80% 55%',
    accent: '210 80% 55%',
    background: '220 25% 6%',
    foreground: '210 20% 95%',
    card: '220 22% 10%',
    cardForeground: '210 20% 95%',
    secondary: '220 20% 15%',
    secondaryForeground: '210 20% 85%',
    muted: '220 18% 13%',
    mutedForeground: '215 15% 55%',
    border: '220 18% 17%',
    destructiveForeground: '210 20% 95%',
    primaryForeground: '210 20% 98%',
    popoverForeground: '210 20% 95%',
  },
  {
    name: 'Purple Haze',
    mode: 'dark',
    primary: '270 70% 60%',
    accent: '270 70% 60%',
    background: '260 20% 7%',
    foreground: '210 20% 95%',
    card: '260 18% 11%',
    cardForeground: '210 20% 95%',
    secondary: '260 16% 16%',
    secondaryForeground: '210 20% 85%',
    muted: '260 14% 14%',
    mutedForeground: '260 15% 55%',
    border: '260 14% 18%',
    destructiveForeground: '210 20% 95%',
    primaryForeground: '260 20% 98%',
    popoverForeground: '210 20% 95%',
  },
  {
    name: 'Sunset',
    mode: 'dark',
    primary: '20 85% 55%',
    accent: '20 85% 55%',
    background: '15 20% 7%',
    foreground: '210 20% 95%',
    card: '15 18% 11%',
    cardForeground: '210 20% 95%',
    secondary: '15 16% 16%',
    secondaryForeground: '210 20% 85%',
    muted: '15 14% 14%',
    mutedForeground: '15 15% 55%',
    border: '15 14% 18%',
    destructiveForeground: '210 20% 95%',
    primaryForeground: '15 20% 98%',
    popoverForeground: '210 20% 95%',
  },
  {
    name: 'Rose',
    mode: 'dark',
    primary: '340 75% 55%',
    accent: '340 75% 55%',
    background: '340 15% 7%',
    foreground: '210 20% 95%',
    card: '340 12% 11%',
    cardForeground: '210 20% 95%',
    secondary: '340 10% 16%',
    secondaryForeground: '210 20% 85%',
    muted: '340 10% 14%',
    mutedForeground: '340 10% 55%',
    border: '340 10% 18%',
    destructiveForeground: '210 20% 95%',
    primaryForeground: '340 20% 98%',
    popoverForeground: '210 20% 95%',
  },
  {
    name: 'Emerald',
    mode: 'dark',
    primary: '155 65% 45%',
    accent: '155 65% 45%',
    background: '160 20% 6%',
    foreground: '210 20% 95%',
    card: '160 18% 10%',
    cardForeground: '210 20% 95%',
    secondary: '160 16% 15%',
    secondaryForeground: '210 20% 85%',
    muted: '160 14% 13%',
    mutedForeground: '160 15% 50%',
    border: '160 14% 17%',
    destructiveForeground: '210 20% 95%',
    primaryForeground: '160 20% 98%',
    popoverForeground: '210 20% 95%',
  },
  // Light themes
  {
    name: 'Light Teal',
    mode: 'light',
    primary: '174 72% 40%',
    accent: '174 72% 40%',
    background: '210 20% 98%',
    foreground: '220 20% 10%',
    card: '0 0% 100%',
    cardForeground: '220 20% 10%',
    secondary: '210 15% 93%',
    secondaryForeground: '220 15% 30%',
    muted: '210 15% 95%',
    mutedForeground: '215 12% 45%',
    border: '210 15% 88%',
    destructiveForeground: '0 0% 100%',
    primaryForeground: '0 0% 100%',
    popoverForeground: '220 20% 10%',
  },
  {
    name: 'Light Blue',
    mode: 'light',
    primary: '210 80% 50%',
    accent: '210 80% 50%',
    background: '210 25% 98%',
    foreground: '220 25% 10%',
    card: '0 0% 100%',
    cardForeground: '220 25% 10%',
    secondary: '210 20% 93%',
    secondaryForeground: '220 20% 30%',
    muted: '210 18% 95%',
    mutedForeground: '215 15% 45%',
    border: '210 18% 88%',
    destructiveForeground: '0 0% 100%',
    primaryForeground: '0 0% 100%',
    popoverForeground: '220 25% 10%',
  },
  {
    name: 'Light Rose',
    mode: 'light',
    primary: '340 75% 48%',
    accent: '340 75% 48%',
    background: '340 15% 98%',
    foreground: '340 20% 10%',
    card: '0 0% 100%',
    cardForeground: '340 20% 10%',
    secondary: '340 12% 93%',
    secondaryForeground: '340 15% 30%',
    muted: '340 10% 95%',
    mutedForeground: '340 10% 45%',
    border: '340 12% 88%',
    destructiveForeground: '0 0% 100%',
    primaryForeground: '0 0% 100%',
    popoverForeground: '340 20% 10%',
  },
];

const STORAGE_KEY = 'athlete-planner-theme';

function applyTheme(theme: ThemePreset) {
  const root = document.documentElement;
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--primary-foreground', theme.primaryForeground);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--accent-foreground', theme.primaryForeground);
  root.style.setProperty('--ring', theme.primary);
  root.style.setProperty('--background', theme.background);
  root.style.setProperty('--foreground', theme.foreground);
  root.style.setProperty('--card', theme.card);
  root.style.setProperty('--card-foreground', theme.cardForeground);
  root.style.setProperty('--secondary', theme.secondary);
  root.style.setProperty('--secondary-foreground', theme.secondaryForeground);
  root.style.setProperty('--muted', theme.muted);
  root.style.setProperty('--muted-foreground', theme.mutedForeground);
  root.style.setProperty('--border', theme.border);
  root.style.setProperty('--input', theme.border);
  root.style.setProperty('--popover', theme.card);
  root.style.setProperty('--popover-foreground', theme.popoverForeground);
  root.style.setProperty('--destructive-foreground', theme.destructiveForeground);
  root.style.setProperty('--sidebar-background', theme.background);
  root.style.setProperty('--sidebar-foreground', theme.foreground);
  root.style.setProperty('--sidebar-primary', theme.primary);
  root.style.setProperty('--sidebar-primary-foreground', theme.primaryForeground);
  root.style.setProperty('--sidebar-accent', theme.muted);
  root.style.setProperty('--sidebar-accent-foreground', theme.secondaryForeground);
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
