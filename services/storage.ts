
import { Profile, Project, Experience } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'devfolio_profile',
  PROJECTS: 'devfolio_projects',
  EXPERIENCE: 'devfolio_experience',
};

const DEFAULT_PROFILE: Profile = {
  name: 'Phuc Tran',
  title: 'Full Stack Engineer & UI Designer',
  bio: 'Passionate developer with 5+ years of experience in building digital products. I love creating seamless user experiences and robust backend systems.',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80',
  social: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    email: 'phuctran27092004@gmail.com',
  },
  skills: [
    { name: 'React', category: 'frontend' },
    { name: 'TypeScript', category: 'frontend' },
    { name: 'Tailwind CSS', category: 'frontend' },
    { name: 'Node.js', category: 'backend' },
    { name: 'PostgreSQL', category: 'backend' },
    { name: 'Docker', category: 'tools' },
    { name: 'Git', category: 'tools' },
    { name: 'AWS', category: 'tools' },
  ],
};

const DEFAULT_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Dashboard',
    description: 'A comprehensive analytics dashboard for online retailers featuring real-time data visualization and inventory management.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com',
    demoUrl: 'https://example.com',
    tags: ['React', 'D3.js', 'Node.js'],
  },
  {
    id: '2',
    title: 'AI Content Generator',
    description: 'An intelligent writing assistant powered by LLMs to help content creators brainstorm and draft articles faster.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com',
    tags: ['Python', 'FastAPI', 'OpenAI', 'React'],
  },
  {
    id: '3',
    title: 'TaskMaster Pro',
    description: 'A collaborative project management tool with Kanban boards, real-time updates, and team chat functionality.',
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com',
    tags: ['Vue.js', 'Firebase', 'Tailwind'],
  },
];

const DEFAULT_EXPERIENCE: Experience[] = [
  {
    id: '1',
    role: 'Senior Frontend Engineer',
    company: 'TechNova Solutions',
    period: '2021 - Present',
    description: 'Leading the frontend migration to React 18, implementing a design system, and mentoring junior developers. Improved site performance by 40%.',
  },
  {
    id: '2',
    role: 'Full Stack Developer',
    company: 'Creative Pulse Agency',
    period: '2019 - 2021',
    description: 'Built custom e-commerce solutions for high-profile clients using Next.js and Shopify. Integrated complex payment gateways and CRM systems.',
  },
  {
    id: '3',
    role: 'Junior Web Developer',
    company: 'StartUp Inc',
    period: '2018 - 2019',
    description: 'Collaborated on the core product team to develop responsive landing pages and maintain the company blog using WordPress and PHP.',
  }
];

// --- Internal Utilities ---

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 800; // Resize to max 800px width
        const scaleSize = maxWidth / img.width;
        const width = scaleSize < 1 ? maxWidth : img.width;
        const height = scaleSize < 1 ? img.height * scaleSize : img.height;

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
             reject(new Error("Could not get canvas context"));
             return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        // Compress to JPEG at 70% quality
        resolve(canvas.toDataURL('image/jpeg', 0.7)); 
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Sync Accessors (Legacy/Public View) ---
// These are kept synchronous for the public website to render instantly without loading states.

export const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EXPERIENCE)) {
    localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(DEFAULT_EXPERIENCE));
  }
};

export const getProfile = (): Profile => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
  return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
};

export const getProjects = (): Project[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return stored ? JSON.parse(stored) : DEFAULT_PROJECTS;
};

export const getExperiences = (): Experience[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.EXPERIENCE);
  return stored ? JSON.parse(stored) : DEFAULT_EXPERIENCE;
};

export const saveProfile = (profile: Profile) => {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
};

export const saveProjects = (projects: Project[]) => {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

export const saveExperiences = (experiences: Experience[]) => {
  localStorage.setItem(STORAGE_KEYS.EXPERIENCE, JSON.stringify(experiences));
};

// --- Async Backend Service (For Admin Dashboard) ---
// This simulates a real API interaction, separating Frontend logic from Backend data handling.

export const storageService = {
  async fetchProfile(): Promise<Profile> {
    await delay(300); // Simulate network latency
    return getProfile();
  },

  async updateProfile(profile: Profile): Promise<void> {
    await delay(600); // Simulate server processing
    try {
      saveProfile(profile);
    } catch (error: any) {
      if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
        throw new Error("Storage Limit Exceeded. Please use smaller images.");
      }
      throw error;
    }
  },

  async fetchSkills(): Promise<any> { 
    // In this simple structure, skills are part of profile, but we expose a method for the tab
    const profile = await this.fetchProfile();
    return profile.skills;
  },

  async fetchProjects(): Promise<Project[]> {
    await delay(300);
    return getProjects();
  },

  async updateProjects(projects: Project[]): Promise<void> {
    await delay(600);
    try {
      saveProjects(projects);
    } catch (error: any) {
      if (error.name === 'QuotaExceededError') throw new Error("Storage Limit Exceeded");
      throw error;
    }
  },

  async fetchExperiences(): Promise<Experience[]> {
    await delay(300);
    return getExperiences();
  },

  async updateExperiences(experiences: Experience[]): Promise<void> {
    await delay(600);
    try {
      saveExperiences(experiences);
    } catch (error: any) {
      if (error.name === 'QuotaExceededError') throw new Error("Storage Limit Exceeded");
      throw error;
    }
  },

  async uploadImage(file: File): Promise<string> {
    // Backend validation
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File is too large (Max 5MB)");
    }
    
    await delay(500); // Simulate upload time
    
    // Process image (Resize & Compress)
    try {
      const compressed = await compressImage(file);
      return compressed;
    } catch (e) {
      throw new Error("Failed to process image");
    }
  }
};
