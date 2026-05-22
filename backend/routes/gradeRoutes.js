const express = require('express');
const router = express.Router();
const { addGrade, getStudentGrades } = require('../controllers/gradeController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin', 'teacher'), addGrade);
router.get('/student/:studentId', protect, getStudentGrades);

module.exports = router;
