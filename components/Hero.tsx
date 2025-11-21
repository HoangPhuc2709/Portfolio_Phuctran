import React, { useEffect, useRef } from 'react';
import { Github, Linkedin, Twitter, Mail, ArrowRight, Terminal } from 'lucide-react';
import { Profile } from '../types';

export const Hero: React.FC<{ profile: Profile }> = ({ profile }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      // Normalize mouse position from -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      
      // Direct DOM update for maximum performance (avoids React re-renders)
      containerRef.current.style.setProperty('--mouse-x', x.toString());
      containerRef.current.style.setProperty('--mouse-y', y.toString());
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative pt-20 pb-32 lg:min-h-[90vh] flex items-center overflow-visible perspective-1000"
      style={{ '--mouse-x': '0', '--mouse-y': '0' } as React.CSSProperties}
    >
      {/* Decorative Gradients - Parallax Inverse - Using CSS variables */}
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none animate-pulse-slow transition-transform duration-100 ease-out"
        style={{ transform: 'translate(calc(var(--mouse-x) * 20px), calc(var(--mouse-y) * 20px))' }}
      ></div>
      <div 
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-400/10 dark:bg-cyan-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none transition-transform duration-100 ease-out"
        style={{ transform: 'translate(calc(var(--mouse-x) * -20px), calc(var(--mouse-y) * -20px))' }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="flex-1 text-center md:text-left animate-slide-up">
            <div className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-300 uppercase bg-indigo-500/10 dark:bg-indigo-900/30 border border-indigo-500/20 dark:border-indigo-500/30 rounded-full backdrop-blur-sm">
              Available for Hire
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-slate-100 mb-6 tracking-tight leading-tight font-heading">
              Hi, I'm <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400 animate-gradient">{profile.name}</span>
            </h1>
            <h2 className="text-2xl md:text-3xl text-slate-600 dark:text-slate-400 mb-8 font-light">
              {profile.title}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-2xl leading-relaxed backdrop-blur-sm bg-white/40 dark:bg-slate-950/30 p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-none transition-colors duration-300">
              {profile.bio}
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-10">
              {[
                { icon: Github, href: profile.social.github },
                { icon: Linkedin, href: profile.social.linkedin },
                { icon: Twitter, href: profile.social.twitter },
                { icon: Mail, href: profile.social.email ? `mailto:${profile.social.email}` : undefined }
              ].map((item, index) => item.href && (
                <a 
                  key={index}
                  href={item.href} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-3.5 rounded-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-600/20 hover:border-indigo-300 dark:hover:border-indigo-500 hover:scale-110 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-all duration-300 backdrop-blur-md shadow-sm dark:shadow-none"
                >
                  <item.icon size={24} />
                </a>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button 
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} 
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-1"
              >
                View My Work
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500 font-mono opacity-70 hover:opacity-100 transition-opacity cursor-default" title="Scroll to bottom for Terminal">
                <Terminal size={14} />
                <span>$ scroll_down --for-cli</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-center relative animate-fade-in delay-100">
            {/* Anti-Gravity Floating Avatar with Parallax */}
            <div 
              className="relative w-72 h-72 md:w-[500px] md:h-[500px] transition-transform duration-100 ease-out"
              style={{ transform: 'translate(calc(var(--mouse-x) * -15px), calc(var(--mouse-y) * -15px))' }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-full blur-3xl opacity-20 dark:opacity-30 animate-pulse-slow"></div>
              {/* Glassmorphism Ring */}
              <div className="absolute -inset-4 rounded-full border border-white/50 dark:border-white/10 backdrop-blur-[1px] animate-float-delayed"></div>
              <div className="absolute -inset-8 rounded-full border border-slate-200/30 dark:border-white/5 animate-float" style={{ animationDuration: '8s' }}></div>
              
              <img 
                src={profile.avatarUrl} 
                alt={profile.name} 
                className="relative w-full h-full object-cover rounded-full shadow-2xl ring-4 ring-white dark:ring-slate-800 animate-float"
              />
              
              {/* Floating Decoration Tags - Parallax Layer 2 */}
              <div 
                className="absolute -right-4 top-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-3 rounded-2xl shadow-xl hidden md:block transition-transform duration-200"
                style={{ transform: 'translate(calc(var(--mouse-x) * 30px), calc(var(--mouse-y) * 30px))' }}
              >
                 <span className="text-2xl">🚀</span>
              </div>
               <div 
                className="absolute -left-4 bottom-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-3 rounded-2xl shadow-xl hidden md:block transition-transform duration-200"
                style={{ transform: 'translate(calc(var(--mouse-x) * 20px), calc(var(--mouse-y) * 20px))' }}
              >
                 <span className="text-2xl">💻</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};