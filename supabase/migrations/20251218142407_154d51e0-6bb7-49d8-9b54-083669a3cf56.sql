-- Fix: Remove overly permissive "Users can add members" policy
-- This policy has WITH CHECK (true) allowing anyone to add anyone to any group
-- The proper "Group admins can add members" policy already exists and should be kept

DROP POLICY IF EXISTS "Users can add members" ON public.group_members;