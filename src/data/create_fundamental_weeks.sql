-- Create the fundamental_weeks table
CREATE TABLE IF NOT EXISTS public.fundamental_weeks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  week_number integer NOT NULL UNIQUE,
  week_type text NOT NULL CHECK (week_type IN ('study', 'exam')),
  title text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.fundamental_weeks ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (similar to course_weeks)
CREATE POLICY "Enable read access for all users" ON public.fundamental_weeks
  FOR SELECT
  USING (true);
