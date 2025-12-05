import React, { useState } from 'react'
import StudentDashboard from './StudentDashboard'

function Field({ label, placeholder, type = 'text' }) {
    return (
        <div className="field">
            <label>{label}</label>
            <input type={type} placeholder={placeholder} />
        </div>
    )
}

export default function App() {
    const [tab, setTab] = useState('login')
    const [signedIn, setSignedIn] = useState(false)

    if (signedIn) {
        return (
            <div className="page">
                <StudentDashboard onLogout={() => setSignedIn(false)} />
            </div>
        )
    }

    return (
        <div className="page">
            <div className="card" role="main">
                <div className="brand">
                    <div className="logo">SI</div>
                    <h2 className="title">Welcome</h2>
                    <div className="subtitle">Student ID & Profile Management</div>
                </div>
                <div className="tabs">
                    <button className={tab === 'login' ? 'active' : ''} onClick={() => setTab('login')}>Login</button>
                    <button className={tab === 'signup' ? 'active' : ''} onClick={() => setTab('signup')}>Sign up</button>
                </div>

                {tab === 'login' ? (
                    <form className="form" onSubmit={(e) => { e.preventDefault(); setSignedIn(true); }}>
                        <Field label="Username" placeholder="Enter your username" />
                        <Field label="Password" placeholder="Enter your password" type="password" />
                        <div className="field">
                            <label>Login as</label>
                            <select>
                                <option>Student</option>
                                <option>Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="primary">Sign in</button>
                        <div className="muted">Forgot your password?</div>
                        <div className="divider"><span>or</span></div>
                        <button type="button" className="alt">Continue with Google</button>
                        <label className="agree"><input type="checkbox" /> By continuing, you agree to our Terms of Service and Privacy Policy.</label>
                    </form>
                ) : (
                    <form className="form" onSubmit={(e) => { e.preventDefault(); setSignedIn(true); }}>
                        <Field label="Username" placeholder="Choose a username" />
                        <Field label="Email" placeholder="Enter your email" type="email" />
                        <Field label="Password" placeholder="Create a password" type="password" />
                        <Field label="Confirm password" placeholder="Confirm your password" type="password" />
                        <div className="field">
                            <label>Login as</label>
                            <select>
                                <option>Student</option>
                                <option>Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="primary">Sign up</button>
                        <div className="divider"><span>or</span></div>
                        <button type="button" className="alt">Continue with Google</button>
                        <label className="agree"><input type="checkbox" /> By continuing, you agree to our Terms of Service and Privacy Policy.</label>
                    </form>
                )}
            </div>
        </div>
    )
}
