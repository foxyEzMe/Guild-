import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Crown, Menu, X, Home, LogIn, Users, Bell, Award, Settings, 
  User, LogOut, Shield, ChevronDown, Music, VolumeX, Sparkles,
  Calendar, Star, Gem, Flame, Eye, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useThemeCustomization } from '@/contexts/ThemeCustomizationContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const isMobile = useIsMobile();
  const { theme } = useThemeCustomization();
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navRef = useRef<HTMLElement>(null);

  // Sons ultra immersifs
  const playSound = (type: 'hover' | 'click' | 'navigation') => {
    if (!musicEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      
      const frequencies = { hover: 600, click: 800, navigation: 440 };
      oscillator.frequency.setValueAtTime(frequencies[type], ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    } catch (error) {
      console.log('Audio non disponible');
    }
  };

  // Vibrations tactiles
  const vibrate = (pattern: number[] = [25, 15, 25]) => {
    if (navigator.vibrate && isMobile) {
      navigator.vibrate(pattern);
    }
  };

  // Suivi de la souris pour effets interactifs
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    const nav = navRef.current;
    if (nav) {
      nav.addEventListener('mousemove', handleMouseMove);
      return () => nav.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const toggleMobileMenu = () => {
    playSound('click');
    vibrate([40, 20, 40, 20, 60]);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      playSound('navigation');
      setIsMobileMenuOpen(false);
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const navLinks = isAuthenticated ? [
    { href: '/', label: 'Accueil', icon: <Home className="w-5 h-5" />, accent: <Star className="w-3 h-3" />, color: theme.primaryColor },
    { href: '/events', label: 'Événements', icon: <Calendar className="w-5 h-5" />, accent: <Flame className="w-3 h-3" />, color: theme.accentColor },
    { href: '/members', label: 'Membres', icon: <Users className="w-5 h-5" />, accent: <Gem className="w-3 h-3" />, color: theme.secondaryColor },
    { href: '/announcements', label: 'Annonces', icon: <Bell className="w-5 h-5" />, accent: <Eye className="w-3 h-3" />, color: theme.primaryColor },
    { href: '/credits', label: 'Crédits', icon: <Award className="w-5 h-5" />, accent: <Crown className="w-3 h-3" />, color: theme.accentColor },
  ] : [
    { href: '/login', label: 'Connexion', icon: <LogIn className="w-5 h-5" />, accent: <Zap className="w-3 h-3" />, color: theme.primaryColor },
  ];

  return (
    <>
      {/* Navigation principale ULTRA ATTRACTIVE */}
      <motion.nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled 
          ? 'bg-black/95 backdrop-blur-2xl shadow-2xl' 
          : 'bg-black/85 backdrop-blur-xl'
        }`}
        style={{
          borderBottom: `2px solid ${theme.primaryColor}60`,
          boxShadow: scrolled 
            ? `0 10px 40px ${theme.primaryColor}40, inset 0 1px 0 ${theme.primaryColor}30`
            : `0 5px 20px ${theme.primaryColor}20`
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
      >
        {/* Bordure néon animée ULTRA AVANCÉE */}
        <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
          <motion.div 
            className="h-full opacity-80"
            style={{
              background: `linear-gradient(90deg, 
                transparent 0%, 
                ${theme.primaryColor} 25%, 
                ${theme.accentColor} 50%, 
                ${theme.secondaryColor} 75%, 
                transparent 100%)`
            }}
            animate={{
              x: ['-100%', '100%'],
              backgroundPosition: ['0% 50%', '200% 50%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Particules interactives magnétiques */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full opacity-40"
              style={{ 
                backgroundColor: i % 3 === 0 ? theme.primaryColor : i % 3 === 1 ? theme.accentColor : theme.secondaryColor,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                x: [
                  Math.random() * 50, 
                  mousePosition.x + (Math.random() * 30 - 15),
                  Math.random() * 50
                ],
                y: [
                  Math.random() * 50, 
                  mousePosition.y + (Math.random() * 20 - 10),
                  Math.random() * 50
                ],
                opacity: [0.4, 0.8, 0.4],
                scale: [0.8, 1.5, 0.8]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-18">
            {/* Logo ÉPOUSTOUFLANT */}
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative">
                {/* Aura holographique multicouche */}
                <motion.div 
                  className="absolute inset-0 rounded-full blur-2xl opacity-40"
                  style={{
                    background: `conic-gradient(from 0deg, 
                      ${theme.primaryColor}80, 
                      ${theme.accentColor}80, 
                      ${theme.secondaryColor}80, 
                      ${theme.primaryColor}80)`
                  }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Anneaux orbitaux magiques */}
                {[...Array(4)].map((_, ringIndex) => (
                  <div key={ringIndex} className="absolute inset-0 rounded-full">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{ 
                          backgroundColor: ringIndex % 2 === 0 ? theme.primaryColor : theme.accentColor,
                          left: '50%',
                          top: '50%',
                          transformOrigin: `0px ${20 + ringIndex * 6}px`
                        }}
                        animate={{
                          rotate: [0, ringIndex % 2 === 0 ? 360 : -360],
                          scale: [0.5, 1.2, 0.5],
                          opacity: [0.6, 1, 0.6]
                        }}
                        transition={{
                          duration: 5 - ringIndex * 0.5,
                          repeat: Infinity,
                          delay: i * 0.2 + ringIndex * 0.3,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                ))}
                
                <motion.div 
                  className="w-16 h-16 rounded-full flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `conic-gradient(from 45deg, 
                      ${theme.primaryColor}, 
                      ${theme.accentColor}, 
                      ${theme.secondaryColor}, 
                      ${theme.primaryColor})`
                  }}
                  whileHover={{ 
                    scale: 1.2,
                    rotate: 15,
                    boxShadow: `0 0 50px ${theme.primaryColor}90`
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Textures cristallines ultra détaillées */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-white/30 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/15 to-transparent"></div>
                  
                  <Crown className="text-white w-8 h-8 relative z-10 drop-shadow-2xl" />
                  
                  {/* Reflets cristallins dynamiques ultra réalistes */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute bg-white/60 rounded-full blur-sm"
                      style={{
                        width: `${1 + i * 0.5}px`,
                        height: `${1 + i * 0.5}px`,
                        top: `${15 + i * 10}%`,
                        left: `${20 + i * 12}%`
                      }}
                      animate={{ 
                        opacity: [0.4, 0.9, 0.4], 
                        scale: [1, 1.8, 1],
                        rotate: [0, 180, 0]
                      }}
                      transition={{ 
                        duration: 2 + i * 0.3, 
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </motion.div>
              </div>
              
              <div className="hidden sm:block">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.span 
                    className="text-2xl font-black bg-clip-text text-transparent leading-tight tracking-wide"
                    style={{
                      backgroundImage: `linear-gradient(45deg, 
                        ${theme.primaryColor}, 
                        ${theme.accentColor}, 
                        ${theme.secondaryColor}, 
                        ${theme.primaryColor})`
                    }}
                    animate={{
                      backgroundPosition: ['0% 50%', '200% 50%', '0% 50%']
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    S.L.Z Guild
                  </motion.span>
                  <div className="text-xs text-gray-300 tracking-widest font-bold">
                    ⚡ LEGENDARY ELITE GAMING ⚡
                  </div>
                </motion.div>
              </div>
            </Link>

            {/* Navigation Desktop ULTRA SPECTACULAIRE */}
            <div className="hidden lg:flex items-center space-x-3">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -40, rotateX: 90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    delay: index * 0.1, 
                    type: "spring", 
                    damping: 15,
                    stiffness: 100
                  }}
                >
                  <Link
                    href={link.href}
                    onMouseEnter={() => playSound('hover')}
                    onClick={() => playSound('navigation')}
                  >
                    <motion.div 
                      className={`flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-500 relative overflow-hidden group ${
                        location === link.href
                          ? 'text-white shadow-2xl'
                          : 'text-gray-200 hover:text-white'
                      }`}
                      style={{
                        background: location === link.href 
                          ? `linear-gradient(135deg, ${link.color}90, ${theme.accentColor}70)`
                          : 'transparent',
                        boxShadow: location === link.href 
                          ? `0 15px 50px ${link.color}60, inset 0 1px 0 rgba(255,255,255,0.3)`
                          : 'none',
                        border: `1px solid ${location === link.href ? link.color : 'transparent'}`
                      }}
                      whileHover={{ 
                        scale: 1.08,
                        y: -3,
                        background: location !== link.href ? `${link.color}30` : undefined,
                        boxShadow: location !== link.href ? `0 10px 30px ${link.color}40` : undefined
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Texture cristalline pour éléments actifs */}
                      {location === link.href && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent"></div>
                          <div className="absolute inset-0 bg-gradient-to-tl from-white/20 via-transparent to-transparent"></div>
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent"></div>
                          
                          {/* Particules d'énergie flottantes */}
                          <motion.div className="absolute inset-0 pointer-events-none">
                            {[...Array(12)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-1 h-1 rounded-full bg-white/80"
                                animate={{
                                  x: [0, Math.random() * 60 - 30],
                                  y: [0, Math.random() * 60 - 30],
                                  opacity: [0.8, 0, 0.8],
                                  scale: [0.5, 2, 0.5]
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  delay: i * 0.2
                                }}
                                style={{
                                  left: `${20 + Math.random() * 60}%`,
                                  top: `${20 + Math.random() * 60}%`
                                }}
                              />
                            ))}
                          </motion.div>
                        </>
                      )}
                      
                      {/* Icône avec effets spectaculaires */}
                      <motion.div 
                        className="relative z-10 flex items-center"
                        whileHover={{ scale: 1.4, rotate: 12 }}
                        transition={{ duration: 0.2 }}
                      >
                        {link.icon}
                        
                        {/* Accent icon qui pulse */}
                        <motion.div
                          className="absolute -top-2 -right-2"
                          style={{ color: theme.accentColor }}
                          animate={{ 
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                            rotate: [0, 360]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.3
                          }}
                        >
                          {link.accent}
                        </motion.div>
                      </motion.div>
                      
                      <span className="font-bold text-lg relative z-10 tracking-wide">
                        {link.label}
                      </span>
                      
                      {/* Indicateur holographique pour élément actif */}
                      {location === link.href && (
                        <motion.div
                          className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-3/4 h-1 rounded-full"
                          style={{ backgroundColor: theme.accentColor }}
                          animate={{ 
                            scaleX: [1, 1.3, 1], 
                            opacity: [0.8, 1, 0.8],
                            boxShadow: [
                              `0 0 10px ${theme.accentColor}60`,
                              `0 0 20px ${theme.accentColor}80`,
                              `0 0 10px ${theme.accentColor}60`
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      
                      {/* Effet de balayage lumineux au survol */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                        animate={{
                          x: ['-100%', '100%']
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 2
                        }}
                      />
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Menu utilisateur Desktop SPECTACULAIRE */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Contrôle musique ultra stylé */}
              <motion.button
                onClick={() => {
                  setMusicEnabled(!musicEnabled);
                  playSound('click');
                  vibrate();
                }}
                className="p-3 rounded-xl transition-all duration-300 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}40, ${theme.accentColor}30)`,
                  border: `1px solid ${theme.primaryColor}60`
                }}
                whileHover={{ 
                  scale: 1.15,
                  rotate: 10,
                  boxShadow: `0 10px 40px ${theme.primaryColor}60`
                }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
                <motion.div
                  animate={{ 
                    rotate: musicEnabled ? [0, 360] : 0,
                    scale: musicEnabled ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 2, repeat: musicEnabled ? Infinity : 0 }}
                  style={{ color: theme.primaryColor }}
                >
                  {musicEnabled ? <Music className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </motion.div>
                
                {/* Indicateur d'état */}
                <motion.div
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: musicEnabled ? theme.accentColor : '#ef4444' }}
                  animate={{ 
                    scale: [1, 1.5, 1], 
                    opacity: [0.7, 1, 0.7] 
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.button>

              {isAuthenticated && user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin">
                      <motion.div
                        whileHover={{ scale: 1.08, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          className="text-white font-bold px-6 py-3 text-sm transition-all duration-500 relative overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
                            boxShadow: `0 10px 40px ${theme.primaryColor}50`,
                            border: `1px solid ${theme.accentColor}60`
                          }}
                          onClick={() => playSound('click')}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent"></div>
                          <div className="absolute inset-0 bg-gradient-to-tl from-white/15 via-transparent to-transparent"></div>
                          <Shield className="w-5 h-5 mr-2 relative z-10" />
                          <span className="relative z-10">ADMIN PANEL</span>
                          
                          {/* Particules de pouvoir admin */}
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 rounded-full"
                              style={{ backgroundColor: theme.accentColor }}
                              animate={{ 
                                scale: [1, 2, 1], 
                                opacity: [0.6, 1, 0.6],
                                x: [0, Math.random() * 20 - 10],
                                y: [0, Math.random() * 20 - 10]
                              }}
                              transition={{ 
                                duration: 1.5, 
                                repeat: Infinity,
                                delay: i * 0.3
                              }}
                              style={{
                                top: `${30 + i * 20}%`,
                                right: `${10 + i * 15}%`
                              }}
                            />
                          ))}
                        </Button>
                      </motion.div>
                    </Link>
                  )}
                </>
              ) : (
                <Link href="/login">
                  <motion.div
                    whileHover={{ scale: 1.08, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      className="text-white font-bold px-6 py-3 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                        boxShadow: `0 10px 40px ${theme.primaryColor}50`,
                        border: `1px solid ${theme.primaryColor}60`
                      }}
                      onClick={() => playSound('click')}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent"></div>
                      <span className="relative z-10">CONNEXION</span>
                      
                      {/* Effet pulsant */}
                      <motion.div
                        className="absolute inset-0 rounded-lg"
                        style={{ border: `1px solid ${theme.accentColor}` }}
                        animate={{ opacity: [0, 0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </Button>
                  </motion.div>
                </Link>
              )}
            </div>

            {/* Bouton hamburger LÉGENDAIRE */}
            <div className="lg:hidden mobile-menu-container">
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-16 h-16 rounded-2xl relative overflow-hidden transition-all duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor}30, ${theme.accentColor}20)`,
                    border: `2px solid ${theme.primaryColor}50`
                  }}
                  onClick={toggleMobileMenu}
                >
                  {/* Texture cristalline */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-white/15 via-transparent to-transparent"></div>
                  
                  {/* Particules d'énergie ultra avancées */}
                  <AnimatePresence>
                    {isMobileMenuOpen && (
                      <motion.div className="absolute inset-0">
                        {[...Array(15)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1.5 h-1.5 rounded-full"
                            style={{ 
                              backgroundColor: i % 3 === 0 ? theme.primaryColor : i % 3 === 1 ? theme.accentColor : theme.secondaryColor,
                              left: `${20 + Math.random() * 60}%`,
                              top: `${20 + Math.random() * 60}%`
                            }}
                            animate={{
                              x: [0, Math.random() * 40 - 20],
                              y: [0, Math.random() * 40 - 20],
                              opacity: [0.9, 0, 0.9],
                              scale: [0.5, 2.5, 0.5]
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              delay: i * 0.1
                            }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Barres hamburger ULTRA SPECTACULAIRES */}
                  <div className="relative w-8 h-8 flex flex-col justify-center items-center">
                    <motion.span 
                      className="block w-8 h-1 rounded-full shadow-2xl"
                      style={{
                        background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.accentColor})`
                      }}
                      animate={{
                        rotate: isMobileMenuOpen ? 45 : 0,
                        y: isMobileMenuOpen ? 8 : 0,
                        scale: isMobileMenuOpen ? 1.3 : 1,
                        boxShadow: isMobileMenuOpen 
                          ? `0 0 30px ${theme.primaryColor}90` 
                          : `0 0 15px ${theme.primaryColor}50`
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                    
                    <motion.span 
                      className="block w-7 h-1 rounded-full shadow-2xl mt-2"
                      style={{
                        background: `linear-gradient(90deg, ${theme.accentColor}, ${theme.secondaryColor})`
                      }}
                      animate={{
                        opacity: isMobileMenuOpen ? 0 : 1,
                        scale: isMobileMenuOpen ? 0 : 1,
                        rotate: isMobileMenuOpen ? 180 : 0
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                    
                    <motion.span 
                      className="block w-8 h-1 rounded-full shadow-2xl mt-2"
                      style={{
                        background: `linear-gradient(90deg, ${theme.secondaryColor}, ${theme.primaryColor})`
                      }}
                      animate={{
                        rotate: isMobileMenuOpen ? -45 : 0,
                        y: isMobileMenuOpen ? -8 : 0,
                        scale: isMobileMenuOpen ? 1.3 : 1,
                        boxShadow: isMobileMenuOpen 
                          ? `0 0 30px ${theme.secondaryColor}90` 
                          : `0 0 15px ${theme.secondaryColor}50`
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                  </div>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="h-18"></div>
    </>
  );
}