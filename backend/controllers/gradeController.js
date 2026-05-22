const Grade = require('../models/Grade');
const Student = require('../models/Student');

// Helper to check database connectivity
const isDbConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// Map marks to letter grades and GPA points
const calculateLetterGradeAndGpa = (marksObtained, maxMarks = 100) => {
  const percentage = (marksObtained / maxMarks) * 100;

  if (percentage >= 90) return { grade: 'A+', points: 4.0 };
  if (percentage >= 80) return { grade: 'A', points: 3.7 };
  if (percentage >= 70) return { grade: 'B', points: 3.3 };
  if (percentage >= 60) return { grade: 'C', points: 2.7 };
  if (percentage >= 50) return { grade: 'D', points: 2.0 };
  return { grade: 'F', points: 0.0 };
};

// @desc    Add grade record for student
// @route   POST /api/grades
// @access  Private (Admin & Teacher)
exports.addGrade = async (req, res, next) => {
  const { studentId, subject, marksObtained, maxMarks, semester, examType } = req.body;
  const gradedBy = req.user.id;

  if (!studentId || !subject || marksObtained === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Please provide student ID, subject, and marks',
    });
  }

  try {
    const { grade, points } = calculateLetterGradeAndGpa(marksObtained, maxMarks);

    if (isDbConnected()) {
      // Create new grade log
      const gradeRecord = await Grade.create({
        student: studentId,
        subject,
        marksObtained,
        maxMarks: maxMarks || 100,
        semester: semester || 1,
        examType: examType || 'Final',
        grade,
        gradedBy,
      });

      // Recalculate Student GPA and CGPA
      const allGrades = await Grade.find({ student: studentId });

      // GPA computation: Average points across all grades
      let totalPoints = 0;
      allGrades.forEach(g => {
        const item = calculateLetterGradeAndGpa(g.marksObtained, g.maxMarks);
        totalPoints += item.points;
      });

      const avgGpa = allGrades.length > 0 ? parseFloat((totalPoints / allGrades.length).toFixed(2)) : 0.0;

      // Update student metrics
      await Student.findByIdAndUpdate(
        studentId,
        {
          gpa: avgGpa,
          cgpa: avgGpa, // Simplification for cumulative representation
        }
      );

      return res.status(201).json({
        success: true,
        data: gradeRecord,
        updatedMetrics: {
          gpa: avgGpa,
          cgpa: avgGpa,
        },
      });
    } else {
      // Mock mode success fallback
      return res.status(201).json({
        success: true,
        message: 'Grade added successfully (Local Sandbox Mode)',
        calculatedGrade: grade,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get student academic grades
// @route   GET /api/grades/student/:studentId
// @access  Private
exports.getStudentGrades = async (req, res, next) => {
  const { studentId } = req.params;

  try {
    if (isDbConnected()) {
      const grades = await Grade.find({ student: studentId }).sort({ semester: -1, createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: grades.length,
        data: grades,
      });
    } else {
      // Mock visual indicators
      const mockGrades = [
        { _id: "g1", subject: "Mathematics", marksObtained: 88, maxMarks: 100, semester: 6, examType: "Final", grade: "A" },
        { _id: "g2", subject: "Physics", marksObtained: 76, maxMarks: 100, semester: 6, examType: "Final", grade: "B" },
        { _id: "g3", subject: "Programming Basics", marksObtained: 94, maxMarks: 100, semester: 6, examType: "Final", grade: "A+" },
      ];
      return res.status(200).json({
        success: true,
        count: mockGrades.length,
        data: mockGrades,
      });
    }
  } catch (error) {
    next(error);
  }
};
