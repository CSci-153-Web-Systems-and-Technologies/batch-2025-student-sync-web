import React, { useState } from 'react'
import styles from './StudentDashboard.module.css'
import { useAuth, useUserProfile, useStudent, useEnrollments } from './hooks/useSupabase'
import { users as usersApi, students as studentsApi } from './supabase'
import { downloadFile } from './utils/supabaseUtils'

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
    const tabs = ['Overview', 'Profile Management', 'Academic Info', 'Settings']
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

function SettingsTab({ student, profile, enrollments = [] }) {
    const [notifications, setNotifications] = React.useState(() => ({
        emailNotifications: JSON.parse(localStorage.getItem('student:emailNotifications') || 'true'),
        gradeAlerts: JSON.parse(localStorage.getItem('student:gradeAlerts') || 'true'),
        marketing: JSON.parse(localStorage.getItem('student:marketing') || 'false')
    }))

    const [privacy, setPrivacy] = React.useState(() => ({
        shareProfile: JSON.parse(localStorage.getItem('student:shareProfile') || 'false')
    }))

    const [officeHours, setOfficeHours] = React.useState(() => localStorage.getItem('student:officeHours') || '')
    const [saving, setSaving] = React.useState(false)

    const toggleNotification = (k) => {
        setNotifications(n => {
            const next = { ...n, [k]: !n[k] }
            try { localStorage.setItem(`student:${k}`, JSON.stringify(next[k])) } catch (e) { }
            return next
        })
    }

    const togglePrivacy = (k) => {
        setPrivacy(p => {
            const next = { ...p, [k]: !p[k] }
            try { localStorage.setItem(`student:${k}`, JSON.stringify(next[k])) } catch (e) { }
            return next
        })
    }

    const handleChangePassword = async () => {
        const email = profile?.email || window.prompt('Enter email to send reset to:')
        if (!email) return alert('No email provided')
        try {
            if (usersApi && typeof usersApi.sendPasswordReset === 'function') {
                await usersApi.sendPasswordReset(email)
                alert('Password reset sent to ' + email)
            } else {
                alert('Password reset not available in this demo client')
            }
        } catch (e) {
            console.error('Password reset failed', e)
            alert('Failed to send password reset: ' + (e.message || e))
        }
    }

    const handleSaveOfficeHours = () => {
        (async () => {
            try { localStorage.setItem('student:officeHours', officeHours) } catch (e) { }
            try {
                if (student && student.id && studentsApi && typeof studentsApi.updateStudent === 'function') {
                    console.log('Persisting office hours for student', student.id)
                    const { data, error } = await studentsApi.updateStudent(student.id, { office_hours: officeHours })
                    if (error) {
                        console.error('Failed to persist office hours', error)
                        alert('Saved locally, but failed to persist to server')
                        return
                    }
                }
                alert('Office hours saved')
            } catch (e) {
                console.error('Error saving office hours', e)
                alert('Failed to save office hours')
            }
        })()
    }

    const handleSaveSettings = async () => {
        setSaving(true)
        try {
            // persist to localStorage
            try {
                localStorage.setItem('student:emailNotifications', JSON.stringify(!!notifications.emailNotifications))
                localStorage.setItem('student:gradeAlerts', JSON.stringify(!!notifications.gradeAlerts))
                localStorage.setItem('student:marketing', JSON.stringify(!!notifications.marketing))
                localStorage.setItem('student:shareProfile', JSON.stringify(!!privacy.shareProfile))
            } catch (e) { console.warn('localStorage save failed', e) }

            if (student && student.id && studentsApi && typeof studentsApi.updateStudent === 'function') {
                console.log('Saving preferences to Supabase for', student.id)
                const payload = {
                    office_hours: officeHours,
                    preferences: JSON.stringify({ emailNotifications: !!notifications.emailNotifications, gradeAlerts: !!notifications.gradeAlerts, marketing: !!notifications.marketing, shareProfile: !!privacy.shareProfile })
                }
                const { data, error } = await studentsApi.updateStudent(student.id, payload)
                if (error) {
                    console.error('Failed to persist preferences', error)
                    alert('Saved locally, but failed to save to server')
                    setSaving(false)
                    return
                }
            }

            alert('Settings saved')
        } catch (e) {
            console.error('Error saving settings', e)
            alert('Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    const handleExportData = () => {
        const payload = { profile, student, enrollments }
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${profile?.id || student?.id || 'student'}_data.json`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }

    return (
        <div>
            <h3 style={{ marginTop: 0 }}>Settings</h3>
            <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                    <h4>Notifications</h4>
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span>Email notifications</span>
                        <input type="checkbox" checked={!!notifications.emailNotifications} onChange={() => toggleNotification('emailNotifications')} />
                    </label>
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span>Grade alerts</span>
                        <input type="checkbox" checked={!!notifications.gradeAlerts} onChange={() => toggleNotification('gradeAlerts')} />
                    </label>
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span>Marketing emails</span>
                        <input type="checkbox" checked={!!notifications.marketing} onChange={() => toggleNotification('marketing')} />
                    </label>

                    <h4 style={{ marginTop: 12 }}>Privacy</h4>
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span>Share profile with classmates</span>
                        <input type="checkbox" checked={!!privacy.shareProfile} onChange={() => togglePrivacy('shareProfile')} />
                    </label>

                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        <button className={styles.primaryBtn} onClick={handleChangePassword}>Send Password Reset</button>
                        <button className={styles.secondaryBtn} onClick={handleExportData}>Export My Data</button>
                        <button className={styles.primaryBtn} onClick={handleSaveSettings} disabled={saving}>Save Settings</button>
                    </div>
                </div>

                <div style={{ width: 320 }}>
                    <h4>Office Hours</h4>
                    <textarea className={styles.input} value={officeHours} onChange={e => setOfficeHours(e.target.value)} rows={6} />
                    <div style={{ marginTop: 8 }}>
                        <button className={styles.primaryBtn} onClick={handleSaveOfficeHours}>Save</button>
                    </div>
                </div>
            </div>
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

function AcademicInfo({ student, profile, loading, enrollments = [] }) {
    const studentNumber = student?.student_number || student?.id || profile?.id || '—'
    const major = student?.program?.name || profile?.course || '—'
    const year = student?.year_level || profile?.year_level || '—'
    const gpa = student?.gpa ?? '—'
    const enrolled = student?.enrollment_date || '—'

    const [stats, setStats] = React.useState(null)
    const [msg, setMsg] = React.useState(null)

    React.useEffect(() => {
        let mounted = true
        const loadStats = async () => {
            if (!student?.id) return
            try {
                const { data, error } = await studentsApi.getStudentStats(student.id)
                if (error) throw error
                if (mounted) setStats(data)
            } catch (e) {
                console.warn('Could not fetch student stats', e)
            }
        }
        loadStats()
        return () => { mounted = false }
    }, [student])

    const handleDownload = async (type) => {
        if (!student || !student.id) {
            setMsg({ type: 'error', text: 'Student not loaded' })
            return
        }

        // Use a storage bucket name used for student documents. Update if your project uses a different bucket.
        const bucket = 'student-documents'
        const basePath = `${student.id}`
        const mapping = {
            certificate: `${basePath}/certificate.pdf`,
            transcript: `${basePath}/transcript.pdf`,
            qr: `${basePath}/qr.png`
        }

        const path = mapping[type]
        try {
            setMsg({ type: 'info', text: 'Preparing download...' })
            await downloadFile(bucket, path)
            setMsg({ type: 'success', text: 'Download started' })
        } catch (e) {
            console.error('Download error', e)
            setMsg({ type: 'error', text: `Failed to download ${type}.` })
        }
    }

    const completedCourses = enrollments?.filter(e => e.status === 'completed') || []
    const currentCourses = enrollments?.filter(e => e.status === 'enrolled') || []

    return (
        <div className={styles.academicGrid}>
            <div className={styles.infoCard}>
                <h4>Enrollment Details</h4>
                <dl className={styles.detailsList}>
                    <div><dt>Program</dt><dd>{student?.program?.name || 'N/A'}</dd></div>
                    <div><dt>Student ID</dt><dd>{studentNumber}</dd></div>
                    <div><dt>Year Level</dt><dd>Year {student?.year_level || 'N/A'}</dd></div>
                    <div><dt>Semester</dt><dd>{student?.semester || 'N/A'}</dd></div>
                    <div><dt>Status</dt><dd style={{ textTransform: 'capitalize' }}>{student?.user?.status || 'N/A'}</dd></div>
                </dl>
                <button className={styles.downloadBtn} onClick={() => handleDownload('certificate')}>Download Certificate</button>
            </div>

            <div className={styles.infoCard}>
                <h4>Academic Performance</h4>
                <dl className={styles.detailsList}>
                    <div><dt>GPA</dt><dd>{student?.gpa != null ? student.gpa : (loading ? 'Loading...' : '—')}</dd></div>
                    <div><dt>Credits Earned</dt><dd>{student?.total_credits_earned ?? stats?.total_credits ?? 0} units</dd></div>
                    <div><dt>Current Courses</dt><dd>{currentCourses.length} courses</dd></div>
                    <div><dt>Completed</dt><dd>{completedCourses.length} courses</dd></div>
                    <div><dt>Expected Grad</dt><dd>{student?.expected_graduation_date || 'N/A'}</dd></div>
                </dl>
                <button className={styles.downloadBtn} onClick={() => handleDownload('transcript')}>Download Transcript</button>
            </div>

            <div className={styles.infoCard}>
                <h4>QR Code</h4>
                <div className={styles.qrLarge}>QR Code</div>
                <p className={styles.muted} style={{ fontSize: '12px', marginTop: '12px' }}>Use this QR code for campus verification</p>
                <button className={styles.downloadBtn} onClick={() => handleDownload('qr')}>Download QR</button>
                {msg && <div style={{ marginTop: 8, color: msg.type === 'error' ? 'crimson' : (msg.type === 'success' ? 'green' : '#444') }}>{msg.text}</div>}
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
                    {tab === 'Settings' && <SettingsTab student={student} profile={profile} enrollments={enrollments} />}
                </section>
            </main>
        </div>
    )
}
