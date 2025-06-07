import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeCustomization {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundType: 'gradient' | 'particle' | 'cosmic';
  planetColor: string;
  soundEnabled: boolean;
  vibrationsEnabled: boolean;
}

interface ThemeCustomizationContextType {
  theme: ThemeCustomization;
  updateTheme: (updates: Partial<ThemeCustomization>) => void;
  presetThemes: typeof presetThemes;
  applyPreset: (presetName: keyof typeof presetThemes) => void;
}

const defaultTheme: ThemeCustomization = {
  primaryColor: '#8B5CF6', // violet
  secondaryColor: '#A855F7', // purple
  accentColor: '#EC4899', // pink
  backgroundType: 'gradient',
  planetColor: '#8B5CF6',
  soundEnabled: true,
  vibrationsEnabled: true,
};

const presetThemes = {
  // Thème par défaut - Violet/Pourpre
  purple: {
    primaryColor: '#8B5CF6',
    secondaryColor: '#A855F7', 
    accentColor: '#EC4899',
    backgroundType: 'gradient' as const,
    planetColor: '#8B5CF6',
    soundEnabled: true,
    vibrationsEnabled: true,
  },
  // Thème rouge et noir demandé par l'utilisateur
  redblack: {
    primaryColor: '#EF4444',
    secondaryColor: '#991B1B', 
    accentColor: '#B91C1C',
    backgroundType: 'cosmic' as const,
    planetColor: '#991B1B',
    soundEnabled: true,
    vibrationsEnabled: true,
  },
  // Thème jaune et blanc demandé par l'utilisateur
  yellowwhite: {
    primaryColor: '#F59E0B',
    secondaryColor: '#FBBF24', 
    accentColor: '#FFFFFF',
    backgroundType: 'particle' as const,
    planetColor: '#FBBF24',
    soundEnabled: true,
    vibrationsEnabled: true,
  },
  // Thème rouge
  red: {
    primaryColor: '#EF4444',
    secondaryColor: '#F87171',
    accentColor: '#FCA5A5',
    backgroundType: 'particle' as const,
    planetColor: '#EF4444',
    soundEnabled: true,
    vibrationsEnabled: true,
  },
  // Thème bleu
  blue: {
    primaryColor: '#3B82F6',
    secondaryColor: '#60A5FA',
    accentColor: '#93C5FD',
    backgroundType: 'cosmic' as const,
    planetColor: '#3B82F6',
    soundEnabled: true,
    vibrationsEnabled: true,
  },
  // Thème vert
  green: {
    primaryColor: '#10B981',
    secondaryColor: '#34D399',
    accentColor: '#6EE7B7',
    backgroundType: 'gradient' as const,
    planetColor: '#10B981',
    soundEnabled: true,
    vibrationsEnabled: true,
  },
  // Thème orange
  orange: {
    primaryColor: '#F59E0B',
    secondaryColor: '#FBBF24',
    accentColor: '#FCD34D',
    backgroundType: 'particle' as const,
    planetColor: '#F59E0B',
    soundEnabled: true,
    vibrationsEnabled: true,
  },
  // Thème cyan
  cyan: {
    primaryColor: '#06B6D4',
    secondaryColor: '#22D3EE',
    accentColor: '#67E8F9',
    backgroundType: 'cosmic' as const,
    planetColor: '#06B6D4',
    soundEnabled: true,
    vibrationsEnabled: true,
  },
  // Thème néon
  neon: {
    primaryColor: '#10FFA2',
    secondaryColor: '#00FFFF', 
    accentColor: '#FF00FF',
    backgroundType: 'cosmic' as const,
    planetColor: '#10FFA2',
    soundEnabled: true,
    vibrationsEnabled: true,
  },
  // Thème sombre intense
  darkgamer: {
    primaryColor: '#6D28D9',
    secondaryColor: '#4C1D95', 
    accentColor: '#F43F5E',
    backgroundType: 'particle' as const,
    planetColor: '#6D28D9',
    soundEnabled: true,
    vibrationsEnabled: true,
  },
};

const ThemeCustomizationContext = createContext<ThemeCustomizationContextType | null>(null);

export function ThemeCustomizationProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeCustomization>(defaultTheme);

  // Charger le thème depuis localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('userTheme');
    if (savedTheme) {
      try {
        setTheme(JSON.parse(savedTheme));
      } catch (error) {
        console.error('Erreur lors du chargement du thème:', error);
      }
    }
  }, []);

  // Sauvegarder le thème dans localStorage et appliquer les styles
  useEffect(() => {
    localStorage.setItem('userTheme', JSON.stringify(theme));
    
    // Appliquer les couleurs CSS
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--planet-color', theme.planetColor);
    
    // Mettre à jour les classes Tailwind custom aussi
    root.style.setProperty('--neon-purple', theme.primaryColor);
    root.style.setProperty('--electric-blue', theme.secondaryColor);
    root.style.setProperty('--neon-cyan', theme.accentColor);
    root.style.setProperty('--neon-magenta', theme.accentColor);
    root.style.setProperty('--theme-gradient', `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`);
    
    // Ajouter une classe pour le type de fond
    root.className = root.className.replace(/bg-type-\w+/g, '');
    root.classList.add(`bg-type-${theme.backgroundType}`);
    
    // Synchroniser avec l'ancien système de thème
    localStorage.setItem('selectedTheme', 'custom');
  }, [theme]);

  const updateTheme = (updates: Partial<ThemeCustomization>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };

  const applyPreset = (presetName: keyof typeof presetThemes) => {
    if (presetThemes[presetName]) {
      setTheme(presetThemes[presetName]);
    }
  };

  return (
    <ThemeCustomizationContext.Provider 
      value={{ 
        theme, 
        updateTheme, 
        presetThemes, 
        applyPreset 
      }}
    >
      {children}
    </ThemeCustomizationContext.Provider>
  );
}

export function useThemeCustomization() {
  const context = useContext(ThemeCustomizationContext);
  if (!context) {
    throw new Error('useThemeCustomization doit être utilisé dans ThemeCustomizationProvider');
  }
  return context;
}