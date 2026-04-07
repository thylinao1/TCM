-- ==========================================
-- TCM BLUE MORNING: SUPABASE SCHEMA SCRIPT
-- ==========================================
-- Paste this entire script into your Supabase SQL Editor and hit "RUN"

-- 1. Create the 'sessions' table
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_name TEXT NOT NULL,
    trainer_name TEXT NOT NULL,
    date DATE NOT NULL,
    company_taught TEXT NOT NULL,
    trainer_notes TEXT,
    
    -- We use JSONB to store the nested survey completion states and templates
    -- shape: { "pre": boolean, "end": boolean, "refresher": boolean }
    surveys_completed JSONB DEFAULT '{"pre": false, "end": false, "refresher": false}'::jsonb,
    
    -- shape: { "pre": { title, questions }, "end": { title, questions }, "refresher": { title, questions } }
    surveys JSONB NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the 'responses' table
CREATE TABLE IF NOT EXISTS public.responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    stage TEXT NOT NULL CHECK (stage IN ('pre', 'end', 'refresher')),
    participant_name TEXT,
    participant_email TEXT,
    
    -- shape: { "question_id": "answer string or array" }
    answers JSONB NOT NULL,
    
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Set up Row Level Security (RLS) - Basic Setup
-- For now, we allow reading and writing for authenticated/anon users so your MVP works instantly.
-- Later, when Trainer Auth is active, we will restrict this.
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- Allow anon & authenticated users to SELECT/INSERT/UPDATE sessions
CREATE POLICY "Enable all for sessions" ON public.sessions FOR ALL USING (true) WITH CHECK (true);

-- Allow public to INSERT responses (so participants can fill surveys)
CREATE POLICY "Enable insert for responses" ON public.responses FOR INSERT WITH CHECK (true);

-- Allow viewing responses
CREATE POLICY "Enable select for responses" ON public.responses FOR SELECT USING (true);
