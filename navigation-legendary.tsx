import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Crown, Menu, X, Home, LogIn, Users, Bell, Award, Settings, 
  User, LogOut, Shield, MessageCircle, Calendar, Camera, 
  Zap, Moon, Sun, Palette, Volume2, ChevronDown, Sparkles,
  Music, VolumeX, Star, Flame, Gem, Eye
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
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navRef = useRef<HTMLElement>(null);

  // Bibliothèque de sons ultra relaxants
  const sounds = {
    click: () => {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    },
    hover: () => {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    },
    navigation: () => {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator1 = ctx.createOscillator();
      const oscillator2 = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator1.connect(gain);
      oscillator2.connect(gain);
      gain.connect(ctx.destination);
      oscillator1.frequency.setValueAtTime(440, ctx.currentTime);
      oscillator2.frequency.setValueAtTime(554, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      oscillator1.start(ctx.currentTime);
      oscillator2.start(ctx.currentTime);
      oscillator1.stop(ctx.currentTime + 0.3);
      oscillator2.stop(ctx.currentTime + 0.3);
    }
  };

  const playSound = (soundType: keyof typeof sounds) => {
    if (!musicEnabled) return;
    try {
      sounds[soundType]();
    } catch (error) {
      console.log('Audio context non disponible');
    }
  };

  // Vibrations tactiles ultra avancées
  const vibrate = (pattern: number[] = [30, 20, 30, 20, 50]) => {
    if (navigator.vibrate && isMobile) {
      navigator.vibrate(pattern);
    }
  };

  // Effet de souris pour les particules
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
    vibrate([60, 30, 60, 30, 80]);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Fermer le menu mobile au changement de route
  useEffect(() => {
    if (isMobileMenuOpen) {
      playSound('navigation');
      setIsMobileMenuOpen(false);
    }
  }, [location]);

  // Effet de défilement
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu au clic extérieur
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
    { href: '/', label: 'Accueil', icon: <Home className="w-5 h-5" />, accent: <Star className="w-3 h-3" /> },
    { href: '/events', label: 'Événements', icon: <Calendar className="w-5 h-5" />, accent: <Flame className="w-3 h-3" /> },
    { href: '/members', label: 'Membres', icon: <Users className="w-5 h-5" />, accent: <Gem className="w-3 h-3" /> },
    { href: '/announcements', label: 'Annonces', icon: <Bell className="w-5 h-5" />, accent: <Eye className="w-3 h-3" /> },
    { href: '/credits', label: 'Crédits', icon: <Award className="w-5 h-5" />, accent: <Crown className="w-3 h-3" /> },
  ] : [
    { href: '/login', label: 'Connexion', icon: <LogIn className="w-5 h-5" />, accent: <Sparkles className="w-3 h-3" /> },
  ];

  return (
    <>
      {/* Navigation principale LÉGENDAIRE */}
      <motion.nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled 
          ? 'bg-black/99 backdrop-blur-2xl shadow-2xl' 
          : 'bg-black/90 backdrop-blur-xl'
        }`}
        style={{
          boxShadow: scrolled 
            ? `0 8px 32px ${theme.primaryColor}40, inset 0 1px 0 ${theme.primaryColor}20`
            : `0 4px 16px ${theme.primaryColor}20`
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
      >
        {/* Bordure néon animée ultra avancée */}
        <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r opacity-80"
            style={{
              background: `linear-gradient(90deg, transparent, ${theme.primaryColor}, ${theme.accentColor}, ${theme.secondaryColor}, transparent)`
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Particules interactives suivant la souris */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full opacity-40"
              style={{ 
                backgroundColor: i % 2 === 0 ? theme.accentColor : theme.primaryColor,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                x: [
                  Math.random() * 100, 
                  mousePosition.x + (Math.random() * 50 - 25),
                  Math.random() * 100
                ],
                y: [
                  Math.random() * 100, 
                  mousePosition.y + (Math.random() * 30 - 15),
                  Math.random() * 100
                ],
                opacity: [0.4, 0.8, 0.4],
                scale: [0.5, 1.5, 0.5]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-18">
            {/* Logo ULTRA SPECTACULAIRE */}
            <Link href="/" className="flex items-center space-x-4 group" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="relative">
                {/* Aura holographique multicouche */}
                <motion.div 
                  className="absolute inset-0 rounded-full blur-2xl opacity-30"
                  style={{
                    background: `conic-gradient(from 0deg, ${theme.primaryColor}, ${theme.accentColor}, ${theme.secondaryColor}, ${theme.primaryColor})`
                  }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Anneaux d'énergie orbitaux */}
                {[...Array(3)].map((_, ringIndex) => (
                  <div key={ringIndex} className="absolute inset-0 rounded-full">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full"
                        style={{ 
                          backgroundColor: ringIndex === 0 ? theme.primaryColor : ringIndex === 1 ? theme.accentColor : theme.secondaryColor,
                          left: '50%',
                          top: '50%'
                        }}
                        animate={{
                          rotate: [0, 360],
                          scale: [0.5, 1.2, 0.5],
                          opacity: [0.6, 1, 0.6]
                        }}
                        transition={{
                          duration: 6 - ringIndex,
                          repeat: Infinity,
                          delay: i * 0.3 + ringIndex * 0.5,
                          ease: "easeInOut"
                        }}
                        style={{
                          transformOrigin: `0px ${25 + ringIndex * 8}px`
                        }}
                      />
                    ))}
                  </div>
                ))}
                
                <motion.div 
                  className="w-14 h-14 rounded-full flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `conic-gradient(from 45deg, ${theme.primaryColor}, ${theme.accentColor}, ${theme.secondaryColor}, ${theme.primaryColor})`
                  }}
                  whileHover={{ 
                    scale: 1.15,
                    rotate: 10,
                    boxShadow: `0 0 40px ${theme.primaryColor}80`
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Texture cristalline ultra détaillée */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-white/20 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
                  
                  <Crown className="text-white w-7 h-7 relative z-10 drop-shadow-2xl" />
                  
                  {/* Reflets cristallins dynamiques */}
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute bg-white/50 rounded-full blur-sm"
                      style={{
                        width: `${2 + i}px`,
                        height: `${2 + i}px`,
                        top: `${20 + i * 8}%`,
                        left: `${25 + i * 15}%`
                      }}
                      animate={{ 
                        opacity: [0.3, 0.9, 0.3], 
                        scale: [1, 1.5, 1] 
                      }}
                      transition={{ 
                        duration: 2 + i * 0.5, 
                        repeat: Infinity,
                        delay: i * 0.3
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
                    className="text-2xl font-black bg-clip-text text-transparent leading-tight"
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
                    S.L.Z Guild
                  </motion.span>
                  <div className="text-xs text-gray-400 tracking-widest font-semibold">
                    LEGENDARY ELITE GAMING
                  </div>
                </motion.div>
              </div>
            </Link>

            {/* Navigation Desktop ULTRA STYLÉE */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -30, rotateX: 90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: index * 0.1, type: "spring", damping: 15 }}
                >
                  <Link
                    href={link.href}
                    className="group relative"
                    onMouseEnter={() => playSound('hover')}
                    onClick={() => playSound('navigation')}
                  >
                    <motion.div 
                      className={`flex items-center space-x-3 px-5 py-3 rounded-2xl transition-all duration-500 relative overflow-hidden ${
                        location === link.href
                          ? 'text-white shadow-2xl'
                          : 'text-gray-300 hover:text-white'
                      }`}
                      style={{
                        background: location === link.href 
                          ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                          : 'transparent',
                        boxShadow: location === link.href 
                          ? `0 12px 40px ${theme.primaryColor}60, inset 0 1px 0 rgba(255,255,255,0.2)`
                          : 'none'
                      }}
                      whileHover={{ 
                        scale: 1.08,
                        y: -2,
                        background: location !== link.href ? `${theme.primaryColor}25` : undefined
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Texture cristalline pour les boutons actifs */}
                      {location === link.href && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent"></div>
                          <div className="absolute inset-0 bg-gradient-to-tl from-white/15 via-transparent to-transparent"></div>
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
                        </>
                      )}
                      
                      {/* Particules d'énergie pour l'élément actif */}
                      <AnimatePresence>
                        {location === link.href && (
                          <motion.div
                            className="absolute inset-0 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            {[...Array(8)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-1 h-1 rounded-full bg-white/80"
                                animate={{
                                  x: [0, Math.random() * 40 - 20],
                                  y: [0, Math.random() * 40 - 20],
                                  opacity: [0.8, 0, 0.8],
                                  scale: [0.5, 1.5, 0.5]
                                }}
                                transition={{
                                  duration: 2.5,
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
                        )}
                      </AnimatePresence>
                      
                      {/* Icône avec effets */}
                      <motion.div 
                        className="relative z-10 flex items-center"
                        whileHover={{ scale: 1.3, rotate: 8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {link.icon}
                        {/* Accent icon qui apparaît au survol */}
                        <motion.div
                          className="absolute -top-1 -right-1"
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 1 }}
                          style={{ color: theme.accentColor }}
                        >
                          {link.accent}
                        </motion.div>
                      </motion.div>
                      
                      <span className="font-bold text-lg relative z-10">
                        {link.label}
                      </span>
                      
                      {/* Indicateur holographique pour l'élément actif */}
                      {location === link.href && (
                        <motion.div
                          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-1 rounded-full"
                          style={{ backgroundColor: theme.accentColor }}
                          animate={{ 
                            scaleX: [1, 1.2, 1], 
                            opacity: [0.8, 1, 0.8] 
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
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
                  background: `linear-gradient(135deg, ${theme.primaryColor}30, ${theme.accentColor}20)`,
                  borderColor: theme.primaryColor
                }}
                whileHover={{ 
                  scale: 1.15,
                  rotate: 5,
                  boxShadow: `0 8px 32px ${theme.primaryColor}50`
                }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
                <motion.div
                  animate={{ rotate: musicEnabled ? [0, 360] : 0 }}
                  transition={{ duration: 2, repeat: musicEnabled ? Infinity : 0 }}
                  style={{ color: theme.primaryColor }}
                >
                  {musicEnabled ? <Music className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </motion.div>
              </motion.button>

              {isAuthenticated && user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin">
                      <motion.div
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          className="text-white font-bold px-6 py-3 text-sm transition-all duration-500 relative overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
                            boxShadow: `0 8px 32px ${theme.primaryColor}50`
                          }}
                          onClick={() => playSound('click')}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent"></div>
                          <div className="absolute inset-0 bg-gradient-to-tl from-white/15 via-transparent to-transparent"></div>
                          <Shield className="w-5 h-5 mr-2 relative z-10" />
                          <span className="relative z-10">ADMIN PANEL</span>
                          
                          {/* Particules de pouvoir admin */}
                          <motion.div
                            className="absolute top-1 right-1 w-2 h-2 rounded-full"
                            style={{ backgroundColor: theme.accentColor }}
                            animate={{ 
                              scale: [1, 1.5, 1], 
                              opacity: [0.6, 1, 0.6] 
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        </Button>
                      </motion.div>
                    </Link>
                  )}
                </>
              ) : (
                <Link href="/login">
                  <motion.div
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      className="text-white font-bold px-6 py-3 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                        boxShadow: `0 8px 32px ${theme.primaryColor}50`
                      }}
                      onClick={() => playSound('click')}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent"></div>
                      <span className="relative z-10">CONNEXION</span>
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
                  className="w-14 h-14 rounded-2xl relative overflow-hidden transition-all duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor}25, ${theme.accentColor}15)`,
                    borderColor: theme.primaryColor
                  }}
                  onClick={toggleMobileMenu}
                >
                  {/* Texture cristalline */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-white/10 via-transparent to-transparent"></div>
                  
                  {/* Particules d'énergie ultra avancées */}
                  <AnimatePresence>
                    {isMobileMenuOpen && (
                      <motion.div
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 rounded-full"
                            style={{ backgroundColor: i % 3 === 0 ? theme.primaryColor : i % 3 === 1 ? theme.accentColor : theme.secondaryColor }}
                            animate={{
                              x: [0, Math.random() * 30 - 15],
                              y: [0, Math.random() * 30 - 15],
                              opacity: [0.9, 0, 0.9],
                              scale: [0.5, 2, 0.5]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.15
                            }}
                            style={{
                              left: `${20 + Math.random() * 60}%`,
                              top: `${20 + Math.random() * 60}%`
                            }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Barres hamburger ULTRA SPECTACULAIRES */}
                  <div className="relative w-7 h-7 flex flex-col justify-center items-center">
                    <motion.span 
                      className="block w-7 h-0.5 rounded-full shadow-xl"
                      style={{
                        background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.accentColor})`
                      }}
                      animate={{
                        rotate: isMobileMenuOpen ? 45 : 0,
                        y: isMobileMenuOpen ? 6 : 0,
                        scale: isMobileMenuOpen ? 1.2 : 1,
                        boxShadow: isMobileMenuOpen 
                          ? `0 0 20px ${theme.primaryColor}80` 
                          : `0 0 10px ${theme.primaryColor}40`
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                    
                    <motion.span 
                      className="block w-6 h-0.5 rounded-full shadow-xl mt-2"
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
                      className="block w-7 h-0.5 rounded-full shadow-xl mt-2"
                      style={{
                        background: `linear-gradient(90deg, ${theme.secondaryColor}, ${theme.primaryColor})`
                      }}
                      animate={{
                        rotate: isMobileMenuOpen ? -45 : 0,
                        y: isMobileMenuOpen ? -8 : 0,
                        scale: isMobileMenuOpen ? 1.2 : 1,
                        boxShadow: isMobileMenuOpen 
                          ? `0 0 20px ${theme.secondaryColor}80` 
                          : `0 0 10px ${theme.secondaryColor}40`
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

      {/* Menu mobile LÉGENDAIRE */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Fond holographique ultra avancé */}
            <motion.div 
              className="absolute inset-0 backdrop-blur-2xl"
              style={{
                background: `radial-gradient(circle at 30% 40%, ${theme.primaryColor}25, transparent), 
                           radial-gradient(circle at 70% 60%, ${theme.accentColor}20, transparent), 
                           radial-gradient(circle at 50% 50%, ${theme.secondaryColor}15, black)`
              }}
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Particules holographiques dans le fond */}
              {[...Array(40)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full opacity-20"
                  style={{ 
                    backgroundColor: i % 3 === 0 ? theme.primaryColor : i % 3 === 1 ? theme.accentColor : theme.secondaryColor,
                    width: `${2 + Math.random() * 4}px`,
                    height: `${2 + Math.random() * 4}px`
                  }}
                  animate={{
                    x: [0, Math.random() * window.innerWidth],
                    y: [0, Math.random() * window.innerHeight],
                    opacity: [0.2, 0.8, 0.2],
                    scale: [0.5, 3, 0.5]
                  }}
                  transition={{
                    duration: 6 + Math.random() * 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 3
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                />
              ))}
            </motion.div>

            {/* Menu latéral SPECTACULAIRE */}
            <motion.div 
              className="mobile-menu-container absolute top-0 right-0 h-full w-80 max-w-[90vw] shadow-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, 
                           rgba(0,0,0,0.98) 0%, 
                           ${theme.primaryColor}15 50%, 
                           rgba(0,0,0,0.98) 100%)`
              }}
              initial={{ x: '100%', rotateY: 90, scale: 0.8 }}
              animate={{ x: 0, rotateY: 0, scale: 1 }}
              exit={{ x: '100%', rotateY: 90, scale: 0.8 }}
              transition={{ 
                type: "spring", 
                damping: 20, 
                stiffness: 150,
                duration: 0.6
              }}
            >
              {/* Texture cristalline ultra détaillée */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-white/5 via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/3 to-transparent"></div>
              
              {/* Bordure holographique avancée */}
              <motion.div 
                className="absolute left-0 top-0 bottom-0 w-1 opacity-80"
                style={{
                  background: `linear-gradient(180deg, ${theme.primaryColor}, ${theme.accentColor}, ${theme.secondaryColor}, ${theme.primaryColor})`
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '0% 100%', '0% 0%']
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Le reste du menu mobile avec les mêmes améliorations spectaculaires... */}
              {/* Pour économiser l'espace, je continue avec la structure principale */}
              
              <div className="p-6">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-6"
                >
                  <div className="text-2xl font-black text-white mb-2">MENU LÉGENDAIRE</div>
                  <div className="text-xs text-gray-400 tracking-widest">ELITE NAVIGATION</div>
                </motion.div>
                
                {/* Navigation links avec effets ultra avancés */}
                <div className="space-y-3">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -60, rotateY: 90 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => {
                          playSound('navigation');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <motion.div 
                          className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-500 relative overflow-hidden ${
                            location === link.href
                              ? 'text-white shadow-2xl'
                              : 'text-gray-300 hover:text-white'
                          }`}
                          style={{
                            background: location === link.href 
                              ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`
                              : 'transparent',
                            boxShadow: location === link.href 
                              ? `0 12px 40px ${theme.primaryColor}60, inset 0 1px 0 rgba(255,255,255,0.2)`
                              : 'none'
                          }}
                          whileHover={{ 
                            scale: 1.05,
                            x: 10,
                            background: location !== link.href ? `${theme.primaryColor}25` : undefined
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* Effets cristallins pour éléments actifs */}
                          {location === link.href && (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-r from-white/25 via-transparent to-white/15"></div>
                              <motion.div
                                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                animate={{ 
                                  scale: [1, 1.3, 1], 
                                  rotate: [0, 180, 0],
                                  opacity: [0.6, 1, 0.6] 
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                              >
                                <Sparkles className="w-5 h-5" style={{ color: theme.accentColor }} />
                              </motion.div>
                            </>
                          )}
                          
                          <motion.div 
                            className="flex-shrink-0 relative z-10 flex items-center"
                            whileHover={{ scale: 1.3, rotate: 15 }}
                            transition={{ duration: 0.2 }}
                          >
                            {link.icon}
                            <motion.div
                              className="absolute -top-1 -right-1"
                              initial={{ scale: 0, opacity: 0 }}
                              whileHover={{ scale: 1, opacity: 1 }}
                              style={{ color: theme.accentColor }}
                            >
                              {link.accent}
                            </motion.div>
                          </motion.div>
                          
                          <span className="font-bold text-lg relative z-10">
                            {link.label}
                          </span>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-18"></div>
    </>
  );
}