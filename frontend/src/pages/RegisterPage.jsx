import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { GraduationCap, Mail, Lock, User, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showNotification('Please fill in all registration fields.', 'warning');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password, role);
    setLoading(false);

    if (result.success) {
      showNotification('Account created successfully. Welcome to EduTrack AI.', 'success');
      
      // Navigate to respective dashboards
      setTimeout(() => {
        if (role === 'admin') navigate('/admin-dashboard');
        else if (role === 'teacher') navigate('/teacher-dashboard');
        else navigate('/student-dashboard');
      }, 300);
    } else {
      showNotification(result.message || 'Registration failed.', 'error');
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 flex flex-col justify-center items-center px-6 overflow-hidden text-slate-100">
      
      {/* Glow spots */}
      <div className="absolute top-[20%] right-[20%] w-[350px] h-[350px] bg-brand-500/10 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[20%] w-[350px] h-[350px] bg-indigo-500/10 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-8 rounded-3xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-lg shadow-2xl relative z-10"
      >
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-md mx-auto">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white mt-4">
            Register Account
          </h2>
          <p className="text-slate-400 text-xs font-medium">
            Join the EduTrack AI academic operations platform.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-350">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-355">
              Campus Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane.doe@edutrack.edu"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-355">
              Security Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
              />
            </div>
          </div>

          {/* Role selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-355">
              System Access Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['student', 'teacher', 'admin'].map((roleOpt) => (
                <button
                  key={roleOpt}
                  type="button"
                  onClick={() => setRole(roleOpt)}
                  className={`py-2 px-3 rounded-xl border text-[10px] font-bold uppercase tracking-wide transition-all ${
                    role === roleOpt
                      ? 'bg-brand-600 border-brand-500 text-white shadow-md shadow-brand-600/10'
                      : 'bg-slate-900/50 border-slate-750 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {roleOpt}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold tracking-wide text-sm bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Registering...' : 'Register Profile'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-450 font-medium">
          Already registered?{' '}
          <Link to="/login" className="text-brand-400 hover:underline font-bold">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
