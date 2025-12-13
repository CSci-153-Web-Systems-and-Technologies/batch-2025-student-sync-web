import React, { useState, useEffect } from 'react'
import styles from './AdminDashboard.module.css'
import { useAuth, useDegreePrograms, useFaculty, useStudents, useCourses } from './hooks/useSupabase'
import {
    degreePrograms as apiDegreePrograms,
    courses as apiCourses,
    auth as apiAuth,
    students as apiStudents,
    faculty as apiFaculty,
    users as apiUsers,
    announcements as apiAnnouncements,
    calendarEvents as apiCalendar
    ,
    courseSections as apiCourseSections
} from './supabase'

function Topbar({ name, onLogout, onSearch, theme, onToggleTheme }) {
    return (
        <header className={styles.topbar}>
            <div className={styles.brand}>
                <span className={styles.shield} aria-hidden>🛡️</span>
                <div className={styles.brandText}>Admin Portal</div>
            </div>

            <div className={styles.topbarCenter}>
                <input
                    className={styles.topSearch}
                    placeholder="Search students, courses, programs..."
                    onChange={e => onSearch && onSearch(e.target.value)}
                    aria-label="Search admin dashboard"
                />
            </div>

            <div className={styles.userActions}>
                <button className={styles.iconBtn} title="Notifications" aria-label="Notifications">🔔</button>
                <button className={styles.iconBtn} title="Quick Add" aria-label="Quick add" onClick={() => (typeof window.__openAddForm === 'function' ? window.__openAddForm('program') : null)}>➕</button>
                <button className={styles.themeBtn} onClick={onToggleTheme} aria-pressed={theme === 'dark'} title="Toggle theme">{theme === 'dark' ? '🌙' : '☀️'}</button>
                <div className={styles.user}>
                    <span className={styles.welcomeName}>Hi, {name || 'Admin'}</span>
                    <button className={styles.logout} onClick={() => onLogout && onLogout()}>Logout</button>
                </div>
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
    // replaced prompt-based add with top-level form via onOpen
    return (
        <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
                <div>
                    <h3>🎓 Degree Programs</h3>
                    <p className={styles.muted}>Click on any program to view all students enrolled in that degree program</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.primaryBtn} onClick={() => (typeof window.__openAddForm === 'function' ? window.__openAddForm('program') : null)}>Add Programs</button>
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
    // replaced prompt-based add with top-level form via onOpenAdd


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
                    <button className={styles.primaryBtn} onClick={() => (typeof window.__openAddForm === 'function' ? window.__openAddForm('course') : null)}>Add Courses</button>
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
    // replaced prompt-based add with top-level form via onOpenAdd



    return (
        <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
                <div>
                    <h3>🎓 Student Management</h3>
                    <p className={styles.muted}>Search and manage student records</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.primaryBtn} onClick={() => (typeof window.__openAddForm === 'function' ? window.__openAddForm('student') : null)}>Add Student</button>
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
    // replaced prompt-based add with top-level form via onOpenAdd
    const [editingFaculty, setEditingFaculty] = React.useState(null)
    const [sections, setSections] = React.useState([])
    const [loadingSections, setLoadingSections] = React.useState(false)
    const [selectedSectionIds, setSelectedSectionIds] = React.useState([])
    const [savingFaculty, setSavingFaculty] = React.useState(false)

    const openEdit = async (f) => {
        setEditingFaculty(f)
        setSavingFaculty(false)
        // load all sections and mark those assigned to this faculty
        setLoadingSections(true)
        try {
            const { data } = await apiCourseSections.getSections()
            setSections(data || [])
            const assigned = (data || []).filter(s => s.faculty && s.faculty.id === f.id).map(s => s.id)
            setSelectedSectionIds(assigned)
        } catch (e) {
            console.error('Failed to load sections', e)
            setSections([])
            setSelectedSectionIds([])
        } finally {
            setLoadingSections(false)
        }
    }

    const closeEdit = () => {
        setEditingFaculty(null)
        setSelectedSectionIds([])
    }

    const toggleSection = (sectionId) => {
        setSelectedSectionIds(prev => prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId])
    }

    const saveFacultyAssignments = async () => {
        if (!editingFaculty) return
        setSavingFaculty(true)
        try {
            // For simplicity, update course_sections to set faculty_id where selected, and clear faculty_id where unselected
            // Assign selected sections (set faculty_id)
            for (const id of selectedSectionIds) {
                const { data, error } = await apiCourseSectionsRawUpdate(id, editingFaculty.id)
                if (error) throw error
            }

            // clear faculty_id on sections not selected but previously assigned to this faculty
            const unassign = (sections || []).filter(s => s.faculty && s.faculty.id === editingFaculty.id && !selectedSectionIds.includes(s.id)).map(s => s.id)
            for (const id of unassign) {
                await apiCourseSectionsRawUpdate(id, null)
            }

            // Update faculty table (department, title)
            if (editingFaculty && editingFaculty.id) {
                const updates = { department: editingFaculty.department, title: editingFaculty.title }
                const { data, error } = await apiFaculty.updateFaculty(editingFaculty.id, updates)
                if (error) throw error
            }

            // Update linked users profile (name, email, phone) if present
            try {
                const uid = editingFaculty.id
                if (uid && editingFaculty.user) {
                    const { first_name, last_name, email, phone } = editingFaculty.user
                    const { data: udata, error: uerr } = await apiUsers.updateProfile(uid, { first_name, last_name, email, phone })
                    if (uerr) throw uerr
                }
            } catch (ue) {
                console.warn('Failed updating user profile', ue)
            }

            closeEdit()
        } catch (e) {
            console.error('Failed saving faculty assignments', e)
            alert('Failed saving assignments: ' + (e.message || e))
        } finally {
            setSavingFaculty(false)
        }
    }

    // helper using supabase client directly to update course_sections.faculty_id
    const apiCourseSectionsRawUpdate = async (sectionId, facultyId) => {
        const { data, error } = await (await import('./supabase')).default
            .from('course_sections')
            .update({ faculty_id: facultyId })
            .eq('id', sectionId)
            .select()
            .single()
        return { data, error }
    }

    return (
        <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
                <div>
                    <h3>👨‍🏫 Faculty Management</h3>
                    <p className={styles.muted}>Manage faculty members and their course assignments</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.primaryBtn} onClick={() => (typeof window.__openAddForm === 'function' ? window.__openAddForm('faculty') : null)}>Add Faculty</button>
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
                    // If this faculty is being edited show inline edit card
                    if (editingFaculty && editingFaculty.id === f.id) {
                        return (
                            <div key={f.id || i} className={styles.facultyCard}>
                                <div style={{ padding: 12 }}>
                                    <h4>Edit Profile for {name}</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                        <label className={styles.formRow}>First Name<input className={styles.input} value={editingFaculty.user?.first_name || ''} onChange={e => setEditingFaculty(it => ({ ...it, user: { ...(it.user||{}), first_name: e.target.value } }))} /></label>
                                        <label className={styles.formRow}>Last Name<input className={styles.input} value={editingFaculty.user?.last_name || ''} onChange={e => setEditingFaculty(it => ({ ...it, user: { ...(it.user||{}), last_name: e.target.value } }))} /></label>
                                        <label className={styles.formRow}>Email<input className={styles.input} value={editingFaculty.user?.email || ''} onChange={e => setEditingFaculty(it => ({ ...it, user: { ...(it.user||{}), email: e.target.value } }))} /></label>
                                        <label className={styles.formRow}>Phone<input className={styles.input} value={editingFaculty.user?.phone || editingFaculty.phone || ''} onChange={e => setEditingFaculty(it => ({ ...it, user: { ...(it.user||{}), phone: e.target.value }, phone: e.target.value }))} /></label>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                                        <label className={styles.formRow}>Title<input className={styles.input} value={editingFaculty.title || ''} onChange={e => setEditingFaculty(it => ({ ...it, title: e.target.value }))} /></label>
                                        <label className={styles.formRow}>Department<input className={styles.input} value={editingFaculty.department || ''} onChange={e => setEditingFaculty(it => ({ ...it, department: e.target.value }))} /></label>
                                    </div>

                                    <div style={{ marginTop: 10 }}>
                                        <h5 style={{ marginBottom: 8 }}>Assigned Sections</h5>
                                        <div style={{ maxHeight: 160, overflowY: 'auto', border: '1px solid #eee', padding: 8 }}>
                                            {(sections || []).map(s => (
                                                <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                                                    <input type="checkbox" checked={selectedSectionIds.includes(s.id)} onChange={() => toggleSection(s.id)} />
                                                    <div style={{ fontSize: 13 }}>{s.course?.code || s.course?.name} — {s.section_number || s.section || s.id} <span style={{ color: '#666', fontSize: 12 }}>({s.term?.name || ''})</span></div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                                        <button className={styles.primaryBtn} onClick={saveFacultyAssignments} disabled={savingFaculty}>{savingFaculty ? 'Saving…' : 'Save'}</button>
                                        <button className={styles.secondaryBtn} onClick={closeEdit}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )
                    }

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
                                <button className={styles.actionBtnSecondary} onClick={() => openEdit(f)}>✏️ Edit Profile</button>
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
    const [title, setTitle] = React.useState('')
    const [content, setContent] = React.useState('')
    const [audience, setAudience] = React.useState('all')
    const [messageType, setMessageType] = React.useState('email')
    const [sending, setSending] = React.useState(false)

    const handleCreateAnnouncement = async (e) => {
        e && e.preventDefault()
        if (!title || !content) {
            alert('Please provide a title and message body.')
            return
        }

        setSending(true)
        try {
            const { data, error } = await apiAnnouncements.createAnnouncement({
                title,
                content,
                target_audience: audience,
                published_at: new Date().toISOString(),
                is_active: true,
                meta: { messageType }
            })
            if (error) throw error
            alert('Announcement created')
            setTitle('')
            setContent('')
            setAudience('all')
            setMessageType('email')
        } catch (err) {
            alert('Error creating announcement: ' + (err.message || err))
        } finally {
            setSending(false)
        }
    }

    return (
        <div className={styles.contentSection}>
            <div className={styles.communicationsGrid}>
                <div className={styles.announcementSection}>
                    <h3>📢 Send Announcements</h3>
                    <p className={styles.muted}>Create and send announcements to students and faculty</p>

                    <form className={styles.announcementForm} onSubmit={handleCreateAnnouncement}>
                        <div className={styles.formSection}>
                            <h4>Message</h4>
                            <label className={styles.formRow}>
                                <input className={styles.input} placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                            </label>
                            <label className={styles.formRow}>
                                <textarea className={styles.input} placeholder="Message body" value={content} onChange={e => setContent(e.target.value)} rows={6} required />
                            </label>
                        </div>

                        <div className={styles.formSection}>
                            <h4>Recipient Group</h4>
                            <div className={styles.recipientOptions}>
                                <label className={styles.radioOption}><input type="radio" name="recipient" checked={audience === 'all'} onChange={() => setAudience('all')} /><span>👥 All Students</span></label>
                                <label className={styles.radioOption}><input type="radio" name="recipient" checked={audience === 'faculty'} onChange={() => setAudience('faculty')} /><span>👨‍🏫 All Faculty</span></label>
                            </div>
                            <div className={styles.recipientOptions} style={{ marginTop: 8 }}>
                                <label className={styles.radioOption}><input type="radio" name="recipient2" checked={audience === 'course'} onChange={() => setAudience('course')} /><span>📚 By Course</span></label>
                                <label className={styles.radioOption}><input type="radio" name="recipient2" checked={audience === 'program'} onChange={() => setAudience('program')} /><span>🎓 By Major</span></label>
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            <h4>Delivery</h4>
                            <div className={styles.recipientOptions}>
                                <label className={styles.radioOption}><input type="radio" name="messageType" checked={messageType === 'email'} onChange={() => setMessageType('email')} /><span>📧 Email</span></label>
                                <label className={styles.radioOption}><input type="radio" name="messageType" checked={messageType === 'push'} onChange={() => setMessageType('push')} /><span>🔔 Push Notification</span></label>
                            </div>
                        </div>

                        <div style={{ marginTop: 12 }}>
                            <button className={styles.createAnnouncementBtn} type="submit" disabled={sending}>{sending ? 'Sending…' : '✉️ Send Announcement'}</button>
                        </div>
                    </form>
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
                    {editingFaculty && (
                        <div className={styles.addOverlay} role="dialog" aria-modal="true">
                            <div className={styles.addCard} style={{ maxWidth: 800 }}>
                                <div className={styles.addHeader}>
                                    <h3>Edit Faculty — {editingFaculty.user ? `${editingFaculty.user.first_name} ${editingFaculty.user.last_name}` : editingFaculty.id}</h3>
                                    <button className={styles.closeBtn} onClick={closeEdit} aria-label="Close">✖</button>
                                </div>

                                <div style={{ padding: 12 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                        <label className={styles.formRow}>First Name<input className={styles.input} value={editingFaculty.user?.first_name || ''} onChange={e => setEditingFaculty(f => ({ ...f, user: { ...(f.user || {}), first_name: e.target.value } }))} /></label>
                                        <label className={styles.formRow}>Last Name<input className={styles.input} value={editingFaculty.user?.last_name || ''} onChange={e => setEditingFaculty(f => ({ ...f, user: { ...(f.user || {}), last_name: e.target.value } }))} /></label>
                                        <label className={styles.formRow}>Email<input className={styles.input} value={editingFaculty.user?.email || ''} onChange={e => setEditingFaculty(f => ({ ...f, user: { ...(f.user || {}), email: e.target.value } }))} /></label>
                                        <label className={styles.formRow}>Phone<input className={styles.input} value={editingFaculty.user?.phone || editingFaculty.phone || ''} onChange={e => setEditingFaculty(f => ({ ...f, user: { ...(f.user || {}), phone: e.target.value }, phone: e.target.value }))} /></label>
                                    </div>

                                    <label className={styles.formRow}>Title<input className={styles.input} value={editingFaculty.title || ''} onChange={e => setEditingFaculty(f => ({ ...f, title: e.target.value }))} /></label>
                                    <label className={styles.formRow}>Department<input className={styles.input} value={editingFaculty.department || ''} onChange={e => setEditingFaculty(f => ({ ...f, department: e.target.value }))} /></label>

                                    <div style={{ marginTop: 10 }}>
                                        <h4 style={{ marginBottom: 8 }}>Assign Sections</h4>
                                        {loadingSections ? <div>Loading sections…</div> : (
                                            <div style={{ maxHeight: 260, overflowY: 'auto', border: '1px solid #eee', padding: 8 }}>
                                                {(sections || []).map(s => (
                                                    <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 4px' }}>
                                                        <input type="checkbox" checked={selectedSectionIds.includes(s.id)} onChange={() => toggleSection(s.id)} />
                                                        <div style={{ fontSize: 14 }}>{s.course?.code || s.course?.name} — {s.section_number || s.section || s.id} <span style={{ color: '#666', fontSize: 12 }}>({s.term?.name || ''})</span></div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                                        <button className={styles.primaryBtn} onClick={saveFacultyAssignments} disabled={savingFaculty}>{savingFaculty ? 'Saving…' : 'Save'}</button>
                                        <button className={styles.secondaryBtn} onClick={closeEdit}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.calendarSection}>
                <h3>📅 Academic Calendar</h3>
                <p className={styles.muted}>Manage important dates and academic events</p>

                <div className={styles.calendarActions}>
                    <button className={styles.secondaryBtn} onClick={() => window.__openAddForm('event', {})}>➕ Add Academic Event</button>
                    <button className={styles.secondaryBtn} onClick={() => window.__openAddForm('event', { event_type: 'exam' })}>📅 Exam Schedule</button>
                    <button className={styles.secondaryBtn} onClick={() => window.__openAddForm('event', { event_type: 'deadline' })}>📆 Academic Deadlines</button>
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
                <p className={styles.muted}>Essential administrative tasks and quick add forms</p>
                <div className={styles.actionGrid}>
                    <button className={styles.actionCard} onClick={() => (typeof window.__openAddForm === 'function' ? window.__openAddForm('program') : null)}>
                        <span>➕ Add Program</span>
                    </button>
                    <button className={styles.actionCard} onClick={() => (typeof window.__openAddForm === 'function' ? window.__openAddForm('course') : null)}>
                        <span>➕ Add Course</span>
                    </button>
                    <button className={styles.actionCard} onClick={() => (typeof window.__openAddForm === 'function' ? window.__openAddForm('student') : null)}>
                        <span>➕ Add Student</span>
                    </button>
                    <button className={styles.actionCard} onClick={() => (typeof window.__openAddForm === 'function' ? window.__openAddForm('faculty') : null)}>
                        <span>➕ Add Faculty</span>
                    </button>
                    <button className={styles.actionCard} onClick={() => alert('Import Data')}>
                        <span>📥 Import Data</span>
                    </button>
                    <button className={styles.actionCard} onClick={() => alert('Export Data')}>
                        <span>📤 Export Data</span>
                    </button>
                    <button className={styles.actionCard} onClick={() => alert('Backup System')}>
                        <span>💾 Backup System</span>
                    </button>
                    <button className={styles.actionCard} onClick={() => alert('Security Check')}>
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
    const [theme, setTheme] = useState(() => {
        try { return localStorage.getItem('admin:theme') || 'light' } catch (e) { return 'light' }
    })
    useEffect(() => { try { localStorage.setItem('admin:theme', theme) } catch (e) { } }, [theme])
    const handleToggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))
    const handleSearch = q => { /* lightweight: could be wired to filters */ console.log('Admin search:', q) }

    // Add-form state and opener exposed globally for internal callers in-file
    const [addForm, setAddForm] = useState({ open: false, type: null, data: {}, loading: false })

    useEffect(() => {
        window.__openAddForm = (type, defaults = {}) => setAddForm({ open: true, type, data: defaults, loading: false })
        return () => { try { delete window.__openAddForm } catch (e) { } }
    }, [])

    const closeAddForm = () => setAddForm({ open: false, type: null, data: {}, loading: false })

    const handleAddSubmit = async (payload) => {
        if (!addForm.type) return
        setAddForm(s => ({ ...s, loading: true }))
        try {
            if (addForm.type === 'program') {
                const { data, error } = await apiDegreePrograms.createProgram(payload)
                if (error) throw error
            } else if (addForm.type === 'course') {
                const { data, error } = await apiCourses.createCourse(payload)
                if (error) throw error
            } else if (addForm.type === 'student') {
                const { data, error } = await apiStudents.createStudent(payload)
                if (error) throw error
            } else if (addForm.type === 'faculty') {
                const { data, error } = await apiFaculty.createFaculty(payload)
                if (error) throw error
            } else if (addForm.type === 'event') {
                const { data, error } = await apiCalendar.createEvent(payload)
                if (error) throw error
            }
            alert(`${addForm.type.charAt(0).toUpperCase() + addForm.type.slice(1)} created`)
            closeAddForm()
            window.location.reload()
        } catch (e) {
            alert('Error creating: ' + (e.message || e))
            setAddForm(s => ({ ...s, loading: false }))
        }
    }

    return (
        <div className={`${styles.container} ${theme === 'dark' ? styles.dark : ''}`} data-theme={theme}>
            <Topbar name={adminName} onLogout={onLogout} onSearch={handleSearch} theme={theme} onToggleTheme={handleToggleTheme} />
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
                {addForm.open && (
                    <div className={styles.addOverlay} role="dialog" aria-modal="true">
                        <div className={styles.addCard}>
                            <div className={styles.addHeader}>
                                <h3>Add {addForm.type}</h3>
                                <button className={styles.closeBtn} onClick={closeAddForm} aria-label="Close">✖</button>
                            </div>

                            <AddForm
                                type={addForm.type}
                                defaultData={addForm.data}
                                onCancel={closeAddForm}
                                onSubmit={handleAddSubmit}
                                loading={addForm.loading}
                                programs={programs}
                                courses={courses}
                                facultyList={faculty}
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

function AddForm({ type, defaultData = {}, onCancel, onSubmit, loading, programs = [], courses = [], facultyList = [] }) {
    const [form, setForm] = useState(defaultData || {})
    useEffect(() => setForm(defaultData || {}), [defaultData, type])

    const onChange = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

    const handleSubmit = (e) => {
        e.preventDefault()
        const payload = { ...form }
        // normalize credits/year fields to numbers when present
        if (payload.credits) payload.credits = parseInt(payload.credits, 10) || 0
        if (type === 'event') {
            // ensure dates
            if (payload.start_date && !payload.end_date) payload.end_date = payload.start_date
            payload.is_all_day = !!payload.is_all_day
        }
        onSubmit(payload)
    }

    // derive helper lists
    const programOptions = (programs || []).map(p => ({ id: p.id, label: `${p.code || p.name} — ${p.name}` }))
    const deptSet = new Set()
        ; (courses || []).forEach(c => c.department && deptSet.add(c.department))
        ; (facultyList || []).forEach(f => f.department && deptSet.add(f.department))
    const departmentOptions = Array.from(deptSet).map(d => ({ id: d, label: d }))

    return (
        <form className={styles.addForm} onSubmit={handleSubmit}>
            {type === 'program' && (
                <>
                    <label className={styles.formRow}>Name<input className={styles.input} value={form.name || ''} onChange={onChange('name')} required /></label>
                    <label className={styles.formRow}>Code<input className={styles.input} value={form.code || ''} onChange={onChange('code')} required /></label>
                    <label className={styles.formRow}>Department
                        <select className={styles.input} value={departmentOptions.find(d => d.id === form.department) ? form.department : 'other'} onChange={e => {
                            const v = e.target.value
                            if (v === 'other') setForm(f => ({ ...f, department: '' }))
                            else setForm(f => ({ ...f, department: v }))
                        }}>
                            <option value="">— select —</option>
                            {departmentOptions.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                            <option value="other">Other</option>
                        </select>
                        {form.department === '' && <input className={styles.input} placeholder="Custom department" value={form.department || ''} onChange={onChange('department')} />}
                    </label>
                    <label className={styles.formRow}>Coordinator<input className={styles.input} value={form.coordinator || ''} onChange={onChange('coordinator')} /></label>
                    <label className={styles.formRow}>Total Credits<input className={styles.input} value={form.total_credits || form.totalCredits || ''} onChange={onChange('total_credits')} /></label>
                </>
            )}

            {type === 'course' && (
                <>
                    <label className={styles.formRow}>Name<input className={styles.input} value={form.name || ''} onChange={onChange('name')} required /></label>
                    <label className={styles.formRow}>Code<input className={styles.input} value={form.code || ''} onChange={onChange('code')} /></label>
                    <label className={styles.formRow}>Credits
                        <select className={styles.input} value={form.credits || ''} onChange={onChange('credits')}>
                            <option value="">— select —</option>
                            {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </label>
                    <label className={styles.formRow}>Department
                        <select className={styles.input} value={departmentOptions.find(d => d.id === form.dept) ? form.dept : 'other'} onChange={e => {
                            const v = e.target.value
                            if (v === 'other') setForm(f => ({ ...f, dept: '' }))
                            else setForm(f => ({ ...f, dept: v }))
                        }}>
                            <option value="">— select —</option>
                            {departmentOptions.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                            <option value="other">Other</option>
                        </select>
                        {form.dept === '' && <input className={styles.input} placeholder="Custom department" value={form.dept || ''} onChange={onChange('dept')} />}
                    </label>
                    <label className={styles.formRow}>Coordinator<input className={styles.input} value={form.coordinator || ''} onChange={onChange('coordinator')} /></label>
                </>
            )}

            {type === 'student' && (
                <>
                    <label className={styles.formRow}>Email<input type="email" className={styles.input} value={form.email || ''} onChange={onChange('email')} required /></label>
                    <label className={styles.formRow}>First name<input className={styles.input} value={form.first_name || ''} onChange={onChange('first_name')} /></label>
                    <label className={styles.formRow}>Last name<input className={styles.input} value={form.last_name || ''} onChange={onChange('last_name')} /></label>
                    <label className={styles.formRow}>Student ID<input className={styles.input} value={form.student_number || ''} onChange={onChange('student_number')} /></label>
                    <label className={styles.formRow}>Program
                        <select className={styles.input} value={form.program_id || form.program || ''} onChange={e => setForm(f => ({ ...f, program_id: e.target.value }))}>
                            <option value="">— select program —</option>
                            {programOptions.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                        </select>
                    </label>
                    <label className={styles.formRow}>Year level
                        <select className={styles.input} value={form.year_level || ''} onChange={onChange('year_level')}>
                            <option value="">— select —</option>
                            {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </label>
                </>
            )}

            {type === 'faculty' && (
                <>
                    <label className={styles.formRow}>Email<input type="email" className={styles.input} value={form.email || ''} onChange={onChange('email')} required /></label>
                    <label className={styles.formRow}>First name<input className={styles.input} value={form.first_name || ''} onChange={onChange('first_name')} /></label>
                    <label className={styles.formRow}>Last name<input className={styles.input} value={form.last_name || ''} onChange={onChange('last_name')} /></label>
                    <label className={styles.formRow}>Title<input className={styles.input} value={form.title || ''} onChange={onChange('title')} /></label>
                    <label className={styles.formRow}>Department
                        <select className={styles.input} value={form.department || ''} onChange={onChange('department')}>
                            <option value="">— select —</option>
                            {departmentOptions.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                            <option value="other">Other</option>
                        </select>
                        {form.department === '' && <input className={styles.input} placeholder="Custom department" value={form.department || ''} onChange={onChange('department')} />}
                    </label>
                    <label className={styles.formRow}>Phone<input className={styles.input} value={form.phone || ''} onChange={onChange('phone')} /></label>
                </>
            )}

            {type === 'event' && (
                <>
                    <label className={styles.formRow}>Title<input className={styles.input} value={form.title || ''} onChange={onChange('title')} required /></label>
                    <label className={styles.formRow}>Description<textarea className={styles.input} rows={4} value={form.description || ''} onChange={onChange('description')} /></label>
                    <label className={styles.formRow}>Type
                        <select className={styles.input} value={form.event_type || 'other'} onChange={onChange('event_type')}>
                            <option value="other">Other</option>
                            <option value="holiday">Holiday</option>
                            <option value="exam">Exam</option>
                            <option value="registration">Registration</option>
                            <option value="deadline">Deadline</option>
                            <option value="ceremony">Ceremony</option>
                        </select>
                    </label>
                    <label className={styles.formRow}>Start date<input type="date" className={styles.input} value={form.start_date || ''} onChange={onChange('start_date')} required /></label>
                    <label className={styles.formRow}>End date<input type="date" className={styles.input} value={form.end_date || ''} onChange={onChange('end_date')} /></label>
                    <label className={styles.formRow}>All day
                        <input type="checkbox" checked={!!form.is_all_day} onChange={e => setForm(f => ({ ...f, is_all_day: e.target.checked }))} />
                    </label>
                    <label className={styles.formRow}>Location<input className={styles.input} value={form.location || ''} onChange={onChange('location')} /></label>
                </>
            )}

            <div className={styles.formActions}>
                <button type="button" className={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
                <button type="submit" className={styles.primaryBtn} disabled={loading}>{loading ? 'Saving...' : 'Create'}</button>
            </div>
        </form>
    )
}
