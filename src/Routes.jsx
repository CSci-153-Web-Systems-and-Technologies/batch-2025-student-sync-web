import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppWithSupabase from './App.supabase'
import StudentDashboardWithSupabase from './StudentDashboard.supabase'
import FacultyDashboardWithSupabase from './FacultyDashboard.supabase'
import AdminDashboard from './AdminDashboard'
import StudentOverviewPage from './pages/student/Overview'
import StudentProfilePage from './pages/student/Profile'
import StudentAcademicPage from './pages/student/Academic'
import StudentSettingsPage from './pages/student/Settings'
import FacultyOverviewPage from './pages/faculty/Overview'
import FacultyCoursesPage from './pages/faculty/Courses'
import FacultySchedulePage from './pages/faculty/Schedule'
import FacultyCommunicationsPage from './pages/faculty/Communications'
import FacultySettingsPage from './pages/faculty/Settings'
import AdminProgramsPage from './pages/admin/Programs'
import AdminCoursesPage from './pages/admin/Courses'
import AdminStudentsPage from './pages/admin/Students'
import AdminFacultyPage from './pages/admin/Faculty'
import AdminCommunicationsPage from './pages/admin/Communications'
import AdminAnalyticsPage from './pages/admin/Analytics'
import AdminSettingsPage from './pages/admin/Settings'
import AuthGuard from './components/AuthGuard'
import LandingPage from './components/LandingPage'

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signin" element={<AppWithSupabase initialTab={"signin"} />} />
                <Route path="/signup" element={<AppWithSupabase initialTab={"signup"} />} />
                <Route path="/forgot" element={<AppWithSupabase initialTab={"signin"} />} />
                {/* Student routes */}
                <Route path="/student" element={<Navigate to="/student/overview" replace />} />
                <Route path="/student/overview" element={<AuthGuard><StudentOverviewPage /></AuthGuard>} />
                <Route path="/student/profile" element={<AuthGuard><StudentProfilePage /></AuthGuard>} />
                <Route path="/student/academic" element={<AuthGuard><StudentAcademicPage /></AuthGuard>} />
                <Route path="/student/settings" element={<AuthGuard><StudentSettingsPage /></AuthGuard>} />

                {/* Faculty routes */}
                <Route path="/faculty" element={<Navigate to="/faculty/overview" replace />} />
                <Route path="/faculty/overview" element={<AuthGuard><FacultyOverviewPage /></AuthGuard>} />
                <Route path="/faculty/courses" element={<AuthGuard><FacultyCoursesPage /></AuthGuard>} />
                <Route path="/faculty/schedule" element={<AuthGuard><FacultySchedulePage /></AuthGuard>} />
                <Route path="/faculty/communications" element={<AuthGuard><FacultyCommunicationsPage /></AuthGuard>} />
                <Route path="/faculty/settings" element={<AuthGuard><FacultySettingsPage /></AuthGuard>} />

                {/* Admin routes */}
                <Route path="/admin" element={<Navigate to="/admin/programs" replace />} />
                <Route path="/admin/programs" element={<AuthGuard><AdminProgramsPage /></AuthGuard>} />
                <Route path="/admin/courses" element={<AuthGuard><AdminCoursesPage /></AuthGuard>} />
                <Route path="/admin/students" element={<AuthGuard><AdminStudentsPage /></AuthGuard>} />
                <Route path="/admin/faculty" element={<AuthGuard><AdminFacultyPage /></AuthGuard>} />
                <Route path="/admin/communications" element={<AuthGuard><AdminCommunicationsPage /></AuthGuard>} />
                <Route path="/admin/analytics" element={<AuthGuard><AdminAnalyticsPage /></AuthGuard>} />
                <Route path="/admin/settings" element={<AuthGuard><AdminSettingsPage /></AuthGuard>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}
