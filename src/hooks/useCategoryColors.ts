import { useState, useEffect, useCallback } from 'react';
import { TaskCategory, DEFAULT_CATEGORY_COLORS } from '@/types/task';

const STORAGE_KEY = 'athlete-planner-category-colors';

export function useCategoryColors() {
  const [colors, setColors] = useState<Record<TaskCategory, string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return { ...DEFAULT_CATEGORY_COLORS };
  });

  // Apply colors as CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--training', colors.training);
    root.style.setProperty('--academic', colors.academic);
    root.style.setProperty('--personal', colors.personal);
  }, [colors]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
  }, [colors]);

  const setCategoryColor = useCallback((category: TaskCategory, hsl: string) => {
    setColors(prev => ({ ...prev, [category]: hsl }));
  }, []);

  const resetColors = useCallback(() => {
    setColors({ ...DEFAULT_CATEGORY_COLORS });
  }, []);

  return { colors, setCategoryColor, resetColors };
}
