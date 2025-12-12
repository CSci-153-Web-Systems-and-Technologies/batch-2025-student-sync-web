import { useState, useEffect } from 'react'
import { supabase, auth } from '../supabase'

/**
 * Hook to manage authentication state
 */
export function useAuth() {
    const [user, setUser] = useState(null)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        auth.getSession().then(({ session }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    return {
        user,
        session,
        loading,
        signIn: auth.signIn,
        signUp: auth.signUp,
        signOut: auth.signOut,
        signInWithProvider: auth.signInWithProvider,
        sendPasswordReset: auth.sendPasswordReset
    }
}

/**
 * Hook to fetch and manage user profile
 */
export function useUserProfile(userId) {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }

        const fetchProfile = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                setError(error)
            } else {
                setProfile(data)
            }
            setLoading(false)
        }

        fetchProfile()
    }, [userId])

    return { profile, loading, error }
}

/**
 * Hook to fetch student data
 */
export function useStudent(studentId) {
    const [student, setStudent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!studentId) {
            setLoading(false)
            return
        }

        const fetchStudent = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('students')
                .select(`
          *,
          user:users(*),
          program:degree_programs(*)
        `)
                .eq('id', studentId)
                .single()

            if (error) {
                setError(error)
            } else {
                setStudent(data)
            }
            setLoading(false)
        }

        fetchStudent()

        // Subscribe to changes
        const channel = supabase
            .channel('student-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'students',
                    filter: `id=eq.${studentId}`
                },
                (payload) => {
                    if (payload.new) {
                        setStudent(prev => ({ ...prev, ...payload.new }))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [studentId])

    return { student, loading, error, refetch: () => setStudent(null) }
}

/**
 * Hook to fetch degree programs
 */
export function useDegreePrograms() {
    const [programs, setPrograms] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPrograms = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('degree_programs')
                .select('*')
                .eq('is_active', true)
                .order('name', { ascending: true })

            if (error) {
                setError(error)
            } else {
                setPrograms(data || [])
            }
            setLoading(false)
        }

        fetchPrograms()
    }, [])

    return { programs, loading, error }
}

/**
 * Hook to fetch courses
 */
export function useCourses() {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('is_active', true)
                .order('code', { ascending: true })

            if (error) {
                setError(error)
            } else {
                setCourses(data || [])
            }
            setLoading(false)
        }

        fetchCourses()
    }, [])

    return { courses, loading, error }
}

/**
 * Hook to fetch student enrollments
 */
export function useEnrollments(studentId) {
    const [enrollments, setEnrollments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!studentId) {
            setLoading(false)
            return
        }

        const fetchEnrollments = async () => {
            setLoading(true)
            const { data, error } = await supabase
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
                .order('created_at', { ascending: false })

            if (error) {
                setError(error)
            } else {
                setEnrollments(data || [])
            }
            setLoading(false)
        }

        fetchEnrollments()
    }, [studentId])

    return { enrollments, loading, error }
}

/**
 * Hook to fetch announcements
 */
export function useAnnouncements(targetAudience = null) {
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchAnnouncements = async () => {
            setLoading(true)
            let query = supabase
                .from('announcements')
                .select(`
          *,
          publisher:users(*)
        `)
                .eq('is_active', true)
                .order('published_at', { ascending: false })
                .limit(10)

            if (targetAudience) {
                query = query.or(`target_audience.eq.all,target_audience.eq.${targetAudience}`)
            }

            const { data, error } = await query

            if (error) {
                setError(error)
            } else {
                setAnnouncements(data || [])
            }
            setLoading(false)
        }

        fetchAnnouncements()

        // Subscribe to new announcements
        const channel = supabase
            .channel('announcements-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'announcements'
                },
                (payload) => {
                    if (payload.new && payload.new.is_active) {
                        setAnnouncements(prev => [payload.new, ...prev])
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [targetAudience])

    return { announcements, loading, error }
}

/**
 * Hook to fetch calendar events
 */
export function useCalendarEvents(startDate = null, endDate = null) {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true)
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

            if (error) {
                setError(error)
            } else {
                setEvents(data || [])
            }
            setLoading(false)
        }

        fetchEvents()
    }, [startDate, endDate])

    return { events, loading, error }
}

/**
 * Hook to fetch faculty list
 */
export function useFaculty() {
    const [faculty, setFaculty] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchFaculty = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('faculty')
                .select(`
          *,
          user:users(*)
        `)
                .order('user.last_name', { ascending: true })

            if (error) {
                setError(error)
            } else {
                setFaculty(data || [])
            }
            setLoading(false)
        }

        fetchFaculty()
    }, [])

    return { faculty, loading, error }
}

/**
 * Hook to fetch students list
 */
export function useStudents(filters = {}) {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true)
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

            if (error) {
                setError(error)
            } else {
                setStudents(data || [])
            }
            setLoading(false)
        }

        fetchStudents()
    }, [filters.programId, filters.yearLevel])

    return { students, loading, error }
}

/**
 * Hook to get real-time data subscription
 */
export function useRealtimeSubscription(table, filter = null) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            let query = supabase.from(table).select('*')
            if (filter) {
                query = query.match(filter)
            }
            const { data: initialData } = await query
            setData(initialData || [])
            setLoading(false)
        }

        fetchData()

        // Subscribe to changes
        const channel = supabase
            .channel(`${table}-changes`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: table,
                    ...(filter && { filter: Object.entries(filter).map(([k, v]) => `${k}=eq.${v}`).join(',') })
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setData(prev => [...prev, payload.new])
                    } else if (payload.eventType === 'UPDATE') {
                        setData(prev => prev.map(item => item.id === payload.new.id ? payload.new : item))
                    } else if (payload.eventType === 'DELETE') {
                        setData(prev => prev.filter(item => item.id !== payload.old.id))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [table, JSON.stringify(filter)])

    return { data, loading }
}
