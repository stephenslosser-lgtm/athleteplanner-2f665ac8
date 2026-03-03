
DROP POLICY "Members can view their groups" ON public.family_groups;

CREATE POLICY "Members can view their groups"
ON public.family_groups
FOR SELECT
TO authenticated
USING (
  (id IN (SELECT get_user_group_ids(auth.uid())))
  OR (created_by = auth.uid())
);
