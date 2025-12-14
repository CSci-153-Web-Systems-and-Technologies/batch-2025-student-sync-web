import React, { useState, useEffect } from 'react'
import { useAuth, useAnnouncements, useCalendarEvents } from './hooks/useSupabase'
import { supabase, announcements as apiAnnouncements, faculty as facultyApi, users as usersApi } from './supabase'
import styles from './StudentDashboard.module.css'

function Topbar({ user, onLogout }) {
    return (
        <header className={styles.topbar}>
            <div className={styles.brand}>Faculty Portal</div>
            <div className={styles.user}>
                Welcome, {user?.first_name || 'Faculty'}
                <button className={styles.logout} onClick={onLogout}>Logout</button>
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

function Overview({ faculty, sections, events }) {
    return (
        <div className={styles.overviewGrid}>
            <section className={styles.cardLarge}>
                <div className={styles.cardHeader}><span>Faculty Profile</span></div>
                <div style={{ padding: 16 }}>
                    <h3>{faculty?.user?.first_name} {faculty?.user?.last_name}</h3>
                    <p className={styles.muted}>{faculty?.title || faculty?.position || 'Instructor'}</p>
                    <p style={{ marginTop: 8 }}>{faculty?.department || 'Department not set'}</p>
                </div>
            </section>

            <aside className={styles.sideCol}>
                <div className={styles.smallCard}>
                    <div className={styles.cardLabel}>Assigned Sections</div>
                    <div className={styles.cardValue}>{(sections || []).length}</div>
                </div>
                <div className={styles.smallCard}>
                    <div className={styles.cardLabel}>Upcoming Events</div>
                    <div className={styles.cardValue}>{(events || []).slice(0, 3).length}</div>
                </div>
                <div className={styles.smallCard}>
                    <div className={styles.cardLabel}>Email</div>
                    <div className={styles.cardValue}>{faculty?.user?.email || '—'}</div>
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
                        <h4>{s.course?.name || s.course?.code || 'Untitled'}</h4>
                        <div className={styles.programDegree}>{s.term?.semester} {s.term?.year}</div>
                        <div className={styles.programDetails}>
                            <div className={styles.detailItem}>Section: {s.section_number || s.id}</div>
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
                            <div className={styles.eventDate}>{new Date(e.start_date).toLocaleDateString()}</div>
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
                            <span className={styles.commTime}>{new Date(a.published_at).toLocaleString()}</span>
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
        first_name: faculty?.user?.first_name || faculty?.user?.first_name || '',
        last_name: faculty?.user?.last_name || faculty?.user?.last_name || '',
        email: faculty?.user?.email || '',
        title: faculty?.title || faculty?.position || ''
    }))

    const [officeHours, setOfficeHours] = useState(() => localStorage.getItem('faculty:officeHours') || '')
    const [saving, setSaving] = useState(false)

    const handleSaveOfficeHours = () => {
        try { localStorage.setItem('faculty:officeHours', officeHours) } catch (e) { }
        alert('Office hours saved')
    }

    const handleUpdateProfile = async () => {
        setSaving(true)
        try {
            if (!faculty) throw new Error('No faculty record')
            // update faculty table
            if (faculty.id) {
                const { data, error } = await facultyApi.updateFaculty(faculty.id, { title: profile.title })
                if (error) throw error
            }
            // update linked user profile if present
            if (faculty.user && faculty.user.id) {
                const { data, error } = await usersApi.updateProfile(faculty.user.id, { first_name: profile.first_name, last_name: profile.last_name, email: profile.email })
                if (error) throw error
            }
            alert('Profile saved')
        } catch (e) {
            console.error('Failed saving profile', e)
            alert('Failed saving profile: ' + (e.message || e))
        } finally {
            setSaving(false)
        }
    }

    const handleSendPasswordReset = async () => {
        try {
            if (usersApi && typeof usersApi.sendPasswordReset === 'function') {
                await usersApi.sendPasswordReset(profile.email || faculty?.user?.email)
                alert('Password reset sent')
            } else if (supabase.auth && typeof supabase.auth.resetPasswordForEmail === 'function') {
                await supabase.auth.resetPasswordForEmail(profile.email || faculty?.user?.email)
                alert('Password reset sent')
            } else {
                alert('Password reset not supported in this client')
            }
        } catch (e) {
            console.error('Password reset failed', e)
            alert('Failed to send password reset: ' + (e.message || e))
        }
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
                        <button className={styles.secondaryBtn} onClick={handleSendPasswordReset}>Send Password Reset</button>
                    </div>
                </div>

                <div style={{ width: 320 }}>
                    <h4>Office Hours</h4>
                    <textarea className={styles.input} value={officeHours} onChange={e => setOfficeHours(e.target.value)} rows={6} />
                    <div style={{ marginTop: 8 }}>
                        <button className={styles.primaryBtn} onClick={handleSaveOfficeHours}>Save Office Hours</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function FacultyDashboardWithSupabase({ onLogout }) {
    const { user: authUser } = useAuth()
    const [faculty, setFaculty] = useState(null)
    const [sections, setSections] = useState([])
    const [loading, setLoading] = useState(true)
    const { announcements, loading: annLoading } = useAnnouncements('faculty')
    const { events, loading: eventsLoading } = useCalendarEvents()
    const [tab, setTab] = useState('Overview')
    const [rosterOpen, setRosterOpen] = useState(false)
    const [roster, setRoster] = useState([])
    const [selectedSection, setSelectedSection] = useState(null)

    useEffect(() => {
        if (!authUser) return
        const fetch = async () => {
            setLoading(true)

            // Try to load faculty record using helper; some setups use faculty.id === auth user id
            let fdata = null
            try {
                const { data, error } = await facultyApi.getFaculty(authUser.id)
                if (data) fdata = data
                // if error and no data, we'll fall back to user's profile below
            } catch (e) {
                // ignore and fall back
            }

            // If no faculty record exists, try to load the users profile and use it as a minimal faculty object
            if (!fdata) {
                try {
                    const { data: profile } = await usersApi.getProfile(authUser.id)
                    if (profile) {
                        fdata = { user: profile }
                    }
                } catch (e) {
                    // ignore
                }
            }

            setFaculty(fdata)

            // fetch all course sections and filter by faculty user id (best-effort)
            try {
                const { data: secs } = await supabase
                    .from('course_sections')
                    .select(`*, course:courses(*), term:academic_terms(*), faculty:faculty(*, user:users(*))`)
                    .order('course.code', { ascending: true })

                const mySections = (secs || []).filter(s => s.faculty && ((s.faculty.id === authUser.id) || (s.faculty.user && s.faculty.user.id === authUser.id)))
                setSections(mySections)
            } catch (e) {
                setSections([])
            }

            setLoading(false)
        }
        fetch()
    }, [authUser])

    const openRoster = async (section) => {
        if (!section) return
        setSelectedSection(section)
        // fetch enrollments for this section
        const { data, error } = await supabase
            .from('enrollments')
            .select(`*, student:students(*, user:users(*))`)
            .eq('section_id', section.id)
            .order('created_at', { ascending: true })

        if (error) {
            alert('Error loading roster: ' + (error.message || error))
            return
        }
        setRoster(data || [])
        setRosterOpen(true)
    }

    const closeRoster = () => {
        setRosterOpen(false)
        setRoster([])
        setSelectedSection(null)
    }

    const sendAnnouncementToSection = async () => {
        if (!selectedSection) return
        const title = window.prompt('Announcement title')
        if (!title) return
        const content = window.prompt('Message') || ''
        try {
            const { data, error } = await apiAnnouncements.createAnnouncement({
                title,
                content,
                target_audience: `section:${selectedSection.id}`,
                published_at: new Date().toISOString(),
                is_active: true
            })
            if (error) throw error
            alert('Announcement sent to section')
        } catch (e) {
            alert('Failed to send announcement: ' + (e.message || e))
        }
    }

    const handleRemoveStudent = async (enrollment) => {
        console.log('handleRemoveStudent clicked', enrollment && enrollment.id)
        if (!enrollment || !enrollment.id) return
        if (!confirm('Remove this student from the section?')) return
        try {
            const { error } = await supabase.from('enrollments').delete().eq('id', enrollment.id)
            if (error) throw error
            // refresh roster
            await openRoster(selectedSection)
            alert('Student removed')
        } catch (e) {
            console.error('Failed removing student', e)
            alert('Failed to remove student: ' + (e.message || e))
        }
    }

    const handleSetGrade = async (enrollment) => {
        console.log('handleSetGrade clicked', enrollment && enrollment.id)
        if (!enrollment || !enrollment.id) return
        const grade = window.prompt('Enter grade (e.g., A, B+, 85):', enrollment.grade || '')
        if (grade === null) return
        try {
            const { error } = await supabase.from('enrollments').update({ grade }).eq('id', enrollment.id)
            if (error) throw error
            await openRoster(selectedSection)
            alert('Grade updated')
        } catch (e) {
            console.error('Failed updating grade', e)
            alert('Failed to update grade: ' + (e.message || e))
        }
    }

    const exportRosterCSV = () => {
        const rows = (roster || []).map(r => ({
            enrollment_id: r.id || '',
            student_id: r.student?.id || '',
            student_number: r.student?.student_number || '',
            first_name: r.student?.user?.first_name || '',
            last_name: r.student?.user?.last_name || '',
            email: r.student?.user?.email || '',
            status: r.status || '',
            grade: r.grade || ''
        }))
        if (!rows.length) return alert('No roster to export')
        const headers = Object.keys(rows[0])
        const esc = v => String(v ?? '').replace(/"/g, '""')
        const csv = [headers.join(',')].concat(rows.map(r => headers.map(h => `"${esc(r[h])}"`).join(','))).join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${(selectedSection?.course?.code || 'section')}_roster.csv`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }

    const busy = loading || annLoading || eventsLoading

    if (busy) {
        return (
            <div className={styles.container}>
                <div style={{ padding: 40, textAlign: 'center' }}>
                    <h2>Loading your faculty dashboard...</h2>
                </div>
            </div>
        )
    }

    if (!faculty) {
        return (
            <div className={styles.container}>
                <div style={{ padding: 40, textAlign: 'center' }}>
                    <h2>No faculty profile found</h2>
                    <p>Please contact admin to set up your faculty account.</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <Topbar user={faculty.user} onLogout={onLogout} />
            <main className={styles.main}>
                <h1 className={styles.welcome}>Welcome, {faculty.user.first_name}</h1>
                <p className={styles.subtitle}>Your teaching assignments and schedule</p>
                <Tabs value={tab} onChange={setTab} />
                <section className={styles.section}>
                    {tab === 'Overview' && <Overview faculty={faculty} sections={sections} events={events} />}
                    {tab === 'Courses' && <CoursesTab sections={sections} onOpenRoster={openRoster} />}
                    {tab === 'Schedule' && <ScheduleTab events={events} />}
                    {tab === 'Communications' && <CommunicationsTab announcements={announcements} />}
                    {tab === 'Settings' && <SettingsTab faculty={faculty} />}
                </section>
            </main>

            {rosterOpen && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <div className="modal-header">
                            <strong>Roster — {selectedSection?.course?.name || selectedSection?.course?.code || 'Section'}</strong>
                            <button className="modal-close" onClick={closeRoster}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: 13, color: '#666' }}>{selectedSection?.term?.semester} {selectedSection?.term?.year}</div>
                                    <div style={{ fontSize: 13, color: '#666' }}>Section: {selectedSection?.section_number || selectedSection?.id}</div>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="secondary" onClick={sendAnnouncementToSection}>📣 Announce</button>
                                    <button className="secondary" onClick={exportRosterCSV}>⬇️ Download CSV</button>
                                </div>
                            </div>
                            <div style={{ marginTop: 12 }}>
                                {(roster || []).length === 0 && <div className={styles.muted}>No students enrolled.</div>}
                                {(roster || []).map((r, idx) => (
                                    <div key={r.id || idx} style={{ padding: '8px 0', borderBottom: '1px solid #f2f2f2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{r.student?.user?.first_name} {r.student?.user?.last_name}</div>
                                            <div style={{ fontSize: 13, color: '#666' }}>{r.student?.student_number || r.student?.id} • {r.student?.user?.email}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="alt" onClick={async () => {
                                                const mail = r.student?.user?.email
                                                if (mail) window.location.href = `mailto:${mail}`
                                            }}>✉️ Email</button>
                                            <button className="secondary" onClick={() => handleSetGrade(r)}>Set Grade</button>
                                            <button className="dangerBtn" onClick={() => handleRemoveStudent(r)}>Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-actions" style={{ padding: 12 }}>
                            <button className="secondary" onClick={closeRoster}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
