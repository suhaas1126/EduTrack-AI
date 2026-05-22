const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/error');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with support for local development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Database connection helper
const connectDB = async () => {
  const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studentsphere';
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(dbUri);
    console.log('>>> SUCCESS: Connected to StudentSphere MongoDB Cluster.');
  } catch (error) {
    console.error('>>> DATABASE OFFLINE: Using Local Sandbox In-Memory failover mode.');
    console.error(error.message);
  }
};

// Initialize DB Connection
connectDB();

// Root check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    project: 'StudentSphere AI API Service',
    mode: mongoose.connection.readyState === 1 ? 'Production Cluster' : 'Local Sandbox Mode',
    timestamp: new Date()
  });
});

// Import route files
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Mount routes to API namespace
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reports', reportRoutes);

// Catch-all route handler for undefined endpoints
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: [${req.method}] ${req.originalUrl}`
  });
});

// Mount error handler middleware
app.use(errorHandler);

// Listen to port
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` STUDENTSPHERE AI BACKEND RUNNING        `);
  console.log(` Port: ${PORT}                           `);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'} `);
  console.log(`=========================================`);
});
