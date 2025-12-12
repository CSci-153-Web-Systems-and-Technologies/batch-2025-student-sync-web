# Student Sync Database Architecture

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AUTHENTICATION LAYER                         │
│                          (Supabase Auth)                             │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ↓
                    ┌──────────────────┐
                    │   auth.users     │
                    │   (Supabase)     │
                    └────────┬─────────┘
                             │
                             ↓
                    ┌─────────────────┐
                    │  public.users   │ ← Base user info
                    │  - id (PK)      │
                    │  - email        │
                    │  - role (enum)  │
                    │  - first_name   │
                    │  - last_name    │
                    │  - status       │
                    └────┬────────┬───┘
                         │        │
           ┌─────────────┘        └─────────────┐
           ↓                                     ↓
    ┌──────────────┐                    ┌──────────────┐
    │   students   │                    │   faculty    │
    │  - id (FK)   │                    │  - id (FK)   │
    │  - student_id│                    │  - faculty_id│
    │  - program_id├──┐                 │  - department│
    │  - year_level│  │                 │  - title     │
    │  - gpa       │  │                 │  - office    │
    └──────┬───────┘  │                 └──────┬───────┘
           │          │                        │
           │          │                        │
           │          ↓                        │
           │   ┌──────────────┐               │
           │   │degree_programs│              │
           │   │  - id (PK)   │               │
           │   │  - code      │               │
           │   │  - name      │               │
           │   │  - credits   │               │
           │   └──────────────┘               │
           │                                   │
           ↓                                   │
    ┌──────────────┐                          │
    │ enrollments  │                          │
    │  - id (PK)   │                          │
    │  - student_id├──────────────────────────┘
    │  - section_id├──┐                       
    │  - grade     │  │
    │  - status    │  │
    └──────────────┘  │
                      │
                      ↓
              ┌────────────────┐
              │course_sections │
              │  - id (PK)     │
              │  - course_id   ├──┐
              │  - term_id     │  │
              │  - faculty_id  │  │
              │  - capacity    │  │
              └────────────────┘  │
                      ↓            │
              ┌────────────────┐  │
              │academic_terms  │  │
              │  - id (PK)     │  │
              │  - name        │  │
              │  - year        │  │
              │  - is_current  │  │
              └────────────────┘  │
                                  │
                                  ↓
                         ┌──────────────┐
                         │   courses    │
                         │  - id (PK)   │
                         │  - code      │
                         │  - name      │
                         │  - credits   │
                         └──────────────┘
```

## Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER (React)                         │
│                                                                        │
│  ┌────────────┐  ┌────────────┐  ┌─────────────┐  ┌──────────────┐ │
│  │   Login    │  │  Student   │  │   Admin     │  │   Faculty    │ │
│  │   Page     │  │ Dashboard  │  │  Dashboard  │  │  Dashboard   │ │
│  └─────┬──────┘  └─────┬──────┘  └──────┬──────┘  └──────┬───────┘ │
│        │               │                │                │          │
└────────┼───────────────┼────────────────┼────────────────┼──────────┘
         │               │                │                │
         ↓               ↓                ↓                ↓
┌──────────────────────────────────────────────────────────────────────┐
│                         HOOKS LAYER (React)                           │
│                                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐           │
│  │ useAuth  │  │useStudent│  │ useFaculty│  │useCourses │  ...      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬─────┘           │
│       │             │              │              │                  │
└───────┼─────────────┼──────────────┼──────────────┼──────────────────┘
        │             │              │              │
        ↓             ↓              ↓              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                      API LAYER (supabase.js)                          │
│                                                                        │
│  ┌────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌──────────┐ │
│  │  auth  │  │students │  │ faculty │  │ courses  │  │ enrolls  │ │
│  └───┬────┘  └────┬────┘  └────┬────┘  └────┬─────┘  └────┬─────┘ │
│      │            │             │            │             │        │
└──────┼────────────┼─────────────┼────────────┼─────────────┼────────┘
       │            │             │            │             │
       ↓            ↓             ↓            ↓             ↓
┌──────────────────────────────────────────────────────────────────────┐
│                   SUPABASE CLIENT (@supabase/supabase-js)             │
│                                                                        │
│  ┌────────────────┐  ┌──────────────┐  ┌────────────────────┐       │
│  │  Auth Service  │  │  Database    │  │  Realtime Service  │       │
│  └────────┬───────┘  └──────┬───────┘  └──────────┬─────────┘       │
│           │                 │                     │                  │
└───────────┼─────────────────┼─────────────────────┼──────────────────┘
            │                 │                     │
            ↓                 ↓                     ↓
┌──────────────────────────────────────────────────────────────────────┐
│                        SUPABASE BACKEND                               │
│                                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐            │
│  │ PostgreSQL   │  │ Row Level    │  │  Realtime      │            │
│  │   Database   │  │  Security    │  │  Broadcasts    │            │
│  └──────────────┘  └──────────────┘  └────────────────┘            │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. Enter credentials
     ↓
┌──────────────────┐
│  Login Form      │
│  (React)         │
└────┬─────────────┘
     │
     │ 2. Call auth.signIn()
     ↓
┌──────────────────┐
│  useAuth Hook    │
│  (React Hook)    │
└────┬─────────────┘
     │
     │ 3. supabase.auth.signInWithPassword()
     ↓
┌──────────────────┐
│  Supabase        │
│  Auth Service    │
└────┬─────────────┘
     │
     │ 4. Verify credentials
     ↓
┌──────────────────┐
│  PostgreSQL      │
│  auth.users      │
└────┬─────────────┘
     │
     │ 5. Return session token
     ↓
┌──────────────────┐
│  useAuth Hook    │
│  (Updates state) │
└────┬─────────────┘
     │
     │ 6. Fetch user profile
     ↓
┌──────────────────┐
│  public.users    │
│  (Get role)      │
└────┬─────────────┘
     │
     │ 7. Render appropriate dashboard
     ↓
┌──────────────────┐
│  Student/Admin   │
│  Dashboard       │
└──────────────────┘
```

## Data Fetching Flow (with Real-time)

```
Component Mount
     │
     ↓
┌──────────────────┐
│  useStudent()    │ ← React Hook
└────┬─────────────┘
     │
     │ Initial Fetch
     ↓
┌──────────────────┐
│  students.get()  │ ← API Function
└────┬─────────────┘
     │
     │ SELECT query
     ↓
┌──────────────────┐
│  Supabase        │
│  (Check RLS)     │
└────┬─────────────┘
     │
     │ Return data
     ↓
┌──────────────────┐
│  React State     │ ← Set initial data
│  (student data)  │
└────┬─────────────┘
     │
     │ Subscribe to changes
     ↓
┌──────────────────┐
│  Realtime        │
│  Subscription    │
└────┬─────────────┘
     │
     │ Database change detected
     ↓
┌──────────────────┐
│  Broadcast       │
│  (WebSocket)     │
└────┬─────────────┘
     │
     │ Update received
     ↓
┌──────────────────┐
│  React State     │ ← Update automatically
│  (Updated data)  │
└────┬─────────────┘
     │
     │ Re-render
     ↓
┌──────────────────┐
│  UI Updates      │ ← User sees changes
└──────────────────┘
```

## Row Level Security (RLS) Flow

```
User makes request
     │
     ↓
┌──────────────────────┐
│  Supabase Client     │
│  (Include JWT token) │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│  PostgreSQL          │
│  (Parse JWT)         │
└──────┬───────────────┘
       │
       │ Check: auth.uid()
       ↓
┌──────────────────────┐
│  RLS Policy Engine   │
│  - Check user role   │
│  - Check ownership   │
│  - Apply filters     │
└──────┬───────────────┘
       │
       ┌───────┴────────┐
       ↓                ↓
   ┌─────────┐    ┌──────────┐
   │ ALLOW   │    │  DENY    │
   │ (Return │    │  (Return │
   │  data)  │    │  error)  │
   └─────────┘    └──────────┘

Example Policies:
─────────────────
Students can view their own data:
  USING (auth.uid() = id)

Admins can view all:
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  )
```

## File Upload Flow

```
User selects file
     │
     ↓
┌──────────────────┐
│  File Input      │
│  (onChange)      │
└────┬─────────────┘
     │
     │ File object
     ↓
┌──────────────────┐
│  uploadFile()    │ ← Utility function
└────┬─────────────┘
     │
     │ supabase.storage.upload()
     ↓
┌──────────────────┐
│  Supabase        │
│  Storage         │
└────┬─────────────┘
     │
     │ Store file
     ↓
┌──────────────────┐
│  S3-compatible   │
│  Storage         │
└────┬─────────────┘
     │
     │ Return URL
     ↓
┌──────────────────┐
│  Database        │
│  (Save URL)      │
└────┬─────────────┘
     │
     │ Display image
     ↓
┌──────────────────┐
│  <img src={url}> │
└──────────────────┘
```

## Key Architecture Principles

1. **Separation of Concerns**
   - React Components → UI only
   - Hooks → Data fetching and state
   - API Functions → Business logic
   - Database → Data storage

2. **Security First**
   - All tables have RLS policies
   - JWT tokens for authentication
   - Role-based access control
   - Encrypted passwords (handled by Supabase)

3. **Real-time by Default**
   - Automatic UI updates
   - WebSocket subscriptions
   - No manual polling needed

4. **Type Safety** (Future Enhancement)
   - TypeScript types generated from schema
   - Better IDE support
   - Runtime validation

5. **Scalability**
   - PostgreSQL can handle millions of rows
   - Connection pooling handled by Supabase
   - CDN for static assets
   - Edge functions for compute
