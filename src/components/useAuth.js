import { useState, useEffect } from 'react'
import { auth } from '../supabase'

export function useAuth() {
    const [user, setUser] = useState(null)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        auth.getSession().then(({ session }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    return {
        user,
        session,
        loading,
        signIn: auth.signIn,
        signUp: auth.signUp,
        signOut: auth.signOut,
        signInWithProvider: auth.signInWithProvider,
        sendPasswordReset: auth.sendPasswordReset
    }
}
