import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  GraduationCap,
  TrendingUp,
  FileText,
  Brain,
  Settings,
  LogOut,
  Sparkles,
  Calendar,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    const common = [
      { path: '/settings', label: 'Settings', icon: Settings },
    ];

    if (!user) return [];

    if (user.role === 'admin') {
      return [
        { path: '/admin-dashboard', label: 'Admin Panel', icon: LayoutDashboard },
        { path: '/students', label: 'Students Directory', icon: Users },
        { path: '/attendance', label: 'Attendance Monitor', icon: CheckSquare },
        { path: '/analytics', label: 'Campus Analytics', icon: TrendingUp },
        { path: '/reports', label: 'Reports Hub', icon: FileText },
        ...common,
      ];
    }

    if (user.role === 'teacher') {
      return [
        { path: '/teacher-dashboard', label: 'Teacher Panel', icon: LayoutDashboard },
        { path: '/students', label: 'Students List', icon: Users },
        { path: '/attendance', label: 'Record Attendance', icon: CheckSquare },
        { path: '/grades', label: 'Academic Logging', icon: GraduationCap },
        { path: '/reports', label: 'Class Reports', icon: FileText },
        ...common,
      ];
    }

    return [
      { path: '/student-dashboard', label: 'My Portal', icon: LayoutDashboard },
      { path: `/student/${user.id || 'me'}`, label: 'Academic Profile', icon: GraduationCap },
      { path: '/analytics', label: 'My Analytics', icon: TrendingUp },
      { path: '/reports', label: 'Report Cards', icon: FileText },
      ...common,
    ];
  };

  const navLinks = getNavLinks();

  const sidebarVariants = {
    open: { x: 0, opacity: 1, width: 280 },
    closed: { x: -280, opacity: 0, width: 0 }
  };

  return (
    <>
      {/* Background dimmer overlay on mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs md:hidden"
        />
      )}

      <motion.aside
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { x: 0, opacity: 1 },
          closed: { x: -280, opacity: 0 }
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col h-full bg-white border-r border-slate-200/60 dark:bg-darkbg-800 dark:border-slate-800/50 md:sticky md:block md:w-68 no-print`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/50 dark:border-slate-800/40">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-400">
                EduTrack AI
              </span>
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                Academic OS
              </span>
            </div>
          </div>

          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {user && (
          <div className="px-6 py-5 border-b border-slate-200/40 dark:border-slate-800/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-400 to-violet-500 flex items-center justify-center font-bold text-white text-sm shadow-inner uppercase">
                {user.name ? user.name[0] : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate text-slate-800 dark:text-slate-200">
                  {user.name}
                </p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200/50 dark:bg-brand-950/40 dark:text-brand-300 dark:border-brand-900/30">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all group relative ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/10'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/40'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-brand-500'
                    }`} />
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeSideIndicator"
                        className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200/40 dark:border-slate-800/30">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold tracking-wide text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all group"
          >
            <LogOut className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
