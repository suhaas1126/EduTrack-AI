import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { GraduationCap, Mail, Lock, Eye, EyeOff, Info, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showNotification('Please fill in all credentials.', 'warning');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      showNotification('Successfully authenticated. Welcome back to EduTrack AI.', 'success');
      
      // Dynamic routing based on logged user role
      setTimeout(() => {
        const token = localStorage.getItem('token');
        if (token) {
          const parts = token.split('.');
          if (parts.length === 3) {
            const decoded = JSON.parse(atob(parts[1]));
            if (decoded.role === 'admin') navigate('/admin-dashboard');
            else if (decoded.role === 'teacher') navigate('/teacher-dashboard');
            else navigate('/student-dashboard');
          }
        }
      }, 300);
    } else {
      showNotification(result.message || 'Authentication failed. Please verify credentials.', 'error');
    }
  };

  // Helper to pre-populate login input fields for demonstration
  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    showNotification(`Loaded ${demoEmail.split('@')[0]} demo credentials. Click Sign In.`, 'info');
  };

  return (
    <div className="relative min-h-screen bg-slate-900 flex flex-col justify-center items-center px-6 overflow-hidden text-slate-100">
      
      {/* Mesh glow vectors */}
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-brand-500/10 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] bg-indigo-500/10 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Main glass card container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-8 rounded-3xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-lg shadow-2xl relative z-10"
      >
        {/* Banner Title */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-md mx-auto">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white mt-4">
            Welcome to EduTrack AI
          </h2>
          <p className="text-slate-400 text-xs font-medium">
            Sign in with a role-based demo profile to explore the full-stack dashboard.
          </p>
        </div>

        {/* Inputs Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Campus Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@studentsphere.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Security Password
              </label>
              <span className="text-[10px] text-brand-400 hover:underline cursor-pointer font-semibold">
                Forgot key?
              </span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
                className="w-full pl-11 pr-11 py-3 bg-slate-900/60 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-450 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Sign-In Trigger */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold tracking-wide text-sm bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast-Pass logins */}
        <div className="mt-8 border-t border-slate-700/50 pt-5 space-y-3">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Info className="w-3.5 h-3.5 text-brand-400" />
            <span>Demo access profiles</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('admin@studentsphere.com')}
              className="py-2 text-[10px] font-extrabold uppercase tracking-wider bg-slate-900/80 hover:bg-brand-650 hover:text-white border border-slate-700/60 rounded-xl transition-all"
            >
              Admin
            </button>
            <button
              onClick={() => handleQuickLogin('teacher@studentsphere.com')}
              className="py-2 text-[10px] font-extrabold uppercase tracking-wider bg-slate-900/80 hover:bg-brand-650 hover:text-white border border-slate-700/60 rounded-xl transition-all"
            >
              Teacher
            </button>
            <button
              onClick={() => handleQuickLogin('student@studentsphere.com')}
              className="py-2 text-[10px] font-extrabold uppercase tracking-wider bg-slate-900/80 hover:bg-brand-650 hover:text-white border border-slate-700/60 rounded-xl transition-all"
            >
              Student
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-500 font-semibold mt-2">
            Default passcode is <code className="text-brand-400 font-bold px-1 bg-slate-950/40 rounded">password123</code>
          </p>
        </div>

        {/* Go to register details */}
        <div className="mt-6 text-center text-xs text-slate-450 font-medium">
          Do not have a student account?{' '}
          <Link to="/register" className="text-brand-400 hover:underline font-bold">
            Create Profile
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
