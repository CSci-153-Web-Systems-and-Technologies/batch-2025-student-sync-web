import React, { useState } from 'react'
import styles from './AdminDashboard.module.css'

function Topbar({ onLogout }) {
    return (
        <header className={styles.topbar}>
            <div className={styles.brand}>
                <span className={styles.shield}>🛡️</span> Admin Portal
            </div>
            <div className={styles.user}>
                <span>Welcome, luisitojay33</span>
                <button className={styles.logout} onClick={() => onLogout && onLogout()}>Logout</button>
            </div>
        </header>
    )
}

function Tabs({ value, onChange }) {
    const tabs = ['Degree Programs', 'Course Management', 'Student Management', 'Faculty Management', 'Communications', 'Analytics & Reports', 'Settings']
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

function StatCards() {
    return (
        <div className={styles.statCards}>
            <div className={styles.statCard}>
                <div className={styles.statInfo}>
                    <div className={styles.statLabel}>Total Students</div>
                    <div className={styles.statValue}>5</div>
                </div>
                <div className={styles.statIcon}>👥</div>
            </div>
            <div className={styles.statCard}>
                <div className={styles.statInfo}>
                    <div className={styles.statLabel}>Active Students</div>
                    <div className={styles.statValue}>5</div>
                </div>
                <div className={styles.statIcon}>✓</div>
            </div>
            <div className={styles.statCard}>
                <div className={styles.statInfo}>
                    <div className={styles.statLabel}>Graduates</div>
                    <div className={styles.statValue}>3</div>
                </div>
                <div className={styles.statIcon}>🎓</div>
            </div>
            <div className={styles.statCard}>
                <div className={styles.statInfo}>
                    <div className={styles.statLabel}>Average GPA</div>
                    <div className={styles.statValue}>2.56</div>
                </div>
                <div className={styles.statIcon}>📈</div>
            </div>
        </div>
    )
}

function DegreePrograms() {
    const programs = [
        { name: 'Computer Science', degree: 'Bachelor of Science', dept: 'Computer Science', coordinator: 'Dr. Alice Johnson', credits: 120, enrollment: 20 },
        { name: 'Mathematics', degree: 'Bachelor of Science', dept: 'Mathematics', coordinator: 'Prof. Damon Salvatore', credits: 120, enrollment: 30 },
        { name: 'Physics', degree: 'Bachelor of Science', dept: 'Physics', coordinator: 'Dr. Stefan Gilbert', credits: 125, enrollment: 20 },
        { name: 'Engineering', degree: 'Bachelor of Science', dept: 'Engineering', coordinator: 'Prof. Angelo Fernandez', credits: 120, enrollment: 30 }
    ]

    return (
        <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
                <div>
                    <h3>🎓 Degree Programs</h3>
                    <p className={styles.muted}>Click on any program to view all students enrolled in that degree program</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.secondaryBtn}>Import Programs</button>
                    <button className={styles.primaryBtn}>Add Programs</button>
                </div>
            </div>
            <div className={styles.programGrid}>
                {programs.map((prog, i) => (
                    <div key={i} className={styles.programCard}>
                        <h4>{prog.name}</h4>
                        <div className={styles.programDegree}>{prog.degree}</div>
                        <div className={styles.programDetails}>
                            <div className={styles.detailItem}>Department: {prog.dept}</div>
                            <div className={styles.detailItem}>Coordinator: {prog.coordinator}</div>
                            <div className={styles.detailItem}>Credits Required: {prog.credits}</div>
                            <div className={styles.detailItem}>Enrollment: {prog.enrollment} students</div>
                        </div>
                        <button className={styles.viewBtn}>View Student Program</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

function CourseManagement() {
    const courses = [
        { name: 'Computer Science', degree: 'Bachelor of Science', dept: 'Computer Science', coordinator: 'Dr. Alice Johnson', credits: 120, enrollment: '25/30' },
        { name: 'Mathematics', degree: 'Bachelor of Science', dept: 'Mathematics', coordinator: 'Prof. Damon Salvatore', credits: 120, enrollment: '20/30' },
        { name: 'Physics', degree: 'Bachelor of Science', dept: 'Physics', coordinator: 'Dr. Stefan Gilbert', credits: 125, enrollment: '5/20' },
        { name: 'Engineering', degree: 'Bachelor of Science', dept: 'Engineering', coordinator: 'Prof. Angelo Fernandez', credits: 120, enrollment: '28/30' }
    ]

    return (
        <div className={styles.contentSection}>
            <div className={styles.secondaryStats}>
                <div className={styles.smallStatCard}>
                    <div className={styles.statInfo}>
                        <div className={styles.statLabel}>Total Courses</div>
                        <div className={styles.statValue}>20</div>
                    </div>
                    <div className={styles.statIcon}>👥</div>
                </div>
                <div className={styles.smallStatCard}>
                    <div className={styles.statInfo}>
                        <div className={styles.statLabel}>Total Enrolled</div>
                        <div className={styles.statValue}>56</div>
                    </div>
                    <div className={styles.statIcon}>✓</div>
                </div>
                <div className={styles.smallStatCard}>
                    <div className={styles.statInfo}>
                        <div className={styles.statLabel}>Available Slot</div>
                        <div className={styles.statValue}>44</div>
                    </div>
                    <div className={styles.statIcon}>🎓</div>
                </div>
                <div className={styles.smallStatCard}>
                    <div className={styles.statInfo}>
                        <div className={styles.statLabel}>Active Faculty</div>
                        <div className={styles.statValue}>4</div>
                    </div>
                    <div className={styles.statIcon}>📈</div>
                </div>
            </div>

            <div className={styles.sectionHeader}>
                <div>
                    <h3>🎓 Course Management</h3>
                    <p className={styles.muted}>Click on any course to view detailed information and manage enrollments</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.secondaryBtn}>Import Courses</button>
                    <button className={styles.primaryBtn}>Add Courses</button>
                </div>
            </div>
            <div className={styles.searchBox}>
                <input placeholder="🔍 Search courses..." />
            </div>
            <div className={styles.programGrid}>
                {courses.map((course, i) => (
                    <div key={i} className={styles.programCard}>
                        <h4>{course.name}</h4>
                        <div className={styles.programDegree}>{course.degree}</div>
                        <div className={styles.programDetails}>
                            <div className={styles.detailItem}>Department: {course.dept}</div>
                            <div className={styles.detailItem}>Coordinator: {course.coordinator}</div>
                            <div className={styles.detailItem}>Credits Required: {course.credits}</div>
                            <div className={styles.detailItem}>Enrollment: {course.enrollment}</div>
                        </div>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: `${parseInt(course.enrollment) / parseInt(course.enrollment.split('/')[1]) * 100}%` }}></div>
                        </div>
                        <button className={styles.viewBtn}>View Course Detail</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

function StudentManagement() {
    const students = [
        { name: 'John Doe', email: 'john.doe@university.edu', id: 'STU2024001', major: 'Computer Science', year: 'Junior', gpa: '3.85', status: 'Active' },
        { name: 'Jane Smith', email: 'jane.smith@university.edu', id: 'STU2024002', major: 'Mathematics', year: 'Senior', gpa: '3.92', status: 'Active' },
        { name: 'Mike Johnson', email: 'mike.johnson@university.edu', id: 'STU2024003', major: 'Physics', year: 'Sophomore', gpa: '3.67', status: 'Inactive' },
        { name: 'Sarah Wilson', email: 'sarah.wilson@university.edu', id: 'STU2024004', major: 'Engineering', year: 'Freshman', gpa: '3.95', status: 'Active' },
        { name: 'Robert Brown', email: 'robert.brown@university.edu', id: 'STU2023001', major: 'Business', year: 'Alumni', gpa: '3.78', status: 'Graduated' }
    ]

    return (
        <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
                <div>
                    <h3>🎓 Student Management</h3>
                    <p className={styles.muted}>View and manage all student records</p>
                </div>
                <button className={styles.primaryBtn}>Add Student</button>
            </div>
            <div className={styles.searchBox}>
                <input placeholder="🔍 Search students..." />
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Student ID</th>
                            <th>Major</th>
                            <th>Year</th>
                            <th>GPA</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, i) => (
                            <tr key={i}>
                                <td>
                                    <div className={styles.studentCell}>
                                        <div className={styles.studentName}>{student.name}</div>
                                        <div className={styles.studentEmail}>{student.email}</div>
                                    </div>
                                </td>
                                <td>{student.id}</td>
                                <td>{student.major}</td>
                                <td>{student.year}</td>
                                <td>{student.gpa}</td>
                                <td><span className={`${styles.badge} ${styles[student.status.toLowerCase()]}`}>{student.status}</span></td>
                                <td>
                                    <div className={styles.actionBtns}>
                                        <button className={styles.iconBtn}>✏️</button>
                                        <button className={styles.iconBtn}>🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default function AdminDashboard({ onLogout }) {
    const [tab, setTab] = useState('Degree Programs')
    return (
        <div className={styles.container}>
            <Topbar onLogout={onLogout} />
            <main className={styles.main}>
                <h1 className={styles.welcome}>Admin Dashboard</h1>
                <p className={styles.subtitle}>Welcome back, Admin! Manage students and system settings</p>

                <StatCards />
                <Tabs value={tab} onChange={setTab} />

                <section className={styles.section}>
                    {tab === 'Degree Programs' && <DegreePrograms />}
                    {tab === 'Course Management' && <CourseManagement />}
                    {tab === 'Student Management' && <StudentManagement />}
                    {tab === 'Faculty Management' && <div className={styles.placeholder}>Faculty Management - Coming Soon</div>}
                    {tab === 'Communications' && <div className={styles.placeholder}>Communications - Coming Soon</div>}
                    {tab === 'Analytics & Reports' && <div className={styles.placeholder}>Analytics & Reports - Coming Soon</div>}
                    {tab === 'Settings' && <div className={styles.placeholder}>Settings - Coming Soon</div>}
                </section>
            </main>
        </div>
    )
}
