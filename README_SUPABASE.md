# Student Sync - Supabase Backend Integration

## 🚀 Overview

This project now includes a complete Supabase backend with:

- ✅ **Authentication** - User sign up, sign in, and session management
- ✅ **Database Schema** - Complete relational database for academic management
- ✅ **Row Level Security** - Secure data access based on user roles
- ✅ **Real-time Updates** - Live data synchronization
- ✅ **API Helpers** - Pre-built functions for all operations
- ✅ **React Hooks** - Easy-to-use hooks for data fetching

## 📁 New Files Created

### Database & Configuration
- `supabase/schema.sql` - Complete database schema with tables, policies, triggers
- `supabase/seed.sql` - Sample data for testing
- `.env.example` - Environment variables template
- `.env` - Updated with Supabase credentials

### Application Code
- `src/supabase.js` - Supabase client and API functions
- `src/hooks/useSupabase.js` - React hooks for data fetching
- `src/utils/supabaseUtils.js` - Utility functions for common operations
- `src/App.supabase.jsx` - Example App with authentication
- `src/StudentDashboard.supabase.jsx` - Example dashboard with real data

### Documentation
- `SUPABASE_SETUP.md` - Detailed setup guide
- `QUICKSTART.md` - Quick start guide for testing
- `README_SUPABASE.md` - This file

## 🗄️ Database Schema

### Tables Created

1. **users** - Base user information (extends Supabase auth)
2. **students** - Student-specific data with GPA, credits, etc.
3. **faculty** - Faculty member information
4. **degree_programs** - Academic programs (BS CS, BS IT, etc.)
5. **courses** - Course catalog
6. **course_sections** - Specific course offerings per term
7. **enrollments** - Student course enrollments with grades
8. **academic_terms** - Semester/term definitions
9. **announcements** - System announcements
10. **calendar_events** - Academic calendar
11. **program_courses** - Course requirements per program
12. **student_activities** - Activity logging

### Key Features

- **Enums** for roles, statuses, priorities
- **Foreign Keys** maintaining referential integrity
- **Triggers** for automatic timestamp updates
- **Functions** for GPA calculation and statistics
- **Indexes** for query performance
- **RLS Policies** for secure data access

## 🔐 Security

### Row Level Security Policies

- **Students** can view/edit only their own data
- **Faculty** can view students in their courses
- **Admins** have full access to all data
- **Public** read access for programs, courses, announcements

### Authentication

- Email/password authentication via Supabase Auth
- Session management with automatic token refresh
- Role-based access control

## 📚 API Reference

### Authentication

```javascript
import { auth } from './supabase'

// Sign up
const { data, error } = await auth.signUp(email, password, {
  first_name: 'John',
  last_name: 'Doe',
  role: 'student'
})

// Sign in
const { data, error } = await auth.signIn(email, password)

// Sign out
await auth.signOut()

// Get current user
const { user } = await auth.getCurrentUser()
```

### Using React Hooks

```javascript
import { useAuth, useStudent, useEnrollments } from './hooks/useSupabase'

function StudentDashboard() {
  const { user, signOut } = useAuth()
  const { student, loading } = useStudent(user?.id)
  const { enrollments } = useEnrollments(user?.id)
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      <h1>{student.user.first_name} {student.user.last_name}</h1>
      <p>GPA: {student.gpa}</p>
      <p>Enrolled in {enrollments.length} courses</p>
      <button onClick={signOut}>Logout</button>
    </div>
  )
}
```

### Direct API Calls

```javascript
import { students, courses, enrollments } from './supabase'

// Get student
const { data, error } = await students.getStudent(studentId)

// Get all courses
const { data } = await courses.getCourses()

// Enroll student
await enrollments.enrollStudent(studentId, sectionId)

// Update grade
await enrollments.updateEnrollment(enrollmentId, {
  grade: 3.5,
  letter_grade: 'B+',
  status: 'completed'
})
```

## 🛠️ Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up and create a new project
3. Wait for project to be ready (~2 minutes)

### 2. Get API Keys

1. Go to Project Settings > API
2. Copy your **Project URL**
3. Copy your **anon/public key**

### 3. Configure Environment

Update `.env` file:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Set Up Database

1. Open Supabase Dashboard > SQL Editor
2. Copy contents of `supabase/schema.sql`
3. Paste and click "Run"
4. (Optional) Run `supabase/seed.sql` for sample data

### 5. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 6. Test the Integration

```bash
npm run dev
```

Open http://localhost:5173 and try:
- Creating an account
- Signing in
- Viewing dashboard data

## 🧪 Testing

### Create Test Users

**Via Supabase Dashboard:**
1. Go to Authentication > Users
2. Click "Add User"
3. Enter email and password
4. User will appear in `auth.users`

**Complete Profile Setup:**
```sql
-- Add to users table
INSERT INTO public.users (id, email, role, first_name, last_name, status)
SELECT id, email, 'student', 'John', 'Doe', 'active'
FROM auth.users WHERE email = 'test@example.com';

-- Add to students table
INSERT INTO public.students (id, student_id, program_id, year_level, gpa)
SELECT 
  u.id,
  '22-1-01580',
  (SELECT id FROM degree_programs WHERE code = 'BSCS' LIMIT 1),
  2,
  3.50
FROM users u WHERE u.email = 'test@example.com';
```

### Test Credentials

After setup, use these:
```
Email: student@test.com
Password: test123456
Role: student
```

## 📊 Data Flow

```
User Action → React Component → Hook/API Function → Supabase → PostgreSQL
                    ↓                                    ↓
                UI Update ← React State ← Real-time Subscription
```

## 🔄 Real-time Updates

All hooks automatically subscribe to database changes:

```javascript
const { student } = useStudent(userId) 
// Automatically updates when student data changes in database

const { announcements } = useAnnouncements()
// New announcements appear immediately
```

## 📦 Project Structure

```
batch-2025-student-sync-web/
├── supabase/
│   ├── schema.sql          # Database schema
│   └── seed.sql            # Sample data
├── src/
│   ├── hooks/
│   │   └── useSupabase.js  # React hooks
│   ├── utils/
│   │   └── supabaseUtils.js # Utility functions
│   ├── supabase.js         # Supabase client
│   ├── App.supabase.jsx    # Example with auth
│   └── StudentDashboard.supabase.jsx
├── .env                     # Environment variables
├── .env.example            # Template
├── SUPABASE_SETUP.md       # Detailed setup
├── QUICKSTART.md           # Quick start
└── README_SUPABASE.md      # This file
```

## 🚨 Troubleshooting

### "Missing Supabase environment variables"
- Check `.env` file has `VITE_` prefix
- Restart dev server: `Ctrl+C` then `npm run dev`

### "Row Level Security policy violation"
- Verify schema.sql ran completely
- Check user is authenticated
- Verify user has correct role in `users` table

### "No data showing"
- Check browser console for errors
- Verify data exists in Supabase dashboard
- Check Network tab for API responses

### Database Connection Issues
- Verify Supabase project is active
- Check API keys are correct
- Ensure no typos in `.env`

## 🎯 Next Steps

### Immediate (Development)
1. ✅ Install Supabase client
2. ✅ Configure environment variables
3. ✅ Run database schema
4. ✅ Create test users
5. ✅ Test authentication flow

### Short Term (Integration)
1. Replace hardcoded data in components
2. Add real-time subscriptions
3. Implement profile editing
4. Add image uploads for avatars
5. Create admin CRUD operations

### Long Term (Production)
1. Set up email templates
2. Configure OAuth providers (Google, GitHub)
3. Implement proper error handling
4. Add loading states
5. Set up backup procedures
6. Configure production environment
7. Add analytics and monitoring

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)
- [Storage Guide](https://supabase.com/docs/guides/storage)

## 💡 Tips

1. **Development**: Disable email confirmation in Auth settings
2. **Testing**: Use SQL Editor to inspect data directly
3. **Debugging**: Check browser console and Network tab
4. **Performance**: Use indexes for frequently queried columns
5. **Security**: Always use RLS policies, never disable them

## 🤝 Support

If you encounter issues:
1. Check `SUPABASE_SETUP.md` for detailed guides
2. Review `QUICKSTART.md` for common solutions
3. Check Supabase Dashboard > Logs for errors
4. Verify all SQL scripts ran successfully

---

**Happy Coding!** 🎉
