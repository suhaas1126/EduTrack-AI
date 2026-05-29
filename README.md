# EduTrack AI

A production-ready MERN Stack Student Management Platform featuring role-based dashboards, JWT authentication, attendance tracking, grade management, analytics, and cloud deployment.

## Live Demo

**Live Application:** https://edutrack-ai-4.onrender.com

**GitHub Repository:** https://github.com/suhaas1126/EduTrack-AI

---

## Overview

EduTrack AI is a full-stack student management system designed to streamline academic operations for administrators, teachers, and students.

The platform provides secure authentication, role-based access control, attendance management, grade tracking, reporting, analytics dashboards, and AI-assisted academic risk assessment.

Built using the MERN Stack and deployed to the cloud using Render and MongoDB Atlas.

---

## Features

### Authentication & Security

* JWT-based Authentication
* Protected Routes
* Role-Based Access Control (RBAC)
* Secure API Authorization

### Admin Dashboard

* Manage Students
* View Academic Analytics
* Monitor Attendance Records
* Access Reports and Insights

### Teacher Dashboard

* Manage Student Data
* Track Attendance
* Assign Grades
* View Academic Performance

### Student Dashboard

* View Attendance
* Track Grades
* Access Academic Progress Reports
* Monitor Performance Trends

### Analytics & Insights

* Attendance Analytics
* Grade Performance Tracking
* Student Performance Visualization
* AI-Assisted Risk Assessment

### Backend Features

* RESTful API Architecture
* Centralized Error Handling
* Health Monitoring Endpoint
* MongoDB Atlas Integration
* Mongoose ODM Data Modeling

---

## Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router
* Recharts
* Framer Motion

### Backend

* Node.js
* Express.js
* JWT Authentication
* Mongoose

### Database

* MongoDB Atlas

### Deployment

* Render
* MongoDB Atlas Cloud

---

## Project Architecture

```text
EduTrack AI
│
├── Frontend (React.js)
│
├── Backend (Node.js + Express.js)
│
├── Authentication (JWT)
│
├── MongoDB Atlas Database
│
└── Render Cloud Deployment
```

---

## Demo Credentials

### Admin

```text
admin@studentsphere.com
password123
```

### Teacher

```text
teacher@studentsphere.com
password123
```

### Student

```text
student@studentsphere.com
password123
```

---

## API Endpoints

### Authentication

```text
/api/auth
```

### Students

```text
/api/students
```

### Attendance

```text
/api/attendance
```

### Grades

```text
/api/grades
```

### AI Insights

```text
/api/ai
```

### Reports

```text
/api/reports
```

### Health Check

```text
/health
```

---

## Local Setup

### Clone Repository

```bash
git clone https://github.com/suhaas1126/EduTrack-AI.git
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Environment Variables

Create:

```text
backend/.env
```

Add:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Run Frontend

```bash
cd frontend
npm run dev
```

### Run Backend

```bash
cd backend
npm start
```

---

## Deployment

### Frontend & Backend

Hosted on Render:

https://edutrack-ai-4.onrender.com

### Database

MongoDB Atlas Cloud Database

---

## Key Highlights

* Production-Ready MERN Stack Application
* JWT Authentication & RBAC
* Cloud Deployment on Render
* MongoDB Atlas Integration
* RESTful API Development
* Analytics Dashboard
* AI-Assisted Academic Risk Assessment
* Responsive User Interface

---

## Author

**Suhaas Choudary Mallavarapu**

GitHub: https://github.com/suhaas1126

LinkedIn: Add Your LinkedIn Profile URL
