import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Database,
  GraduationCap,
  ShieldCheck,
  Users,
} from 'lucide-react';

const metrics = [
  { label: 'Role-based portals', value: '3' },
  { label: 'Core modules', value: '6+' },
  { label: 'API-backed workflows', value: 'REST' },
];

const features = [
  {
    title: 'Student Records',
    description: 'Create, update, search, and review student profiles with academic and attendance metadata.',
    icon: Users,
  },
  {
    title: 'Attendance & Grades',
    description: 'Track attendance, marks, GPA signals, and academic risk status through protected workflows.',
    icon: GraduationCap,
  },
  {
    title: 'Analytics Dashboard',
    description: 'Visualize attendance trends, class performance, pass ratios, and risk distribution using charts.',
    icon: BarChart3,
  },
  {
    title: 'AI Risk Insights',
    description: 'Generate risk summaries and recommendations from student performance and attendance patterns.',
    icon: BrainCircuit,
  },
  {
    title: 'Secure Backend',
    description: 'JWT authentication, role authorization, MongoDB Atlas persistence, and production health checks.',
    icon: ShieldCheck,
  },
  {
    title: 'Deployment Ready',
    description: 'Express serves the React build, API routes, health checks, and static assets from one Render service.',
    icon: Database,
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black tracking-wide">EduTrack AI</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Student intelligence platform</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white sm:block"
          >
            Sign in
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-100"
          >
            Open dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-96px)] w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-12 pt-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Full-stack MERN project
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
              Academic operations, analytics, and AI insights in one production-ready dashboard.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              EduTrack AI is a MERN student management platform with role-based access, MongoDB-backed records,
              attendance and grade workflows, analytics dashboards, report tools, and AI-style risk recommendations.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-6 py-3 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
              >
                Try demo dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-6 py-3 text-sm font-bold text-slate-200 transition hover:border-slate-500 hover:bg-white/5"
              >
                View capabilities
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-2xl font-black text-white">{metric.value}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{metric.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/30">
              <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-semibold text-slate-500">/admin-dashboard</span>
              </div>
              <div className="p-5">
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Live overview</p>
                    <h2 className="mt-1 text-xl font-black">Campus Administration Hub</h2>
                  </div>
                  <div className="rounded-lg bg-emerald-400/10 p-2 text-emerald-300">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Enrollment', '248', 'Registered students'],
                    ['Attendance', '87%', 'Weekly average'],
                    ['Risk Flags', '14', 'Need intervention'],
                    ['Reports', '32', 'Generated this month'],
                  ].map(([label, value, detail]) => (
                    <div key={label} className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p>
                      <p className="mt-2 text-2xl font-black">{value}</p>
                      <p className="mt-1 text-xs text-slate-400">{detail}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950/70 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-bold">Risk intelligence</p>
                    <span className="rounded-full bg-amber-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300">AI summary</span>
                  </div>
                  <div className="space-y-3">
                    {['Attendance below threshold', 'Grade decline detected', 'Tutoring recommended'].map((item, index) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-black text-emerald-300">
                          {index + 1}
                        </div>
                        <div className="h-2 flex-1 rounded-full bg-slate-800">
                          <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${78 - index * 17}%` }} />
                        </div>
                        <span className="w-32 text-right text-xs font-semibold text-slate-400">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="border-t border-slate-900 bg-slate-950 px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-300">Built for internship demos</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">What recruiters can evaluate quickly</h2>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-black text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
