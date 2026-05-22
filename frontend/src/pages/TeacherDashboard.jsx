import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Award, ClipboardList, BookOpen, UserPlus, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import StatCard from '../components/StatCard';
import { TableSkeleton } from '../components/SkeletonLoader';

const TeacherDashboard = () => {
  const { apiBase, token } = useAuth();
  const { showNotification } = useNotification();

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  
  // Active selected tools tab: 'attendance' or 'grades'
  const [activeTab, setActiveTab] = useState('attendance');

  // Form states for attendance
  const [attSubject, setAttSubject] = useState('Programming Basics');
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attRecords, setAttRecords] = useState({});

  // Form states for grades logging
  const [gradeStudent, setGradeStudent] = useState('');
  const [gradeSubject, setGradeSubject] = useState('Programming Basics');
  const [gradeMarks, setGradeMarks] = useState('');
  const [gradeMaxMarks, setGradeMaxMarks] = useState(100);
  const [gradeSemester, setGradeSemester] = useState(6);
  const [gradeExamType, setGradeExamType] = useState('Final');
  const [gradeSubmitting, setGradeSubmitting] = useState(false);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const res = await fetch(`${apiBase}/students`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setStudents(data.data);
          
          // Pre-populate attendance states to 'Present' for all students
          const initialAtt = {};
          data.data.forEach(s => {
            initialAtt[s._id] = 'Present';
          });
          setAttRecords(initialAtt);

          if (data.data.length > 0) {
            setGradeStudent(data.data[0]._id);
          }
        }
      } catch (err) {
        console.warn('Backend offline, parsing mock roster.');
        const mockList = [
          { _id: "stu_1", name: "Alexander Wright", rollNumber: "STU-2026-001", department: "Computer Science", semester: 6 },
          { _id: "stu_2", name: "Sophia Martinez", rollNumber: "STU-2026-002", department: "Computer Science", semester: 6 },
          { _id: "stu_3", name: "Marcus Vance", rollNumber: "STU-2026-003", department: "Electrical Engineering", semester: 4 },
          { _id: "stu_4", name: "Emily Jenkins", rollNumber: "STU-2026-004", department: "Mechanical Engineering", semester: 4 }
        ];
        setStudents(mockList);
        const initialAtt = {};
        mockList.forEach(s => {
          initialAtt[s._id] = 'Present';
        });
        setAttRecords(initialAtt);
        setGradeStudent("stu_1");
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [apiBase, token]);

  const handleAttendanceChange = (studentId, status) => {
    setAttRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const submitAttendance = async () => {
    try {
      const recordsList = Object.keys(attRecords).map(sId => ({
        studentId: sId,
        status: attRecords[sId]
      }));

      const res = await fetch(`${apiBase}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          records: recordsList,
          subject: attSubject,
          date: attDate
        })
      });

      const data = await res.json();
      if (data.success) {
        showNotification(`Daily attendance register successfully saved for ${attSubject}!`, 'success');
      } else {
        showNotification(data.message, 'error');
      }
    } catch (err) {
      showNotification('Successfully recorded in client demo sandbox mode!', 'success');
    }
  };

  const submitGrade = async (e) => {
    e.preventDefault();
    if (!gradeStudent || !gradeMarks) {
      showNotification('Please fill in grades details.', 'warning');
      return;
    }

    setGradeSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/grades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: gradeStudent,
          subject: gradeSubject,
          marksObtained: parseFloat(gradeMarks),
          maxMarks: parseFloat(gradeMaxMarks),
          semester: parseInt(gradeSemester, 10),
          examType: gradeExamType
        })
      });

      const data = await res.json();
      if (data.success) {
        showNotification(`Grade logged. Dynamic student GPA updated!`, 'success');
        setGradeMarks('');
      } else {
        showNotification(data.message, 'error');
      }
    } catch (err) {
      showNotification(`Academic grade logged successfully in client sandbox mode!`, 'success');
      setGradeMarks('');
    } finally {
      setGradeSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 p-1">
      
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Faculty Command Center
        </h1>
        <p className="text-slate-400 text-sm mt-1 font-medium">
          Professor Katherine — CS Department. Add grade logs, check attendance registries, and evaluate profiles.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Assigned Classes"
          value="3"
          icon={BookOpen}
          subtitle="Active Academic Courses"
          color="brand"
        />
        <StatCard
          title="Class Average Attendance"
          value="88.5%"
          icon={CheckSquare}
          subtitle="Stable Term average"
          color="emerald"
        />
        <StatCard
          title="Evaluations Completed"
          value="45"
          icon={ClipboardList}
          subtitle="Tests & Final Papers graded"
          color="brand"
        />
        <StatCard
          title="Grading Tasks"
          value="1"
          icon={Award}
          subtitle="Term exams outstanding"
          color="amber"
        />
      </div>

      {/* Interaction Panel */}
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'attendance'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Mark Daily Attendance</span>
          </button>
          
          <button
            onClick={() => setActiveTab('grades')}
            className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'grades'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Log Term Grades</span>
          </button>
        </div>

        {/* Tab 1: Attendance marking grid */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            
            {/* Parameters Selection */}
            <div className="glass-panel p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Class Subject</label>
                <select
                  value={attSubject}
                  onChange={(e) => setAttSubject(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-250 dark:bg-darkbg-800 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option>Programming Basics</option>
                  <option>Mathematics</option>
                  <option>Physics</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Registry Date</label>
                <input
                  type="date"
                  value={attDate}
                  onChange={(e) => setAttDate(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-250 dark:bg-darkbg-800 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={submitAttendance}
                  className="w-full py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md shadow-brand-600/10"
                >
                  <Save className="w-4.5 h-4.5" />
                  <span>Submit Attendance Register</span>
                </button>
              </div>
            </div>

            {/* Students List Roster to toggle statuses */}
            {loading ? (
              <TableSkeleton rows={4} />
            ) : (
              <div className="glass-panel overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/40 dark:bg-slate-800/10 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-200/40 dark:border-slate-800/20">
                      <th className="px-6 py-4">Student Profile</th>
                      <th className="px-6 py-4">Roll Number</th>
                      <th className="px-6 py-4">Branch</th>
                      <th className="px-6 py-4 text-center">Attendance status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30">
                    {students.map((student) => (
                      <tr key={student._id} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/5 transition-colors">
                        <td className="px-6 py-4 font-semibold text-sm text-slate-800 dark:text-slate-200">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-500">
                          {student.rollNumber}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-500">
                          {student.department}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {['Present', 'Absent', 'Late'].map((status) => {
                              const active = attRecords[student._id] === status;
                              let statusColors = 'bg-slate-100 text-slate-650 hover:bg-slate-200 border-slate-200/60 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:border-slate-800/60';
                              
                              if (active && status === 'Present') statusColors = 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/10';
                              if (active && status === 'Absent') statusColors = 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/10';
                              if (active && status === 'Late') statusColors = 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/10';

                              return (
                                <button
                                  key={status}
                                  onClick={() => handleAttendanceChange(student._id, status)}
                                  className={`px-3 py-1.5 border rounded-xl text-xs font-bold transition-all ${statusColors}`}
                                >
                                  {status}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Grades Logging Form */}
        {activeTab === 'grades' && (
          <div className="glass-panel p-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-150 dark:border-slate-850 pb-3">
              <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-500">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-850 dark:text-slate-100">Grade Record Logger</h3>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Insert final exam score and automatically calculate GPA</p>
              </div>
            </div>

            <form onSubmit={submitGrade} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Select Student */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Student</label>
                  <select
                    value={gradeStudent}
                    onChange={(e) => setGradeStudent(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-250 dark:bg-darkbg-800 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    {students.map(s => (
                      <option key={s._id} value={s._id}>{s.name} ({s.rollNumber})</option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Academic Subject</label>
                  <select
                    value={gradeSubject}
                    onChange={(e) => setGradeSubject(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-250 dark:bg-darkbg-800 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option>Programming Basics</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                  </select>
                </div>

                {/* Score */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Marks Scored</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={gradeMarks}
                    onChange={(e) => setGradeMarks(e.target.value)}
                    placeholder="e.g. 85"
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-250 dark:bg-darkbg-800 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                {/* Max Marks */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Max Marks Limit</label>
                  <input
                    type="number"
                    value={gradeMaxMarks}
                    onChange={(e) => setGradeMaxMarks(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-250 dark:bg-darkbg-800 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                {/* Semester */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Term / Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={gradeSemester}
                    onChange={(e) => setGradeSemester(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-250 dark:bg-darkbg-800 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                {/* Exam Category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Exam Category</label>
                  <select
                    value={gradeExamType}
                    onChange={(e) => setGradeExamType(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-250 dark:bg-darkbg-800 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option>Final</option>
                    <option>Midterm</option>
                    <option>Assignment</option>
                    <option>Quiz</option>
                  </select>
                </div>

              </div>

              {/* Submit Trigger */}
              <button
                type="submit"
                disabled={gradeSubmitting}
                className="w-full py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md shadow-brand-600/10 transition-all mt-4"
              >
                <CheckCircle className="w-4.5 h-4.5" />
                <span>{gradeSubmitting ? 'Logging...' : 'Log Grade & Compute GPA'}</span>
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
};

export default TeacherDashboard;
