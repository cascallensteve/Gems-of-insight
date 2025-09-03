import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPlus, FaEdit, FaTrash, FaUsers, FaEnvelope, FaPhone, 
  FaMapMarkerAlt, FaGraduationCap, FaDownload, FaFilePdf, 
  FaSearch, FaFilter
} from 'react-icons/fa';
import apiService from '../../services/api';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', banner: '', cost: '' });
  const [editingCourse, setEditingCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadCourses();
    loadEnrollments();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await apiService.courses.listCourses();
      const list = Array.isArray(response?.courses) ? response.courses : (Array.isArray(response) ? response : []);
      const processed = list.map(course => ({
        ...course,
        banner: course.banner && !String(course.banner).startsWith('http')
          ? `https://res.cloudinary.com/dqvsjtkqw/${course.banner}`
          : course.banner
      }));
      setCourses(processed);
    } catch (e) {
      console.error('Failed to load courses:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadEnrollments = () => {
    try {
      setEnrollmentsLoading(true);
      const stored = localStorage.getItem('courseEnrollments');
      if (!stored) {
        setEnrollments([]);
        return;
      }
      const parsed = JSON.parse(stored);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      const normalized = list.map((enr, idx) => ({
        ...enr,
        id: enr.id || `ENR-${Date.now()}-${idx + 1}`,
        enrollmentDate: enr.enrollmentDate || new Date().toISOString(),
        status: enr.status || 'Active'
      }));
      setEnrollments(normalized);
    } catch (e) {
      console.error('Failed to load enrollments:', e);
      setEnrollments([]);
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString('en-KE', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const formatCurrency = (amount) => {
    const n = Number(amount || 0);
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await apiService.courses.editCourse(editingCourse.id, courseForm);
      } else {
        await apiService.courses.addCourse({ ...courseForm, cost: Number(courseForm.cost) });
      }
      setCourseForm({ title: '', description: '', banner: '', cost: '' });
      setEditingCourse(null);
      setShowForm(false);
      loadCourses();
    } catch (e) {
      console.error('Failed to save course:', e);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title || '',
      description: course.description || '',
      banner: course.banner || '',
      cost: course.cost ?? ''
    });
    setShowForm(true);
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await apiService.courses.deleteCourse(id);
      loadCourses();
    } catch (e) {
      console.error('Failed to delete course:', e);
    }
  };

  const filteredEnrollments = enrollments.filter((enr) => {
    const s = searchTerm.trim().toLowerCase();
    const matchesSearch = !s || [
      enr.firstName, enr.otherNames, enr.email, enr.phoneNumber, enr.selectedModule
    ].some(v => String(v || '').toLowerCase().includes(s));
    const matchesStatus = filterStatus === 'all' || (enr.status || '').toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const downloadCSV = () => {
    const headers = [
      'ID','First Name','Other Names','Gender','Year of Birth','Email','Phone','Other Phone','Address','City','Country','Church','Membership Duration','Course','Cost','Enrollment Date','Status'
    ];
    const rows = filteredEnrollments.map(enr => ([
      enr.id,
      enr.firstName || '',
      enr.otherNames || '',
      enr.gender || '',
      enr.yearOfBirth || '',
      enr.email || '',
      enr.phoneNumber || '',
      enr.otherNumber || '',
      (enr.homeAddress || '').replace(/,/g, ' '),
      enr.city || '',
      enr.country || '',
      (enr.church || '').replace(/,/g, ' '),
      (enr.membershipDuration || '').replace(/,/g, ' '),
      (enr.selectedModule || '').replace(/,/g, ' '),
      enr.courseCost || '',
      formatDate(enr.enrollmentDate),
      enr.status || 'Active'
    ].join(',')));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `course-enrollments-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const w = window.open('', '_blank');
    const table = document.querySelector('.enrollments-table');
    const html = table ? table.outerHTML : '<p>No enrollments</p>';
    w.document.write(`<!doctype html><html><head><title>Course Enrollments</title>
      <style>
        body{font-family:Arial,sans-serif;margin:24px}
        h1{margin:0 0 8px;color:#333}
        p{margin:0 0 12px;color:#666}
        table{width:100%;border-collapse:collapse;font-size:12px}
        th,td{border:1px solid #ddd;padding:8px;text-align:left}
        th{background:#f5f7fa}
        .status-badge{padding:2px 6px;border-radius:10px;font-size:10px}
        .active{background:#d4edda;color:#155724;border:1px solid #c3e6cb}
        .pending{background:#fff3cd;color:#856404;border:1px solid #ffeaa7}
        .completed{background:#d1ecf1;color:#0c5460;border:1px solid #bee5eb}
      </style>
    </head><body>
      <h1>Course Enrollments</h1>
      <p>Generated on ${new Date().toLocaleString()}</p>
      ${html}
    </body></html>`);
    w.document.close();
    w.print();
  };

  const renderCoursesTab = () => (
    <div className="courses-section">
      <div className="section-header">
        <h2>Course Management</h2>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="add-course-btn" onClick={() => { setShowForm(true); setEditingCourse(null); setCourseForm({ title: '', description: '', banner: '', cost: '' }); }}>
          <FaPlus /> Add Course
        </motion.button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="course-form-container">
          <form onSubmit={handleCourseSubmit} className="course-form">
            <h3>{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
            <div className="form-group">
              <label>Title</label>
              <input value={courseForm.title} onChange={(e)=>setCourseForm({ ...courseForm, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={courseForm.description} onChange={(e)=>setCourseForm({ ...courseForm, description: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Banner URL</label>
              <input value={courseForm.banner} onChange={(e)=>setCourseForm({ ...courseForm, banner: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Cost (KES)</label>
              <input type="number" value={courseForm.cost} onChange={(e)=>setCourseForm({ ...courseForm, cost: e.target.value })} required />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">{editingCourse ? 'Update Course' : 'Add Course'}</button>
              <button type="button" className="cancel-btn" onClick={()=>{ setShowForm(false); setEditingCourse(null); setCourseForm({ title:'', description:'', banner:'', cost:'' }); }}>Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="loading-container"><div className="loading-spinner"></div><p>Loading courses...</p></div>
      ) : (
        <div className="courses-grid">
          {courses.map(course => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="course-card">
              <div className="course-image">
                <img src={course.banner} alt={course.title} onError={(e)=>{ e.currentTarget.src='https://via.placeholder.com/300x200?text=Course+Image'; }} />
              </div>
              <div className="course-content">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-meta">
                  <span className="course-cost">{formatCurrency(course.cost)}</span>
                  <span className="course-id">ID: {course.id}</span>
                </div>
                <div className="course-actions">
                  <button className="edit-btn" onClick={()=>handleEditCourse(course)}><FaEdit /> Edit</button>
                  <button className="delete-btn" onClick={()=>handleDeleteCourse(course.id)}><FaTrash /> Delete</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderEnrollmentsTab = () => (
    <div className="enrollments-section">
      <div className="enrollments-header">
        <div className="header-content">
          <h2>Student Enrollments</h2>
          <p>Manage and view all course enrollments</p>
        </div>
        <div className="header-actions">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="download-btn" onClick={downloadCSV}>
            <FaDownload /> Export CSV
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="print-btn" onClick={downloadPDF}>
            <FaFilePdf /> Download PDF
          </motion.button>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input placeholder="Search enrollments..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-dropdown">
          <FaFilter className="filter-icon" />
          <select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {enrollmentsLoading ? (
        <div className="loading-container"><div className="loading-spinner"></div><p>Loading enrollments...</p></div>
      ) : filteredEnrollments.length === 0 ? (
        <div className="empty-state"><FaUsers className="empty-icon" /><h3>No Enrollments Found</h3><p>No student enrollments match your search criteria.</p></div>
      ) : (
        <div className="enrollments-table-container">
          <div className="table-header"><h3>Enrollment Details ({filteredEnrollments.length} students)</h3><div className="table-actions"><span className="export-info">Ready to export</span></div></div>
          <div className="enrollments-table-wrapper">
            <table className="enrollments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Contact</th>
                  <th>Course</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.map((enr, i) => (
                  <tr key={enr.id || i} className="enrollment-row">
                    <td className="enrollment-id">{enr.id || `ENR-${i+1}`}</td>
                    <td className="student-info">
                      <div className="student-name">{enr.firstName || 'N/A'}</div>
                      <div className="other-names">{enr.otherNames || 'No other names'}</div>
                      <div className="personal-details">
                        <span className="detail-item"><span className="detail-label">Gender:</span><span className="detail-value">{enr.gender || 'N/A'}</span></span>
                        <span className="detail-item"><span className="detail-label">Age:</span><span className="detail-value">{enr.yearOfBirth ? new Date().getFullYear() - Number(enr.yearOfBirth) : 'N/A'}</span></span>
                      </div>
                    </td>
                    <td className="contact-info">
                      <div className="contact-item"><FaEnvelope className="contact-icon" /><span>{enr.email || 'N/A'}</span></div>
                      <div className="contact-item"><FaPhone className="contact-icon" /><span>{enr.phoneNumber || 'N/A'}</span></div>
                      {enr.otherNumber && (<div className="contact-item"><FaPhone className="contact-icon" /><span>{enr.otherNumber}</span></div>)}
                    </td>
                    <td className="course-details">
                      <div className="course-title">{enr.selectedModule || 'N/A'}</div>
                      <div className="course-info">
                        <span>Cost: {formatCurrency(enr.courseCost || 0)}</span>
                        {enr.church && <span>Church: {enr.church}</span>}
                      </div>
                    </td>
                    <td className="address-info">
                      <div className="address-item"><FaMapMarkerAlt className="contact-icon" /><span>{enr.city || 'N/A'}, {enr.country || 'N/A'}</span></div>
                      {enr.homeAddress && (<div className="address-item"><span className="address-label">Address:</span><span className="address-value">{enr.homeAddress}</span></div>)}
                    </td>
                    <td className="enrollment-date">{formatDate(enr.enrollmentDate)}</td>
                    <td className="enrollment-status"><span className={`status-badge ${String(enr.status || 'active').toLowerCase()}`}>{enr.status || 'Active'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="admin-courses">
      <div className="tab-navigation">
        <button className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`} onClick={()=>setActiveTab('courses')}>
          <FaGraduationCap /> Courses
        </button>
        <button className={`tab-button ${activeTab === 'enrollments' ? 'active' : ''}`} onClick={()=>setActiveTab('enrollments')}>
          <FaUsers /> Enrollments ({enrollments.length})
        </button>
      </div>

      {activeTab === 'courses' ? renderCoursesTab() : renderEnrollmentsTab()}
    </div>
  );
};

export default Courses;
