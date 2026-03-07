import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { Grid } from 'lucide-react';

interface SkillMatrixEntry {
  employee_id: number;
  name: string;
  department: string;
  skills: { skill_name: string; level: number }[];
}

const PROFICIENCY_STYLE: Record<number, { bg: string; color: string; label: string }> = {
  1: { bg: 'rgba(239,68,68,0.15)', color: '#f87171', label: 'Beginner' },
  2: { bg: 'rgba(249,115,22,0.15)', color: '#fb923c', label: 'Elementary' },
  3: { bg: 'rgba(16,185,129,0.15)', color: '#34d399', label: 'Intermediate' },
  4: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', label: 'Advanced' },
  5: { bg: 'rgba(251,191,36,0.2)', color: '#fbbf24', label: 'Expert' },
};

const SkillMatrix: React.FC = () => {
  const [matrix, setMatrix] = useState<SkillMatrixEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [allSkills, setAllSkills] = useState<string[]>([]);

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const data = await analyticsService.getSkillMatrix();
        setMatrix(data);
        const skills = new Set<string>();
        data.forEach((emp: SkillMatrixEntry) =>
          emp.skills.forEach((s) => skills.add(s.skill_name))
        );
        setAllSkills(Array.from(skills).sort());
      } catch (err) {
        console.error('Failed to load skill matrix', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatrix();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-48 gap-4">
        <div className="spinner-gold" />
        <p className="text-slate-500 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Loading skill matrix...
        </p>
      </div>
    );
  }

  if (matrix.length === 0) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold section-title" style={{ letterSpacing: '-0.02em' }}>Skill Matrix</h1>
        </div>
        <div className="card-premium animate-fade-in">
          <div className="empty-state">
            <div className="empty-state-icon"><Grid size={28} /></div>
            <p className="font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>No skill data yet</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
              Import employees and skills to see the matrix.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 animate-fade-in-up">
        <h1 className="text-3xl font-bold section-title" style={{ letterSpacing: '-0.02em' }}>
          Skill Matrix
        </h1>
        <p className="section-subtitle mt-1">
          {matrix.length} employees · {allSkills.length} skills tracked
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-5 animate-fade-in-up" style={{ animationDelay: '0.05s', opacity: 0 }}>
        {Object.entries(PROFICIENCY_STYLE).map(([level, style]) => (
          <span
            key={level}
            className="text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{
              background: style.bg,
              color: style.color,
              border: `1px solid ${style.color}33`,
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            {level} — {style.label}
          </span>
        ))}
        <span
          className="text-xs px-3 py-1.5 rounded-lg font-medium"
          style={{
            background: 'rgba(255,255,255,0.03)',
            color: 'var(--text-muted)',
            border: '1px solid rgba(255,255,255,0.06)',
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          — No skill
        </span>
      </div>

      {/* Matrix table */}
      <div
        className="card-premium overflow-hidden animate-fade-in-up"
        style={{ animationDelay: '0.1s', opacity: 0 }}
      >
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 'max-content' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    position: 'sticky',
                    left: 0,
                    background: 'var(--bg-card)',
                    zIndex: 10,
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  Employee
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Dept
                </th>
                {allSkills.map((skill) => (
                  <th
                    key={skill}
                    title={skill}
                    style={{
                      padding: '12px 8px',
                      textAlign: 'center',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      maxWidth: '72px',
                    }}
                  >
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '64px' }}>
                      {skill}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((emp, rowIdx) => {
                const skillMap: Record<string, number> = {};
                emp.skills.forEach((s) => (skillMap[s.skill_name] = s.level));
                return (
                  <tr
                    key={emp.employee_id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                      transition: 'background 0.2s',
                      background: rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(251,191,36,0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)')}
                  >
                    <td
                      style={{
                        padding: '12px 16px',
                        position: 'sticky',
                        left: 0,
                        background: 'var(--bg-card)',
                        zIndex: 5,
                        whiteSpace: 'nowrap',
                        borderRight: '1px solid rgba(255,255,255,0.05)',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        fontSize: '0.875rem',
                      }}
                    >
                      {emp.name}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        whiteSpace: 'nowrap',
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem',
                      }}
                    >
                      {emp.department}
                    </td>
                    {allSkills.map((skill) => {
                      const level = skillMap[skill];
                      const style = level ? PROFICIENCY_STYLE[level] : null;
                      return (
                        <td key={skill} style={{ padding: '8px', textAlign: 'center' }}>
                          {style ? (
                            <span
                              className="tooltip"
                              data-tip={style.label}
                              style={{
                                display: 'inline-flex',
                                width: '28px',
                                height: '28px',
                                borderRadius: '8px',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                background: style.bg,
                                color: style.color,
                                border: `1px solid ${style.color}33`,
                                fontFamily: 'Space Grotesk, sans-serif',
                              }}
                            >
                              {level}
                            </span>
                          ) : (
                            <span
                              style={{
                                display: 'inline-flex',
                                width: '28px',
                                height: '28px',
                                borderRadius: '8px',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                background: 'rgba(255,255,255,0.03)',
                                color: 'rgba(255,255,255,0.1)',
                              }}
                            >
                              —
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SkillMatrix;
