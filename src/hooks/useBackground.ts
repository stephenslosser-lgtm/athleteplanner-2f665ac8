import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'athlete-planner-background';
const OPACITY_KEY = 'athlete-planner-background-opacity';
const CARD_OPACITY_KEY = 'athlete-planner-card-opacity';

function apply(image: string | null, opacity: number, cardOpacity: number) {
  const html = document.documentElement;
  const body = document.body;
  html.style.setProperty('--card-alpha', String(cardOpacity));
  if (image) {
    const overlay = Math.max(0, Math.min(1, 1 - opacity));
    html.style.backgroundImage = `linear-gradient(hsl(var(--background) / ${overlay}), hsl(var(--background) / ${overlay})), url("${image}")`;
    html.style.backgroundSize = 'cover';
    html.style.backgroundPosition = 'center';
    html.style.backgroundAttachment = 'fixed';
    html.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundColor = 'transparent';
    body.dataset.customBg = 'true';
  } else {
    html.style.backgroundImage = '';
    html.style.backgroundSize = '';
    html.style.backgroundPosition = '';
    html.style.backgroundAttachment = '';
    html.style.backgroundRepeat = '';
    body.style.backgroundColor = '';
    delete body.dataset.customBg;
  }
}

export function useBackground() {
  const [background, setBackgroundState] = useState<string | null>(() => {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  });
  const [opacity, setOpacityState] = useState<number>(() => {
    try {
      const v = localStorage.getItem(OPACITY_KEY);
      return v ? parseFloat(v) : 0.6;
    } catch { return 0.6; }
  });
  const [cardOpacity, setCardOpacityState] = useState<number>(() => {
    try {
      const v = localStorage.getItem(CARD_OPACITY_KEY);
      return v ? parseFloat(v) : 0.85;
    } catch { return 0.85; }
  });

  useEffect(() => {
    apply(background, opacity, cardOpacity);
  }, [background, opacity, cardOpacity]);

  const setBackground = useCallback((image: string | null) => {
    setBackgroundState(image);
    try {
      if (image) localStorage.setItem(STORAGE_KEY, image);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const setOpacity = useCallback((v: number) => {
    setOpacityState(v);
    try { localStorage.setItem(OPACITY_KEY, String(v)); } catch {}
  }, []);

  const setCardOpacity = useCallback((v: number) => {
    setCardOpacityState(v);
    try { localStorage.setItem(CARD_OPACITY_KEY, String(v)); } catch {}
  }, []);

  return { background, setBackground, opacity, setOpacity, cardOpacity, setCardOpacity };
}
