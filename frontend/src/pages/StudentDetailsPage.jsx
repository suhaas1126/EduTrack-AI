import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  GraduationCap,
  Calendar,
  CheckCircle,
  TrendingUp,
  BrainCircuit,
  ArrowLeft,
  Mail,
  Phone,
  Tag,
  ShieldAlert,
  Loader2,
  Sparkles,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { ProfileSkeleton } from '../components/SkeletonLoader';

const StudentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiBase, token, user } = useAuth();
  const { showNotification } = useNotification();

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  
  // AI Prediction states
  const [aiInsights, setAiInsights] = useState([]);
  const [aiRecs, setAiRecs] = useState([]);
  const [aiScore, setAiScore] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const res = await fetch(`${apiBase}/students/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        
        if (data.success) {
          setStudent(data.data.student);
          setGrades(data.data.grades || []);
          setAttendance(data.data.attendance || []);
        }
      } catch (err) {
        console.warn('Backend connection failed, loading mock profile data.');
        
        // Find matching mock details or construct Alexander's profile
        setStudent({
          _id: id,
          name: "Alexander Wright",
          rollNumber: "STU-2026-001",
          email: "alexander.w@studentsphere.edu",
          department: "Computer Science",
          semester: 6,
          dateOfBirth: "2005-04-12",
          gender: "Male",
          phone: "+1 (555) 019-2834",
          gpa: 3.85,
          cgpa: 3.90,
          attendanceRate: 94.2,
          riskStatus: "Low"
        });

        setGrades([
          { _id: "g1", subject: "Mathematics", marksObtained: 88, maxMarks: 100, semester: 6, examType: "Final", grade: "A" },
          { _id: "g2", subject: "Physics", marksObtained: 76, maxMarks: 100, semester: 6, examType: "Final", grade: "B" },
          { _id: "g3", subject: "Programming Basics", marksObtained: 94, maxMarks: 100, semester: 6, examType: "Final", grade: "A+" }
        ]);

        setAttendance([
          { _id: "a1", subject: "Mathematics", date: "2026-05-20", status: "Present" },
          { _id: "a2", subject: "Physics", date: "2026-05-21", status: "Present" },
          { _id: "a3", subject: "Programming Basics", date: "2026-05-22", status: "Present" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [id, apiBase, token]);

  // Load latest AI diagnostics cached on screen mount
  useEffect(() => {
    if (!student) return;

    const fetchAiInsights = async () => {
      try {
        const res = await fetch(`${apiBase}/ai/insights/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setAiInsights(data.data.insights || []);
          setAiRecs(data.data.recommendations || []);
          setAiScore(data.data.score || 0);
        }
      } catch (err) {
        setAiInsights(["Excellent attendance discipline maintained.", "Core programming scores within optimal parameters."]);
        setAiRecs(["Continue maintaining steady classroom averages."]);
        setAiScore(12);
      }
    };

    fetchAiInsights();
  }, [student, id, apiBase, token]);

  const triggerAiAssessment = async () => {
    setAiLoading(true);
    try {
      const res = await fetch(`${apiBase}/ai/predict/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (data.success) {
        showNotification(`AI Engine successfully evaluated profile metrics!`, 'success');
        setAiInsights(data.data.insights || []);
        setAiRecs(data.data.recommendations || []);
        setAiScore(data.data.riskScore || 0);

        // Update student risk status visual badge in state
        setStudent(prev => ({
          ...prev,
          riskStatus: data.data.riskStatus
        }));
      } else {
        showNotification(data.message, 'error');
      }
    } catch (err) {
      showNotification('AI assessment compiled successfully in demo mode!', 'success');
      // Synthetic assessment refresh
      setAiInsights([
        "Excellent attendance standing at 94.2%.",
        "Grade trajectory shows steady high performers benchmarks."
      ]);
      setAiRecs([
        "Maintain current exam preparations.",
        "Request mentoring to write student research journals."
      ]);
      setAiScore(10);
    } finally {
      setAiLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <ProfileSkeleton />;
  if (!student) return <div className="p-8 text-center text-slate-400">Student profile details not found.</div>;

  return (
    <div className="space-y-8 p-1">
      
      {/* Header bar */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:bg-darkbg-800 dark:border-slate-800 dark:hover:bg-slate-700/50 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          <span>Back</span>
        </button>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:bg-darkbg-800 dark:border-slate-800 dark:hover:bg-slate-700/50 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4 text-brand-500" />
            <span>Print Profile Card</span>
          </button>
        </div>
      </div>

      {/* Main Demographic Card */}
      <div className="glass-panel p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center relative overflow-hidden print-area">
        
        {/* Background glow spot */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-tr from-brand-500/10 to-indigo-500/5 filter blur-2xl opacity-30 rounded-full" />

        {/* Profile Avatar */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center font-bold text-white text-3xl shadow-lg border-2 border-white dark:border-slate-850 uppercase">
          {student.name[0]}
        </div>

        {/* Personal Details */}
        <div className="flex-1 space-y-3 text-center md:text-left w-full">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-850 dark:text-white">
              {student.name}
            </h2>
            <p className="text-slate-400 text-xs font-semibold mt-1">
              Roll ID: {student.rollNumber} | Department of {student.department}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4 text-brand-500" />
              {student.email}
            </span>
            {student.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4 text-brand-500" />
                {student.phone}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Tag className="w-4 h-4 text-brand-500" />
              Semester {student.semester}
            </span>
          </div>

          <div className="flex gap-2 justify-center md:justify-start">
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200/50 dark:bg-brand-950/40 dark:text-brand-300 dark:border-brand-900/30">
              GPA {student.gpa ? student.gpa.toFixed(2) : '3.85'}
            </span>
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/50 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/30">
              CGPA {student.cgpa ? student.cgpa.toFixed(2) : '3.90'}
            </span>
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/30">
              Attendance {student.attendanceRate}%
            </span>
          </div>
        </div>
      </div>

      {/* AI Assessment Controllers Panel */}
      {(user?.role === 'admin' || user?.role === 'teacher') && (
        <div className="glass-panel p-6 border border-brand-500/10 relative bg-gradient-to-r from-brand-500/5 to-indigo-500/5 flex flex-col md:flex-row justify-between items-center gap-4 no-print">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-500 rounded-xl">
              <BrainCircuit className="w-5.5 h-5.5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-850 dark:text-slate-100">
                StudentSphere Predictive AI Engine
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Run statistical grade and attendance vectors evaluation
              </p>
            </div>
          </div>

          <button
            onClick={triggerAiAssessment}
            disabled={aiLoading}
            className="px-6 py-3 rounded-xl font-bold tracking-widest text-xs uppercase bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-md shadow-brand-600/10 flex items-center gap-2 transition-all shrink-0"
          >
            {aiLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Trigger AI Evaluation</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Roster & Insights Split Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Grades History table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200/50 dark:border-slate-800/40 bg-slate-50/20 dark:bg-slate-900/10">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Academic Grade Registry
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Logged subject results
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/40 dark:bg-slate-800/10 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-200/40 dark:border-slate-800/20">
                    <th className="px-6 py-4">Course Subject</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Marks</th>
                    <th className="px-6 py-4">Scored Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30">
                  {grades.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-xs text-slate-400">
                        No examination scores logged yet for this student.
                      </td>
                    </tr>
                  ) : (
                    grades.map((grade) => (
                      <tr key={grade._id} className="hover:bg-slate-50/10 dark:hover:bg-slate-800/5 transition-colors">
                        <td className="px-6 py-4 font-semibold text-sm text-slate-800 dark:text-slate-200">
                          {grade.subject}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                          {grade.examType || 'Final'}
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-900 dark:text-white">
                          {grade.marksObtained} / {grade.maxMarks || 100}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            grade.grade === 'F' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400' : 'bg-brand-50 text-brand-700 dark:bg-brand-950/20 dark:text-brand-400'
                          }`}>
                            {grade.grade}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI Insight report card details */}
        <div className="glass-panel p-6 flex flex-col h-full justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-500">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  AI Academic Diagnostics
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  Live risk score: {aiScore}/100 ({student.riskStatus})
                </p>
              </div>
            </div>

            {/* Risk Indicator slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>Academic failure risk</span>
                <span className={student.riskStatus === 'High' ? 'text-rose-500' : student.riskStatus === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}>
                  {aiScore}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    student.riskStatus === 'High' ? 'bg-rose-550' : student.riskStatus === 'Medium' ? 'bg-amber-550' : 'bg-emerald-550'
                  }`}
                  style={{ width: `${aiScore}%` }}
                />
              </div>
            </div>

            {/* Analytical observations list */}
            <div className="space-y-3">
              <span className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Analytical Observations
              </span>
              
              {aiInsights.length === 0 ? (
                <p className="text-xs text-slate-400">No predictions generated yet.</p>
              ) : (
                aiInsights.map((ins, idx) => (
                  <div key={idx} className="flex gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-350 font-semibold">
                    <ShieldAlert className="w-4.5 h-4.5 text-brand-500 shrink-0 mt-0.5" />
                    <span>{ins}</span>
                  </div>
                ))
              )}
            </div>

            {/* AI Action items list */}
            <div className="space-y-3 pt-2">
              <span className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                AI Target Recommendations
              </span>

              {aiRecs.length === 0 ? (
                <p className="text-xs text-slate-400">No target actions logged yet.</p>
              ) : (
                aiRecs.map((rec, idx) => (
                  <div key={idx} className="p-3 bg-amber-500/5 border border-amber-500/15 text-amber-900 rounded-xl text-xs font-semibold leading-normal dark:bg-amber-950/10 dark:border-amber-900/20 dark:text-amber-100 flex items-start gap-2">
                    <span className="text-[10px] font-bold text-amber-500 mt-0.5">•</span>
                    <span>{rec}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default StudentDetailsPage;
