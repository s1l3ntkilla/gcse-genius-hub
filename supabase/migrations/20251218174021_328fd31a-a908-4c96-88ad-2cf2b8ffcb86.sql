-- Create table for WebRTC signaling
CREATE TABLE public.webrtc_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.live_lessons(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL,
  to_user_id UUID NOT NULL,
  signal_type TEXT NOT NULL CHECK (signal_type IN ('offer', 'answer', 'ice-candidate')),
  signal_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.webrtc_signals ENABLE ROW LEVEL SECURITY;

-- Policies for signaling
CREATE POLICY "Participants can send signals"
ON public.webrtc_signals FOR INSERT
WITH CHECK (
  auth.uid() = from_user_id AND
  EXISTS (
    SELECT 1 FROM public.live_lesson_participants
    WHERE lesson_id = webrtc_signals.lesson_id
    AND user_id = auth.uid()
    AND left_at IS NULL
  )
);

CREATE POLICY "Participants can read their signals"
ON public.webrtc_signals FOR SELECT
USING (
  auth.uid() = to_user_id AND
  EXISTS (
    SELECT 1 FROM public.live_lesson_participants
    WHERE lesson_id = webrtc_signals.lesson_id
    AND user_id = auth.uid()
    AND left_at IS NULL
  )
);

CREATE POLICY "Users can delete their own signals"
ON public.webrtc_signals FOR DELETE
USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Enable realtime for signaling
ALTER PUBLICATION supabase_realtime ADD TABLE public.webrtc_signals;

-- Create index for faster queries
CREATE INDEX idx_webrtc_signals_to_user ON public.webrtc_signals(to_user_id, lesson_id);
CREATE INDEX idx_webrtc_signals_lesson ON public.webrtc_signals(lesson_id);