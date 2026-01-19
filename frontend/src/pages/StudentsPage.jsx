import React, { useState, useEffect } from 'react';
import { studentsAPI } from '../services/api';

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ name: '', age: '', nfc_token: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentsAPI.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      setMessage({ type: 'error', text: 'Failed to fetch students' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.age) {
      setMessage({ type: 'error', text: 'Name and age are required' });
      return;
    }

    setLoading(true);
    try {
      if (editingStudent) {
        await studentsAPI.update(editingStudent.id, formData);
        setMessage({ type: 'success', text: 'Student updated successfully' });
      } else {
        await studentsAPI.create(formData);
        setMessage({ type: 'success', text: 'Student created successfully' });
      }

      fetchStudents();
      setShowModal(false);
      setEditingStudent(null);
      setFormData({ name: '', age: '', nfc_token: '' });

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Operation failed';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      age: student.age,
      nfc_token: student.nfc_token || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    setLoading(true);
    try {
      await studentsAPI.delete(id);
      setMessage({ type: 'success', text: 'Student deleted successfully' });
      fetchStudents();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to delete student';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setFormData({ name: '', age: '', nfc_token: '' });
    setShowModal(true);
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Students Management</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          Add New Student
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      {loading && !showModal ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>NFC Token</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.nfc_token || 'N/A'}</td>
                <td>{new Date(student.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-secondary btn-small"
                      onClick={() => handleEdit(student)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => handleDelete(student.id)}
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

      {students.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
          No students found. Click "Add New Student" to get started.
        </p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>NFC Token (Optional)</label>
                <input
                  type="text"
                  value={formData.nfc_token}
                  onChange={(e) => setFormData({ ...formData, nfc_token: e.target.value })}
                  placeholder="NFC token for check-in"
                />
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
                  {editingStudent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentsPage;
