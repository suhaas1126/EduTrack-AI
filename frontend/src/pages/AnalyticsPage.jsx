import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart as PieIcon, LineChart as LineIcon, Activity, Sparkles } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AnalyticsPage = () => {

  // Mock High fidelity datasets
  const termGPAProgress = [
    { name: 'Semester 1', gpa: 3.42 },
    { name: 'Semester 2', gpa: 3.55 },
    { name: 'Semester 3', gpa: 3.48 },
    { name: 'Semester 4', gpa: 3.65 },
    { name: 'Semester 5', gpa: 3.82 },
    { name: 'Semester 6', gpa: 3.90 },
  ];

  const departmentRatios = [
    { name: 'Computer Science', count: 120, fill: '#8b5cf6' },
    { name: 'Electrical Engineering', count: 85, fill: '#3b82f6' },
    { name: 'Mechanical Engineering', count: 70, fill: '#f59e0b' },
    { name: 'Bio-Technology', count: 45, fill: '#10b981' },
  ];

  const cgpaDistribution = [
    { range: '3.5 - 4.0', count: 42 },
    { range: '3.0 - 3.4', count: 28 },
    { range: '2.5 - 2.9', count: 18 },
    { range: '2.0 - 2.4', count: 8 },
    { range: '< 2.0', count: 4 },
  ];

  return (
    <div className="space-y-8 p-1">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Campus Analytics Hub</span>
          <Sparkles className="w-5.5 h-5.5 text-brand-500 animate-pulse" />
        </h1>
        <p className="text-slate-400 text-sm mt-1 font-medium">
          Visualize term grade parameters, department ratios, and academic curves.
        </p>
      </div>

      {/* Main Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Graph 1: CGPA progress line */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                GPA Trajectory Growth
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Semester-wise average GPAs
              </p>
            </div>
            <LineIcon className="w-4.5 h-4.5 text-brand-500" />
          </div>

          <div className="h-68">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={termGPAProgress} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[3.0, 4.0]} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="gpa" stroke="#8b5cf6" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Department registrations bar */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Enrollment Distribution
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Departmental student registries
              </p>
            </div>
            <BarChart3 className="w-4.5 h-4.5 text-emerald-500" />
          </div>

          <div className="h-68">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentRatios} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={36}>
                  {departmentRatios.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 3: CGPA bell curves */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                CGPA Distribution Grid
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Number of profiles per rating range
              </p>
            </div>
            <Activity className="w-4.5 h-4.5 text-blue-500" />
          </div>

          <div className="h-68">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cgpaDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 4: Dynamic Performance Overview text block */}
        <div className="glass-panel p-6 bg-gradient-to-tr from-brand-500/5 to-indigo-500/5 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <span className="p-2 bg-brand-500/10 border border-brand-500/20 text-brand-500 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-sm text-slate-850 dark:text-slate-150">Term Evaluation Summaries</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Statistical Analysis observations</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs font-semibold text-slate-600 dark:text-slate-350 leading-relaxed">
              <p>
                1. <strong className="text-slate-900 dark:text-white">Computer Science</strong> maintains the peak departmental rating with a cumulative average CGPA of <strong>3.75</strong> across cohorts.
              </p>
              <p>
                2. Student presence rate has climbed to <strong>88.5%</strong> aggregate since midterm modules, minimizing overall term risks.
              </p>
              <p>
                3. Over <strong>42%</strong> of enrolled student profiles are positioned within Dean's list standards (GPA 3.5 - 4.0).
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-850 pt-4">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest block">
              Updated 1 min ago - EduTrack AI Engine
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsPage;
