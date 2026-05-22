import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Settings, Moon, Sun, ShieldAlert, Sparkles, User, Bell } from 'lucide-react';

const SettingsPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const saveSettings = () => {
    showNotification('System configuration cached successfully!', 'success');
  };

  return (
    <div className="space-y-8 p-1">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>System Settings</span>
          <Settings className="w-5.5 h-5.5 text-brand-500 animate-spin" style={{ animationDuration: '6s' }} />
        </h1>
        <p className="text-slate-400 text-sm mt-1 font-medium">
          Manage campus preferences, profile settings, and system interfaces.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        {user && (
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <User className="w-5 h-5 text-brand-500" />
              <h3 className="font-bold text-sm text-slate-850 dark:text-slate-200">Account Details</h3>
            </div>
            
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Full Name</span>
                <span className="block font-bold text-slate-800 dark:text-slate-200 mt-0.5">{user.name}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Email Address</span>
                <span className="block font-bold text-slate-800 dark:text-slate-200 mt-0.5">{user.email}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Access Privilege</span>
                <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/20 dark:text-brand-400 mt-1">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Visual Settings */}
        <div className="glass-panel p-6 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
            <Moon className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-sm text-slate-850 dark:text-slate-200">Visual Settings</h3>
          </div>

          <div className="space-y-5 text-xs font-semibold text-slate-650 dark:text-slate-350">
            <div className="flex items-center justify-between p-3.5 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/40 dark:bg-slate-900/10">
              <div className="space-y-1">
                <span className="block text-slate-850 dark:text-slate-250">Toggle Dark Theme Mode</span>
                <span className="block text-[10px] text-slate-400 font-semibold">Persists inside browser localStorage</span>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-14 h-8 rounded-full p-1 transition-all ${
                  isDark ? 'bg-brand-500 flex justify-end' : 'bg-slate-250 flex justify-start'
                }`}
              >
                <motion.div
                  layout
                  className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md"
                >
                  {isDark ? <Moon className="w-3.5 h-3.5 text-brand-600" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                </motion.div>
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/40 dark:bg-slate-900/10">
              <div className="space-y-1">
                <span className="block text-slate-850 dark:text-slate-250">Push notifications</span>
                <span className="block text-[10px] text-slate-400 font-semibold">Enable toast reminders</span>
              </div>
              <button
                onClick={() => showNotification('Notifications verified!', 'success')}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider rounded-xl bg-white hover:bg-slate-50 dark:bg-darkbg-800 dark:hover:bg-slate-700/50"
              >
                Verify Channels
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-850 pt-5 mt-4">
            <button
              onClick={saveSettings}
              className="px-6 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-md shadow-brand-600/10 transition-all ml-auto"
            >
              <span>Save System Settings</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default SettingsPage;
