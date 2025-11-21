import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Lock, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface NavigationProps {
  name: string;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ name, isAuthenticated = false, onLogout }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isAdminRoute = location.pathname === '/admin';

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
          <Code2 size={28} />
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100 font-heading">{name}</span>
        </Link>

        <div className="flex items-center space-x-6">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {!isAdminRoute ? (
            <>
              <Link to="/" className="text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-medium transition-colors">Portfolio</Link>
              <Link 
                to="/admin" 
                className="text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                title="Admin Access"
              >
                <Lock size={16} />
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium"
              >
                View Site
              </Link>
              {isAuthenticated && onLogout && (
                <button 
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-sm font-medium border border-transparent hover:border-red-200 dark:hover:border-red-500/20"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};