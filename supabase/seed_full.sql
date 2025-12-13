-- Seed data for Student Sync Web System
-- Run this after applying full_schema.sql

-- Degree programs
INSERT INTO public.degree_programs (id, code, name, description, duration_years, total_credits)
VALUES
  (uuid_generate_v4(), 'BSCS', 'Bachelor of Science in Computer Science', 'Computer Science program', 4, 160),
  (uuid_generate_v4(), 'BSEE', 'Bachelor of Science in Electrical Engineering', 'Electrical Engineering program', 4, 160)
ON CONFLICT DO NOTHING;

-- Example courses
INSERT INTO public.courses (id, code, name, description, credits, department)
VALUES
  (uuid_generate_v4(), 'CS101', 'Introduction to Programming', 'Basics of programming using Python', 3, 'Computer Science'),
  (uuid_generate_v4(), 'CS102', 'Data Structures', 'Fundamental data structures', 3, 'Computer Science'),
  (uuid_generate_v4(), 'EE101', 'Circuits I', 'Introduction to electrical circuits', 3, 'Electrical Engineering')
ON CONFLICT DO NOTHING;

-- Academic terms
INSERT INTO public.academic_terms (id, name, year, semester, start_date, end_date, is_current)
VALUES
  (uuid_generate_v4(), 'Fall 2025', 2025, 1, '2025-08-01', '2025-12-20', true),
  (uuid_generate_v4(), 'Spring 2026', 2026, 2, '2026-01-10', '2026-05-25', false)
ON CONFLICT DO NOTHING;

-- Notes for creating an admin user:
-- 1) Create the auth user via Supabase Auth (email/password) from the Auth panel or API.
-- 2) Copy the new auth user's id (UUID) and run the following, replacing <AUTH_USER_UUID>:
--
-- INSERT INTO public.users (id, email, role, first_name, last_name, status)
-- VALUES ('<AUTH_USER_UUID>', 'admin@example.com', 'admin', 'Site', 'Admin', 'active');
--
-- This will make the auth user an admin in the application-specific profile table.

-- Additional seed data: more degree programs, courses (with departments), program-course mappings,
-- and sample course sections so dropdowns for programs, courses, and departments are populated.

-- More degree programs
INSERT INTO public.degree_programs (id, code, name, description, duration_years, total_credits)
VALUES
  (uuid_generate_v4(), 'BSIT', 'Bachelor of Science in Information Technology', 'Information Technology program', 4, 140),
  (uuid_generate_v4(), 'BSBA', 'Bachelor of Science in Business Administration', 'Business Administration program', 4, 128),
  (uuid_generate_v4(), 'BSMATH', 'Bachelor of Science in Mathematics', 'Mathematics program', 4, 140),
  (uuid_generate_v4(), 'BSPHY', 'Bachelor of Science in Physics', 'Physics program', 4, 140),
  (uuid_generate_v4(), 'BSENG', 'Bachelor of Science in Engineering', 'Engineering program', 4, 160)
ON CONFLICT DO NOTHING;

-- Additional courses across departments (department text will feed department dropdown)
INSERT INTO public.courses (id, code, name, description, credits, department)
VALUES
  (uuid_generate_v4(), 'CS201', 'Algorithms', 'Design and analysis of algorithms', 3, 'Computer Science'),
  (uuid_generate_v4(), 'CS301', 'Operating Systems', 'Processes, threads, and scheduling', 3, 'Computer Science'),
  (uuid_generate_v4(), 'IT101', 'Intro to Information Systems', 'Foundations of information systems', 3, 'Information Technology'),
  (uuid_generate_v4(), 'IT201', 'Networks and Communications', 'Computer networks fundamentals', 3, 'Information Technology'),
  (uuid_generate_v4(), 'MATH101', 'Calculus I', 'Differential and integral calculus', 4, 'Mathematics'),
  (uuid_generate_v4(), 'MATH201', 'Linear Algebra', 'Vectors, matrices, and linear systems', 3, 'Mathematics'),
  (uuid_generate_v4(), 'PHYS101', 'General Physics I', 'Mechanics and thermodynamics', 4, 'Physics'),
  (uuid_generate_v4(), 'ENG101', 'Engineering Graphics', 'Technical drawing and CAD basics', 2, 'Engineering'),
  (uuid_generate_v4(), 'BUS101', 'Intro to Business', 'Business fundamentals', 3, 'Business'),
  (uuid_generate_v4(), 'ACC101', 'Financial Accounting', 'Basic accounting principles', 3, 'Business'),
  (uuid_generate_v4(), 'EE201', 'Signals and Systems', 'Signal analysis for engineers', 3, 'Electrical Engineering'),
  (uuid_generate_v4(), 'EE301', 'Digital Electronics', 'Logic design and digital circuits', 3, 'Electrical Engineering')
ON CONFLICT DO NOTHING;

-- Map core courses to programs (program_courses)
INSERT INTO public.program_courses (id, program_id, course_id, year_level, semester, is_required)
VALUES
  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BSCS'), (SELECT id FROM public.courses WHERE code = 'CS101'), 1, 1, true),
  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BSCS'), (SELECT id FROM public.courses WHERE code = 'CS102'), 1, 2, true),
  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BSCS'), (SELECT id FROM public.courses WHERE code = 'CS201'), 2, 1, true),
  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BSCS'), (SELECT id FROM public.courses WHERE code = 'CS301'), 3, 1, false),

  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BSEE'), (SELECT id FROM public.courses WHERE code = 'EE101'), 1, 1, true),
  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BSEE'), (SELECT id FROM public.courses WHERE code = 'EE201'), 2, 1, true),

  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BSIT'), (SELECT id FROM public.courses WHERE code = 'IT101'), 1, 1, true),
  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BSIT'), (SELECT id FROM public.courses WHERE code = 'IT201'), 2, 1, true),

  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BSBA'), (SELECT id FROM public.courses WHERE code = 'BUS101'), 1, 1, true),
  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BSBA'), (SELECT id FROM public.courses WHERE code = 'ACC101'), 1, 2, true),

  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BSMATH'), (SELECT id FROM public.courses WHERE code = 'MATH101'), 1, 1, true),
  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BSMATH'), (SELECT id FROM public.courses WHERE code = 'MATH201'), 2, 1, true),

  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BSPHY'), (SELECT id FROM public.courses WHERE code = 'PHYS101'), 1, 1, true),

  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BSENG'), (SELECT id FROM public.courses WHERE code = 'ENG101'), 1, 1, true)
ON CONFLICT DO NOTHING;

-- Sample course sections for the current term (faculty_id left NULL to avoid FK issues)
INSERT INTO public.course_sections (id, course_id, term_id, section_number, faculty_id, max_capacity, enrolled_count, schedule_days, schedule_time, room)
VALUES
  (uuid_generate_v4(), (SELECT id FROM public.courses WHERE code = 'CS101'), (SELECT id FROM public.academic_terms WHERE name = 'Fall 2025'), 'A', NULL, 40, 0, 'MWF', '09:00-10:00', 'Room 101'),
  (uuid_generate_v4(), (SELECT id FROM public.courses WHERE code = 'CS102'), (SELECT id FROM public.academic_terms WHERE name = 'Fall 2025'), 'A', NULL, 35, 0, 'TTh', '10:30-12:00', 'Room 102'),
  (uuid_generate_v4(), (SELECT id FROM public.courses WHERE code = 'MATH101'), (SELECT id FROM public.academic_terms WHERE name = 'Fall 2025'), 'A', NULL, 50, 0, 'MWF', '11:00-12:00', 'Room 201'),
  (uuid_generate_v4(), (SELECT id FROM public.courses WHERE code = 'PHYS101'), (SELECT id FROM public.academic_terms WHERE name = 'Fall 2025'), 'A', NULL, 45, 0, 'TTh', '13:00-14:30', 'Room 301')
ON CONFLICT DO NOTHING;

-- End of additional seed data

-- Departments table (optional) and seed entries so dropdowns can reference canonical departments
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.departments (id, code, name)
VALUES
  (uuid_generate_v4(), 'CS', 'Computer Science'),
  (uuid_generate_v4(), 'EE', 'Electrical Engineering'),
  (uuid_generate_v4(), 'IT', 'Information Technology'),
  (uuid_generate_v4(), 'MATH', 'Mathematics'),
  (uuid_generate_v4(), 'PHYS', 'Physics'),
  (uuid_generate_v4(), 'ENG', 'Engineering'),
  (uuid_generate_v4(), 'BUS', 'Business')
ON CONFLICT DO NOTHING;
 
-- Additional departments and extended seed content
INSERT INTO public.departments (id, code, name)
VALUES
  (uuid_generate_v4(), 'BIO', 'Biology'),
  (uuid_generate_v4(), 'CHEM', 'Chemistry'),
  (uuid_generate_v4(), 'NURS', 'Nursing'),
  (uuid_generate_v4(), 'ECON', 'Economics'),
  (uuid_generate_v4(), 'PSY', 'Psychology'),
  (uuid_generate_v4(), 'ENGH', 'English'),
  (uuid_generate_v4(), 'EDU', 'Education'),
  (uuid_generate_v4(), 'LAW', 'Law'),
  (uuid_generate_v4(), 'SOC', 'Sociology')
ON CONFLICT DO NOTHING;

-- Additional degree programs (new)
INSERT INTO public.degree_programs (id, code, name, description, duration_years, total_credits)
VALUES
  (uuid_generate_v4(), 'BSN', 'Bachelor of Science in Nursing', 'Nursing program', 4, 140),
  (uuid_generate_v4(), 'BSECON', 'Bachelor of Science in Economics', 'Economics program', 4, 128),
  (uuid_generate_v4(), 'BAENG', 'Bachelor of Arts in English', 'English program', 4, 120),
  (uuid_generate_v4(), 'BSED', 'Bachelor of Secondary Education', 'Education program', 4, 128),
  (uuid_generate_v4(), 'BSLAW', 'Bachelor of Science in Law', 'Pre-law program', 4, 140)
ON CONFLICT DO NOTHING;

-- Additional courses to populate dropdowns (new)
INSERT INTO public.courses (id, code, name, description, credits, department)
VALUES
  (uuid_generate_v4(), 'BIO101', 'General Biology I', 'Introduction to biology and life sciences', 4, 'Biology'),
  (uuid_generate_v4(), 'CHEM101', 'General Chemistry I', 'Basic principles of chemistry', 4, 'Chemistry'),
  (uuid_generate_v4(), 'NURS101', 'Foundations of Nursing', 'Introduction to nursing practice', 3, 'Nursing'),
  (uuid_generate_v4(), 'ECON101', 'Principles of Economics', 'Micro and macro fundamentals', 3, 'Economics'),
  (uuid_generate_v4(), 'PSY101', 'Introduction to Psychology', 'Foundational concepts in psychology', 3, 'Psychology'),
  (uuid_generate_v4(), 'ENG201', 'Creative Writing', 'Fundamentals of creative writing', 3, 'English'),
  (uuid_generate_v4(), 'LAW101', 'Introduction to Law', 'Overview of legal systems', 3, 'Law'),
  (uuid_generate_v4(), 'SOC101', 'Introduction to Sociology', 'Society and social behavior', 3, 'Sociology'),
  (uuid_generate_v4(), 'EDU101', 'Foundations of Education', 'Principles and practice of education', 3, 'Education')
ON CONFLICT DO NOTHING;

-- Map new courses to new programs
INSERT INTO public.program_courses (id, program_id, course_id, year_level, semester, is_required)
VALUES
  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BSN'), (SELECT id FROM public.courses WHERE code = 'BIO101'), 1, 1, true),
  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BSN'), (SELECT id FROM public.courses WHERE code = 'CHEM101'), 1, 2, true),
  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BSN'), (SELECT id FROM public.courses WHERE code = 'NURS101'), 1, 1, true),

  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BSECON'), (SELECT id FROM public.courses WHERE code = 'ECON101'), 1, 1, true),

  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BAENG'), (SELECT id FROM public.courses WHERE code = 'ENG201'), 2, 1, false),

  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BSED'), (SELECT id FROM public.courses WHERE code = 'EDU101'), 1, 1, true),

  (uuid_generate_v4(), (SELECT id FROM public.degree_programs WHERE code = 'BSLAW'), (SELECT id FROM public.courses WHERE code = 'LAW101'), 1, 1, true)
ON CONFLICT DO NOTHING;

-- Add course sections for some of the new courses
INSERT INTO public.course_sections (id, course_id, term_id, section_number, faculty_id, max_capacity, enrolled_count, schedule_days, schedule_time, room)
VALUES
  (uuid_generate_v4(), (SELECT id FROM public.courses WHERE code = 'BIO101'), (SELECT id FROM public.academic_terms WHERE name = 'Fall 2025'), 'A', NULL, 50, 0, 'MWF', '08:00-09:00', 'Lab 1'),
  (uuid_generate_v4(), (SELECT id FROM public.courses WHERE code = 'CHEM101'), (SELECT id FROM public.academic_terms WHERE name = 'Fall 2025'), 'A', NULL, 45, 0, 'TTh', '09:30-11:00', 'Chem Lab'),
  (uuid_generate_v4(), (SELECT id FROM public.courses WHERE code = 'ECON101'), (SELECT id FROM public.academic_terms WHERE name = 'Fall 2025'), 'A', NULL, 60, 0, 'MWF', '14:00-15:00', 'Room 401')
ON CONFLICT DO NOTHING;
