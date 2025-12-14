import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../components/useAuth'
import StudentDashboardWithSupabase from '../../StudentDashboard.supabase'

export default function StudentOverviewPage() {
    const { signOut } = useAuth()
    const navigate = useNavigate()
    const handleLogout = async () => { await signOut(); navigate('/') }
    return <StudentDashboardWithSupabase initialTab={"Overview"} onLogout={handleLogout} />
}
