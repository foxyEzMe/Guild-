import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeCustomization } from '@/contexts/ThemeCustomizationContext';
import { Palette, ChevronRight, Check } from 'lucide-react';

export function ThemeSwitcherFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, presetThemes, applyPreset } = useThemeCustomization();
  
  // Obtenir le thème actif
  const getActivePreset = () => {
    for (const [presetName, presetValues] of Object.entries(presetThemes)) {
      if (
        presetValues.primaryColor === theme.primaryColor &&
        presetValues.secondaryColor === theme.secondaryColor &&
        presetValues.accentColor === theme.accentColor
      ) {
        return presetName;
      }
    }
    return null;
  };
  
  const activePreset = getActivePreset();
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Bouton pour ouvrir le sélecteur */}
      <motion.div
        className="relative z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-black/80 backdrop-blur-sm border border-purple-500/30 text-white shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
          style={{
            background: `linear-gradient(45deg, ${theme.primaryColor}80, ${theme.secondaryColor}80)`,
          }}
        >
          <Palette className="w-6 h-6" />
        </button>
      </motion.div>

      {/* Panneau de sélection de thème */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 mb-2 w-64 bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-3 border-b border-purple-500/20">
              <h3 className="text-white font-medium text-sm">Changer de Thème</h3>
            </div>
            
            <div className="p-2 max-h-80 overflow-y-auto">
              {Object.entries(presetThemes).map(([name, colors]) => (
                <motion.div
                  key={name}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => applyPreset(name as any)}
                  className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div 
                    className="w-8 h-8 rounded-full flex-shrink-0"
                    style={{
                      background: `linear-gradient(45deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium capitalize">
                      {name.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                  </div>
                  {activePreset === name && (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                </motion.div>
              ))}
            </div>
            
            <div className="p-3 border-t border-purple-500/20">
              <motion.button
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between w-full text-purple-400 text-sm font-medium"
              >
                <span>Fermer</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}