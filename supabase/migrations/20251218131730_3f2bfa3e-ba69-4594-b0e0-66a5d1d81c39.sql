-- Create a view for public profile data (excludes email and sensitive timestamps)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  full_name,
  user_type,
  subjects,
  profile_picture_url
FROM public.profiles;

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO authenticated;

-- Update the profiles RLS policy to only allow viewing own full profile
-- Group members should use the public_profiles view instead
DROP POLICY IF EXISTS "Users can view own profile or group members" ON public.profiles;

CREATE POLICY "Users can only view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);