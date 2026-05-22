const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
    },
    subject: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    marksObtained: {
      type: Number,
      required: [true, 'Marks obtained is required'],
      min: [0, 'Marks cannot be negative'],
    },
    maxMarks: {
      type: Number,
      required: [true, 'Max marks is required'],
      default: 100,
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: 1,
      max: 8,
    },
    examType: {
      type: String,
      enum: ['Midterm', 'Final', 'Assignment', 'Quiz'],
      default: 'Final',
    },
    grade: {
      type: String,
      required: [true, 'Grade letter is required'],
      trim: true,
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Grading user reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

gradeSchema.index({ student: 1, semester: 1 });

module.exports = mongoose.model('Grade', gradeSchema);
