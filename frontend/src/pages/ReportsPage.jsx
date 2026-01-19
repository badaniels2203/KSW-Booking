import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../services/api';

function ReportsPage() {
  const [activeTab, setActiveTab] = useState('monthly');
  const [monthlyReport, setMonthlyReport] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    if (activeTab === 'monthly') {
      fetchMonthlyReport();
    }
  }, [selectedYear, selectedMonth, activeTab]);

  const fetchMonthlyReport = async () => {
    setLoading(true);
    try {
      const response = await attendanceAPI.getMonthlyReport(selectedYear, selectedMonth);
      setMonthlyReport(response.data);
    } catch (error) {
      console.error('Error fetching monthly report:', error);
      setMessage({ type: 'error', text: 'Failed to fetch monthly report' });
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceHistory = async () => {
    if (!startDate || !endDate) {
      setMessage({ type: 'error', text: 'Please select both start and end dates' });
      return;
    }

    setLoading(true);
    try {
      const response = await attendanceAPI.getByDateRange(startDate, endDate);
      setAttendanceHistory(response.data);
      setMessage({ type: '', text: '' });
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      setMessage({ type: 'error', text: 'Failed to fetch attendance history' });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data, filename) => {
    if (data.length === 0) {
      setMessage({ type: 'error', text: 'No data to export' });
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header] || '';
        // Escape commas and quotes in values
        return typeof value === 'string' && (value.includes(',') || value.includes('"'))
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportMonthlyReport = () => {
    const monthName = months.find(m => m.value === selectedMonth)?.label;
    exportToCSV(monthlyReport, `attendance_report_${monthName}_${selectedYear}.csv`);
  };

  const exportAttendanceHistory = () => {
    exportToCSV(attendanceHistory, `attendance_history_${startDate}_to_${endDate}.csv`);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Attendance Reports</h1>

      {message.text && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #ddd' }}>
        <button
          className={`btn ${activeTab === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('monthly')}
          style={{ borderRadius: '4px 4px 0 0' }}
        >
          Monthly Billing Report
        </button>
        <button
          className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('history')}
          style={{ borderRadius: '4px 4px 0 0' }}
        >
          Attendance History
        </button>
      </div>

      {/* Monthly Report Tab */}
      {activeTab === 'monthly' && (
        <div>
          <div className="card">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                <label>Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                <label>Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="btn btn-success"
                onClick={exportMonthlyReport}
                style={{ marginTop: '1.5rem' }}
              >
                Export to CSV
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Age</th>
                    <th>Total Attendance</th>
                    <th>Classes Attended</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyReport.map(record => (
                    <tr key={record.student_id}>
                      <td>{record.student_name}</td>
                      <td>{record.student_age}</td>
                      <td>
                        <strong style={{ color: '#28a745' }}>
                          {record.total_attendance || 0} sessions
                        </strong>
                      </td>
                      <td>{record.classes_attended || 'No classes'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {monthlyReport.length === 0 && (
                <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
                  No attendance records found for the selected period.
                </p>
              )}

              {/* Summary */}
              {monthlyReport.length > 0 && (
                <div className="card" style={{ marginTop: '2rem' }}>
                  <h3>Summary</h3>
                  <p><strong>Total Students:</strong> {monthlyReport.length}</p>
                  <p>
                    <strong>Total Sessions:</strong>{' '}
                    {monthlyReport.reduce((sum, record) => sum + (record.total_attendance || 0), 0)}
                  </p>
                  <p>
                    <strong>Average Attendance per Student:</strong>{' '}
                    {(monthlyReport.reduce((sum, record) => sum + (record.total_attendance || 0), 0) / monthlyReport.length).toFixed(2)}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Attendance History Tab */}
      {activeTab === 'history' && (
        <div>
          <div className="card">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={fetchAttendanceHistory}
              >
                Generate Report
              </button>

              {attendanceHistory.length > 0 && (
                <button
                  className="btn btn-success"
                  onClick={exportAttendanceHistory}
                >
                  Export to CSV
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : attendanceHistory.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Check-in Time</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.map(record => (
                  <tr key={record.id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.student_name}</td>
                    <td>{record.class_name}</td>
                    <td>{new Date(record.check_in_time).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
              Select a date range and click "Generate Report" to view attendance history.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ReportsPage;
