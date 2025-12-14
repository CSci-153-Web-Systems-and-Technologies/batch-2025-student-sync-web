import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

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
