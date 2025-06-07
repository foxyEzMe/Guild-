import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, HelpCircle, Home, Search, Zap, Star, Crown, Sparkles, Target, Eye } from "lucide-react";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, color: string, size: number}>>([]);
  const [glitchEffect, setGlitchEffect] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Génération de particules colorées
  useEffect(() => {
    const generateParticles = () => {
      const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#EF4444', '#84CC16'];
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 3000);
    return () => clearInterval(interval);
  }, []);

  // Effet de glitch périodique
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 4000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden">
      
      {/* Fond avec dégradés colorés dynamiques */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, rgba(139,92,246,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6,182,212,0.3) 0%, transparent 50%), radial-gradient(circle at 40% 60%, rgba(16,185,129,0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(236,72,153,0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(245,158,11,0.3) 0%, transparent 50%), radial-gradient(circle at 60% 40%, rgba(239,68,68,0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(132,204,22,0.3) 0%, transparent 50%), radial-gradient(circle at 10% 90%, rgba(139,92,246,0.3) 0%, transparent 50%), radial-gradient(circle at 90% 10%, rgba(6,182,212,0.3) 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Particules colorées flottantes */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ 
                x: `${particle.x}%`, 
                y: `${particle.y}%`, 
                scale: 0, 
                opacity: 0 
              }}
              animate={{ 
                x: `${particle.x + 20}%`,
                y: `${particle.y - 30}%`,
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
                rotate: [0, 360]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 4, ease: "easeOut" }}
              className="absolute rounded-full"
              style={{ 
                width: particle.size,
                height: particle.size,
                background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
                boxShadow: `0 0 15px ${particle.color}`
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Image 404 colorée */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/attached_assets/IMG_8086_1749298069218.jpeg" 
          className="w-full h-full object-cover opacity-20" 
          alt="404 Background" 
        />
      </div>
      
      <div className="container relative z-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Grand 404 avec effet de glitch */}
            <motion.h1 
              className={`text-[12rem] md:text-[16rem] leading-none font-black select-none relative ${
                glitchEffect ? 'animate-pulse' : ''
              }`}
              style={{ 
                background: 'linear-gradient(45deg, #8B5CF6, #06B6D4, #10B981, #F59E0B, #EC4899, #EF4444)',
                backgroundSize: '400% 400%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 0 50px rgba(139,92,246,0.5)',
                filter: glitchEffect ? 'hue-rotate(180deg) contrast(150%)' : 'none'
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              404
              
              {/* Effet de scan */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 3,
                  ease: "easeInOut" 
                }}
              />
            </motion.h1>
            
            {/* Titre et description */}
            <motion.div 
              className="mt-[-4rem] mb-12 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.h2 
                className="text-4xl md:text-7xl font-black mb-6 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent"
                style={{ 
                  textShadow: 'none',
                  filter: 'none'
                }}
                animate={{ 
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                ZONE INTERDITE
              </motion.h2>
              
              <motion.p 
                className="text-xl md:text-2xl text-white font-bold max-w-2xl mx-auto leading-relaxed"
                style={{ 
                  textShadow: '0 0 10px rgba(255,255,255,0.3)',
                  filter: 'none'
                }}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Cette page a été absorbée dans une autre dimension !
                <br />
                <span className="text-lg text-white/80">Retournez au QG principal pour continuer votre mission.</span>
              </motion.p>
            </motion.div>
            
            {/* Boutons d'action avec effets spectaculaires */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold px-8 py-4 text-lg rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden group">
                    {/* Effet de particules sur hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <motion.span 
                      className="relative z-10 flex items-center gap-3"
                      style={{ textShadow: 'none', filter: 'none' }}
                    >
                      <motion.span
                        animate={{ rotate: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Home className="w-6 h-6" />
                      </motion.span>
                      QG Principal
                    </motion.span>
                  </Button>
                </motion.div>
              </Link>
              
              <Link href="/members">
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-8 py-4 text-lg rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <motion.span 
                      className="relative z-10 flex items-center gap-3"
                      style={{ textShadow: 'none', filter: 'none' }}
                    >
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Search className="w-6 h-6" />
                      </motion.span>
                      Explorer
                    </motion.span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Icônes flottantes colorées */}
            <motion.div 
              className="mt-16 flex justify-center space-x-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              {[
                { icon: Zap, color: '#F59E0B', delay: 0 },
                { icon: Star, color: '#EC4899', delay: 0.2 },
                { icon: Crown, color: '#8B5CF6', delay: 0.4 },
                { icon: Sparkles, color: '#06B6D4', delay: 0.6 },
                { icon: Target, color: '#10B981', delay: 0.8 },
                { icon: Eye, color: '#EF4444', delay: 1 }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={index}
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 3 + index * 0.5,
                      repeat: Infinity,
                      delay: item.delay
                    }}
                    className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20"
                    style={{
                      boxShadow: `0 0 25px ${item.color}60`
                    }}
                  >
                    <IconComponent 
                      className="w-8 h-8" 
                      style={{ color: item.color }}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Lignes de scan horizontales */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-30"
        animate={{ opacity: [0, 0.1, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{ top: `${i * 5}%` }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{
              duration: 2 + i * 0.1,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
