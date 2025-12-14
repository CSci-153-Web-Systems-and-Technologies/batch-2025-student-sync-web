import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

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
