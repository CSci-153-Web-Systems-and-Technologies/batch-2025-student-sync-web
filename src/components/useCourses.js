import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

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
