import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { Grid } from 'lucide-react';

interface SkillMatrixEntry {
  employee_id: number;
  name: string;
  department: string;
  skills: { skill_name: string; level: number }[];
}

const LEVEL_COLORS: Record<number, string> = {
  1: 'bg-red-900/60 text-red-300',
  2: 'bg-orange-900/60 text-orange-300',
  3: 'bg-yellow-900/60 text-yellow-300',
  4: 'bg-blue-900/60 text-blue-300',
  5: 'bg-emerald-900/60 text-emerald-300',
};

const LEVEL_LABELS: Record<number, string> = {
  1: 'Beginner',
  2: 'Elementary',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Expert',
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
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400" />
      </div>
    );
  }

  if (matrix.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <Grid size={48} className="mx-auto mb-3 opacity-40" />
        <p className="text-lg">No skill data yet.</p>
        <p className="text-sm mt-1">Import employees and skills to see the matrix.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Skill Matrix</h1>
        <p className="text-slate-400 text-sm mt-1">
          {matrix.length} employees · {allSkills.length} skills
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(LEVEL_LABELS).map(([level, label]) => (
          <span key={level} className={`text-xs px-2 py-1 rounded ${LEVEL_COLORS[Number(level)]}`}>
            {level} — {label}
          </span>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="text-xs min-w-max w-full">
          <thead className="bg-slate-700/80">
            <tr>
              <th className="px-4 py-3 text-left text-slate-300 font-medium sticky left-0 bg-slate-700/80 whitespace-nowrap">
                Employee
              </th>
              <th className="px-4 py-3 text-left text-slate-300 font-medium whitespace-nowrap">
                Department
              </th>
              {allSkills.map((skill) => (
                <th
                  key={skill}
                  className="px-3 py-3 text-center text-slate-300 font-medium whitespace-nowrap max-w-20"
                  title={skill}
                >
                  <span className="block truncate max-w-16">{skill}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {matrix.map((emp) => {
              const skillMap: Record<string, number> = {};
              emp.skills.forEach((s) => (skillMap[s.skill_name] = s.level));
              return (
                <tr key={emp.employee_id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 text-white font-medium sticky left-0 bg-slate-800 whitespace-nowrap">
                    {emp.name}
                  </td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{emp.department}</td>
                  {allSkills.map((skill) => {
                    const level = skillMap[skill];
                    return (
                      <td key={skill} className="px-3 py-3 text-center">
                        {level ? (
                          <span
                            className={`inline-block w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${LEVEL_COLORS[level]}`}
                            title={LEVEL_LABELS[level]}
                          >
                            {level}
                          </span>
                        ) : (
                          <span className="inline-block w-6 h-6 rounded bg-slate-700/40 text-slate-600 text-xs flex items-center justify-center">
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
  );
};

export default SkillMatrix;
