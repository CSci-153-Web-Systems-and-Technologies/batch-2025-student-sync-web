/**
 * Supabase API Utilities
 * Helper functions for common operations
 */

import { supabase } from './supabase'

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(bucket, path, file) {
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false
        })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)

    return { data, publicUrl }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(bucket, path) {
    const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

    if (error) throw error
}

/**
 * Generate QR code data for student ID
 */
export function generateQRData(student) {
    return JSON.stringify({
        studentId: student.student_id,
        name: `${student.user.first_name} ${student.user.last_name}`,
        program: student.program.code,
        validUntil: student.expected_graduation_date
    })
}

/**
 * Calculate grade point from letter grade
 */
export function letterGradeToGPA(letterGrade) {
    const gradeMap = {
        'A': 4.0,
        'A-': 3.7,
        'B+': 3.3,
        'B': 3.0,
        'B-': 2.7,
        'C+': 2.3,
        'C': 2.0,
        'C-': 1.7,
        'D': 1.0,
        'F': 0.0
    }
    return gradeMap[letterGrade] || 0.0
}

/**
 * Calculate letter grade from GPA
 */
export function gpaToLetterGrade(gpa) {
    if (gpa >= 3.7) return 'A'
    if (gpa >= 3.3) return 'A-'
    if (gpa >= 3.0) return 'B+'
    if (gpa >= 2.7) return 'B'
    if (gpa >= 2.3) return 'B-'
    if (gpa >= 2.0) return 'C+'
    if (gpa >= 1.7) return 'C'
    if (gpa >= 1.0) return 'C-'
    if (gpa >= 0.7) return 'D'
    return 'F'
}

/**
 * Format date for display
 */
export function formatDate(dateString, format = 'short') {
    if (!dateString) return 'N/A'

    const date = new Date(dateString)

    if (format === 'short') {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    if (format === 'long') {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return date.toLocaleDateString()
}

/**
 * Get current academic term
 */
export async function getCurrentTerm() {
    const { data, error } = await supabase
        .from('academic_terms')
        .select('*')
        .eq('is_current', true)
        .single()

    if (error) {
        console.error('Error fetching current term:', error)
        return null
    }

    return data
}

/**
 * Check if student can enroll in a course section
 */
export async function canEnrollInSection(studentId, sectionId) {
    // Check if section has capacity
    const { data: section } = await supabase
        .from('course_sections')
        .select('enrolled_count, max_capacity')
        .eq('id', sectionId)
        .single()

    if (!section || section.enrolled_count >= section.max_capacity) {
        return { canEnroll: false, reason: 'Section is full' }
    }

    // Check if already enrolled
    const { data: existing } = await supabase
        .from('enrollments')
        .select('id')
        .eq('student_id', studentId)
        .eq('section_id', sectionId)
        .single()

    if (existing) {
        return { canEnroll: false, reason: 'Already enrolled in this section' }
    }

    return { canEnroll: true }
}

/**
 * Get student statistics for admin dashboard
 */
export async function getAdminStats() {
    // Total students
    const { count: totalStudents } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })

    // Active students
    const { count: activeStudents } = await supabase
        .from('students')
        .select('*, user:users!inner(*)', { count: 'exact', head: true })
        .eq('user.status', 'active')

    // Graduated students
    const { count: graduates } = await supabase
        .from('students')
        .select('*, user:users!inner(*)', { count: 'exact', head: true })
        .eq('user.status', 'graduated')

    // Average GPA
    const { data: gpaData } = await supabase
        .from('students')
        .select('gpa')

    const avgGPA = gpaData && gpaData.length > 0
        ? (gpaData.reduce((sum, s) => sum + (s.gpa || 0), 0) / gpaData.length).toFixed(2)
        : '0.00'

    return {
        totalStudents: totalStudents || 0,
        activeStudents: activeStudents || 0,
        graduates: graduates || 0,
        avgGPA
    }
}

/**
 * Search students by name or ID
 */
export async function searchStudents(query) {
    const { data, error } = await supabase
        .from('students')
        .select(`
      *,
      user:users(*),
      program:degree_programs(*)
    `)
        .or(`student_id.ilike.%${query}%,user.first_name.ilike.%${query}%,user.last_name.ilike.%${query}%`)
        .limit(20)

    if (error) {
        console.error('Search error:', error)
        return []
    }

    return data || []
}

/**
 * Export students data to CSV
 */
export function exportToCSV(data, filename) {
    if (!data || data.length === 0) return

    const headers = Object.keys(data[0])
    const csv = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header =>
                JSON.stringify(row[header] || '')
            ).join(',')
        )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    window.URL.revokeObjectURL(url)
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Generate student ID (format: YY-S-NNNNN)
 */
export function generateStudentId(year, semester, sequence) {
    const yy = year.toString().slice(-2)
    return `${yy}-${semester}-${sequence.toString().padStart(5, '0')}`
}

/**
 * Check user permission
 */
export async function checkPermission(userId, requiredRole) {
    const { data: user } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

    if (!user) return false

    const roleHierarchy = {
        'admin': 3,
        'faculty': 2,
        'student': 1
    }

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
}

/**
 * Log user activity
 */
export async function logActivity(studentId, activityType, activityData = {}) {
    const { error } = await supabase
        .from('student_activities')
        .insert({
            student_id: studentId,
            activity_type: activityType,
            activity_data: activityData,
            ip_address: null, // Will be captured by Supabase
            user_agent: navigator.userAgent
        })

    if (error) {
        console.error('Error logging activity:', error)
    }
}

/**
 * Batch update students
 */
export async function batchUpdateStudents(updates) {
    const results = []

    for (const update of updates) {
        const { data, error } = await supabase
            .from('students')
            .update(update.data)
            .eq('id', update.id)
            .select()
            .single()

        results.push({ id: update.id, success: !error, data, error })
    }

    return results
}

/**
 * Get enrollment statistics for a course section
 */
export async function getSectionStats(sectionId) {
    const { data: enrollments } = await supabase
        .from('enrollments')
        .select('grade, status')
        .eq('section_id', sectionId)

    if (!enrollments) return null

    const completed = enrollments.filter(e => e.status === 'completed')
    const avgGrade = completed.length > 0
        ? (completed.reduce((sum, e) => sum + (e.grade || 0), 0) / completed.length).toFixed(2)
        : '0.00'

    return {
        totalEnrolled: enrollments.length,
        completed: completed.length,
        inProgress: enrollments.filter(e => e.status === 'enrolled').length,
        dropped: enrollments.filter(e => e.status === 'dropped').length,
        avgGrade
    }
}
