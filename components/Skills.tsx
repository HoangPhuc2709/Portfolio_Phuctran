import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Skill } from '../types';
import { Sparkles, Code, Database, Wrench, Cpu } from 'lucide-react';

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'frontend': return 'text-cyan-600 dark:text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)] dark:shadow-[0_0_15px_rgba(34,211,238,0.4)] border-cyan-400/50 dark:border-cyan-500/50 bg-cyan-50/50 dark:bg-cyan-950/30';
    case 'backend': return 'text-indigo-600 dark:text-indigo-300 shadow-[0_0_15px_rgba(129,140,248,0.2)] dark:shadow-[0_0_15px_rgba(129,140,248,0.4)] border-indigo-400/50 dark:border-indigo-500/50 bg-indigo-50/50 dark:bg-indigo-950/30';
    case 'tools': return 'text-purple-600 dark:text-purple-300 shadow-[0_0_15px_rgba(192,132,252,0.2)] dark:shadow-[0_0_15px_rgba(192,132,252,0.4)] border-purple-400/50 dark:border-purple-500/50 bg-purple-50/50 dark:bg-purple-950/30';
    default: return 'text-pink-600 dark:text-pink-300 shadow-[0_0_15px_rgba(244,114,182,0.2)] dark:shadow-[0_0_15px_rgba(244,114,182,0.4)] border-pink-400/50 dark:border-pink-500/50 bg-pink-50/50 dark:bg-pink-950/30';
  }
};

interface Tag {
  x: number;
  y: number;
  z: number;
  skill: Skill;
  opacity: number;
  scale: number;
}

export const Skills: React.FC<{ skills: Skill[] }> = ({ skills }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);

  // Group skills for the grid view
  const categories = {
    frontend: skills.filter(s => s.category === 'frontend'),
    backend: skills.filter(s => s.category === 'backend'),
    tools: skills.filter(s => s.category === 'tools'),
    other: skills.filter(s => s.category !== 'frontend' && s.category !== 'backend' && s.category !== 'tools'),
  };

  // Initial distribution of points on a sphere (Fibonacci Sphere)
  const initialTags = useMemo(() => {
    const tags: Tag[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < skills.length; i++) {
      const y = 1 - (i / (skills.length - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      tags.push({ x, y, z, skill: skills[i], opacity: 1, scale: 1 });
    }
    return tags;
  }, [skills]);

  const [tags, setTags] = useState<Tag[]>(initialTags);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      
      const distance = Math.sqrt(x*x + y*y);
      if (distance < 1.5) {
          mouseRef.current = { x, y };
          isHovering.current = true;
      } else {
          isHovering.current = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let currentRotationX = 0;
    let currentRotationY = 0;

    const animate = () => {
      const targetX = isHovering.current ? mouseRef.current.y * 0.02 : 0.002; 
      const targetY = isHovering.current ? mouseRef.current.x * 0.02 : -0.003;

      currentRotationX += (targetX - currentRotationX) * 0.05;
      currentRotationY += (targetY - currentRotationY) * 0.05;

      setRotation(prev => ({
        x: prev.x + currentRotationX,
        y: prev.y + currentRotationY
      }));

      setTags(prevTags => {
        return prevTags.map(tag => {
          let x = tag.x * Math.cos(currentRotationY) - tag.z * Math.sin(currentRotationY);
          let z = tag.z * Math.cos(currentRotationY) + tag.x * Math.sin(currentRotationY);
          let y = tag.y;

          let yNew = y * Math.cos(currentRotationX) - z * Math.sin(currentRotationX);
          let zNew = z * Math.cos(currentRotationX) + y * Math.sin(currentRotationX);
          y = yNew;
          z = zNew;

          const scale = (z + 2) / 3;
          const opacity = Math.max(0.1, (z + 1.5) / 2.5);

          return { ...tag, x, y, z, scale, opacity };
        });
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <section className="py-20 relative overflow-hidden min-h-[800px] flex flex-col items-center transition-colors duration-300">
      {/* Background hint */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05),transparent_70%)] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-white/50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 backdrop-blur-sm shadow-sm dark:shadow-none">
             <Sparkles size={16} className="text-indigo-500 dark:text-indigo-400 mr-2" />
             <span className="text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-widest">Technical Expertise</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
             Skill <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-500 dark:from-cyan-400 dark:to-indigo-400">Universe</span>
          </h2>
        </div>
        
        {/* 3D Scene Container */}
        <div 
            ref={containerRef}
            className="relative w-full max-w-[600px] aspect-square mx-auto flex items-center justify-center perspective-1000 mb-24"
        >
            <div className="relative w-full h-full transform-style-3d">
                {tags.map((tag, index) => {
                    const r = 260; 
                    const left = `calc(50% + ${tag.x * r}px)`;
                    const top = `calc(50% + ${tag.y * r}px)`;
                    const zIndex = Math.round(tag.z * 100);

                    return (
                        <div
                            key={index}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-full border backdrop-blur-md transition-colors duration-300 cursor-default whitespace-nowrap ${getCategoryColor(tag.skill.category)}`}
                            style={{
                                left,
                                top,
                                opacity: tag.opacity,
                                transform: `scale(${tag.scale})`,
                                zIndex: zIndex,
                                filter: `blur(${(1 - tag.scale) * 4}px)`,
                            }}
                        >
                            <span className="font-bold text-sm md:text-lg tracking-wide">{tag.skill.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Detailed Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto animate-slide-up">
            {/* Frontend Column */}
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-cyan-400/50 dark:hover:border-cyan-500/30 transition-colors group hover:-translate-y-1 duration-300 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="p-3 rounded-lg bg-cyan-100/50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-shadow"><Code size={24}/></div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Frontend</h3>
                      <p className="text-xs text-slate-500">UI & Interaction</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.frontend.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-md bg-cyan-50 dark:bg-cyan-950/10 border border-cyan-200 dark:border-cyan-500/10 text-cyan-700 dark:text-cyan-200 text-sm font-medium hover:bg-cyan-100 dark:hover:bg-cyan-950/30 hover:border-cyan-300 dark:hover:border-cyan-500/30 transition-colors">
                            {skill.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Backend Column */}
             <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-indigo-400/50 dark:hover:border-indigo-500/30 transition-colors group hover:-translate-y-1 duration-300 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="p-3 rounded-lg bg-indigo-100/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 group-hover:shadow-[0_0_15px_rgba(129,140,248,0.2)] transition-shadow"><Database size={24}/></div>
                     <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Backend</h3>
                      <p className="text-xs text-slate-500">Server & Logic</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.backend.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/10 border border-indigo-200 dark:border-indigo-500/10 text-indigo-700 dark:text-indigo-200 text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-950/30 hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors">
                            {skill.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Tools Column */}
             <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-purple-400/50 dark:hover:border-purple-500/30 transition-colors group hover:-translate-y-1 duration-300 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="p-3 rounded-lg bg-purple-100/50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 group-hover:shadow-[0_0_15px_rgba(192,132,252,0.2)] transition-shadow"><Wrench size={24}/></div>
                     <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Tools</h3>
                      <p className="text-xs text-slate-500">DevOps & Utilities</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.tools.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-md bg-purple-50 dark:bg-purple-950/10 border border-purple-200 dark:border-purple-500/10 text-purple-700 dark:text-purple-200 text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-950/30 hover:border-purple-300 dark:hover:border-purple-500/30 transition-colors">
                            {skill.name}
                        </span>
                    ))}
                    {categories.other.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-md bg-pink-50 dark:bg-pink-950/10 border border-pink-200 dark:border-pink-500/10 text-pink-700 dark:text-pink-200 text-sm font-medium hover:bg-pink-100 dark:hover:bg-pink-950/30 hover:border-pink-300 dark:hover:border-pink-500/30 transition-colors">
                            {skill.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};