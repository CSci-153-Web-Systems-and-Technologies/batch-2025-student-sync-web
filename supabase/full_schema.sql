-- Full generated schema for Student Sync Web System
-- Copy of supabase/schema.sql

-- =====================================================
-- Student Sync Web System - Supabase Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

-- User Roles Enum
CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin');

-- User Status Enum
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'graduated');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    status user_status NOT NULL DEFAULT 'active',
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    middle_name TEXT,
    phone TEXT,
    address TEXT,
    date_of_birth DATE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ACADEMIC STRUCTURE
-- =====================================================

-- Degree Programs
CREATE TABLE public.degree_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    duration_years INTEGER NOT NULL DEFAULT 4,
    total_credits INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL DEFAULT 3,
    department TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Program Courses (which courses belong to which programs)
CREATE TABLE public.program_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES degree_programs(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    year_level INTEGER NOT NULL,
    semester INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(program_id, course_id)
);

-- =====================================================
-- STUDENTS
-- =====================================================

CREATE TABLE public.students (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    student_id TEXT UNIQUE NOT NULL, -- e.g., "22-1-01580"
    program_id UUID REFERENCES degree_programs(id),
    year_level INTEGER NOT NULL DEFAULT 1,
    semester INTEGER NOT NULL DEFAULT 1,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_graduation_date DATE,
    gpa DECIMAL(3, 2) DEFAULT 0.00,
    total_credits_earned INTEGER DEFAULT 0,
    qr_code_data TEXT, -- For student ID QR code
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- FACULTY
-- =====================================================

CREATE TABLE public.faculty (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    faculty_id TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    title TEXT, -- e.g., "Professor", "Associate Professor"
    office_location TEXT,
    office_hours TEXT,
    specialization TEXT,
    hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ENROLLMENTS & SCHEDULES
-- =====================================================

-- Academic Terms
CREATE TABLE public.academic_terms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL, -- e.g., "Fall 2025", "Spring 2026"
    year INTEGER NOT NULL,
    semester INTEGER NOT NULL, -- 1=Fall, 2=Spring, 3=Summer
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course Sections (specific instances of courses)
CREATE TABLE public.course_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    term_id UUID REFERENCES academic_terms(id) ON DELETE CASCADE,
    section_number TEXT NOT NULL,
    faculty_id UUID REFERENCES faculty(id),
    max_capacity INTEGER DEFAULT 40,
    enrolled_count INTEGER DEFAULT 0,
    schedule_days TEXT, -- e.g., "MWF", "TTh"
    schedule_time TEXT, -- e.g., "10:00-11:30"
    room TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, term_id, section_number)
);

-- Student Enrollments
CREATE TYPE enrollment_status AS ENUM ('enrolled', 'dropped', 'completed', 'failed');

CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    section_id UUID REFERENCES course_sections(id) ON DELETE CASCADE,
    status enrollment_status DEFAULT 'enrolled',
    grade DECIMAL(3, 2), -- e.g., 4.00, 3.50
    letter_grade TEXT, -- e.g., "A", "B+", "C"
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, section_id)
);

-- =====================================================
-- COMMUNICATIONS & ANNOUNCEMENTS
-- =====================================================

CREATE TYPE announcement_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE announcement_target AS ENUM ('all', 'students', 'faculty', 'program_specific');

CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    meta JSONB DEFAULT '{}'::JSONB,
    priority announcement_priority DEFAULT 'medium',
    target_audience announcement_target DEFAULT 'all',
    program_id UUID REFERENCES degree_programs(id), -- if program_specific
    published_by UUID REFERENCES users(id),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ACADEMIC CALENDAR EVENTS
-- =====================================================

CREATE TYPE event_type AS ENUM ('holiday', 'exam', 'registration', 'deadline', 'ceremony', 'other');

CREATE TABLE public.calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    event_type event_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_all_day BOOLEAN DEFAULT TRUE,
    location TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ANALYTICS & REPORTS
-- =====================================================

CREATE TABLE public.student_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- e.g., "login", "profile_update", "grade_view"
    activity_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_status ON public.users(status);
CREATE INDEX idx_students_student_id ON public.students(student_id);
CREATE INDEX idx_students_program_id ON public.students(program_id);
CREATE INDEX idx_faculty_department ON public.faculty(department);
CREATE INDEX idx_enrollments_student_id ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_section_id ON public.enrollments(section_id);
CREATE INDEX idx_course_sections_term_id ON public.course_sections(term_id);
CREATE INDEX idx_course_sections_faculty_id ON public.course_sections(faculty_id);
CREATE INDEX idx_announcements_published_at ON public.announcements(published_at DESC);
CREATE INDEX idx_calendar_events_start_date ON public.calendar_events(start_date);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.degree_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Students table policies
CREATE POLICY "Students can view their own data" ON public.students
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update their own data" ON public.students
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Faculty and admins can view all students" ON public.students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('faculty', 'admin')
        )
    );

-- Faculty table policies
CREATE POLICY "Faculty can view their own data" ON public.faculty
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Everyone can view faculty info" ON public.faculty
    FOR SELECT USING (true);

-- Degree Programs - public read access
CREATE POLICY "Anyone can view active degree programs" ON public.degree_programs
    FOR SELECT USING (is_active = true);

-- Courses - public read access
CREATE POLICY "Anyone can view active courses" ON public.courses
    FOR SELECT USING (is_active = true);

-- Course Sections - public read access
CREATE POLICY "Anyone can view course sections" ON public.course_sections
    FOR SELECT USING (true);

-- Enrollments policies
CREATE POLICY "Students can view their own enrollments" ON public.enrollments
    FOR SELECT USING (
        student_id IN (SELECT id FROM public.students WHERE id = auth.uid())
    );

CREATE POLICY "Faculty can view enrollments for their sections" ON public.enrollments
    FOR SELECT USING (
        section_id IN (
            SELECT id FROM public.course_sections 
            WHERE faculty_id IN (SELECT id FROM public.faculty WHERE id = auth.uid())
        )
    );

-- Announcements - public read access
CREATE POLICY "Anyone can view active announcements" ON public.announcements
    FOR SELECT USING (is_active = true);

-- Calendar Events - public read access
CREATE POLICY "Anyone can view calendar events" ON public.calendar_events
    FOR SELECT USING (true);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- AUTH → profile sync: create a public.users row when auth.users entry is created
-- Note: Supabase's auth.users table is managed by the Auth system. This trigger
-- ensures a corresponding row exists in public.users after a new sign-up.

CREATE OR REPLACE FUNCTION public.handle_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
    -- Avoid referencing auth-specific metadata fields which may differ by Supabase version.
    -- Insert a minimal profile; frontend or a background job can update names later.
    INSERT INTO public.users (id, email, first_name, last_name, created_at)
    VALUES (NEW.id, NEW.email, '', '', NOW())
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on auth.users to call the handler after insert
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
    ) THEN
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_auth_user_created();
    END IF;
END$$;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON public.faculty
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_degree_programs_updated_at BEFORE UPDATE ON public.degree_programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_sections_updated_at BEFORE UPDATE ON public.course_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON public.enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTIONS & STORED PROCEDURES
-- =====================================================

-- Function to calculate student GPA
CREATE OR REPLACE FUNCTION calculate_student_gpa(p_student_id UUID)
RETURNS DECIMAL(3, 2) AS $$
DECLARE
    v_gpa DECIMAL(3, 2);
BEGIN
    SELECT COALESCE(AVG(grade), 0.00)
    INTO v_gpa
    FROM public.enrollments
    WHERE student_id = p_student_id 
      AND status = 'completed'
      AND grade IS NOT NULL;
    
    RETURN ROUND(v_gpa, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to update enrollment count in course sections
CREATE OR REPLACE FUNCTION update_section_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'enrolled' THEN
        UPDATE public.course_sections
        SET enrolled_count = enrolled_count + 1
        WHERE id = NEW.section_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status = 'enrolled' AND NEW.status != 'enrolled' THEN
            UPDATE public.course_sections
            SET enrolled_count = enrolled_count - 1
            WHERE id = NEW.section_id;
        ELSIF OLD.status != 'enrolled' AND NEW.status = 'enrolled' THEN
            UPDATE public.course_sections
            SET enrolled_count = enrolled_count + 1
            WHERE id = NEW.section_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'enrolled' THEN
        UPDATE public.course_sections
        SET enrolled_count = enrolled_count - 1
        WHERE id = OLD.section_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_enrollment_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.enrollments
FOR EACH ROW EXECUTE FUNCTION update_section_enrollment_count();

-- Function to get student dashboard stats
CREATE OR REPLACE FUNCTION get_student_dashboard_stats(p_student_id UUID)
RETURNS JSON AS $$
DECLARE
    v_stats JSON;
BEGIN
    SELECT json_build_object(
        'gpa', COALESCE(s.gpa, 0.00),
        'credits_earned', COALESCE(s.total_credits_earned, 0),
        'current_courses', (
            SELECT COUNT(*) FROM public.enrollments e
            JOIN public.course_sections cs ON e.section_id = cs.id
            JOIN public.academic_terms at ON cs.term_id = at.id
            WHERE e.student_id = p_student_id 
              AND e.status = 'enrolled'
              AND at.is_current = true
        ),
        'year_level', s.year_level,
        'semester', s.semester
    )
    INTO v_stats
    FROM public.students s
    WHERE s.id = p_student_id;
    
    RETURN v_stats;
END;
$$ LANGUAGE plpgsql;
