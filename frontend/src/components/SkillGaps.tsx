import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { AlertTriangle } from 'lucide-react';

interface DeptGaps {
  [dept: string]: { [skill: string]: number };
}

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
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400" />
      </div>
    );
  }

  const depts = Object.keys(gaps);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Skill Gap Analysis</h1>
        <p className="text-slate-400 text-sm mt-1">
          Skills with proficiency below 3 across departments
        </p>
      </div>

      {totalGaps === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <AlertTriangle size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-lg">No skill gaps detected.</p>
          <p className="text-sm mt-1">All skills are at proficiency level 3 or above.</p>
        </div>
      ) : (
        <>
          <div className="bg-orange-900/20 border border-orange-700/50 rounded-xl px-5 py-4 mb-6 flex items-center gap-3">
            <AlertTriangle size={20} className="text-orange-400 shrink-0" />
            <span className="text-orange-300 text-sm">
              <strong>{totalGaps}</strong> skill gap(s) found across {depts.length} department(s)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {depts.map((dept) => {
              const skillGaps = Object.entries(gaps[dept]);
              return (
                <div key={dept} className="bg-slate-800 rounded-xl border border-slate-700 p-5">
                  <h2 className="text-white font-semibold text-lg mb-3">{dept}</h2>
                  <div className="space-y-2">
                    {skillGaps.map(([skill, count]) => (
                      <div key={skill} className="flex items-center justify-between">
                        <span className="text-slate-300 text-sm">{skill}</span>
                        <span className="bg-red-900/50 text-red-300 text-xs px-2 py-1 rounded-full font-medium">
                          {count} below threshold
                        </span>
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
