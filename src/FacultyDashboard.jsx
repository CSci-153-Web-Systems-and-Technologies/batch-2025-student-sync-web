import React, { useState } from 'react'
import styles from './StudentDashboard.module.css'

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
    const tabs = ['Overview', 'Courses', 'Schedule', 'Communications']
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

export default function FacultyDashboard({ onLogout, initialFaculty }) {
    const [tab, setTab] = useState('Overview')
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

    const openRoster = (s) => {
        setRoster([
            { id: 1, name: 'Student A', email: 'a@example.com' },
            { id: 2, name: 'Student B', email: 'b@example.com' }
        ])
        setRosterOpen(true)
    }

    const closeRoster = () => {
        setRosterOpen(false)
        setRoster([])
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
                            {(roster || []).map(r => (
                                <div key={r.id} style={{ padding: 8, borderBottom: '1px solid #f2f2f2' }}>
                                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                                    <div style={{ fontSize: 13, color: '#666' }}>{r.email}</div>
                                </div>
                            ))}
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
