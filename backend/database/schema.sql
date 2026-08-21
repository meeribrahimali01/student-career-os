-- ============================================================================
-- CareerOS Database Schema
-- Compatible with PostgreSQL / Supabase
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. Extensions & Helper Functions
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 1. Profiles Table (Linked to Supabase auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin', 'faculty', 'recruiter')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 2. Students Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    college TEXT,
    course TEXT,
    branch TEXT,
    graduation_year INTEGER CHECK (graduation_year >= 2000 AND graduation_year <= 2100),
    semester INTEGER CHECK (semester >= 1 AND semester <= 12),
    current_cgpa NUMERIC(4, 2) CHECK (current_cgpa >= 0.00 AND current_cgpa <= 10.00),
    career_preferences JSONB DEFAULT '{}'::jsonb,
    placement_status TEXT NOT NULL DEFAULT 'seeking' CHECK (placement_status IN ('unplaced', 'seeking', 'placed', 'opted_out')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 3. Academic Records Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.academic_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 12),
    academic_year TEXT NOT NULL,
    sgpa NUMERIC(4, 2) CHECK (sgpa >= 0.00 AND sgpa <= 10.00),
    cgpa_at_time NUMERIC(4, 2) CHECK (cgpa_at_time >= 0.00 AND cgpa_at_time <= 10.00),
    percentage NUMERIC(5, 2) CHECK (percentage >= 0.00 AND percentage <= 100.00),
    credits_earned NUMERIC(5, 2) DEFAULT 0 CHECK (credits_earned >= 0),
    backlogs_count INTEGER DEFAULT 0 CHECK (backlogs_count >= 0),
    grade_sheet_url TEXT,
    subject_records JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_student_semester UNIQUE (student_id, semester)
);

-- ----------------------------------------------------------------------------
-- 4. Skills Catalog Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('programming', 'technical', 'communication', 'aptitude', 'soft_skills', 'domain')),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 5. Student Skills Junction Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    proficiency_level TEXT NOT NULL DEFAULT 'beginner' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    source TEXT NOT NULL DEFAULT 'self_reported' CHECK (source IN ('self_reported', 'assessment', 'resume_parser', 'course_completion')),
    verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_student_skill UNIQUE (student_id, skill_id)
);

-- ----------------------------------------------------------------------------
-- 6. Roadmaps Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    career_goal TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused', 'archived')),
    start_date DATE,
    target_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 7. Roadmap Items Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.roadmap_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    sequence_order INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    due_date DATE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 8. Study Resources Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('article', 'video', 'course', 'documentation', 'practice_material', 'interview_prep', 'aptitude', 'book')),
    url TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('programming', 'technical', 'aptitude', 'communication', 'interview_prep', 'general')),
    difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'all_levels')),
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 9. Events Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL CHECK (event_type IN ('hackathon', 'workshop', 'seminar', 'placement_drive', 'coding_contest', 'career_fair', 'webinar')),
    organizer TEXT NOT NULL,
    venue_type TEXT NOT NULL DEFAULT 'online' CHECK (venue_type IN ('online', 'offline', 'hybrid')),
    venue_details TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    registration_deadline TIMESTAMPTZ,
    registration_url TEXT,
    max_participants INTEGER CHECK (max_participants > 0),
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 10. Event Registrations Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    registration_status TEXT NOT NULL DEFAULT 'registered' CHECK (registration_status IN ('registered', 'confirmed', 'waitlisted', 'cancelled')),
    registered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    attendance_status TEXT NOT NULL DEFAULT 'unmarked' CHECK (attendance_status IN ('unmarked', 'attended', 'absent', 'excused')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_student_event UNIQUE (student_id, event_id)
);

-- ----------------------------------------------------------------------------
-- 11. Placement Opportunities Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    job_description TEXT,
    eligibility_criteria JSONB DEFAULT '{}'::jsonb,
    location TEXT,
    employment_type TEXT NOT NULL DEFAULT 'full_time' CHECK (employment_type IN ('full_time', 'internship', 'internship_to_full_time', 'contract')),
    salary_package TEXT,
    application_deadline TIMESTAMPTZ,
    apply_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'closed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 12. Placement Applications Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.placement_opportunities(id) ON DELETE CASCADE,
    application_status TEXT NOT NULL DEFAULT 'applied' CHECK (application_status IN ('applied', 'screening', 'shortlisted', 'interviewing', 'offered', 'rejected', 'withdrawn')),
    current_stage TEXT DEFAULT 'Applied',
    applied_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    interview_date TIMESTAMPTZ,
    notes TEXT,
    result TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_student_placement UNIQUE (student_id, opportunity_id)
);

-- ----------------------------------------------------------------------------
-- 13. Resumes Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    resume_title TEXT NOT NULL DEFAULT 'My Resume',
    file_path TEXT NOT NULL,
    file_url TEXT,
    version INTEGER NOT NULL DEFAULT 1 CHECK (version >= 1),
    is_primary BOOLEAN NOT NULL DEFAULT false,
    parsing_status TEXT NOT NULL DEFAULT 'pending' CHECK (parsing_status IN ('pending', 'processing', 'completed', 'failed')),
    parsed_data JSONB DEFAULT '{}'::jsonb,
    analysis_status TEXT NOT NULL DEFAULT 'unprocessed' CHECK (analysis_status IN ('unprocessed', 'analyzed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 14. Skill Gap Analysis Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skill_gap_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
    target_role TEXT NOT NULL,
    identified_skills JSONB DEFAULT '[]'::jsonb,
    missing_skills JSONB DEFAULT '[]'::jsonb,
    recommended_skills JSONB DEFAULT '[]'::jsonb,
    match_score NUMERIC(5, 2) CHECK (match_score >= 0.00 AND match_score <= 100.00),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    recommendations TEXT,
    analysis_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 15. Communication Sessions Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.communication_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    session_type TEXT NOT NULL CHECK (session_type IN ('hr_interview', 'technical_interview', 'speaking_practice', 'communication_exercise', 'aptitude_discussion')),
    topic TEXT NOT NULL,
    score NUMERIC(5, 2) CHECK (score >= 0.00 AND score <= 100.00),
    duration_seconds INTEGER DEFAULT 0 CHECK (duration_seconds >= 0),
    feedback JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Profiles & Students
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_students_profile_id ON public.students(profile_id);
CREATE INDEX IF NOT EXISTS idx_students_placement_status ON public.students(placement_status);
CREATE INDEX IF NOT EXISTS idx_students_college_branch ON public.students(college, branch);

-- Academic Records
CREATE INDEX IF NOT EXISTS idx_academic_records_student ON public.academic_records(student_id);
CREATE INDEX IF NOT EXISTS idx_academic_records_semester ON public.academic_records(student_id, semester);

-- Skills & Student Skills
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);
CREATE INDEX IF NOT EXISTS idx_student_skills_student ON public.student_skills(student_id);
CREATE INDEX IF NOT EXISTS idx_student_skills_skill ON public.student_skills(skill_id);

-- Roadmaps & Items
CREATE INDEX IF NOT EXISTS idx_roadmaps_student ON public.roadmaps(student_id);
CREATE INDEX IF NOT EXISTS idx_roadmaps_status ON public.roadmaps(status);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_roadmap ON public.roadmap_items(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_order ON public.roadmap_items(roadmap_id, sequence_order);

-- Study Resources
CREATE INDEX IF NOT EXISTS idx_study_resources_category ON public.study_resources(category);
CREATE INDEX IF NOT EXISTS idx_study_resources_type ON public.study_resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_study_resources_published ON public.study_resources(is_published);

-- Events & Registrations
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_published ON public.events(is_published);
CREATE INDEX IF NOT EXISTS idx_event_registrations_student ON public.event_registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON public.event_registrations(event_id);

-- Placement Opportunities & Applications
CREATE INDEX IF NOT EXISTS idx_placement_opps_status ON public.placement_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_placement_opps_deadline ON public.placement_opportunities(application_deadline);
CREATE INDEX IF NOT EXISTS idx_placement_apps_student ON public.placement_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_placement_apps_opportunity ON public.placement_applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_placement_apps_status ON public.placement_applications(application_status);

-- Resumes & AI Analysis
CREATE INDEX IF NOT EXISTS idx_resumes_student ON public.resumes(student_id);
CREATE INDEX IF NOT EXISTS idx_skill_gap_student ON public.skill_gap_analysis(student_id);
CREATE INDEX IF NOT EXISTS idx_skill_gap_resume ON public.skill_gap_analysis(resume_id);

-- Communication Sessions
CREATE INDEX IF NOT EXISTS idx_comm_sessions_student ON public.communication_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_comm_sessions_type ON public.communication_sessions(session_type);

-- ============================================================================
-- TRIGGERS FOR AUTO-UPDATING updated_at
-- ============================================================================

DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_name IN (
              'profiles', 'students', 'academic_records', 'skills', 'student_skills',
              'roadmaps', 'roadmap_items', 'study_resources', 'events', 'event_registrations',
              'placement_opportunities', 'placement_applications', 'resumes',
              'skill_gap_analysis', 'communication_sessions'
          )
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS tr_%I_updated_at ON public.%I;', t, t);
        EXECUTE format('CREATE TRIGGER tr_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();', t, t);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically create a profile when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'CareerOS User'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all 15 tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_gap_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_sessions ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- 2. Students Policies
DROP POLICY IF EXISTS "Students can view own details" ON public.students;
CREATE POLICY "Students can view own details"
    ON public.students FOR SELECT
    TO authenticated
    USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Students can insert own details" ON public.students;
CREATE POLICY "Students can insert own details"
    ON public.students FOR INSERT
    TO authenticated
    WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "Students can update own details" ON public.students;
CREATE POLICY "Students can update own details"
    ON public.students FOR UPDATE
    TO authenticated
    USING (profile_id = auth.uid());

-- 3. Academic Records Policies
DROP POLICY IF EXISTS "Students can manage own academic records" ON public.academic_records;
CREATE POLICY "Students can manage own academic records"
    ON public.academic_records FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = academic_records.student_id AND s.profile_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.students s WHERE s.id = academic_records.student_id AND s.profile_id = auth.uid()));

-- 4. Skills Catalog Policies (Readable by all authenticated users)
DROP POLICY IF EXISTS "Authenticated users can view skills" ON public.skills;
CREATE POLICY "Authenticated users can view skills"
    ON public.skills FOR SELECT
    TO authenticated
    USING (true);

-- 5. Student Skills Policies
DROP POLICY IF EXISTS "Students can manage own skills" ON public.student_skills;
CREATE POLICY "Students can manage own skills"
    ON public.student_skills FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_skills.student_id AND s.profile_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_skills.student_id AND s.profile_id = auth.uid()));

-- 6. Roadmaps Policies
DROP POLICY IF EXISTS "Students can manage own roadmaps" ON public.roadmaps;
CREATE POLICY "Students can manage own roadmaps"
    ON public.roadmaps FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = roadmaps.student_id AND s.profile_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.students s WHERE s.id = roadmaps.student_id AND s.profile_id = auth.uid()));

-- 7. Roadmap Items Policies
DROP POLICY IF EXISTS "Students can manage own roadmap items" ON public.roadmap_items;
CREATE POLICY "Students can manage own roadmap items"
    ON public.roadmap_items FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.roadmap_items ri
        JOIN public.roadmaps r ON r.id = roadmap_items.roadmap_id
        JOIN public.students s ON s.id = r.student_id
        WHERE s.profile_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.roadmaps r
        JOIN public.students s ON s.id = r.student_id
        WHERE r.id = roadmap_items.roadmap_id AND s.profile_id = auth.uid()
    ));

-- 8. Study Resources Policies (Public reading for published items)
DROP POLICY IF EXISTS "Authenticated users can view published study resources" ON public.study_resources;
CREATE POLICY "Authenticated users can view published study resources"
    ON public.study_resources FOR SELECT
    TO authenticated
    USING (is_published = true);

-- 9. Events Policies (Public reading for published events)
DROP POLICY IF EXISTS "Authenticated users can view published events" ON public.events;
CREATE POLICY "Authenticated users can view published events"
    ON public.events FOR SELECT
    TO authenticated
    USING (is_published = true);

-- 10. Event Registrations Policies
DROP POLICY IF EXISTS "Students can manage own event registrations" ON public.event_registrations;
CREATE POLICY "Students can manage own event registrations"
    ON public.event_registrations FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = event_registrations.student_id AND s.profile_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.students s WHERE s.id = event_registrations.student_id AND s.profile_id = auth.uid()));

-- 11. Placement Opportunities Policies (Public reading for active opportunities)
DROP POLICY IF EXISTS "Authenticated users can view active opportunities" ON public.placement_opportunities;
CREATE POLICY "Authenticated users can view active opportunities"
    ON public.placement_opportunities FOR SELECT
    TO authenticated
    USING (status = 'active');

-- 12. Placement Applications Policies
DROP POLICY IF EXISTS "Students can manage own placement applications" ON public.placement_applications;
CREATE POLICY "Students can manage own placement applications"
    ON public.placement_applications FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = placement_applications.student_id AND s.profile_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.students s WHERE s.id = placement_applications.student_id AND s.profile_id = auth.uid()));

-- 13. Resumes Policies
DROP POLICY IF EXISTS "Students can manage own resumes" ON public.resumes;
CREATE POLICY "Students can manage own resumes"
    ON public.resumes FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = resumes.student_id AND s.profile_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.students s WHERE s.id = resumes.student_id AND s.profile_id = auth.uid()));

-- 14. Skill Gap Analysis Policies
DROP POLICY IF EXISTS "Students can manage own skill gap analysis" ON public.skill_gap_analysis;
CREATE POLICY "Students can manage own skill gap analysis"
    ON public.skill_gap_analysis FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = skill_gap_analysis.student_id AND s.profile_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.students s WHERE s.id = skill_gap_analysis.student_id AND s.profile_id = auth.uid()));

-- 15. Communication Sessions Policies
DROP POLICY IF EXISTS "Students can manage own communication sessions" ON public.communication_sessions;
CREATE POLICY "Students can manage own communication sessions"
    ON public.communication_sessions FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = communication_sessions.student_id AND s.profile_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.students s WHERE s.id = communication_sessions.student_id AND s.profile_id = auth.uid()));
