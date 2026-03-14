
-- Add group_id to tasks so tasks can belong to a group calendar
ALTER TABLE public.tasks ADD COLUMN group_id uuid REFERENCES public.family_groups(id) ON DELETE SET NULL;

-- Update SELECT policy to also allow viewing group tasks
DROP POLICY "Users can view own and family tasks" ON public.tasks;
CREATE POLICY "Users can view own and group tasks"
  ON public.tasks FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR user_id IN (SELECT get_family_user_ids(auth.uid()))
    OR group_id IN (SELECT get_user_group_ids(auth.uid()))
  );

-- Update INSERT policy to allow inserting group tasks
DROP POLICY "Users can insert own and family tasks" ON public.tasks;
CREATE POLICY "Users can insert own and group tasks"
  ON public.tasks FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    OR user_id IN (SELECT get_family_user_ids(auth.uid()))
    OR group_id IN (SELECT get_user_group_ids(auth.uid()))
  );

-- Update UPDATE policy
DROP POLICY "Users can update own and family tasks" ON public.tasks;
CREATE POLICY "Users can update own and group tasks"
  ON public.tasks FOR UPDATE TO authenticated
  USING (
    user_id = auth.uid()
    OR user_id IN (SELECT get_family_user_ids(auth.uid()))
    OR group_id IN (SELECT get_user_group_ids(auth.uid()))
  );

-- Update DELETE policy to allow deleting own tasks or group tasks you created
DROP POLICY "Users can delete own tasks" ON public.tasks;
CREATE POLICY "Users can delete own tasks"
  ON public.tasks FOR DELETE TO authenticated
  USING (user_id = auth.uid());
