import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface DeptGaps {
  [dept: string]: { [skill: string]: number };
}

const getDeptStyle = (dept: string) => {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    Engineering: { bg: 'rgba(59,130,246,0.08)', color: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
    'Data Science': { bg: 'rgba(249,115,22,0.08)', color: '#fb923c', border: 'rgba(249,115,22,0.2)' },
    DevOps: { bg: 'rgba(6,182,212,0.08)', color: '#38bdf8', border: 'rgba(6,182,212,0.2)' },
    Product: { bg: 'rgba(167,139,250,0.08)', color: '#a78bfa', border: 'rgba(167,139,250,0.2)' },
    Marketing: { bg: 'rgba(244,114,182,0.08)', color: '#f472b6', border: 'rgba(244,114,182,0.2)' },
    Sales: { bg: 'rgba(16,185,129,0.08)', color: '#34d399', border: 'rgba(16,185,129,0.2)' },
  };
  return map[dept] || { bg: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', border: 'rgba(255,255,255,0.08)' };
};

const SkillGaps: React.FC = () => {
  const [gaps, setGaps] = useState<DeptGaps>({});
  const [totalGaps, setTotalGaps] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGaps = async () => {
      try {
        const data = await analyticsService.getSkillGaps();
        setGaps(data.department_gaps || {});
        setTotalGaps(data.total_gaps || 0);
      } catch (err) {
        console.error('Failed to fetch skill gaps', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGaps();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-48 gap-4">
        <div className="spinner-gold" />
        <p className="text-slate-500 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Analyzing skill gaps...
        </p>
      </div>
    );
  }

  const depts = Object.keys(gaps);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 animate-fade-in-up">
        <h1 className="text-3xl font-bold section-title" style={{ letterSpacing: '-0.02em' }}>
          Skill Gap Analysis
        </h1>
        <p className="section-subtitle mt-1">
          Skills with proficiency below 3 across departments
        </p>
      </div>

      {totalGaps === 0 ? (
        <div className="card-premium animate-fade-in">
          <div className="empty-state">
            <div
              className="empty-state-icon"
              style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}
            >
              <CheckCircle size={28} />
            </div>
            <p className="font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              No skill gaps detected
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
              All skills are at proficiency level 3 or above.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Alert banner */}
          <div
            className="rounded-xl px-5 py-4 mb-6 flex items-center gap-3 animate-fade-in-up"
            style={{
              animationDelay: '0.05s',
              opacity: 0,
              background: 'rgba(249, 115, 22, 0.08)',
              border: '1px solid rgba(249, 115, 22, 0.2)',
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(249, 115, 22, 0.15)' }}
            >
              <AlertTriangle size={16} style={{ color: '#fb923c' }} />
            </div>
            <span className="text-sm" style={{ color: '#fb923c' }}>
              <span
                className="font-bold"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {totalGaps}
              </span>{' '}
              skill gap{totalGaps !== 1 ? 's' : ''} found across{' '}
              <span className="font-bold">{depts.length}</span>{' '}
              department{depts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Dept gap cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {depts.map((dept, i) => {
              const skillGaps = Object.entries(gaps[dept]);
              const deptStyle = getDeptStyle(dept);
              const maxCount = Math.max(...skillGaps.map(([, c]) => c));
              return (
                <div
                  key={dept}
                  className="card-premium p-5 animate-fade-in-up"
                  style={{ animationDelay: `${0.1 + i * 0.05}s`, opacity: 0 }}
                >
                  {/* Dept header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: deptStyle.color }}
                      />
                      <h2
                        className="font-semibold"
                        style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          color: 'var(--text-primary)',
                          fontSize: '0.95rem',
                        }}
                      >
                        {dept}
                      </h2>
                    </div>
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-lg"
                      style={{
                        background: deptStyle.bg,
                        color: deptStyle.color,
                        border: `1px solid ${deptStyle.border}`,
                        fontFamily: 'Space Grotesk, sans-serif',
                      }}
                    >
                      {skillGaps.length} gap{skillGaps.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Skill gap bars */}
                  <div className="space-y-3">
                    {skillGaps.map(([skill, count]) => (
                      <div key={skill}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="text-sm"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {skill}
                          </span>
                          <span
                            className="text-xs font-semibold"
                            style={{ color: '#fb923c', fontFamily: 'Space Grotesk, sans-serif' }}
                          >
                            {count} below threshold
                          </span>
                        </div>
                        <div className="progress-bar h-1.5">
                          <div
                            style={{
                              height: '100%',
                              width: `${(count / Math.max(maxCount, 1)) * 100}%`,
                              borderRadius: '100px',
                              background: 'linear-gradient(90deg, #f97316, #fb923c)',
                              transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default SkillGaps;
