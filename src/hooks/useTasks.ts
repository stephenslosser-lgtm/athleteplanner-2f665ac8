import { useState, useEffect, useCallback } from 'react';
import { Task, TaskCategory } from '@/types/task';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  // Fetch tasks from database
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('date', { ascending: true });

      if (!error && data) {
        setTasks(data.map(t => ({
          id: t.id,
          title: t.title,
          category: t.category as TaskCategory,
          date: t.date,
          completed: t.completed,
          time: t.time ?? undefined,
        })));
      }
    };

    fetchTasks();
  }, [user]);

  const addTask = useCallback(async (title: string, category: TaskCategory, date: string, time?: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({ title, category, date, user_id: user.id, time: time ?? null })
      .select()
      .single();

    if (!error && data) {
      setTasks(prev => [...prev, {
        id: data.id,
        title: data.title,
        category: data.category as TaskCategory,
        date: data.date,
        completed: data.completed,
        time: data.time ?? undefined,
      }]);
    }
  }, [user]);

  const toggleTask = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const { error } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', id);

    if (!error) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    }
  }, [tasks]);

  const deleteTask = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (!error) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
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
