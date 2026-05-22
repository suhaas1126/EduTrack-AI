import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, BrainCircuit, BarChart3, Database, Award } from 'lucide-react';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 overflow-hidden flex flex-col justify-between">
      {/* Decorative gradient blur background nodes */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-400 to-indigo-300 bg-clip-text text-transparent">
            StudentSphere AI
          </span>
        </div>

        <Link
          to="/login"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md transition-all flex items-center gap-2"
        >
          <span>Launch Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-6 py-16 flex-1 flex flex-col justify-center items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Tagline Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 border border-brand-500/25 text-brand-400 uppercase tracking-widest"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Next-Gen Academic Engine</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-3xl mx-auto"
          >
            Empower Campus Records with{' '}
            <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-brand-500 bg-clip-text text-transparent">
              Predictive AI Insights
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            A high-fidelity SaaS dashboard built to manage student registration directories, log subject attendance grades, and dynamically predict academic failures before they manifest.
          </motion.p>

          {/* CTA Action Bar */}
          <motion.div variants={itemVariants} className="pt-6 flex flex-wrap gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-4 rounded-xl text-sm font-semibold tracking-wide bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-600/20 hover:shadow-brand-500/30 transition-all flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#features"
              className="px-8 py-4 rounded-xl text-sm font-semibold tracking-wide bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all"
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <section id="features" className="pt-24 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            
            {/* Box 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/40 backdrop-blur-md"
            >
              <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 w-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base mt-4 text-slate-100">Role-Based Gatekeeper</h4>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Integrated JWT authentication protecting Admin controls, Teacher logs, and Student checklists independently.
              </p>
            </motion.div>

            {/* Box 2 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/40 backdrop-blur-md"
            >
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base mt-4 text-slate-100">Live Campus Analytics</h4>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Vibrant dynamic graphs rendering attendance trends, class GPA ratios, and pass/fail distributions.
              </p>
            </motion.div>

            {/* Box 3 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/40 backdrop-blur-md"
            >
              <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 w-fit">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base mt-4 text-slate-100">AI Risk Classifications</h4>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Calculates risk vectors using statistics to generate study actions and alert low attendance indices.
              </p>
            </motion.div>

          </div>
        </section>
      </main>

      {/* Footer Details */}
      <footer className="relative z-10 border-t border-slate-800/60 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} StudentSphere AI. Designed for modern campus intelligence.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-355 transition-colors cursor-pointer">Security Protocol</span>
            <span className="hover:text-slate-355 transition-colors cursor-pointer">System Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
