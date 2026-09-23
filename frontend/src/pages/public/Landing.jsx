import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  GraduationCap, Briefcase, TrendingUp, Cpu, ArrowRight,
  Users, BookOpen, Target, Zap, Building2, Award, BarChart3,
  CheckCircle2, ChevronRight, Sparkles, Brain, Rocket, Globe,
  Shield, Code2, Layers, Star
} from 'lucide-react';

// ── Fade-in on scroll ─────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, direction = 'up', className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: direction === 'up' ? 40 : 0, x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0 }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Glowing Orb ───────────────────────────────────────────────────────────────
function Orb({ className, color }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
      style={{ background: color }}
      animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

// ── Feature Card ──────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description, gradient, delay }) {
  return (
    <FadeIn delay={delay}>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        className="group relative rounded-2xl p-px overflow-hidden cursor-default"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))' }}
      >
        {/* Border gradient */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(135deg, ${gradient})`, padding: '1px' }}
        />
        <div className="relative rounded-2xl bg-[#0f0f1a] p-7 h-full border border-white/5 group-hover:border-transparent transition-colors">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
            style={{ background: `linear-gradient(135deg, ${gradient})` }}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
      </motion.div>
    </FadeIn>
  );
}

// ── Role Card ─────────────────────────────────────────────────────────────────
function RoleCard({ icon: Icon, role, description, gradient, badge, to, delay }) {
  return (
    <FadeIn delay={delay}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        className="relative rounded-3xl overflow-hidden p-8 cursor-pointer"
        style={{ background: `linear-gradient(145deg, ${gradient})` }}
      >
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)' }} />
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-12 translate-x-12 bg-white/10 blur-xl" />
        <div className="relative">
          <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-white/15 text-white/80 border border-white/20">{badge}</span>
          <div className="mt-6 mb-3 w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-white text-2xl font-bold mb-2">{role}</h3>
          <p className="text-white/70 text-sm leading-relaxed mb-6">{description}</p>
          <Link to={to}>
            <motion.div
              whileHover={{ x: 4 }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 px-4 py-2 rounded-xl transition-all"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </FadeIn>
  );
}

// ── Step Card ─────────────────────────────────────────────────────────────────
function StepCard({ number, title, description, color, delay }) {
  return (
    <FadeIn delay={delay}>
      <div className="flex gap-5">
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2"
          style={{ borderColor: color, color }}>
          {number}
        </div>
        <div>
          <h4 className="text-white font-bold mb-1">{title}</h4>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </FadeIn>
  );
}

export default function Landing() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const features = [
    { icon: Brain, title: 'AI Skill Assessment', description: 'Dynamic AI-generated quizzes that adapt to your level and give precise, industry-calibrated skill scores.', gradient: '#6366f1, #8b5cf6', delay: 0 },
    { icon: TrendingUp, title: 'Career Roadmaps', description: 'Phase-by-phase learning plans built by AI, personalised around your skill gaps and target career goal.', gradient: '#0ea5e9, #6366f1', delay: 0.08 },
    { icon: Target, title: 'Smart Job Matching', description: 'Every job ranked by how well your verified skills align — no more applying blind.', gradient: '#10b981, #0ea5e9', delay: 0.16 },
    { icon: BookOpen, title: 'Learning Hub', description: 'Courses built by your teachers, mapped directly to the skills recruiters are searching for.', gradient: '#f59e0b, #ef4444', delay: 0.24 },
    { icon: Building2, title: 'Industry Programs', description: 'Exclusive training programs from top tech companies for both students and faculty.', gradient: '#ec4899, #8b5cf6', delay: 0.32 },
    { icon: BarChart3, title: 'Live Analytics', description: 'Real-time dashboards for students, teachers and recruiters — all driven by actual activity data.', gradient: '#14b8a6, #6366f1', delay: 0.40 },
  ];

  const roles = [
    {
      icon: GraduationCap, role: 'For Students', badge: 'Learn & Grow',
      description: 'Get AI-assessed, map your gaps, follow a personalised roadmap, and land jobs where your skills are a direct match.',
      gradient: '#4f46e5, #7c3aed', to: '/register', delay: 0,
    },
    {
      icon: Users, role: 'For Teachers', badge: 'Teach & Impact',
      description: 'Manage students, publish courses, post assignments, and connect with industry programs and FDP opportunities.',
      gradient: '#0284c7, #4f46e5', to: '/register', delay: 0.1,
    },
    {
      icon: Briefcase, role: 'For Recruiters', badge: 'Hire Smarter',
      description: 'Post jobs, get AI-ranked applicants whose skill scores match your exact needs, and run industry learning programs.',
      gradient: '#059669, #0284c7', to: '/register', delay: 0.2,
    },
  ];

  const steps = [
    { number: '01', title: 'Create your profile', description: 'Sign up as a student, teacher, or recruiter in under 60 seconds.', color: '#6366f1', delay: 0 },
    { number: '02', title: 'Take the AI assessment', description: 'Answer dynamically generated questions. Get precise skill scores.', color: '#8b5cf6', delay: 0.1 },
    { number: '03', title: 'Get your roadmap', description: 'AI generates a step-by-step path from where you are to where you want to be.', color: '#0ea5e9', delay: 0.2 },
    { number: '04', title: 'Apply & get hired', description: 'Match with jobs where your verified skills are a real fit — not just a keyword match.', color: '#10b981', delay: 0.3 },
  ];

  const highlights = [
    'AI-generated quizzes — never the same twice',
    'Zero fake or placeholder data',
    'Real-time dashboards for every role',
    'Direct academia-to-industry bridge',
    'Industry programs from top companies',
    'Built for Smart India Hackathon',
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ background: '#07070f', color: 'white' }}>

      {/* ── Navbar ── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 px-6 lg:px-16 h-16 flex items-center border-b border-white/5"
        style={{ background: 'rgba(7,7,15,0.85)', backdropFilter: 'blur(20px)' }}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">SkillBridge</span>
        </Link>

        <nav className="ml-auto flex items-center gap-2">
          <Link to="/login">
            <motion.button
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Log in
            </motion.button>
          </Link>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(99,102,241,0.5)' }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2 rounded-xl text-sm font-bold text-white flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </nav>
      </motion.header>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section ref={heroRef} className="relative w-full min-h-[90vh] flex items-center justify-center px-4 py-24 overflow-hidden">
          {/* Background orbs */}
          <Orb className="w-[600px] h-[600px] -top-32 -left-32" color="radial-gradient(circle, #6366f1, #4338ca)" />
          <Orb className="w-[500px] h-[500px] -bottom-48 -right-24" color="radial-gradient(circle, #8b5cf6, #6d28d9)" />
          <Orb className="w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="radial-gradient(circle, #0ea5e9, #0284c7)" />

          {/* Grid texture */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative max-w-5xl mx-auto text-center z-10">
            {/* Tag line */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/10 text-sm font-medium text-purple-300"
              style={{ background: 'rgba(99,102,241,0.1)' }}
            >
              <Zap className="w-3.5 h-3.5" /> AI-Powered Career Intelligence Platform
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6"
            >
              Bridge the Gap Between{' '}
              <br />
              <span className="relative inline-block">
                <span style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Academia & Industry
                </span>
                {/* Underline glow */}
                <span className="absolute bottom-0 left-0 right-0 h-px opacity-50"
                  style={{ background: 'linear-gradient(90deg, transparent, #818cf8, #c084fc, transparent)' }} />
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="text-gray-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
            >
              SkillBridge uses advanced AI to assess your skills, find the real gaps, and give you a personalised roadmap — so you stop guessing and start getting hired.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12"
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(99,102,241,0.6)' }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  Start Your Journey <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.05)' }}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-medium text-gray-300 border border-white/10 transition-all"
                >
                  I'm a Recruiter <ChevronRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-x-6 gap-y-2"
            >
              {highlights.map((h, i) => (
                <span key={i} className="flex items-center gap-1.5 text-sm text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />{h}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ── Features ── */}
        <section className="w-full py-24 px-4" style={{ background: 'linear-gradient(180deg, #07070f 0%, #0c0c1d 100%)' }}>
          <div className="max-w-6xl mx-auto">
            <FadeIn className="text-center mb-16">
              <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">Platform Features</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Everything in one place
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">A complete ecosystem for students, teachers and recruiters — all powered by real data and AI.</p>
            </FadeIn>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(f => <FeatureCard key={f.title} {...f} />)}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="w-full py-24 px-4" style={{ background: '#0c0c1d' }}>
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-4">How It Works</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                From zero to{' '}
                <span style={{ background: 'linear-gradient(135deg, #818cf8, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  job-ready
                </span>
              </h2>
              <p className="text-gray-400 mb-10 leading-relaxed">Four clear steps. No guessing. No fluff. Just a structured path powered by AI and real industry data.</p>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}
                  className="flex items-center gap-2 px-7 py-3 rounded-2xl text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  Create Free Account <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </FadeIn>

            <div className="space-y-8 relative">
              {/* Connecting line */}
              <div className="absolute left-5 top-10 bottom-10 w-px"
                style={{ background: 'linear-gradient(180deg, #6366f1, #8b5cf6, #0ea5e9, #10b981)' }} />
              {steps.map(s => <StepCard key={s.number} {...s} />)}
            </div>
          </div>
        </section>

        {/* ── Who It's For ── */}
        <section className="w-full py-24 px-4" style={{ background: 'linear-gradient(180deg, #0c0c1d 0%, #07070f 100%)' }}>
          <div className="max-w-6xl mx-auto">
            <FadeIn className="text-center mb-16">
              <p className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-3">Built For Everyone</p>
              <h2 className="text-4xl md:text-5xl font-black text-white">
                One platform.{' '}
                <span style={{ background: 'linear-gradient(135deg, #c084fc, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Three roles.
                </span>
              </h2>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-3">
              {roles.map(r => <RoleCard key={r.role} {...r} />)}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="w-full py-24 px-4" style={{ background: '#07070f' }}>
          <FadeIn>
            <div className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden p-14 text-center"
              style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #2d1b69 50%, #1e3a5f 100%)' }}>
              {/* Inner glow */}
              <div className="absolute inset-0 opacity-40"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.4), transparent 70%)' }} />
              {/* Grid */}
              <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-flex mb-6"
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  Ready to bridge the gap?
                </h2>
                <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                  Join SkillBridge today. Get assessed, get your roadmap, and connect with opportunities that actually match your skills.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,255,255,0.2)' }}
                      whileTap={{ scale: 0.97 }}
                      className="px-10 py-3.5 rounded-2xl text-base font-bold text-gray-900 bg-white flex items-center gap-2"
                    >
                      Create Free Account <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </Link>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                      className="px-10 py-3.5 rounded-2xl text-base font-medium text-white border border-white/20 transition-colors"
                    >
                      Already have an account
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-10 px-6" style={{ background: '#07070f' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">SkillBridge</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="/register" className="hover:text-gray-300 transition-colors">Students</Link>
            <Link to="/register" className="hover:text-gray-300 transition-colors">Teachers</Link>
            <Link to="/register" className="hover:text-gray-300 transition-colors">Recruiters</Link>
          </div>

          <p className="text-sm text-gray-600">© 2026 SkillBridge · Smart India Hackathon</p>
        </div>
      </footer>
    </div>
  );
}
