-- Drop the view since we'll use a function instead
DROP VIEW IF EXISTS public.public_profiles;

-- Create a security definer function to get limited profile data for group members
CREATE OR REPLACE FUNCTION public.get_group_member_profiles(_group_id uuid)
RETURNS TABLE (
  id uuid,
  full_name text,
  user_type user_type,
  subjects text[],
  profile_picture_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.full_name,
    p.user_type,
    p.subjects,
    p.profile_picture_url
  FROM public.profiles p
  INNER JOIN public.group_members gm ON gm.user_id = p.id
  WHERE gm.group_id = _group_id
  AND EXISTS (
    -- Verify the calling user is also a member of this group
    SELECT 1 FROM public.group_members 
    WHERE group_id = _group_id 
    AND user_id = auth.uid()
  )
$$;