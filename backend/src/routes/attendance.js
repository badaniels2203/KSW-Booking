const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.get('/', attendanceController.getAllAttendance);
router.get('/report/monthly', attendanceController.getMonthlyReport);
router.get('/student/:student_id', attendanceController.getAttendanceByStudent);
router.get('/student/:student_id/monthly', attendanceController.getStudentMonthlyAttendance);
router.get('/class/:class_id', attendanceController.getAttendanceByClass);
router.get('/daterange', attendanceController.getAttendanceByDateRange);
router.get('/:id', attendanceController.getAttendanceById);
router.post('/checkin', attendanceController.checkIn);
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;
