-- Create classrooms table for teachers to manage their classes
CREATE TABLE public.classrooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  class_code TEXT UNIQUE DEFAULT UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6)),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create classroom_members table
CREATE TABLE public.classroom_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  joined_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(classroom_id, student_id)
);

-- Create classroom_invitations table for tracking invites
CREATE TABLE public.classroom_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  responded_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_invitations ENABLE ROW LEVEL SECURITY;

-- Classrooms policies
CREATE POLICY "Teachers can create classrooms" ON public.classrooms
  FOR INSERT WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can view their own classrooms" ON public.classrooms
  FOR SELECT USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view classrooms they are members of" ON public.classrooms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.classroom_members 
      WHERE classroom_members.classroom_id = classrooms.id 
      AND classroom_members.student_id = auth.uid()
      AND classroom_members.status = 'accepted'
    )
  );

CREATE POLICY "Teachers can update their own classrooms" ON public.classrooms
  FOR UPDATE USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own classrooms" ON public.classrooms
  FOR DELETE USING (auth.uid() = teacher_id);

-- Classroom members policies
CREATE POLICY "Teachers can add members to their classrooms" ON public.classroom_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.classrooms 
      WHERE classrooms.id = classroom_members.classroom_id 
      AND classrooms.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Users can view members of their classrooms" ON public.classroom_members
  FOR SELECT USING (
    auth.uid() = student_id OR
    EXISTS (
      SELECT 1 FROM public.classrooms 
      WHERE classrooms.id = classroom_members.classroom_id 
      AND classrooms.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can update their own membership status" ON public.classroom_members
  FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Teachers can remove members from their classrooms" ON public.classroom_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.classrooms 
      WHERE classrooms.id = classroom_members.classroom_id 
      AND classrooms.teacher_id = auth.uid()
    )
  );

-- Classroom invitations policies
CREATE POLICY "Teachers can create invitations" ON public.classroom_invitations
  FOR INSERT WITH CHECK (auth.uid() = invited_by);

CREATE POLICY "Users can view their own invitations" ON public.classroom_invitations
  FOR SELECT USING (
    auth.uid() = student_id OR auth.uid() = invited_by
  );

CREATE POLICY "Students can update invitation status" ON public.classroom_invitations
  FOR UPDATE USING (auth.uid() = student_id);