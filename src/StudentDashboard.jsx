import React, { useState } from 'react'
import styles from './StudentDashboard.module.css'
import { useAuth, useUserProfile, useStudent, useEnrollments } from './hooks/useSupabase'
import { users as usersApi, students as studentsApi } from './supabase'

function Topbar({ name, onLogout }) {
    return (
        <header className={styles.topbar}>
            <div className={styles.brand}>Student Portal</div>
            <div className={styles.user}>
                Welcome, {name || 'Student'}
                <button className={styles.logout} onClick={() => onLogout && onLogout()}>Logout</button>
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

function Overview({ student, profile, loading, enrollments = [] }) {
    const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : ''
    const course = student?.program?.name || profile?.course || '—'
    const idNo = student?.student_number || student?.id || profile?.id || '—'
    const gpa = student?.gpa ?? '—'
    const year = student?.year_level || profile?.year_level || '—'

    // Compute units completed (prefer stored total, else sum completed enrollments)
    const unitsFromEnrollments = (enrollments || []).reduce((sum, e) => {
        const status = e?.status
        const credits = Number(e?.section?.course?.credits ?? 0)
        if ((status === 'completed' || e?.grade != null) && credits) return sum + credits
        return sum
    }, 0)
    const unitsCompleted = student?.total_credits_earned ?? unitsFromEnrollments

    // Current courses: those with status 'enrolled' and whose term is current (or within term dates)
    const today = new Date()
    const currentCourses = (enrollments || []).filter(e => {
        if (e?.status !== 'enrolled') return false
        const term = e?.section?.term
        if (!term) return true
        if (term.is_current) return true
        const start = term.start_date ? new Date(term.start_date) : null
        const end = term.end_date ? new Date(term.end_date) : null
        if (start && end) return today >= start && today <= end
        return true
    }).map(e => ({ id: e.id, code: e?.section?.course?.code, name: e?.section?.course?.name, credits: e?.section?.course?.credits }))

    return (
        <div className={styles.overviewGrid}>
            <section className={styles.cardLarge}>
                <div className={styles.cardHeader}><span>Student ID Card</span></div>
                <div className={styles.idCard}>
                    <div className={styles.avatar} aria-hidden>{(profile?.first_name || 'S')[0]}</div>
                    <div className={styles.idInfo}>
                        <div className={styles.name}>{fullName || 'Student Name'}</div>
                        <div className={styles.course}>{course}</div>
                        <div className={styles.idno}>ID no: {idNo}</div>
                    </div>
                    <div className={styles.qr} aria-hidden>QR</div>
                </div>
            </section>

            <aside className={styles.sideCol}>
                <div className={styles.smallCard}>
                    <div className={styles.cardLabel}>Current GPA</div>
                    <div className={styles.gpa}>{loading ? 'Loading...' : gpa}</div>
                </div>
                <div className={styles.smallCard}>
                    <div className={styles.cardLabel}>Academic Year</div>
                    <div className={styles.cardValue}>{year}</div>
                </div>
                <div className={styles.smallCard}>
                    <div className={styles.cardLabel}>Units Completed</div>
                    <div className={styles.cardValue}>{loading ? 'Loading...' : unitsCompleted}</div>
                </div>
                <div className={styles.smallCard}>
                    <div className={styles.cardLabel}>Current Courses</div>
                    <div className={styles.cardValue}>{loading ? 'Loading...' : `${currentCourses.length} course(s)`}</div>
                    {currentCourses.length > 0 && (
                        <ul className={styles.currentCoursesList}>
                            {currentCourses.map(c => (
                                <li key={c.id}>{c.code ? `${c.code} — ` : ''}{c.name}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </aside>
        </div>
    )
}

function ProfileManagement({ student, profile, loading }) {
    const [firstName, setFirstName] = React.useState(profile?.first_name || '')
    const [lastName, setLastName] = React.useState(profile?.last_name || '')
    const [email, setEmail] = React.useState(profile?.email || '')
    const [phone, setPhone] = React.useState(profile?.phone || '')
    const [address, setAddress] = React.useState(profile?.address || '')
    const [emergencyName, setEmergencyName] = React.useState(student?.emergency_contact_name || '')
    const [emergencyPhone, setEmergencyPhone] = React.useState(student?.emergency_contact_phone || '')
    const [saving, setSaving] = React.useState(false)
    const [message, setMessage] = React.useState(null)

    React.useEffect(() => {
        setFirstName(profile?.first_name || '')
        setLastName(profile?.last_name || '')
        setEmail(profile?.email || '')
        setPhone(profile?.phone || '')
        setAddress(profile?.address || '')
        setEmergencyName(student?.emergency_contact_name || '')
        setEmergencyPhone(student?.emergency_contact_phone || '')
    }, [profile, student])

    const handleSave = async () => {
        setSaving(true)
        setMessage(null)
        try {
            // Update users table
            if (profile && profile.id) {
                const { data: userData, error: userErr } = await usersApi.updateProfile(profile.id, {
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone: phone,
                    address: address
                })
                if (userErr) throw userErr
            }

            // Update students table (emergency contacts)
            if (student && student.id) {
                const { data: studentData, error: studentErr } = await studentsApi.updateStudent(student.id, {
                    emergency_contact_name: emergencyName,
                    emergency_contact_phone: emergencyPhone
                })
                if (studentErr) throw studentErr
            }

            setMessage({ type: 'success', text: 'Profile saved.' })
        } catch (e) {
            console.error('Save error', e)
            setMessage({ type: 'error', text: e.message || 'Failed to save profile.' })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className={styles.overviewGrid}>
            <section className={styles.profileCard}>
                <h3>Profile Information</h3>
                <p className={styles.muted}>Update your personal information and contact details</p>
                <div className={styles.formRow}>
                    <div className={styles.field}><label>First Name</label><input value={firstName} onChange={e => setFirstName(e.target.value)} /></div>
                    <div className={styles.field}><label>Last Name</label><input value={lastName} onChange={e => setLastName(e.target.value)} /></div>
                </div>
                <div className={styles.dividerLine}></div>
                <div className={styles.formRow}>
                    <div className={styles.field}><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} /></div>
                    <div className={styles.field}><label>Phone</label><input value={phone} onChange={e => setPhone(e.target.value)} /></div>
                </div>
                <div className={styles.field}><label>Address</label><input value={address} onChange={e => setAddress(e.target.value)} /></div>
                <div className={styles.field}><label>Emergency Contact Name</label><input value={emergencyName} onChange={e => setEmergencyName(e.target.value)} /></div>
                <div className={styles.field}><label>Emergency Contact Phone</label><input value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} /></div>
                <div style={{ marginTop: 12 }}>
                    <button className={styles.actionBtn} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                    {message && (
                        <span style={{ marginLeft: 12, color: message.type === 'error' ? 'crimson' : 'green' }}>{message.text}</span>
                    )}
                </div>
            </section>

            <aside className={styles.sideCol}>
                <div className={styles.smallCard}></div>
                <div className={styles.smallCard}></div>
                <div className={styles.smallCard}></div>
            </aside>
        </div>
    )
}

function AcademicInfo({ student, profile, loading }) {
    const studentNumber = student?.student_number || student?.id || profile?.id || '—'
    const major = student?.program?.name || profile?.course || '—'
    const year = student?.year_level || profile?.year_level || '—'
    const gpa = student?.gpa ?? '—'
    const enrolled = student?.enrollment_date || '—'

    return (
        <div className={styles.academicGrid}>
            <div className={styles.infoCard}>
                <h4>Academic Details</h4>
                <dl className={styles.detailsList}>
                    <div><dt>Student ID:</dt><dd>{studentNumber}</dd></div>
                    <div><dt>Major:</dt><dd>{major}</dd></div>
                    <div><dt>Academic Year:</dt><dd>{year}</dd></div>
                    <div><dt>Current GPA:</dt><dd>{loading ? 'Loading...' : gpa}</dd></div>
                    <div><dt>Enrollment Date:</dt><dd>{enrolled}</dd></div>
                </dl>
            </div>
            <div className={styles.infoCard}>
                <h4>Quick Actions</h4>
                <div className={styles.actions}>
                    <button className={styles.actionBtn}>View Transcript</button>
                    <button className={styles.actionBtn}>Class Schedule</button>
                    <button className={styles.actionBtn}>Degree Progress</button>
                    <button className={styles.actionBtn}>Request ID Card</button>
                </div>
            </div>
            <div className={styles.infoCard}>
                <h4>Digital ID</h4>
                <div className={styles.qrLarge}>QR</div>
                <button className={styles.downloadBtn}>Download QR Code</button>
            </div>
        </div>
    )
}

export default function StudentDashboard({ onLogout }) {
    const [tab, setTab] = useState('Overview')
    const { user } = useAuth()
    const { profile } = useUserProfile(user?.id)
    // Try to use student record if profile contains student_id, otherwise fallback
    const studentId = profile?.student_id || profile?.id
    const { student, loading: studentLoading } = useStudent(studentId)
    const { enrollments, loading: enrollLoading } = useEnrollments(studentId)

    const displayName = profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user?.email?.split('@')[0]

    return (
        <div className={styles.container}>
            <Topbar name={displayName} onLogout={onLogout} />
            <main className={styles.main}>
                <h1 className={styles.welcome}>Welcome, {displayName}</h1>
                <p className={styles.subtitle}>Manage your student profile and academic information</p>
                <Tabs value={tab} onChange={setTab} />

                <section className={styles.section}>
                    {tab === 'Overview' && <Overview student={student} loading={studentLoading || enrollLoading} profile={profile} enrollments={enrollments} />}
                    {tab === 'Profile Management' && <ProfileManagement student={student} loading={studentLoading} profile={profile} />}
                    {tab === 'Academic Info' && <AcademicInfo student={student} loading={studentLoading || enrollLoading} profile={profile} enrollments={enrollments} />}
                </section>
            </main>
        </div>
    )
}
