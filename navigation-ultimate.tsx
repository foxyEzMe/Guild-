import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Crown, Menu, X, Home, LogIn, Users, Bell, Award, Settings, 
  User, LogOut, Shield, ChevronDown, Music, VolumeX, Sparkles,
  Calendar, Star, Gem, Flame, Eye, Zap, Rocket, Target, Trophy,
  MessageSquare, Camera, Palette, Globe, Heart, Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useThemeCustomization } from '@/contexts/ThemeCustomizationContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  gradient: string;
  particle?: string;
  glow?: string;
}

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const isMobile = useIsMobile();
  const { theme } = useThemeCustomization();
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, color: string}>>([]);
  const navRef = useRef<HTMLElement>(null);

  const navItems: NavItem[] = [
    {
      path: '/',
      label: 'Accueil',
      icon: <Home className="w-5 h-5" />,
      description: 'Retour au QG principal',
      color: '#8B5CF6',
      gradient: 'from-violet-500 via-purple-600 to-indigo-700',
      particle: '🏠',
      glow: 'shadow-[0_0_30px_rgba(139,92,246,0.6)]'
    },
    {
      path: '/members',
      label: 'Membres',
      icon: <Users className="w-5 h-5" />,
      description: 'Nos guerriers d\'élite',
      color: '#06B6D4',
      gradient: 'from-cyan-500 via-blue-600 to-indigo-700',
      particle: '⚔️',
      glow: 'shadow-[0_0_30px_rgba(6,182,212,0.6)]'
    },
    {
      path: '/announcements',
      label: 'Annonces',
      icon: <Bell className="w-5 h-5" />,
      description: 'Actualités du royaume',
      color: '#F59E0B',
      gradient: 'from-amber-500 via-orange-600 to-red-700',
      particle: '📢',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.6)]'
    },
    {
      path: '/events',
      label: 'Événements',
      icon: <Calendar className="w-5 h-5" />,
      description: 'Batailles épiques',
      color: '#10B981',
      gradient: 'from-emerald-500 via-green-600 to-teal-700',
      particle: '🎯',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.6)]'
    },
    {
      path: '/credits',
      label: 'Crédits',
      icon: <Star className="w-5 h-5" />,
      description: 'Hall of Fame',
      color: '#EC4899',
      gradient: 'from-pink-500 via-rose-600 to-purple-700',
      particle: '⭐',
      glow: 'shadow-[0_0_30px_rgba(236,72,153,0.6)]'
    }
  ];

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Suivi de la souris pour les effets
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Système de particules amélioré
  useEffect(() => {
    if (hoveredItem) {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: mousePosition.x + (Math.random() - 0.5) * 100,
        y: mousePosition.y + (Math.random() - 0.5) * 100,
        color: navItems.find(item => item.path === hoveredItem)?.color || '#8B5CF6'
      }));
      setParticles(prev => [...prev.slice(-20), ...newParticles]);
    }
  }, [hoveredItem, mousePosition]);

  // Sons d'interface
  const playHoverSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const playClickSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.15);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  };

  const isActive = (path: string) => {
    return location === path || (path !== '/' && location.startsWith(path));
  };

  return (
    <>
      {/* Particules flottantes */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ 
                x: particle.x, 
                y: particle.y, 
                scale: 0, 
                opacity: 0.8 
              }}
              animate={{ 
                x: particle.x + (Math.random() - 0.5) * 200,
                y: particle.y - 100,
                scale: [0, 1, 0],
                opacity: [0.8, 1, 0]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute w-2 h-2 rounded-full"
              style={{ 
                background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
                boxShadow: `0 0 10px ${particle.color}`
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      <motion.nav
        ref={navRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-black/95 backdrop-blur-2xl border-b border-violet-500/20 shadow-2xl shadow-violet-500/10' 
            : 'bg-transparent'
        }`}
      >
        {/* Effet de lueur sur la barre de navigation */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/10 via-purple-900/20 to-indigo-900/10 rounded-b-3xl" />
        
        {/* Lignes de néon */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-60" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo avec effet holographique */}
            <motion.div 
              className="flex items-center space-x-3 group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/">
                <motion.div 
                  className="relative"
                  animate={{ 
                    rotateY: [0, 360],
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(139,92,246,0.8)] transition-all duration-300">
                    <Crown className="w-7 h-7 text-white relative z-10" />
                    
                    {/* Effet de scan holographique */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent"
                      animate={{ y: ['-100%', '100%'] }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    />
                  </div>
                </motion.div>
                
                <div className="hidden sm:block">
                  <motion.h1 
                    className="text-2xl font-black bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent"
                    animate={{ 
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    S.L.Z
                  </motion.h1>
                  <p className="text-xs text-white/60 font-medium tracking-wider">GUILD</p>
                </div>
              </Link>
            </motion.div>

            {/* Navigation Desktop avec effets spectaculaires */}
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onHoverStart={() => {
                    setHoveredItem(item.path);
                    if (musicEnabled) playHoverSound();
                  }}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <Link href={item.path}>
                    <motion.div
                      className="relative group overflow-hidden"
                      whileHover={{ scale: 1.05, rotateY: 5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (musicEnabled) playClickSound();
                      }}
                    >
                      <Button
                        variant="ghost"
                        className={`
                          relative px-6 py-3 font-bold text-sm transition-all duration-500 overflow-hidden
                          ${isActive(item.path) 
                            ? `bg-gradient-to-r ${item.gradient} text-white ${item.glow} border border-white/20` 
                            : 'text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10'
                          }
                          rounded-xl backdrop-blur-sm
                        `}
                      >
                        {/* Effet de particules de fond */}
                        <div className="absolute inset-0 overflow-hidden">
                          {isActive(item.path) && (
                            <motion.div
                              className="absolute inset-0"
                              animate={{
                                background: [
                                  `radial-gradient(circle at 0% 0%, ${item.color}20 0%, transparent 50%)`,
                                  `radial-gradient(circle at 100% 100%, ${item.color}20 0%, transparent 50%)`,
                                  `radial-gradient(circle at 0% 100%, ${item.color}20 0%, transparent 50%)`,
                                  `radial-gradient(circle at 100% 0%, ${item.color}20 0%, transparent 50%)`,
                                  `radial-gradient(circle at 0% 0%, ${item.color}20 0%, transparent 50%)`
                                ]
                              }}
                              transition={{ duration: 4, repeat: Infinity }}
                            />
                          )}
                        </div>

                        {/* Ligne de scan */}
                        {hoveredItem === item.path && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                          />
                        )}

                        <motion.span 
                          className="relative z-10 flex items-center space-x-2"
                          whileHover={{ scale: 1.1 }}
                        >
                          <motion.span
                            animate={isActive(item.path) ? { 
                              rotate: [0, 5, -5, 0],
                              scale: [1, 1.1, 1]
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {item.icon}
                          </motion.span>
                          <span className="font-bold tracking-wide">{item.label}</span>
                        </motion.span>

                        {/* Indicateur actif */}
                        {isActive(item.path) && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}

                        {/* Effet de lueur sur hover */}
                        <motion.div
                          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `radial-gradient(circle at center, ${item.color}20 0%, transparent 70%)`,
                            filter: 'blur(10px)'
                          }}
                        />
                      </Button>

                      {/* Tooltip amélioré */}
                      <AnimatePresence>
                        {hoveredItem === item.path && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50"
                          >
                            <div className={`bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-2 text-xs font-medium text-white shadow-2xl`}
                                 style={{ boxShadow: `0 0 20px ${item.color}40` }}>
                              <div className="text-center">
                                <p className="font-bold" style={{ color: item.color }}>{item.label}</p>
                                <p className="text-white/70 text-xs">{item.description}</p>
                              </div>
                              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 border-l border-t border-white/20 rotate-45"></div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Section droite avec profil utilisateur */}
            <div className="flex items-center space-x-4">
              
              {/* Contrôle audio */}
              <motion.button
                onClick={() => setMusicEnabled(!musicEnabled)}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
              >
                {musicEnabled ? (
                  <Music className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </motion.button>

              {/* Menu utilisateur ou boutons de connexion */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-3 p-2 rounded-xl bg-gradient-to-r from-violet-500/20 to-purple-600/20 backdrop-blur-sm border border-violet-500/30 hover:border-violet-400/50 transition-all duration-300"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="hidden sm:block text-white font-medium">
                        {user?.username}
                      </span>
                      <ChevronDown className="w-4 h-4 text-white/70" />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="bg-black/95 backdrop-blur-xl border border-violet-500/30 text-white"
                    align="end"
                  >
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator className="bg-violet-500/30" />
                        <DropdownMenuItem>
                          <Shield className="w-4 h-4 mr-2" />
                          <span>Administration</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="bg-violet-500/30" />
                    <DropdownMenuItem onClick={() => logout.mutate()} className="text-red-400">
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-violet-500/25 transition-all duration-300">
                        <LogIn className="w-4 h-4 mr-2" />
                        Connexion
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              )}

              {/* Menu hamburger mobile */}
              <div className="lg:hidden">
                <motion.button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                >
                  <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="w-6 h-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Menu mobile avec animations spectaculaires */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden border-t border-violet-500/20 bg-black/95 backdrop-blur-2xl"
            >
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.path}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        if (musicEnabled) playClickSound();
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02, x: 10 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                          isActive(item.path)
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <motion.span
                          animate={isActive(item.path) ? { 
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.1, 1]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {item.icon}
                        </motion.span>
                        <div>
                          <p className="font-bold">{item.label}</p>
                          <p className="text-xs opacity-70">{item.description}</p>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}