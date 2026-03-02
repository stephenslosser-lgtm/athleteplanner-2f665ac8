
CREATE OR REPLACE FUNCTION public.join_family_by_code(_invite_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _group_id uuid;
BEGIN
  SELECT id INTO _group_id FROM public.family_groups WHERE invite_code = _invite_code;
  IF _group_id IS NULL THEN
    RAISE EXCEPTION 'Invalid invite code';
  END IF;
  INSERT INTO public.family_members (group_id, user_id) VALUES (_group_id, auth.uid())
    ON CONFLICT (group_id, user_id) DO NOTHING;
  RETURN true;
END;
$$;
