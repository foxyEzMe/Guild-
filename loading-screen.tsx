import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Zap, Shield, Sword, Star, Gem } from 'lucide-react';
import { useThemeCustomization } from '@/contexts/ThemeCustomizationContext';

interface LoadingScreenProps {
  isLoading: boolean;
  onComplete: () => void;
}

export function LoadingScreen({ isLoading, onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStory, setCurrentStory] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const { theme } = useThemeCustomization();

  // Éléments narratifs immersifs
  const storyElements = [
    {
      text: "Les portails dimensionnels s'ouvrent...",
      icon: <Zap className="w-8 h-8" />,
      duration: 2000
    },
    {
      text: "Connexion aux serveurs de la guilde...",
      icon: <Shield className="w-8 h-8" />,
      duration: 1500
    },
    {
      text: "Chargement des artefacts légendaires...",
      icon: <Gem className="w-8 h-8" />,
      duration: 1800
    },
    {
      text: "Synchronisation avec Discord...",
      icon: <Crown className="w-8 h-8" />,
      duration: 1200
    },
    {
      text: "Préparation de l'interface élite...",
      icon: <Star className="w-8 h-8" />,
      duration: 1000
    },
    {
      text: "Bienvenue dans S.L.Z Guild !",
      icon: <Sword className="w-8 h-8" />,
      duration: 1500
    }
  ];

  // Son de chargement synthétisé
  const playLoadingSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      
      // Son futuriste montant
      oscillator.frequency.setValueAtTime(200, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (error) {
      console.log('Audio non disponible');
    }
  };

  // Logique de progression du chargement
  useEffect(() => {
    if (!isLoading) return;

    let totalDuration = 0;
    const intervals: NodeJS.Timeout[] = [];

    // Calcul du temps total
    storyElements.forEach(element => {
      totalDuration += element.duration;
    });

    let currentTime = 0;

    // Configuration des étapes
    storyElements.forEach((element, index) => {
      const timeout = setTimeout(() => {
        setCurrentStory(index);
        playLoadingSound();
        
        // Animation de la barre de progression
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            const newProgress = (currentTime / totalDuration) * 100;
            if (newProgress >= 100) {
              clearInterval(progressInterval);
              return 100;
            }
            return newProgress;
          });
          currentTime += 50;
        }, 50);
        
        intervals.push(progressInterval);
      }, currentTime);
      
      intervals.push(timeout);
      currentTime += element.duration;
    });

    // Affichage du logo après 1 seconde
    const logoTimeout = setTimeout(() => setShowLogo(true), 1000);
    
    // Affichage du titre après 2 secondes
    const titleTimeout = setTimeout(() => setShowTitle(true), 2000);

    // Fin du chargement
    const completeTimeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        onComplete();
      }, 800);
    }, totalDuration);

    return () => {
      intervals.forEach(clearInterval);
      clearTimeout(logoTimeout);
      clearTimeout(titleTimeout);
      clearTimeout(completeTimeout);
    };
  }, [isLoading, onComplete]);

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
        style={{
          background: `radial-gradient(circle at 30% 40%, ${theme.primaryColor}20, transparent),
                       radial-gradient(circle at 70% 60%, ${theme.accentColor}15, transparent),
                       radial-gradient(circle at 50% 50%, ${theme.secondaryColor}10, black)`
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Particules de fond épiques */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                backgroundColor: i % 3 === 0 ? theme.primaryColor : i % 3 === 1 ? theme.accentColor : theme.secondaryColor,
                width: `${2 + Math.random() * 6}px`,
                height: `${2 + Math.random() * 6}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -window.innerHeight - 100],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 2, 0.5]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>

        {/* Vagues d'énergie en arrière-plan */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border opacity-10"
              style={{
                borderColor: theme.primaryColor,
                borderWidth: '2px'
              }}
              animate={{
                scale: [0, 4],
                opacity: [0.3, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        {/* Contenu principal */}
        <div className="relative z-10 text-center max-w-2xl mx-auto px-8">
          {/* Logo épique */}
          <AnimatePresence>
            {showLogo && (
              <motion.div
                className="mb-8"
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  damping: 15, 
                  stiffness: 100,
                  duration: 1.2 
                }}
              >
                <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                  {/* Aura holographique */}
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-30 blur-xl"
                    style={{
                      background: `conic-gradient(from 0deg, ${theme.primaryColor}, ${theme.accentColor}, ${theme.secondaryColor}, ${theme.primaryColor})`
                    }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Anneaux d'énergie */}
                  {[...Array(3)].map((_, ringIndex) => (
                    <motion.div
                      key={ringIndex}
                      className="absolute inset-0 rounded-full border-2 opacity-40"
                      style={{
                        borderColor: ringIndex === 0 ? theme.primaryColor : ringIndex === 1 ? theme.accentColor : theme.secondaryColor,
                        scale: 1 + ringIndex * 0.3
                      }}
                      animate={{
                        rotate: [0, ringIndex % 2 === 0 ? 360 : -360],
                        opacity: [0.4, 0.8, 0.4]
                      }}
                      transition={{
                        duration: 6 - ringIndex,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  ))}
                  
                  {/* Logo central */}
                  <motion.div
                    className="relative w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`
                    }}
                    animate={{
                      boxShadow: [
                        `0 0 20px ${theme.primaryColor}60`,
                        `0 0 40px ${theme.accentColor}80`,
                        `0 0 20px ${theme.primaryColor}60`
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Crown className="text-white w-12 h-12" />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Titre épique */}
          <AnimatePresence>
            {showTitle && (
              <motion.div
                className="mb-12"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <motion.h1
                  className="text-6xl md:text-8xl font-black mb-4 bg-clip-text text-transparent leading-tight"
                  style={{
                    backgroundImage: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.accentColor}, ${theme.secondaryColor})`
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  S.L.Z
                </motion.h1>
                <motion.p
                  className="text-2xl md:text-3xl font-bold text-white tracking-wider"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  ELITE GAMING GUILD
                </motion.p>
                <motion.div
                  className="mt-4 h-1 w-64 mx-auto rounded-full"
                  style={{ backgroundColor: theme.accentColor }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Élément narratif actuel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStory}
              className="mb-8"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center space-x-4 mb-4">
                <motion.div
                  style={{ color: theme.accentColor }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {storyElements[currentStory]?.icon}
                </motion.div>
                <motion.span
                  className="text-xl md:text-2xl font-semibold text-white"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {storyElements[currentStory]?.text}
                </motion.span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Barre de progression épique */}
          <div className="relative w-full max-w-md mx-auto">
            <div
              className="h-2 rounded-full border opacity-30"
              style={{ borderColor: theme.primaryColor }}
            />
            <motion.div
              className="absolute top-0 left-0 h-2 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.accentColor})`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Effet de lueur sur la barre */}
            <motion.div
              className="absolute top-0 left-0 h-2 w-8 rounded-full opacity-80 blur-sm"
              style={{ backgroundColor: theme.accentColor }}
              animate={{
                x: [`0%`, `${progress - 8}%`]
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Pourcentage */}
          <motion.div
            className="mt-4 text-lg font-bold"
            style={{ color: theme.primaryColor }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {Math.round(progress)}%
          </motion.div>

          {/* Message final épique */}
          {progress >= 100 && (
            <motion.div
              className="mt-8"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 15 }}
            >
              <div className="text-2xl font-black text-white mb-2">
                🎮 PRÊT POUR LA BATAILLE ! 🎮
              </div>
              <div 
                className="text-lg font-semibold"
                style={{ color: theme.accentColor }}
              >
                Que l'aventure commence...
              </div>
            </motion.div>
          )}
        </div>

        {/* Effets de particules spéciaux lors du chargement */}
        <AnimatePresence>
          {progress > 50 && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: theme.accentColor,
                    left: `${50 + Math.cos(i * 18 * Math.PI / 180) * 200}px`,
                    top: `${50 + Math.sin(i * 18 * Math.PI / 180) * 200}px`
                  }}
                  animate={{
                    scale: [0, 2, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}