import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Crown, Star, Trophy, Award, Heart, Code, Palette
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Credits() {
  const [particleSystem, setParticleSystem] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number}>>([]);
  
  const headerRef = useRef(null);
  const teamRef = useRef(null);

  const headerInView = useInView(headerRef, { once: true });
  const teamInView = useInView(teamRef, { once: true });

  // Configuration des membres
  const team = [
    {
      name: "Yuki (SK)",
      role: "Fondateur & Leader Suprême",
      description: "Architecte visionnaire de l'empire Black Heart. Stratège de génie qui transforme les rêves en réalité numérique.",
      avatar: "/images/c786865f8dbe2ceef9765401efa8bf37_1749300622642.jpeg",
      specialties: ["Leadership", "Stratégie", "Vision", "Innovation"],
      achievements: ["Fondation Black Heart", "1000+ Membres", "Empire Gaming", "Légende Vivante"],
      color: "from-yellow-400 via-orange-500 to-red-500",
      borderColor: "border-yellow-500",
      textColor: "text-yellow-400"
    },
    {
      name: "404",
      role: "Architecte Digital & Admin Suprême",
      description: "Maître de la technologie, sculpteur du code, gardien de l'infrastructure numérique de Black Heart.",
      avatar: "/images/IMG_8086_1749300622645.jpeg",
      specialties: ["Développement Web", "Administration", "Architecture", "Innovation"],
      achievements: ["Site Web Elite", "Infrastructure Solide", "Code Parfait", "Magie Digitale"],
      color: "from-cyan-400 via-blue-500 to-purple-600",
      borderColor: "border-cyan-500",
      textColor: "text-cyan-400"
    }
  ];

  // Système de particules
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      }));
      setParticleSystem(newParticles);
    };

    generateParticles();
    const particleInterval = setInterval(generateParticles, 5000);

    return () => {
      clearInterval(particleInterval);
    };
  }, []);

  useEffect(() => {
    const animateParticles = () => {
      setParticleSystem(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vx: particle.x <= 0 || particle.x >= window.innerWidth ? -particle.vx : particle.vx,
        vy: particle.y <= 0 || particle.y >= window.innerHeight ? -particle.vy : particle.vy
      })));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      
      {/* Système de particules */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particleSystem.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: particle.x,
              top: particle.y,
            }}
            animate={{
              scale: [0.5, 1, 0.5],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Fond dégradé */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-cyan-900/20" />
        <div className="absolute inset-0 bg-gradient-to-l from-pink-900/10 via-transparent to-blue-900/10" />
      </div>

      {/* En-tête */}
      <motion.section
        ref={headerRef}
        initial="hidden"
        animate={headerInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="relative z-10 pt-32 pb-20"
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            variants={itemVariants}
            className="mb-12"
          >
            <motion.div
              className="inline-block relative"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-400 via-violet-500 to-purple-600 rounded-full flex items-center justify-center mb-8 relative">
                <Crown className="w-16 h-16 text-white" />
                
                {/* Anneaux orbitaux */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute border-2 rounded-full"
                    style={{
                      width: `${150 + i * 30}px`,
                      height: `${150 + i * 30}px`,
                      borderColor: ['#8B5CF6', '#A855F7', '#EC4899'][i],
                      top: `${-15 - i * 15}px`,
                      left: `${-15 - i * 15}px`
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 5 + i * 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      style={{ backgroundColor: ['#8B5CF6', '#A855F7', '#EC4899'][i] }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-purple-400 via-violet-500 to-purple-600 bg-clip-text text-transparent"
            >
              HALL OF FAME
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-2xl md:text-3xl text-white font-bold mb-8 tracking-wide"
            >
              LES LÉGENDES DE BLACK HEART
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="flex justify-center space-x-4"
            >
              {[Crown, Star, Trophy, Award].map((Icon, index) => (
                <motion.div
                  key={index}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2 + index * 0.5,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                  className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                >
                  <Icon className="w-8 h-8 text-purple-400" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Section Équipe */}
      <motion.section
        ref={teamRef}
        initial="hidden"
        animate={teamInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="relative z-10 py-20"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-purple-500 to-violet-600 bg-clip-text text-transparent">
              LES FONDATEURS
            </h2>
            <p className="text-xl text-white font-semibold">Les piliers de notre empire</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <Card className={`bg-black/50 backdrop-blur-xl ${member.borderColor}/30 overflow-hidden h-full relative`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${member.color}/10 group-hover:${member.color}/20 transition-all duration-500`} />
                  
                  <CardHeader className="relative z-10 text-center p-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotateY: 15 }}
                      className="relative mx-auto mb-6"
                    >
                      <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${member.borderColor} shadow-2xl mx-auto`}>
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <motion.div
                        className={`absolute inset-0 rounded-full border-2 ${member.borderColor.replace('border-', 'border-')}`}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                    
                    <motion.h3
                      className={`text-4xl font-black mb-2 bg-gradient-to-r ${member.color} bg-clip-text text-transparent`}
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {member.name}
                    </motion.h3>
                    <p className={`text-xl ${member.textColor} mb-4 font-bold`}>{member.role}</p>
                    <p className="text-white/80 mb-6 text-lg leading-relaxed">{member.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {member.specialties.map((specialty, specIndex) => (
                        <motion.div
                          key={specialty}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: specIndex * 0.1 }}
                          className={`bg-gradient-to-r ${member.color}/20 rounded-lg p-3 text-center border ${member.borderColor}/30`}
                        >
                          <p className={`text-sm font-semibold ${member.textColor}`}>{specialty}</p>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {member.achievements.map((achievement, achIndex) => (
                        <motion.div
                          key={achievement}
                          whileHover={{ scale: 1.05 }}
                          className={`bg-gradient-to-r ${member.color}/10 rounded-lg p-3 text-center border ${member.borderColor}/20`}
                        >
                          <Trophy className={`w-6 h-6 ${member.textColor} mx-auto mb-2`} />
                          <p className="text-xs font-medium text-white/80">{achievement}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer de remerciements */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 py-20 text-center"
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            variants={itemVariants}
            className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-12"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mb-8"
            >
              <Heart className="w-16 h-16 text-red-400 mx-auto" />
            </motion.div>
            
            <h3 className="text-4xl font-black mb-6 bg-gradient-to-r from-red-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              MERCI À TOUS
            </h3>
            
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              Chaque membre de Black Heart contribue à notre grandeur. 
              Ensemble, nous écrivons l'histoire du gaming compétitif.
            </p>
            
            <motion.div
              className="text-3xl font-black bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-transparent"
              animate={{
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              BLACK HEART FOREVER
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}