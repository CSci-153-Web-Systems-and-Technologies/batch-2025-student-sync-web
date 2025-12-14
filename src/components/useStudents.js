import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

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
