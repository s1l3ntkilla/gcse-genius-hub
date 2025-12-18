-- Fix infinite recursion in profiles RLS policy
-- The "Teachers can view student profiles" policy causes recursion because it queries profiles within a profiles policy

-- Drop the problematic policy
DROP POLICY IF EXISTS "Teachers can view student profiles" ON public.profiles;

-- Create a security definer function to check if user is a teacher (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_teacher(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
    AND user_type = 'teacher'
  )
$$;

-- Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
    AND user_type = 'admin'
  )
$$;

-- Recreate the policy using the security definer function (no recursion)
CREATE POLICY "Teachers can view student profiles" ON public.profiles
  FOR SELECT USING (
    -- Users can always view their own profile
    auth.uid() = id
    OR
    -- Teachers and admins can view student profiles
    (
      (public.is_teacher(auth.uid()) OR public.is_admin(auth.uid()))
      AND user_type = 'student'
    )
  );

-- Also ensure the base "view own profile" policy exists
DROP POLICY IF EXISTS "Users can only view own profile" ON public.profiles;
-- Note: We don't recreate it separately since the new policy above handles "auth.uid() = id"

