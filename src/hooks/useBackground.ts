import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'athlete-planner-background';
const OPACITY_KEY = 'athlete-planner-background-opacity';

function apply(image: string | null, opacity: number) {
  const body = document.body;
  if (image) {
    body.style.backgroundImage = `linear-gradient(hsl(var(--background) / ${1 - opacity}), hsl(var(--background) / ${1 - opacity})), url(${image})`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center';
    body.style.backgroundAttachment = 'fixed';
    body.style.backgroundRepeat = 'no-repeat';
  } else {
    body.style.backgroundImage = '';
    body.style.backgroundSize = '';
    body.style.backgroundPosition = '';
    body.style.backgroundAttachment = '';
    body.style.backgroundRepeat = '';
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

  useEffect(() => {
    apply(background, opacity);
  }, [background, opacity]);

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

  return { background, setBackground, opacity, setOpacity };
}
