const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const Notification = require('../models/Notification');
const Insight = require('../models/Insight');

dotenv.config();

const usersSeed = [
  {
    name: 'Global Administrator',
    email: 'admin@studentsphere.com',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'Professor Katherine',
    email: 'teacher@studentsphere.com',
    password: 'password123',
    role: 'teacher',
  },
  {
    name: 'Alexander Wright',
    email: 'student@studentsphere.com',
    password: 'password123',
    role: 'student',
  }
];

const studentsSeed = [
  {
    name: 'Alexander Wright',
    rollNumber: 'STU-2026-001',
    email: 'alexander.w@studentsphere.edu',
    department: 'Computer Science',
    semester: 6,
    dateOfBirth: new Date('2005-04-12'),
    gender: 'Male',
    phone: '+1 (555) 019-2834',
    gpa: 3.85,
    cgpa: 3.90,
    attendanceRate: 94.2,
    riskStatus: 'Low',
  },
  {
    name: 'Sophia Martinez',
    rollNumber: 'STU-2026-002',
    email: 'sophia.m@studentsphere.edu',
    department: 'Computer Science',
    semester: 6,
    dateOfBirth: new Date('2005-08-22'),
    gender: 'Female',
    phone: '+1 (555) 021-3948',
    gpa: 3.20,
    cgpa: 3.42,
    attendanceRate: 88.5,
    riskStatus: 'Low',
  },
  {
    name: 'Marcus Vance',
    rollNumber: 'STU-2026-003',
    email: 'marcus.v@studentsphere.edu',
    department: 'Electrical Engineering',
    semester: 4,
    dateOfBirth: new Date('2006-01-15'),
    gender: 'Male',
    phone: '+1 (555) 032-1194',
    gpa: 2.15,
    cgpa: 2.30,
    attendanceRate: 64.0,
    riskStatus: 'High',
  },
  {
    name: 'Emily Jenkins',
    rollNumber: 'STU-2026-004',
    email: 'emily.j@studentsphere.edu',
    department: 'Mechanical Engineering',
    semester: 4,
    dateOfBirth: new Date('2006-03-30'),
    gender: 'Female',
    phone: '+1 (555) 041-5928',
    gpa: 2.90,
    cgpa: 3.05,
    attendanceRate: 72.8,
    riskStatus: 'Medium',
  },
  {
    name: 'Daniel Kim',
    rollNumber: 'STU-2026-005',
    email: 'daniel.k@studentsphere.edu',
    department: 'Computer Science',
    semester: 2,
    dateOfBirth: new Date('2007-11-05'),
    gender: 'Male',
    phone: '+1 (555) 012-9485',
    gpa: 3.95,
    cgpa: 3.92,
    attendanceRate: 98.0,
    riskStatus: 'Low',
  },
  {
    name: 'Chloe Harrison',
    rollNumber: 'STU-2026-006',
    email: 'chloe.h@studentsphere.edu',
    department: 'Bio-Technology',
    semester: 8,
    dateOfBirth: new Date('2004-06-18'),
    gender: 'Female',
    phone: '+1 (555) 098-7654',
    gpa: 3.60,
    cgpa: 3.55,
    attendanceRate: 91.5,
    riskStatus: 'Low',
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB database for seeding...');

    // Clear existing records
    await User.deleteMany();
    await Student.deleteMany();
    await Attendance.deleteMany();
    await Grade.deleteMany();
    await Notification.deleteMany();
    await Insight.deleteMany();
    console.log('Cleared existing collections successfully.');

    // Seed Users
    const seededUsers = await User.create(usersSeed);
    console.log(`Seeded ${seededUsers.length} authentication user accounts.`);

    const teacherUser = seededUsers.find(u => u.role === 'teacher');
    const studentUser = seededUsers.find(u => u.role === 'student');

    // Seed Students
    const seededStudents = [];
    for (const stuData of studentsSeed) {
      // Map one student to the student login user
      if (stuData.name === 'Alexander Wright' && studentUser) {
        stuData.user = studentUser._id;
      }
      const s = await Student.create(stuData);
      seededStudents.push(s);
    }
    console.log(`Seeded ${seededStudents.length} student records.`);

    // Seed Sample Grades and Attendance Logs
    for (const student of seededStudents) {
      const subjects = ['Mathematics', 'Physics', 'Programming Basics'];
      
      // Attendance seeding
      for (const subj of subjects) {
        // Generate random attendance logs
        for (let day = 1; day <= 10; day++) {
          let status = 'Present';
          if (student.riskStatus === 'High' && Math.random() > 0.4) {
            status = 'Absent';
          } else if (student.riskStatus === 'Medium' && Math.random() > 0.7) {
            status = 'Absent';
          }

          await Attendance.create({
            student: student._id,
            subject: subj,
            date: new Date(2026, 4, day),
            status,
            markedBy: teacherUser ? teacherUser._id : seededUsers[0]._id,
          });
        }

        // Grades seeding
        let marks = Math.floor(Math.random() * 30) + 70; // 70 to 99
        if (student.riskStatus === 'High') {
          marks = Math.floor(Math.random() * 25) + 35; // 35 to 59
        } else if (student.riskStatus === 'Medium') {
          marks = Math.floor(Math.random() * 20) + 55; // 55 to 74
        }

        let gradeLetter = 'B';
        if (marks >= 90) gradeLetter = 'A+';
        else if (marks >= 80) gradeLetter = 'A';
        else if (marks >= 70) gradeLetter = 'B';
        else if (marks >= 60) gradeLetter = 'C';
        else if (marks >= 50) gradeLetter = 'D';
        else gradeLetter = 'F';

        await Grade.create({
          student: student._id,
          subject: subj,
          marksObtained: marks,
          maxMarks: 100,
          semester: student.semester,
          examType: 'Final',
          grade: gradeLetter,
          gradedBy: teacherUser ? teacherUser._id : seededUsers[0]._id,
        });
      }

      // Seed sample insights
      await Insight.create({
        student: student._id,
        summary: `AI Evaluation for ${student.name}: Risk score stands at ${student.riskStatus === 'High' ? 78 : student.riskStatus === 'Medium' ? 42 : 12}.`,
        details: student.riskStatus === 'High'
          ? "Critical attendance deficits | Core physics midterm logged failing parameters"
          : "Steady classroom participation | Academic parameters are satisfactory",
        type: 'general',
        score: student.riskStatus === 'High' ? 78 : student.riskStatus === 'Medium' ? 42 : 12,
        recommendation: student.riskStatus === 'High'
          ? "Attend 8 consecutive lectures | Arrange urgent tutoring consultation"
          : "Maintain steady class interactions",
      });
    }

    console.log('Seeded sample Grades, Attendance, and AI Insights for all profiles.');

    // Seed dynamic campus notifications
    await Notification.create([
      {
        title: 'New Semester Open Registration',
        message: 'Courses enrollment is now officially open for Fall 2026. Register prior to standard deadline.',
        type: 'info',
        recipientRole: 'all',
      },
      {
        title: 'Midterm Grading Session',
        message: 'All final grades must be checked and logged prior to the official board examination reviews.',
        type: 'warning',
        recipientRole: 'teacher',
      }
    ]);
    console.log('Seeded core notifications.');

    console.log('>>> DATABASE SEEDING COMPLETED SUCCESSFULLY. <<<');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
