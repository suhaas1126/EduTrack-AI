const Student = require('../models/Student');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');

// Global mock storage for when MongoDB is disconnected or empty
let mockStudents = [
  {
    _id: "stu_1",
    name: "Alexander Wright",
    rollNumber: "STU-2026-001",
    email: "alexander.w@studentsphere.edu",
    department: "Computer Science",
    semester: 6,
    dateOfBirth: "2005-04-12",
    gender: "Male",
    phone: "+1 (555) 019-2834",
    profileImage: "",
    gpa: 3.85,
    cgpa: 3.90,
    attendanceRate: 94.2,
    riskStatus: "Low",
  },
  {
    _id: "stu_2",
    name: "Sophia Martinez",
    rollNumber: "STU-2026-002",
    email: "sophia.m@studentsphere.edu",
    department: "Computer Science",
    semester: 6,
    dateOfBirth: "2005-08-22",
    gender: "Female",
    phone: "+1 (555) 021-3948",
    profileImage: "",
    gpa: 3.20,
    cgpa: 3.42,
    attendanceRate: 88.5,
    riskStatus: "Low",
  },
  {
    _id: "stu_3",
    name: "Marcus Vance",
    rollNumber: "STU-2026-003",
    email: "marcus.v@studentsphere.edu",
    department: "Electrical Engineering",
    semester: 4,
    dateOfBirth: "2006-01-15",
    gender: "Male",
    phone: "+1 (555) 032-1194",
    profileImage: "",
    gpa: 2.15,
    cgpa: 2.30,
    attendanceRate: 64.0,
    riskStatus: "High",
  },
  {
    _id: "stu_4",
    name: "Emily Jenkins",
    rollNumber: "STU-2026-004",
    email: "emily.j@studentsphere.edu",
    department: "Mechanical Engineering",
    semester: 4,
    dateOfBirth: "2006-03-30",
    gender: "Female",
    phone: "+1 (555) 041-5928",
    profileImage: "",
    gpa: 2.90,
    cgpa: 3.05,
    attendanceRate: 72.8,
    riskStatus: "Medium",
  },
  {
    _id: "stu_5",
    name: "Daniel Kim",
    rollNumber: "STU-2026-005",
    email: "daniel.k@studentsphere.edu",
    department: "Computer Science",
    semester: 2,
    dateOfBirth: "2007-11-05",
    gender: "Male",
    phone: "+1 (555) 012-9485",
    profileImage: "",
    gpa: 3.95,
    cgpa: 3.92,
    attendanceRate: 98.0,
    riskStatus: "Low",
  },
  {
    _id: "stu_6",
    name: "Chloe Harrison",
    rollNumber: "STU-2026-006",
    email: "chloe.h@studentsphere.edu",
    department: "Bio-Technology",
    semester: 8,
    dateOfBirth: "2004-06-18",
    gender: "Female",
    phone: "+1 (555) 098-7654",
    profileImage: "",
    gpa: 3.60,
    cgpa: 3.55,
    attendanceRate: 91.5,
    riskStatus: "Low",
  },
];

// Helper to check database connectivity
const isDbConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin & Teacher)
exports.getAllStudents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const search = req.query.search || '';
    const department = req.query.department || '';
    const semester = req.query.semester || '';
    const riskStatus = req.query.riskStatus || '';

    if (isDbConnected()) {
      // Build query object
      let query = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { rollNumber: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      if (department) query.department = department;
      if (semester) query.semester = parseInt(semester, 10);
      if (riskStatus) query.riskStatus = riskStatus;

      const total = await Student.countDocuments(query);
      const students = await Student.find(query)
        .sort({ name: 1 })
        .skip(startIndex)
        .limit(limit);

      return res.status(200).json({
        success: true,
        count: students.length,
        total,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        data: students,
      });
    } else {
      // Fallback local memory search & filter
      let filtered = [...mockStudents];

      if (search) {
        const lowerSearch = search.toLowerCase();
        filtered = filtered.filter(
          s =>
            s.name.toLowerCase().includes(lowerSearch) ||
            s.rollNumber.toLowerCase().includes(lowerSearch) ||
            s.email.toLowerCase().includes(lowerSearch)
        );
      }

      if (department) {
        filtered = filtered.filter(s => s.department === department);
      }

      if (semester) {
        filtered = filtered.filter(s => s.semester === parseInt(semester, 10));
      }

      if (riskStatus) {
        filtered = filtered.filter(s => s.riskStatus === riskStatus);
      }

      const total = filtered.length;
      const paginated = filtered.slice(startIndex, startIndex + limit);

      return res.status(200).json({
        success: true,
        count: paginated.length,
        total,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        data: paginated,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private
exports.getStudentById = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (isDbConnected()) {
      const student = await Student.findById(id);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found',
        });
      }

      // Fetch additional records
      const grades = await Grade.find({ student: id }).sort({ semester: -1, createdAt: -1 });
      const attendance = await Attendance.find({ student: id }).sort({ date: -1 }).limit(30);

      return res.status(200).json({
        success: true,
        data: {
          student,
          grades,
          attendance,
        },
      });
    } else {
      // Local fallbacks
      const student = mockStudents.find(s => s._id === id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found',
        });
      }

      // Return synthetic grades and attendance lists for dynamic widgets
      const mockGrades = [
        { _id: "g1", subject: "Mathematics", marksObtained: 88, maxMarks: 100, semester: student.semester, examType: "Final", grade: "A" },
        { _id: "g2", subject: "Physics", marksObtained: student.riskStatus === "High" ? 45 : 78, maxMarks: 100, semester: student.semester, examType: "Final", grade: student.riskStatus === "High" ? "F" : "B" },
        { _id: "g3", subject: "Programming Basics", marksObtained: 94, maxMarks: 100, semester: student.semester, examType: "Final", grade: "A+" },
      ];

      const mockAttendanceLogs = [
        { _id: "a1", subject: "Mathematics", date: "2026-05-20", status: "Present" },
        { _id: "a2", subject: "Physics", date: "2026-05-21", status: student.riskStatus === "High" ? "Absent" : "Present" },
        { _id: "a3", subject: "Programming Basics", date: "2026-05-22", status: "Present" },
      ];

      return res.status(200).json({
        success: true,
        data: {
          student,
          grades: mockGrades,
          attendance: mockAttendanceLogs,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private (Admin)
exports.createStudent = async (req, res, next) => {
  const { name, email, department, semester, dateOfBirth, gender, phone, profileImage } = req.body;

  try {
    // Generate simple roll number
    const year = new Date().getFullYear();
    const count = isDbConnected() ? await Student.countDocuments() : mockStudents.length;
    const serial = String(count + 1).padStart(3, '0');
    const rollNumber = `STU-${year}-${serial}`;

    if (isDbConnected()) {
      // Check duplicate email
      const dup = await Student.findOne({ email });
      if (dup) {
        return res.status(400).json({
          success: false,
          message: 'Student with this email already exists',
        });
      }

      const student = await Student.create({
        name,
        email,
        rollNumber,
        department,
        semester: parseInt(semester, 10) || 1,
        dateOfBirth,
        gender,
        phone,
        profileImage,
      });

      return res.status(201).json({
        success: true,
        data: student,
      });
    } else {
      // Create mock student in local memory
      const newStu = {
        _id: "stu_" + (mockStudents.length + 1),
        name,
        email,
        rollNumber,
        department,
        semester: parseInt(semester, 10) || 1,
        dateOfBirth: dateOfBirth || "2006-05-05",
        gender: gender || "Male",
        phone: phone || "+1 (555) 000-0000",
        profileImage: profileImage || "",
        gpa: 3.0,
        cgpa: 3.0,
        attendanceRate: 85.0,
        riskStatus: "Low",
      };

      mockStudents.push(newStu);

      return res.status(201).json({
        success: true,
        data: newStu,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update student details
// @route   PUT /api/students/:id
// @access  Private (Admin & Teacher)
exports.updateStudent = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (isDbConnected()) {
      const student = await Student.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: student,
      });
    } else {
      const idx = mockStudents.findIndex(s => s._id === id);
      if (idx === -1) {
        return res.status(404).json({
          success: false,
          message: 'Student not found',
        });
      }

      mockStudents[idx] = {
        ...mockStudents[idx],
        ...req.body,
      };

      return res.status(200).json({
        success: true,
        data: mockStudents[idx],
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student record
// @route   DELETE /api/students/:id
// @access  Private (Admin)
exports.deleteStudent = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (isDbConnected()) {
      const student = await Student.findByIdAndDelete(id);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found',
        });
      }

      // Cleanup associated logs in MongoDB
      await Grade.deleteMany({ student: id });
      await Attendance.deleteMany({ student: id });

      return res.status(200).json({
        success: true,
        message: 'Student deleted successfully',
      });
    } else {
      const idx = mockStudents.findIndex(s => s._id === id);
      if (idx === -1) {
        return res.status(404).json({
          success: false,
          message: 'Student not found',
        });
      }

      mockStudents.splice(idx, 1);

      return res.status(200).json({
        success: true,
        message: 'Student deleted successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};
