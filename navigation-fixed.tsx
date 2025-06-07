import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Crown, Menu, X, Home, LogIn, Users, Bell, Award, Settings, 
  User, LogOut, Shield, ChevronDown, Music, VolumeX, Sparkles
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

  // Sons ultra relaxants avec Web Audio API
  const playSound = (frequency: number, duration: number = 0.2) => {
    if (!musicEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      console.log('Audio context non disponible');
    }
  };

  // Vibrations tactiles
  const vibrate = (pattern: number[] = [30, 20, 30]) => {
    if (navigator.vibrate && isMobile) {
      navigator.vibrate(pattern);
    }
  };

  const toggleMobileMenu = () => {
    playSound(800, 0.1);
    vibrate([50, 30, 50]);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      playSound(440, 0.3);
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
    { href: '/', label: 'Accueil', icon: <Home className="w-5 h-5" /> },
    { href: '/events', label: 'Événements', icon: <Bell className="w-5 h-5" /> },
    { href: '/members', label: 'Membres', icon: <Users className="w-5 h-5" /> },
    { href: '/announcements', label: 'Annonces', icon: <Bell className="w-5 h-5" /> },
    { href: '/credits', label: 'Crédits', icon: <Award className="w-5 h-5" /> },
  ] : [
    { href: '/login', label: 'Connexion', icon: <LogIn className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Navigation principale */}
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
          ? 'bg-black/98 backdrop-blur-xl shadow-2xl' 
          : 'bg-black/90 backdrop-blur-lg'
        }`}
        style={{
          borderBottom: `1px solid ${theme.primaryColor}40`
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
      >
        {/* Bordure néon animée */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${theme.primaryColor}, ${theme.accentColor}, transparent)`
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="w-12 h-12 rounded-full flex items-center justify-center relative"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Crown className="text-white w-6 h-6" />
              </motion.div>
              
              <div className="hidden sm:block">
                <span 
                  className="text-xl font-bold"
                  style={{ color: theme.primaryColor }}
                >
                  S.L.Z Guild
                </span>
                <div className="text-xs text-gray-400">ELITE GAMING</div>
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
                    onMouseEnter={() => playSound(600, 0.1)}
                    onClick={() => playSound(440, 0.3)}
                  >
                    <motion.div 
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        location === link.href
                          ? 'text-white shadow-lg'
                          : 'text-gray-300 hover:text-white'
                      }`}
                      style={{
                        backgroundColor: location === link.href ? theme.primaryColor : 'transparent',
                        boxShadow: location === link.href ? `0 4px 20px ${theme.primaryColor}40` : 'none'
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        backgroundColor: location !== link.href ? `${theme.primaryColor}20` : undefined
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.span whileHover={{ scale: 1.2 }}>
                        {link.icon}
                      </motion.span>
                      <span className="font-medium">{link.label}</span>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Menu utilisateur Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Contrôle musique */}
              <motion.button
                onClick={() => {
                  setMusicEnabled(!musicEnabled);
                  playSound(800, 0.2);
                  vibrate();
                }}
                className="p-2 rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: `${theme.primaryColor}20`,
                  color: theme.primaryColor
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {musicEnabled ? <Music className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </motion.button>

              {isAuthenticated && user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          className="text-white font-medium px-4 py-2"
                          style={{
                            background: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                          }}
                          onClick={() => playSound(880, 0.2)}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Admin
                        </Button>
                      </motion.div>
                    </Link>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Button 
                          variant="ghost" 
                          className="flex items-center space-x-2 p-2 rounded-lg"
                          style={{ backgroundColor: `${theme.primaryColor}20` }}
                        >
                          <div 
                            className="w-8 h-8 rounded-full overflow-hidden border-2"
                            style={{ borderColor: theme.primaryColor }}
                          >
                            <img
                              src={user.profileImageUrl || `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 6}.png`}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-white font-medium hidden xl:block">{user.username}</span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </Button>
                      </motion.div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      className="w-64 bg-black/95 backdrop-blur-xl border shadow-2xl"
                      style={{ borderColor: `${theme.primaryColor}40` }}
                    >
                      <div className="flex items-center space-x-3 p-3">
                        <div 
                          className="w-10 h-10 rounded-full overflow-hidden border"
                          style={{ borderColor: theme.primaryColor }}
                        >
                          <img
                            src={user.profileImageUrl || `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 6}.png`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.username}</p>
                          <p className="text-sm" style={{ color: theme.accentColor }}>
                            {user.isAdmin ? 'Admin' : 'Membre'}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator style={{ backgroundColor: `${theme.primaryColor}20` }} />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center space-x-3 p-3 hover:bg-purple-500/10">
                          <User className="w-4 h-4" />
                          <span>Profil</span>
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center space-x-3 p-3 hover:bg-purple-500/10">
                            <Settings className="w-4 h-4" />
                            <span>Administration</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator style={{ backgroundColor: `${theme.primaryColor}20` }} />
                      <DropdownMenuItem 
                        onClick={() => logout.mutate()}
                        className="flex items-center space-x-3 p-3 hover:bg-red-500/10 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Déconnexion</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Link href="/login">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      className="text-white font-medium"
                      style={{
                        background: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                      }}
                      onClick={() => playSound(660, 0.3)}
                    >
                      Connexion
                    </Button>
                  </motion.div>
                </Link>
              )}
            </div>

            {/* Bouton hamburger mobile */}
            <div className="lg:hidden mobile-menu-container">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-lg transition-all duration-300"
                  style={{
                    backgroundColor: `${theme.primaryColor}20`,
                    borderColor: `${theme.primaryColor}40`
                  }}
                  onClick={toggleMobileMenu}
                >
                  <div className="relative w-6 h-6 flex flex-col justify-center items-center">
                    <motion.span 
                      className="block w-6 h-0.5 rounded-full"
                      style={{ backgroundColor: theme.primaryColor }}
                      animate={{
                        rotate: isMobileMenuOpen ? 45 : 0,
                        y: isMobileMenuOpen ? 6 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.span 
                      className="block w-5 h-0.5 rounded-full mt-1.5"
                      style={{ backgroundColor: theme.secondaryColor }}
                      animate={{
                        opacity: isMobileMenuOpen ? 0 : 1,
                        scale: isMobileMenuOpen ? 0 : 1
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.span 
                      className="block w-6 h-0.5 rounded-full mt-1.5"
                      style={{ backgroundColor: theme.accentColor }}
                      animate={{
                        rotate: isMobileMenuOpen ? -45 : 0,
                        y: isMobileMenuOpen ? -6 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Menu mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="absolute inset-0 backdrop-blur-xl"
              style={{
                background: `radial-gradient(circle, ${theme.primaryColor}20, black)`
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div 
              className="mobile-menu-container absolute top-0 right-0 h-full w-80 max-w-[90vw] shadow-2xl"
              style={{
                background: `linear-gradient(135deg, black, ${theme.primaryColor}10, black)`
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <motion.div 
                className="flex items-center justify-between p-6"
                style={{ borderBottom: `1px solid ${theme.primaryColor}20` }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                    }}
                  >
                    <Crown className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-white font-bold">S.L.Z Guild</span>
                    <div className="text-xs text-gray-400">ELITE GAMING</div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10"
                  style={{ backgroundColor: `${theme.primaryColor}20` }}
                >
                  <X className="w-5 h-5 text-white" />
                </Button>
              </motion.div>

              {/* Profil utilisateur mobile */}
              {isAuthenticated && user && (
                <motion.div 
                  className="p-6"
                  style={{ borderBottom: `1px solid ${theme.primaryColor}20` }}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-full overflow-hidden border-2"
                      style={{ borderColor: theme.primaryColor }}
                    >
                      <img
                        src={user.profileImageUrl || `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 6}.png`}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-white">{user.username}</p>
                      <p className="text-sm" style={{ color: theme.accentColor }}>
                        {user.isAdmin ? 'Administrateur' : 'Membre'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation mobile */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => {
                          playSound(440, 0.3);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <motion.div 
                          className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 ${
                            location === link.href
                              ? 'text-white shadow-lg'
                              : 'text-gray-300 hover:text-white'
                          }`}
                          style={{
                            backgroundColor: location === link.href ? theme.primaryColor : 'transparent'
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            x: 5,
                            backgroundColor: location !== link.href ? `${theme.primaryColor}20` : undefined
                          }}
                        >
                          <span className="flex-shrink-0">{link.icon}</span>
                          <span className="font-medium">{link.label}</span>
                          {location === link.href && (
                            <Sparkles className="w-4 h-4 ml-auto" style={{ color: theme.accentColor }} />
                          )}
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

      <div className="h-16"></div>
    </>
  );
}