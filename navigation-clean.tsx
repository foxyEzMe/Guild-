import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Crown, Menu, X, Home, Users, Bell, LogIn, User, LogOut, Settings, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems: NavItem[] = [
    {
      path: '/',
      label: 'Accueil',
      icon: <Home className="w-5 h-5" />,
      description: 'QG Principal',
      color: '#8B5CF6',
      gradient: 'from-violet-500 to-purple-600'
    },

    {
      path: '/credits',
      label: 'Crédits',
      icon: <Crown className="w-5 h-5" />,
      description: 'Hall of Fame',
      color: '#F59E0B',
      gradient: 'from-amber-500 to-orange-600'
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

  const isActive = (path: string) => {
    return location === path || (path !== '/' && location.startsWith(path));
  };

  return (
    <motion.nav
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
      
      {/* Lignes de néon */}
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
          
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-4 group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/">
              <motion.div 
                className="relative"
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:shadow-[0_0_40px_rgba(139,92,246,0.8)] transition-all duration-500">
                  <Crown className="w-8 h-8 text-white relative z-10" />
                  
                  {/* Effet de scan */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent"
                    animate={{ y: ['-150%', '150%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  />
                </div>
              </motion.div>
              
              <div className="hidden sm:block">
                <motion.h1 
                  className="text-3xl font-black bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent leading-tight"
                  style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '0.05em' }}
                >
                  BLACK HEART
                </motion.h1>
                <p className="text-xs text-white font-bold tracking-[0.2em] opacity-80">GUILD</p>
              </div>
            </Link>
          </motion.div>

          {/* Navigation Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                onHoverStart={() => setHoveredItem(item.path)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <Link href={item.path}>
                  <motion.div
                    className="relative group"
                    whileHover={{ scale: 1.08, rotateY: 8 }}
                    whileTap={{ scale: 0.95 }}
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
                          : 'none'
                      }}
                    >
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
                          style={{ fontFamily: '"Inter", sans-serif' }}
                        >
                          {item.label}
                        </span>
                      </motion.span>

                      {/* Indicateur actif */}
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

                    {/* Tooltip */}
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
                               style={{ boxShadow: `0 0 30px ${item.color}50, 0 10px 20px rgba(0,0,0,0.5)` }}>
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

          {/* Section droite */}
          <div className="flex items-center space-x-4">
            

            
            {/* Bouton Admin Sécurisé intégré dans la navigation */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
              onHoverStart={() => setHoveredItem('/admin')}
              onHoverEnd={() => setHoveredItem(null)}
            >
              <Button
                onClick={() => {
                  const password = prompt("Mot de passe administrateur requis:");
                  if (password === "BLACKHEART_ADMIN_2024_ELITE") {
                    window.location.href = "/admin";
                  } else if (password !== null) {
                    alert("Accès refusé. Mot de passe incorrect.");
                  }
                }}
                className="relative px-6 py-3 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white font-bold text-sm rounded-2xl border-0 overflow-hidden group transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-red-500/25"
                style={{ boxShadow: '0 0 20px rgba(239,68,68,0.3)' }}
              >
                {/* Fond animé */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  animate={{ 
                    x: [-100, 100],
                    opacity: [0, 0.8, 0]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Contenu */}
                <motion.span 
                  className="relative z-10 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <Shield className="w-5 h-5" />
                  </motion.div>
                  <span 
                    className="font-black tracking-wider"
                    style={{ fontFamily: '"Inter", sans-serif' }}
                  >
                    ADMIN
                  </span>
                </motion.span>

                {/* Aura de hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(239,68,68,0.4) 0%, transparent 70%)',
                    filter: 'blur(15px)'
                  }}
                />
              </Button>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredItem === '/admin' && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 z-50"
                  >
                    <div className="bg-black/95 backdrop-blur-2xl border border-red-500/30 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-2xl"
                         style={{ boxShadow: '0 0 30px rgba(239,68,68,0.5), 0 10px 20px rgba(0,0,0,0.5)' }}>
                      <div className="text-center">
                        <p className="font-bold mb-1 text-red-400">
                          PANEL ADMIN
                        </p>
                        <p className="text-white/80 text-xs">Zone sécurisée</p>
                      </div>
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-black/95 border-l border-t border-red-500/30 rotate-45"></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Menu burger amélioré (visible sur tous les écrans) */}
            <div className="md:block">
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-3 rounded-xl bg-gradient-to-br from-violet-500/25 to-purple-600/25 backdrop-blur-xl border border-violet-500/40 hover:border-violet-400/70 text-white group overflow-hidden transition-all duration-300"
                style={{ boxShadow: '0 0 25px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' }}
              >
                {/* Effet de fond animé */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-600/10"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Lignes animées du burger - optimisé PC */}
                <div className="relative z-10 w-7 h-7 flex flex-col justify-center items-center">
                  <motion.div
                    className="w-7 h-0.5 bg-gradient-to-r from-white to-violet-200 rounded-full mb-1.5 shadow-sm"
                    animate={isMobileMenuOpen ? { 
                      rotate: 45, 
                      y: 7,
                      background: 'linear-gradient(90deg, #8B5CF6, #A855F7)'
                    } : { 
                      rotate: 0, 
                      y: 0,
                      background: 'linear-gradient(90deg, #FFFFFF, #DDD6FE)'
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="w-6 h-0.5 bg-gradient-to-r from-violet-200 to-purple-200 rounded-full mb-1.5 shadow-sm"
                    animate={isMobileMenuOpen ? { 
                      opacity: 0,
                      scale: 0,
                      rotate: 180
                    } : { 
                      opacity: 1,
                      scale: 1,
                      rotate: 0
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="w-7 h-0.5 bg-gradient-to-r from-white to-violet-200 rounded-full shadow-sm"
                    animate={isMobileMenuOpen ? { 
                      rotate: -45, 
                      y: -7,
                      background: 'linear-gradient(90deg, #8B5CF6, #A855F7)'
                    } : { 
                      rotate: 0, 
                      y: 0,
                      background: 'linear-gradient(90deg, #FFFFFF, #DDD6FE)'
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                </div>

                {/* Particules sur hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(139,92,246,0.3) 0%, transparent 70%)',
                    filter: 'blur(10px)'
                  }}
                />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="border-t border-violet-500/20 bg-black/95 backdrop-blur-2xl"
          >
            <div className="px-6 py-8 space-y-4 max-w-md mx-auto lg:max-w-2xl">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.03, x: 15 }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex items-center space-x-5 p-5 rounded-2xl transition-all duration-300 border ${
                        isActive(item.path)
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow-2xl border-white/20`
                          : 'text-white hover:text-white hover:bg-white/15 border-transparent hover:border-violet-400/30'
                      }`}
                      style={isActive(item.path) ? {
                        boxShadow: `0 0 30px ${item.color}40, inset 0 1px 0 rgba(255,255,255,0.2)`
                      } : {}}
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
  );
}