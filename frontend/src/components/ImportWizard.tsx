import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText, ChevronRight } from 'lucide-react';
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'employees' | 'skills') => {
    if (e.target.files?.[0]) {
      if (type === 'employees') setEmployeeFile(e.target.files[0]);
      else setSkillsFile(e.target.files[0]);
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Data Import Wizard</h1>
        <p className="text-slate-400 text-sm mt-1">Import employees and skills from CSV or Excel files</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div className={`flex-1 h-0.5 ${step > s ? 'bg-blue-600' : 'bg-slate-700'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-400 -mt-6 mb-8 px-1">
        <span>Upload Files</span>
        <span>Confirm</span>
        <span>Complete</span>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Select Files to Import</h2>

            {/* Employee file drop zone */}
            <label className="block cursor-pointer">
              <div
                className={`p-6 border-2 border-dashed rounded-xl transition-all ${
                  employeeFile
                    ? 'border-emerald-500 bg-emerald-900/20'
                    : 'border-slate-600 hover:border-blue-500 hover:bg-slate-700/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-900/40 rounded-lg">
                    <Upload size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Employee Data</p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      CSV/Excel with: employee_id, name, email, department, designation
                    </p>
                    {employeeFile && (
                      <p className="text-emerald-400 text-sm mt-1 flex items-center gap-1">
                        <FileText size={14} /> {employeeFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={(e) => handleFileChange(e, 'employees')}
                className="hidden"
              />
            </label>

            {/* Skills file drop zone */}
            <label className="block cursor-pointer">
              <div
                className={`p-6 border-2 border-dashed rounded-xl transition-all ${
                  skillsFile
                    ? 'border-emerald-500 bg-emerald-900/20'
                    : 'border-slate-600 hover:border-purple-500 hover:bg-slate-700/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-900/40 rounded-lg">
                    <Upload size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Skills Data (Optional)</p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      CSV/Excel with: employee_id, skill_name, proficiency_level (1-5)
                    </p>
                    {skillsFile && (
                      <p className="text-emerald-400 text-sm mt-1 flex items-center gap-1">
                        <FileText size={14} /> {skillsFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={(e) => handleFileChange(e, 'skills')}
                className="hidden"
              />
            </label>

            <button
              onClick={() => setStep(2)}
              disabled={!employeeFile && !skillsFile}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 rounded-lg transition mt-2"
            >
              Continue <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Confirm */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-6">Confirm Import</h2>
            <div className="space-y-3 mb-6">
              {employeeFile && (
                <div className="flex items-center gap-3 p-4 bg-slate-700 rounded-lg">
                  <FileText size={20} className="text-blue-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Employee file</p>
                    <p className="text-slate-400 text-xs">{employeeFile.name}</p>
                  </div>
                </div>
              )}
              {skillsFile && (
                <div className="flex items-center gap-3 p-4 bg-slate-700 rounded-lg">
                  <FileText size={20} className="text-purple-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Skills file</p>
                    <p className="text-slate-400 text-xs">{skillsFile.name}</p>
                  </div>
                </div>
              )}
            </div>

            {importError && (
              <div className="flex items-start gap-2 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 text-sm mb-4">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {importError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition font-medium"
              >
                Back
              </button>
              <button
                onClick={handleImport}
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 rounded-lg transition"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Importing...
                  </span>
                ) : (
                  'Start Import'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === 3 && (
          <div className="text-center">
            <CheckCircle size={64} className="text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Import Complete!</h2>
            <p className="text-slate-400 mb-6">Your data has been successfully imported.</p>

            <div className="space-y-3 text-left mb-6">
              {results.employees && (
                <div className="p-4 bg-emerald-900/20 border border-emerald-700/50 rounded-lg">
                  <p className="text-emerald-300 font-medium">
                    Employees: {results.employees.imported} imported
                  </p>
                  {results.employees.errors.length > 0 && (
                    <p className="text-yellow-400 text-sm mt-1">
                      {results.employees.errors.length} row(s) skipped
                    </p>
                  )}
                </div>
              )}
              {results.skills && (
                <div className="p-4 bg-purple-900/20 border border-purple-700/50 rounded-lg">
                  <p className="text-purple-300 font-medium">
                    Skills: {results.skills.imported} imported
                  </p>
                  {results.skills.errors.length > 0 && (
                    <p className="text-yellow-400 text-sm mt-1">
                      {results.skills.errors.length} row(s) skipped
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={reset}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition"
            >
              Import More Data
            </button>
          </div>
        )}
      </div>

      {/* Format guide */}
      {step === 1 && (
        <div className="mt-6 p-5 bg-slate-800/50 rounded-xl border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">CSV Format Guide</h3>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-slate-400 mb-1">Employees:</p>
              <code className="text-xs text-blue-300 bg-slate-900 px-3 py-1.5 rounded block">
                employee_id,name,email,department,designation,joining_date
              </code>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Skills:</p>
              <code className="text-xs text-purple-300 bg-slate-900 px-3 py-1.5 rounded block">
                employee_id,skill_name,proficiency_level
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportWizard;
