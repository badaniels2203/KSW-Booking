const db = require('../config/database');

class Class {
  static getAll(callback) {
    const sql = 'SELECT * FROM classes ORDER BY day_of_week, start_time';
    db.all(sql, [], callback);
  }

  static getActive(callback) {
    const sql = 'SELECT * FROM classes WHERE active = 1 ORDER BY day_of_week, start_time';
    db.all(sql, [], callback);
  }

  static getById(id, callback) {
    const sql = 'SELECT * FROM classes WHERE id = ?';
    db.get(sql, [id], callback);
  }

  static create(classData, callback) {
    const sql = 'INSERT INTO classes (name, day_of_week, start_time, end_time, active) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [classData.name, classData.day_of_week, classData.start_time, classData.end_time, classData.active !== undefined ? classData.active : 1], function(err) {
      callback(err, { id: this.lastID });
    });
  }

  static update(id, classData, callback) {
    const sql = 'UPDATE classes SET name = ?, day_of_week = ?, start_time = ?, end_time = ?, active = ? WHERE id = ?';
    db.run(sql, [classData.name, classData.day_of_week, classData.start_time, classData.end_time, classData.active, id], callback);
  }

  static delete(id, callback) {
    const sql = 'DELETE FROM classes WHERE id = ?';
    db.run(sql, [id], callback);
  }

  static getCurrentClass(dayOfWeek, currentTime, callback) {
    const sql = `
      SELECT * FROM classes
      WHERE active = 1
        AND day_of_week = ?
        AND start_time <= ?
        AND end_time >= ?
      ORDER BY start_time
    `;
    db.all(sql, [dayOfWeek, currentTime, currentTime], callback);
  }

  static getUpcomingClass(dayOfWeek, currentTime, callback) {
    const sql = `
      SELECT * FROM classes
      WHERE active = 1
        AND day_of_week = ?
        AND start_time > ?
      ORDER BY start_time
      LIMIT 1
    `;
    db.get(sql, [dayOfWeek, currentTime], callback);
  }

  static getStudentsInClass(classId, callback) {
    const sql = `
      SELECT s.* FROM students s
      INNER JOIN class_students cs ON s.id = cs.student_id
      WHERE cs.class_id = ?
      ORDER BY s.name
    `;
    db.all(sql, [classId], callback);
  }

  static addStudentToClass(classId, studentId, callback) {
    const sql = 'INSERT INTO class_students (class_id, student_id) VALUES (?, ?)';
    db.run(sql, [classId, studentId], callback);
  }

  static removeStudentFromClass(classId, studentId, callback) {
    const sql = 'DELETE FROM class_students WHERE class_id = ? AND student_id = ?';
    db.run(sql, [classId, studentId], callback);
  }
}

module.exports = Class;
