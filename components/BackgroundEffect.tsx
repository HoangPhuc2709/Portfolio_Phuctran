import React, { useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';

export const BackgroundEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 }); // Start off-screen
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let resizeTimeout: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      baseAlpha: number;
    }> = [];

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        mouse.current.x = event.touches[0].clientX;
        mouse.current.y = event.touches[0].clientY;
      }
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    const initParticles = () => {
      if (!canvas) return;
      const particleCount = Math.min(window.innerWidth / 10, 150); 
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 2 + 0.5;
        const isLight = theme === 'light';
        // Blue for Light mode, Indigo for Dark mode
        const r = isLight ? 59 : 99;
        const g = isLight ? 130 : 102;
        const b = isLight ? 246 : 241;
        
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: size,
          baseAlpha: Math.random() * 0.5 + 0.1,
          color: `rgb(${r}, ${g}, ${b})` 
        });
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Debounce resize to improve performance
    const handleResize = () => {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        resizeCanvas();
      }, 200);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        // Physics: Move particles
        p.x += p.vx;
        p.y += p.vy;

        // Physics: Mouse Repulsion/Attraction
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 150;

        if (distance < maxDist) {
          const force = (maxDist - distance) / maxDist; // 0 to 1
          const angle = Math.atan2(dy, dx);
          
          // Gentle push away from mouse
          const pushForce = 0.5;
          p.vx -= Math.cos(angle) * force * pushForce;
          p.vy -= Math.sin(angle) * force * pushForce;
        }

        // Friction to stabilize speed
        const maxSpeed = 2;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > maxSpeed) {
           p.vx *= 0.95;
           p.vy *= 0.95;
        }
        
        // Keep minimal movement
        if (Math.abs(p.vx) < 0.1) p.vx += (Math.random() - 0.5) * 0.01;
        if (Math.abs(p.vy) < 0.1) p.vy += (Math.random() - 0.5) * 0.01;

        // Wrap around screen
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw Particle
        ctx.fillStyle = `rgba(${p.color.match(/\d+/g)?.join(',')}, ${p.baseAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Constellation Effect: Connect to mouse
        if (distance < 180) {
          ctx.beginPath();
          // Line color matches particle color
          ctx.strokeStyle = p.color.replace('rgb', 'rgba').replace(')', `, ${0.2 * (1 - distance / 180)})`);
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.current.x, mouse.current.y);
          ctx.stroke();
        }
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };

    resizeCanvas(); // Initial resize
    draw();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};