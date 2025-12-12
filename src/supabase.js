import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

// =====================================================
// AUTH HELPERS
// =====================================================

export const auth = {
    // Sign up new user
    signUp: async (email, password, userData) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData // Additional metadata
            }
        })
        return { data, error }
    },

    // Sign in
    signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        return { data, error }
    },

    // Sign in with OAuth provider (Google, etc.)
    signInWithProvider: async (provider) => {
        const { data, error } = await supabase.auth.signInWithOAuth({ provider })
        return { data, error }
    },

    // Send password reset email
    sendPasswordReset: async (email, options = {}) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, options)
        return { data, error }
    },

    // Sign out
    signOut: async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
    },

    // Get current user
    getCurrentUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser()
        return { user, error }
    },

    // Get current session
    getSession: async () => {
        const { data: { session }, error } = await supabase.auth.getSession()
        return { session, error }
    },

    // Listen to auth changes
    onAuthStateChange: (callback) => {
        return supabase.auth.onAuthStateChange(callback)
    }
}

// =====================================================
// USER OPERATIONS
// =====================================================

export const users = {
    // Get user profile
    getProfile: async (userId) => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single()
        return { data, error }
    },

    // Update user profile
    updateProfile: async (userId, updates) => {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single()
        return { data, error }
    },

    // Get all users (admin only)
    getAllUsers: async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false })
        return { data, error }
    }
}

// =====================================================
// STUDENT OPERATIONS
// =====================================================

export const students = {
    // Get student profile
    getStudent: async (studentId) => {
        const { data, error } = await supabase
            .from('students')
            .select(`
        *,
        user:users(*),
        program:degree_programs(*)
      `)
            .eq('id', studentId)
            .single()
        return { data, error }
    },

    // Get all students (with optional filters)
    getStudents: async (filters = {}) => {
        let query = supabase
            .from('students')
            .select(`
        *,
        user:users(*),
        program:degree_programs(*)
      `)
            .order('created_at', { ascending: false })

        if (filters.programId) {
            query = query.eq('program_id', filters.programId)
        }
        if (filters.yearLevel) {
            query = query.eq('year_level', filters.yearLevel)
        }

        const { data, error } = await query
        return { data, error }
    },

    // Update student
    updateStudent: async (studentId, updates) => {
        const { data, error } = await supabase
            .from('students')
            .update(updates)
            .eq('id', studentId)
            .select()
            .single()
        return { data, error }
    },

    // Get student dashboard stats
    getStudentStats: async (studentId) => {
        const { data, error } = await supabase
            .rpc('get_student_dashboard_stats', { p_student_id: studentId })
        return { data, error }
    },

    // Calculate student GPA
    calculateGPA: async (studentId) => {
        const { data, error } = await supabase
            .rpc('calculate_student_gpa', { p_student_id: studentId })
        return { data, error }
    }
}

// =====================================================
// FACULTY OPERATIONS
// =====================================================

export const faculty = {
    // Get faculty profile
    getFaculty: async (facultyId) => {
        const { data, error } = await supabase
            .from('faculty')
            .select(`
        *,
        user:users(*)
      `)
            .eq('id', facultyId)
            .single()
        return { data, error }
    },

    // Get all faculty
    getFacultyList: async () => {
        const { data, error } = await supabase
            .from('faculty')
            .select(`
        *,
        user:users(*)
      `)
            .order('user.last_name', { ascending: true })
        return { data, error }
    },

    // Update faculty
    updateFaculty: async (facultyId, updates) => {
        const { data, error } = await supabase
            .from('faculty')
            .update(updates)
            .eq('id', facultyId)
            .select()
            .single()
        return { data, error }
    }
}

// =====================================================
// DEGREE PROGRAM OPERATIONS
// =====================================================

export const degreePrograms = {
    // Get all degree programs
    getPrograms: async () => {
        const { data, error } = await supabase
            .from('degree_programs')
            .select('*')
            .eq('is_active', true)
            .order('name', { ascending: true })
        return { data, error }
    },

    // Get single program
    getProgram: async (programId) => {
        const { data, error } = await supabase
            .from('degree_programs')
            .select('*')
            .eq('id', programId)
            .single()
        return { data, error }
    },

    // Create program (admin only)
    createProgram: async (programData) => {
        const { data, error } = await supabase
            .from('degree_programs')
            .insert(programData)
            .select()
            .single()
        return { data, error }
    },

    // Update program (admin only)
    updateProgram: async (programId, updates) => {
        const { data, error } = await supabase
            .from('degree_programs')
            .update(updates)
            .eq('id', programId)
            .select()
            .single()
        return { data, error }
    }
}

// =====================================================
// COURSE OPERATIONS
// =====================================================

export const courses = {
    // Get all courses
    getCourses: async () => {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('is_active', true)
            .order('code', { ascending: true })
        return { data, error }
    },

    // Get single course
    getCourse: async (courseId) => {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single()
        return { data, error }
    },

    // Create course (admin only)
    createCourse: async (courseData) => {
        const { data, error } = await supabase
            .from('courses')
            .insert(courseData)
            .select()
            .single()
        return { data, error }
    },

    // Update course (admin only)
    updateCourse: async (courseId, updates) => {
        const { data, error } = await supabase
            .from('courses')
            .update(updates)
            .eq('id', courseId)
            .select()
            .single()
        return { data, error }
    }
}

// =====================================================
// ENROLLMENT OPERATIONS
// =====================================================

export const enrollments = {
    // Get student enrollments
    getStudentEnrollments: async (studentId, termId = null) => {
        let query = supabase
            .from('enrollments')
            .select(`
        *,
        section:course_sections(
          *,
          course:courses(*),
          term:academic_terms(*),
          faculty:faculty(
            *,
            user:users(*)
          )
        )
      `)
            .eq('student_id', studentId)

        if (termId) {
            query = query.eq('section.term_id', termId)
        }

        const { data, error } = await query
        return { data, error }
    },

    // Enroll student in course section
    enrollStudent: async (studentId, sectionId) => {
        const { data, error } = await supabase
            .from('enrollments')
            .insert({
                student_id: studentId,
                section_id: sectionId,
                status: 'enrolled'
            })
            .select()
            .single()
        return { data, error }
    },

    // Update enrollment (grade, status, etc.)
    updateEnrollment: async (enrollmentId, updates) => {
        const { data, error } = await supabase
            .from('enrollments')
            .update(updates)
            .eq('id', enrollmentId)
            .select()
            .single()
        return { data, error }
    }
}

// =====================================================
// ANNOUNCEMENTS OPERATIONS
// =====================================================

export const announcements = {
    // Get all active announcements
    getAnnouncements: async (targetAudience = null) => {
        let query = supabase
            .from('announcements')
            .select(`
        *,
        publisher:users(*)
      `)
            .eq('is_active', true)
            .order('published_at', { ascending: false })

        if (targetAudience) {
            query = query.or(`target_audience.eq.all,target_audience.eq.${targetAudience}`)
        }

        const { data, error } = await query
        return { data, error }
    },

    // Create announcement (admin only)
    createAnnouncement: async (announcementData) => {
        const { data, error } = await supabase
            .from('announcements')
            .insert(announcementData)
            .select()
            .single()
        return { data, error }
    },

    // Update announcement
    updateAnnouncement: async (announcementId, updates) => {
        const { data, error } = await supabase
            .from('announcements')
            .update(updates)
            .eq('id', announcementId)
            .select()
            .single()
        return { data, error }
    },

    // Delete announcement
    deleteAnnouncement: async (announcementId) => {
        const { data, error } = await supabase
            .from('announcements')
            .update({ is_active: false })
            .eq('id', announcementId)
        return { data, error }
    }
}

// =====================================================
// CALENDAR EVENTS OPERATIONS
// =====================================================

export const calendarEvents = {
    // Get calendar events
    getEvents: async (startDate = null, endDate = null) => {
        let query = supabase
            .from('calendar_events')
            .select('*')
            .order('start_date', { ascending: true })

        if (startDate) {
            query = query.gte('start_date', startDate)
        }
        if (endDate) {
            query = query.lte('end_date', endDate)
        }

        const { data, error } = await query
        return { data, error }
    },

    // Create event (admin only)
    createEvent: async (eventData) => {
        const { data, error } = await supabase
            .from('calendar_events')
            .insert(eventData)
            .select()
            .single()
        return { data, error }
    },

    // Update event
    updateEvent: async (eventId, updates) => {
        const { data, error } = await supabase
            .from('calendar_events')
            .update(updates)
            .eq('id', eventId)
            .select()
            .single()
        return { data, error }
    },

    // Delete event
    deleteEvent: async (eventId) => {
        const { data, error } = await supabase
            .from('calendar_events')
            .delete()
            .eq('id', eventId)
        return { data, error }
    }
}

// =====================================================
// COURSE SECTIONS OPERATIONS
// =====================================================

export const courseSections = {
    // Get course sections for a term
    getSections: async (termId = null) => {
        let query = supabase
            .from('course_sections')
            .select(`
        *,
        course:courses(*),
        term:academic_terms(*),
        faculty:faculty(
          *,
          user:users(*)
        )
      `)
            .order('course.code', { ascending: true })

        if (termId) {
            query = query.eq('term_id', termId)
        }

        const { data, error } = await query
        return { data, error }
    },

    // Create course section (admin only)
    createSection: async (sectionData) => {
        const { data, error } = await supabase
            .from('course_sections')
            .insert(sectionData)
            .select()
            .single()
        return { data, error }
    }
}

// =====================================================
// ACADEMIC TERMS OPERATIONS
// =====================================================

export const academicTerms = {
    // Get all terms
    getTerms: async () => {
        const { data, error } = await supabase
            .from('academic_terms')
            .select('*')
            .order('year', { ascending: false })
            .order('semester', { ascending: false })
        return { data, error }
    },

    // Get current term
    getCurrentTerm: async () => {
        const { data, error } = await supabase
            .from('academic_terms')
            .select('*')
            .eq('is_current', true)
            .single()
        return { data, error }
    }
}

export default supabase
