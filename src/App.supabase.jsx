import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './components/useAuth'
import StudentDashboardWithSupabase from './StudentDashboard.supabase'
import AdminDashboard from './AdminDashboard'
import FacultyDashboardWithSupabase from './FacultyDashboard.supabase'
import AuthGuard from './components/AuthGuard'
import OAuthButton from './components/OAuthButton'
import ForgotPasswordModal from './components/ForgotPasswordModal'
import './styles.css'

/**
 * Example: App.jsx with Supabase Authentication
 * 
 * This demonstrates how to integrate Supabase authentication with your existing app.
 * Replace your current App.jsx with this file to enable database-backed authentication.
 */

function LoginForm({ onSubmit, loading, onGoogle, onForgot }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(email, password)
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="field">
                <label>Email Address</label>
                <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="field">
                <label>Password</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="primary" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <div style={{ marginTop: 8 }}>
                <button type="button" className="link" onClick={() => onForgot && onForgot()}>
                    Forgot password?
                </button>
            </div>
        </form>
    )
}

function SignupForm({ onSubmit, loading }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'student'
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="field">
                <label>First Name</label>
                <input
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="field">
                <label>Last Name</label>
                <input
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="field">
                <label>Email Address</label>
                <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="field">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                />
            </div>
            <div className="field">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Administrator</option>
                </select>
            </div>
            <div className="agree">
                <input type="checkbox" required />
                <span>I agree to the Terms and Conditions</span>
            </div>
            <button type="submit" className="primary" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
            </button>
        </form>
    )
}

function AppWithSupabase({ initialTab = 'signin' }) {
    const navigate = useNavigate()
    const [tab, setTab] = useState(initialTab)
    const { user, loading, signIn, signUp, signOut, signInWithProvider, sendPasswordReset } = useAuth()
    const [forgotOpen, setForgotOpen] = useState(false)
    const [forgotLoading, setForgotLoading] = useState(false)
    const [authLoading, setAuthLoading] = useState(false)
    const [error, setError] = useState(null)
    const [userRole, setUserRole] = useState(null)
    const [signupOpen, setSignupOpen] = useState(false)

    // Fetch user role from database
    React.useEffect(() => {
        if (user) {
            // Fetch user profile to get role. If missing (OAuth first-time sign-in),
            // upsert a profile using auth user metadata so the app can route immediately.
            import('./supabase').then(({ users, supabase }) => {
                users.getProfile(user.id).then(async ({ data, error }) => {
                    if (data) {
                        setUserRole(data.role)
                        return
                    }

                    // No profile found: build a profile from auth user info / metadata
                    const meta = user.user_metadata || {}
                    const metaRole = (meta && (meta.role || meta.user_role))
                    const role = metaRole ? String(metaRole).toLowerCase() : 'student'

                    const profile = {
                        id: user.id,
                        email: user.email || '',
                        first_name: meta.first_name || meta.full_name || '',
                        last_name: meta.last_name || '',
                        role: role,
                        status: 'active'
                    }

                    try {
                        const { error: upsertErr } = await supabase.from('users').upsert(profile, { onConflict: ['id'] })
                        if (upsertErr) console.warn('Profile upsert failed:', upsertErr)
                    } catch (e) {
                        console.error('Error upserting profile:', e)
                    }

                    setUserRole(role)
                })
            })
        }
    }, [user])

    // Redirect to role-specific dashboard when authenticated
    React.useEffect(() => {
        if (user && userRole) {
            if (userRole === 'admin') navigate('/admin', { replace: true })
            else if (userRole === 'student') navigate('/student', { replace: true })
            else if (userRole === 'faculty') navigate('/faculty', { replace: true })
        }
    }, [user, userRole, navigate])

    const handleSignIn = async (email, password) => {
        setAuthLoading(true)
        setError(null)

        const { error } = await signIn(email, password)

        if (error) {
            setError(error.message)
            console.error('Sign in error:', error)
        }

        setAuthLoading(false)
    }

    const handleGoogleSignIn = async () => {
        setAuthLoading(true)
        setError(null)
        try {
            const redirectTo = window.location.origin + '/signin'
            const { data, error } = await signInWithProvider('google', redirectTo)
            if (error) {
                setError(error.message)
                setAuthLoading(false)
            }
            // For OAuth, Supabase usually redirects the browser.
        } catch (e) {
            setError(e.message || String(e))
            setAuthLoading(false)
        }
    }

    const handleForgotPassword = async (email) => {
        if (!email) return
        setForgotLoading(true)
        const { data, error } = await sendPasswordReset(email, { redirectTo: window.location.origin })
        if (error) {
            alert('Error sending reset: ' + error.message)
        } else {
            alert('If that email exists, a password reset link has been sent.')
            setForgotOpen(false)
        }
        setForgotLoading(false)
    }

    const handleSignUp = async (formData) => {
        setAuthLoading(true)
        setError(null)

        const { data, error } = await signUp(formData.email, formData.password, {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role
        })

        if (error) {
            setError(error.message)
            console.error('Sign up error:', error)
        } else {
            // After successful signup, you may need to create additional records
            // in students or faculty tables depending on the role
            alert('Account created! Please check your email to verify your account.')
            setTab('signin')
        }

        setAuthLoading(false)
    }

    const handleLogout = async () => {
        await signOut()
        setUserRole(null)
    }

    // Show loading spinner while checking auth state
    if (loading) {
        return (
            <div className="page">
                <div className="card">
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <h2>Loading...</h2>
                    </div>
                </div>
            </div>
        )
    }

    // If user is authenticated, show dashboard based on role
    if (user && userRole) {
        if (userRole === 'admin') {
            return (
                <AuthGuard>
                    <AdminDashboard onLogout={handleLogout} />
                </AuthGuard>
            )
        } else if (userRole === 'student') {
            return (
                <AuthGuard>
                    <StudentDashboardWithSupabase onLogout={handleLogout} />
                </AuthGuard>
            )
        } else if (userRole === 'faculty') {
            return (
                <AuthGuard>
                    <FacultyDashboardWithSupabase onLogout={handleLogout} />
                </AuthGuard>
            )
        }
    }

    // Show login/signup forms or landing if not authenticated
    return (
        <div className="page">
            <div className="card">
                <div className="brand">
                    <div className="logo">SS</div>
                    <h1 className="title">Student Sync</h1>
                    <p className="subtitle">Your Academic Portal</p>
                </div>

                {tab === 'landing' ? (
                    <div className="landing">
                        <div className="landing-hero">
                            <div className="hero-text">
                                <h2>Make academic life easier</h2>
                                <p className="muted">Student Sync centralizes registration, announcements, and academic records — fast and secure.</p>
                                <div className="landing-cta">
                                    <button className="primary" onClick={() => { navigate('/signin'); setError(null) }}>Sign In</button>
                                    <button className="secondary" onClick={() => { navigate('/signup'); setError(null) }}>Create Account</button>
                                </div>
                                <div style={{ marginTop: 12 }}>
                                    <OAuthButton onClick={handleGoogleSignIn}>Continue with Google</OAuthButton>
                                </div>
                            </div>
                            <div className="hero-visual">
                                <div className="card-visual">
                                    <svg width="220" height="140" viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="6" y="6" width="208" height="128" rx="12" fill="#f8fafc" stroke="#eef2f6" />
                                        <circle cx="44" cy="44" r="18" fill="#0b1320" opacity="0.9" />
                                        <rect x="78" y="28" width="112" height="20" rx="6" fill="#eaf0ff" />
                                        <rect x="78" y="56" width="88" height="16" rx="6" fill="#f3f6fb" />
                                        <rect x="78" y="80" width="64" height="12" rx="6" fill="#f3f6fb" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="landing-features">
                            <div className="feature-item">
                                <h4>📚 Centralized Records</h4>
                                <p className="muted">All student and course data in one place.</p>
                            </div>
                            <div className="feature-item">
                                <h4>🔔 Announcements</h4>
                                <p className="muted">Broadcast messages to students and faculty instantly.</p>
                            </div>
                            <div className="feature-item">
                                <h4>⚙️ Admin Tools</h4>
                                <p className="muted">Manage programs, courses, and academic events.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="tabs">
                            <button
                                className={tab === 'signin' ? 'active' : ''}
                                onClick={() => {
                                    setTab('signin')
                                    navigate('/signin')
                                    setError(null)
                                }}
                            >
                                Sign In
                            </button>
                            <button
                                className={tab === 'signup' ? 'active' : ''}
                                onClick={() => {
                                    setTab('signup')
                                    navigate('/signup')
                                    setError(null)
                                }}
                            >
                                Sign Up
                            </button>
                        </div>

                        {error && (
                            <div style={{
                                padding: '12px',
                                background: '#fee',
                                border: '1px solid #fcc',
                                borderRadius: '8px',
                                color: '#c00',
                                fontSize: '14px',
                                marginBottom: '16px'
                            }}>
                                {error}
                            </div>
                        )}

                        {tab === 'signin' ? (
                            <>
                                <LoginForm onSubmit={handleSignIn} loading={authLoading} onGoogle={handleGoogleSignIn} onForgot={() => setForgotOpen(true)} />
                                <div style={{ marginTop: 12, textAlign: 'center' }}>
                                    <div className="divider"><span>or</span></div>
                                    <div style={{ marginTop: 10 }}>
                                        <OAuthButton onClick={handleGoogleSignIn}>Continue with Google</OAuthButton>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <SignupForm onSubmit={handleSignUp} loading={authLoading} />
                        )}

                        <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} onSubmit={handleForgotPassword} loading={forgotLoading} />

                        {/* Signup modal shown from landing CTA (keeps user on same page) */}
                        {signupOpen && (
                            <div className="modal-backdrop" onClick={() => setSignupOpen(false)}>
                                <div className="modal" onClick={(e) => e.stopPropagation()}>
                                    <div className="modal-header">
                                        <strong style={{ fontSize: 18 }}>Create Account</strong>
                                        <button className="modal-close" onClick={() => setSignupOpen(false)}>×</button>
                                    </div>
                                    <div className="modal-body">
                                        <SignupForm onSubmit={handleSignUp} loading={authLoading} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <p className="muted" style={{ marginTop: '16px' }}>
                            {tab === 'signin'
                                ? "Don't have an account? Click Sign Up above."
                                : "Already have an account? Click Sign In above."}
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}

export default AppWithSupabase
