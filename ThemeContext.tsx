import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  name: string;
}

export const themePresets: Record<string, ThemeColors> = {
  purple: {
    name: 'Purple Elite',
    primary: '#8B5CF6',
    secondary: '#A855F7',
    accent: '#EC4899',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
  },
  blue: {
    name: 'Cyber Blue',
    primary: '#3B82F6',
    secondary: '#06B6D4',
    accent: '#0EA5E9',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)'
  },
  green: {
    name: 'Matrix Green',
    primary: '#10B981',
    secondary: '#34D399',
    accent: '#059669',
    gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)'
  },
  red: {
    name: 'Crimson Fire',
    primary: '#EF4444',
    secondary: '#F87171',
    accent: '#DC2626',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)'
  },
  orange: {
    name: 'Solar Flare',
    primary: '#F59E0B',
    secondary: '#FBBF24',
    accent: '#D97706',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)'
  },
  cyan: {
    name: 'Neon Cyan',
    primary: '#06B6D4',
    secondary: '#67E8F9',
    accent: '#0891B2',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #67E8F9 100%)'
  },
  pink: {
    name: 'Neon Pink',
    primary: '#EC4899',
    secondary: '#F472B6',
    accent: '#DB2777',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)'
  },
  gold: {
    name: 'Royal Gold',
    primary: '#F59E0B',
    secondary: '#FDE047',
    accent: '#EAB308',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #FDE047 100%)'
  }
};

interface ThemeContextType {
  currentTheme: string;
  colors: ThemeColors;
  setTheme: (themeName: string) => void;
  availableThemes: Record<string, ThemeColors>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('selectedTheme') || 'purple';
  });

  const colors = themePresets[currentTheme] || themePresets.purple;

  const setTheme = (themeName: string) => {
    if (themePresets[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('selectedTheme', themeName);
    }
  };

  useEffect(() => {
    // Ne pas appliquer les styles si un thème personnalisé est actif
    const hasCustomTheme = localStorage.getItem('userTheme');
    if (hasCustomTheme && currentTheme === 'custom') {
      return;
    }
    
    const root = document.documentElement;
    const theme = themePresets[currentTheme];
    
    if (theme) {
      // Convertir les couleurs hex en HSL pour les variables CSS
      root.style.setProperty('--primary-color', theme.primary);
      root.style.setProperty('--secondary-color', theme.secondary);
      root.style.setProperty('--accent-color', theme.accent);
      root.style.setProperty('--planet-color', theme.primary);
      root.style.setProperty('--theme-gradient', theme.gradient);
      
      // Mettre à jour les classes Tailwind custom
      root.style.setProperty('--neon-purple', theme.primary);
      root.style.setProperty('--electric-blue', theme.secondary);
      root.style.setProperty('--neon-cyan', theme.accent);
      root.style.setProperty('--neon-magenta', theme.accent);
    }
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      colors,
      setTheme,
      availableThemes: themePresets
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}