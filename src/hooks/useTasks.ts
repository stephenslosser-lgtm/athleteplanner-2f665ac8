import { useState, useEffect, useCallback } from 'react';
import { Task, TaskCategory } from '@/types/task';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useTasks(viewUserId?: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  // The user whose tasks we're viewing (default: current user)
  const targetUserId = viewUserId ?? user?.id;

  useEffect(() => {
    if (!user || !targetUserId) {
      setTasks([]);
      return;
    }

    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', targetUserId)
        .order('date', { ascending: true });

      if (!error && data) {
        setTasks(data.map(t => ({
          id: t.id,
          title: t.title,
          category: t.category as TaskCategory,
          date: t.date,
          completed: t.completed,
          time: t.time ?? undefined,
          end_time: (t as any).end_time ?? undefined,
        })));
      }
    };

    fetchTasks();
  }, [user, targetUserId]);

  const addTask = useCallback(async (title: string, category: TaskCategory, date: string, time?: string, end_time?: string) => {
    if (!user || !targetUserId) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({ title, category, date, user_id: targetUserId, time: time ?? null, end_time: end_time ?? null } as any)
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
        end_time: (data as any).end_time ?? undefined,
      }]);
    }
  }, [user, targetUserId]);

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

  const editTask = useCallback(async (id: string, updates: { title: string; category: TaskCategory; date: string; time?: string; end_time?: string }) => {
    const { error } = await supabase
      .from('tasks')
      .update({ title: updates.title, category: updates.category, date: updates.date, time: updates.time ?? null, end_time: updates.end_time ?? null } as any)
      .eq('id', id);

    if (!error) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    }
  }, []);

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

  // Whether the current user can add/edit tasks for the target user
  const isOwnCalendar = !viewUserId || viewUserId === user?.id;

  return { tasks, addTask, toggleTask, editTask, deleteTask, getTasksForDate, getDatesWithTasks, isOwnCalendar };
}
