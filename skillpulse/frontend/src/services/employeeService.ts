import api from './api';

export interface Employee {
  id: number;
  employee_id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  status: string;
  skills: EmployeeSkill[];
}

export interface EmployeeSkill {
  id: number;
  name: string;
  proficiency_level: number;
}

export interface EmployeeCreate {
  employee_id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  joining_date: string;
}

export const employeeService = {
  getAll: async (skip = 0, limit = 100): Promise<Employee[]> => {
    const { data } = await api.get('/employees', { params: { skip, limit } });
    return data;
  },

  getById: async (id: number): Promise<Employee> => {
    const { data } = await api.get(`/employees/${id}`);
    return data;
  },

  create: async (employee: EmployeeCreate): Promise<Employee> => {
    const { data } = await api.post('/employees', employee);
    return data;
  },

  update: async (id: number, employee: Partial<Employee>): Promise<Employee> => {
    const { data } = await api.put(`/employees/${id}`, employee);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },
};
