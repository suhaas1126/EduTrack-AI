const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getAllStudents)
  .post(protect, authorize('admin'), createStudent);

router.route('/:id')
  .get(protect, getStudentById)
  .put(protect, authorize('admin', 'teacher'), updateStudent)
  .delete(protect, authorize('admin'), deleteStudent);

module.exports = router;
