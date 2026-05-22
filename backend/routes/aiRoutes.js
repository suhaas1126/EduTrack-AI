const express = require('express');
const router = express.Router();
const { predictStudentRisk, getStudentInsights } = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/auth');

router.post('/predict/:studentId', protect, authorize('admin', 'teacher'), predictStudentRisk);
router.get('/insights/:studentId', protect, getStudentInsights);

module.exports = router;
