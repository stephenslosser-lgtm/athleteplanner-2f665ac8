export type TaskCategory = 'training' | 'academic' | 'personal';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  date: string; // YYYY-MM-DD
  completed: boolean;
  time?: string;
}

export const CATEGORY_CONFIG: Record<TaskCategory, { label: string; colorClass: string; dotClass: string }> = {
  training: { label: 'Training', colorClass: 'bg-training', dotClass: 'bg-training' },
  academic: { label: 'Academic', colorClass: 'bg-academic', dotClass: 'bg-academic' },
  personal: { label: 'Personal', colorClass: 'bg-personal', dotClass: 'bg-personal' },
};
