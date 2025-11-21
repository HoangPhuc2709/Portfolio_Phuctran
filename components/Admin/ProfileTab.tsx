
import React, { useState, useEffect } from 'react';
import { Profile } from '../../types';
import { storageService } from '../../services/storage';
import { enhanceBio } from '../../services/ai';
import { Save, Upload, Wand2, Loader2, Github, Linkedin, Twitter, Mail, CheckCircle, AlertTriangle, X } from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
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

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await storageService.updateProfile(profile);
      showNotification('success', 'Profile updated successfully!');
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEnhanceBio = async () => {
    if (!profile) return;
    setAiLoading(true);
    try {
      const enhanced = await enhanceBio(profile.bio);
      setProfile({ ...profile, bio: enhanced });
    } catch (error) {
      showNotification('error', 'AI Enhancement failed. Check API Key.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      // Delegate processing to Backend Service
      const uploadedUrl = await storageService.uploadImage(file);
      setProfile({ ...profile, avatarUrl: uploadedUrl });
      showNotification('success', 'Image processed and ready to save!');
    } catch (error: any) {
      showNotification('error', error.message);
    }
  };

  if (loading || !profile) return <div className="p-8 text-center text-slate-500"><Loader2 className="animate-spin mx-auto mb-2"/> Loading Profile...</div>;

  return (
    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-8 border border-slate-200 dark:border-slate-800 animate-fade-in shadow-xl relative">
      
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-24 right-4 z-[100] px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {notification.type === 'success' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
          <div>
            <p className="font-bold">{notification.type === 'success' ? "Success" : "Error"}</p>
            <p className="text-sm">{notification.message}</p>
          </div>
          <button onClick={() => setNotification(null)} className="ml-2 hover:bg-white/20 p-1 rounded"><X size={16}/></button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Display Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Job Title</label>
            <input
              type="text"
              value={profile.title}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Avatar Image</label>
            <div className="flex gap-4 items-center">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 flex-shrink-0">
                <img src={profile.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex gap-2">
                <input
                    type="text"
                    value={profile.avatarUrl}
                    onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                    placeholder="Image URL"
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 focus:border-indigo-500 outline-none text-slate-900 dark:text-slate-100"
                />
                <label className="cursor-pointer bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 rounded-lg flex items-center justify-center transition-colors" title="Upload from Local">
                    <Upload size={20} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Bio</label>
              <button
                onClick={handleEnhanceBio}
                disabled={aiLoading}
                className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-white transition-colors disabled:opacity-50"
              >
                <Wand2 size={14} />
                {aiLoading ? 'Enhancing...' : 'Enhance with AI'}
              </button>
            </div>
            <textarea
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-slate-100"
            />
          </div>
          
          {/* Social Links Inputs */}
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Social Links</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                    <Github size={18} className="text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="GitHub URL"
                        value={profile.social.github || ''}
                        onChange={(e) => setProfile({...profile, social: {...profile.social, github: e.target.value}})}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 outline-none"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Linkedin size={18} className="text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="LinkedIn URL"
                        value={profile.social.linkedin || ''}
                        onChange={(e) => setProfile({...profile, social: {...profile.social, linkedin: e.target.value}})}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 outline-none"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Twitter size={18} className="text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Twitter URL"
                        value={profile.social.twitter || ''}
                        onChange={(e) => setProfile({...profile, social: {...profile.social, twitter: e.target.value}})}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 outline-none"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Mail size={18} className="text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Email Address"
                        value={profile.social.email || ''}
                        onChange={(e) => setProfile({...profile, social: {...profile.social, email: e.target.value}})}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 outline-none"
                    />
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save Changes
        </button>
      </div>
    </div>
  );
};
