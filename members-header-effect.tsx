import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useThemeCustomization } from '@/contexts/ThemeCustomizationContext';

export function MembersHeaderEffect() {
  const { theme } = useThemeCustomization();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    speed: number;
  }[]>([]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Initialisation des particules
    const colors = [theme.primaryColor, theme.secondaryColor, theme.accentColor];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 0.2 + 0.1,
    }));
    setParticles(newParticles);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [theme]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: (particle.x + particle.speed) % 100,
          y: (particle.y + particle.speed * 0.5) % 100,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden z-0 pointer-events-none"
    >
      {/* Glow effect that follows mouse */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full filter blur-[80px] opacity-30"
        animate={{
          x: mousePosition.x ? `calc(${mousePosition.x}% - 300px)` : '-300px',
          y: mousePosition.y ? `calc(${mousePosition.y}% - 300px)` : '-300px',
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 200,
        }}
        style={{
          background: `radial-gradient(circle, ${theme.primaryColor}, transparent 70%)`,
        }}
      />

      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Scanning line effect */}
      <motion.div
        className="absolute left-0 top-0 w-full h-[2px] bg-gradient-to-r"
        style={{
          backgroundImage: `linear-gradient(to right, transparent, ${theme.accentColor}, transparent)`,
        }}
        animate={{
          top: ['0%', '100%'],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Grid lines for cyber effect */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] opacity-20"></div>
      
      {/* Radial gradient overlay */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    </div>
  );
}