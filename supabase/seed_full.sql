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
