import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppWithSupabase from './App.supabase'
import StudentDashboardWithSupabase from './StudentDashboard.supabase'
import FacultyDashboardWithSupabase from './FacultyDashboard.supabase'
import AdminDashboard from './AdminDashboard'
import AuthGuard from './components/AuthGuard'

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AppWithSupabase />} />
                <Route path="/student" element={<AuthGuard><StudentDashboardWithSupabase /></AuthGuard>} />
                <Route path="/faculty" element={<AuthGuard><FacultyDashboardWithSupabase /></AuthGuard>} />
                <Route path="/admin" element={<AuthGuard><AdminDashboard /></AuthGuard>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}
