-- ============================================================================
-- Meridian Learning Orbit — Complete Normalized Schema Migration
-- Compatible with PostgreSQL & Supabase
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Academic Courses & Student Subject Grades (Normalizing Gradebook)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.academic_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    department TEXT NOT NULL DEFAULT 'CSE',
    credits NUMERIC(3, 1) NOT NULL DEFAULT 3.0,
    semester_recommended INTEGER CHECK (semester_recommended BETWEEN 1 AND 8),
    syllabus_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.student_subject_grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.academic_courses(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    internal_marks NUMERIC(5, 2) CHECK (internal_marks BETWEEN 0 AND 50),
    end_sem_marks NUMERIC(5, 2) CHECK (end_sem_marks BETWEEN 0 AND 100),
    total_score NUMERIC(5, 2) CHECK (total_score BETWEEN 0 AND 100),
    grade TEXT CHECK (grade IN ('S', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'N')),
    attendance_percentage NUMERIC(5, 2) NOT NULL CHECK (attendance_percentage BETWEEN 0 AND 100),
    status TEXT NOT NULL DEFAULT 'average' CHECK (status IN ('strong', 'average', 'needs_attention')),
    trend_delta NUMERIC(4, 1) DEFAULT 0.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_student_course_sem UNIQUE (student_id, course_id, semester)
);

-- ----------------------------------------------------------------------------
-- 2. 4-Year Curriculum Hierarchy (Years -> Topics -> Subtopics)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.roadmap_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_number INTEGER NOT NULL UNIQUE CHECK (year_number BETWEEN 1 AND 4),
    title TEXT NOT NULL,
    focus_theme TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.roadmap_curriculum_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_id UUID NOT NULL REFERENCES public.roadmap_years(id) ON DELETE CASCADE,
    topic_key TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    estimated_hours NUMERIC(5, 1) DEFAULT 20.0,
    career_relevance TEXT,
    skill_tags TEXT[] DEFAULT '{}',
    sequence_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.roadmap_subtopics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES public.roadmap_curriculum_topics(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    key_concepts TEXT[] DEFAULT '{}',
    sequence_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 3. Student Topic Mastery Telemetry
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_topic_mastery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES public.roadmap_curriculum_topics(id) ON DELETE CASCADE,
    mastery_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0 CHECK (mastery_score BETWEEN 0 AND 100),
    status TEXT NOT NULL DEFAULT 'AVERAGE' CHECK (status IN ('CRITICAL', 'WEAK', 'AVERAGE', 'IMPROVING', 'STRONG')),
    total_attempts INTEGER NOT NULL DEFAULT 0 CHECK (total_attempts >= 0),
    correct_attempts INTEGER NOT NULL DEFAULT 0 CHECK (correct_attempts >= 0),
    last_attempted_at TIMESTAMPTZ,
    last_revised_at TIMESTAMPTZ,
    priority_score NUMERIC(5, 2) NOT NULL DEFAULT 50.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_student_topic_mastery UNIQUE (student_id, topic_id)
);

-- ----------------------------------------------------------------------------
-- 4. Assessment Questions & Question Attempts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assessment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES public.roadmap_curriculum_topics(id) ON DELETE CASCADE,
    subtopic_name TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    question_type TEXT NOT NULL CHECK (question_type IN ('mcq', 'multiple', 'boolean', 'short_code')),
    question_text TEXT NOT NULL,
    code_snippet TEXT,
    options JSONB DEFAULT '[]'::jsonb,
    correct_answer TEXT NOT NULL,
    explanation TEXT NOT NULL,
    skill_tags TEXT[] DEFAULT '{}',
    estimated_minutes INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.question_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.assessment_questions(id) ON DELETE CASCADE,
    selected_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    time_seconds INTEGER NOT NULL DEFAULT 30,
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 5. Spaced Repetition Revision Schedules
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.spaced_revision_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES public.roadmap_curriculum_topics(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('CRITICAL', 'OVERDUE', 'TODAY', 'SCHEDULED', 'MASTERED')),
    last_revised_at TIMESTAMPTZ,
    next_revision_due DATE NOT NULL,
    revision_interval_days INTEGER NOT NULL DEFAULT 1,
    revision_count INTEGER NOT NULL DEFAULT 0,
    ease_factor NUMERIC(4, 2) NOT NULL DEFAULT 2.50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_student_topic_revision UNIQUE (student_id, topic_id)
);

-- ----------------------------------------------------------------------------
-- 6. Curated Coding Problems & Student Progress
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.curated_coding_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES public.roadmap_curriculum_topics(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('LeetCode', 'GeeksForGeeks', 'CodeChef', 'Codeforces', 'Custom')),
    problem_url TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    youtube_solution_url TEXT,
    youtube_channel_name TEXT,
    is_blind75 BOOLEAN NOT NULL DEFAULT false,
    is_neetcode150 BOOLEAN NOT NULL DEFAULT false,
    is_striver_a2z BOOLEAN NOT NULL DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.student_coding_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES public.curated_coding_problems(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'attempted' CHECK (status IN ('solved', 'attempted', 'bookmarked')),
    notes TEXT,
    solved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_student_coding_problem UNIQUE (student_id, problem_id)
);

-- ----------------------------------------------------------------------------
-- 7. Productivity Tasks & Focus Sessions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.productivity_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Personal Study',
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
    duration_minutes INTEGER NOT NULL DEFAULT 25,
    completed BOOLEAN NOT NULL DEFAULT false,
    due_date DATE DEFAULT CURRENT_DATE,
    related_topic_id UUID REFERENCES public.roadmap_curriculum_topics(id) ON DELETE SET NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.focus_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    duration_minutes INTEGER NOT NULL,
    session_mode TEXT NOT NULL CHECK (session_mode IN ('work', 'short_break', 'long_break')),
    completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 8. Explainable Next-Best Actions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.next_best_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    reason TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Study', 'Revision', 'Academic', 'Career', 'Productivity', 'Interview')),
    urgency TEXT NOT NULL CHECK (urgency IN ('CRITICAL', 'HIGH', 'MEDIUM', 'NORMAL')),
    estimated_minutes INTEGER NOT NULL DEFAULT 15,
    action_type TEXT NOT NULL CHECK (action_type IN ('attempt_quiz', 'revise_topic', 'view_resource', 'practice_interview', 'start_focus', 'view_academic')),
    target_payload JSONB DEFAULT '{}'::jsonb,
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    expires_at TIMESTAMPTZ
);

-- ============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_student_grades_student ON public.student_subject_grades(student_id);
CREATE INDEX IF NOT EXISTS idx_student_grades_sem ON public.student_subject_grades(student_id, semester);
CREATE INDEX IF NOT EXISTS idx_roadmap_topics_year ON public.roadmap_curriculum_topics(year_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_topics_key ON public.roadmap_curriculum_topics(topic_key);
CREATE INDEX IF NOT EXISTS idx_roadmap_subtopics_topic ON public.roadmap_subtopics(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_mastery_student ON public.student_topic_mastery(student_id);
CREATE INDEX IF NOT EXISTS idx_topic_mastery_status ON public.student_topic_mastery(status);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON public.assessment_questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_attempts_student ON public.question_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_revision_due ON public.spaced_revision_schedules(student_id, next_revision_due);
CREATE INDEX IF NOT EXISTS idx_coding_problems_topic ON public.curated_coding_problems(topic_id);
CREATE INDEX IF NOT EXISTS idx_coding_submissions_student ON public.student_coding_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_prod_tasks_student ON public.productivity_tasks(student_id, completed);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_student ON public.focus_sessions(student_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_nba_student ON public.next_best_actions(student_id, completed, urgency);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.academic_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_subject_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_curriculum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_topic_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaced_revision_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curated_coding_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_coding_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productivity_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.next_best_actions ENABLE ROW LEVEL SECURITY;

-- Public Curriculum & Questions (Authenticated Read)
CREATE POLICY "Public read academic_courses" ON public.academic_courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read roadmap_years" ON public.roadmap_years FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read roadmap_curriculum_topics" ON public.roadmap_curriculum_topics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read roadmap_subtopics" ON public.roadmap_subtopics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read assessment_questions" ON public.assessment_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read curated_coding_problems" ON public.curated_coding_problems FOR SELECT TO authenticated USING (true);

-- Student Private Scoped Tables
CREATE POLICY "Students manage student_subject_grades" ON public.student_subject_grades FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_subject_grades.student_id AND s.profile_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_subject_grades.student_id AND s.profile_id = auth.uid()));

CREATE POLICY "Students manage student_topic_mastery" ON public.student_topic_mastery FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_topic_mastery.student_id AND s.profile_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_topic_mastery.student_id AND s.profile_id = auth.uid()));

CREATE POLICY "Students manage question_attempts" ON public.question_attempts FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = question_attempts.student_id AND s.profile_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.students s WHERE s.id = question_attempts.student_id AND s.profile_id = auth.uid()));

CREATE POLICY "Students manage spaced_revision_schedules" ON public.spaced_revision_schedules FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = spaced_revision_schedules.student_id AND s.profile_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.students s WHERE s.id = spaced_revision_schedules.student_id AND s.profile_id = auth.uid()));

CREATE POLICY "Students manage student_coding_submissions" ON public.student_coding_submissions FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_coding_submissions.student_id AND s.profile_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_coding_submissions.student_id AND s.profile_id = auth.uid()));

CREATE POLICY "Students manage productivity_tasks" ON public.productivity_tasks FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = productivity_tasks.student_id AND s.profile_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.students s WHERE s.id = productivity_tasks.student_id AND s.profile_id = auth.uid()));

CREATE POLICY "Students manage focus_sessions" ON public.focus_sessions FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = focus_sessions.student_id AND s.profile_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.students s WHERE s.id = focus_sessions.student_id AND s.profile_id = auth.uid()));

CREATE POLICY "Students manage next_best_actions" ON public.next_best_actions FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = next_best_actions.student_id AND s.profile_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.students s WHERE s.id = next_best_actions.student_id AND s.profile_id = auth.uid()));
