const Student = require('../models/Student');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');
const Insight = require('../models/Insight');
const aiService = require('../services/aiService');

// Helper to check database connectivity
const isDbConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// @desc    Generate AI prediction and insights for a student
// @route   POST /api/ai/predict/:studentId
// @access  Private (Admin & Teacher)
exports.predictStudentRisk = async (req, res, next) => {
  const { studentId } = req.params;

  try {
    if (isDbConnected()) {
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found',
        });
      }

      // Gather grades & attendance history
      const grades = await Grade.find({ student: studentId });
      const attendance = await Attendance.find({ student: studentId });

      // Execute AI Service prediction
      const assessment = aiService.assessStudentRisk(student, grades, attendance);

      // Update student table with risk level
      student.riskStatus = assessment.riskStatus;
      await student.save();

      // Cache insight report
      const summary = `AI evaluation of ${student.name}: Risk is ${assessment.riskStatus}.`;
      const details = assessment.insights.join(' | ');
      const recommendation = assessment.recommendations.join(' | ');

      const cachedInsight = await Insight.findOneAndUpdate(
        { student: studentId },
        {
          student: studentId,
          summary,
          details,
          type: 'general',
          score: assessment.riskScore,
          recommendation,
        },
        { upsert: true, new: true }
      );

      return res.status(200).json({
        success: true,
        data: {
          studentId: student._id,
          name: student.name,
          riskScore: assessment.riskScore,
          riskStatus: assessment.riskStatus,
          insights: assessment.insights,
          recommendations: assessment.recommendations,
          cachedInsightId: cachedInsight._id,
        },
      });
    } else {
      // Mock sandbox mode
      return res.status(200).json({
        success: true,
        data: {
          studentId,
          name: "Campus Student",
          riskScore: 28,
          riskStatus: "Low",
          insights: [
            "Excellent attendance discipline maintained at 94.2%.",
            "Midterm programming scores are within top percentile."
          ],
          recommendations: [
            "Continue maintaining current classroom participation levels.",
            "Consider applying for peer academic mentorship opportunities."
          ],
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get latest cached AI insights for student
// @route   GET /api/ai/insights/:studentId
// @access  Private
exports.getStudentInsights = async (req, res, next) => {
  const { studentId } = req.params;

  try {
    if (isDbConnected()) {
      const insight = await Insight.findOne({ student: studentId }).sort({ createdAt: -1 });

      if (!insight) {
        return res.status(200).json({
          success: true,
          data: {
            insights: ["No AI metrics recorded yet. Trigger assessment to analyze profile."],
            recommendations: ["Ensure student records are up to date before running analysis."],
          },
        });
      }

      // Convert cached pipelines back into lists for React rendering
      return res.status(200).json({
        success: true,
        data: {
          insights: insight.details ? insight.details.split(' | ') : [insight.summary],
          recommendations: insight.recommendation ? insight.recommendation.split(' | ') : [],
          score: insight.score,
          createdAt: insight.createdAt,
        },
      });
    } else {
      // Local mockup lists
      return res.status(200).json({
        success: true,
        data: {
          insights: [
            "Excellent attendance discipline maintained at 94.2%.",
            "Solid academic scores log recorded in standard tracks."
          ],
          recommendations: [
            "Continue maintaining current classroom participation levels.",
            "Explore advanced workshops to improve coding skills."
          ],
          score: 12,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
