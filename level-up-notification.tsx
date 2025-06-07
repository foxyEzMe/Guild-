import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Crown, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BADGES } from '@shared/levels';

interface LevelUpNotificationProps {
  show: boolean;
  onClose: () => void;
  level: number;
  rank: string;
  newBadges: string[];
}

export function LevelUpNotification({ show, onClose, level, rank, newBadges = [] }: LevelUpNotificationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    if (show) {
      setShowConfetti(true);
      // Masquer les confettis après 3 secondes
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  // Trouver les informations des badges obtenus
  const unlockedBadges = BADGES.filter(badge => newBadges.includes(badge.id));
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay semi-transparent */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
          
          {/* Confettis animés */}
          {showConfetti && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 100 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-3"
                  style={{
                    backgroundColor: ['#FF4D4D', '#F9CB28', '#4CD964', '#5AC8FA', '#8A2BE2', '#FF2D55'][Math.floor(Math.random() * 6)],
                    borderRadius: '2px',
                    top: '-10px',
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: ['0vh', '100vh'],
                    x: [`${Math.random() * 10 - 5}%`, `${Math.random() * 20 - 10}%`],
                    rotate: [0, Math.random() * 360],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 2 + 2,
                    ease: 'easeOut',
                    delay: Math.random() * 0.5,
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Notification */}
          <motion.div
            className="relative bg-black/80 border border-purple-500/30 rounded-2xl overflow-hidden max-w-md w-full shadow-2xl"
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {/* Bouton fermer */}
            <button 
              className="absolute top-4 right-4 z-10 bg-black/30 rounded-full p-1 text-white hover:bg-black/50 transition-colors"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* En-tête brillant */}
            <div className="h-24 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                >
                  <Trophy className="w-16 h-16 text-yellow-300 drop-shadow-glow" />
                </motion.div>
              </div>
            </div>
            
            {/* Contenu */}
            <div className="p-6 text-center">
              <motion.h3 
                className="text-xl font-bold text-white mb-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Niveau Augmenté!
              </motion.h3>
              
              <motion.div
                className="flex items-center justify-center gap-2 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-2xl font-bold text-purple-400">Niveau {level}</div>
                <div className="text-sm px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold">
                  {rank}
                </div>
              </motion.div>
              
              {newBadges.length > 0 && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-gray-300 mb-2">Nouveaux badges débloqués:</div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {unlockedBadges.map((badge, index) => (
                      <motion.div
                        key={badge.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <Badge className={`bg-gradient-to-r ${badge.gradient} text-white font-bold px-3 py-1.5 shadow-lg flex items-center gap-1`}>
                          <Star className="w-4 h-4" />
                          {badge.name}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Button 
                  onClick={onClose}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-2 rounded-lg shadow-lg"
                >
                  Continuer
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}