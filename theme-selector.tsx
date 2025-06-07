import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

export function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, setTheme, availableThemes } = useTheme();

  // Fallback theme si le thème actuel n'existe pas
  const currentThemeData = availableThemes[currentTheme] || availableThemes.purple;

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
        size="sm"
        style={{
          background: `linear-gradient(45deg, ${currentThemeData.primary}, ${currentThemeData.secondary})`,
          boxShadow: `0 4px 15px ${currentThemeData.primary}30`
        }}
      >
        <Palette className="w-4 h-4 mr-2" />
        Thème
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Theme Selector Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 z-50 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl p-4 min-w-[300px]"
            >
              <h3 className="text-white font-bold text-lg mb-4 text-center">
                Choisir un Thème
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(availableThemes).map(([key, theme]) => (
                  <motion.button
                    key={key}
                    onClick={() => {
                      setTheme(key);
                      setIsOpen(false);
                    }}
                    className={`relative p-3 rounded-lg border-2 transition-all duration-300 ${
                      currentTheme === key 
                        ? 'border-white/50 bg-white/10' 
                        : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Preview Circle */}
                    <div 
                      className="w-8 h-8 rounded-full mx-auto mb-2 border-2 border-white/30"
                      style={{ 
                        background: theme.gradient 
                      }}
                    />
                    
                    <div className="text-white text-sm font-medium mb-1">
                      {theme.name}
                    </div>
                    
                    {/* Color Preview */}
                    <div className="flex justify-center gap-1 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.secondary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.accent }}
                      />
                    </div>
                    
                    {/* Check Mark */}
                    {currentTheme === key && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-white/70 text-xs">
                  Le thème change instantanément l'apparence du site
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}