# EduTrack AI

EduTrack AI is a full-stack MERN student management platform built for role-based academic operations. It combines student records, attendance, grades, analytics, reports, JWT authentication, MongoDB persistence, and AI-style risk insights in a production-ready dashboard.

## Resume Summary

**EduTrack AI - Full-Stack Student Management Platform**

Built and deployed a MERN web application with role-based Admin, Teacher, and Student dashboards. Implemented JWT authentication, protected REST APIs, MongoDB Atlas data persistence, student CRUD workflows, attendance and grade tracking, analytics charts, report generation, AI-style academic risk insights, global error handling, health monitoring, and Render-compatible deployment where Express serves the React production build.

## Tech Stack

- React, Vite, Tailwind CSS, Framer Motion
- Node.js, Express.js
- MongoDB Atlas, Mongoose
- JWT authentication and role-based authorization
- Recharts analytics visualizations
- Render deployment

## Key Features

- Role-based dashboards for Admin, Teacher, and Student users
- Protected authentication flow with JWT
- Student profile management with search and filtering
- Attendance and grade workflows
- Academic analytics with interactive charts
- AI-style risk predictions and recommendations
- CSV/report tooling
- Production health endpoint at `/health`
- Centralized API error handling and 404 handling
- Single-service deployment support: Express can serve the React build and API routes together

## Demo Credentials

```text
admin@studentsphere.com
password123
```

```text
teacher@studentsphere.com
password123
```

```text
student@studentsphere.com
password123
```

## Local Development

Run the backend:

```bash
cd backend
npm install
npm run dev
```

Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Local URLs:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:5000
Health:   http://localhost:5000/health
```

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Optional for separately deployed frontend:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

When Express serves the frontend build from the same Render service, leave `VITE_API_BASE_URL` unset so the app uses `/api`.

## Render Deployment

The backend includes a `postinstall` script that builds the frontend during deployment. Express serves `frontend/dist` when it exists.

Recommended Render settings:

```bash
Build Command: cd backend && npm install
Start Command: cd backend && npm start
```

Required Render environment variables:

```env
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
```

## API Routes

- `GET /health`
- `/api/auth`
- `/api/students`
- `/api/attendance`
- `/api/grades`
- `/api/ai`
- `/api/reports`

## Project Structure

```text
EduTrack-AI/
  backend/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
    server.js
  frontend/
    src/
      components/
      context/
      pages/
      styles/
```
