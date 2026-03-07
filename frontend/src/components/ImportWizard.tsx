import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText, ChevronRight, ArrowLeft } from 'lucide-react';
import api from '../services/api';

interface ImportResult {
  imported: number;
  errors: string[];
}

const ImportWizard: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [employeeFile, setEmployeeFile] = useState<File | null>(null);
  const [skillsFile, setSkillsFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ employees?: ImportResult; skills?: ImportResult }>({});
  const [importError, setImportError] = useState<string | null>(null);
  const [dragOverEmp, setDragOverEmp] = useState(false);
  const [dragOverSkill, setDragOverSkill] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'employees' | 'skills') => {
    if (e.target.files?.[0]) {
      if (type === 'employees') setEmployeeFile(e.target.files[0]);
      else setSkillsFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'employees' | 'skills') => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      if (type === 'employees') { setEmployeeFile(file); setDragOverEmp(false); }
      else { setSkillsFile(file); setDragOverSkill(false); }
    }
  };

  const handleImport = async () => {
    if (!employeeFile && !skillsFile) {
      setImportError('Please select at least one file to import.');
      return;
    }
    setLoading(true);
    setImportError(null);
    const newResults: typeof results = {};

    try {
      if (employeeFile) {
        const formData = new FormData();
        formData.append('file', employeeFile);
        const res = await api.post('/import/employees', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        newResults.employees = res.data;
      }

      if (skillsFile) {
        const formData = new FormData();
        formData.append('file', skillsFile);
        const res = await api.post('/import/employee-skills', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        newResults.skills = res.data;
      }

      setResults(newResults);
      setStep(3);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Import failed. Check file format.';
      setImportError(message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setEmployeeFile(null);
    setSkillsFile(null);
    setResults({});
    setImportError(null);
  };

  const steps = ['Upload Files', 'Confirm', 'Complete'];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold section-title" style={{ letterSpacing: '-0.02em' }}>
          Data Import
        </h1>
        <p className="section-subtitle mt-1">
          Import employees and skills from CSV or Excel files
        </p>
      </div>

      <div className="max-w-2xl">
        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-8 animate-fade-in-up" style={{ animationDelay: '0.05s', opacity: 0 }}>
          {steps.map((label, i) => {
            const s = i + 1;
            const isDone = step > s;
            const isActive = step === s;
            return (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      background: isDone
                        ? 'rgba(16,185,129,0.2)'
                        : isActive
                        ? 'rgba(251,191,36,0.2)'
                        : 'rgba(255,255,255,0.04)',
                      color: isDone ? '#34d399' : isActive ? '#fbbf24' : 'var(--text-muted)',
                      border: `1px solid ${isDone ? 'rgba(16,185,129,0.3)' : isActive ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    {isDone ? <CheckCircle size={14} /> : s}
                  </div>
                  <span
                    className="text-xs mt-1.5 whitespace-nowrap"
                    style={{
                      color: isActive ? '#fbbf24' : 'var(--text-muted)',
                      fontFamily: 'Space Grotesk, sans-serif',
                    }}
                  >
                    {label}
                  </span>
                </div>
                {s < steps.length && (
                  <div
                    className="flex-1 h-px mx-3 mb-5 transition-all duration-500"
                    style={{
                      background: step > s
                        ? 'linear-gradient(90deg, rgba(16,185,129,0.5), rgba(251,191,36,0.3))'
                        : 'rgba(255,255,255,0.06)',
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Card */}
        <div
          className="card-premium p-6 animate-fade-in-up"
          style={{ animationDelay: '0.1s', opacity: 0 }}
        >
          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="space-y-4">
              <p
                className="font-semibold mb-5"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', color: 'var(--text-primary)' }}
              >
                Select files to import
              </p>

              {/* Employee file */}
              <label className="block cursor-pointer">
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOverEmp(true); }}
                  onDragLeave={() => setDragOverEmp(false)}
                  onDrop={(e) => handleDrop(e, 'employees')}
                  className="p-6 rounded-xl border-2 transition-all duration-200"
                  style={{
                    borderStyle: 'dashed',
                    borderColor: employeeFile
                      ? 'rgba(16,185,129,0.5)'
                      : dragOverEmp
                      ? 'rgba(251,191,36,0.5)'
                      : 'rgba(255,255,255,0.08)',
                    background: employeeFile
                      ? 'rgba(16,185,129,0.06)'
                      : dragOverEmp
                      ? 'rgba(251,191,36,0.05)'
                      : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(59,130,246,0.12)' }}
                    >
                      <Upload size={20} style={{ color: '#60a5fa' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        Employee Data
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        CSV/Excel with: employee_id, name, email, department, designation
                      </p>
                      {employeeFile && (
                        <p
                          className="text-xs mt-2 flex items-center gap-1.5"
                          style={{ color: '#34d399' }}
                        >
                          <FileText size={12} /> {employeeFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <input type="file" accept=".csv,.xlsx" onChange={(e) => handleFileChange(e, 'employees')} className="hidden" />
              </label>

              {/* Skills file */}
              <label className="block cursor-pointer">
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOverSkill(true); }}
                  onDragLeave={() => setDragOverSkill(false)}
                  onDrop={(e) => handleDrop(e, 'skills')}
                  className="p-6 rounded-xl border-2 transition-all duration-200"
                  style={{
                    borderStyle: 'dashed',
                    borderColor: skillsFile
                      ? 'rgba(16,185,129,0.5)'
                      : dragOverSkill
                      ? 'rgba(251,191,36,0.5)'
                      : 'rgba(255,255,255,0.08)',
                    background: skillsFile
                      ? 'rgba(16,185,129,0.06)'
                      : dragOverSkill
                      ? 'rgba(251,191,36,0.05)'
                      : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(167,139,250,0.12)' }}
                    >
                      <Upload size={20} style={{ color: '#a78bfa' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        Skills Data{' '}
                        <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        CSV/Excel with: employee_id, skill_name, proficiency_level (1-5)
                      </p>
                      {skillsFile && (
                        <p className="text-xs mt-2 flex items-center gap-1.5" style={{ color: '#34d399' }}>
                          <FileText size={12} /> {skillsFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <input type="file" accept=".csv,.xlsx" onChange={(e) => handleFileChange(e, 'skills')} className="hidden" />
              </label>

              <button
                onClick={() => setStep(2)}
                disabled={!employeeFile && !skillsFile}
                className="btn-gold w-full flex items-center justify-center gap-2 py-3.5 mt-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              >
                Continue
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Step 2: Confirm */}
          {step === 2 && (
            <div>
              <p className="font-semibold mb-5" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', color: 'var(--text-primary)' }}>
                Confirm import
              </p>
              <div className="space-y-3 mb-5">
                {employeeFile && (
                  <div
                    className="flex items-center gap-3 p-4 rounded-xl"
                    style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}
                  >
                    <FileText size={18} style={{ color: '#60a5fa' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Employee file</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{employeeFile.name}</p>
                    </div>
                  </div>
                )}
                {skillsFile && (
                  <div
                    className="flex items-center gap-3 p-4 rounded-xl"
                    style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)' }}
                  >
                    <FileText size={18} style={{ color: '#a78bfa' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Skills file</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{skillsFile.name}</p>
                    </div>
                  </div>
                )}
              </div>

              {importError && (
                <div
                  className="flex items-start gap-2 p-4 rounded-xl text-sm mb-4"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#fca5a5',
                  }}
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  {importError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="btn-outline flex-1 flex items-center justify-center gap-2 py-3"
                >
                  <ArrowLeft size={15} />
                  Back
                </button>
                <button
                  onClick={handleImport}
                  disabled={loading}
                  className="btn-gold flex-1 flex items-center justify-center gap-2 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                      Importing...
                    </>
                  ) : (
                    'Start Import'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Complete */}
          {step === 3 && (
            <div className="text-center py-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(16,185,129,0.12)' }}
              >
                <CheckCircle size={32} style={{ color: '#34d399' }} />
              </div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}
              >
                Import Complete
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                Your data has been successfully imported.
              </p>

              <div className="space-y-3 text-left mb-6">
                {results.employees && (
                  <div
                    className="p-4 rounded-xl"
                    style={{
                      background: 'rgba(59,130,246,0.08)',
                      border: '1px solid rgba(59,130,246,0.15)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        Employees
                      </span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: '#60a5fa', fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        {results.employees.imported} imported
                      </span>
                    </div>
                    {results.employees.errors.length > 0 && (
                      <p className="text-xs mt-1" style={{ color: '#fb923c' }}>
                        {results.employees.errors.length} row(s) skipped
                      </p>
                    )}
                  </div>
                )}
                {results.skills && (
                  <div
                    className="p-4 rounded-xl"
                    style={{
                      background: 'rgba(167,139,250,0.08)',
                      border: '1px solid rgba(167,139,250,0.15)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        Skills
                      </span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: '#a78bfa', fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        {results.skills.imported} imported
                      </span>
                    </div>
                    {results.skills.errors.length > 0 && (
                      <p className="text-xs mt-1" style={{ color: '#fb923c' }}>
                        {results.skills.errors.length} row(s) skipped
                      </p>
                    )}
                  </div>
                )}
              </div>

              <button onClick={reset} className="btn-gold px-8 py-3">
                Import More Data
              </button>
            </div>
          )}
        </div>

        {/* Format guide */}
        {step === 1 && (
          <div
            className="mt-5 p-5 rounded-xl animate-fade-in-up"
            style={{ animationDelay: '0.15s', opacity: 0, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}
            >
              CSV Format Guide
            </p>
            <div className="space-y-2">
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Employees:</p>
                <code
                  className="text-xs block px-3 py-2 rounded-lg"
                  style={{
                    background: 'rgba(59,130,246,0.08)',
                    color: '#60a5fa',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  employee_id,name,email,department,designation,joining_date
                </code>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Skills:</p>
                <code
                  className="text-xs block px-3 py-2 rounded-lg"
                  style={{
                    background: 'rgba(167,139,250,0.08)',
                    color: '#a78bfa',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  employee_id,skill_name,proficiency_level
                </code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportWizard;
