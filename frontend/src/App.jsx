import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

// Import Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentsPage from './pages/StudentsPage';
import StudentDetailsPage from './pages/StudentDetailsPage';
import AttendancePage from './pages/AttendancePage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

// Import Shared Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Protected Route Guard Component
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin"></div>
          <p className="text-sm font-bold uppercase tracking-widest text-slate-450">Authenticating Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Graceful routing fallback depending on logged profile
    if (user?.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user?.role === 'teacher') return <Navigate to="/teacher-dashboard" replace />;
    return <Navigate to="/student-dashboard" replace />;
  }

  return <Outlet />;
};

// Logged In Shell Layout
const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar Panel Navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Dashboard Workspace Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar Hub */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Dynamic Route Container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Route Roster with Main Layout Wrapper */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  {/* Admin Roles exclusive */}
                  <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  </Route>

                  {/* Teacher Roles exclusive */}
                  <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                    <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
                    {/* Maps /grades to TeacherDashboard with Grades log active */}
                    <Route path="/grades" element={<TeacherDashboard />} />
                  </Route>

                  {/* Student Roles exclusive */}
                  <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                    <Route path="/student-dashboard" element={<StudentDashboard />} />
                  </Route>

                  {/* Shared/Common accessible routes */}
                  <Route path="/students" element={<StudentsPage />} />
                  <Route path="/student/:id" element={<StudentDetailsPage />} />
                  <Route path="/attendance" element={<AttendancePage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />

                  {/* Redirection Gatekeeper */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
