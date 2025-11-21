
import React from 'react';

export const TechMarquee: React.FC = () => {
  const techs = [
    "React", "TypeScript", "Node.js", "Next.js", "Tailwind CSS", "GraphQL", "PostgreSQL", "Docker", 
    "AWS", "Figma", "Three.js", "Python", "Golang", "Redis", "Kubernetes", "Prisma"
  ];

  return (
    <div className="w-full bg-slate-950/50 border-y border-slate-800/50 py-6 overflow-hidden relative z-20 backdrop-blur-sm">
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-950 to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-950 to-transparent z-10"></div>
      
      <div className="flex w-max">
        <div className="flex animate-marquee whitespace-nowrap">
          {techs.map((tech, index) => (
            <span 
              key={index} 
              className="mx-8 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-slate-400 to-slate-600 opacity-50 hover:opacity-100 transition-opacity cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="flex animate-marquee whitespace-nowrap" aria-hidden="true">
          {techs.map((tech, index) => (
            <span 
              key={`dup-${index}`} 
              className="mx-8 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-slate-400 to-slate-600 opacity-50 hover:opacity-100 transition-opacity cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
