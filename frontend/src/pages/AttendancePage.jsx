import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckSquare, Search, Filter, AlertTriangle, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { TableSkeleton } from '../components/SkeletonLoader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AttendancePage = () => {
  const { apiBase, token, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  
  // Filtering & search variables
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');

  // Graph logs mockup
  const classAveragesData = [
    { subject: 'Mathematics', rate: 91.7 },
    { subject: 'Physics', rate: 75.0 },
    { subject: 'Programming Basics', rate: 100.0 }
  ];

  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        const queryParams = new URLSearchParams({
          search,
          department,
          semester
        }).toString();

        const res = await fetch(`${apiBase}/students?${queryParams}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        
        if (data.success) {
          setStudents(data.data);
        }
      } catch (err) {
        console.warn('Backend offline, loading fallback mock roster.');
        setStudents([
          { _id: "stu_1", name: "Alexander Wright", rollNumber: "STU-2026-001", department: "Computer Science", semester: 6, attendanceRate: 94.2 },
          { _id: "stu_2", name: "Sophia Martinez", rollNumber: "STU-2026-002", department: "Computer Science", semester: 6, attendanceRate: 88.5 },
          { _id: "stu_3", name: "Marcus Vance", rollNumber: "STU-2026-003", department: "Electrical Engineering", semester: 4, attendanceRate: 64.0 },
          { _id: "stu_4", name: "Emily Jenkins", rollNumber: "STU-2026-004", department: "Mechanical Engineering", semester: 4, attendanceRate: 72.8 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsData();
  }, [search, department, semester, apiBase, token]);

  return (
    <div className="space-y-8 p-1">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Campus Attendance Monitor
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            Analyze campus presence averages, observe active low warnings, and compile registries.
          </p>
        </div>

        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <button
            onClick={() => navigate('/teacher-dashboard')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-md shadow-brand-600/10 flex items-center gap-2 transition-all"
          >
            <CheckSquare className="w-4.5 h-4.5" />
            <span>Open Marking Grid</span>
          </button>
        )}
      </div>

      {/* Analytics chart panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="glass-panel p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Subject Classroom Presence Averages
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Aggregate presence indices per module
              </p>
            </div>
            <BookOpen className="w-4 h-4 text-brand-500" />
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classAveragesData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip />
                <Bar dataKey="rate" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Warning card block */}
        <div className="glass-panel p-6 bg-gradient-to-br from-rose-500/5 to-pink-500/5 border border-rose-500/10 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-rose-100 dark:border-rose-950/20 pb-3">
              <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-850 dark:text-slate-100">Low Attendance Alarms</h3>
                <p className="text-[9px] uppercase tracking-wider text-rose-500 font-bold mt-0.5">Below mandatory 75% standard</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-white/70 border border-slate-100 rounded-xl text-xs dark:bg-darkbg-800/80 dark:border-slate-800/80">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-800 dark:text-slate-200">Marcus Vance</span>
                  <span className="text-rose-500">64.0%</span>
                </div>
                <span className="block text-[10px] text-slate-400 font-semibold mt-1">Electrical Engineering • Term 4</span>
              </div>

              <div className="p-3 bg-white/70 border border-slate-100 rounded-xl text-xs dark:bg-darkbg-800/80 dark:border-slate-800/80">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-800 dark:text-slate-200">Emily Jenkins</span>
                  <span className="text-rose-550">72.8%</span>
                </div>
                <span className="block text-[10px] text-slate-400 font-semibold mt-1">Mechanical Engineering • Term 4</span>
              </div>
            </div>
          </div>

          <div className="border-t border-rose-100 dark:border-rose-950/20 pt-4">
            <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold">
              Warning flags automatically deliver automated SMS/Email bulletins to registered profiles.
            </p>
          </div>
        </div>

      </div>

      {/* Directory filters & Roster */}
      <div className="space-y-6">
        
        {/* Filters Bar */}
        <div className="glass-panel p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-250 bg-slate-50 dark:bg-darkbg-800 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full py-2.5 px-3 border border-slate-250 bg-slate-50 dark:bg-darkbg-800 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">All Departments</option>
              <option>Computer Science</option>
              <option>Electrical Engineering</option>
              <option>Mechanical Engineering</option>
              <option>Bio-Technology</option>
            </select>
          </div>

          <div>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full py-2.5 px-3 border border-slate-250 bg-slate-50 dark:bg-darkbg-800 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">All Semesters</option>
              <option value="2">Semester 2</option>
              <option value="4">Semester 4</option>
              <option value="6">Semester 6</option>
              <option value="8">Semester 8</option>
            </select>
          </div>

        </div>

        {/* Directory table */}
        {loading ? (
          <TableSkeleton rows={4} />
        ) : (
          <div className="glass-panel overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/40 dark:bg-slate-800/10 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-200/40 dark:border-slate-800/20">
                  <th className="px-6 py-4">Student Profile</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Term</th>
                  <th className="px-6 py-4 text-center">Aggregate Attendance</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-xs text-slate-400">
                      No matching student registers found.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student._id} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/5 transition-colors">
                      <td className="px-6 py-4 font-semibold text-sm text-slate-800 dark:text-slate-250">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                        {student.department}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">
                        Semester {student.semester}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-sm font-bold ${
                          student.attendanceRate < 75.0 ? 'text-rose-500 animate-pulse' : 'text-slate-800 dark:text-slate-250'
                        }`}>
                          {student.attendanceRate ? `${student.attendanceRate}%` : '0.0%'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => navigate(`/student/${student._id}`)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-550 hover:text-white dark:bg-darkbg-800 dark:hover:bg-slate-700/50 text-[10px] font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1"
                        >
                          <span>Analyze</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};

export default AttendancePage;
