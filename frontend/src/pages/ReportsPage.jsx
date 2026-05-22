import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, FileSpreadsheet, Printer, Search, GraduationCap, X, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { TableSkeleton } from '../components/SkeletonLoader';

const ReportsPage = () => {
  const { apiBase, token, user } = useAuth();
  const { showNotification } = useNotification();

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');

  // Selected student for active printable report
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        const res = await fetch(`${apiBase}/students?search=${search}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setStudents(data.data);
        }
      } catch (err) {
        console.warn('Backend connection offline, using mock roster.');
        setStudents([
          { _id: "stu_1", name: "Alexander Wright", rollNumber: "STU-2026-001", department: "Computer Science", semester: 6, cgpa: 3.90, attendanceRate: 94.2 },
          { _id: "stu_2", name: "Sophia Martinez", rollNumber: "STU-2026-002", department: "Computer Science", semester: 6, cgpa: 3.42, attendanceRate: 88.5 },
          { _id: "stu_3", name: "Marcus Vance", rollNumber: "STU-2026-003", department: "Electrical Engineering", semester: 4, cgpa: 2.30, attendanceRate: 64.0 },
          { _id: "stu_4", name: "Emily Jenkins", rollNumber: "STU-2026-004", department: "Mechanical Engineering", semester: 4, cgpa: 3.05, attendanceRate: 72.8 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsData();
  }, [search, apiBase, token]);

  const handleExportCSV = () => {
    window.open(`${apiBase}/reports/csv?Authorization=Bearer ${token}`, '_blank');
    showNotification('Roster exported successfully!', 'success');
  };

  const handleLoadReportCard = async (student) => {
    setSelectedStudent(student);
    setReportLoading(true);
    try {
      const res = await fetch(`${apiBase}/reports/print/${student._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setReportData(data.data);
      }
    } catch (err) {
      // Fallback local transcript details
      setReportData({
        schoolName: "StudentSphere Institute of Technology",
        term: "Academic Year 2026 - Fall Term",
        student,
        issuedAt: new Date().toLocaleDateString(),
        signatureApproval: "Office of the Academic Registrar",
        mockCourses: [
          { subject: "Programming Basics", marks: 94, grade: "A+", points: 4.0 },
          { subject: "Mathematics", marks: 88, grade: "A", points: 3.7 },
          { subject: "Physics", marks: student.attendanceRate < 75 ? 45 : 76, grade: student.attendanceRate < 75 ? "F" : "B", points: student.attendanceRate < 75 ? 0.0 : 3.0 },
        ]
      });
    } finally {
      setReportLoading(false);
    }
  };

  const triggerBrowserPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 p-1">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Campus Reports Center
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            Download standard spreadsheet files or build highly styled printable transcripts.
          </p>
        </div>
      </div>

      {/* Primary bulk triggers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
        
        {/* Box 1: CSV Export */}
        <div className="glass-panel p-6 flex items-start gap-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="font-extrabold text-slate-850 dark:text-slate-150">Bulk Database CSV Export</h3>
            <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed">
              Export all registered student directories, branch tracks, GPA scores, and attendance rate metrics.
            </p>
            <button
              onClick={handleExportCSV}
              className="mt-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>Download Spreadsheets</span>
            </button>
          </div>
        </div>

        {/* Box 2: Info Card */}
        <div className="glass-panel p-6 flex items-start gap-4 bg-gradient-to-tr from-brand-500/5 to-indigo-500/5">
          <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-500 rounded-2xl">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="font-extrabold text-slate-850 dark:text-slate-150">Official Transcript Generator</h3>
            <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed">
              Select any student inside directory list below to compile a formatted print report card.
            </p>
            <span className="block text-[10px] text-brand-500 font-bold uppercase tracking-widest leading-none mt-1">
              Fully customized CSS for print layouts
            </span>
          </div>
        </div>

      </div>

      {/* Directory listing to choose student */}
      <div className="space-y-6 no-print">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
          Campus Directory
        </h3>

        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search student directories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-250 bg-slate-50 dark:bg-darkbg-800 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {loading ? (
          <TableSkeleton rows={4} />
        ) : (
          <div className="glass-panel overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/40 dark:bg-slate-800/10 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-200/40 dark:border-slate-800/20">
                  <th className="px-6 py-4">Student Profile</th>
                  <th className="px-6 py-4">Roll Number</th>
                  <th className="px-6 py-4 text-center">CGPA</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/5 transition-colors">
                    <td className="px-6 py-4 font-semibold text-sm text-slate-800 dark:text-slate-250">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-550">
                      {student.rollNumber}
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-extrabold text-slate-900 dark:text-white">
                      {student.cgpa ? student.cgpa.toFixed(2) : '3.90'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleLoadReportCard(student)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-550 hover:text-white dark:bg-darkbg-800 dark:hover:bg-slate-700/50 text-[10px] font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Build Report</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Printable Report Modal card */}
      <AnimatePresence>
        {selectedStudent && reportData && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xs">
            <div
              onClick={() => setSelectedStudent(null)}
              className="fixed inset-0 z-10"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-20 w-full max-w-3xl bg-white text-slate-800 rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12 print-area"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute right-6 top-6 p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 no-print transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Printable Area styling */}
              <div className="space-y-8">
                
                {/* Header Banner */}
                <div className="flex items-start justify-between border-b border-slate-200 pb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-650 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-sm">
                      🎓
                    </div>
                    <div>
                      <h2 className="text-xl font-black tracking-tight text-slate-900 leading-none">
                        StudentSphere AI Platform
                      </h2>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mt-1">
                        Academic Transcript Service
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-xs font-semibold text-slate-400">
                    <p>{reportData.term}</p>
                    <p className="mt-0.5">Date Compiled: {reportData.issuedAt}</p>
                  </div>
                </div>

                {/* Profile demographics grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student Name</span>
                    <span className="block font-bold text-slate-900 mt-0.5">{reportData.student.name}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Roll ID Number</span>
                    <span className="block font-bold text-slate-900 mt-0.5">{reportData.student.rollNumber}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</span>
                    <span className="block font-bold text-slate-900 mt-0.5">{reportData.student.department}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Term</span>
                    <span className="block font-bold text-slate-900 mt-0.5">Semester {reportData.student.semester}</span>
                  </div>
                </div>

                {/* Subject marks listing */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Course Grades</h4>
                  <div className="border border-slate-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-widest text-slate-450 border-b border-slate-150">
                          <th className="px-6 py-3">Subject</th>
                          <th className="px-6 py-3 text-center">Marks Scored</th>
                          <th className="px-6 py-3 text-center">Grade Letter</th>
                          <th className="px-6 py-3 text-center">GPA points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(reportData.mockCourses || [
                          { subject: "Programming Basics", marks: 94, grade: "A+", points: 4.0 },
                          { subject: "Mathematics", marks: 88, grade: "A", points: 3.7 },
                          { subject: "Physics", marks: 76, grade: "B", points: 3.0 }
                        ]).map((c, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-3 font-bold text-slate-900">{c.subject}</td>
                            <td className="px-6 py-3 text-center font-semibold">{c.marks} / 100</td>
                            <td className="px-6 py-3 text-center font-bold text-brand-650">{c.grade}</td>
                            <td className="px-6 py-3 text-center font-bold">{c.points.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cumulative blocks summary */}
                <div className="flex justify-between items-center p-5 border border-brand-500/10 bg-brand-500/5 rounded-2xl">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance Presence</span>
                    <span className="block text-lg font-black text-slate-900 mt-0.5">{reportData.student.attendanceRate}%</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Semester CGPA</span>
                    <span className="block text-lg font-black text-brand-600 mt-0.5">{reportData.student.cgpa ? reportData.student.cgpa.toFixed(2) : '3.90'}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Standing</span>
                    <span className="block text-lg font-black text-emerald-600 mt-0.5">Satisfactory</span>
                  </div>
                </div>

                {/* Signature slot */}
                <div className="flex justify-between items-end pt-12 text-center text-xs font-semibold text-slate-400">
                  <div className="w-48 border-t border-slate-200 pt-2 leading-none">
                    <p className="text-slate-900 font-bold">{reportData.signatureApproval}</p>
                    <span className="text-[10px] text-slate-450 mt-1 block">Seal of Authority</span>
                  </div>
                  
                  <button
                    onClick={triggerBrowserPrint}
                    className="px-6 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-md shadow-brand-600/15 no-print"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Transcript</span>
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ReportsPage;
