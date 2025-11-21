import React from 'react';
import { Experience } from '../types';
import { Briefcase, Calendar } from 'lucide-react';

export const ExperienceList: React.FC<{ experiences: Experience[] }> = ({ experiences }) => {
  return (
    <section className="py-24 relative z-10 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-16">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-200 dark:border-indigo-500/20">
             <Briefcase className="text-indigo-600 dark:text-indigo-400" size={24} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 text-center">Professional <span className="text-indigo-600 dark:text-indigo-400">Journey</span></h2>
          <div className="w-1 bg-gradient-to-b from-indigo-500 to-transparent h-24 mt-4"></div>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/20 to-transparent"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={exp.id} className={`flex flex-col md:flex-row gap-8 items-center relative group ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-slate-50 dark:bg-slate-950 border-2 border-indigo-500 rounded-full -translate-x-[7px] md:-translate-x-1/2 z-10 group-hover:scale-150 group-hover:bg-indigo-500 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.6)] transition-all duration-300"></div>

                {/* Content Card */}
                <div className="flex-1 w-full md:w-1/2 pl-8 md:pl-0">
                  <div className={`relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-white/5 p-6 rounded-2xl hover:border-indigo-500/30 transition-all duration-300 hover:bg-white/60 dark:hover:bg-slate-900/60 hover:-translate-y-1 shadow-sm dark:shadow-none ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{exp.role}</h3>
                    </div>
                    <div className="text-indigo-600 dark:text-indigo-400 font-medium mb-1">{exp.company}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-mono uppercase tracking-wide">
                      <Calendar size={12} />
                      {exp.period}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
                
                {/* Spacer for the other side */}
                <div className="hidden md:block flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};