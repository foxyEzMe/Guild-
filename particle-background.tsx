import { useEffect, useRef, useState } from 'react';

export function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);
  
  // Initialize the advanced particle system
  useEffect(() => {
    if (!containerRef.current || initialized) return;
    
    const container = containerRef.current;
    const createAdvancedParticles = () => {
      // Clear any existing particles first
      const existingParticles = container.querySelectorAll('.advanced-particle');
      existingParticles.forEach(particle => particle.remove());
      
      // Create 80 advanced particles
      for (let i = 0; i < 80; i++) {
        const particle = document.createElement('div');
        particle.className = 'advanced-particle';
        
        // Random particle size - smaller for more natural look
        const size = Math.random() * 2 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation duration and delay
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 10;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        // Random opacity
        particle.style.opacity = (Math.random() * 0.6 + 0.3).toString();
        
        // Random color - mostly violet shades
        const hue = Math.random() * 40 + 250; // 250-290 = violet range
        const saturation = Math.random() * 30 + 70; // 70-100% saturation
        const lightness = Math.random() * 30 + 50; // 50-80% lightness
        particle.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        particle.style.boxShadow = `0 0 ${size * 3}px hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        container.appendChild(particle);
      }
    };
    
    createAdvancedParticles();
    setInitialized(true);
    
    // Recreate particles on window resize
    const handleResize = () => {
      createAdvancedParticles();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [initialized]);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0" ref={containerRef}>
      {/* Futuristic Cyber Grid Background */}
      <div className="cyber-grid opacity-20"></div>
      
      {/* Dark Matrix Background */}
      <div className="absolute inset-0 bg-black opacity-90"></div>
      
      {/* Matrix Code Effect */}
      <div className="matrix-code absolute inset-0 opacity-15"></div>
      
      {/* Digital Noise Overlay */}
      <div className="digital-noise absolute inset-0 opacity-5"></div>
      
      {/* Violet Spectrum Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
        <div className="absolute -inset-[10%] bg-gradient-radial from-violet-600/20 via-violet-900/10 to-transparent blur-3xl"></div>
        <div className="absolute -inset-[20%] bg-gradient-radial from-indigo-500/10 via-purple-800/5 to-transparent blur-3xl animate-pulse-slow" style={{ animationDuration: '8s' }}></div>
      </div>
      
      {/* Enhanced Ambient Light Effects */}
      <div className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] bg-neon-purple/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[25vw] h-[25vw] bg-neon-violet/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-1/2 right-1/3 w-[20vw] h-[20vw] bg-electric-blue/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      
      {/* Horizontal light beam */}
      <div className="absolute top-1/3 -left-40 h-[1px] w-screen bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent animate-pulse-slow"></div>
      <div className="absolute top-2/3 -right-40 h-[1px] w-screen bg-gradient-to-l from-transparent via-neon-violet/40 to-transparent animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      {/* Vertical light beam */}
      <div className="absolute -top-40 left-1/3 w-[1px] h-screen bg-gradient-to-b from-transparent via-electric-blue/30 to-transparent animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      <div className="absolute -bottom-40 right-2/3 w-[1px] h-screen bg-gradient-to-t from-transparent via-neon-cyan/20 to-transparent animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
    </div>
  );
}
