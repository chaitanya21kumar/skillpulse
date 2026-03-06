import React, { useEffect, useState } from 'react';
import { Users, Target, TrendingUp, Award } from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { analyticsService, DashboardStats, TopPerformer } from '../services/analyticsService';
import StatsCard from './StatsCard';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

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
      } catch (err) {
        setError('Failed to load dashboard data. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-900/40 border border-red-500 rounded-lg p-6 text-red-300">
          {error}
        </div>
      </div>
    );
  }

  const deptData = stats?.department_distribution || [];
  const topCount = Math.floor((stats?.total_employees || 0) * 0.2);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Your workforce at a glance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatsCard
          title="Total Employees"
          value={stats?.total_employees || 0}
          icon={Users}
          color="bg-gradient-to-br from-blue-600 to-blue-700"
        />
        <StatsCard
          title="Active Skills"
          value={stats?.total_skills || 0}
          icon={Target}
          color="bg-gradient-to-br from-purple-600 to-purple-700"
        />
        <StatsCard
          title="Departments"
          value={deptData.length}
          icon={TrendingUp}
          color="bg-gradient-to-br from-emerald-600 to-emerald-700"
        />
        <StatsCard
          title="Top Performers"
          value={topCount}
          icon={Award}
          color="bg-gradient-to-br from-orange-600 to-orange-700"
          subtitle="Top 20% of workforce"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Department Distribution</h2>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={deptData}
                  dataKey="count"
                  nameKey="department"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ department, percent }) =>
                    `${department} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {deptData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400 text-center py-16">No data yet. Import employees to see charts.</p>
          )}
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Employees by Department</h2>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={deptData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="department" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400 text-center py-16">No data yet. Import employees to see charts.</p>
          )}
        </div>
      </div>

      {/* Top Performers */}
      {topPerformers.length > 0 && (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Top Performers</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left pb-3 font-medium">Rank</th>
                  <th className="text-left pb-3 font-medium">Name</th>
                  <th className="text-left pb-3 font-medium">Department</th>
                  <th className="text-left pb-3 font-medium">Avg Proficiency</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.map((p, i) => (
                  <tr key={p.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-3 text-slate-300">#{i + 1}</td>
                    <td className="py-3 text-white font-medium">{p.name}</td>
                    <td className="py-3 text-slate-300">{p.department}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-700 rounded-full h-2 max-w-24">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(p.avg_proficiency / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-blue-400 font-medium">{p.avg_proficiency}/5</span>
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
