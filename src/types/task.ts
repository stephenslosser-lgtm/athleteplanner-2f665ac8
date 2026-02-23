export type TaskCategory = 'training' | 'academic' | 'personal';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  date: string; // YYYY-MM-DD
  completed: boolean;
  time?: string;
}

export interface ColorPreset {
  name: string;
  hsl: string; // e.g. "174 72% 50%"
}

export const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Teal', hsl: '174 72% 50%' },
  { name: 'Blue', hsl: '210 80% 55%' },
  { name: 'Indigo', hsl: '240 65% 60%' },
  { name: 'Purple', hsl: '280 65% 60%' },
  { name: 'Pink', hsl: '330 70% 55%' },
  { name: 'Red', hsl: '0 72% 55%' },
  { name: 'Orange', hsl: '25 90% 55%' },
  { name: 'Amber', hsl: '45 90% 55%' },
  { name: 'Green', hsl: '145 65% 45%' },
  { name: 'Lime', hsl: '80 65% 45%' },
];

export const DEFAULT_CATEGORY_COLORS: Record<TaskCategory, string> = {
  training: '174 72% 50%',
  academic: '45 90% 55%',
  personal: '280 65% 60%',
};

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  training: 'Training',
  academic: 'Academic',
  personal: 'Personal',
};

// Legacy config kept for compatibility
export const CATEGORY_CONFIG: Record<TaskCategory, { label: string; colorClass: string; dotClass: string }> = {
  training: { label: 'Training', colorClass: 'bg-training', dotClass: 'bg-training' },
  academic: { label: 'Academic', colorClass: 'bg-academic', dotClass: 'bg-academic' },
  personal: { label: 'Personal', colorClass: 'bg-personal', dotClass: 'bg-personal' },
};
