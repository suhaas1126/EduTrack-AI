const express = require('express');
const router = express.Router();
const { markAttendance, getStudentAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin', 'teacher'), markAttendance);
router.get('/student/:studentId', protect, getStudentAttendance);

module.exports = router;
