import { useState, useEffect } from 'react'
import { auth, supabase } from '../supabase'

export function useAuth() {
    const [user, setUser] = useState(null)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        const init = async () => {
            // If the app was redirected back from an OAuth provider,
            // ensure Supabase processes the URL and stores the session.
            try {
                if (typeof supabase?.auth?.getSessionFromUrl === 'function') {
                    await supabase.auth.getSessionFromUrl({ storeSession: true })
                }
            } catch (e) {
                // ignore; we'll still attempt to read session below
                console.warn('getSessionFromUrl error', e)
            }

            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (!mounted) return
                setSession(session)
                setUser(session?.user ?? null)
                setLoading(false)
            } catch (e) {
                if (!mounted) return
                setSession(null)
                setUser(null)
                setLoading(false)
            }
        }

        init()

        // Listen for auth changes
        const { data } = auth.onAuthStateChange((_event, session) => {
            if (!mounted) return
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => {
            mounted = false
            try { data?.subscription?.unsubscribe() } catch (e) { }
        }
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
