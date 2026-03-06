import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Users, Upload, Menu, X, Zap, Grid } from 'lucide-react';

const Navigation: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { href: '/', label: 'Dashboard', icon: BarChart3 },
    { href: '/employees', label: 'Employees', icon: Users },
    { href: '/matrix', label: 'Skill Matrix', icon: Grid },
    { href: '/import', label: 'Import Data', icon: Upload },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-400">
            <Zap size={24} className="text-blue-400" />
            SkillPulse
          </Link>

          <div className="hidden md:flex gap-2">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === href
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-slate-800"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 space-y-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
                  location.pathname === href
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-slate-800'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
