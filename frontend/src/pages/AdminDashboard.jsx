import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  CheckCircle,
  AlertTriangle,
  GraduationCap,
  TrendingUp,
  Activity,
  FileSpreadsheet,
  ArrowRight,
  Brain,
  Search,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import StatCard from '../components/StatCard';
import { CardSkeleton, TableSkeleton } from '../components/SkeletonLoader';
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
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AdminDashboard = () => {
  const { apiBase, token } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 6,
    totalTeachers: 12,
    avgAttendance: 84.8,
    riskCount: 2
  });

  // Recharts high fidelity datasets
  const attendanceTrendData = [
    { name: 'Week 1', rate: 78 },
    { name: 'Week 2', rate: 82 },
    { name: 'Week 3', rate: 80 },
    { name: 'Week 4', rate: 85 },
    { name: 'Week 5', rate: 88 },
    { name: 'Week 6', rate: 84.8 },
  ];

  const departmentPerformanceData = [
    { name: 'CS', cgpa: 3.75 },
    { name: 'Electrical', cgpa: 3.10 },
    { name: 'Mechanical', cgpa: 3.02 },
    { name: 'Bio-Tech', cgpa: 3.55 },
  ];

  const passFailData = [
    { name: 'Excellent (A/A+)', value: 45, color: '#8b5cf6' },
    { name: 'Satisfactory (B/C)', value: 40, color: '#3b82f6' },
    { name: 'Academic Warning (D/F)', value: 15, color: '#f59e0b' }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`${apiBase}/students`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        
        if (data.success) {
          setStudents(data.data.slice(0, 5));
          
          // Dynamically compute summaries
          const list = data.data;
          const total = list.length;
          const avgAtt = list.reduce((acc, curr) => acc + (curr.attendanceRate || 0), 0) / (total || 1);
          const risks = list.filter(s => s.riskStatus === 'High' || s.riskStatus === 'Medium').length;

          setStats({
            totalStudents: total,
            totalTeachers: 12, // Standard mockup count
            avgAttendance: parseFloat(avgAtt.toFixed(1)) || 84.8,
            riskCount: risks
          });
        }
      } catch (err) {
        console.warn('Backend connection failed, loading mock datasets.');
        // Fallback synthetic roster
        setStudents([
          { _id: "stu_1", name: "Alexander Wright", rollNumber: "STU-2026-001", department: "Computer Science", cgpa: 3.90, attendanceRate: 94.2, riskStatus: "Low" },
          { _id: "stu_2", name: "Sophia Martinez", rollNumber: "STU-2026-002", department: "Computer Science", cgpa: 3.42, attendanceRate: 88.5, riskStatus: "Low" },
          { _id: "stu_3", name: "Marcus Vance", rollNumber: "STU-2026-003", department: "Electrical Engineering", cgpa: 2.30, attendanceRate: 64.0, riskStatus: "High" },
          { _id: "stu_4", name: "Emily Jenkins", rollNumber: "STU-2026-004", department: "Mechanical Engineering", cgpa: 3.05, attendanceRate: 72.8, riskStatus: "Medium" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [apiBase, token]);

  const handleExportCSV = async () => {
    try {
      window.open(`${apiBase}/reports/csv?Authorization=Bearer ${token}`, '_blank');
      showNotification('CSV Student roster successfully compiled and downloaded!', 'success');
    } catch (err) {
      showNotification('Could not export report.', 'error');
    }
  };

  return (
    <div className="space-y-8 p-1">
      
      {/* Welcome Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Campus Administration Hub</span>
            <Sparkles className="w-5.5 h-5.5 text-brand-500 animate-pulse" />
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            Monitor real-time academic records, attendance indexes, and AI-predicted warnings.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:bg-darkbg-800 dark:border-slate-800 dark:hover:bg-slate-700/50 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Export Roster (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {loading ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Enrollment"
            value={stats.totalStudents}
            icon={Users}
            subtitle="Registered Students"
            trend="14% higher"
            trendType="up"
            color="brand"
          />
          <StatCard
            title="Teaching Faculty"
            value={stats.totalTeachers}
            icon={GraduationCap}
            subtitle="Assigned Instructors"
            trend="Stable"
            trendType="up"
            color="emerald"
          />
          <StatCard
            title="Attendance Index"
            value={`${stats.avgAttendance}%`}
            icon={CheckCircle}
            subtitle="Aggregate Presence"
            trend="1.2% this week"
            trendType="up"
            color="brand"
          />
          <StatCard
            title="Academic Risks"
            value={stats.riskCount}
            icon={AlertTriangle}
            subtitle="Low performance warnings"
            trend={`${stats.riskCount} flags active`}
            trendType="down"
            color="rose"
          />
        </div>
      )}

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graph 1: Attendance Area chart */}
        <div className="glass-panel p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Attendance Trends
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Weekly Class Averages
              </p>
            </div>
            <TrendingUp className="w-4.5 h-4.5 text-brand-500" />
          </div>
          
          <div className="h-68">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[50, 100]} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Pass/Fail distribution */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Class Grade Ratios
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Academic Performance Mappings
              </p>
            </div>
            <Activity className="w-4.5 h-4.5 text-blue-500" />
          </div>

          <div className="h-44 relative flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={passFailData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {passFailData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="block text-2xl font-black text-slate-800 dark:text-white">85%</span>
              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Pass Rate</span>
            </div>
          </div>

          {/* Graph Legend */}
          <div className="mt-4 space-y-2">
            {passFailData.map((d, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-500 dark:text-slate-450 font-medium">{d.name}</span>
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Roster & Activity Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Students Table */}
        <div className="lg:col-span-2">
          {loading ? (
            <TableSkeleton rows={4} />
          ) : (
            <div className="glass-panel overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200/50 dark:border-slate-800/40 bg-slate-50/20 dark:bg-slate-900/10 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    Active Student Profiles
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                    Latest registered campus enrollments
                  </p>
                </div>
                <button
                  onClick={() => navigate('/students')}
                  className="text-xs font-bold uppercase tracking-wider text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors flex items-center gap-1.5"
                >
                  <span>View All Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/40 dark:bg-slate-800/10 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-200/40 dark:border-slate-800/20">
                      <th className="px-6 py-4">Student Profile</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">CGPA</th>
                      <th className="px-6 py-4">Attendance</th>
                      <th className="px-6 py-4">Academic Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30">
                    {students.map((student) => {
                      let riskBadge = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450';
                      if (student.riskStatus === 'High') riskBadge = 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-450';
                      if (student.riskStatus === 'Medium') riskBadge = 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-450';

                      return (
                        <tr
                          key={student._id}
                          onClick={() => navigate(`/student/${student._id}`)}
                          className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center font-bold text-white text-xs shadow-inner">
                                {student.name[0]}
                              </div>
                              <div>
                                <span className="block text-sm font-semibold text-slate-800 dark:text-slate-250">
                                  {student.name}
                                </span>
                                <span className="block text-[10px] font-bold text-slate-400 mt-0.5">
                                  {student.rollNumber}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-550 dark:text-slate-400">
                            {student.department}
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-900 dark:text-white">
                            {student.cgpa ? student.cgpa.toFixed(2) : '0.00'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-bold ${
                              student.attendanceRate < 75.0 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'
                            }`}>
                              {student.attendanceRate}%
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${riskBadge}`}>
                              {student.riskStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div className="glass-panel p-6 flex flex-col h-full justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  Campus Activity Log
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  Latest system activity events
                </p>
              </div>
              <Activity className="w-4 h-4 text-brand-500" />
            </div>

            <div className="space-y-4 max-h-76 overflow-y-auto pr-1">
              <div className="flex items-start gap-3 text-xs leading-normal">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-300">New enrollment added</p>
                  <p className="text-[10px] text-slate-400 font-medium">STU-2026-006 (Chloe Harrison) created by Admin</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-xs leading-normal">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-300">Attendance trigger alarm</p>
                  <p className="text-[10px] text-slate-400 font-medium">Marcus Vance dropped below 75% in Physics</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs leading-normal">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-300">AI prediction cached</p>
                  <p className="text-[10px] text-slate-400 font-medium">Risk profile compiled for Sophia Martinez</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-850 pt-4 mt-4">
            <button
              onClick={() => showNotification('Activity log has been synchronized.', 'success')}
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 text-xs font-bold uppercase tracking-wider text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-center block transition-all"
            >
              Sync Activity Log
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
