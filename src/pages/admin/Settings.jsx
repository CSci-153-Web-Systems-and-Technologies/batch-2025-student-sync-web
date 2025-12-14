import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../components/useAuth'
import AdminDashboard from '../../AdminDashboard'

export default function AdminSettingsPage() {
    const { signOut } = useAuth()
    const navigate = useNavigate()
    const handleLogout = async () => { await signOut(); navigate('/') }
    return <AdminDashboard initialTab={"Settings"} onLogout={handleLogout} />
}
