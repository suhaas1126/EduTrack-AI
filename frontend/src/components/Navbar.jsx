import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  Sun,
  Moon,
  Bell,
  Search,
  Menu,
  ChevronDown,
  Info,
  AlertTriangle,
  CheckCircle,
  MessageSquare
} from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'Course Enrolment Active',
      message: 'New semester enrollments are now officially active. Register modules early.',
      type: 'info',
      time: '1 hr ago',
      read: false
    },
    {
      id: 'n2',
      title: 'Low Attendance Warning',
      message: 'Marcus Vance attendance index has dropped to 64% in Physics.',
      type: 'warning',
      time: '3 hrs ago',
      read: false
    },
    {
      id: 'n3',
      title: 'Academic Grade Logged',
      message: 'Final exam grading for Programming Basics completed.',
      type: 'success',
      time: '1 day ago',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full px-6 py-4 bg-white/70 backdrop-blur-md border-b border-slate-200/50 dark:bg-darkbg-900/60 dark:border-slate-800/40 no-print">
      {/* Sidebar toggle & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl border border-slate-200/50 hover:bg-slate-100/50 dark:border-slate-850 dark:hover:bg-slate-800/50 transition-colors"
        >
          <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>

        {/* Custom Premium Search Container */}
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search students, roll numbers, departments..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all dark:bg-darkbg-800 dark:border-slate-800/80 dark:focus:ring-brand-500/10"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Toggle Theme Switcher */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200/50 bg-white hover:bg-slate-100/50 dark:bg-darkbg-800 dark:border-slate-800/80 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Sun className="w-4 h-4 text-amber-500" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Moon className="w-4 h-4 text-indigo-600" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Notifications Panel */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl border border-slate-200/50 bg-white hover:bg-slate-100/50 dark:bg-darkbg-800 dark:border-slate-800/80 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400 relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <>
                {/* Click outside shield */}
                <div
                  onClick={() => setShowNotifications(false)}
                  className="fixed inset-0 z-40 bg-transparent"
                />

                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-darkbg-800 border border-slate-200/60 dark:border-slate-800/70 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/50 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/10">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      System Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800/50 max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-slate-400">
                        No notifications to display.
                      </div>
                    ) : (
                      notifications.map(n => {
                        let icon = <Info className="text-blue-500 w-4 h-4 mt-0.5" />;
                        if (n.type === 'warning') icon = <AlertTriangle className="text-amber-500 w-4 h-4 mt-0.5" />;
                        if (n.type === 'success') icon = <CheckCircle className="text-emerald-500 w-4 h-4 mt-0.5" />;

                        return (
                          <div
                            key={n.id}
                            className={`flex gap-3 p-4 hover:bg-slate-50/40 dark:hover:bg-slate-700/10 transition-colors ${
                              !n.read ? 'bg-brand-50/20 dark:bg-brand-950/10' : ''
                            }`}
                          >
                            <div className="flex-shrink-0 mt-0.5">{icon}</div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-bold leading-tight ${n.read ? 'text-slate-700 dark:text-slate-350' : 'text-slate-950 dark:text-slate-50'}`}>
                                {n.title}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                                {n.message}
                              </p>
                              <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">
                                {n.time}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Small profile banner */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200/50 dark:border-slate-800/40">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-brand-500 flex items-center justify-center font-bold text-white text-xs shadow-inner">
              {user.name ? user.name[0] : 'U'}
            </div>
            <div className="hidden md:block text-left pr-1">
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-24 truncate leading-none">
                {user.name}
              </span>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                {user.role}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
