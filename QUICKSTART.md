# Quick Start - Testing Supabase Integration

## Test Credentials

After setting up Supabase, create these test accounts:

### Test Student Account
```
Email: student@test.com
Password: test123456
Role: student
```

### Test Admin Account
```
Email: admin@test.com
Password: test123456
Role: admin
```

## Installation Steps

1. **Install Supabase Client**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Configure Environment Variables**
   
   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

3. **Set Up Database**
   
   - Go to your Supabase Dashboard
   - Open SQL Editor
   - Run `supabase/schema.sql`
   - Run `supabase/seed.sql` (optional sample data)

4. **Create Test Users in Supabase**
   
   Go to Authentication > Users in Supabase Dashboard:
   - Click "Add User"
   - Create users with the test credentials above
   
   Then run this SQL to complete setup:
   
   ```sql
   -- For student@test.com
   INSERT INTO public.users (id, email, role, first_name, last_name, status)
   SELECT id, email, 'student', 'John', 'Doe', 'active'
   FROM auth.users WHERE email = 'student@test.com';
   
   INSERT INTO public.students (id, student_id, program_id, year_level, gpa, total_credits_earned)
   SELECT 
     u.id, 
     '22-1-01580',
     (SELECT id FROM public.degree_programs WHERE code = 'BSCS' LIMIT 1),
     2,
     3.50,
     60
   FROM public.users u WHERE u.email = 'student@test.com';
   
   -- For admin@test.com
   INSERT INTO public.users (id, email, role, first_name, last_name, status)
   SELECT id, email, 'admin', 'Admin', 'User', 'active'
   FROM auth.users WHERE email = 'admin@test.com';
   ```

5. **Update Your App to Use Supabase**
   
   Option A - Replace existing files:
   ```bash
   # Backup current files
   copy src\App.jsx src\App.backup.jsx
   copy src\StudentDashboard.jsx src\StudentDashboard.backup.jsx
   
   # Use Supabase versions
   copy src\App.supabase.jsx src\App.jsx
   copy src\StudentDashboard.supabase.jsx src\StudentDashboard.jsx
   ```
   
   Option B - Import in your current App.jsx:
   ```jsx
   import AppWithSupabase from './App.supabase'
   
   export default AppWithSupabase
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

## Testing Checklist

- [ ] Can sign in with test student account
- [ ] Can sign in with test admin account  
- [ ] Student dashboard shows real data from database
- [ ] Admin dashboard loads (even with sample data)
- [ ] Can update student profile
- [ ] Can log out and log back in
- [ ] Session persists on page refresh

## Common Issues

**"Missing Supabase environment variables"**
- Check `.env` file has correct VITE_ prefix
- Restart dev server after changing .env

**"Row Level Security policy violation"**
- Make sure you ran the schema.sql file completely
- Check that RLS policies were created

**"User has no profile data"**
- Run the SQL commands above to create user profiles
- Verify data exists in `users` and `students` tables

**"Cannot read property of undefined"**
- Data might still be loading
- Check browser console for errors
- Verify network tab shows successful API calls

## Next Steps

Once basic auth is working:

1. ✅ Replace all hardcoded data in components
2. ✅ Add real-time subscriptions for live updates
3. ✅ Implement admin CRUD operations
4. ✅ Add file upload for avatars/documents
5. ✅ Set up email templates
6. ✅ Add proper error handling
7. ✅ Implement search and filtering
8. ✅ Add pagination for large datasets

## Useful Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run start
```

## Database Schema Quick Reference

**Main Tables:**
- `users` - Base user data (all roles)
- `students` - Student-specific data
- `faculty` - Faculty-specific data  
- `degree_programs` - Academic programs
- `courses` - Course catalog
- `enrollments` - Student course enrollments
- `announcements` - System announcements
- `calendar_events` - Academic calendar

**Relationships:**
- User (1) → Student (1)
- User (1) → Faculty (1)
- Student (N) → Enrollments (M)
- Program (1) → Students (N)
- Course (1) → Sections (N)

## Support

For help:
1. Check `SUPABASE_SETUP.md` for detailed documentation
2. Review Supabase docs: https://supabase.com/docs
3. Check browser console for errors
4. Verify Supabase dashboard for data issues
