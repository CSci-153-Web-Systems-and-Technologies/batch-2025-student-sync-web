import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

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
