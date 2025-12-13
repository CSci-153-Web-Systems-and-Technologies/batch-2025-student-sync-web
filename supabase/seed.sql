-- =====================================================
-- Sample Data for Student Sync Web System
-- =====================================================

-- Insert Degree Programs
INSERT INTO public.degree_programs (code, name, description, duration_years, total_credits) VALUES
('BSCS', 'Bachelor of Science in Computer Science', 'Comprehensive program covering software development, algorithms, and computer systems', 4, 120),
('BSIT', 'Bachelor of Science in Information Technology', 'Focus on information systems, networking, and database management', 4, 120),
('BSIS', 'Bachelor of Science in Information Systems', 'Business-oriented IT program with focus on enterprise systems', 4, 120),
('BSCE', 'Bachelor of Science in Computer Engineering', 'Hardware and software integration, embedded systems', 4, 126);

-- Insert Courses
INSERT INTO public.courses (code, name, description, credits, department) VALUES
('CS101', 'Introduction to Programming', 'Basic programming concepts using Python', 3, 'Computer Science'),
('CS102', 'Data Structures and Algorithms', 'Fundamental data structures and algorithmic thinking', 3, 'Computer Science'),
('CS201', 'Object-Oriented Programming', 'Advanced programming using OOP principles', 3, 'Computer Science'),
('CS202', 'Database Systems', 'Design and implementation of database systems', 3, 'Computer Science'),
('CS301', 'Web Development', 'Modern web technologies and frameworks', 3, 'Computer Science'),
('CS302', 'Mobile App Development', 'iOS and Android development', 3, 'Computer Science'),
('CS401', 'Software Engineering', 'Software development lifecycle and best practices', 3, 'Computer Science'),
('CS402', 'Capstone Project', 'Final year project', 6, 'Computer Science'),
('MATH101', 'Calculus I', 'Differential calculus', 3, 'Mathematics'),
('MATH102', 'Discrete Mathematics', 'Logic, sets, and graph theory', 3, 'Mathematics'),
('ENG101', 'English Communication', 'Academic writing and communication', 3, 'English'),
('IT201', 'Network Fundamentals', 'Computer networking basics', 3, 'Information Technology'),
('IT202', 'System Administration', 'Linux and Windows server administration', 3, 'Information Technology');

-- Insert Academic Term
INSERT INTO public.academic_terms (name, year, semester, start_date, end_date, is_current) VALUES
('Fall 2025', 2025, 1, '2025-08-15', '2025-12-15', true);

-- Note: Additional sample data for users, students, faculty, and enrollments
-- should be added after authentication setup, as they require valid auth.users records
