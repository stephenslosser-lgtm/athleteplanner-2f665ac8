
-- Allow family members to insert tasks for each other
DROP POLICY "Users can insert own tasks" ON public.tasks;
CREATE POLICY "Users can insert own and family tasks"
  ON public.tasks FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid() OR
    user_id IN (SELECT get_family_user_ids(auth.uid()))
  );

-- Allow family members to insert goals for each other
DROP POLICY "Users can insert own goals" ON public.goals;
CREATE POLICY "Users can insert own and family goals"
  ON public.goals FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid() OR
    user_id IN (SELECT get_family_user_ids(auth.uid()))
  );
