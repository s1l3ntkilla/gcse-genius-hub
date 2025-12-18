-- Allow students to join classrooms themselves (for join with code feature)
CREATE POLICY "Students can join classrooms"
ON public.classroom_members
FOR INSERT
WITH CHECK (
  auth.uid() = student_id
  AND EXISTS (
    SELECT 1 FROM public.classrooms 
    WHERE id = classroom_id 
    AND class_code IS NOT NULL
  )
);