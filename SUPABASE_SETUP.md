# Supabase Backend Setup Guide

## Prerequisites

1. **Create a Supabase Account**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project

2. **Get Your API Keys**
   - Go to Project Settings > API
   - Copy your Project URL and anon/public key

## Setup Instructions

### 1. Configure Environment Variables

Update your `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 3. Set Up Database Schema

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/schema.sql`
4. Click "Run" to execute the SQL

This will create:
- All database tables (users, students, faculty, courses, etc.)
- Row Level Security (RLS) policies
- Database functions and triggers
- Indexes for performance

### 4. Add Sample Data (Optional)

1. In SQL Editor, copy and paste contents of `supabase/seed.sql`
2. Run to populate with sample degree programs and courses

### 5. Configure Authentication

1. Go to Authentication > Settings
2. **Disable Email Confirmations** (for development):
   - Uncheck "Enable email confirmations"
3. Configure email templates if needed
4. Set up OAuth providers (optional)

### 6. Set Up Storage (Optional)

For profile pictures and documents:

1. Go to Storage
2. Create buckets:
   - `avatars` - for profile pictures
   - `documents` - for student documents
3. Set up storage policies

## Database Structure

### Core Tables

- **users** - Base user information (extends Supabase auth)
- **students** - Student-specific data with program enrollment
- **faculty** - Faculty member information
- **degree_programs** - Academic programs (BS CS, BS IT, etc.)
- **courses** - Course catalog
- **enrollments** - Student course enrollments with grades
- **course_sections** - Specific course offerings per term
- **academic_terms** - Semester/term definitions
- **announcements** - System announcements
- **calendar_events** - Academic calendar events

### Security

- Row Level Security (RLS) is enabled on all tables
- Students can only view/edit their own data
- Faculty can view student data for their courses
- Admins have full access
- Public read access for programs, courses, and announcements

## Usage in React Components

### Authentication Example

```jsx
import { useAuth } from './hooks/useSupabase'

function App() {
  const { user, loading, signIn, signOut } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!user) {
    return <LoginForm onLogin={signIn} />
  }

  return (
    <div>
      <h1>Welcome {user.email}</h1>
      <button onClick={signOut}>Logout</button>
    </div>
  )
}
```

### Fetch Student Data

```jsx
import { useStudent } from './hooks/useSupabase'

function StudentDashboard() {
  const { user } = useAuth()
  const { student, loading } = useStudent(user?.id)

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>{student.user.first_name} {student.user.last_name}</h1>
      <p>Student ID: {student.student_id}</p>
      <p>Program: {student.program.name}</p>
      <p>GPA: {student.gpa}</p>
    </div>
  )
}
```

### Fetch and Display Announcements

```jsx
import { useAnnouncements } from './hooks/useSupabase'

function AnnouncementsList() {
  const { announcements, loading } = useAnnouncements('students')

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {announcements.map(announcement => (
        <div key={announcement.id}>
          <h3>{announcement.title}</h3>
          <p>{announcement.content}</p>
        </div>
      ))}
    </div>
  )
}
```

## API Reference

### Authentication

```javascript
import { auth } from './supabase'

// Sign up
await auth.signUp(email, password, { first_name, last_name })

// Sign in
await auth.signIn(email, password)

// Sign out
await auth.signOut()

// Get current user
const { user } = await auth.getCurrentUser()
```

### Students

```javascript
import { students } from './supabase'

// Get student profile
const { data } = await students.getStudent(studentId)

// Get all students
const { data } = await students.getStudents({ programId: 'xxx' })

// Update student
await students.updateStudent(studentId, { gpa: 3.5 })

// Get student stats
const { data } = await students.getStudentStats(studentId)
```

### Degree Programs

```javascript
import { degreePrograms } from './supabase'

// Get all programs
const { data } = await degreePrograms.getPrograms()

// Create program (admin)
await degreePrograms.createProgram({
  code: 'BSCS',
  name: 'Bachelor of Science in Computer Science',
  duration_years: 4,
  total_credits: 120
})
```

### Courses

```javascript
import { courses } from './supabase'

// Get all courses
const { data } = await courses.getCourses()

// Create course (admin)
await courses.createCourse({
  code: 'CS101',
  name: 'Introduction to Programming',
  credits: 3,
  department: 'Computer Science'
})
```

### Enrollments

```javascript
import { enrollments } from './supabase'

// Get student enrollments
const { data } = await enrollments.getStudentEnrollments(studentId)

// Enroll student
await enrollments.enrollStudent(studentId, sectionId)

// Update grade
await enrollments.updateEnrollment(enrollmentId, {
  grade: 3.5,
  letter_grade: 'B+',
  status: 'completed'
})
```

## Real-time Updates

All hooks automatically subscribe to real-time updates. Changes in the database will reflect immediately in your UI.

```jsx
// This will update automatically when data changes
const { student } = useStudent(userId)
const { announcements } = useAnnouncements()
```

## Testing

### Create Test Users

1. Go to Authentication > Users
2. Click "Add User"
3. Create users with different roles
4. Manually add student/faculty records in the database tables

### Test Data Script

```sql
-- Create a test student user
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('student@test.com', crypt('password123', gen_salt('bf')), NOW());

-- Add user profile
INSERT INTO users (id, email, role, first_name, last_name)
SELECT id, email, 'student', 'John', 'Doe'
FROM auth.users WHERE email = 'student@test.com';

-- Add student record
INSERT INTO students (id, student_id, program_id, year_level)
SELECT id, '22-1-01580', (SELECT id FROM degree_programs WHERE code = 'BSCS'), 2
FROM users WHERE email = 'student@test.com';
```

## Troubleshooting

### Common Issues

1. **"Invalid API key"**
   - Check your `.env` file
   - Ensure `VITE_` prefix is used
   - Restart dev server after changing .env

2. **"Row Level Security" errors**
   - Verify RLS policies are set up correctly
   - Check user authentication status
   - Ensure user has correct role

3. **No data showing**
   - Check if tables have data
   - Verify RLS policies allow reading
   - Check browser console for errors

### Enable Logging

```javascript
// Add to supabase.js for debugging
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  // Enable debug mode
  global: {
    headers: {
      'X-Debug': 'true'
    }
  }
})
```

## Next Steps

1. ✅ Install dependencies: `npm install @supabase/supabase-js`
2. ✅ Configure environment variables in `.env`
3. ✅ Run database schema in Supabase SQL Editor
4. ✅ Configure authentication settings
5. ✅ Create test users and data
6. ✅ Integrate authentication in App.jsx
7. ✅ Replace hardcoded data with Supabase queries
8. ✅ Test all features

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)
