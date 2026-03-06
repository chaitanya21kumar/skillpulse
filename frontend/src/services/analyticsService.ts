import api from './api';

export interface DashboardStats {
  total_employees: number;
  total_skills: number;
  department_distribution: { department: string; count: number }[];
}

export interface TopPerformer {
  id: number;
  name: string;
  department: string;
  avg_proficiency: number;
}

export const analyticsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get('/analytics/dashboard-stats');
    return data;
  },

  getSkillDistribution: async () => {
    const { data } = await api.get('/analytics/skill-distribution');
    return data;
  },

  getSkillGaps: async () => {
    const { data } = await api.get('/analytics/skill-gaps');
    return data;
  },

  getTopPerformers: async (limit = 10): Promise<TopPerformer[]> => {
    const { data } = await api.get(`/analytics/top-performers?limit=${limit}`);
    return data;
  },

  getSkillMatrix: async () => {
    const { data } = await api.get('/skills/matrix');
    return data;
  },
};
