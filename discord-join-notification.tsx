import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ArrowRight, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeCustomization } from '@/contexts/ThemeCustomizationContext';

interface DiscordJoinNotificationProps {
  show: boolean;
  onClose: () => void;
  username?: string;
}

export function DiscordJoinNotification({ 
  show, 
  onClose,
  username = "membre"
}: DiscordJoinNotificationProps) {
  const { theme } = useThemeCustomization();
  const [showHelp, setShowHelp] = useState(false);
  
  // Fermer automatiquement après un certain temps
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 60000); // 60 secondes
      
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 max-w-md w-full"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            {/* Fond avec effet glassmorphism */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl z-0" />
            
            {/* Effet de bordure lumineuse */}
            <div className="absolute inset-0 rounded-xl" style={{ 
              border: `1px solid ${theme.primaryColor}40`,
              boxShadow: `0 0 15px ${theme.primaryColor}30, inset 0 0 10px ${theme.accentColor}20`
            }} />
            
            {/* Particules décoratives */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ 
                    background: theme.accentColor,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`
                  }}
                  animate={{ 
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.5, 1]
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
            
            {/* Contenu */}
            <div className="relative z-10 p-6">
              {/* Bouton de fermeture */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
              
              {/* En-tête */}
              <div className="flex items-start space-x-4 mb-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, #5865F2, #4752C4)` }}
                >
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Rejoignez notre Discord</h3>
                  <p className="text-gray-300 text-sm">
                    Pour débloquer toutes les fonctionnalités de la communauté
                  </p>
                </div>
              </div>
              
              {/* Corps du message */}
              <div className="mb-5">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-4">
                  <p className="text-gray-200">
                    Bonjour <span className="font-semibold" style={{ color: theme.accentColor }}>{username}</span>,
                    rejoignez notre serveur Discord officiel pour accéder à toutes les fonctionnalités de la communauté et participer aux événements exclusifs.
                  </p>
                </div>
                
                <AnimatePresence>
                  {showHelp && (
                    <motion.div
                      className="mt-4 p-4 rounded-lg bg-indigo-900/30 border border-indigo-500/30"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="font-semibold text-indigo-300 mb-2">Comment lier votre compte Discord</h4>
                      <ol className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start">
                          <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-xs mr-2 mt-0.5">1</span>
                          <span>Rejoignez notre serveur Discord officiel en cliquant sur le bouton ci-dessous</span>
                        </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-xs mr-2 mt-0.5">2</span>
                          <span>Une fois sur le serveur, utilisez la commande <code className="bg-black/30 px-1 py-0.5 rounded">/lier {username}</code> dans le canal #lier-compte</span>
                        </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-xs mr-2 mt-0.5">3</span>
                          <span>Suivez les instructions du bot pour compléter la liaison</span>
                        </li>
                      </ol>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-5"
                  onClick={() => window.open('https://discord.gg/slzguild', '_blank')}
                >
                  <span className="flex items-center">
                    <svg className="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                    Rejoindre Discord
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="flex-1 border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10"
                  onClick={() => setShowHelp(!showHelp)}
                >
                  {showHelp ? 'Masquer l\'aide' : 'Comment faire ?'}
                </Button>
              </div>
              
              {/* Badge informatif */}
              <div className="mt-4 flex items-center justify-center">
                <motion.div 
                  className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-xs text-gray-300 border border-purple-500/30"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                >
                  <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                  L'accès au chat et aux événements sera débloqué après liaison
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}