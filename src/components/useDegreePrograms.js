import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

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
