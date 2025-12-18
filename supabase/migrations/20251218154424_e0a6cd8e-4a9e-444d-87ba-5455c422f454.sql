-- Allow teachers to view student profiles for invitations
CREATE POLICY "Teachers can view student profiles" ON public.profiles
  FOR SELECT USING (
    -- Allow if the current user is a teacher viewing a student
    EXISTS (
      SELECT 1 FROM public.profiles AS viewer 
      WHERE viewer.id = auth.uid() 
      AND viewer.user_type = 'teacher'
    )
    AND user_type = 'student'
  );