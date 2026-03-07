import React, { useEffect, useState } from 'react';
import { employeeService, Employee } from '../services/employeeService';
import { Trash2, Search, UserPlus } from 'lucide-react';

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filtered, setFiltered] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeeService.getAll();
        setEmployees(data);
        setFiltered(data);
      } catch {
        setError('Failed to load employees. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFiltered(
      employees.filter(
        (e) =>
          e.name.toLowerCase().includes(lower) ||
          e.email.toLowerCase().includes(lower) ||
          e.department.toLowerCase().includes(lower) ||
          e.employee_id.toLowerCase().includes(lower)
      )
    );
  }, [search, employees]);

  const handleDelete = async (id: number) => {
    if (!confirm('Deactivate this employee?')) return;
    try {
      await employeeService.delete(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert('Failed to deactivate employee.');
    }
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const getDeptColor = (dept: string) => {
    const map: Record<string, { bg: string; text: string }> = {
      Engineering: { bg: 'rgba(59,130,246,0.12)', text: '#60a5fa' },
      'Data Science': { bg: 'rgba(249,115,22,0.12)', text: '#fb923c' },
      DevOps: { bg: 'rgba(6,182,212,0.12)', text: '#38bdf8' },
      Product: { bg: 'rgba(167,139,250,0.12)', text: '#a78bfa' },
      Marketing: { bg: 'rgba(244,114,182,0.12)', text: '#f472b6' },
      Sales: { bg: 'rgba(16,185,129,0.12)', text: '#34d399' },
    };
    return map[dept] || { bg: 'rgba(255,255,255,0.06)', text: 'var(--text-secondary)' };
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-48 gap-4">
        <div className="spinner-gold" />
        <p className="text-slate-500 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Loading employees...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-xl p-6 text-sm m-6"
        style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: '#fca5a5',
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold section-title" style={{ letterSpacing: '-0.02em' }}>
            Employees
          </h1>
          <p className="section-subtitle mt-1">
            {employees.length} total employees
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-premium w-full pl-9 pr-4 py-2.5 text-sm"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card-premium animate-fade-in">
          <div className="empty-state">
            <div className="empty-state-icon">
              <UserPlus size={28} />
            </div>
            <p className="font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              No employees found
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
              {search ? 'Try a different search term.' : 'Import employees using the Import Data page.'}
            </p>
          </div>
        </div>
      ) : (
        <div
          className="card-premium overflow-hidden animate-fade-in-up"
          style={{ animationDelay: '0.1s', opacity: 0 }}
        >
          <div className="overflow-x-auto">
            <table className="table-premium">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>ID</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Skills</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => {
                  const deptStyle = getDeptColor(emp.department);
                  return (
                    <tr key={emp.id}>
                      {/* Employee name + avatar */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold"
                            style={{
                              background: deptStyle.bg,
                              color: deptStyle.text,
                              fontFamily: 'Space Grotesk, sans-serif',
                            }}
                          >
                            {getInitials(emp.name)}
                          </div>
                          <div>
                            <p
                              className="font-medium text-sm"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {emp.name}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {emp.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className="text-xs px-2 py-1 rounded"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            color: 'var(--text-muted)',
                            fontFamily: 'JetBrains Mono, monospace',
                          }}
                        >
                          {emp.employee_id}
                        </span>
                      </td>
                      <td>
                        <span
                          className="text-xs font-medium px-2.5 py-1 rounded-lg"
                          style={{ background: deptStyle.bg, color: deptStyle.text }}
                        >
                          {emp.department}
                        </span>
                      </td>
                      <td
                        className="text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {emp.designation}
                      </td>
                      <td>
                        <span
                          className="text-xs font-medium px-2.5 py-1 rounded-lg"
                          style={{
                            background: 'rgba(251, 191, 36, 0.1)',
                            color: '#fbbf24',
                            fontFamily: 'Space Grotesk, sans-serif',
                          }}
                        >
                          {emp.skills?.length || 0} skills
                        </span>
                      </td>
                      <td>
                        <span
                          className="text-xs font-medium px-2.5 py-1 rounded-lg"
                          style={
                            emp.status === 'active'
                              ? { background: 'rgba(16,185,129,0.1)', color: '#34d399' }
                              : { background: 'rgba(239,68,68,0.1)', color: '#f87171' }
                          }
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td>
                        <button
                          title="Deactivate"
                          onClick={() => handleDelete(emp.id)}
                          className="p-1.5 rounded-lg transition-all hover:scale-105"
                          style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color = '#f87171';
                            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
                            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
