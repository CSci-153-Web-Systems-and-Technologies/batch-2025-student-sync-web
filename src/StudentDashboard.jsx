import React, { useState } from 'react'
import styles from './StudentDashboard.module.css'

function Topbar({ onLogout }) {
    return (
        <header className={styles.topbar}>
            <div className={styles.brand}>Student Portal</div>
            <div className={styles.user}>Welcome, Luisito <button className={styles.logout} onClick={() => onLogout && onLogout()}>Logout</button></div>
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

function Overview() {
    return (
        <div className={styles.overviewGrid}>
            <section className={styles.cardLarge}>
                <div className={styles.cardHeader}><span>Student ID Card</span></div>
                <div className={styles.idCard}>
                    <div className={styles.avatar}>L</div>
                    <div className={styles.idInfo}>
                        <div className={styles.name}>Luisito O. Libardo Jr.</div>
                        <div className={styles.course}>Computer Science</div>
                        <div className={styles.idno}>ID no: 22-1-01580</div>
                    </div>
                    <div className={styles.qr} aria-hidden>QR</div>
                </div>
            </section>

            <aside className={styles.sideCol}>
                <div className={styles.smallCard}>
                    <div className={styles.cardLabel}>Current GPA</div>
                    <div className={styles.gpa}>2.0</div>
                </div>
                <div className={styles.smallCard}>
                    <div className={styles.cardLabel}>Academic Year</div>
                    <div className={styles.cardValue}>Senior</div>
                </div>
                <div className={styles.smallCard}>
                    <div className={styles.cardLabel}>Course</div>
                    <div className={styles.cardValue}>Computer Science</div>
                </div>
            </aside>
        </div>
    )
}

function ProfileManagement() {
    return (
        <div className={styles.profileCard}>
            <h3>Profile Information</h3>
            <p className={styles.muted}>Update your personal information and contact details</p>
            <div className={styles.formRow}>
                <div className={styles.field}><label>First Name</label><input defaultValue="Luisito Jr." /></div>
                <div className={styles.field}><label>Last Name</label><input defaultValue="Libardo" /></div>
            </div>
            <div className={styles.dividerLine}></div>
            <div className={styles.formRow}>
                <div className={styles.field}><label>Email</label><input defaultValue="libardoluisito123@gmail.com" /></div>
                <div className={styles.field}><label>Phone</label><input defaultValue="+63 963 119 0422" /></div>
            </div>
            <div className={styles.field}><label>Address</label><input defaultValue="Brgy. Linao, Inopacan, Leyte, Philippines" /></div>
            <div className={styles.field}><label>Emergency Contact</label><input defaultValue="+63 985 567 7277" /></div>
        </div>
    )
}

function AcademicInfo() {
    return (
        <div className={styles.academicGrid}>
            <div className={styles.infoCard}>
                <h4>Academic Details</h4>
                <dl className={styles.detailsList}>
                    <div><dt>Student ID:</dt><dd>22-1-01580</dd></div>
                    <div><dt>Major:</dt><dd>Computer Science</dd></div>
                    <div><dt>Academic Year:</dt><dd>Senior</dd></div>
                    <div><dt>Current GPA:</dt><dd>2.0</dd></div>
                    <div><dt>Enrollment Date:</dt><dd>August 2025</dd></div>
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
    return (
        <div className={styles.container}>
            <Topbar onLogout={onLogout} />
            <main className={styles.main}>
                <h1 className={styles.welcome}>Welcome, Luisito</h1>
                <p className={styles.subtitle}>Manage your student profile and academic information</p>
                <Tabs value={tab} onChange={setTab} />

                <section className={styles.section}>
                    {tab === 'Overview' && <Overview />}
                    {tab === 'Profile Management' && <ProfileManagement />}
                    {tab === 'Academic Info' && <AcademicInfo />}
                </section>
            </main>
        </div>
    )
}
