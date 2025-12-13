import React, { useState } from 'react'
import styles from './StudentDashboard.module.css'
import { useAuth, useUserProfile, useStudent } from './hooks/useSupabase'

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

function Overview({ student, profile, loading }) {
    const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : ''
    const course = student?.program?.name || profile?.course || '—'
    const idNo = student?.student_number || student?.id || profile?.id || '—'
    const gpa = student?.gpa ?? '—'
    const year = student?.year_level || profile?.year_level || '—'

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
                    <div className={styles.cardLabel}>Course</div>
                    <div className={styles.cardValue}>{course}</div>
                </div>
            </aside>
        </div>
    )
}

function ProfileManagement({ student, profile, loading }) {
    return (
        <div className={styles.overviewGrid}>
            <section className={styles.profileCard}>
                <h3>Profile Information</h3>
                <p className={styles.muted}>Update your personal information and contact details</p>
                <div className={styles.formRow}>
                    <div className={styles.field}><label>First Name</label><input defaultValue={profile?.first_name || ''} /></div>
                    <div className={styles.field}><label>Last Name</label><input defaultValue={profile?.last_name || ''} /></div>
                </div>
                <div className={styles.dividerLine}></div>
                <div className={styles.formRow}>
                    <div className={styles.field}><label>Email</label><input defaultValue={profile?.email || ''} /></div>
                    <div className={styles.field}><label>Phone</label><input defaultValue={profile?.phone || student?.phone || ''} /></div>
                </div>
                <div className={styles.field}><label>Address</label><input defaultValue={profile?.address || student?.address || ''} /></div>
                <div className={styles.field}><label>Emergency Contact</label><input defaultValue={profile?.emergency_contact || ''} /></div>
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

    const displayName = profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user?.email?.split('@')[0]

    return (
        <div className={styles.container}>
            <Topbar name={displayName} onLogout={onLogout} />
            <main className={styles.main}>
                <h1 className={styles.welcome}>Welcome, {displayName}</h1>
                <p className={styles.subtitle}>Manage your student profile and academic information</p>
                <Tabs value={tab} onChange={setTab} />

                <section className={styles.section}>
                    {tab === 'Overview' && <Overview student={student} loading={studentLoading} profile={profile} />}
                    {tab === 'Profile Management' && <ProfileManagement student={student} loading={studentLoading} profile={profile} />}
                    {tab === 'Academic Info' && <AcademicInfo student={student} loading={studentLoading} profile={profile} />}
                </section>
            </main>
        </div>
    )
}
