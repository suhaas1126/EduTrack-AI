import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendType, subtitle, color = 'brand' }) => {
  
  // Set distinct theme color palettes
  const colorMap = {
    brand: 'from-brand-500/20 to-indigo-500/5 text-brand-600 dark:text-brand-400 border-brand-500/10',
    emerald: 'from-emerald-500/20 to-teal-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/10',
    rose: 'from-rose-500/20 to-pink-500/5 text-rose-600 dark:text-rose-400 border-rose-500/10',
    amber: 'from-amber-500/20 to-yellow-500/5 text-amber-600 dark:text-amber-400 border-amber-500/10',
  };

  const bgGradient = colorMap[color] || colorMap.brand;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-panel glass-card-hover p-6 relative overflow-hidden flex flex-col justify-between h-full"
    >
      {/* Background soft color blur bubble */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${bgGradient} filter blur-xl opacity-20 rounded-full`} />

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {title}
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>

        <div className={`p-3 rounded-xl border bg-gradient-to-tr ${bgGradient}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 border-t border-slate-100 pt-3 dark:border-slate-800/50">
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 truncate pr-2">
          {subtitle}
        </span>

        {trend && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${
            trendType === 'up' ? 'text-emerald-500' : 'text-rose-500'
          }`}>
            {trendType === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
