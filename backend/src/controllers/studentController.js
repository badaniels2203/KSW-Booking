const Student = require('../models/Student');

exports.getAllStudents = (req, res) => {
  Student.getAll((err, students) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(students);
  });
};

exports.getStudentById = (req, res) => {
  Student.getById(req.params.id, (err, student) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  });
};

exports.createStudent = (req, res) => {
  const { name, age, nfc_token } = req.body;

  if (!name || !age) {
    return res.status(400).json({ error: 'Name and age are required' });
  }

  Student.create({ name, age, nfc_token }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Student created successfully', id: result.id });
  });
};

exports.updateStudent = (req, res) => {
  const { name, age, nfc_token } = req.body;

  if (!name || !age) {
    return res.status(400).json({ error: 'Name and age are required' });
  }

  Student.update(req.params.id, { name, age, nfc_token }, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Student updated successfully' });
  });
};

exports.deleteStudent = (req, res) => {
  Student.delete(req.params.id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Student deleted successfully' });
  });
};

exports.searchStudents = (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Name query parameter is required' });
  }

  Student.searchByName(name, (err, students) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(students);
  });
};

exports.getStudentByNfcToken = (req, res) => {
  const { token } = req.params;

  Student.getByNfcToken(token, (err, student) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  });
};
