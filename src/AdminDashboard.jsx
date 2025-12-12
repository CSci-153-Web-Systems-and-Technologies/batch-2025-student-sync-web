import React, { useState } from 'react'
import styles from './AdminDashboard.module.css'
import { useAuth, useDegreePrograms, useFaculty, useStudents, useCourses } from './hooks/useSupabase'
import {
    degreePrograms as apiDegreePrograms,
    courses as apiCourses,
    auth as apiAuth,
    students as apiStudents,
    faculty as apiFaculty,
    announcements as apiAnnouncements,
    calendarEvents as apiCalendar
} from './supabase'

function Topbar({ name, onLogout }) {
    return (
        <header className={styles.topbar}>
            <div className={styles.brand}>
                <span className={styles.shield}>🛡️</span> Admin Portal
            </div>
            <div className={styles.user}>
                <span>Welcome, {name || 'Admin'}</span>
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

function StatCards({ totals }) {
    return (
        <div className={styles.statCards}>
            <div className={styles.statCard}>
                <div className={styles.statInfo}>
                    <div className={styles.statLabel}>Total Students</div>
                    <div className={styles.statValue}>{totals.totalStudents}</div>
                </div>
                <div className={styles.statIcon}>👥</div>
            </div>
            <div className={styles.statCard}>
                <div className={styles.statInfo}>
                    <div className={styles.statLabel}>Active Students</div>
                    <div className={styles.statValue}>{totals.activeStudents}</div>
                </div>
                <div className={styles.statIcon}>✓</div>
            </div>
            <div className={styles.statCard}>
                <div className={styles.statInfo}>
                    <div className={styles.statLabel}>Graduates</div>
                    <div className={styles.statValue}>{totals.graduates}</div>
                </div>
                <div className={styles.statIcon}>🎓</div>
            </div>
            <div className={styles.statCard}>
                <div className={styles.statInfo}>
                    <div className={styles.statLabel}>Average GPA</div>
                    <div className={styles.statValue}>{totals.avgGPA}</div>
                </div>
                <div className={styles.statIcon}>📈</div>
            </div>
        </div>
    )
}

function DegreePrograms({ programs = [] }) {
    const handleAddProgram = async () => {
        const name = window.prompt('Program name')
        if (!name) return
        try {
            const { data, error } = await apiDegreePrograms.createProgram({ name })
            if (error) throw error
            alert('Program created')
            window.location.reload()
        } catch (e) {
            alert('Error creating program: ' + (e.message || e))
        }
    }

    const handleImportPrograms = async () => {
        const json = window.prompt('Paste JSON array of programs')
        if (!json) return
        try {
            const arr = JSON.parse(json)
            for (const p of arr) {
                await apiDegreePrograms.createProgram(p)
            }
            alert('Imported programs')
            window.location.reload()
        } catch (e) {
            alert('Import failed: ' + (e.message || e))
        }
    }
    return (
        <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
                <div>
                    <h3>🎓 Degree Programs</h3>
                    <p className={styles.muted}>Click on any program to view all students enrolled in that degree program</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.secondaryBtn} onClick={handleImportPrograms}>Import Programs</button>
                    <button className={styles.primaryBtn} onClick={handleAddProgram}>Add Programs</button>
                </div>
            </div>
            <div className={styles.programGrid}>
                {(programs || []).map((prog, i) => (
                    <div key={prog.id || i} className={styles.programCard}>
                        <h4>{prog.name}</h4>
                        <div className={styles.programDegree}>{prog.degree || prog.name}</div>
                        <div className={styles.programDetails}>
                            <div className={styles.detailItem}>Department: {prog.department || prog.dept || '—'}</div>
                            <div className={styles.detailItem}>Coordinator: {prog.coordinator || '—'}</div>
                            <div className={styles.detailItem}>Credits Required: {prog.credits || prog.credit_hours || '—'}</div>
                            <div className={styles.detailItem}>Enrollment: {prog.enrollment_count ?? prog.enrollment ?? '-'} students</div>
                        </div>
                        <button className={styles.viewBtn}>View Student Program</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

function CourseManagement({ courses = [] }) {
    const handleAddCourse = async () => {
        const name = window.prompt('Course name')
        if (!name) return
        const code = window.prompt('Course code (e.g. CS101)') || ''
        const credits = window.prompt('Credits') || '3'
        try {
            const { data, error } = await apiCourses.createCourse({ name, code, credits: parseInt(credits, 10) })
            if (error) throw error
            alert('Course created')
            window.location.reload()
        } catch (e) {
            alert('Error creating course: ' + (e.message || e))
        }
    }

    const handleImportCourses = async () => {
        const json = window.prompt('Paste JSON array of courses')
        if (!json) return
        try {
            const arr = JSON.parse(json)
            for (const c of arr) {
                await apiCourses.createCourse(c)
            }
            alert('Imported courses')
            window.location.reload()
        } catch (e) {
            alert('Import failed: ' + (e.message || e))
        }
    }

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
                    <button className={styles.secondaryBtn} onClick={handleImportCourses}>Import Courses</button>
                    <button className={styles.primaryBtn} onClick={handleAddCourse}>Add Courses</button>
                </div>
            </div>
            <div className={styles.searchBox}>
                <input placeholder="🔍 Search courses..." />
            </div>
            <div className={styles.programGrid}>
                {(courses || []).map((course, i) => (
                    <div key={i} className={styles.programCard}>
                        <h4>{course.name}</h4>
                        <div className={styles.programDegree}>{course.degree}</div>
                        <div className={styles.programDetails}>
                            <div className={styles.detailItem}>Department: {course.dept}</div>
                            <div className={styles.detailItem}>Coordinator: {course.coordinator}</div>
                            <div className={styles.detailItem}>Credits Required: {course.credits}</div>
                            <div className={styles.detailItem}>Enrollment: {course.enrollment ?? course.enrollment_count ?? '-'}</div>
                        </div>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: `${course.fillPercent || 0}%` }}></div>
                        </div>
                        <button className={styles.viewBtn}>View Course Detail</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

function StudentManagement({ students = [] }) {
    const handleAddStudent = async () => {
        const email = window.prompt('Student email')
        if (!email) return
        const first_name = window.prompt('First name') || ''
        const last_name = window.prompt('Last name') || ''
        try {
            const { data, error } = await apiStudents.createStudent({ email, first_name, last_name })
            if (error) throw error
            alert('Student created')
            window.location.reload()
        } catch (e) {
            alert('Error creating student: ' + (e.message || e))
        }
    }

    const handleImportStudents = async () => {
        const json = window.prompt('Paste JSON array of students')
        if (!json) return
        try {
            const arr = JSON.parse(json)
            for (const s of arr) {
                await apiStudents.createStudent(s)
            }
            alert('Imported students')
            window.location.reload()
        } catch (e) {
            alert('Import failed: ' + (e.message || e))
        }
    }

    return (
        <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
                <div>
                    <h3>🎓 Student Management</h3>
                    <p className={styles.muted}>Search and manage student records</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.secondaryBtn} onClick={handleImportStudents}>Import Students</button>
                    <button className={styles.primaryBtn} onClick={handleAddStudent}>Add Student</button>
                </div>
            </div>
            <div className={styles.searchBox}>
                <input placeholder="🔍 Search students..." />
            </div>
            <div className={styles.programGrid}>
                {(students || []).map((s, i) => {
                    const name = s.user ? `${s.user.first_name || ''} ${s.user.last_name || ''}`.trim() : s.full_name || s.name || s.id
                    const program = s.program?.name || s.program || '—'
                    const year = s.year_level || '—'
                    const status = s.status || (s.is_active === false ? 'Inactive' : 'Active')
                    return (
                        <div key={s.id || i} className={styles.degreeCard}>
                            <div className={styles.degreeHeader}>
                                <h4>{name}</h4>
                                <span className={styles.degreeYears}>{year}</span>
                            </div>
                            <div className={styles.degreeDegree}>{program}</div>

                            <div className={styles.degreeDetails}>
                                <div className={styles.detailItem}>
                                    <strong>Status:</strong> {status}
                                </div>
                                <div className={styles.detailItem}>
                                    <strong>GPA:</strong> {s.gpa ?? '—'}
                                </div>
                                <div className={styles.detailItem}>
                                    <strong>Student ID:</strong> {s.student_number || s.id}
                                </div>
                            </div>

                            <div className={styles.degreeDescription}>
                                {s.notes || ''}
                            </div>

                            <button className={styles.viewBtn}>View Student</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function FacultyManagement({ faculty = [] }) {
    const handleAddFaculty = async () => {
        const email = window.prompt('Faculty email')
        if (!email) return
        const first_name = window.prompt('First name') || ''
        const last_name = window.prompt('Last name') || ''
        try {
            const { data, error } = await apiFaculty.createFaculty({ email, first_name, last_name })
            if (error) throw error
            alert('Faculty created')
            window.location.reload()
        } catch (e) {
            alert('Error creating faculty: ' + (e.message || e))
        }
    }

    const handleImportFaculty = async () => {
        const json = window.prompt('Paste JSON array of faculty members')
        if (!json) return
        try {
            const arr = JSON.parse(json)
            for (const f of arr) {
                await apiFaculty.createFaculty(f)
            }
            alert('Imported faculty')
            window.location.reload()
        } catch (e) {
            alert('Import failed: ' + (e.message || e))
        }
    }

    return (
        <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
                <div>
                    <h3>👨‍🏫 Faculty Management</h3>
                    <p className={styles.muted}>Manage faculty members and their course assignments</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.secondaryBtn} onClick={handleImportFaculty}>Import Faculty</button>
                    <button className={styles.primaryBtn} onClick={handleAddFaculty}>Add Faculty</button>
                </div>
            </div>
            <div className={styles.searchBox}>
                <input placeholder="🔍 Search faculty..." />
            </div>
            <div className={styles.programGrid}>
                {(faculty || []).map((f, i) => {
                    const name = f.user ? `${f.user.first_name || ''} ${f.user.last_name || ''}`.trim() : f.name || f.full_name || `Faculty ${i + 1}`
                    const title = f.title || f.position || 'Faculty'
                    const dept = f.department || f.dept || '—'
                    const email = f.user?.email || f.email || '—'
                    const phone = f.phone || '—'
                    const status = f.status || (f.is_active === false ? 'On Leave' : 'Active')
                    const coursesTeaching = f.courses || f.coursesTeaching || []
                    return (
                        <div key={f.id || i} className={styles.facultyCard}>
                            <div className={styles.facultyHeader}>
                                <div className={styles.facultyAvatar}>
                                    {name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className={styles.facultyInfo}>
                                    <h4>{name}</h4>
                                    <div className={styles.facultyTitle}>{title}</div>
                                </div>
                                <span className={`${styles.facultyStatus} ${styles[status.toLowerCase().replace(' ', '')]}`}>
                                    {status}
                                </span>
                            </div>

                            <div className={styles.facultyDetails}>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>📧 Email:</span>
                                    <span className={styles.detailValue}>{email}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>📞 Phone:</span>
                                    <span className={styles.detailValue}>{phone}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>🏢 Department:</span>
                                    <span className={styles.detailValue}>{dept}</span>
                                </div>
                            </div>

                            <div className={styles.coursesSection}>
                                <div className={styles.coursesLabel}>📚 Courses Teaching:</div>
                                <div className={styles.coursesList}>
                                    {(coursesTeaching || []).map((course, idx) => (
                                        <span key={idx} className={styles.courseTag}>{course.name || course}</span>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.facultyActions}>
                                <button className={styles.actionBtnSecondary}>✏️ Edit Profile</button>
                                <button className={styles.actionBtnSecondary}>📋 View Schedule</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function Communications() {
    const handleCreateAnnouncement = async () => {
        const title = window.prompt('Announcement title')
        if (!title) return
        const content = window.prompt('Message body') || ''
        const audience = window.prompt('Target audience (all, faculty, course:<code>, program:<id>)') || 'all'
        try {
            const { data, error } = await apiAnnouncements.createAnnouncement({ title, content, target_audience: audience, published_at: new Date().toISOString(), is_active: true })
            if (error) throw error
            alert('Announcement created')
            window.location.reload()
        } catch (e) {
            alert('Error creating announcement: ' + (e.message || e))
        }
    }
    return (
        <div className={styles.contentSection}>
            <div className={styles.communicationsGrid}>
                <div className={styles.announcementSection}>
                    <h3>📢 Send Announcements</h3>
                    <p className={styles.muted}>Create and send announcements to students and faculty</p>

                    <div className={styles.announcementForm}>
                        <div className={styles.formSection}>
                            <h4>Recipient Group</h4>
                            <div className={styles.recipientOptions}>
                                <label className={styles.radioOption}>
                                    <input type="radio" name="recipient" defaultChecked />
                                    <span>👥 All Students</span>
                                </label>
                                <label className={styles.radioOption}>
                                    <input type="radio" name="recipient" />
                                    <span>👨‍🏫 All Faculty</span>
                                </label>
                            </div>
                            <div className={styles.recipientOptions}>
                                <label className={styles.radioOption}>
                                    <input type="radio" name="recipient" />
                                    <span>📚 By Course</span>
                                </label>
                                <label className={styles.radioOption}>
                                    <input type="radio" name="recipient" />
                                    <span>🎓 By Major</span>
                                </label>
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            <h4>Message Type</h4>
                            <div className={styles.recipientOptions}>
                                <label className={styles.radioOption}>
                                    <input type="radio" name="messageType" defaultChecked />
                                    <span>📧 Email</span>
                                </label>
                                <label className={styles.radioOption}>
                                    <input type="radio" name="messageType" />
                                    <span>🔔 Push Notification</span>
                                </label>
                            </div>
                        </div>

                        <button className={styles.createAnnouncementBtn} onClick={handleCreateAnnouncement}>✉️ Create New Announcement</button>
                    </div>
                </div>

                <div className={styles.recentComms}>
                    <h3>💬 Recent Communications</h3>
                    <p className={styles.muted}>View recent messages and announcements</p>

                    <div className={styles.commsList}>
                        <div className={styles.commItem}>
                            <div className={styles.commHeader}>
                                <h4>Fall Semester Registration Opens</h4>
                                <span className={styles.commTime}>2 hours ago</span>
                            </div>
                            <p className={styles.commText}>Registration for fall 2024 semester begins next Monday. Students can access...</p>
                            <div className={styles.commFooter}>
                                <span className={styles.commBadge}>All Students</span>
                                <div className={styles.commActions}>
                                    <button className={styles.actionIcon}>✏️ Edit</button>
                                    <button className={styles.actionIcon}>👁️ View</button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.commItem}>
                            <div className={styles.commHeader}>
                                <h4>Faculty Meeting Reminder</h4>
                                <span className={styles.commTime}>1 day ago</span>
                            </div>
                            <p className={styles.commText}>Monthly faculty meeting scheduled for Friday at 3 PM in the conference room...</p>
                            <div className={styles.commFooter}>
                                <span className={styles.commBadge}>Faculty</span>
                                <div className={styles.commActions}>
                                    <button className={styles.actionIcon}>✏️ Edit</button>
                                    <button className={styles.actionIcon}>👁️ View</button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.commItem}>
                            <div className={styles.commHeader}>
                                <h4>CS 101 Assignment Due</h4>
                                <span className={styles.commTime}>3 days ago</span>
                            </div>
                            <p className={styles.commText}>Programming assignment for Introduction to Programming is due next week...</p>
                            <div className={styles.commFooter}>
                                <span className={styles.commBadge}>CS 101 Students</span>
                                <div className={styles.commActions}>
                                    <button className={styles.actionIcon}>✏️ Edit</button>
                                    <button className={styles.actionIcon}>👁️ View</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.calendarSection}>
                <h3>📅 Academic Calendar</h3>
                <p className={styles.muted}>Manage important dates and academic events</p>

                <div className={styles.calendarActions}>
                    <button className={styles.secondaryBtn} onClick={async () => {
                        const title = window.prompt('Event title')
                        if (!title) return
                        const start_date = window.prompt('Start date (YYYY-MM-DD)') || ''
                        const end_date = window.prompt('End date (YYYY-MM-DD)') || start_date
                        const description = window.prompt('Description') || ''
                        try {
                            const { data, error } = await apiCalendar.createEvent({ title, start_date, end_date, description })
                            if (error) throw error
                            alert('Event created')
                            window.location.reload()
                        } catch (e) {
                            alert('Error creating event: ' + (e.message || e))
                        }
                    }}>➕ Add Academic Event</button>
                    <button className={styles.secondaryBtn}>📅 Exam Schedule</button>
                    <button className={styles.secondaryBtn}>📆 Academic Deadlines</button>
                </div>

                <div className={styles.upcomingEvents}>
                    <h4>Upcoming Events</h4>
                    <div className={styles.eventsList}>
                        <div className={styles.eventItem}>
                            <div className={styles.eventInfo}>
                                <div className={styles.eventTitle}>Fall Registration Opens</div>
                                <div className={styles.eventDate}>Monday, October 21, 2024</div>
                            </div>
                            <span className={styles.eventBadge} style={{ background: '#6c5ce7', color: '#fff' }}>Upcoming</span>
                        </div>

                        <div className={styles.eventItem}>
                            <div className={styles.eventInfo}>
                                <div className={styles.eventTitle}>Midterm Exams</div>
                                <div className={styles.eventDate}>November 11-15, 2024</div>
                            </div>
                            <span className={styles.eventBadge} style={{ background: '#fdcb6e', color: '#2d3436' }}>Scheduled</span>
                        </div>

                        <div className={styles.eventItem}>
                            <div className={styles.eventInfo}>
                                <div className={styles.eventTitle}>Thanksgiving Break</div>
                                <div className={styles.eventDate}>November 25-29, 2024</div>
                            </div>
                            <span className={styles.eventBadge} style={{ background: '#fab1a0', color: '#2d3436' }}>Holiday</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AnalyticsReports() {
    return (
        <div className={styles.contentSection}>
            <div className={styles.analyticsGrid}>
                <div className={styles.analyticsCard}>
                    <h4>📊 Course Analytics</h4>
                    <p className={styles.muted}>Course enrollment and capacity metrics</p>
                    <div className={styles.courseMetrics}>
                        <div className={styles.metricItem}>
                            <span>Introduction to Programming</span>
                            <span className={styles.metricValue}>28/30</span>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '93%' }}></div>
                            </div>
                        </div>
                        <div className={styles.metricItem}>
                            <span>Calculus II</span>
                            <span className={styles.metricValue}>22/25</span>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '88%' }}></div>
                            </div>
                        </div>
                        <div className={styles.metricItem}>
                            <span>Quantum Mechanics</span>
                            <span className={styles.metricValue}>15/20</span>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '75%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.analyticsCard}>
                    <h4>📈 Performance Analytics</h4>
                    <p className={styles.muted}>Academic performance distribution</p>
                    <div className={styles.performanceList}>
                        <div className={styles.performanceItem}>
                            <span>Excellent (3.5+)</span>
                            <span className={styles.performanceValue}>4 students</span>
                        </div>
                        <div className={styles.performanceItem}>
                            <span>Good (3.0-3.5)</span>
                            <span className={styles.performanceValue}>1 student</span>
                        </div>
                        <div className={styles.performanceItem}>
                            <span>Fair (2.5-3.0)</span>
                            <span className={styles.performanceValue}>0 students</span>
                        </div>
                        <div className={styles.performanceItem}>
                            <span>Poor (&lt;2.5)</span>
                            <span className={styles.performanceValue}>0 students</span>
                        </div>
                    </div>
                </div>

                <div className={styles.analyticsCard}>
                    <h4>👥 Department Distribution</h4>
                    <p className={styles.muted}>Students by major/department</p>
                    <div className={styles.departmentList}>
                        <div className={styles.deptItem}>
                            <span>Computer Science</span>
                            <span className={styles.deptCount}>1</span>
                        </div>
                        <div className={styles.deptItem}>
                            <span>Mathematics</span>
                            <span className={styles.deptCount}>1</span>
                        </div>
                        <div className={styles.deptItem}>
                            <span>Physics</span>
                            <span className={styles.deptCount}>1</span>
                        </div>
                        <div className={styles.deptItem}>
                            <span>Engineering</span>
                            <span className={styles.deptCount}>1</span>
                        </div>
                        <div className={styles.deptItem}>
                            <span>Business</span>
                            <span className={styles.deptCount}>1</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.reportsSection}>
                <div className={styles.reportColumn}>
                    <h4>📄 Academic Reports</h4>
                    <p className={styles.muted}>Generate comprehensive academic reports</p>
                    <div className={styles.reportList}>
                        <button className={styles.reportItem}>📥 Complete Student Directory</button>
                        <button className={styles.reportItem}>📊 Course Enrollment Report</button>
                        <button className={styles.reportItem}>📈 GPA Analysis Report</button>
                        <button className={styles.reportItem}>🎓 Graduation Tracking</button>
                        <button className={styles.reportItem}>👨‍👩‍👧‍👦 Faculty Load Report</button>
                    </div>
                </div>

                <div className={styles.reportColumn}>
                    <h4>⚙️ System Reports</h4>
                    <p className={styles.muted}>Administrative and system analytics</p>
                    <div className={styles.reportList}>
                        <button className={styles.reportItem}>📅 Academic Calendar Export</button>
                        <button className={styles.reportItem}>💬 Communication Logs</button>
                        <button className={styles.reportItem}>📊 System Activity Report</button>
                        <button className={styles.reportItem}>💾 Data Backup Status</button>
                        <button className={styles.reportItem}>📊 Usage Statistics</button>
                    </div>
                </div>
            </div>

            <div className={styles.quickActions}>
                <h4>⚡ Quick Admin Actions</h4>
                <p className={styles.muted}>Essential administrative tasks and system management</p>
                <div className={styles.actionGrid}>
                    <button className={styles.actionCard}>
                        <span>📥 Import Data</span>
                    </button>
                    <button className={styles.actionCard}>
                        <span>📤 Export Data</span>
                    </button>
                    <button className={styles.actionCard}>
                        <span>💾 Backup System</span>
                    </button>
                    <button className={styles.actionCard}>
                        <span>🔒 Security Check</span>
                    </button>
                </div>
                <div className={styles.systemInfo}>
                    <div className={styles.infoItem}>
                        <span>System Status</span>
                        <span className={styles.statusHealthy}>● Healthy</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span>Last Backup</span>
                        <span>Today, 03:00 AM</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span>Active Users</span>
                        <span>24 online</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span>System Version</span>
                        <span>v2.1.0</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Settings() {
    return (
        <div className={styles.contentSection}>
            <h3>⚙️ Settings</h3>
            <p className={styles.muted}>Configure system settings and preferences</p>

            <div className={styles.settingsGrid}>
                <div className={styles.settingsCard}>
                    <h4>👤 Administrator Profile</h4>
                    <p className={styles.settingsMuted}>Manage your administrator account and preferences</p>
                    <div className={styles.formGroup}>
                        <label>First Name</label>
                        <input type="text" defaultValue="Admin" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Last Name</label>
                        <input type="text" defaultValue="User" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input type="email" defaultValue="admin@university.edu" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Role</label>
                        <input type="text" defaultValue="System Administrator" className={styles.input} disabled />
                    </div>
                    <button className={styles.primaryBtn}>💾 Change Password</button>
                </div>

                <div className={styles.settingsCard}>
                    <h4>🏛️ Institution Settings</h4>
                    <p className={styles.settingsMuted}>Update institution details and settings</p>
                    <div className={styles.formGroup}>
                        <label>Institution Name</label>
                        <input type="text" defaultValue="University of Excellence" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Institution Address</label>
                        <input type="text" defaultValue="123 University Ave, Education City" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Address</label>
                        <input type="text" defaultValue="456 Academic Blvd, Knowledge City" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Email Domain</label>
                        <input type="text" defaultValue="@university.edu" className={styles.input} />
                    </div>
                    <button className={styles.primaryBtn}>💾 Update Institution Info</button>
                </div>
            </div>

            <div className={styles.settingsSection}>
                <div className={styles.settingsCard}>
                    <h4>🔔 Notification Settings</h4>
                    <p className={styles.settingsMuted}>Control email and push alerts</p>
                    <div className={styles.toggleList}>
                        <div className={styles.toggleItem}>
                            <span>Email Notifications</span>
                            <label className={styles.toggle}>
                                <input type="checkbox" defaultChecked />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                        <div className={styles.toggleItem}>
                            <span>Student Registration Alerts</span>
                            <label className={styles.toggle}>
                                <input type="checkbox" defaultChecked />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                        <div className={styles.toggleItem}>
                            <span>System Maintenance Alerts</span>
                            <label className={styles.toggle}>
                                <input type="checkbox" defaultChecked />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                        <div className={styles.toggleItem}>
                            <span>Security Alerts</span>
                            <label className={styles.toggle}>
                                <input type="checkbox" defaultChecked />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className={styles.settingsCard}>
                    <h4>📚 Academic Calendar Settings</h4>
                    <p className={styles.settingsMuted}>Manage academic terms and schedule settings</p>
                    <div className={styles.formGroup}>
                        <label>Current Academic Year</label>
                        <select className={styles.select}>
                            <option>Fall 2025</option>
                            <option>Spring 2026</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Current Semester</label>
                        <select className={styles.select}>
                            <option>Fall 2025</option>
                            <option>Spring 2026</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Registration Start Date</label>
                        <input type="date" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Semester Start Date</label>
                        <input type="date" defaultValue="2025-08-15" className={styles.input} />
                    </div>
                    <button className={styles.primaryBtn}>💾 Update Academic Settings</button>
                </div>
            </div>

            <div className={styles.dangerZone}>
                <h4>⚠️ Advanced Configuration</h4>
                <p className={styles.settingsMuted}>Advanced system configuration for experienced administrators</p>
                <div className={styles.dangerActions}>
                    <button className={styles.dangerBtn}>🔧 System Configuration</button>
                    <button className={styles.dangerBtn}>🎓 Academic Settings</button>
                    <button className={styles.dangerBtn}>🔐 Security Configuration</button>
                    <button className={styles.dangerBtn}>🛡️ System Audit Settings</button>
                </div>
            </div>
        </div>
    )
}

export default function AdminDashboard({ onLogout }) {
    const [tab, setTab] = useState('Degree Programs')
    const { user } = useAuth()
    const { programs, loading: programsLoading } = useDegreePrograms()
    const { faculty, loading: facultyLoading } = useFaculty()
    const { students, loading: studentsLoading } = useStudents()
    const { courses, loading: coursesLoading } = useCourses()

    const totalStudents = (students || []).length
    const activeStudents = (students || []).filter(s => s.is_active !== false).length
    const graduates = (students || []).filter(s => s.is_graduated || s.status === 'graduated').length
    const gpaValues = (students || []).map(s => parseFloat(s.gpa)).filter(n => !isNaN(n))
    const avgGPA = gpaValues.length ? (gpaValues.reduce((a, b) => a + b, 0) / gpaValues.length).toFixed(2) : '—'

    const totals = {
        totalStudents,
        activeStudents,
        graduates,
        avgGPA
    }

    const adminName = user?.email?.split('@')[0]

    return (
        <div className={styles.container}>
            <Topbar name={adminName} onLogout={onLogout} />
            <main className={styles.main}>
                <h1 className={styles.welcome}>Admin Dashboard</h1>
                <p className={styles.subtitle}>Welcome back, Admin! Manage students and system settings</p>

                <StatCards totals={totals} />
                <Tabs value={tab} onChange={setTab} />

                <section className={styles.section}>
                    {tab === 'Degree Programs' && <DegreePrograms programs={programs} />}
                    {tab === 'Course Management' && <CourseManagement courses={courses} />}
                    {tab === 'Student Management' && <StudentManagement students={students} />}
                    {tab === 'Faculty Management' && <FacultyManagement faculty={faculty} />}
                    {tab === 'Communications' && <Communications />}
                    {tab === 'Analytics & Reports' && <AnalyticsReports />}
                    {tab === 'Settings' && <Settings />}
                </section>
            </main>
        </div>
    )
}
