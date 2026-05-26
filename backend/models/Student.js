const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Student email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    department: {
      type: String,
      required: [true, 'Department/Branch is required'],
      trim: true,
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: [1, 'Semester must be at least 1'],
      max: [8, 'Semester cannot exceed 8'],
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male',
    },
    phone: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String, // Can store base64 string or image url
      default: '',
    },
    gpa: {
      type: Number,
      default: 0.0,
      min: 0,
      max: 4.0,
    },
    cgpa: {
      type: Number,
      default: 0.0,
      min: 0,
      max: 4.0,
    },
    attendanceRate: {
      type: Number,
      default: 0.0,
      min: 0,
      max: 100,
    },
    riskStatus: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Low',
    },
  },
  {
    timestamps: true,
  }
);

// Index commonly searched fields for SaaS performance.
// rollNumber and email already get indexes from `unique: true`.
studentSchema.index({ name: 'text', rollNumber: 'text', email: 'text' });

module.exports = mongoose.model('Student', studentSchema);
