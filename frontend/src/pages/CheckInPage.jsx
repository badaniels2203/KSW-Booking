import React, { useState, useEffect } from 'react';
import { studentsAPI, classesAPI, attendanceAPI } from '../services/api';

function CheckInPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentClasses, setCurrentClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCurrentClasses();
    fetchAllStudents();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else if (selectedClass) {
      // Show students enrolled in the selected class
      fetchClassStudents(selectedClass.id);
    } else {
      setFilteredStudents([]);
    }
  }, [searchTerm, students, selectedClass]);

  const fetchCurrentClasses = async () => {
    try {
      const response = await classesAPI.getCurrent();
      const classes = response.data;

      if (classes && classes.length > 0) {
        setCurrentClasses(classes);
        setSelectedClass(classes[0]);
      } else {
        // If no current class, get upcoming class
        const upcomingResponse = await classesAPI.getUpcoming();
        if (upcomingResponse.data) {
          setCurrentClasses([upcomingResponse.data]);
          setSelectedClass(upcomingResponse.data);
        }
      }
    } catch (error) {
      console.error('Error fetching current classes:', error);
    }
  };

  const fetchAllStudents = async () => {
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
      setFilteredStudents(response.data);
    } catch (error) {
      console.error('Error fetching class students:', error);
    }
  };

  const handleCheckIn = async (student) => {
    if (!selectedClass) {
      setMessage({ type: 'error', text: 'No class selected. Please select a class first.' });
      return;
    }

    setLoading(true);
    try {
      await attendanceAPI.checkIn({
        student_id: student.id,
        class_id: selectedClass.id,
      });
      setMessage({ type: 'success', text: `${student.name} checked in successfully!` });
      setSearchTerm('');

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to check in';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Student Check-In</h1>

      {message.text && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      {/* Current Class Display */}
      {currentClasses.length > 0 && (
        <div className="card">
          <h2 className="card-title">Current/Upcoming Class</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {currentClasses.map(cls => (
              <button
                key={cls.id}
                className={`btn ${selectedClass?.id === cls.id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedClass(cls)}
              >
                {cls.name}
              </button>
            ))}
          </div>
          {selectedClass && (
            <p style={{ marginTop: '1rem', color: '#666' }}>
              {getDayName(selectedClass.day_of_week)} {selectedClass.start_time} - {selectedClass.end_time}
            </p>
          )}
        </div>
      )}

      {/* Search Box */}
      <input
        type="text"
        className="search-box"
        placeholder="Type student name to check in..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Students Grid */}
      {filteredStudents.length > 0 ? (
        <div className="student-grid">
          {filteredStudents.map(student => (
            <div
              key={student.id}
              className="student-card"
              onClick={() => handleCheckIn(student)}
            >
              <div className="student-name">{student.name}</div>
              <div className="student-age">Age: {student.age}</div>
            </div>
          ))}
        </div>
      ) : searchTerm ? (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
          No students found matching "{searchTerm}"
        </p>
      ) : selectedClass ? (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
          Showing students enrolled in {selectedClass.name}. Start typing to search all students.
        </p>
      ) : (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
          No active classes at the moment. Please contact the administrator.
        </p>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}

function getDayName(dayNum) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNum];
}

export default CheckInPage;
