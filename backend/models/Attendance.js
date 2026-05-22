const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late'],
      required: [true, 'Status is required'],
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recorder reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Compounded index to speed up student and date queries
attendanceSchema.index({ student: 1, date: -1 });
attendanceSchema.index({ student: 1, subject: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
