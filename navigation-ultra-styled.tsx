import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Crown, Menu, X, Home, LogIn, Users, Bell, Award, Settings, 
  User, LogOut, Shield, MessageCircle, Calendar, Camera, 
  Zap, Moon, Sun, Palette, Volume2, ChevronDown, Sparkles,
  Music, VolumeX
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

  // Bibliothèque de sons relaxants et chill
  const sounds = {
    click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUeA0OY5PO2dyMFl29GyD8',
    hover: 'data:audio/wav;base64,UklGRlwGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQEGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUeA0OY5PO2dyMFVGpGREM',
    navigation: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUeA0OY5PO2dyMFl29GyD9MUSIC',
    ambient: 'data:audio/wav;base64,UklGRlwGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQEGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUeA0OY5PO2dyMFVGpGREMCHILL'
  };

  const playSound = (soundType: keyof typeof sounds, volume = 0.3) => {
    if (!musicEnabled) return;
    
    try {
      const audio = new Audio(sounds[soundType]);
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch (error) {
      console.log('Audio non disponible');
    }
  };

  const playChillMusic = () => {
    if (!musicEnabled) return;
    
    // Arrêter la musique précédente
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    try {
      // Son ambient relaxant pour les changements de page
      const audio = new Audio(sounds.ambient);
      audio.volume = 0.1;
      audio.loop = false;
      audio.play().catch(() => {});
      setCurrentAudio(audio);
    } catch (error) {
      console.log('Musique non disponible');
    }
  };

  // Vibrations tactiles avancées
  const vibrate = (pattern: number[] = [30, 20, 30]) => {
    if (navigator.vibrate && isMobile) {
      navigator.vibrate(pattern);
    }
  };

  const toggleMobileMenu = () => {
    playSound('click', 0.4);
    vibrate([50, 30, 50, 30, 50]);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Fermer le menu mobile au changement de route
  useEffect(() => {
    if (isMobileMenuOpen) {
      playChillMusic();
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
    { href: '/', label: 'Accueil', icon: <Home className="w-5 h-5" />, gradient: 'from-purple-500 to-violet-600' },
    { href: '/events', label: 'Événements', icon: <Calendar className="w-5 h-5" />, gradient: 'from-violet-500 to-purple-600' },
    { href: '/members', label: 'Membres', icon: <Users className="w-5 h-5" />, gradient: 'from-purple-600 to-violet-500' },
    { href: '/announcements', label: 'Annonces', icon: <Bell className="w-5 h-5" />, gradient: 'from-violet-600 to-purple-500' },
    { href: '/credits', label: 'Crédits', icon: <Award className="w-5 h-5" />, gradient: 'from-purple-500 to-violet-600' },
  ] : [
    { href: '/login', label: 'Connexion', icon: <LogIn className="w-5 h-5" />, gradient: 'from-purple-500 to-violet-600' },
  ];

  return (
    <>
      {/* Navigation principale */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
        ? 'bg-black/98 backdrop-blur-xl shadow-2xl border-b border-purple-500/30' 
        : 'bg-black/85 backdrop-blur-lg'
      }`}>
        {/* Bordure néon animée avec effet de vague */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 animate-pulse"></div>
        </div>
        
        {/* Particules flottantes en arrière-plan */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full opacity-30"
              style={{ 
                backgroundColor: theme.accentColor,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                x: [0, Math.random() * 100],
                y: [0, Math.random() * 50],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.5, 1.5, 0.5]
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
          <div className="flex items-center justify-between h-16">
            {/* Logo avec effets holographiques */}
            <Link href="/" className="flex items-center space-x-3 group" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="relative">
                {/* Aura holographique */}
                <div 
                  className="absolute inset-0 rounded-full opacity-20 blur-xl group-hover:opacity-50 transition-all duration-500 animate-pulse"
                  style={{
                    background: `radial-gradient(circle, ${theme.primaryColor}, ${theme.secondaryColor}, ${theme.accentColor})`
                  }}
                ></div>
                
                {/* Anneau de particules autour du logo */}
                <div className="absolute inset-0 rounded-full">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full"
                      style={{ 
                        backgroundColor: theme.accentColor,
                        top: '50%',
                        left: '50%',
                        transformOrigin: `0px ${20 + i * 2}px`
                      }}
                      animate={{
                        rotate: [0, 360],
                        scale: [0.5, 1, 0.5],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
                
                <motion.div 
                  className="w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor}, ${theme.accentColor})`
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5,
                    boxShadow: `0 0 30px ${theme.primaryColor}80`
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Texture cristalline */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-white/10 via-transparent to-transparent"></div>
                  
                  <Crown className="text-white w-6 h-6 relative z-10 drop-shadow-lg" />
                  
                  {/* Reflets cristallins */}
                  <motion.div
                    className="absolute top-2 left-2 w-2 h-2 bg-white/40 rounded-full blur-sm"
                    animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </div>
              
              <div className="hidden sm:block">
                <motion.span 
                  className="text-xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.accentColor}, ${theme.secondaryColor})`
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  S.L.Z Guild
                </motion.span>
                <div className="text-xs text-gray-400 tracking-wider">ELITE GAMING</div>
              </div>
            </Link>

            {/* Navigation Desktop */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="group relative"
                    onMouseEnter={() => playSound('hover', 0.2)}
                    onClick={() => {
                      playSound('navigation', 0.3);
                      playChillMusic();
                    }}
                  >
                    <motion.div 
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 relative overflow-hidden ${
                        location === link.href
                          ? 'text-white shadow-xl'
                          : 'text-gray-300 hover:text-white'
                      }`}
                      style={{
                        backgroundColor: location === link.href 
                          ? theme.primaryColor
                          : 'transparent',
                        boxShadow: location === link.href 
                          ? `0 8px 32px ${theme.primaryColor}60`
                          : 'none'
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        backgroundColor: location !== link.href ? `${theme.primaryColor}30` : undefined
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Texture cristalline pour les boutons actifs */}
                      {location === link.href && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
                          <div className="absolute inset-0 bg-gradient-to-tl from-white/10 via-transparent to-transparent"></div>
                        </>
                      )}
                      
                      {/* Particules flottantes au survol */}
                      <AnimatePresence>
                        {location === link.href && (
                          <motion.div
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            {[...Array(5)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-1 h-1 rounded-full bg-white/60"
                                animate={{
                                  x: [0, Math.random() * 30 - 15],
                                  y: [0, Math.random() * 30 - 15],
                                  opacity: [0.6, 0, 0.6],
                                  scale: [0.5, 1, 0.5]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: i * 0.3
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
                      
                      <motion.span 
                        className="relative z-10"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {link.icon}
                      </motion.span>
                      <span className="font-semibold relative z-10">
                        {link.label}
                      </span>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Menu utilisateur Desktop avec effets */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Contrôle musique */}
              <motion.button
                onClick={() => {
                  setMusicEnabled(!musicEnabled);
                  playSound('click', 0.3);
                  vibrate();
                }}
                className="p-2 rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: `${theme.primaryColor}20`,
                  color: theme.primaryColor
                }}
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: `${theme.primaryColor}40`
                }}
                whileTap={{ scale: 0.9 }}
              >
                {musicEnabled ? <Music className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </motion.button>

              {isAuthenticated && user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          className="text-white font-semibold px-4 py-2 text-sm transition-all duration-300 relative overflow-hidden"
                          style={{
                            background: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                            boxShadow: `0 4px 20px ${theme.primaryColor}40`
                          }}
                          onClick={() => {
                            playSound('click', 0.4);
                            playChillMusic();
                          }}
                        >
                          {/* Texture cristalline */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
                          <Shield className="w-4 h-4 mr-2 relative z-10" />
                          <span className="relative z-10">Admin Panel</span>
                        </Button>
                      </motion.div>
                    </Link>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          variant="ghost" 
                          className="flex items-center space-x-2 p-2 rounded-xl transition-all duration-300"
                          style={{
                            backgroundColor: `${theme.primaryColor}20`,
                            borderColor: `${theme.primaryColor}40`
                          }}
                          onClick={() => playSound('hover', 0.2)}
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden border-2 relative"
                               style={{ borderColor: theme.primaryColor }}>
                            <img
                              src={user.profileImageUrl || `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 6}.png`}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                            {/* Effet holographique sur l'avatar */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
                          </div>
                          <span className="text-white font-medium hidden xl:block">{user.username}</span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </Button>
                      </motion.div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 bg-black/98 backdrop-blur-xl border-2 shadow-2xl"
                                       style={{ borderColor: `${theme.primaryColor}40` }}>
                      {/* ... reste du menu utilisateur ... */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Link href="/login">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      className="text-white font-semibold relative overflow-hidden"
                      style={{
                        background: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                        boxShadow: `0 4px 20px ${theme.primaryColor}40`
                      }}
                      onClick={() => {
                        playSound('click', 0.4);
                        playChillMusic();
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
                      <span className="relative z-10">Connexion</span>
                    </Button>
                  </motion.div>
                </Link>
              )}
            </div>

            {/* Bouton hamburger ULTRA STYLÉ */}
            <div className="lg:hidden mobile-menu-container">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-xl relative overflow-hidden transition-all duration-300"
                  style={{
                    backgroundColor: `${theme.primaryColor}20`,
                    borderColor: `${theme.primaryColor}40`
                  }}
                  onClick={toggleMobileMenu}
                >
                  {/* Texture cristalline */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
                  
                  {/* Particules d'énergie */}
                  <AnimatePresence>
                    {isMobileMenuOpen && (
                      <motion.div
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 rounded-full"
                            style={{ backgroundColor: theme.accentColor }}
                            animate={{
                              x: [0, Math.random() * 20 - 10],
                              y: [0, Math.random() * 20 - 10],
                              opacity: [0.8, 0, 0.8],
                              scale: [0.5, 1.5, 0.5]
                            }}
                            transition={{
                              duration: 1.5,
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

                  {/* Barres hamburger avec animations spectaculaires */}
                  <div className="relative w-6 h-6 flex flex-col justify-center items-center">
                    <motion.span 
                      className="block w-6 h-0.5 rounded-full shadow-lg"
                      style={{
                        background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.accentColor})`
                      }}
                      animate={{
                        rotate: isMobileMenuOpen ? 45 : 0,
                        y: isMobileMenuOpen ? 6 : 0,
                        scale: isMobileMenuOpen ? 1.1 : 1
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                    
                    <motion.span 
                      className="block w-5 h-0.5 rounded-full shadow-lg mt-1.5"
                      style={{
                        background: `linear-gradient(90deg, ${theme.secondaryColor}, ${theme.primaryColor})`
                      }}
                      animate={{
                        opacity: isMobileMenuOpen ? 0 : 1,
                        scale: isMobileMenuOpen ? 0 : 1,
                        rotate: isMobileMenuOpen ? 180 : 0
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                    
                    <motion.span 
                      className="block w-6 h-0.5 rounded-full shadow-lg mt-1.5"
                      style={{
                        background: `linear-gradient(90deg, ${theme.accentColor}, ${theme.secondaryColor})`
                      }}
                      animate={{
                        rotate: isMobileMenuOpen ? -45 : 0,
                        y: isMobileMenuOpen ? -6 : 0,
                        scale: isMobileMenuOpen ? 1.1 : 1
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  </div>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu mobile ULTRA SPECTACULAIRE avec overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Fond avec effet de particules */}
            <motion.div 
              className="absolute inset-0 backdrop-blur-xl"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${theme.primaryColor}20, black)`
              }}
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Particules flottantes dans le fond */}
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full opacity-20"
                  style={{ backgroundColor: theme.accentColor }}
                  animate={{
                    x: [0, Math.random() * window.innerWidth],
                    y: [0, Math.random() * window.innerHeight],
                    opacity: [0.2, 0.6, 0.2],
                    scale: [0.5, 2, 0.5]
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 2
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
                background: `linear-gradient(135deg, black, ${theme.primaryColor}10, black)`
              }}
              initial={{ x: '100%', rotateY: 90 }}
              animate={{ x: 0, rotateY: 0 }}
              exit={{ x: '100%', rotateY: 90 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 200,
                duration: 0.5
              }}
            >
              {/* Texture cristalline pour le menu */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-white/3 via-transparent to-transparent"></div>
              
              {/* Bordure holographique */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1 opacity-60"
                style={{
                  background: `linear-gradient(180deg, ${theme.primaryColor}, ${theme.accentColor}, ${theme.secondaryColor})`
                }}
              />

              {/* Header du menu avec effets */}
              <motion.div 
                className="flex items-center justify-between p-6 relative"
                style={{
                  background: `linear-gradient(90deg, ${theme.primaryColor}20, transparent)`
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="w-10 h-10 rounded-full flex items-center justify-center relative"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                    }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Crown className="text-white w-5 h-5 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-full"></div>
                  </motion.div>
                  <div>
                    <span className="text-white font-bold text-lg">S.L.Z Guild</span>
                    <div className="text-xs text-gray-400">ELITE GAMING</div>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{
                    backgroundColor: `${theme.primaryColor}20`
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: `${theme.primaryColor}40`
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </motion.div>

              {/* Profil utilisateur mobile avec effets */}
              {isAuthenticated && user && (
                <motion.div 
                  className="p-6 relative"
                  style={{
                    background: `linear-gradient(90deg, ${theme.secondaryColor}15, transparent)`
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className="w-16 h-16 rounded-full overflow-hidden border-3 relative"
                      style={{ borderColor: theme.primaryColor }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <img
                        src={user.profileImageUrl || `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 6}.png`}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
                    </motion.div>
                    <div>
                      <p className="font-bold text-white text-lg">{user.username}</p>
                      <p className="text-sm" style={{ color: theme.accentColor }}>
                        {user.isAdmin ? 'Administrateur' : 'Membre Élite'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation mobile avec animations spectaculaires */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-3">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => {
                          playSound('navigation', 0.3);
                          playChillMusic();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <motion.div 
                          className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                            location === link.href
                              ? 'text-white shadow-xl'
                              : 'text-gray-300 hover:text-white'
                          }`}
                          style={{
                            background: location === link.href 
                              ? `linear-gradient(90deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                              : 'transparent',
                            boxShadow: location === link.href 
                              ? `0 8px 32px ${theme.primaryColor}60`
                              : 'none'
                          }}
                          whileHover={{ 
                            scale: 1.05,
                            x: 10,
                            backgroundColor: location !== link.href ? `${theme.primaryColor}20` : undefined
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* Texture et effets pour les éléments actifs */}
                          {location === link.href && (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10"></div>
                              <motion.div
                                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Sparkles className="w-4 h-4" style={{ color: theme.accentColor }} />
                              </motion.div>
                            </>
                          )}
                          
                          <motion.span 
                            className="flex-shrink-0 relative z-10"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {link.icon}
                          </motion.span>
                          <span className="font-semibold text-lg relative z-10">
                            {link.label}
                          </span>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}

                  {/* Actions utilisateur mobile avec effets */}
                  {isAuthenticated && user && (
                    <>
                      <motion.div 
                        className="h-px my-6 relative"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${theme.primaryColor}, transparent)`
                        }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                          <motion.div 
                            className="flex items-center space-x-4 p-4 rounded-xl text-gray-300 hover:text-white transition-all duration-300"
                            whileHover={{ 
                              scale: 1.05,
                              x: 10,
                              backgroundColor: `${theme.primaryColor}20`
                            }}
                          >
                            <User className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">Mon Profil</span>
                          </motion.div>
                        </Link>
                      </motion.div>

                      {isAdmin && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.0 }}
                        >
                          <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                            <motion.div 
                              className="flex items-center space-x-4 p-4 rounded-xl transition-all duration-300"
                              style={{ color: theme.accentColor }}
                              whileHover={{ 
                                scale: 1.05,
                                x: 10,
                                backgroundColor: `${theme.accentColor}20`
                              }}
                            >
                              <Shield className="w-5 h-5 flex-shrink-0" />
                              <span className="font-medium">Administration</span>
                            </motion.div>
                          </Link>
                        </motion.div>
                      )}

                      <motion.div 
                        className="h-px my-6"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${theme.primaryColor}40, transparent)`
                        }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 1.1, duration: 0.5 }}
                      />

                      <motion.button
                        onClick={() => {
                          logout.mutate();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-4 p-4 rounded-xl text-gray-300 hover:text-white transition-all duration-300"
                        whileHover={{ 
                          scale: 1.05,
                          x: 10,
                          backgroundColor: '#ef444420'
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                      >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">Déconnexion</span>
                      </motion.button>
                    </>
                  )}
                </div>
              </div>

              {/* Footer du menu avec effets */}
              <motion.div 
                className="p-6 relative"
                style={{
                  background: `linear-gradient(90deg, ${theme.primaryColor}10, transparent)`
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    Elite Gaming Community
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4" style={{ color: theme.accentColor }} />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer pour éviter que le contenu soit caché sous la navbar */}
      <div className="h-16"></div>
    </>
  );
}