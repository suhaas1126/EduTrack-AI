import React, { createContext, useState, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, X, XCircle } from 'lucide-react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Trigger alert dispatcher
  const showNotification = useCallback((message, type = 'info') => {
    const id = 'toast_' + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  }, []);

  const removeNotification = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, toasts }}>
      {children}

      {/* Renders dynamic alerts floating on the bottom-right */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full no-print">
        <AnimatePresence>
          {toasts.map((toast) => {
            let bgColor = 'bg-white/90 border-slate-200 text-slate-800 dark:bg-slate-800/90 dark:border-slate-700 dark:text-slate-100';
            let icon = <Info className="text-blue-500 w-5 h-5 flex-shrink-0" />;

            if (toast.type === 'success') {
              bgColor = 'bg-emerald-50/90 border-emerald-200/50 text-emerald-900 dark:bg-emerald-950/95 dark:border-emerald-800/40 dark:text-emerald-100';
              icon = <CheckCircle className="text-emerald-500 w-5 h-5 flex-shrink-0" />;
            } else if (toast.type === 'error') {
              bgColor = 'bg-rose-50/90 border-rose-200/50 text-rose-900 dark:bg-rose-950/95 dark:border-rose-800/40 dark:text-rose-100';
              icon = <XCircle className="text-rose-500 w-5 h-5 flex-shrink-0" />;
            } else if (toast.type === 'warning') {
              bgColor = 'bg-amber-50/90 border-amber-200/50 text-amber-900 dark:bg-amber-950/95 dark:border-amber-800/40 dark:text-amber-100';
              icon = <AlertTriangle className="text-amber-500 w-5 h-5 flex-shrink-0" />;
            }

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
                layout
                className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg ${bgColor}`}
              >
                {icon}
                <div className="flex-1 text-sm font-medium pr-1">
                  {toast.message}
                </div>
                <button
                  onClick={() => removeNotification(toast.id)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
