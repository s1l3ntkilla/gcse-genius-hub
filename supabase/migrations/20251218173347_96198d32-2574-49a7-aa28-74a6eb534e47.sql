-- Create live_lessons table
CREATE TABLE public.live_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create live_lesson_participants table
CREATE TABLE public.live_lesson_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.live_lessons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
  hand_raised BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  left_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(lesson_id, user_id)
);

-- Create live_lesson_messages table
CREATE TABLE public.live_lesson_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.live_lessons(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.live_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_lesson_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_lesson_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for live_lessons
CREATE POLICY "Teachers can create lessons for their classrooms"
ON public.live_lessons FOR INSERT
WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own lessons"
ON public.live_lessons FOR UPDATE
USING (auth.uid() = teacher_id);

CREATE POLICY "Classroom members can view active lessons"
ON public.live_lessons FOR SELECT
USING (
  status = 'active' AND (
    auth.uid() = teacher_id OR
    EXISTS (
      SELECT 1 FROM public.classroom_members
      WHERE classroom_id = live_lessons.classroom_id
      AND student_id = auth.uid()
      AND status = 'accepted'
    )
  )
);

-- RLS Policies for live_lesson_participants
CREATE POLICY "Users can join lessons they have access to"
ON public.live_lesson_participants FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.live_lessons l
    WHERE l.id = lesson_id AND l.status = 'active'
    AND (
      l.teacher_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.classroom_members
        WHERE classroom_id = l.classroom_id
        AND student_id = auth.uid()
        AND status = 'accepted'
      )
    )
  )
);

CREATE POLICY "Users can update their own participation"
ON public.live_lesson_participants FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Participants can view other participants"
ON public.live_lesson_participants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.live_lesson_participants p2
    WHERE p2.lesson_id = live_lesson_participants.lesson_id
    AND p2.user_id = auth.uid()
  )
);

CREATE POLICY "Users can remove themselves from lessons"
ON public.live_lesson_participants FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for live_lesson_messages
CREATE POLICY "Participants can send messages"
ON public.live_lesson_messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.live_lesson_participants
    WHERE lesson_id = live_lesson_messages.lesson_id
    AND user_id = auth.uid()
    AND left_at IS NULL
  )
);

CREATE POLICY "Participants can view messages"
ON public.live_lesson_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.live_lesson_participants
    WHERE lesson_id = live_lesson_messages.lesson_id
    AND user_id = auth.uid()
  )
);

-- Enable realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_lessons;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_lesson_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_lesson_messages;