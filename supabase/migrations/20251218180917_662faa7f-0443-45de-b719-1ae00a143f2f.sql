-- Create exam_specifications table to store specification data
CREATE TABLE public.exam_specifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_board TEXT NOT NULL,
  subject TEXT NOT NULL,
  qualification TEXT NOT NULL DEFAULT 'GCSE',
  topic_id TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  subtopic_id TEXT NOT NULL,
  subtopic_name TEXT NOT NULL,
  key_terms TEXT[] DEFAULT '{}',
  tier TEXT DEFAULT 'both',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(exam_board, subject, topic_id, subtopic_id)
);

-- Enable RLS
ALTER TABLE public.exam_specifications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read specifications (they're public exam board content)
CREATE POLICY "Anyone can view specifications" 
ON public.exam_specifications 
FOR SELECT 
USING (true);

-- Only admins can modify specifications
CREATE POLICY "Admins can manage specifications" 
ON public.exam_specifications 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create index for faster lookups
CREATE INDEX idx_exam_specs_board_subject ON public.exam_specifications(exam_board, subject);

-- Add trigger for updated_at
CREATE TRIGGER update_exam_specifications_updated_at
BEFORE UPDATE ON public.exam_specifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();