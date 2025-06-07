import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Crown, Sword, Shield, Zap, Users, Trophy, Star, Sparkles, Target, Flame, Lock } from 'lucide-react';
import * as THREE from 'three';

export default function HomeSLZ() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState(0);
  const [hologramRotation, setHologramRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll();
  
  // Transformations basées sur le scroll
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

  // Animation 3D holographique
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Création du logo S.L.Z en 3D
    const textGeometry = new THREE.ConeGeometry(2, 4, 6);
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 }),
      new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.6 }),
      new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.7 }),
    ];

    const logoGroup = new THREE.Group();
    
    // Trois cônes pour former "S.L.Z"
    for (let i = 0; i < 3; i++) {
      const cone = new THREE.Mesh(textGeometry, materials[i]);
      cone.position.x = (i - 1) * 3;
      cone.rotation.z = Math.PI;
      logoGroup.add(cone);
    }

    scene.add(logoGroup);

    // Particules orbitales
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 8 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.cos(phi);
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const color = new THREE.Color();
      color.setHSL((i / particleCount) * 0.3 + 0.5, 1, 0.8);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    camera.position.z = 15;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      logoGroup.rotation.y += 0.01;
      logoGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
      
      particles.rotation.y += 0.005;
      particles.rotation.x += 0.002;
      
      setHologramRotation(prev => prev + 1);
      
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  const guildStats = [
    { icon: Crown, label: "Rang Elite", value: "Diamant", color: "from-cyan-400 to-blue-600" },
    { icon: Users, label: "Membres Actifs", value: "1,247", color: "from-purple-400 to-pink-600" },
    { icon: Trophy, label: "Victoires", value: "8,429", color: "from-yellow-400 to-orange-600" },
    { icon: Target, label: "Précision", value: "94.7%", color: "from-green-400 to-emerald-600" },
  ];

  const achievements = [
    { title: "Maître Tacticien", description: "500 stratégies gagnantes", icon: Sword, unlocked: true },
    { title: "Garde Elite", description: "Protection parfaite 100 fois", icon: Shield, unlocked: true },
    { title: "Foudre de Guerre", description: "Victoire en moins de 2 minutes", icon: Zap, unlocked: false },
    { title: "Légende Immortelle", description: "Série de 50 victoires", icon: Flame, unlocked: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Canvas 3D Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: 'transparent' }}
      />

      {/* Grille holographique */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{
          background: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          y: yBg,
          opacity,
        }}
      />

      {/* Contenu principal */}
      <div className="relative z-20 min-h-screen">
        {/* Section Hero */}
        <section className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="mb-8"
            >
              <motion.h1
                className="text-8xl md:text-9xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              >
                S.L.Z
              </motion.h1>
              
              <motion.div
                className="text-3xl md:text-4xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                GUILD D'ÉLITE
              </motion.div>
              
              <motion.p
                className="text-xl text-gray-300 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Forgez votre légende dans l'arène des champions
              </motion.p>
            </motion.div>

            {/* Badge de bienvenue personnalisé */}
            <AnimatePresence>
              {user && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateX: 90 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mb-8"
                >
                  <Badge className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-6 py-3 text-lg font-bold shadow-2xl">
                    <Crown className="w-5 h-5 mr-2" />
                    Bienvenue, {user.firstName} {user.lastName}
                    <Sparkles className="w-5 h-5 ml-2" />
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats de la guild */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {guildStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(6, 182, 212, 0.3)"
                  }}
                  initial={{ opacity: 0, rotateY: -90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                >
                  <motion.div
                    className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mb-4 mx-auto`}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Section Achievements */}
        <section className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-6xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4">
                HAUTS FAITS
              </h2>
              <p className="text-xl text-gray-300">
                Votre progression vers la gloire éternelle
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  className={`relative bg-black/40 backdrop-blur-xl border rounded-2xl p-8 ${
                    achievement.unlocked 
                      ? 'border-yellow-500/50 shadow-yellow-500/20' 
                      : 'border-gray-600/30'
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: achievement.unlocked 
                      ? "0 0 40px rgba(234, 179, 8, 0.3)"
                      : "0 0 20px rgba(75, 85, 99, 0.3)"
                  }}
                >
                  {achievement.unlocked && (
                    <motion.div
                      className="absolute top-4 right-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Star className="w-8 h-8 text-yellow-400 fill-current" />
                    </motion.div>
                  )}
                  
                  <div className="flex items-center mb-4">
                    <motion.div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${
                        achievement.unlocked
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          : 'bg-gradient-to-r from-gray-600 to-gray-700'
                      }`}
                      animate={achievement.unlocked ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <achievement.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <div>
                      <h3 className={`text-2xl font-bold ${
                        achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className="text-gray-300">{achievement.description}</p>
                    </div>
                  </div>
                  
                  {!achievement.unlocked && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <motion.div
                        className="text-center"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Lock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <span className="text-gray-400 font-semibold">VERROUILLÉ</span>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Call to Action */}
        <section className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <motion.h2
              className="text-6xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-8"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              PRÊT POUR LA BATAILLE ?
            </motion.h2>
            
            <p className="text-2xl text-gray-300 mb-12">
              Rejoignez l'élite et gravez votre nom dans l'histoire
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-2xl">
                  <Sword className="w-6 h-6 mr-2" />
                  ENTRER EN BATAILLE
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-bold py-4 px-8 rounded-xl text-lg">
                  <Users className="w-6 h-6 mr-2" />
                  VOIR LES MEMBRES
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Effet de scan holographique */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none"
        animate={{
          background: [
            'linear-gradient(0deg, transparent 0%, rgba(0,255,255,0.1) 50%, transparent 100%)',
            'linear-gradient(180deg, transparent 0%, rgba(0,255,255,0.1) 50%, transparent 100%)',
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}