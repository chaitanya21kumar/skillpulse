import React, { useEffect, useState } from 'react';
import { Users, Target, TrendingUp, Award } from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { analyticsService, DashboardStats, TopPerformer } from '../services/analyticsService';

const CHART_COLORS = ['#fbbf24', '#3b82f6', '#8b5cf6', '#10b981', '#f97316', '#06b6d4', '#ec4899'];

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  subtitle?: string;
  delay?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, iconColor, iconBg, subtitle, delay = '0s' }) => (
  <div
    className="card-premium p-6 accent-line animate-fade-in-up"
    style={{ animationDelay: delay, opacity: 0 }}
  >
    <div className="flex items-start justify-between mb-4">
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {title}
        </p>
        <p
          className="text-4xl font-bold"
          style={{ fontFamily: 'Sora, sans-serif', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: iconBg }}
      >
        <Icon size={20} style={{ color: iconColor }} />
      </div>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-4 py-3 rounded-xl"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        }}
      >
        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {payload[0].value} employees
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, performersData] = await Promise.all([
          analyticsService.getDashboardStats(),
          analyticsService.getTopPerformers(5),
        ]);
        setStats(statsData);
        setTopPerformers(performersData);
      } catch {
        setError('Failed to load dashboard data. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <div className="spinner-gold" />
        <p className="text-slate-500 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div
          className="rounded-xl p-6 text-sm"
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#fca5a5',
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  const deptData = stats?.department_distribution || [];
  const topCount = Math.floor((stats?.total_employees || 0) * 0.2);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold section-title" style={{ letterSpacing: '-0.02em' }}>
          Dashboard
        </h1>
        <p className="section-subtitle mt-1">Your workforce at a glance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Total Employees" value={stats?.total_employees || 0} icon={Users}
          iconColor="#3b82f6" iconBg="rgba(59, 130, 246, 0.12)" delay="0.05s" />
        <StatCard title="Active Skills" value={stats?.total_skills || 0} icon={Target}
          iconColor="#a78bfa" iconBg="rgba(167, 139, 250, 0.12)" delay="0.1s" />
        <StatCard title="Departments" value={deptData.length} icon={TrendingUp}
          iconColor="#10b981" iconBg="rgba(16, 185, 129, 0.12)" delay="0.15s" />
        <StatCard title="Top Performers" value={topCount} icon={Award}
          iconColor="#fbbf24" iconBg="rgba(251, 191, 36, 0.12)"
          subtitle="Top 20% of workforce" delay="0.2s" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card-premium p-6 animate-fade-in-up" style={{ animationDelay: '0.25s', opacity: 0 }}>
          <h2 className="font-semibold mb-5" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            Department Distribution
          </h2>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={deptData} dataKey="count" nameKey="department"
                  cx="50%" cy="50%" outerRadius={90} innerRadius={40} strokeWidth={0}
                  label={({ department, percent }) => `${department} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                >
                  {deptData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><Target size={24} /></div>
              <p className="text-sm text-slate-400">No data yet. Import employees to see charts.</p>
            </div>
          )}
        </div>

        <div className="card-premium p-6 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <h2 className="font-semibold mb-5" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            Employees by Department
          </h2>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={deptData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="department"
                  tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'Space Grotesk, sans-serif' }}
                  axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(251, 191, 36, 0.04)' }} />
                <Bar dataKey="count" fill="#fbbf24" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><TrendingUp size={24} /></div>
              <p className="text-sm text-slate-400">No data yet. Import employees to see charts.</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Performers */}
      {topPerformers.length > 0 && (
        <div className="card-premium animate-fade-in-up" style={{ animationDelay: '0.35s', opacity: 0 }}>
          <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(251, 191, 36, 0.12)' }}>
                <Award size={16} className="text-yellow-400" />
              </div>
              <h2 className="font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem' }}>
                Top Performers
              </h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table-premium">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Avg Proficiency</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.map((p, i) => (
                  <tr key={p.id}>
                    <td>
                      <span className="text-xs font-bold px-2 py-1 rounded-lg"
                        style={{
                          background: i === 0 ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.04)',
                          color: i === 0 ? '#fbbf24' : 'var(--text-muted)',
                          fontFamily: 'Space Grotesk, sans-serif',
                        }}
                      >
                        #{i + 1}
                      </span>
                    </td>
                    <td className="font-medium" style={{ color: 'var(--text-primary)' }}>{p.name}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{p.department}</td>
                    <td>
                      <div className="flex items-center gap-3 min-w-32">
                        <div className="flex-1 progress-bar h-1.5">
                          <div className="progress-fill h-full" style={{ width: `${(p.avg_proficiency / 5) * 100}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-yellow-400 min-w-8 text-right"
                          style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {p.avg_proficiency}/5
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
