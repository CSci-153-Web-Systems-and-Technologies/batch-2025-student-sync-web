import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

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
