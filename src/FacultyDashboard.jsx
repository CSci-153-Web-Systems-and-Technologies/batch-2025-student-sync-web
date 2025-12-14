import React, { useState } from 'react'
import styles from './StudentDashboard.module.css'
import { supabase } from './supabase'
import { canEnrollInSection } from './utils/supabaseUtils'

function Topbar({ name, onLogout }) {
    return (
        <header className={styles.topbar}>
            <div className={styles.brand}>Faculty Portal</div>
            <div className={styles.user}>
                Welcome, {name || 'Faculty'}
                <button className={styles.logout} onClick={() => onLogout && onLogout()}>Logout</button>
            </div>
        </header>
    )
}

function Tabs({ value, onChange }) {
    const tabs = ['Overview', 'Courses', 'Schedule', 'Communications', 'Settings']
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

function Overview({ faculty }) {
    return (
        <div className={styles.overviewGrid}>
            <section className={styles.cardLarge}>
                <div className={styles.cardHeader}><span>Faculty Profile</span></div>
                <div style={{ padding: 16 }}>
                    <h3>{faculty?.first_name} {faculty?.last_name}</h3>
                    <p className={styles.muted}>{faculty?.title || 'Instructor'}</p>
                    <p style={{ marginTop: 8 }}>{faculty?.department || 'Department not set'}</p>
                </div>
            </section>

            <aside className={styles.sideCol}>
                <div className={styles.smallCard}>
                    <div className={styles.cardLabel}>Assigned Sections</div>
                    <div className={styles.cardValue}>{(faculty?.sections || []).length}</div>
                </div>
                <div className={styles.smallCard}>
                    <div className={styles.cardLabel}>Upcoming Events</div>
                    <div className={styles.cardValue}>{(faculty?.events || []).length}</div>
                </div>
                <div className={styles.smallCard}>
                    <div className={styles.cardLabel}>Email</div>
                    <div className={styles.cardValue}>{faculty?.email || '—'}</div>
                </div>
            </aside>
        </div>
    )
}

function CoursesTab({ sections = [], onOpenRoster }) {
    return (
        <div>
            <h3 style={{ marginTop: 0 }}>Your Sections</h3>
            <div className={styles.programGrid}>
                {(sections || []).map((s, i) => (
                    <div key={s.id || i} className={styles.programCard}>
                        <h4>{s.courseName || s.code || 'Untitled'}</h4>
                        <div className={styles.programDegree}>{s.term || ''}</div>
                        <div className={styles.programDetails}>
                            <div className={styles.detailItem}>Section: {s.section || s.id}</div>
                            <div className={styles.detailItem}>Room: {s.room || 'TBD'}</div>
                            <div className={styles.detailItem}>Schedule: {s.schedule || 'TBD'}</div>
                        </div>
                        <button className={styles.viewBtn} onClick={() => onOpenRoster && onOpenRoster(s)}>Open Roster</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

function ScheduleTab({ events = [] }) {
    return (
        <div>
            <h3 style={{ marginTop: 0 }}>Upcoming Calendar</h3>
            <div className={styles.eventsList}>
                {(events || []).slice(0, 6).map((e, i) => (
                    <div key={e.id || i} className={styles.eventItem} style={{ marginBottom: 10 }}>
                        <div className={styles.eventInfo}>
                            <div className={styles.eventTitle}>{e.title}</div>
                            <div className={styles.eventDate}>{e.date || ''}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function CommunicationsTab({ announcements = [] }) {
    return (
        <div>
            <h3 style={{ marginTop: 0 }}>Announcements</h3>
            <div className={styles.commsList}>
                {(announcements || []).map((a, i) => (
                    <div key={a.id || i} className={styles.commItem} style={{ marginBottom: 12 }}>
                        <div className={styles.commHeader}>
                            <h4>{a.title}</h4>
                            <span className={styles.commTime}>{a.time || ''}</span>
                        </div>
                        <p className={styles.commText}>{a.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

function SettingsTab({ faculty }) {
    const [profile, setProfile] = useState(() => ({
        first_name: faculty?.first_name || '',
        last_name: faculty?.last_name || '',
        email: faculty?.email || '',
        title: faculty?.title || ''
    }))

    const [notifications, setNotifications] = useState(() => ({
        emailCourseUpdates: JSON.parse(localStorage.getItem('faculty:emailCourseUpdates') || 'true'),
        officeHourAlerts: JSON.parse(localStorage.getItem('faculty:officeHourAlerts') || 'true')
    }))

    const [officeHours, setOfficeHours] = useState(() => localStorage.getItem('faculty:officeHours') || '')
    const [saving, setSaving] = useState(false)

    const toggleNotification = (key) => {
        setNotifications(n => {
            const next = { ...n, [key]: !n[key] }
            try { localStorage.setItem(`faculty:${key}`, JSON.stringify(next[key])) } catch (e) { }
            return next
        })
    }

    const handleUpdateProfile = async () => {
        setSaving(true)
        try {
            // update users/profile and faculty record if available
            if (faculty && faculty.id) {
                // update faculty table
                const { data: fdata, error: ferr } = await supabase.from('faculty').update({
                    title: profile.title,
                    department: faculty.department || faculty.dept || null
                }).eq('id', faculty.id)
                if (ferr) throw ferr
            }

            // attempt to update users table where user id exists
            if (faculty && faculty.user && faculty.user.id) {
                const { data: udata, error: uerr } = await supabase.from('users').update({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    email: profile.email
                }).eq('id', faculty.user.id)
                if (uerr) throw uerr
            }

            alert('Profile saved')
        } catch (e) {
            console.error('Failed saving profile', e)
            alert('Failed saving profile: ' + (e.message || e))
        } finally {
            setSaving(false)
        }
    }

    const handleChangePassword = async () => {
        const email = profile.email || faculty?.email
        if (!email) return alert('No email available')
        try {
            if (supabase.auth && typeof supabase.auth.resetPasswordForEmail === 'function') {
                await supabase.auth.resetPasswordForEmail(email)
                alert('Password reset email sent to ' + email)
            } else if (supabase.auth && supabase.auth.api && typeof supabase.auth.api.resetPasswordForEmail === 'function') {
                await supabase.auth.api.resetPasswordForEmail(email)
                alert('Password reset email sent to ' + email)
            } else {
                alert('Password reset not supported in this client; please use system admin')
            }
        } catch (e) {
            console.error('Change password failed', e)
            alert('Failed to send password reset: ' + (e.message || e))
        }
    }

    const handleSaveOfficeHours = () => {
        try { localStorage.setItem('faculty:officeHours', officeHours) } catch (e) { }
        alert('Office hours saved')
    }

    return (
        <div>
            <h3 style={{ marginTop: 0 }}>Settings</h3>
            <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                    <h4>Profile</h4>
                    <label style={{ display: 'block', marginBottom: 8 }}>First name<input className={styles.input} value={profile.first_name} onChange={e => setProfile(p => ({ ...p, first_name: e.target.value }))} /></label>
                    <label style={{ display: 'block', marginBottom: 8 }}>Last name<input className={styles.input} value={profile.last_name} onChange={e => setProfile(p => ({ ...p, last_name: e.target.value }))} /></label>
                    <label style={{ display: 'block', marginBottom: 8 }}>Email<input className={styles.input} value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} /></label>
                    <label style={{ display: 'block', marginBottom: 8 }}>Title<input className={styles.input} value={profile.title} onChange={e => setProfile(p => ({ ...p, title: e.target.value }))} /></label>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button className={styles.primaryBtn} onClick={handleUpdateProfile} disabled={saving}>{saving ? 'Saving…' : 'Save Profile'}</button>
                        <button className={styles.secondaryBtn} onClick={handleChangePassword}>Send Password Reset</button>
                    </div>
                </div>

                <div style={{ width: 320 }}>
                    <h4>Preferences</h4>
                    <div style={{ marginBottom: 8 }}>
                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Email course enrollment updates</span>
                            <input type="checkbox" checked={!!notifications.emailCourseUpdates} onChange={() => toggleNotification('emailCourseUpdates')} />
                        </label>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Office hour booking alerts</span>
                            <input type="checkbox" checked={!!notifications.officeHourAlerts} onChange={() => toggleNotification('officeHourAlerts')} />
                        </label>
                    </div>

                    <h4 style={{ marginTop: 12 }}>Office Hours</h4>
                    <textarea className={styles.input} value={officeHours} onChange={e => setOfficeHours(e.target.value)} rows={6} />
                    <div style={{ marginTop: 8 }}>
                        <button className={styles.primaryBtn} onClick={handleSaveOfficeHours}>Save Office Hours</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function FacultyDashboard({ onLogout, initialFaculty, initialTab }) {
    const [tab, setTab] = useState(initialTab || 'Overview')
    const [rosterOpen, setRosterOpen] = useState(false)
    const [roster, setRoster] = useState([])
    const faculty = initialFaculty || {
        first_name: 'Jane',
        last_name: 'Doe',
        title: 'Lecturer',
        department: 'Computer Science',
        email: 'jane.doe@example.com',
        sections: [
            { id: 'sec1', courseName: 'Intro to Programming', term: 'Fall 2025', section: 'A' },
            { id: 'sec2', courseName: 'Data Structures', term: 'Fall 2025', section: 'B' }
        ],
        events: [
            { id: 'e1', title: 'Department Meeting', date: '2025-09-10' }
        ]
    }

    const openRoster = async (s) => {
        // Fetch roster for the selected section (joined with student user profile)
        try {
            const { data, error } = await supabase
                .from('enrollments')
                .select(`id, status, grade, student:students(id,student_id,program_id,total_credits_earned, user:users(id,first_name,last_name,email))`)
                .eq('section_id', s.id)
                .order('created_at', { ascending: true })

            if (error) {
                console.error('Error fetching roster', error)
                setRoster([])
            } else {
                const mapped = (data || []).map(r => ({
                    id: r.id,
                    name: r.student?.user ? `${r.student.user.first_name} ${r.student.user.last_name}` : r.student?.student_id,
                    email: r.student?.user?.email || '',
                    studentId: r.student?.student_id,
                    status: r.status
                }))
                setRoster(mapped)
            }
        } catch (e) {
            console.error('Roster fetch failed', e)
            setRoster([])
        }

        // store current section in state for enrollment actions
        setCurrentSection(s)
        setRosterOpen(true)
    }

    const closeRoster = () => {
        setRosterOpen(false)
        setRoster([])
    }

    const [currentSection, setCurrentSection] = useState(null)
    const [searchIdentifier, setSearchIdentifier] = useState('')
    const [actionMsg, setActionMsg] = useState(null)

    const findStudentByIdentifier = async (identifier) => {
        if (!identifier) return null
        try {
            // If email
            if (identifier.includes('@')) {
                const { data: user } = await supabase
                    .from('users')
                    .select('id')
                    .eq('email', identifier)
                    .single()
                if (!user) return null
                const { data: student } = await supabase
                    .from('students')
                    .select('*')
                    .eq('id', user.id)
                    .single()
                return student
            }

            // Otherwise assume student_id
            const { data: studentById } = await supabase
                .from('students')
                .select('*')
                .eq('student_id', identifier)
                .single()
            return studentById
        } catch (e) {
            console.error('findStudent error', e)
            return null
        }
    }

    const handleAddStudent = async () => {
        setActionMsg(null)
        if (!currentSection) return setActionMsg({ type: 'error', text: 'No section selected' })
        const identifier = searchIdentifier.trim()
        if (!identifier) return setActionMsg({ type: 'error', text: 'Enter student email or ID' })

        setActionMsg({ type: 'info', text: 'Searching student...' })
        const student = await findStudentByIdentifier(identifier)
        if (!student) return setActionMsg({ type: 'error', text: 'Student not found' })

        // Check enrollment rules
        try {
            const can = await canEnrollInSection(student.id, currentSection.id)
            if (!can.canEnroll) return setActionMsg({ type: 'error', text: `Cannot enroll: ${can.reason || 'restriction'}` })

            // Create enrollment
            const { data: enrollData, error: enrollErr } = await supabase
                .from('enrollments')
                .insert({ student_id: student.id, section_id: currentSection.id, status: 'enrolled' })
                .select()
                .single()

            if (enrollErr) throw enrollErr

            // Refresh roster
            await openRoster(currentSection)
            setSearchIdentifier('')
            setActionMsg({ type: 'success', text: 'Student enrolled' })
        } catch (e) {
            console.error('Enrollment failed', e)
            setActionMsg({ type: 'error', text: e.message || 'Enrollment failed' })
        }
    }

    const handleRemoveStudent = async (r) => {
        console.log('handleRemoveStudent clicked', r && r.id)
        if (!r || !r.id) return
        if (!confirm('Remove this student from the section?')) return
        try {
            const { error } = await supabase.from('enrollments').delete().eq('id', r.id)
            if (error) throw error
            await openRoster(currentSection)
            setActionMsg({ type: 'success', text: 'Student removed' })
        } catch (e) {
            console.error('Remove failed', e)
            setActionMsg({ type: 'error', text: 'Failed to remove student' })
        }
    }

    const handleSetGrade = async (r) => {
        console.log('handleSetGrade clicked', r && r.id)
        if (!r || !r.id) return
        const grade = prompt('Enter grade (e.g., A, B+, 85):', r.grade || '')
        if (grade === null) return
        try {
            const { error } = await supabase.from('enrollments').update({ grade }).eq('id', r.id)
            if (error) throw error
            await openRoster(currentSection)
            setActionMsg({ type: 'success', text: 'Grade updated' })
        } catch (e) {
            console.error('Grade update failed', e)
            setActionMsg({ type: 'error', text: 'Failed to update grade' })
        }
    }

    const exportRosterCSV = () => {
        const esc = v => String(v ?? '').replace(/"/g, '""')
        const headers = ['name', 'email', 'studentId', 'status', 'grade']
        const rows = (roster || []).map(r => headers.map(h => `"${esc(r[h])}"`).join(','))
        const csv = [headers.join(',')].concat(rows).join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${(currentSection && (currentSection.courseName || currentSection.section)) || 'roster'}.csv`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }

    const buildMailto = (recipients, subject = '', body = '') => {
        if (!recipients) return '#'
        const list = Array.isArray(recipients) ? recipients.filter(Boolean) : [recipients]
        const to = list.join(',')
        const params = []
        if (subject) params.push(`subject=${encodeURIComponent(subject)}`)
        if (body) params.push(`body=${encodeURIComponent(body)}`)
        return `mailto:${to}${params.length ? `?${params.join('&')}` : ''}`
    }

    return (
        <div className={styles.container}>
            <Topbar name={`${faculty.first_name} ${faculty.last_name}`} onLogout={onLogout} />
            <main className={styles.main}>
                <h1 className={styles.welcome}>Welcome, {faculty.first_name}</h1>
                <p className={styles.subtitle}>Your teaching assignments and schedule</p>
                <Tabs value={tab} onChange={setTab} />
                <section className={styles.section}>
                    {tab === 'Overview' && <Overview faculty={faculty} />}
                    {tab === 'Courses' && <CoursesTab sections={faculty.sections} onOpenRoster={openRoster} />}
                    {tab === 'Schedule' && <ScheduleTab events={faculty.events} />}
                    {tab === 'Communications' && <CommunicationsTab announcements={[]} />}
                    {tab === 'Settings' && <SettingsTab faculty={faculty} />}
                </section>
            </main>

            {rosterOpen && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <div className="modal-header">
                            <strong>Roster</strong>
                            <button className="modal-close" onClick={closeRoster}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ marginBottom: 12 }}>
                                <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Add student by email or student ID</label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <input style={{ flex: 1, padding: '8px 10px' }} value={searchIdentifier} onChange={e => setSearchIdentifier(e.target.value)} placeholder="student@example.com or 22-1-01580" />
                                    <button className={styles.actionBtn} onClick={handleAddStudent}>Add Student</button>
                                </div>
                                {actionMsg && (
                                    <div style={{ marginTop: 8, color: actionMsg.type === 'error' ? 'crimson' : (actionMsg.type === 'success' ? 'green' : '#444') }}>{actionMsg.text}</div>
                                )}
                            </div>
                            <div style={{ marginBottom: 12 }}>
                                <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Email all enrolled students</label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <a className={styles.actionBtn} href={buildMailto(roster.map(r => r.email), 'Class Announcement', 'Hello class,')}>Email All</a>
                                </div>
                            </div>

                            {(roster || []).map(r => (
                                <div key={r.id} style={{ padding: 8, borderBottom: '1px solid #f2f2f2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{r.name}</div>
                                        <div style={{ fontSize: 13, color: '#666' }}>{r.email} {r.studentId ? `• ${r.studentId}` : ''}</div>
                                        <div style={{ fontSize: 12, color: '#777' }}>Status: {r.status}{r.grade ? ` • Grade: ${r.grade}` : ''}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <a className={styles.viewBtn} href={buildMailto(r.email, 'Message from your instructor', 'Hello,')}>Email</a>
                                        <button className={styles.secondaryBtn} onClick={() => handleSetGrade(r)}>Set Grade</button>
                                        <button className={styles.dangerBtn} onClick={() => handleRemoveStudent(r)}>Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="modal-actions" style={{ padding: 12, display: 'flex', gap: 8 }}>
                            <button className="secondary" onClick={closeRoster}>Close</button>
                            <button className={styles.actionBtn} onClick={exportRosterCSV}>Export Roster</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
