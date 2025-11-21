
import React, { useState } from 'react';
import { ProfileTab } from './ProfileTab';
import { SkillsTab } from './SkillsTab';
import { ProjectsTab } from './ProjectsTab';
import { ExperienceTab } from './ExperienceTab';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'skills' | 'experience' | 'projects'>('profile');

  return (
    <div className="container mx-auto px-4 py-8 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative min-h-screen">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 font-heading">Admin Command Center</h1>
        <div className="flex flex-wrap gap-2 bg-white dark:bg-slate-900/80 backdrop-blur-md p-1 rounded-lg border border-slate-200 dark:border-slate-800 mt-4 md:mt-0 justify-center shadow-sm">
          {(['profile', 'skills', 'experience', 'projects'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-6 py-2 rounded-md font-medium capitalize transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'profile' && <ProfileTab />}
      {activeTab === 'skills' && <SkillsTab />}
      {activeTab === 'experience' && <ExperienceTab />}
      {activeTab === 'projects' && <ProjectsTab />}
    </div>
  );
};
