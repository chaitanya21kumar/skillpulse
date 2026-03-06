import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import ImportWizard from './components/ImportWizard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="bg-slate-900 min-h-screen">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/import" element={<ImportWizard />} />
            <Route
              path="*"
              element={
                <div className="text-center py-20 text-slate-400">
                  <p className="text-4xl mb-4">404</p>
                  <p>Page not found.</p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
