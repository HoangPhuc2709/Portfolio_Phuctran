
import React, { useState, useEffect } from 'react';
import { Profile, Skill } from '../../types';
import { storageService } from '../../services/storage';
import { Plus, Trash2, Save, Loader2, CheckCircle, AlertTriangle, X } from 'lucide-react';

export const SkillsTab: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newSkill, setNewSkill] = useState<Skill>({ name: '', category: 'frontend' });
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await storageService.fetchProfile();
      setProfile(data);
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

  const handleAddSkill = () => {
    if (!newSkill.name || !profile) return;
    const updatedSkills = [...profile.skills, newSkill];
    setProfile({ ...profile, skills: updatedSkills });
    setNewSkill({ name: '', category: 'frontend' });
  };

  const handleRemoveSkill = (index: number) => {
    if (!profile) return;
    const updatedSkills = profile.skills.filter((_, i) => i !== index);
    setProfile({ ...profile, skills: updatedSkills });
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await storageService.updateProfile(profile);
      showNotification('success', 'Skills updated successfully!');
    } catch (error: any) {
      showNotification('error', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !profile) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto"/></div>;

  return (
    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-8 border border-slate-200 dark:border-slate-800 animate-fade-in shadow-xl relative">
       {/* Notification */}
       {notification && (
        <div className={`fixed top-24 right-4 z-[100] px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {notification.type === 'success' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
          <div><p className="font-bold">{notification.type === 'success' ? "Success" : "Error"}</p><p className="text-sm">{notification.message}</p></div>
          <button onClick={() => setNotification(null)} className="ml-2 hover:bg-white/20 p-1 rounded"><X size={16}/></button>
        </div>
      )}

      <div className="mb-8 flex gap-4">
        <input
          type="text"
          value={newSkill.name}
          onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
          placeholder="New Skill Name"
          className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-slate-100"
        />
        <select
          value={newSkill.category}
          onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as any })}
          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 focus:border-indigo-500 outline-none text-slate-900 dark:text-slate-100"
        >
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="tools">Tools</option>
          <option value="other">Other</option>
        </select>
        <button
          onClick={handleAddSkill}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Add
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {profile.skills.map((skill, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-700 group">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">{skill.name}</h4>
              <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{skill.category}</span>
            </div>
            <button
              onClick={() => handleRemoveSkill(index)}
              className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save Skills
        </button>
      </div>
    </div>
  );
};
