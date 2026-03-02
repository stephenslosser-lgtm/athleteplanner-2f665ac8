import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface FamilyGroup {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
}

export interface FamilyMember {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
}

export function useFamilySharing() {
  const [groups, setGroups] = useState<FamilyGroup[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchGroups = useCallback(async () => {
    if (!user) return;
    const { data } = await (supabase.from('family_groups' as any) as any).select('*');
    if (data) setGroups(data);
  }, [user]);

  const fetchMembers = useCallback(async () => {
    if (!user) return;
    const { data } = await (supabase.from('family_members' as any) as any).select('*');
    if (data) setMembers(data);
  }, [user]);

  useEffect(() => {
    fetchGroups();
    fetchMembers();
  }, [fetchGroups, fetchMembers]);

  const createGroup = useCallback(async (name: string) => {
    if (!user) return null;
    setLoading(true);
    const { data, error } = await (supabase.from('family_groups' as any) as any)
      .insert({ name, created_by: user.id })
      .select()
      .single();

    if (!error && data) {
      // Auto-join the creator
      await (supabase.from('family_members' as any) as any)
        .insert({ group_id: data.id, user_id: user.id });
      await fetchGroups();
      await fetchMembers();
      setLoading(false);
      return data as FamilyGroup;
    }
    setLoading(false);
    return null;
  }, [user, fetchGroups, fetchMembers]);

  const joinGroup = useCallback(async (inviteCode: string) => {
    if (!user) return { success: false, error: 'Not logged in' };
    setLoading(true);

    // Find the group by invite code - use RPC or a workaround
    // Since we can't SELECT groups we're not in, we need an edge function or security definer function
    // Let's use a security definer function
    const { data: groupData, error: groupError } = await supabase.rpc('join_family_by_code' as any, {
      _invite_code: inviteCode,
    });

    if (groupError) {
      setLoading(false);
      return { success: false, error: groupError.message };
    }

    await fetchGroups();
    await fetchMembers();
    setLoading(false);
    return { success: true, error: null };
  }, [user, fetchGroups, fetchMembers]);

  const leaveGroup = useCallback(async (groupId: string) => {
    if (!user) return;
    await (supabase.from('family_members' as any) as any)
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.id);
    await fetchGroups();
    await fetchMembers();
  }, [user, fetchGroups, fetchMembers]);

  return { groups, members, loading, createGroup, joinGroup, leaveGroup };
}
