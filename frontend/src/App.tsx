import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import ImportWizard from './components/ImportWizard';
import SkillMatrix from './components/SkillMatrix';
import SkillGaps from './components/SkillGaps';
import Landing from './pages/Landing';
import './index.css';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        <Routes>
          {/* Landing page — no nav */}
          <Route path="/" element={<Landing />} />

          {/* App routes — with nav */}
          <Route
            path="/*"
            element={
              <>
                <Navigation />
                <main>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/employees" element={<EmployeeList />} />
                    <Route path="/matrix" element={<SkillMatrix />} />
                    <Route path="/gaps" element={<SkillGaps />} />
                    <Route path="/import" element={<ImportWizard />} />
                    <Route
                      path="*"
                      element={
                        <div
                          className="flex flex-col items-center justify-center h-96"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <p
                            className="text-6xl font-bold mb-4"
                            style={{
                              fontFamily: 'Sora, sans-serif',
                              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                            }}
                          >
                            404
                          </p>
                          <p style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            Page not found.
                          </p>
                        </div>
                      }
                    />
                  </Routes>
                </main>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
