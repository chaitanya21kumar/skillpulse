import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  BarChart3,
  Users,
  Grid,
  AlertTriangle,
  Upload,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Real-time insights into workforce skills, department distribution, and performance metrics at a glance.',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.1)',
  },
  {
    icon: Users,
    title: 'Employee Profiles',
    description: 'Manage complete employee records with skill inventories, proficiency tracking, and department assignments.',
    color: '#a78bfa',
    bg: 'rgba(167, 139, 250, 0.1)',
  },
  {
    icon: Grid,
    title: 'Skill Matrix',
    description: 'Visual heatmap of team competencies. Instantly see who knows what across your entire organization.',
    color: '#fbbf24',
    bg: 'rgba(251, 191, 36, 0.1)',
  },
  {
    icon: AlertTriangle,
    title: 'Gap Analysis',
    description: 'Identify critical skill gaps by department. Prioritize training and hiring based on actual data.',
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.1)',
  },
  {
    icon: Upload,
    title: 'Bulk Import',
    description: 'Import employees and skills from CSV or Excel in seconds. Seamless data migration with smart upsert.',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
  },
  {
    icon: TrendingUp,
    title: 'Top Performers',
    description: 'Recognize and track your highest-performing talent with proficiency rankings and trend analysis.',
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.1)',
  },
];

const stats = [
  { value: '360°', label: 'Skill Visibility' },
  { value: '5×', label: 'Faster Decisions' },
  { value: '100%', label: 'Data Accuracy' },
];

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero */}
      <section className="relative pt-20 pb-32 px-4">
        {/* Background orbs */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute top-20 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fade-in"
            style={{
              background: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.25)',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span
              className="text-yellow-400 text-xs font-semibold tracking-widest uppercase"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Workforce Intelligence Platform
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 animate-fade-in-up"
            style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.03em', lineHeight: 1.1 }}
          >
            Know Every Skill
            <br />
            <span className="text-gradient-gold">in Your Team</span>
          </h1>

          <p
            className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200"
            style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
          >
            SkillPulse gives you a real-time map of your workforce capabilities.
            Identify gaps, recognize talent, and build exceptional teams — all in one place.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Link to="/dashboard">
              <button className="btn-gold flex items-center gap-2 px-8 py-4 text-base">
                Get Started
                <ArrowRight size={18} />
              </button>
            </Link>
            <Link to="/import">
              <button className="btn-outline flex items-center gap-2 px-8 py-4 text-base">
                Import Data
                <Upload size={16} />
              </button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-12 mt-16 animate-fade-in-up delay-400">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div
                  className="text-3xl font-bold text-gradient-gold"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {value}
                </div>
                <div className="text-xs text-slate-500 mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Section label */}
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <Layers size={12} className="text-slate-400" />
              <span
                className="text-slate-400 text-xs font-medium uppercase tracking-widest"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Everything You Need
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}
            >
              Powerful Features,
              <span className="text-gradient-gold"> Simple interface</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="card-premium p-6 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: feature.bg }}
                  >
                    <Icon size={22} style={{ color: feature.color }} />
                  </div>
                  <h3
                    className="font-semibold text-white mb-2"
                    style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem' }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl p-10 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(59,130,246,0.08) 100%)',
              border: '1px solid rgba(251, 191, 36, 0.2)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 0%, rgba(251,191,36,0.08) 0%, transparent 60%)',
              }}
            />
            <Shield size={36} className="text-yellow-400 mx-auto mb-4 relative z-10" />
            <h2
              className="text-3xl font-bold mb-3 relative z-10"
              style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}
            >
              Ready to map your workforce?
            </h2>
            <p className="mb-6 relative z-10" style={{ color: 'var(--text-secondary)' }}>
              Start with a CSV import and have your full skill map running in minutes.
            </p>
            <Link to="/dashboard" className="relative z-10 inline-block">
              <button className="btn-gold flex items-center gap-2 px-8 py-4 text-base mx-auto">
                Launch Dashboard
                <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t px-4 py-8"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
              <Zap size={12} className="text-slate-900" fill="currentColor" />
            </div>
            <span
              className="text-sm font-semibold"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              <span className="text-gradient-gold">Skill</span>
              <span className="text-white">Pulse</span>
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Workforce intelligence for modern teams
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
