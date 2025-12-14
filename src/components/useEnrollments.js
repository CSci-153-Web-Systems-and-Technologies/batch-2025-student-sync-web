import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

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

        // Subscribe to enrollment changes for this student
        const channel = supabase
            .channel('enrollments-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'enrollments',
                    filter: `student_id=eq.${studentId}`
                },
                (payload) => {
                    // Adjust local state based on event
                    if (payload.eventType === 'INSERT') {
                        setEnrollments(prev => [payload.new, ...prev])
                    } else if (payload.eventType === 'UPDATE') {
                        setEnrollments(prev => prev.map(item => item.id === payload.new.id ? payload.new : item))
                    } else if (payload.eventType === 'DELETE') {
                        setEnrollments(prev => prev.filter(item => item.id !== payload.old.id))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [studentId])

    return { enrollments, loading, error }
}
