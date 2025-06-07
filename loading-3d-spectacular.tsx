import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Sparkles, Shield, Crown, Zap, Target, Gamepad2 } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
  onComplete: () => void;
  message?: string;
}

export function Loading3DSpectacular({ isLoading, onComplete, message = "BLACK HEART - ELITE GAMING LEGION" }: LoadingScreenProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const geometriesRef = useRef<THREE.Mesh[]>([]);
  const animationIdRef = useRef<number>();
  
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [loadingText, setLoadingText] = useState("INITIALISATION SYSTÈME");
  const [showLogo, setShowLogo] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, opacity: number}>>([]);

  const loadingPhases = [
    { text: "INITIALISATION SYSTÈME", duration: 800 },
    { text: "CONNEXION AU SERVEUR DISCORD", duration: 600 },
    { text: "CHARGEMENT DES RESSOURCES", duration: 700 },
    { text: "SYNCHRONISATION DES DONNÉES", duration: 500 },
    { text: "OPTIMISATION DE L'INTERFACE", duration: 400 },
    { text: "FINALISATION", duration: 300 }
  ];

  // Initialisation de la scène 3D
  useEffect(() => {
    if (!mountRef.current || !isLoading) return;

    // Création de la scène
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Caméra
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Création des géométries animées
    createGeometries();

    // Animation principale
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

      // Rotation des géométries
      geometriesRef.current.forEach((mesh, index) => {
        mesh.rotation.x += 0.01 + index * 0.005;
        mesh.rotation.y += 0.015 + index * 0.003;
        mesh.rotation.z += 0.008 + index * 0.002;
        
        // Mouvement orbital
        const time = Date.now() * 0.001;
        mesh.position.x = Math.cos(time + index) * (3 + index);
        mesh.position.y = Math.sin(time + index * 0.5) * (2 + index * 0.5);
        mesh.position.z = Math.sin(time * 0.5 + index) * (1 + index * 0.3);
      });

      // Rotation de la caméra
      const time = Date.now() * 0.0005;
      cameraRef.current.position.x = Math.cos(time) * 0.5;
      cameraRef.current.position.y = Math.sin(time * 0.7) * 0.3;
      cameraRef.current.lookAt(0, 0, 0);

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isLoading]);

  // Création des géométries 3D
  const createGeometries = () => {
    if (!sceneRef.current) return;

    const geometries = [
      // Cube central avec matériau holographique
      new THREE.BoxGeometry(2, 2, 2),
      // Tétraèdre
      new THREE.TetrahedronGeometry(1.5),
      // Octaèdre
      new THREE.OctahedronGeometry(1.2),
      // Dodécaèdre
      new THREE.DodecahedronGeometry(1),
      // Icosaèdre
      new THREE.IcosahedronGeometry(0.8)
    ];

    const colors = [
      0x00d4ff, // Cyan
      0xff6b35, // Orange
      0x00ff88, // Vert
      0xff3d71, // Rose
      0xffd700  // Or
    ];

    geometries.forEach((geometry, index) => {
      // Matériau avec effet holographique
      const material = new THREE.MeshPhongMaterial({
        color: colors[index],
        transparent: true,
        opacity: 0.8,
        wireframe: index % 2 === 0,
        emissive: colors[index],
        emissiveIntensity: 0.2
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      
      sceneRef.current?.add(mesh);
      geometriesRef.current.push(mesh);
    });

    // Éclairage dynamique
    const light1 = new THREE.PointLight(0x00d4ff, 1, 100);
    light1.position.set(10, 10, 10);
    sceneRef.current.add(light1);

    const light2 = new THREE.PointLight(0xff6b35, 1, 100);
    light2.position.set(-10, -10, 10);
    sceneRef.current.add(light2);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    sceneRef.current.add(ambientLight);
  };

  // Gestion du progrès de chargement
  useEffect(() => {
    if (!isLoading) return;

    let currentPhase = 0;
    let currentProgress = 0;

    const progressInterval = setInterval(() => {
      if (currentPhase < loadingPhases.length) {
        const phaseProgress = (currentProgress / loadingPhases[currentPhase].duration) * 100;
        const totalProgress = ((currentPhase / loadingPhases.length) * 100) + (phaseProgress / loadingPhases.length);
        
        setProgress(Math.min(totalProgress, 100));
        setLoadingText(loadingPhases[currentPhase].text);
        setPhase(currentPhase);

        currentProgress += 50;

        if (currentProgress >= loadingPhases[currentPhase].duration) {
          currentPhase++;
          currentProgress = 0;
          
          if (currentPhase >= loadingPhases.length) {
            setProgress(100);
            setTimeout(() => {
              setShowLogo(true);
              setTimeout(() => onComplete(), 1000);
            }, 500);
            clearInterval(progressInterval);
          }
        }
      }
    }, 50);

    return () => clearInterval(progressInterval);
  }, [isLoading, onComplete]);

  // Génération de particules
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: Math.random()
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const particleInterval = setInterval(generateParticles, 3000);

    return () => clearInterval(particleInterval);
  }, []);

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black overflow-hidden"
      >
        {/* Conteneur 3D */}
        <div 
          ref={mountRef} 
          className="absolute inset-0"
          style={{ filter: 'brightness(1.2) contrast(1.1)' }}
        />

        {/* Particules de fond */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: particle.x,
                top: particle.y,
              }}
              animate={{
                opacity: [0, particle.opacity, 0],
                scale: [0, 1, 0],
                y: [particle.y, particle.y - 100]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Overlay avec contenu */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
          
          {/* Logo central animé */}
          <motion.div
            initial={{ scale: 0, rotateY: -180 }}
            animate={{ 
              scale: showLogo ? 1.2 : 1,
              rotateY: showLogo ? 0 : 360
            }}
            transition={{ 
              duration: 2,
              ease: "easeOut"
            }}
            className="mb-12 relative"
          >
            <div className="relative">
              {/* Cercle de fond avec effet holographique */}
              <motion.div
                className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 40px rgba(0, 212, 255, 0.8), 0 0 80px rgba(255, 0, 255, 0.6)',
                    '0 0 60px rgba(255, 0, 255, 0.8), 0 0 120px rgba(0, 212, 255, 0.6)',
                    '0 0 40px rgba(0, 212, 255, 0.8), 0 0 80px rgba(255, 0, 255, 0.6)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Crown className="w-16 h-16 text-white" />
              </motion.div>

              {/* Anneaux orbitaux */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 border-2 rounded-full"
                  style={{
                    borderColor: ['#00d4ff', '#ff6b35', '#00ff88'][i],
                    width: `${140 + i * 20}px`,
                    height: `${140 + i * 20}px`,
                    top: `${-10 - i * 10}px`,
                    left: `${-10 - i * 10}px`
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 4 + i * 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <motion.div
                    className="w-3 h-3 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{ backgroundColor: ['#00d4ff', '#ff6b35', '#00ff88'][i] }}
                    animate={{
                      scale: [1, 1.5, 1],
                      boxShadow: [
                        `0 0 10px ${['#00d4ff', '#ff6b35', '#00ff88'][i]}`,
                        `0 0 20px ${['#00d4ff', '#ff6b35', '#00ff88'][i]}`,
                        `0 0 10px ${['#00d4ff', '#ff6b35', '#00ff88'][i]}`
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Titre principal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-purple-400 via-violet-500 to-purple-600 bg-clip-text text-transparent">
              BLACK HEART
            </h1>
            <p className="text-xl md:text-2xl text-white font-bold tracking-wider">
              ELITE GAMING LEGION
            </p>
          </motion.div>

          {/* Barre de progression sophistiquée */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="w-full max-w-md mb-8"
          >
            <div className="relative">
              {/* Fond de la barre */}
              <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
                {/* Barre de progression avec gradient animé */}
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Effet de brillance qui se déplace */}
                  <motion.div
                    className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    animate={{ x: [-32, 400] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </div>
              
              {/* Pourcentage */}
              <div className="flex justify-between items-center mt-3">
                <motion.span
                  key={loadingText}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-medium text-white/80"
                >
                  {loadingText}
                </motion.span>
                <motion.span 
                  className="text-sm font-bold text-cyan-400"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  {Math.round(progress)}%
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* Icônes flottantes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex space-x-8 mb-8"
          >
            {[Shield, Zap, Target, Gamepad2].map((Icon, index) => (
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
                  ease: "easeInOut",
                  delay: index * 0.2
                }}
                className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
              >
                <Icon className="w-6 h-6 text-white" />
              </motion.div>
            ))}
          </motion.div>

          {/* Message de fin */}
          <AnimatePresence>
            {showLogo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <p className="text-lg text-white/90 font-medium mb-2">
                  Prêt pour l'aventure
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-white/70">Bienvenue dans l'élite</span>
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Effet de scan futuriste */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ y: '100%' }}
          animate={{ y: '-100%' }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}