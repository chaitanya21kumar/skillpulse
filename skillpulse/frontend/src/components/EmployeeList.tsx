import React, { useEffect, useState } from 'react';
import { employeeService, Employee } from '../services/employeeService';
import { Trash2, Eye, Search, UserPlus } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/40 border border-red-500 rounded-lg p-6 text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Employees</h1>
          <p className="text-slate-400 text-sm mt-1">{employees.length} total employees</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <UserPlus size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-lg">No employees found.</p>
          <p className="text-sm mt-1">Import employees using the Import Data page.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-700">
          <table className="w-full text-sm">
            <thead className="bg-slate-700/80">
              <tr>
                {['Employee ID', 'Name', 'Email', 'Department', 'Designation', 'Skills', 'Status', 'Actions'].map(
                  (h) => (
                    <th key={h} className="px-5 py-3 text-left text-slate-300 font-medium whitespace-nowrap">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-700/40 transition-colors">
                  <td className="px-5 py-3 text-slate-300 font-mono text-xs">{emp.employee_id}</td>
                  <td className="px-5 py-3 text-white font-medium">{emp.name}</td>
                  <td className="px-5 py-3 text-slate-300">{emp.email}</td>
                  <td className="px-5 py-3 text-slate-300">{emp.department}</td>
                  <td className="px-5 py-3 text-slate-300">{emp.designation}</td>
                  <td className="px-5 py-3">
                    <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full">
                      {emp.skills?.length || 0} skills
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        emp.status === 'active'
                          ? 'bg-emerald-900/50 text-emerald-400'
                          : 'bg-red-900/50 text-red-400'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        title="View"
                        className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-slate-700 transition"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        title="Deactivate"
                        onClick={() => handleDelete(emp.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-slate-700 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
