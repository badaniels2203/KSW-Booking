const db = require('../config/database');

class Attendance {
  static getAll(callback) {
    const sql = `
      SELECT a.*, s.name as student_name, c.name as class_name
      FROM attendance a
      INNER JOIN students s ON a.student_id = s.id
      INNER JOIN classes c ON a.class_id = c.id
      ORDER BY a.date DESC, a.check_in_time DESC
    `;
    db.all(sql, [], callback);
  }

  static getById(id, callback) {
    const sql = `
      SELECT a.*, s.name as student_name, c.name as class_name
      FROM attendance a
      INNER JOIN students s ON a.student_id = s.id
      INNER JOIN classes c ON a.class_id = c.id
      WHERE a.id = ?
    `;
    db.get(sql, [id], callback);
  }

  static create(attendance, callback) {
    const sql = 'INSERT INTO attendance (student_id, class_id, date, check_in_time) VALUES (?, ?, ?, ?)';
    const now = new Date().toISOString();
    db.run(sql, [attendance.student_id, attendance.class_id, attendance.date || now.split('T')[0], attendance.check_in_time || now], function(err) {
      callback(err, { id: this.lastID });
    });
  }

  static checkIfAlreadyCheckedIn(studentId, classId, date, callback) {
    const sql = 'SELECT * FROM attendance WHERE student_id = ? AND class_id = ? AND date = ?';
    db.get(sql, [studentId, classId, date], callback);
  }

  static getByDateRange(startDate, endDate, callback) {
    const sql = `
      SELECT a.*, s.name as student_name, c.name as class_name
      FROM attendance a
      INNER JOIN students s ON a.student_id = s.id
      INNER JOIN classes c ON a.class_id = c.id
      WHERE a.date BETWEEN ? AND ?
      ORDER BY a.date DESC, a.check_in_time DESC
    `;
    db.all(sql, [startDate, endDate], callback);
  }

  static getByStudent(studentId, callback) {
    const sql = `
      SELECT a.*, c.name as class_name
      FROM attendance a
      INNER JOIN classes c ON a.class_id = c.id
      WHERE a.student_id = ?
      ORDER BY a.date DESC, a.check_in_time DESC
    `;
    db.all(sql, [studentId], callback);
  }

  static getByClass(classId, callback) {
    const sql = `
      SELECT a.*, s.name as student_name
      FROM attendance a
      INNER JOIN students s ON a.student_id = s.id
      WHERE a.class_id = ?
      ORDER BY a.date DESC, a.check_in_time DESC
    `;
    db.all(sql, [classId], callback);
  }

  static getMonthlyReport(year, month, callback) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

    const sql = `
      SELECT
        s.id as student_id,
        s.name as student_name,
        s.age as student_age,
        COUNT(a.id) as total_attendance,
        GROUP_CONCAT(DISTINCT c.name) as classes_attended
      FROM students s
      LEFT JOIN attendance a ON s.id = a.student_id AND a.date BETWEEN ? AND ?
      LEFT JOIN classes c ON a.class_id = c.id
      GROUP BY s.id, s.name, s.age
      ORDER BY s.name
    `;
    db.all(sql, [startDate, endDate], callback);
  }

  static getStudentMonthlyAttendance(studentId, year, month, callback) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

    const sql = `
      SELECT a.*, c.name as class_name
      FROM attendance a
      INNER JOIN classes c ON a.class_id = c.id
      WHERE a.student_id = ? AND a.date BETWEEN ? AND ?
      ORDER BY a.date, a.check_in_time
    `;
    db.all(sql, [studentId, startDate, endDate], callback);
  }

  static delete(id, callback) {
    const sql = 'DELETE FROM attendance WHERE id = ?';
    db.run(sql, [id], callback);
  }
}

module.exports = Attendance;
