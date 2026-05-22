const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Notification = require('../models/Notification');

// Helper to check database connectivity
const isDbConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// @desc    Mark bulk student attendance
// @route   POST /api/attendance
// @access  Private (Admin & Teacher)
exports.markAttendance = async (req, res, next) => {
  const { records, subject, date } = req.body;
  const markedBy = req.user.id;

  if (!records || !Array.isArray(records) || records.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide attendance records list',
    });
  }

  if (!subject) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a subject',
    });
  }

  const parsedDate = date ? new Date(date) : new Date();

  try {
    if (isDbConnected()) {
      const attendancePromises = records.map(async (rec) => {
        const { studentId, status } = rec;

        // Create or update attendance log
        const attendanceLog = await Attendance.findOneAndUpdate(
          { student: studentId, subject, date: { $gte: new Date(parsedDate.setHours(0,0,0,0)), $lt: new Date(parsedDate.setHours(23,59,59,999)) } },
          { student: studentId, subject, status, markedBy, date: parsedDate },
          { upsert: true, new: true }
        );

        // Recalculate student attendance average
        const allLogs = await Attendance.find({ student: studentId });
        const presents = allLogs.filter(l => l.status === 'Present' || l.status === 'Late').length;
        const total = allLogs.length;
        const rate = total > 0 ? parseFloat(((presents / total) * 100).toFixed(1)) : 100;

        const updatedStudent = await Student.findByIdAndUpdate(
          studentId,
          { attendanceRate: rate },
          { new: true }
        );

        // Send a low attendance alert if it falls below 75%
        if (rate < 75.0 && updatedStudent) {
          await Notification.findOneAndUpdate(
            { recipientUser: studentId, title: 'Low Attendance Alert' },
            {
              title: 'Low Attendance Alert',
              message: `Your attendance in ${subject} has dropped to ${rate}%. Please attend subsequent classes.`,
              type: 'warning',
              recipientRole: 'student',
              recipientUser: studentId,
            },
            { upsert: true }
          );
        }

        return attendanceLog;
      });

      const results = await Promise.all(attendancePromises);

      return res.status(200).json({
        success: true,
        count: results.length,
        message: 'Attendance logged successfully',
        data: results,
      });
    } else {
      // Local demo sandbox success bypass
      return res.status(200).json({
        success: true,
        message: 'Attendance logged successfully (Local Sandbox Mode)',
        recordsCount: records.length,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get student aggregate and subject-wise attendance logs
// @route   GET /api/attendance/student/:studentId
// @access  Private
exports.getStudentAttendance = async (req, res, next) => {
  const { studentId } = req.params;

  try {
    if (isDbConnected()) {
      const logs = await Attendance.find({ student: studentId }).sort({ date: -1 });

      // Group subject logs
      const subjectStats = {};
      logs.forEach(log => {
        if (!subjectStats[log.subject]) {
          subjectStats[log.subject] = { present: 0, total: 0 };
        }
        subjectStats[log.subject].total += 1;
        if (log.status === 'Present' || log.status === 'Late') {
          subjectStats[log.subject].present += 1;
        }
      });

      const grouped = Object.keys(subjectStats).map(subj => {
        const p = subjectStats[subj].present;
        const t = subjectStats[subj].total;
        return {
          subject: subj,
          present: p,
          total: t,
          rate: parseFloat(((p / t) * 100).toFixed(1)),
        };
      });

      return res.status(200).json({
        success: true,
        totalLogs: logs.length,
        grouped,
        logs,
      });
    } else {
      // Return high-fidelity mockup statistics for frontend visual charts
      const grouped = [
        { subject: 'Mathematics', present: 22, total: 24, rate: 91.7 },
        { subject: 'Physics', present: 18, total: 24, rate: 75.0 },
        { subject: 'Programming Basics', present: 24, total: 24, rate: 100.0 },
      ];
      return res.status(200).json({
        success: true,
        grouped,
        logs: [],
      });
    }
  } catch (error) {
    next(error);
  }
};
