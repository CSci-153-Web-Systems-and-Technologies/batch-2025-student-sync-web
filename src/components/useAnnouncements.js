import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

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
