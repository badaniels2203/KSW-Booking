import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Students API
export const studentsAPI = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (student) => api.post('/students', student),
  update: (id, student) => api.put(`/students/${id}`, student),
  delete: (id) => api.delete(`/students/${id}`),
  search: (name) => api.get(`/students/search?name=${name}`),
  getByNfcToken: (token) => api.get(`/students/nfc/${token}`),
};

// Classes API
export const classesAPI = {
  getAll: () => api.get('/classes'),
  getActive: () => api.get('/classes/active'),
  getCurrent: () => api.get('/classes/current'),
  getUpcoming: () => api.get('/classes/upcoming'),
  getById: (id) => api.get(`/classes/${id}`),
  getStudentsInClass: (id) => api.get(`/classes/${id}/students`),
  create: (classData) => api.post('/classes', classData),
  update: (id, classData) => api.put(`/classes/${id}`, classData),
  delete: (id) => api.delete(`/classes/${id}`),
  addStudent: (classId, studentId) => api.post(`/classes/${classId}/students`, { student_id: studentId }),
  removeStudent: (classId, studentId) => api.delete(`/classes/${classId}/students`, { data: { student_id: studentId } }),
};

// Attendance API
export const attendanceAPI = {
  getAll: () => api.get('/attendance'),
  getById: (id) => api.get(`/attendance/${id}`),
  checkIn: (data) => api.post('/attendance/checkin', data),
  getByDateRange: (startDate, endDate) => api.get(`/attendance/daterange?start_date=${startDate}&end_date=${endDate}`),
  getByStudent: (studentId) => api.get(`/attendance/student/${studentId}`),
  getByClass: (classId) => api.get(`/attendance/class/${classId}`),
  getMonthlyReport: (year, month) => api.get(`/attendance/report/monthly?year=${year}&month=${month}`),
  getStudentMonthlyAttendance: (studentId, year, month) => api.get(`/attendance/student/${studentId}/monthly?year=${year}&month=${month}`),
  delete: (id) => api.delete(`/attendance/${id}`),
};

export default api;
