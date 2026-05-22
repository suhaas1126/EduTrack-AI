import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  CheckCircle,
  Calendar,
  ShieldCheck,
  Brain,
  TrendingUp,
  FileText,
  Activity,
  AlertTriangle,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import StatCard from '../components/StatCard';
import { CardSkeleton, ProfileSkeleton } from '../components/SkeletonLoader';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const StudentDashboard = () => {
  const { apiBase, token, user } = useAuth();
  const { showNotification } = useNotification();
  
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  
  // AI stats states
  const [aiInsights, setAiInsights] = useState([]);
  const [aiRecs, setAiRecs] = useState([]);
  const [aiScore, setAiScore] = useState(12);

  // Subjects data logs
  const [gradesList, setGradesList] = useState([]);
  const [attendanceGrouped, setAttendanceGrouped] = useState([]);

  // Term schedule mockup data
  const timetable = [
    { time: '09:00 AM', subject: 'Mathematics', instructor: 'Prof. Davis', room: 'Hall A' },
    { time: '11:00 AM', subject: 'Programming Basics', instructor: 'Prof. Katherine', room: 'Lab 2' },
    { time: '02:00 PM', subject: 'Physics', instructor: 'Prof. Walter', room: 'Hall C' }
  ];

  useEffect(() => {
    const fetchStudentData = async () => {
      // For student role, query their matched student profile ID
      // If none, default to mockAlexander ID 'stu_1' for evaluation
      const studentId = user?.id === 'mock_user_student' ? 'stu_1' : (user?.id || 'stu_1');

      try {
        const res = await fetch(`${apiBase}/students/${studentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        
        if (data.success) {
          setStudent(data.data.student);
          setGradesList(data.data.grades || []);
        }

        // Fetch attendance logs
        const attRes = await fetch(`${apiBase}/attendance/student/${studentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const attData = await attRes.json();
        if (attData.success) {
          setAttendanceGrouped(attData.grouped || []);
        }

        // Fetch AI diagnostics
        const aiRes = await fetch(`${apiBase}/ai/insights/${studentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const aiData = await aiRes.json();
        if (aiData.success) {
          setAiInsights(aiData.data.insights || []);
          setAiRecs(aiData.data.recommendations || []);
          setAiScore(aiData.data.score || 12);
        }
      } catch (err) {
        console.warn('Backend offline, loading student demo records.');
        // High-fidelity fallback mock dataset
        setStudent({
          _id: "stu_1",
          name: "Alexander Wright",
          rollNumber: "STU-2026-001",
          email: "alexander.w@studentsphere.edu",
          department: "Computer Science",
          semester: 6,
          cgpa: 3.90,
          attendanceRate: 94.2,
          riskStatus: "Low"
        });
        setGradesList([
          { _id: "g1", subject: "Mathematics", marksObtained: 88, maxMarks: 100, semester: 6, grade: "A" },
          { _id: "g2", subject: "Physics", marksObtained: 76, maxMarks: 100, semester: 6, grade: "B" },
          { _id: "g3", subject: "Programming Basics", marksObtained: 94, maxMarks: 100, semester: 6, grade: "A+" }
        ]);
        setAttendanceGrouped([
          { subject: "Mathematics", rate: 91.7 },
          { subject: "Physics", rate: 75.0 },
          { subject: "Programming Basics", rate: 100.0 }
        ]);
        setAiInsights([
          "Excellent attendance discipline maintained at 94.2%.",
          "Solid academic scores logged in Term CS course files."
        ]);
        setAiRecs([
          "Continue maintaining current classroom participation levels.",
          "Check advanced AI honors courses next term."
        ]);
        setAiScore(12);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [apiBase, token, user]);

  return (
    <div className="space-y-8 p-1">
      
      {/* Title */}
      {student && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>Student Academic Portal</span>
              <Sparkles className="w-5.5 h-5.5 text-brand-500" />
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-medium">
              Alexander Wright — Roll STU-2026-001 | Term 6 Computer Science.
            </p>
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      {loading || !student ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="My CGPA"
            value={student.cgpa ? student.cgpa.toFixed(2) : '3.90'}
            icon={GraduationCap}
            subtitle="Academic GPA Indicator"
            color="brand"
          />
          <StatCard
            title="Attendance standing"
            value={`${student.attendanceRate}%`}
            icon={CheckCircle}
            subtitle="Class Presence Index"
            color="emerald"
          />
          <StatCard
            title="Active Term"
            value={`Semester ${student.semester}`}
            icon={Calendar}
            subtitle="Current Course Track"
            color="brand"
          />
          <StatCard
            title="AI Risk rating"
            value={student.riskStatus}
            icon={ShieldCheck}
            subtitle="Predictive Academic Risk"
            color={student.riskStatus === 'Low' ? 'emerald' : student.riskStatus === 'Medium' ? 'amber' : 'rose'}
          />
        </div>
      )}

      {/* Recharts Grades Bar Chart & Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graph 1: Recharts grades */}
        <div className="glass-panel p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Subject Grade Distributions
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Current Term Marks (scored / 100)
              </p>
            </div>
            <TrendingUp className="w-4 h-4 text-brand-500" />
          </div>

          <div className="h-68">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradesList} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="subject" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Bar dataKey="marksObtained" fill="#8b5cf6" radius={[8, 8, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timetable schedule list */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-5 border-b border-slate-100 dark:border-slate-850 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                My Class Timetable
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Today Schedule Lectures
              </p>
            </div>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>

          <div className="space-y-4">
            {timetable.map((t, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/10 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t.subject}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-medium">
                    {t.instructor} • {t.room}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200/50 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30">
                  {t.time}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* AI Performance Diagnostics & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Panel 1: AI Insights */}
        <div className="glass-panel p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-5 border-b border-slate-100 dark:border-slate-850 pb-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-500">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                AI Diagnostic Insights
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Automatic performance evaluation curves
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {aiInsights.map((insight, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-200/40 dark:border-slate-800/50 flex items-start gap-3"
              >
                <Activity className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-slate-650 dark:text-slate-300 font-semibold leading-relaxed">
                  {insight}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Recommendations checklists */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-2 mb-5 border-b border-slate-100 dark:border-slate-850 pb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Targeted Checklists
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Improvement actions
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {aiRecs.map((rec, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/15 text-amber-900 dark:bg-amber-950/10 dark:border-amber-900/20 dark:text-amber-100 flex items-start gap-2.5"
              >
                <div className="w-4.5 h-4.5 rounded-lg bg-amber-500/20 border border-amber-500/20 flex items-center justify-center text-[10px] font-bold text-amber-600 dark:text-amber-450 mt-0.5 flex-shrink-0">
                  {idx + 1}
                </div>
                <span className="text-xs font-semibold leading-normal">
                  {rec}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;
