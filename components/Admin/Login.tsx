import React, { useState } from 'react';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      onLogin();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-indigo-600 dark:text-indigo-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin Access</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Enter your password to manage the portfolio.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className={`w-full bg-slate-50 dark:bg-slate-950 border ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'} rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 outline-none transition-all`}
                placeholder="Password"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 mt-2 text-red-500 dark:text-red-400 text-sm animate-pulse">
                <AlertCircle size={14} />
                <span>Incorrect password</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/25"
          >
            Access Dashboard
            <ArrowRight size={18} />
          </button>
        </form>
        
        {/* <div className="mt-6 text-center">
           <p className="text-xs text-slate-500 dark:text-slate-600">Hint: The default password is <strong>admin123</strong></p>
        </div> */}
      </div>
    </div>
  );
};