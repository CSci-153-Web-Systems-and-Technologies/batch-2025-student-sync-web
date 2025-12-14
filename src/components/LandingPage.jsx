import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'
// OAuth is handled on the /signin page; Landing just routes there

function Field({ label, placeholder, type = 'text', value, onChange }) {
    return (
        <div className="field">
            <label>{label}</label>
            <input type={type} placeholder={placeholder} value={value} onChange={onChange} />
        </div>
    )
}

export default function LandingPage({ onAuth }) {
    const [tab, setTab] = useState('login')
    const [loginRole, setLoginRole] = useState('Student')
    const navigate = useNavigate()
    

    const handleSubmit = (e) => {
        e.preventDefault()
        if (typeof onAuth === 'function') onAuth(loginRole)
        // navigate to the appropriate auth route after submit
        if (tab === 'login') navigate('/signin')
        else navigate('/signup')
    }

    const handleGoogle = () => {
        navigate('/signin')
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
                    <button className={tab === 'login' ? 'active' : ''} onClick={() => { setTab('login'); navigate('/signin') }}>Login</button>
                    <button className={tab === 'signup' ? 'active' : ''} onClick={() => { setTab('signup'); navigate('/signup') }}>Sign up</button>
                </div>

                {tab === 'login' ? (
                    <form className="form" onSubmit={handleSubmit}>
                        <Field label="Username" placeholder="Enter your username" />
                        <Field label="Password" placeholder="Enter your password" type="password" />
                        <div className="field">
                            <label>Login as</label>
                            <select value={loginRole} onChange={(e) => setLoginRole(e.target.value)}>
                                <option>Student</option>
                                <option>Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="primary">Sign in</button>
                        <div className="muted"><button type="button" className="link" onClick={() => navigate('/forgot')}>Forgot your password?</button></div>
                        <div className="divider"><span>or</span></div>
                        <button type="button" className="alt" onClick={handleGoogle}>Continue with Google</button>
                        <label className="agree"><input type="checkbox" /> By continuing, you agree to our Terms of Service and Privacy Policy.</label>
                    </form>
                ) : (
                    <form className="form" onSubmit={handleSubmit}>
                        <Field label="Username" placeholder="Choose a username" />
                        <Field label="Email" placeholder="Enter your email" type="email" />
                        <Field label="Password" placeholder="Create a password" type="password" />
                        <Field label="Confirm password" placeholder="Confirm your password" type="password" />
                        <div className="field">
                            <label>Login as</label>
                            <select value={loginRole} onChange={(e) => setLoginRole(e.target.value)}>
                                <option>Student</option>
                                <option>Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="primary">Sign up</button>
                        <div className="divider"><span>or</span></div>
                        <button type="button" className="alt" onClick={handleGoogle}>Continue with Google</button>
                        <label className="agree"><input type="checkbox" /> By continuing, you agree to our Terms of Service and Privacy Policy.</label>
                    </form>
                )}
            </div>
        </div>
    )
}
