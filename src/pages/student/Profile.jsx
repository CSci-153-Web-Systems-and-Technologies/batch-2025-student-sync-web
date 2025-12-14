import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../components/useAuth'
import StudentDashboardWithSupabase from '../../StudentDashboard.supabase'

export default function StudentProfilePage() {
    const { signOut } = useAuth()
    const navigate = useNavigate()
    const handleLogout = async () => { await signOut(); navigate('/') }
    return <StudentDashboardWithSupabase initialTab={"Profile Management"} onLogout={handleLogout} />
}
