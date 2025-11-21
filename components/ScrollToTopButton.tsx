
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-40 p-4 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 border border-indigo-400/20 transition-all duration-500 ease-out transform hover:-translate-y-2 hover:shadow-indigo-500/60 hover:bg-indigo-500 group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <ArrowUp size={24} className="relative z-10 group-hover:animate-pulse" />
      
      {/* Particle trail hint */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-0 bg-orange-400 blur-[2px] group-hover:h-4 transition-all duration-300 opacity-0 group-hover:opacity-80"></div>
    </button>
  );
};
