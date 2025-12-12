import React, { useState } from 'react'
import { useAuth } from './hooks/useSupabase'
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

function AppWithSupabase() {
    const [tab, setTab] = useState('landing')
    const { user, loading, signIn, signUp, signOut, signInWithProvider, sendPasswordReset } = useAuth()
    const [forgotOpen, setForgotOpen] = useState(false)
    const [forgotLoading, setForgotLoading] = useState(false)
    const [authLoading, setAuthLoading] = useState(false)
    const [error, setError] = useState(null)
    const [userRole, setUserRole] = useState(null)

    // Fetch user role from database
    React.useEffect(() => {
        if (user) {
            // Fetch user profile to get role
            import('./supabase').then(({ users }) => {
                users.getProfile(user.id).then(({ data, error }) => {
                    if (data) {
                        setUserRole(data.role)
                    }
                })
            })
        }
    }, [user])

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
            const { data, error } = await signInWithProvider('google')
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

    // Show landing page (split) when tab is 'landing', otherwise show the auth card
    if (tab === 'landing') {
        return (
            <div className="landing-page">
                <div className="landing-left">
                    <div className="landing-left-inner">
                        <div className="landing-logo">SS</div>
                        <h1 className="landing-title">Student Sync</h1>
                        <p className="landing-tagline">Centralized academic records, registration, and communications</p>
                    </div>
                </div>

                <div className="auth-card">
                    <div className="auth-card-inner">
                        <h2 className="welcome">Welcome Back</h2>
                        <p className="muted" style={{ marginBottom: 18 }}>Sign in to access and manage your portal</p>
                        <LoginForm onSubmit={handleSignIn} loading={authLoading} onGoogle={handleGoogleSignIn} onForgot={() => setForgotOpen(true)} />
                        <div style={{ marginTop: 12, textAlign: 'center' }}>
                            <div className="divider"><span>or</span></div>
                            <div style={{ marginTop: 10 }}>
                                <OAuthButton onClick={handleGoogleSignIn}>Continue with Google</OAuthButton>
                            </div>
                        </div>
                        <p className="muted" style={{ marginTop: 12 }}>
                            Don't have account? <button className="link" onClick={() => { setTab('signup'); setError(null) }}>Sign up</button>
                        </p>
                        <p className="muted" style={{ marginTop: 6 }}>
                            <button className="link" onClick={() => setForgotOpen(true)}>Forgot your password?</button>
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="page">
            <div className="card">
                <div className="brand">
                    <div className="logo">SS</div>
                    <h1 className="title">Student Sync</h1>
                    <p className="subtitle">Your Academic Portal</p>
                </div>

                <div className="tabs">
                    <button
                        className={tab === 'signin' ? 'active' : ''}
                        onClick={() => {
                            setTab('signin')
                            setError(null)
                        }}
                    >
                        Sign In
                    </button>
                    <button
                        className={tab === 'signup' ? 'active' : ''}
                        onClick={() => {
                            setTab('signup')
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

                <p className="muted" style={{ marginTop: '16px' }}>
                    {tab === 'signin'
                        ? "Don't have an account? Click Sign Up above."
                        : "Already have an account? Click Sign In above."}
                </p>
            </div>
        </div>
    )
}

export default AppWithSupabase
