const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const errorHandler = require('./middleware/error');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const clientDistPath = path.join(__dirname, '../frontend/dist');
const clientIndexPath = path.join(clientDistPath, 'index.html');

const getDatabaseStatus = () => {
  return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
};

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('>>> SUCCESS: Connected to EduTrack AI MongoDB Cluster.');
  } catch (error) {
    console.error('>>> DATABASE OFFLINE:', error.message);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('>>> DATABASE DISCONNECTED: MongoDB connection lost.');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    database: getDatabaseStatus(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reports', reportRoutes);

app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

if (fs.existsSync(clientIndexPath)) {
  app.use(express.static(clientDistPath));

  app.get('*', (req, res) => {
    res.sendFile(clientIndexPath);
  });
} else {
  app.get('/', (req, res) => {
    res.status(503).json({
      success: false,
      message: 'Frontend build not found. Redeploy with the frontend build step enabled.',
      expectedBuildPath: clientIndexPath,
    });
  });

  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    });
  });
}

app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(` EDUTRACK AI BACKEND RUNNING             `);
    console.log(` Port: ${PORT}                           `);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'} `);
    console.log(` Database: ${getDatabaseStatus()}                   `);
    console.log(`=========================================`);
  });
};

startServer();
