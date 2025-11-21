import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Skills } from './components/Skills';
import { ProjectList } from './components/ProjectList';
import { ExperienceList } from './components/Experience';
import { Contact } from './components/Contact';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { Login } from './components/Admin/Login';
import { BackgroundEffect } from './components/BackgroundEffect';
import { CustomCursor } from './components/CustomCursor';
import { CommandPalette } from './components/CommandPalette';
import { ScrollProgress } from './components/ScrollProgress';
import { Terminal } from './components/Terminal';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { getProfile, getProjects, getExperiences, initStorage } from './services/storage';
import { Profile, Project, Experience } from './types';
import { Loader2 } from 'lucide-react';
import { ThemeProvider } from './components/ThemeContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const MainLayout: React.FC<{ profile: Profile; projects: Project[]; experiences: Experience[] }> = ({ profile, projects, experiences }) => (
  <div className="min-h-screen flex flex-col relative z-10">
    <Navigation name={profile.name} />
    <main className="flex-grow">
      <Hero profile={profile} />
      <Skills skills={profile.skills} />
      <ExperienceList experiences={experiences} />
      <ProjectList projects={projects} />
      <Contact />
      <Terminal />
    </main>
    <ScrollToTopButton />
    <footer className="bg-slate-100/80 dark:bg-slate-950/80 backdrop-blur-xl pt-8 pb-8 border-t border-slate-200 dark:border-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 font-heading">{profile.name}</h3>
        <p className="text-slate-600 dark:text-slate-500 mb-8">{profile.title}</p>
        <div className="text-slate-500 dark:text-slate-600 text-sm">
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
          <p className="mt-2">Powered by React & Gemini AI</p>
        </div>
      </div>
    </footer>
  </div>
);

const AppContent: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize storage with default data if empty
    initStorage();
    
    // Simulate loading for smooth experience
    setTimeout(() => {
      setProfile(getProfile());
      setProjects(getProjects());
      setExperiences(getExperiences());
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const auth = sessionStorage.getItem('devfolio_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('devfolio_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('devfolio_auth');
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
           <Loader2 className="animate-spin text-indigo-500" size={48} />
           <p className="text-slate-500 dark:text-slate-400 font-medium">Loading DevFolio...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-600 dark:selection:text-indigo-200 relative overflow-hidden transition-colors duration-300">
        <CustomCursor />
        <BackgroundEffect />
        <ScrollProgress />
        <CommandPalette />
        <Routes>
          <Route path="/" element={<MainLayout profile={profile} projects={projects} experiences={experiences} />} />
          <Route path="/admin" element={
            <div className="min-h-screen flex flex-col relative z-10">
              <Navigation 
                name={profile.name} 
                isAuthenticated={isAuthenticated} 
                onLogout={handleLogout}
              />
              {isAuthenticated ? (
                <AdminDashboard />
              ) : (
                <Login onLogin={handleLogin} />
              )}
            </div>
          } />
        </Routes>
      </div>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;