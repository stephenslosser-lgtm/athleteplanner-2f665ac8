import { useState, useEffect, useCallback } from 'react';
import { Task, TaskCategory } from '@/types/task';

const generateId = () => Math.random().toString(36).substr(2, 9);
const STORAGE_KEY = 'athlete-planner-tasks';

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const dayAfter = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];

const INITIAL_TASKS: Task[] = [
  { id: generateId(), title: 'Morning weight training', category: 'training', date: today, completed: false, time: '6:00 AM' },
  { id: generateId(), title: 'Review game film', category: 'training', date: today, completed: false, time: '3:00 PM' },
  { id: generateId(), title: 'Chemistry midterm prep', category: 'academic', date: today, completed: false, time: '7:00 PM' },
  { id: generateId(), title: 'Sprint drills', category: 'training', date: tomorrow, completed: false, time: '6:30 AM' },
  { id: generateId(), title: 'English essay due', category: 'academic', date: tomorrow, completed: false, time: '11:59 PM' },
  { id: generateId(), title: 'Team dinner', category: 'personal', date: dayAfter, completed: false, time: '6:00 PM' },
];

function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return INITIAL_TASKS;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((title: string, category: TaskCategory, date: string, time?: string) => {
    setTasks(prev => [...prev, { id: generateId(), title, category, date, completed: false, time }]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const getTasksForDate = useCallback((date: string) => {
    return tasks.filter(t => t.date === date);
  }, [tasks]);

  const getDatesWithTasks = useCallback(() => {
    const dates = new Map<string, Set<TaskCategory>>();
    tasks.forEach(t => {
      if (!dates.has(t.date)) dates.set(t.date, new Set());
      dates.get(t.date)!.add(t.category);
    });
    return dates;
  }, [tasks]);

  return { tasks, addTask, toggleTask, deleteTask, getTasksForDate, getDatesWithTasks };
}
