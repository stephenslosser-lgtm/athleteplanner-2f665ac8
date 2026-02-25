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
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) { setGoals([]); return; }

    const fetch = async () => {
      const { data, error } = await supabase
        .from('goals' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setGoals((data as any[]).map(g => ({
          id: g.id,
          title: g.title,
          type: g.type as GoalType,
          completed: g.completed,
          created_at: g.created_at,
        })));
      }
    };
    fetch();
  }, [user]);

  const addGoal = useCallback(async (title: string, type: GoalType) => {
    if (!user) return;
    const { data, error } = await (supabase.from('goals' as any) as any)
      .insert({ title, type, user_id: user.id })
      .select()
      .single();

    if (!error && data) {
      setGoals(prev => [{ id: data.id, title: data.title, type: data.type as GoalType, completed: data.completed, created_at: data.created_at }, ...prev]);
    }
  }, [user]);

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

  return { goals, addGoal, toggleGoal, deleteGoal };
}
