import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../components/useAuth'
import FacultyDashboardWithSupabase from '../../FacultyDashboard.supabase'

export default function FacultyCommunicationsPage() {
    const { signOut } = useAuth()
    const navigate = useNavigate()
    const handleLogout = async () => { await signOut(); navigate('/') }
    return <FacultyDashboardWithSupabase initialTab={"Communications"} onLogout={handleLogout} />
}
