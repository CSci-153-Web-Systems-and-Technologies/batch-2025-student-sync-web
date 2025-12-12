import React from 'react'
import { useAuth } from '../hooks/useSupabase'

export default function AuthGuard({ children }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div style={{ padding: 24, textAlign: 'center' }}>Loading...</div>
        )
    }

    if (!user) {
        return (
            <div style={{ padding: 24, textAlign: 'center' }}>
                You must be signed in to view this page.
            </div>
        )
    }

    return <>{children}</>
}
