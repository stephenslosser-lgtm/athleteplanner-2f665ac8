import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type GoalType = 'short_term' | 'long_term';

export interface Goal {
  id: string;
  title: string;
  type: GoalType;
  completed: boolean;
  created_at: string;
  due_date: string | null;
}

export function useGoals(viewUserId?: string | null) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const { user } = useAuth();

  const targetUserId = viewUserId ?? user?.id;

  useEffect(() => {
    if (!user || !targetUserId) { setGoals([]); return; }

    const fetch = async () => {
      const { data, error } = await supabase
        .from('goals' as any)
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setGoals((data as any[]).map(g => ({
          id: g.id,
          title: g.title,
          type: g.type as GoalType,
          completed: g.completed,
          created_at: g.created_at,
          due_date: g.due_date,
        })));
      }
    };
    fetch();
  }, [user, targetUserId]);

  const addGoal = useCallback(async (title: string, type: GoalType, dueDate?: string | null) => {
    if (!user || !targetUserId) return;
    const { data, error } = await (supabase.from('goals' as any) as any)
      .insert({ title, type, user_id: targetUserId, due_date: dueDate || null })
      .select()
      .single();

    if (!error && data) {
      setGoals(prev => [{ id: data.id, title: data.title, type: data.type as GoalType, completed: data.completed, created_at: data.created_at, due_date: data.due_date }, ...prev]);
    }
  }, [user, targetUserId]);

  const toggleGoal = useCallback(async (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    const { error } = await (supabase.from('goals' as any) as any).update({ completed: !goal.completed }).eq('id', id);
    if (!error) {
      setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
    }
  }, [goals]);

  const deleteGoal = useCallback(async (id: string) => {
    const { error } = await (supabase.from('goals' as any) as any).delete().eq('id', id);
    if (!error) {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  }, []);

  const editGoal = useCallback(async (id: string, updates: { title?: string; type?: GoalType; due_date?: string | null }) => {
    const { error } = await (supabase.from('goals' as any) as any).update(updates).eq('id', id);
    if (!error) {
      setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates, type: (updates.type ?? g.type) as GoalType } : g));
    }
  }, []);

  const getDatesWithGoals = useCallback((): Set<string> => {
    const dates = new Set<string>();
    goals.forEach(g => { if (g.due_date) dates.add(g.due_date); });
    return dates;
  }, [goals]);

  return { goals, addGoal, toggleGoal, deleteGoal, editGoal, getDatesWithGoals };
}
