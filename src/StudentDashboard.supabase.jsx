import React, { useState, useEffect } from 'react'
import { useAuth, useStudent, useDegreePrograms, useEnrollments } from './hooks/useSupabase'
import { users } from './supabase'
import styles from './StudentDashboard.module.css'

/**
 * Example: StudentDashboard with Supabase Integration
 * 
 * This demonstrates how to integrate Supabase backend with the existing StudentDashboard component.
 * Replace the hardcoded data with real data from Supabase.
 */

function Topbar({ user, onLogout }) {
    return (
        <header className={styles.topbar}>
            <div className={styles.brand}>Student Portal</div>
            <div className={styles.user}>
                Welcome, {user?.first_name || 'Student'}
                <button className={styles.logout} onClick={onLogout}>Logout</button>
            </div>
        </header>
    )
}

function Tabs({ value, onChange }) {
    const tabs = ['Overview', 'Profile Management', 'Academic Info']
    return (
        <div className={styles.tabs} role="tablist">
            {tabs.map(t => (
                <button
                    key={t}
                    className={value === t ? styles.tabActive : styles.tab}
                    onClick={() => onChange(t)}
                >
                    {t}
                </button>
            ))}
        </div>
    )
}

function Overview({ student, enrollments }) {
    // Calculate current semester courses
    const currentCourses = enrollments?.filter(e => e.status === 'enrolled') || []

    return (
        <div className={styles.overviewGrid}>
            <section className={styles.cardLarge}>
                <div className={styles.cardHeader}><span>Student ID Card</span></div>
                <div className={styles.idCard}>
                    <div className={styles.avatar}>
                        {student?.user?.first_name?.charAt(0) || 'S'}
                    </div>
                    <div className={styles.idInfo}>
                        <div className={styles.name}>
                            {student?.user?.first_name} {student?.user?.last_name}
                        </div>
                        <div className={styles.course}>
                            {student?.program?.name || 'Not enrolled'}
                        </div>
                        <div className={styles.idno}>
                            ID no: {student?.student_id || 'N/A'}
                        </div>
                    </div>
                    <div className={styles.qr} aria-hidden>QR</div>
                </div>
            </section>

            <aside className={styles.sideCol}>
                <div className={styles.smallCard}>
                    <div className={styles.cardLabel}>Current GPA</div>
                    <div className={styles.gpa}>{student?.gpa?.toFixed(2) || '0.00'}</div>
                </div>
                <div className={styles.smallCard}>
                    <div className={styles.cardLabel}>Units Completed</div>
                    <div className={styles.cardValue}>
                        {student?.total_credits_earned || 0} units
                    </div>
                </div>
                <div className={styles.smallCard}>
                    <div className={styles.cardLabel}>Current Courses</div>
                    <div className={styles.cardValue}>
                        {currentCourses.length} courses
                    </div>
                </div>
            </aside>
        </div>
    )
}

function ProfileManagement({ user, student, onUpdate }) {
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        emergency_contact_name: student?.emergency_contact_name || '',
        emergency_contact_phone: student?.emergency_contact_phone || ''
    })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (user && student) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                emergency_contact_name: student.emergency_contact_name || '',
                emergency_contact_phone: student.emergency_contact_phone || ''
            })
        }
    }, [user, student])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        setSaving(true)
        try {
            // Update user profile
            await users.updateProfile(user.id, {
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone: formData.phone,
                address: formData.address
            })

            // Update student-specific data
            // Note: You'll need to import students from supabase.js
            // await students.updateStudent(student.id, {
            //     emergency_contact_name: formData.emergency_contact_name,
            //     emergency_contact_phone: formData.emergency_contact_phone
            // })

            alert('Profile updated successfully!')
            onUpdate && onUpdate()
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className={styles.profileCard}>
            <p className={styles.muted}>Manage your profile</p>
            <div className={styles.formRow}>
                <div className={styles.field}>
                    <label>First Name</label>
                    <input
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.field}>
                    <label>Last Name</label>
                    <input
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className={styles.formRow}>
                <div className={styles.field}>
                    <label>Email</label>
                    <input
                        name="email"
                        value={formData.email}
                        disabled
                    />
                </div>
                <div className={styles.field}>
                    <label>Phone</label>
                    <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className={styles.formRow}>
                <div className={styles.field}>
                    <label>Address</label>
                    <input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className={styles.dividerLine} />
            <div className={styles.formRow}>
                <div className={styles.field}>
                    <label>Emergency Contact Name</label>
                    <input
                        name="emergency_contact_name"
                        value={formData.emergency_contact_name}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.field}>
                    <label>Emergency Contact Phone</label>
                    <input
                        name="emergency_contact_phone"
                        value={formData.emergency_contact_phone}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <button
                className={styles.saveBtn}
                onClick={handleSubmit}
                disabled={saving}
            >
                {saving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    )
}

function AcademicInfo({ student, enrollments }) {
    const completedCourses = enrollments?.filter(e => e.status === 'completed') || []
    const currentCourses = enrollments?.filter(e => e.status === 'enrolled') || []

    return (
        <div className={styles.academicGrid}>
            <div className={styles.infoCard}>
                <div className={styles.cardHeader}>Enrollment Details</div>
                <dl className={styles.detailsList}>
                    <dt>Program</dt>
                    <dd>{student?.program?.name || 'N/A'}</dd>
                    <dt>Student ID</dt>
                    <dd>{student?.student_id || 'N/A'}</dd>
                    <dt>Year Level</dt>
                    <dd>Year {student?.year_level || 'N/A'}</dd>
                    <dt>Semester</dt>
                    <dd>{student?.semester || 'N/A'}</dd>
                    <dt>Status</dt>
                    <dd style={{ textTransform: 'capitalize' }}>
                        {student?.user?.status || 'N/A'}
                    </dd>
                </dl>
                <button className={styles.downloadBtn}>Download Certificate</button>
            </div>

            <div className={styles.infoCard}>
                <div className={styles.cardHeader}>Academic Performance</div>
                <dl className={styles.detailsList}>
                    <dt>GPA</dt>
                    <dd>{student?.gpa?.toFixed(2) || '0.00'}</dd>
                    <dt>Credits Earned</dt>
                    <dd>{student?.total_credits_earned || 0} units</dd>
                    <dt>Current Courses</dt>
                    <dd>{currentCourses.length} courses</dd>
                    <dt>Completed</dt>
                    <dd>{completedCourses.length} courses</dd>
                    <dt>Expected Grad</dt>
                    <dd>
                        {student?.expected_graduation_date
                            ? new Date(student.expected_graduation_date).toLocaleDateString()
                            : 'N/A'}
                    </dd>
                </dl>
                <button className={styles.downloadBtn}>Download Transcript</button>
            </div>

            <div className={styles.infoCard}>
                <div className={styles.cardHeader}>QR Code</div>
                <div className={styles.qrLarge}>QR Code</div>
                <p className={styles.muted} style={{ fontSize: '12px', marginTop: '12px' }}>
                    Use this QR code for campus verification
                </p>
                <button className={styles.downloadBtn}>Download QR</button>
            </div>
        </div>
    )
}

function StudentDashboardWithSupabase({ onLogout }) {
    const [activeTab, setActiveTab] = useState('Overview')
    const { user: authUser } = useAuth()
    const { student, loading: studentLoading } = useStudent(authUser?.id)
    const { enrollments, loading: enrollmentsLoading } = useEnrollments(authUser?.id)

    const loading = studentLoading || enrollmentsLoading

    if (loading) {
        return (
            <div className={styles.container}>
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <h2>Loading your dashboard...</h2>
                </div>
            </div>
        )
    }

    if (!student) {
        return (
            <div className={styles.container}>
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <h2>No student profile found</h2>
                    <p>Please contact administration to set up your student account.</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <Topbar user={student?.user} onLogout={onLogout} />
            <main className={styles.main}>
                <h1 className={styles.welcome}>
                    Welcome back, {student?.user?.first_name}!
                </h1>
                <p className={styles.subtitle}>
                    Here's what's happening with your courses today
                </p>
                <Tabs value={activeTab} onChange={setActiveTab} />
                <section className={styles.section}>
                    {activeTab === 'Overview' && (
                        <Overview student={student} enrollments={enrollments} />
                    )}
                    {activeTab === 'Profile Management' && (
                        <ProfileManagement
                            user={student?.user}
                            student={student}
                            onUpdate={() => {
                                // Trigger re-fetch
                                window.location.reload()
                            }}
                        />
                    )}
                    {activeTab === 'Academic Info' && (
                        <AcademicInfo student={student} enrollments={enrollments} />
                    )}
                </section>
            </main>
        </div>
    )
}

export default StudentDashboardWithSupabase
