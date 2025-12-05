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
    const programs = [
        {
            name: 'Computer Science',
            degree: 'Bachelor of Science',
            years: '4 years',
            dept: 'Computer Science',
            coordinator: 'Dr. Alice Johnson',
            credits: 120,
            enrollment: { active: 1, graduated: 0 },
            totalStudents: 1,
            description: 'Comprehensive program covering software development, algorithms, and computer systems.'
        },
        {
            name: 'Mathematics',
            degree: 'Bachelor of Science',
            years: '4 years',
            dept: 'Mathematics',
            coordinator: 'Prof. Mark Davis',
            credits: 120,
            enrollment: { active: 1, graduated: 0 },
            totalStudents: 1,
            description: 'Fundamental study of mathematical theories, analysis, and applied mathematics.'
        },
        {
            name: 'Physics',
            degree: 'Bachelor of Science',
            years: '4 years',
            dept: 'Physics',
            coordinator: 'Dr. Emily Chen',
            credits: 128,
            enrollment: { active: 1, graduated: 0 },
            totalStudents: 1,
            description: 'Exploration of fundamental physics principles and experimental methods.'
        },
        {
            name: 'Engineering',
            degree: 'Bachelor of Science',
            years: '4 years',
            dept: 'Engineering',
            coordinator: 'Dr. Robert Wilson',
            credits: 132,
            enrollment: { active: 1, graduated: 0 },
            totalStudents: 1,
            description: 'Technical applications of science and mathematical principles for design and build.'
        },
        {
            name: 'Business Administration',
            degree: 'Bachelor of Science',
            years: '4 years',
            dept: 'Business',
            coordinator: 'Prof. Sarah Davis',
            credits: 120,
            enrollment: { active: 0, graduated: 1 },
            totalStudents: 1,
            description: 'Comprehensive business education covering management, finance, and strategy.'
        }
    ]

    return (
        <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
                <div>
                    <h3>🎓 Student Management</h3>
                    <p className={styles.muted}>Manage faculty members and their course assignments</p>
                </div>
                <button className={styles.primaryBtn}>Add Student</button>
            </div>
            <div className={styles.searchBox}>
                <input placeholder="🔍 Search students..." />
            </div>
            <div className={styles.programGrid}>
                {programs.map((prog, i) => (
                    <div key={i} className={styles.degreeCard}>
                        <div className={styles.degreeHeader}>
                            <h4>{prog.name}</h4>
                            <span className={styles.degreeYears}>{prog.years}</span>
                        </div>
                        <div className={styles.degreeDegree}>{prog.degree}</div>

                        <div className={styles.degreeDetails}>
                            <div className={styles.detailItem}>
                                <strong>Department:</strong> {prog.dept}
                            </div>
                            <div className={styles.detailItem}>
                                <strong>Coordinator:</strong> {prog.coordinator}
                            </div>
                            <div className={styles.detailItem}>
                                <strong>Credits Required:</strong> {prog.credits}
                            </div>
                        </div>

                        <div className={styles.enrollmentSection}>
                            <div className={styles.enrollmentLabel}>Enrollment</div>
                            <div className={styles.enrollmentStats}>
                                <div className={styles.enrollStat}>
                                    <span className={styles.enrollBullet} style={{ background: '#28a745' }}>●</span>
                                    <span>Active {prog.enrollment.active}</span>
                                </div>
                                <div className={styles.enrollStat}>
                                    <span className={styles.enrollBullet} style={{ background: '#007bff' }}>●</span>
                                    <span>Graduated {prog.enrollment.graduated}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.degreeDescription}>
                            {prog.description}
                        </div>

                        <button className={styles.viewBtn}>View Program Students</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

function FacultyManagement() {
    const facultyMembers = [
        {
            name: 'Dr. Alice Johnson',
            title: 'Professor',
            department: 'Computer Science',
            email: 'alice.johnson@university.edu',
            phone: '+1 (555) 123-4567',
            officeHours: 'Mon/Wed 2-4 PM',
            coursesTeaching: ['Introduction to Programming', 'Data Structures', 'Advanced Algorithms'],
            status: 'Active',
            hireDate: 'August 2018'
        },
        {
            name: 'Prof. Mark Davis',
            title: 'Associate Professor',
            department: 'Mathematics',
            email: 'mark.davis@university.edu',
            phone: '+1 (555) 234-5678',
            officeHours: 'Tue/Thu 10-12 PM',
            coursesTeaching: ['Calculus II', 'Linear Algebra', 'Differential Equations'],
            status: 'Active',
            hireDate: 'January 2019'
        },
        {
            name: 'Dr. Emily Chen',
            title: 'Assistant Professor',
            department: 'Physics',
            email: 'emily.chen@university.edu',
            phone: '+1 (555) 345-6789',
            officeHours: 'Wed/Fri 1-3 PM',
            coursesTeaching: ['Quantum Mechanics', 'Thermodynamics', 'Modern Physics'],
            status: 'Active',
            hireDate: 'September 2020'
        },
        {
            name: 'Dr. Robert Wilson',
            title: 'Professor',
            department: 'Engineering',
            email: 'robert.wilson@university.edu',
            phone: '+1 (555) 456-7890',
            officeHours: 'Mon/Thu 3-5 PM',
            coursesTeaching: ['Engineering Mechanics', 'Materials Science', 'Design Engineering'],
            status: 'Active',
            hireDate: 'March 2017'
        },
        {
            name: 'Prof. Sarah Davis',
            title: 'Associate Professor',
            department: 'Business',
            email: 'sarah.davis@university.edu',
            phone: '+1 (555) 567-8901',
            officeHours: 'Tue/Fri 11-1 PM',
            coursesTeaching: ['Business Management', 'Marketing Strategy', 'Organizational Behavior'],
            status: 'On Leave',
            hireDate: 'July 2019'
        }
    ]

    return (
        <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
                <div>
                    <h3>👨‍🏫 Faculty Management</h3>
                    <p className={styles.muted}>Manage faculty members and their course assignments</p>
                </div>
                <button className={styles.primaryBtn}>Add Faculty</button>
            </div>
            <div className={styles.searchBox}>
                <input placeholder="🔍 Search faculty..." />
            </div>
            <div className={styles.programGrid}>
                {facultyMembers.map((faculty, i) => (
                    <div key={i} className={styles.facultyCard}>
                        <div className={styles.facultyHeader}>
                            <div className={styles.facultyAvatar}>
                                {faculty.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className={styles.facultyInfo}>
                                <h4>{faculty.name}</h4>
                                <div className={styles.facultyTitle}>{faculty.title}</div>
                            </div>
                            <span className={`${styles.facultyStatus} ${styles[faculty.status.toLowerCase().replace(' ', '')]}`}>
                                {faculty.status}
                            </span>
                        </div>

                        <div className={styles.facultyDetails}>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>📧 Email:</span>
                                <span className={styles.detailValue}>{faculty.email}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>📞 Phone:</span>
                                <span className={styles.detailValue}>{faculty.phone}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>🏢 Department:</span>
                                <span className={styles.detailValue}>{faculty.department}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>🕐 Office Hours:</span>
                                <span className={styles.detailValue}>{faculty.officeHours}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>📅 Hire Date:</span>
                                <span className={styles.detailValue}>{faculty.hireDate}</span>
                            </div>
                        </div>

                        <div className={styles.coursesSection}>
                            <div className={styles.coursesLabel}>📚 Courses Teaching:</div>
                            <div className={styles.coursesList}>
                                {faculty.coursesTeaching.map((course, idx) => (
                                    <span key={idx} className={styles.courseTag}>{course}</span>
                                ))}
                            </div>
                        </div>

                        <div className={styles.facultyActions}>
                            <button className={styles.actionBtnSecondary}>✏️ Edit Profile</button>
                            <button className={styles.actionBtnSecondary}>📋 View Schedule</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function Communications() {
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

                        <button className={styles.createAnnouncementBtn}>✉️ Create New Announcement</button>
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
                    <button className={styles.secondaryBtn}>➕ Add Academic Event</button>
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
                    {tab === 'Faculty Management' && <FacultyManagement />}
                    {tab === 'Communications' && <Communications />}
                    {tab === 'Analytics & Reports' && <AnalyticsReports />}
                    {tab === 'Settings' && <Settings />}
                </section>
            </main>
        </div>
    )
}
