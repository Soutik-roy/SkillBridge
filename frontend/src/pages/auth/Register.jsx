import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, ArrowRight, Loader2, Users, Briefcase } from 'lucide-react';

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

const ROLES = [
  { value: 'STUDENT', label: 'Student', icon: GraduationCap, description: 'Learn, get assessed, build your career' },
  { value: 'TEACHER', label: 'Teacher', icon: Users, description: 'Manage students, post courses & assignments' },
  { value: 'RECRUITER', label: 'Recruiter', icon: Briefcase, description: 'Post jobs, find top AI-matched candidates' },
];

export default function Register() {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'STUDENT' });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await register(formData);
    setIsLoading(false);
    if (success) navigate('/login');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden relative"
      style={{ background: '#07070f' }}
    >
      {/* Background orbs */}
      <Orb className="w-[500px] h-[500px] -top-40 -right-32" color="radial-gradient(circle, #8b5cf6, #6d28d9)" />
      <Orb className="w-[400px] h-[400px] -bottom-32 -left-24" color="radial-gradient(circle, #6366f1, #4338ca)" />
      <Orb className="w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="radial-gradient(circle, #0ea5e9, #0284c7)" />

      {/* Grid texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 z-10"
      >
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">SkillBridge</span>
        </Link>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-10 w-full max-w-md rounded-2xl p-px"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.1), rgba(255,255,255,0.05))' }}
      >
        <div className="rounded-2xl p-8" style={{ background: 'rgba(15,15,26,0.95)', backdropFilter: 'blur(20px)' }}>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 items-center justify-center rounded-2xl mb-4"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white mb-1">Create an account</h1>
            <p className="text-gray-400 text-sm">Join SkillBridge to bridge the industry gap</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                />
              </div>
            </div>

            {/* Role selector — custom card pills */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(({ value, label, icon: Icon }) => {
                  const selected = formData.role === value;
                  return (
                    <motion.button
                      key={value}
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, role: value })}
                      className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl border text-xs font-semibold transition-all"
                      style={{
                        background: selected ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
                        borderColor: selected ? '#6366f1' : 'rgba(255,255,255,0.08)',
                        color: selected ? '#a5b4fc' : '#6b7280',
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </motion.button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {ROLES.find(r => r.value === formData.role)?.description}
              </p>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(99,102,241,0.5)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              {isLoading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Back to home */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 z-10"
      >
        <Link to="/" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">
          ← Back to home
        </Link>
      </motion.div>
    </div>
  );
}
