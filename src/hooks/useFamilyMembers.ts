import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface FamilyMemberProfile {
  user_id: string;
  display_name: string;
  email: string | null;
}

export function useFamilyMembers() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberProfile[]>([]);
  const { user } = useAuth();

  const fetchFamilyMembers = useCallback(async () => {
    if (!user) {
      setFamilyMembers([]);
      return;
    }

    // Get all family user IDs
    const { data: userIds, error: idsError } = await supabase.rpc('get_family_user_ids', {
      _user_id: user.id,
    });

    if (idsError || !userIds || userIds.length === 0) {
      setFamilyMembers([]);
      return;
    }

    // Filter out current user and fetch profiles
    const otherIds = (userIds as string[]).filter((id: string) => id !== user.id);
    if (otherIds.length === 0) {
      setFamilyMembers([]);
      return;
    }

    const { data: profiles } = await (supabase.from('profiles' as any) as any)
      .select('id, display_name, email')
      .in('id', otherIds);

    if (profiles) {
      setFamilyMembers(
        (profiles as any[]).map((p: any) => ({
          user_id: p.id,
          display_name: p.display_name || p.email || 'Unknown',
          email: p.email,
        }))
      );
    }
  }, [user]);

  useEffect(() => {
    fetchFamilyMembers();
  }, [fetchFamilyMembers]);

  return { familyMembers, refetch: fetchFamilyMembers };
}
