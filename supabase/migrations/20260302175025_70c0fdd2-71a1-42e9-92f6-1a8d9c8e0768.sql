
-- Family groups table
CREATE TABLE public.family_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'My Family',
  invite_code text NOT NULL DEFAULT substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(invite_code)
);

ALTER TABLE public.family_groups ENABLE ROW LEVEL SECURITY;

-- Family members table
CREATE TABLE public.family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.family_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Helper function: get all group IDs a user belongs to
CREATE OR REPLACE FUNCTION public.get_user_group_ids(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT group_id FROM public.family_members WHERE user_id = _user_id;
$$;

-- Helper function: get all user IDs in the same groups as a user
CREATE OR REPLACE FUNCTION public.get_family_user_ids(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT fm.user_id
  FROM public.family_members fm
  WHERE fm.group_id IN (SELECT group_id FROM public.family_members WHERE user_id = _user_id);
$$;

-- RLS for family_groups: members can view their groups
CREATE POLICY "Members can view their groups"
ON public.family_groups FOR SELECT
TO authenticated
USING (id IN (SELECT public.get_user_group_ids(auth.uid())));

-- Anyone authenticated can create a group
CREATE POLICY "Users can create groups"
ON public.family_groups FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- Only creator can delete
CREATE POLICY "Creator can delete group"
ON public.family_groups FOR DELETE
TO authenticated
USING (created_by = auth.uid());

-- RLS for family_members
CREATE POLICY "Members can view group members"
ON public.family_members FOR SELECT
TO authenticated
USING (group_id IN (SELECT public.get_user_group_ids(auth.uid())));

-- Users can join (insert themselves)
CREATE POLICY "Users can join groups"
ON public.family_members FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can leave (delete themselves)
CREATE POLICY "Users can leave groups"
ON public.family_members FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Update tasks RLS: family members can view each other's tasks
DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
CREATE POLICY "Users can view own and family tasks"
ON public.tasks FOR SELECT
TO authenticated
USING (user_id IN (SELECT public.get_family_user_ids(auth.uid())) OR user_id = auth.uid());

-- Family members can update each other's tasks
DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
CREATE POLICY "Users can update own and family tasks"
ON public.tasks FOR UPDATE
TO authenticated
USING (user_id IN (SELECT public.get_family_user_ids(auth.uid())) OR user_id = auth.uid());

-- Update goals RLS: family members can view each other's goals
DROP POLICY IF EXISTS "Users can view own goals" ON public.goals;
CREATE POLICY "Users can view own and family goals"
ON public.goals FOR SELECT
TO authenticated
USING (user_id IN (SELECT public.get_family_user_ids(auth.uid())) OR user_id = auth.uid());

-- Family members can update each other's goals
DROP POLICY IF EXISTS "Users can update own goals" ON public.goals;
CREATE POLICY "Users can update own and family goals"
ON public.goals FOR UPDATE
TO authenticated
USING (user_id IN (SELECT public.get_family_user_ids(auth.uid())) OR user_id = auth.uid());
