
import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { storageService } from '../../services/storage';
import { generateProjectDescription } from '../../services/ai';
import { Plus, Trash2, Save, Loader2, Upload, ImageIcon, Wand2, Github, ExternalLink, CheckCircle, AlertTriangle, X } from 'lucide-react';

export const ProjectsTab: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await storageService.fetchProjects();
      setProjects(data);
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
      await storageService.updateProjects(projects);
      showNotification('success', 'Projects saved successfully!');
    } catch (error: any) {
      showNotification('error', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: 'New Project',
      description: 'Description goes here...',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      tags: ['React'],
      githubUrl: '',
      demoUrl: ''
    };
    setProjects([newProject, ...projects]);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Are you sure?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleUpdateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await storageService.uploadImage(file);
      handleUpdateProject(id, { imageUrl: url });
      showNotification('success', 'Image processed!');
    } catch (error: any) {
      showNotification('error', error.message);
    }
  };

  const handleGenerateDescription = async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    setAiLoading(true);
    try {
      const desc = await generateProjectDescription(project.title, project.tags);
      handleUpdateProject(id, { description: desc });
    } catch (error) {
      showNotification('error', 'AI Generation failed');
    } finally {
      setAiLoading(false);
    }
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
          onClick={handleAddProject}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={20} /> Add Project
        </button>
      </div>

      {projects.map((project) => (
        <div key={project.id} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-48 flex-shrink-0 space-y-3">
              <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 relative group">
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ImageIcon className="text-white" />
                </div>
              </div>
              
              <label className="flex items-center justify-center gap-2 w-full py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg cursor-pointer transition-colors">
                <Upload size={16} />
                <span>Upload Image</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(project.id, e)} />
              </label>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => handleUpdateProject(project.id, { title: e.target.value })}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-lg font-bold text-slate-900 dark:text-slate-100 focus:border-indigo-500 outline-none"
                />
                <input
                  type="text"
                  value={project.tags.join(', ')}
                  onChange={(e) => handleUpdateProject(project.id, { tags: e.target.value.split(',').map(t => t.trim()) })}
                  placeholder="Tags (comma separated)"
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="relative">
                <textarea
                  rows={3}
                  value={project.description}
                  onChange={(e) => handleUpdateProject(project.id, { description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 focus:border-indigo-500 outline-none"
                />
                <button
                  onClick={() => handleGenerateDescription(project.id)}
                  disabled={aiLoading}
                  className="absolute bottom-3 right-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-white bg-indigo-50 dark:bg-indigo-900/50 p-2 rounded-md transition-colors disabled:opacity-50"
                  title="Generate with AI"
                >
                  <Wand2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                   <Github size={18} className="text-slate-400" />
                   <input
                    type="text"
                    value={project.githubUrl}
                    onChange={(e) => handleUpdateProject(project.id, { githubUrl: e.target.value })}
                    placeholder="GitHub Repository URL"
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                   <ExternalLink size={18} className="text-slate-400" />
                   <input
                    type="text"
                    value={project.demoUrl}
                    onChange={(e) => handleUpdateProject(project.id, { demoUrl: e.target.value })}
                    placeholder="Live Demo URL"
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
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
          Save Projects
        </button>
      </div>
    </div>
  );
};
