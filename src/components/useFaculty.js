import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export function useFaculty() {
    const [faculty, setFaculty] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchFaculty = async () => {
            setLoading(true)
            // Primary source: faculty table joined with user profile
            const { data, error } = await supabase
                .from('faculty')
                .select(`
          *,
          user:users(*)
        `)
                .order('user.last_name', { ascending: true })

            if (error) {
                setError(error)
            }

            // If faculty table has rows, use them
            if (data && Array.isArray(data) && data.length > 0) {
                setFaculty(data)
                setLoading(false)
                return
            }

            // Fallback: No faculty rows found — query users table for role = 'faculty'
            try {
                const { data: usersData, error: usersErr } = await supabase
                    .from('users')
                    .select('*')
                    .eq('role', 'faculty')
                    .order('last_name', { ascending: true })

                if (usersErr) {
                    // If users query fails, surface error
                    setError(usersErr)
                    setFaculty([])
                } else {
                    // Map users to faculty-like objects so callers can render consistently
                    const fallback = (usersData || []).map(u => ({ id: u.id, user: u, department: u.department || null, title: u.title || null }))
                    setFaculty(fallback)
                }
            } catch (e) {
                setError(e)
                setFaculty([])
            }
            setLoading(false)
        }

        fetchFaculty()
    }, [])

    return { faculty, loading, error }
}
