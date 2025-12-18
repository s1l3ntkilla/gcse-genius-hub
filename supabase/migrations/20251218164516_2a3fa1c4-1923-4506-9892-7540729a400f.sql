-- Create classroom_questions table for Q&A feature
CREATE TABLE public.classroom_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  question TEXT NOT NULL,
  topic TEXT,
  category TEXT,
  anonymous BOOLEAN DEFAULT true,
  answered BOOLEAN DEFAULT false,
  answer TEXT,
  answered_by UUID,
  answered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.classroom_questions ENABLE ROW LEVEL SECURITY;

-- Students can submit questions to classrooms they're members of
CREATE POLICY "Students can submit questions to their classrooms"
ON public.classroom_questions
FOR INSERT
WITH CHECK (
  auth.uid() = student_id 
  AND is_classroom_member(auth.uid(), classroom_id)
);

-- Students can view questions in their classrooms (for seeing answers)
CREATE POLICY "Members can view questions in their classrooms"
ON public.classroom_questions
FOR SELECT
USING (
  is_classroom_member(auth.uid(), classroom_id) 
  OR is_classroom_teacher(auth.uid(), classroom_id)
);

-- Teachers can update questions (to answer them)
CREATE POLICY "Teachers can answer questions"
ON public.classroom_questions
FOR UPDATE
USING (is_classroom_teacher(auth.uid(), classroom_id));

-- Teachers can delete questions
CREATE POLICY "Teachers can delete questions"
ON public.classroom_questions
FOR DELETE
USING (is_classroom_teacher(auth.uid(), classroom_id));

-- Create index for performance
CREATE INDEX idx_classroom_questions_classroom ON public.classroom_questions(classroom_id);
CREATE INDEX idx_classroom_questions_answered ON public.classroom_questions(answered);