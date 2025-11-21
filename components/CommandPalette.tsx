
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command, Search, User, Briefcase, Code2, Mail, Lock, ExternalLink, X } from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Toggle on Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const actions = [
    { 
      id: 'home', 
      label: 'Go to Home', 
      icon: <User size={18} />, 
      shortcut: 'H', 
      action: () => { navigate('/'); document.getElementById('root')?.scrollIntoView({ behavior: 'smooth' }); } 
    },
    { 
      id: 'projects', 
      label: 'View Projects', 
      icon: <Code2 size={18} />, 
      shortcut: 'P', 
      action: () => { navigate('/'); setTimeout(() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }), 100); } 
    },
    { 
      id: 'experience', 
      label: 'My Experience', 
      icon: <Briefcase size={18} />, 
      shortcut: 'E', 
      action: () => { navigate('/'); setTimeout(() => document.querySelector('section:nth-of-type(3)')?.scrollIntoView({ behavior: 'smooth' }), 100); } 
    },
    { 
      id: 'contact', 
      label: 'Contact Me', 
      icon: <Mail size={18} />, 
      shortcut: 'C', 
      action: () => { navigate('/'); setTimeout(() => document.querySelector('section:last-of-type')?.scrollIntoView({ behavior: 'smooth' }), 100); } 
    },
    { 
      id: 'admin', 
      label: 'Admin Dashboard', 
      icon: <Lock size={18} />, 
      shortcut: 'A', 
      action: () => navigate('/admin') 
    },
  ];

  const filteredActions = actions.filter(action => 
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[20vh] animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center px-4 py-4 border-b border-slate-800">
          <Search className="text-slate-400 mr-3" size={20} />
          <input
            type="text"
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-lg text-white placeholder-slate-500 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <div className="text-xs font-medium text-slate-500 border border-slate-700 rounded px-2 py-1">ESC</div>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto py-2">
          {filteredActions.length > 0 ? (
            filteredActions.map((item) => (
              <button
                key={item.id}
                onClick={() => handleAction(item.action)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-indigo-600/20 hover:text-white text-slate-300 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 group-hover:text-indigo-400">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.shortcut && (
                  <span className="text-xs text-slate-600 group-hover:text-indigo-300 font-mono border border-slate-800 group-hover:border-indigo-500/30 rounded px-1.5 py-0.5">
                    {item.shortcut}
                  </span>
                )}
              </button>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-slate-500">
              No results found.
            </div>
          )}
        </div>
        
        <div className="bg-slate-950 px-4 py-2 text-xs text-slate-500 flex justify-between items-center border-t border-slate-800">
          <span>DevFolio Command</span>
          <div className="flex gap-2">
             <span>Navigate</span>
             <span className="font-bold text-slate-400">↑↓</span>
             <span>Select</span>
             <span className="font-bold text-slate-400">↵</span>
          </div>
        </div>
      </div>
    </div>
  );
};
