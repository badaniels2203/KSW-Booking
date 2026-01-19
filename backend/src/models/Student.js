const db = require('../config/database');

class Student {
  static getAll(callback) {
    const sql = 'SELECT * FROM students ORDER BY name';
    db.all(sql, [], callback);
  }

  static getById(id, callback) {
    const sql = 'SELECT * FROM students WHERE id = ?';
    db.get(sql, [id], callback);
  }

  static create(student, callback) {
    const sql = 'INSERT INTO students (name, age, nfc_token) VALUES (?, ?, ?)';
    db.run(sql, [student.name, student.age, student.nfc_token || null], function(err) {
      callback(err, { id: this.lastID });
    });
  }

  static update(id, student, callback) {
    const sql = 'UPDATE students SET name = ?, age = ?, nfc_token = ? WHERE id = ?';
    db.run(sql, [student.name, student.age, student.nfc_token || null, id], callback);
  }

  static delete(id, callback) {
    const sql = 'DELETE FROM students WHERE id = ?';
    db.run(sql, [id], callback);
  }

  static searchByName(name, callback) {
    const sql = 'SELECT * FROM students WHERE name LIKE ? ORDER BY name';
    db.all(sql, [`%${name}%`], callback);
  }

  static getByNfcToken(token, callback) {
    const sql = 'SELECT * FROM students WHERE nfc_token = ?';
    db.get(sql, [token], callback);
  }
}

module.exports = Student;
