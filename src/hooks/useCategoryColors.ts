import { useState, useEffect, useCallback } from 'react';
import { TaskCategory, DEFAULT_CATEGORY_COLORS } from '@/types/task';

const STORAGE_KEY = 'athlete-planner-category-colors';
const COMPLETED_COLOR_KEY = 'athlete-planner-completed-day-color';
const DEFAULT_COMPLETED_COLOR = '145 65% 45%';

export function useCategoryColors() {
  const [colors, setColors] = useState<Record<TaskCategory, string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return { ...DEFAULT_CATEGORY_COLORS };
  });

  const [completedDayColor, setCompletedDayColorState] = useState<string>(() => {
    try {
      return localStorage.getItem(COMPLETED_COLOR_KEY) || DEFAULT_COMPLETED_COLOR;
    } catch {}
    return DEFAULT_COMPLETED_COLOR;
  });

  // Apply colors as CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--training', colors.training);
    root.style.setProperty('--academic', colors.academic);
    root.style.setProperty('--personal', colors.personal);
    root.style.setProperty('--completed-day', completedDayColor);
  }, [colors, completedDayColor]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
  }, [colors]);

  useEffect(() => {
    localStorage.setItem(COMPLETED_COLOR_KEY, completedDayColor);
  }, [completedDayColor]);

  const setCategoryColor = useCallback((category: TaskCategory, hsl: string) => {
    setColors(prev => ({ ...prev, [category]: hsl }));
  }, []);

  const setCompletedDayColor = useCallback((hsl: string) => {
    setCompletedDayColorState(hsl);
  }, []);

  const resetColors = useCallback(() => {
    setColors({ ...DEFAULT_CATEGORY_COLORS });
    setCompletedDayColorState(DEFAULT_COMPLETED_COLOR);
  }, []);

  return { colors, setCategoryColor, resetColors, completedDayColor, setCompletedDayColor };
}
