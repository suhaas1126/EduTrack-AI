const express = require('express');
const router = express.Router();
const { exportCSV, getPrintableReportCard } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.get('/csv', protect, authorize('admin', 'teacher'), exportCSV);
router.get('/print/:studentId', protect, getPrintableReportCard);

module.exports = router;
