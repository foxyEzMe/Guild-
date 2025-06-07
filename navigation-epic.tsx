import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Crown, Menu, X, Home, LogIn, Users, Bell, Award, Settings, 
  User, LogOut, Shield, ChevronDown, Music, VolumeX, Sparkles,
  Flame, Star, Zap, Diamond
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
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { theme } = useThemeCustomization();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [hoverGlow, setHoverGlow] = useState({ x: 0, y: 0, active: false });

  // Effet pour le défilement
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effet pour le suivi de la souris
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Empêcher le défilement quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Gestion des clics hors du menu pour le fermer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = () => {
    setIsOpen(false);
  };

  const navItems: NavItem[] = [
    {
      path: '/',
      label: 'Accueil',
      icon: <Home className="w-5 h-5" />,
      description: 'Retournez à la page principale',
      color: '#FF6B6B',
      gradient: 'from-rose-500 to-orange-500'
    },
    {
      path: '/members',
      label: 'Membres',
      icon: <Users className="w-5 h-5" />,
      description: 'Explorez notre communauté de joueurs élite',
      color: '#4ECDC4',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      path: '/announcements',
      label: 'Annonces',
      icon: <Bell className="w-5 h-5" />,
      description: 'Restez informé des dernières nouvelles',
      color: '#FFD166',
      gradient: 'from-amber-400 to-yellow-600'
    },
    {
      path: '/leaderboard',
      label: 'Classement',
      icon: <Award className="w-5 h-5" />,
      description: 'Voyez qui domine les classements',
      color: '#06D6A0',
      gradient: 'from-emerald-400 to-teal-600'
    },
    {
      path: '/profile',
      label: 'Profil',
      icon: <User className="w-5 h-5" />,
      description: 'Consultez et modifiez votre profil',
      color: '#118AB2',
      gradient: 'from-violet-500 to-purple-600'
    }
  ];

  // Variants pour les animations
  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      rotateX: -15,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.07
      }
    }
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      x: -30,
      rotateY: -10,
      scale: 0.9,
      filter: "blur(5px)",
      transition: {
        duration: 0.15
      }
    },
    open: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const hamburgerLineVariants = {
    closed: (custom: number) => ({
      rotate: 0,
      y: custom * 7
    }),
    open: (custom: number) => ({
      rotate: custom === 0 ? 45 : custom === 2 ? -45 : 0,
      y: custom === 1 ? 0 : custom === 0 ? 9 : 1,
      opacity: custom === 1 ? 0 : 1,
      transition: {
        duration: 0.3
      }
    })
  };

  return (
    <div ref={navRef} className="relative z-50">
      {/* Barre de navigation principale */}
      <motion.div 
        className={`fixed top-0 left-0 right-0 backdrop-blur-md ${scrolled ? 'bg-black/70' : 'bg-transparent'} transition-all duration-300`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          boxShadow: scrolled ? `0 0 20px ${theme.primaryColor}50` : 'none',
          borderBottom: scrolled ? `1px solid ${theme.primaryColor}30` : 'none'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo et nom du guild */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div 
                className="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden"
                animate={{ 
                  boxShadow: [
                    `0 0 10px ${theme.primaryColor}80`,
                    `0 0 20px ${theme.primaryColor}90`,
                    `0 0 10px ${theme.primaryColor}80`
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${theme.accentColor}, transparent 60%)`
                  }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                />
                <Crown className="text-white w-5 h-5 relative z-10 drop-shadow-glow" />
              </motion.div>
              
              <div className="relative">
                <span className="text-white font-bold text-lg tracking-wider">S.L.Z Guild</span>
                <motion.div 
                  className="absolute -bottom-3 left-0 right-0 h-0.5 rounded"
                  style={{ background: `linear-gradient(90deg, transparent, ${theme.accentColor}, transparent)` }}
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scaleX: [0.8, 1, 0.8]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="text-xs text-gray-400">ELITE GAMING</div>
              </div>
            </motion.div>

            {/* Navigation de bureau (masquée sur mobile) */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <div key={item.path}>
                  <motion.div
                    className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer ${
                      location === item.path
                        ? 'text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                    onClick={() => window.location.href = item.path}
                    onMouseEnter={() => setHoverGlow({ x: mousePosition.x, y: mousePosition.y, active: true })}
                    onMouseLeave={() => setHoverGlow({ ...hoverGlow, active: false })}
                    whileHover={{ 
                      scale: 1.05,
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <span className="flex items-center space-x-1.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </span>
                    
                    {/* Ligne d'effet sous l'élément actif */}
                    {location === item.path && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                        style={{ 
                          background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
                        }}
                        layoutId="activeNavIndicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center space-x-2">
              {/* Bouton musique */}
              <motion.button
                className="flex items-center justify-center w-8 h-8 rounded-full bg-black/30 text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMusicEnabled(!musicEnabled)}
                animate={{ 
                  boxShadow: musicEnabled ? [
                    `0 0 5px ${theme.accentColor}80`,
                    `0 0 8px ${theme.accentColor}90`,
                    `0 0 5px ${theme.accentColor}80`
                  ] : 'none'
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {musicEnabled ? <Music className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </motion.button>

              {/* Menu utilisateur ou boutons de connexion */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm text-white"
                      style={{
                        background: `linear-gradient(135deg, ${theme.primaryColor}90, ${theme.secondaryColor}90)`
                      }}
                      whileHover={{ scale: 1.05, boxShadow: `0 0 15px ${theme.primaryColor}50` }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="font-medium">{user?.username}</span>
                      <ChevronDown className="w-4 h-4" />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 backdrop-blur-xl bg-black/80 border border-gray-700 text-white p-2 rounded-xl">
                    <DropdownMenuItem className="flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer hover:bg-white/10">
                      <User className="w-4 h-4" />
                      <span>Mon profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer hover:bg-white/10">
                      <Settings className="w-4 h-4" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                    {user?.isAdmin && (
                      <DropdownMenuItem className="flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer hover:bg-white/10">
                        <Shield className="w-4 h-4" />
                        <span>Admin</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="my-1 bg-gray-700" />
                    <DropdownMenuItem 
                      className="flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer hover:bg-red-900/40"
                      onSelect={() => {
                        if (logout && logout.mutate) {
                          logout.mutate();
                        }
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <motion.a
                      className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md text-sm font-medium text-white"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Connexion</span>
                    </motion.a>
                  </Link>
                </div>
              )}

              {/* Bouton menu hamburger (visible seulement sur mobile) */}
              <motion.button
                className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-full"
                style={{
                  background: isOpen ? `linear-gradient(135deg, ${theme.primaryColor}90, ${theme.secondaryColor}90)` : 'transparent'
                }}
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-6 h-0.5 bg-white rounded-full my-0.5"
                    custom={i}
                    variants={hamburgerLineVariants}
                    animate={isOpen ? "open" : "closed"}
                  />
                ))}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Effet de particules suivant la souris */}
      {hoverGlow.active && (
        <motion.div
          className="fixed pointer-events-none z-0"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.accentColor}30 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Menu mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overlay du menu */}
            <motion.div 
              className="absolute inset-0 backdrop-blur-lg bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Contenu du menu */}
            <motion.div
              className="relative w-11/12 max-w-md rounded-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, rgba(20, 20, 30, 0.8), rgba(10, 10, 15, 0.9))`,
                border: `1px solid ${theme.primaryColor}40`,
                boxShadow: `0 0 30px ${theme.primaryColor}30`
              }}
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* Holographic-Glassmorphism Effect */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className="absolute inset-0 opacity-10"
                  style={{ 
                    backgroundImage: `
                      repeating-linear-gradient(
                        45deg, 
                        ${theme.primaryColor}, 
                        ${theme.secondaryColor}, 
                        ${theme.accentColor}, 
                        ${theme.primaryColor} 20px
                      )
                    `,
                    filter: 'blur(30px)'
                  }}
                  animate={{ 
                    backgroundPosition: ['0% 0%', '100% 100%'],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    duration: 15, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <motion.div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(
                      circle at ${mousePosition.x}px ${mousePosition.y}px,
                      ${theme.accentColor}10 5%,
                      transparent 60%
                    )`
                  }}
                />
              </div>
              
              {/* En-tête du menu */}
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
                    className="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden"
                    animate={{ 
                      boxShadow: [
                        `0 0 10px ${theme.primaryColor}80`,
                        `0 0 20px ${theme.primaryColor}90`,
                        `0 0 10px ${theme.primaryColor}80`
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <Crown className="text-white w-5 h-5 relative z-10" />
                  </motion.div>
                  <div>
                    <span className="text-white font-bold text-lg tracking-wider">S.L.Z Guild</span>
                    <div className="text-xs text-gray-400">ELITE GAMING</div>
                  </div>
                </div>
                
                <motion.button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </motion.div>
              
              {/* Navigation du menu */}
              <motion.div className="px-6 py-4">
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      variants={itemVariants}
                      onMouseEnter={() => setHoveredItem(item.path)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <Link href={item.path}>
                        <motion.a
                          className={`block relative overflow-hidden rounded-xl p-4 ${
                            location === item.path
                              ? 'text-white'
                              : 'text-gray-300'
                          }`}
                          onClick={handleItemClick}
                          whileHover={{ scale: 1.03, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            background: hoveredItem === item.path || location === item.path
                              ? `linear-gradient(120deg, ${item.color}30, transparent)`
                              : 'transparent',
                            border: hoveredItem === item.path || location === item.path
                              ? `1px solid ${item.color}50`
                              : '1px solid transparent'
                          }}
                        >
                          {/* Icône décorative d'arrière-plan */}
                          {(hoveredItem === item.path || location === item.path) && (
                            <motion.div
                              className="absolute right-4 top-1/2 opacity-10 text-white"
                              initial={{ opacity: 0, scale: 0.5, y: -20 }}
                              animate={{ opacity: 0.15, scale: 1.5, y: -40 }}
                              transition={{ duration: 0.5 }}
                            >
                              <Star className="w-16 h-16" />
                            </motion.div>
                          )}
                          
                          <div className="flex items-start">
                            <motion.div
                              className="mr-4 p-2 rounded-lg"
                              style={{
                                background: hoveredItem === item.path || location === item.path
                                  ? `linear-gradient(135deg, ${item.color}70, ${item.color}40)`
                                  : 'rgba(255, 255, 255, 0.1)'
                              }}
                              animate={{
                                boxShadow: hoveredItem === item.path || location === item.path
                                  ? [
                                      `0 0 5px ${item.color}50`,
                                      `0 0 10px ${item.color}60`,
                                      `0 0 5px ${item.color}50`
                                    ]
                                  : 'none'
                              }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              {item.icon}
                            </motion.div>
                            <div>
                              <span className="font-medium text-lg">{item.label}</span>
                              <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                            </div>
                          </div>
                          
                          {/* Lignes d'effet pour l'élément actif */}
                          {location === item.path && (
                            <>
                              <motion.div
                                className="absolute bottom-0 left-0 h-full w-1 rounded-l"
                                style={{ background: item.color }}
                                initial={{ opacity: 0, scaleY: 0 }}
                                animate={{ opacity: 1, scaleY: 1 }}
                                transition={{ duration: 0.3 }}
                              />
                              <motion.div
                                className="absolute bottom-0 left-0 h-0.5 w-full"
                                style={{ 
                                  background: `linear-gradient(90deg, ${item.color}, transparent)`,
                                }}
                                initial={{ opacity: 0, scaleX: 0, x: -100 }}
                                animate={{ opacity: 1, scaleX: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                              />
                            </>
                          )}
                        </motion.a>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Pied de page du menu */}
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
                    animate={{ 
                      rotate: [0, 360],
                      filter: [
                        `drop-shadow(0 0 2px ${theme.accentColor})`,
                        `drop-shadow(0 0 6px ${theme.accentColor})`,
                        `drop-shadow(0 0 2px ${theme.accentColor})`
                      ]
                    }}
                    transition={{ 
                      rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                      filter: { duration: 2, repeat: Infinity }
                    }}
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
    </div>
  );
}