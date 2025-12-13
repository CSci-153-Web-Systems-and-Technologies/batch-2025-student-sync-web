import { auth } from '../supabase'

// Utility for programmatic checks before performing actions
export async function ensureAuthenticated() {
    const { data, error } = await auth.getUser()
    const user = data?.user
    if (error || !user) {
        throw new Error('Not authenticated')
    }
    return user
}
