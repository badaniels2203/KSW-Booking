const Attendance = require('../models/Attendance');

exports.getAllAttendance = (req, res) => {
  Attendance.getAll((err, attendance) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(attendance);
  });
};

exports.getAttendanceById = (req, res) => {
  Attendance.getById(req.params.id, (err, attendance) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    res.json(attendance);
  });
};

exports.checkIn = (req, res) => {
  const { student_id, class_id, date } = req.body;

  if (!student_id || !class_id) {
    return res.status(400).json({ error: 'student_id and class_id are required' });
  }

  const checkDate = date || new Date().toISOString().split('T')[0];

  // Check if student already checked in for this class today
  Attendance.checkIfAlreadyCheckedIn(student_id, class_id, checkDate, (err, existingAttendance) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (existingAttendance) {
      return res.status(400).json({ error: 'Student already checked in for this class today' });
    }

    Attendance.create({ student_id, class_id, date: checkDate }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Check-in successful', id: result.id });
    });
  });
};

exports.getAttendanceByDateRange = (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'start_date and end_date query parameters are required' });
  }

  Attendance.getByDateRange(start_date, end_date, (err, attendance) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(attendance);
  });
};

exports.getAttendanceByStudent = (req, res) => {
  Attendance.getByStudent(req.params.student_id, (err, attendance) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(attendance);
  });
};

exports.getAttendanceByClass = (req, res) => {
  Attendance.getByClass(req.params.class_id, (err, attendance) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(attendance);
  });
};

exports.getMonthlyReport = (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ error: 'year and month query parameters are required' });
  }

  Attendance.getMonthlyReport(parseInt(year), parseInt(month), (err, report) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(report);
  });
};

exports.getStudentMonthlyAttendance = (req, res) => {
  const { student_id } = req.params;
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ error: 'year and month query parameters are required' });
  }

  Attendance.getStudentMonthlyAttendance(parseInt(student_id), parseInt(year), parseInt(month), (err, attendance) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(attendance);
  });
};

exports.deleteAttendance = (req, res) => {
  Attendance.delete(req.params.id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Attendance record deleted successfully' });
  });
};
