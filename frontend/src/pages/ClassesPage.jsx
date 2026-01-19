import React, { useState, useEffect } from 'react';
import { classesAPI, studentsAPI } from '../services/api';

function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classStudents, setClassStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    day_of_week: '0',
    start_time: '',
    end_time: '',
    active: true
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await classesAPI.getAll();
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setMessage({ type: 'error', text: 'Failed to fetch classes' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await studentsAPI.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchClassStudents = async (classId) => {
    try {
      const response = await classesAPI.getStudentsInClass(classId);
      setClassStudents(response.data);
    } catch (error) {
      console.error('Error fetching class students:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.start_time || !formData.end_time) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }

    setLoading(true);
    try {
      const classData = {
        ...formData,
        day_of_week: parseInt(formData.day_of_week),
        active: formData.active ? 1 : 0
      };

      if (editingClass) {
        await classesAPI.update(editingClass.id, classData);
        setMessage({ type: 'success', text: 'Class updated successfully' });
      } else {
        await classesAPI.create(classData);
        setMessage({ type: 'success', text: 'Class created successfully' });
      }

      fetchClasses();
      setShowModal(false);
      setEditingClass(null);
      setFormData({ name: '', day_of_week: '0', start_time: '', end_time: '', active: true });

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Operation failed';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (classData) => {
    setEditingClass(classData);
    setFormData({
      name: classData.name,
      day_of_week: classData.day_of_week.toString(),
      start_time: classData.start_time,
      end_time: classData.end_time,
      active: classData.active === 1
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) {
      return;
    }

    setLoading(true);
    try {
      await classesAPI.delete(id);
      setMessage({ type: 'success', text: 'Class deleted successfully' });
      fetchClasses();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to delete class';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingClass(null);
    setFormData({ name: '', day_of_week: '0', start_time: '', end_time: '', active: true });
    setShowModal(true);
  };

  const openEnrollModal = async (classData) => {
    setSelectedClass(classData);
    await fetchClassStudents(classData.id);
    setShowEnrollModal(true);
  };

  const handleEnrollStudent = async (studentId) => {
    try {
      await classesAPI.addStudent(selectedClass.id, studentId);
      setMessage({ type: 'success', text: 'Student enrolled successfully' });
      await fetchClassStudents(selectedClass.id);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to enroll student';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      await classesAPI.removeStudent(selectedClass.id, studentId);
      setMessage({ type: 'success', text: 'Student removed successfully' });
      await fetchClassStudents(selectedClass.id);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to remove student';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const getDayName = (dayNum) => {
    return daysOfWeek.find(d => d.value === dayNum)?.label || '';
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Class Schedule Management</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          Add New Class
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      {loading && !showModal && !showEnrollModal ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Day</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map(cls => (
              <tr key={cls.id}>
                <td>{cls.name}</td>
                <td>{getDayName(cls.day_of_week)}</td>
                <td>{cls.start_time} - {cls.end_time}</td>
                <td>
                  <span style={{ color: cls.active ? '#28a745' : '#dc3545' }}>
                    {cls.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-success btn-small"
                      onClick={() => openEnrollModal(cls)}
                    >
                      Manage Students
                    </button>
                    <button
                      className="btn btn-secondary btn-small"
                      onClick={() => handleEdit(cls)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => handleDelete(cls.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {classes.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
          No classes found. Click "Add New Class" to get started.
        </p>
      )}

      {/* Add/Edit Class Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingClass ? 'Edit Class' : 'Add New Class'}
              </h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Class Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Kids Karate, Adult Jiu-Jitsu"
                  required
                />
              </div>

              <div className="form-group">
                <label>Day of Week *</label>
                <select
                  value={formData.day_of_week}
                  onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                  required
                >
                  {daysOfWeek.map(day => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Start Time *</label>
                <input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Time *</label>
                <input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Active
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingClass ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enroll Students Modal */}
      {showEnrollModal && selectedClass && (
        <div className="modal-overlay" onClick={() => setShowEnrollModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h2 className="modal-title">
                Manage Students - {selectedClass.name}
              </h2>
              <button className="close-btn" onClick={() => setShowEnrollModal(false)}>
                &times;
              </button>
            </div>

            <div>
              <h3 style={{ marginBottom: '1rem' }}>Enrolled Students</h3>
              {classStudents.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classStudents.map(student => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.age}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-small"
                            onClick={() => handleRemoveStudent(student.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#666' }}>No students enrolled in this class yet.</p>
              )}

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Enroll New Student</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {students
                  .filter(student => !classStudents.find(cs => cs.id === student.id))
                  .map(student => (
                    <div
                      key={student.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    >
                      <span>{student.name} (Age: {student.age})</span>
                      <button
                        className="btn btn-success btn-small"
                        onClick={() => handleEnrollStudent(student.id)}
                      >
                        Enroll
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassesPage;
