import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Minus, Square, ChevronRight } from 'lucide-react';
import { getProfile, getProjects } from '../services/storage';

interface Log {
  type: 'command' | 'output' | 'error';
  content: React.ReactNode;
}

export const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<Log[]>([
    { type: 'output', content: 'Welcome to DevFolio Interactive Terminal v1.0.0' },
    { type: 'output', content: 'Type "help" to see available commands.' },
  ]);
  const [isMinimized, setIsMinimized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch real data for commands
  const profile = getProfile();
  const projects = getProjects();

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isMinimized]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const newLogs: Log[] = [{ type: 'command', content: cmd }];

    switch (trimmedCmd) {
      case 'help':
        newLogs.push({ 
          type: 'output', 
          content: (
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <span className="text-indigo-400">about</span><span>View profile summary</span>
              <span className="text-indigo-400">projects</span><span>List projects</span>
              <span className="text-indigo-400">skills</span><span>List technical skills</span>
              <span className="text-indigo-400">contact</span><span>Get contact info</span>
              <span className="text-indigo-400">clear</span><span>Clear terminal</span>
              <span className="text-indigo-400">sudo</span><span>Admin access</span>
            </div>
          )
        });
        break;
      case 'about':
        newLogs.push({ type: 'output', content: profile.bio });
        break;
      case 'projects':
        newLogs.push({ type: 'output', content: (
          <div className="flex flex-col gap-1">
            <div className="text-indigo-300 mb-1">Listing {projects.length} projects:</div>
            {projects.map(p => (
              <div key={p.id}>- {p.title} <span className="text-slate-500">({p.tags.join(', ')})</span></div>
            ))}
          </div>
        )});
        break;
      case 'skills':
        const categories = Array.from(new Set(profile.skills.map(s => s.category)));
        newLogs.push({ type: 'output', content: (
          <div className="flex flex-col gap-1">
             {categories.map(cat => (
               <div key={cat}>
                 <span className="text-indigo-300 capitalize">{cat}:</span> {profile.skills.filter(s => s.category === cat).map(s => s.name).join(', ')}
               </div>
             ))}
          </div>
        )});
        break;
      case 'contact':
        newLogs.push({ type: 'output', content: `Email: ${profile.social.email || 'Not provided'} | Github: ${profile.social.github || 'Not provided'}` });
        break;
      case 'clear':
        setLogs([]);
        return;
      case 'sudo':
        newLogs.push({ type: 'error', content: 'Permission denied: You are not the root user. Try logging in via /admin GUI.' });
        break;
      case 'whoami':
        newLogs.push({ type: 'output', content: 'guest@browser-session' });
        break;
      default:
        if (trimmedCmd !== '') {
          newLogs.push({ type: 'error', content: `Command not found: ${cmd}` });
        }
        break;
    }

    setLogs(prev => [...prev, ...newLogs]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput('');
  };

  return (
    <section className="py-12 container mx-auto px-4 max-w-4xl relative z-10">
      <div className={`bg-slate-950 rounded-lg border border-slate-300 dark:border-slate-800 shadow-2xl overflow-hidden transition-all duration-300 ${isMinimized ? 'h-12' : 'h-[400px]'}`}>
        {/* Terminal Header */}
        <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800" onClick={() => setIsMinimized(!isMinimized)}>
          <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}>
             <TerminalIcon size={16} className="text-slate-400" />
             <span className="text-xs font-mono text-slate-300 font-bold">visitor@{profile.name.toLowerCase().replace(/\s+/g, '')}:~</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsMinimized(true)} className="text-slate-500 hover:text-yellow-400"><Minus size={14} /></button>
            <button onClick={() => setIsMinimized(false)} className="text-slate-500 hover:text-green-400"><Square size={12} /></button>
            <button className="text-slate-500 hover:text-red-400 opacity-50 cursor-not-allowed"><X size={14} /></button>
          </div>
        </div>

        {/* Terminal Body */}
        {!isMinimized && (
          <div 
            className="p-4 h-[calc(100%-3rem)] overflow-y-auto font-mono text-sm text-slate-300 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
            onClick={() => inputRef.current?.focus()}
          >
            {logs.map((log, i) => (
              <div key={i} className="mb-2 break-words">
                {log.type === 'command' ? (
                  <div className="flex gap-2 items-center text-slate-400">
                    <ChevronRight size={14} />
                    <span className="text-white">{log.content}</span>
                  </div>
                ) : (
                  <div className={`${log.type === 'error' ? 'text-red-400' : 'text-slate-300'} ml-5`}>
                    {log.content}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
            
            <form onSubmit={handleSubmit} className="flex gap-2 items-center mt-2 text-white">
              <ChevronRight size={14} className="text-green-500" />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 font-mono"
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
              <span className="w-2 h-4 bg-slate-500 animate-pulse ml-[-8px]"></span>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};