import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Crown, Menu, X, Home, LogIn, Users, Bell, Award, Settings, 
  User, LogOut, Shield, ChevronDown, Music, VolumeX, Sparkles,
  Calendar, Star, Gem, Flame, Eye, Zap, Rocket, Target, Trophy,
  MessageSquare, Camera, Palette, Globe, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  gradient: string;
  hoverColor: string;
}

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeParticles, setActiveParticles] = useState<Array<{id: number, x: number, y: number, color: string, velocity: {x: number, y: number}}>>([]);
  const navRef = useRef<HTMLElement>(null);

  const navItems: NavItem[] = [
    {
      path: '/',
      label: 'Accueil',
      icon: <Home className="w-5 h-5" />,
      description: 'QG Principal',
      color: '#8B5CF6',
      gradient: 'from-violet-500 to-purple-600',
      hoverColor: '#A855F7'
    },
    {
      path: '/members',
      label: 'Membres',
      icon: <Users className="w-5 h-5" />,
      description: 'Guerriers Élite',
      color: '#06B6D4',
      gradient: 'from-cyan-500 to-blue-600',
      hoverColor: '#0891B2'
    },
    {
      path: '/announcements',
      label: 'Annonces',
      icon: <Bell className="w-5 h-5" />,
      description: 'Actualités',
      color: '#F59E0B',
      gradient: 'from-amber-500 to-orange-600',
      hoverColor: '#D97706'
    },
    {
      path: '/events',
      label: 'Événements',
      icon: <Calendar className="w-5 h-5" />,
      description: 'Batailles',
      color: '#10B981',
      gradient: 'from-emerald-500 to-green-600',
      hoverColor: '#059669'
    },
    {
      path: '/credits',
      label: 'Crédits',
      icon: <Star className="w-5 h-5" />,
      description: 'Hall of Fame',
      color: '#EC4899',
      gradient: 'from-pink-500 to-rose-600',
      hoverColor: '#DB2777'
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

  // Suivi de la souris
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Système de particules avancé
  useEffect(() => {
    if (hoveredItem) {
      const item = navItems.find(nav => nav.path === hoveredItem);
      if (item) {
        const newParticles = Array.from({ length: 12 }, (_, i) => ({
          id: Date.now() + i,
          x: mousePosition.x + (Math.random() - 0.5) * 150,
          y: mousePosition.y + (Math.random() - 0.5) * 150,
          color: item.color,
          velocity: {
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 0.5) * 4
          }
        }));
        setActiveParticles(prev => [...prev.slice(-30), ...newParticles]);
      }
    }
  }, [hoveredItem, mousePosition]);

  // Animation des particules
  useEffect(() => {
    const animateParticles = () => {
      setActiveParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.velocity.x,
        y: particle.y + particle.velocity.y,
        velocity: {
          x: particle.velocity.x * 0.98,
          y: particle.velocity.y * 0.98
        }
      })).filter(particle => 
        Math.abs(particle.velocity.x) > 0.1 || Math.abs(particle.velocity.y) > 0.1
      ));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  // Sons synthétisés
  const playHoverSound = () => {
    if (!musicEnabled) return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // Silence en cas d'erreur audio
    }
  };

  const playClickSound = () => {
    if (!musicEnabled) return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.15);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    } catch (e) {
      // Silence en cas d'erreur audio
    }
  };

  const isActive = (path: string) => {
    return location === path || (path !== '/' && location.startsWith(path));
  };

  return (
    <>
      {/* Particules dynamiques */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        <AnimatePresence>
          {activeParticles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ 
                x: particle.x, 
                y: particle.y, 
                scale: 0, 
                opacity: 1 
              }}
              animate={{ 
                scale: [0, 1.5, 0],
                opacity: [1, 0.8, 0]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute w-3 h-3 rounded-full"
              style={{ 
                background: `radial-gradient(circle, ${particle.color} 0%, ${particle.color}80 50%, transparent 100%)`,
                boxShadow: `0 0 15px ${particle.color}`
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      <motion.nav
        ref={navRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled 
            ? 'bg-black/95 backdrop-blur-3xl border-b border-violet-500/30 shadow-2xl shadow-violet-500/20' 
            : 'bg-black/20 backdrop-blur-xl'
        }`}
      >
        {/* Effet de lueur animée */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-violet-900/20 via-purple-900/30 to-indigo-900/20"
          animate={{
            background: [
              'linear-gradient(90deg, rgba(139,92,246,0.1) 0%, rgba(147,51,234,0.2) 50%, rgba(99,102,241,0.1) 100%)',
              'linear-gradient(90deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.2) 50%, rgba(147,51,234,0.1) 100%)',
              'linear-gradient(90deg, rgba(147,51,234,0.1) 0%, rgba(99,102,241,0.2) 50%, rgba(139,92,246,0.1) 100%)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Lignes de néon pulsantes */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo avec hologramme avancé */}
            <motion.div 
              className="flex items-center space-x-4 group cursor-pointer"
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
                    duration: 12, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:shadow-[0_0_40px_rgba(139,92,246,0.8)] transition-all duration-500">
                    <Crown className="w-8 h-8 text-white relative z-10" />
                    
                    {/* Effet de scan holographique multiple */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent"
                      animate={{ y: ['-150%', '150%'] }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        repeatDelay: 1
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
                      animate={{ x: ['-150%', '150%'] }}
                      transition={{ 
                        duration: 2.5, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        repeatDelay: 1.5
                      }}
                    />
                    
                    {/* Particules orbitales */}
                    {[1, 2, 3].map((ring, i) => (
                      <motion.div
                        key={ring}
                        className="absolute border rounded-full opacity-60"
                        style={{
                          width: `${120 + i * 15}%`,
                          height: `${120 + i * 15}%`,
                          borderColor: ['#8B5CF6', '#06B6D4', '#F59E0B'][i],
                          borderWidth: '1px'
                        }}
                        animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                        transition={{
                          duration: 8 + i * 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                          style={{ backgroundColor: ['#8B5CF6', '#06B6D4', '#F59E0B'][i] }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                <div className="hidden sm:block">
                  <motion.h1 
                    className="text-3xl font-black bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent leading-tight"
                    style={{
                      textShadow: '0 0 20px rgba(139,92,246,0.5)',
                      fontFamily: '"Inter", sans-serif',
                      letterSpacing: '0.05em'
                    }}
                  >
                    S.L.Z
                  </motion.h1>
                  <p className="text-xs text-white font-bold tracking-[0.2em] opacity-80">GUILD</p>
                </div>
              </Link>
            </motion.div>

            {/* Navigation Desktop ultra-stylée */}
            <div className="hidden lg:flex items-center space-x-3">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  onHoverStart={() => {
                    setHoveredItem(item.path);
                    playHoverSound();
                  }}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <Link href={item.path}>
                    <motion.div
                      className="relative group"
                      whileHover={{ scale: 1.08, rotateY: 8 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={playClickSound}
                    >
                      <Button
                        variant="ghost"
                        className={`
                          relative px-6 py-3 font-bold text-sm transition-all duration-500 overflow-hidden
                          ${isActive(item.path) 
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-2xl border border-white/30` 
                            : 'text-white hover:text-white bg-white/5 hover:bg-white/15 border border-transparent hover:border-white/20'
                          }
                          rounded-2xl backdrop-blur-xl
                        `}
                        style={{
                          boxShadow: isActive(item.path) 
                            ? `0 0 25px ${item.color}60, inset 0 1px 0 rgba(255,255,255,0.3)` 
                            : 'none',
                          textShadow: isActive(item.path) ? '0 0 10px rgba(255,255,255,0.8)' : 'none'
                        }}
                      >
                        {/* Effet de fond liquide */}
                        <div className="absolute inset-0 overflow-hidden rounded-2xl">
                          {isActive(item.path) && (
                            <motion.div
                              className="absolute inset-0 opacity-30"
                              animate={{
                                background: [
                                  `radial-gradient(circle at 20% 20%, ${item.color}40 0%, transparent 50%)`,
                                  `radial-gradient(circle at 80% 80%, ${item.color}40 0%, transparent 50%)`,
                                  `radial-gradient(circle at 20% 80%, ${item.color}40 0%, transparent 50%)`,
                                  `radial-gradient(circle at 80% 20%, ${item.color}40 0%, transparent 50%)`,
                                  `radial-gradient(circle at 20% 20%, ${item.color}40 0%, transparent 50%)`
                                ]
                              }}
                              transition={{ duration: 6, repeat: Infinity }}
                            />
                          )}
                        </div>

                        {/* Effet de scan laser */}
                        {hoveredItem === item.path && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                          />
                        )}

                        <motion.span 
                          className="relative z-10 flex items-center space-x-3"
                          whileHover={{ scale: 1.1 }}
                        >
                          <motion.span
                            className="flex items-center justify-center"
                            animate={isActive(item.path) ? { 
                              rotate: [0, 10, -10, 0],
                              scale: [1, 1.2, 1]
                            } : {}}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            {item.icon}
                          </motion.span>
                          <span 
                            className="font-black tracking-wide"
                            style={{ 
                              fontFamily: '"Inter", sans-serif',
                              textShadow: 'none',
                              filter: 'none'
                            }}
                          >
                            {item.label}
                          </span>
                        </motion.span>

                        {/* Indicateur actif amélioré */}
                        {isActive(item.path) && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5 }}
                          />
                        )}

                        {/* Aura de hover */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background: `radial-gradient(circle at center, ${item.color}25 0%, transparent 70%)`,
                            filter: 'blur(15px)'
                          }}
                        />
                      </Button>

                      {/* Tooltip premium */}
                      <AnimatePresence>
                        {hoveredItem === item.path && (
                          <motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 15, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 z-50"
                          >
                            <div className="bg-black/95 backdrop-blur-2xl border border-white/20 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-2xl"
                                 style={{ 
                                   boxShadow: `0 0 30px ${item.color}50, 0 10px 20px rgba(0,0,0,0.5)`,
                                   textShadow: 'none',
                                   filter: 'none'
                                 }}>
                              <div className="text-center">
                                <p className="font-bold mb-1" style={{ color: item.color }}>
                                  {item.label}
                                </p>
                                <p className="text-white/80 text-xs">{item.description}</p>
                              </div>
                              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-black/95 border-l border-t border-white/20 rotate-45"></div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Section droite avec contrôles */}
            <div className="flex items-center space-x-4">
              
              {/* Contrôle audio stylé */}
              <motion.button
                onClick={() => setMusicEnabled(!musicEnabled)}
                whileHover={{ scale: 1.15, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 text-white hover:border-violet-400/50 transition-all duration-300"
                style={{
                  boxShadow: musicEnabled 
                    ? '0 0 20px rgba(139,92,246,0.4)' 
                    : '0 0 15px rgba(255,255,255,0.1)'
                }}
              >
                <motion.div
                  animate={musicEnabled ? { 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {musicEnabled ? (
                    <Music className="w-5 h-5" />
                  ) : (
                    <VolumeX className="w-5 h-5" />
                  )}
                </motion.div>
              </motion.button>

              {/* Menu utilisateur ou connexion */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-3 p-3 rounded-2xl bg-gradient-to-r from-violet-500/20 to-purple-600/20 backdrop-blur-xl border border-violet-500/30 hover:border-violet-400/60 transition-all duration-300"
                      style={{
                        boxShadow: '0 0 20px rgba(139,92,246,0.3)'
                      }}
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="hidden sm:block text-white font-bold" style={{ textShadow: 'none' }}>
                        {user?.username}
                      </span>
                      <ChevronDown className="w-4 h-4 text-white/70" />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="bg-black/95 backdrop-blur-2xl border border-violet-500/30 text-white rounded-xl p-2"
                    align="end"
                  >
                    <DropdownMenuItem className="rounded-lg">
                      <User className="w-4 h-4 mr-2" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg">
                      <Settings className="w-4 h-4 mr-2" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator className="bg-violet-500/30" />
                        <DropdownMenuItem className="rounded-lg">
                          <Shield className="w-4 h-4 mr-2" />
                          <span>Administration</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="bg-violet-500/30" />
                    <DropdownMenuItem onClick={() => logout.mutate()} className="text-red-400 rounded-lg">
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
                      <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-violet-500/30 transition-all duration-300 border border-white/20">
                        <LogIn className="w-4 h-4 mr-2" />
                        <span style={{ textShadow: 'none' }}>Connexion</span>
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              )}

              {/* Menu mobile */}
              <div className="lg:hidden">
                <motion.button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white"
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

        {/* Menu mobile stylé */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="lg:hidden border-t border-violet-500/20 bg-black/95 backdrop-blur-2xl"
            >
              <div className="px-4 py-6 space-y-3">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.path}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        playClickSound();
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02, x: 10 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 ${
                          isActive(item.path)
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                            : 'text-white hover:text-white hover:bg-white/10'
                        }`}
                        style={{
                          textShadow: 'none'
                        }}
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