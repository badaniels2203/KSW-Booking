const Class = require('../models/Class');

exports.getAllClasses = (req, res) => {
  Class.getAll((err, classes) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(classes);
  });
};

exports.getActiveClasses = (req, res) => {
  Class.getActive((err, classes) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(classes);
  });
};

exports.getClassById = (req, res) => {
  Class.getById(req.params.id, (err, classData) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(classData);
  });
};

exports.createClass = (req, res) => {
  const { name, day_of_week, start_time, end_time, active } = req.body;

  if (!name || day_of_week === undefined || !start_time || !end_time) {
    return res.status(400).json({ error: 'Name, day_of_week, start_time, and end_time are required' });
  }

  if (day_of_week < 0 || day_of_week > 6) {
    return res.status(400).json({ error: 'day_of_week must be between 0 (Sunday) and 6 (Saturday)' });
  }

  Class.create({ name, day_of_week, start_time, end_time, active }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Class created successfully', id: result.id });
  });
};

exports.updateClass = (req, res) => {
  const { name, day_of_week, start_time, end_time, active } = req.body;

  if (!name || day_of_week === undefined || !start_time || !end_time || active === undefined) {
    return res.status(400).json({ error: 'Name, day_of_week, start_time, end_time, and active are required' });
  }

  if (day_of_week < 0 || day_of_week > 6) {
    return res.status(400).json({ error: 'day_of_week must be between 0 (Sunday) and 6 (Saturday)' });
  }

  Class.update(req.params.id, { name, day_of_week, start_time, end_time, active }, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Class updated successfully' });
  });
};

exports.deleteClass = (req, res) => {
  Class.delete(req.params.id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Class deleted successfully' });
  });
};

exports.getCurrentClasses = (req, res) => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
  const currentTime = now.toTimeString().substring(0, 5); // HH:MM format

  Class.getCurrentClass(dayOfWeek, currentTime, (err, classes) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(classes);
  });
};

exports.getUpcomingClass = (req, res) => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentTime = now.toTimeString().substring(0, 5);

  Class.getUpcomingClass(dayOfWeek, currentTime, (err, classData) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(classData || null);
  });
};

exports.getStudentsInClass = (req, res) => {
  Class.getStudentsInClass(req.params.id, (err, students) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(students);
  });
};

exports.addStudentToClass = (req, res) => {
  const { student_id } = req.body;

  if (!student_id) {
    return res.status(400).json({ error: 'student_id is required' });
  }

  Class.addStudentToClass(req.params.id, student_id, (err) => {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Student is already enrolled in this class' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Student added to class successfully' });
  });
};

exports.removeStudentFromClass = (req, res) => {
  const { student_id } = req.body;

  if (!student_id) {
    return res.status(400).json({ error: 'student_id is required' });
  }

  Class.removeStudentFromClass(req.params.id, student_id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Student removed from class successfully' });
  });
};
