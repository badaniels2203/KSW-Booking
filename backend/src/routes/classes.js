const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

router.get('/', classController.getAllClasses);
router.get('/active', classController.getActiveClasses);
router.get('/current', classController.getCurrentClasses);
router.get('/upcoming', classController.getUpcomingClass);
router.get('/:id', classController.getClassById);
router.get('/:id/students', classController.getStudentsInClass);
router.post('/', classController.createClass);
router.post('/:id/students', classController.addStudentToClass);
router.put('/:id', classController.updateClass);
router.delete('/:id', classController.deleteClass);
router.delete('/:id/students', classController.removeStudentFromClass);

module.exports = router;
