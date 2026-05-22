const Student = require('../models/Student');

// Helper to check database connectivity
const isDbConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// @desc    Export student record database to CSV
// @route   GET /api/reports/csv
// @access  Private (Admin & Teacher)
exports.exportCSV = async (req, res, next) => {
  try {
    let students = [];

    if (isDbConnected()) {
      students = await Student.find({}).sort({ name: 1 });
    } else {
      // Fallback mock list
      students = [
        { name: "Alexander Wright", rollNumber: "STU-2026-001", email: "alexander.w@studentsphere.edu", department: "Computer Science", semester: 6, cgpa: 3.90, attendanceRate: 94.2, riskStatus: "Low" },
        { name: "Sophia Martinez", rollNumber: "STU-2026-002", email: "sophia.m@studentsphere.edu", department: "Computer Science", semester: 6, cgpa: 3.42, attendanceRate: 88.5, riskStatus: "Low" },
        { name: "Marcus Vance", rollNumber: "STU-2026-003", email: "marcus.v@studentsphere.edu", department: "Electrical Engineering", semester: 4, cgpa: 2.30, attendanceRate: 64.0, riskStatus: "High" },
        { name: "Emily Jenkins", rollNumber: "STU-2026-004", email: "emily.j@studentsphere.edu", department: "Mechanical Engineering", semester: 4, cgpa: 3.05, attendanceRate: 72.8, riskStatus: "Medium" },
      ];
    }

    // Design CSV content
    let csvHeader = "Name,Roll Number,Email,Department,Semester,CGPA,Attendance Rate,Risk Status\n";
    let csvRows = students.map(s => {
      return `"${s.name}","${s.rollNumber}","${s.email}","${s.department}",${s.semester},${s.cgpa || 0.0},${s.attendanceRate || 0.0},"${s.riskStatus}"`;
    }).join("\n");

    const csvData = csvHeader + csvRows;

    // Attach headers to force auto-download in client browser
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=studentsphere_report.csv');
    
    return res.status(200).send(csvData);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch printable report card profile metadata
// @route   GET /api/reports/print/:studentId
// @access  Private
exports.getPrintableReportCard = async (req, res, next) => {
  const { studentId } = req.params;

  try {
    let student;
    if (isDbConnected()) {
      student = await Student.findById(studentId);
    } else {
      student = { _id: studentId, name: "Alexander Wright", rollNumber: "STU-2026-001", department: "Computer Science", semester: 6, cgpa: 3.90, gpa: 3.85, attendanceRate: 94.2, riskStatus: "Low" };
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Form compilation output
    return res.status(200).json({
      success: true,
      data: {
        schoolName: "StudentSphere Institute of Technology",
        term: "Academic Year 2026 - Fall",
        student,
        issuedAt: new Date().toLocaleDateString(),
        signatureApproval: "Office of the Academic Registrar",
      },
    });
  } catch (error) {
    next(error);
  }
};
