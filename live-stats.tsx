import { useQuery } from '@tanstack/react-query';
import { Users, Zap, Trophy, Activity, Crown, Sparkles, Shield, Target, Flame, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { fetchServerStats } from '@/lib/discord-api';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function LiveStats() {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, color: string}>>([]);
  const [pulseEffect, setPulseEffect] = useState(false);
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/discord/stats'],
    queryFn: fetchServerStats,
    refetchInterval: 30000, // Actualise toutes les 30 secondes
  });

  // Effet de pulsation périodique
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseEffect(true);
      setTimeout(() => setPulseEffect(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Génération de particules
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EC4899'][Math.floor(Math.random() * 5)]
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 8000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.2 }}
          >
            <Card className="bg-black/60 backdrop-blur-xl border-violet-500/20 relative overflow-hidden">
              <CardContent className="p-6 text-center relative">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-r from-violet-500/30 to-purple-600/30 rounded-full mx-auto mb-4 flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <Sparkles className="w-8 h-8 text-violet-400" />
                </motion.div>
                <div className="h-8 bg-violet-500/20 rounded-xl mb-2 animate-pulse"></div>
                <div className="h-4 bg-violet-500/10 rounded-lg animate-pulse"></div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  const statsConfig = [
    {
      title: 'Membres Total',
      value: stats?.totalMembers || '0',
      icon: Users,
      gradient: 'from-violet-500 via-purple-600 to-indigo-700',
      color: '#8B5CF6',
      bgGlow: 'from-violet-500/20 via-purple-600/10 to-indigo-700/5',
      particle: '👥',
      description: 'Guerriers inscrits'
    },
    {
      title: 'En Ligne',
      value: stats?.onlineMembers || '0',
      icon: Activity,
      gradient: 'from-emerald-500 via-green-600 to-teal-700',
      color: '#10B981',
      bgGlow: 'from-emerald-500/20 via-green-600/10 to-teal-700/5',
      particle: '⚡',
      description: 'Actifs maintenant'
    },
    {
      title: 'Guilde Elite',
      value: '#1',
      icon: Trophy,
      gradient: 'from-amber-500 via-yellow-600 to-orange-700',
      color: '#F59E0B',
      bgGlow: 'from-amber-500/20 via-yellow-600/10 to-orange-700/5',
      particle: '🏆',
      description: 'Rang mondial'
    }
  ];

  return (
    <div className="relative">
      {/* Particules de fond */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
                opacity: [0, 0.6, 0]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 4, ease: "easeOut" }}
              className="absolute w-1 h-1 rounded-full"
              style={{ 
                background: particle.color,
                boxShadow: `0 0 10px ${particle.color}`
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, staggerChildren: 0.2 }}
      >
        {statsConfig.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="group cursor-pointer"
            >
              <Card className="bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/20 relative overflow-hidden h-full">
                {/* Effet de fond animé */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGlow} opacity-50 group-hover:opacity-80 transition-all duration-500`} />
                
                {/* Effet de scan */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 3,
                    ease: "easeInOut" 
                  }}
                />

                {/* Lueur sur hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at center, ${stat.color}20 0%, transparent 70%)`,
                    filter: 'blur(20px)'
                  }}
                />

                <CardContent className="p-6 text-center relative z-10">
                  {/* Icône avec animations spectaculaires */}
                  <motion.div
                    className="relative mx-auto mb-4 w-20 h-20"
                    animate={pulseEffect ? { 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    } : {}}
                    transition={{ duration: 0.8 }}
                  >
                    <motion.div 
                      className={`w-full h-full bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:shadow-2xl transition-all duration-500`}
                      style={{ 
                        boxShadow: `0 0 30px ${stat.color}40`
                      }}
                      animate={{ 
                        rotate: [0, 360],
                      }}
                      transition={{ 
                        duration: 20, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                    >
                      <IconComponent className="w-10 h-10 text-white relative z-10" />
                      
                      {/* Anneaux orbitaux */}
                      {[1, 2].map((ring, i) => (
                        <motion.div
                          key={ring}
                          className="absolute border rounded-full"
                          style={{
                            width: `${100 + i * 20}%`,
                            height: `${100 + i * 20}%`,
                            borderColor: `${stat.color}40`,
                            borderWidth: '1px'
                          }}
                          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                          transition={{
                            duration: 8 + i * 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        >
                          <div
                            className="w-2 h-2 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            style={{ backgroundColor: stat.color }}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>

                  {/* Valeur avec effet de glow */}
                  <motion.div
                    className="text-5xl font-black mb-2 relative"
                    style={{ 
                      color: stat.color,
                      textShadow: `0 0 20px ${stat.color}60, 0 0 40px ${stat.color}40`
                    }}
                    animate={pulseEffect ? { 
                      scale: [1, 1.1, 1],
                      textShadow: [
                        `0 0 20px ${stat.color}60, 0 0 40px ${stat.color}40`,
                        `0 0 30px ${stat.color}80, 0 0 60px ${stat.color}60`,
                        `0 0 20px ${stat.color}60, 0 0 40px ${stat.color}40`
                      ]
                    } : {}}
                    transition={{ duration: 0.8 }}
                  >
                    {stat.value}
                    
                    {/* Particule emoji flottante */}
                    <motion.span
                      className="absolute -top-2 -right-2 text-xl"
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                    >
                      {stat.particle}
                    </motion.span>
                  </motion.div>

                  {/* Titre avec texte flou stylé */}
                  <motion.div
                    className="space-y-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <h3 className="text-white font-bold text-lg tracking-wide filter drop-shadow-lg">
                      {stat.title}
                    </h3>
                    <p className="text-white/60 text-sm font-medium">
                      {stat.description}
                    </p>
                  </motion.div>

                  {/* Barre de progression décorative */}
                  <motion.div
                    className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: index * 0.3, duration: 1 }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ 
                        background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`
                      }}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ 
                        delay: index * 0.3 + 0.5, 
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        repeatDelay: 2
                      }}
                    />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}