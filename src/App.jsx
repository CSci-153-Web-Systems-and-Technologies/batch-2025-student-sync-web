import React, { useState } from 'react'
import StudentDashboard from './StudentDashboard'
import AdminDashboard from './AdminDashboard'
import AppWithSupabase from './App.supabase'

function Field({ label, placeholder, type = 'text', value, onChange }) {
    return (
        <div className="field">
            <label>{label}</label>
            <input type={type} placeholder={placeholder} value={value} onChange={onChange} />
        </div>
    )
}

export default function App() {
    const [tab, setTab] = useState('login')
    const [signedIn, setSignedIn] = useState(false)
    const [userRole, setUserRole] = useState('Student')
    const [loginRole, setLoginRole] = useState('Student')

    if (signedIn) {
        return (
            <div className="page">
                {userRole === 'Admin' ? (
                    <AdminDashboard onLogout={() => setSignedIn(false)} />
                ) : (
                    <StudentDashboard onLogout={() => setSignedIn(false)} />
                )}
            </div>
        )
    }

    return (
        <AppWithSupabase />
    )
}
