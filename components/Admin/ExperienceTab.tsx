
import React, { useState, useEffect } from 'react';
import { Experience } from '../../types';
import { storageService } from '../../services/storage';
import { Plus, Trash2, Save, Loader2, CheckCircle, AlertTriangle, X } from 'lucide-react';

export const ExperienceTab: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await storageService.fetchExperiences();
      setExperiences(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await storageService.updateExperiences(experiences);
      showNotification('success', 'Experience saved successfully!');
    } catch (error: any) {
      showNotification('error', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      role: 'New Role',
      company: 'Company Name',
      period: '2023 - Present',
      description: 'Describe your responsibilities...'
    };
    setExperiences([newExp, ...experiences]);
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences(experiences.filter(e => e.id !== id));
  };

  const handleUpdateExperience = (id: string, updates: Partial<Experience>) => {
    setExperiences(experiences.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto"/></div>;

  return (
    <div className="space-y-6 animate-fade-in relative">
       {/* Notification */}
       {notification && (
        <div className={`fixed top-24 right-4 z-[100] px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {notification.type === 'success' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
          <div><p className="font-bold">{notification.type === 'success' ? "Success" : "Error"}</p><p className="text-sm">{notification.message}</p></div>
          <button onClick={() => setNotification(null)} className="ml-2 hover:bg-white/20 p-1 rounded"><X size={16}/></button>
        </div>
      )}

      <div className="flex justify-end">
         <button 
            onClick={handleAddExperience}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20"
         >
           <Plus size={20} /> Add Experience
         </button>
      </div>
      
      {experiences.map((exp) => (
        <div key={exp.id} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={exp.role}
                onChange={(e) => handleUpdateExperience(exp.id, { role: e.target.value })}
                placeholder="Role / Job Title"
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 font-bold focus:border-indigo-500 outline-none"
              />
               <input
                type="text"
                value={exp.company}
                onChange={(e) => handleUpdateExperience(exp.id, { company: e.target.value })}
                placeholder="Company Name"
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-indigo-500 outline-none"
              />
           </div>
           <div className="mb-4">
              <input
                type="text"
                value={exp.period}
                onChange={(e) => handleUpdateExperience(exp.id, { period: e.target.value })}
                placeholder="Period (e.g. 2020 - Present)"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 text-sm font-mono focus:border-indigo-500 outline-none"
              />
           </div>
           <div className="mb-4">
              <textarea
                rows={3}
                value={exp.description}
                onChange={(e) => handleUpdateExperience(exp.id, { description: e.target.value })}
                placeholder="Description of roles and achievements..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-indigo-500 outline-none"
              />
           </div>
           <div className="flex justify-end">
              <button 
                onClick={() => handleDeleteExperience(exp.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg transition-colors"
              >
                <Trash2 size={20} />
              </button>
           </div>
        </div>
      ))}

       <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save Experience
        </button>
      </div>
    </div>
  );
};
