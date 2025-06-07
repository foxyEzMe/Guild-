import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Home, Users, MessageSquare, Calendar, 
  Trophy, Shield, Menu, X, Zap, 
  Sparkles, Crown, Gamepad2, ExternalLink
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  gradient: string;
  particle?: string;
}

export function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navRef = useRef<HTMLElement>(null);

  const navItems: NavItem[] = [
    {
      path: '/',
      label: 'ACCUEIL',
      icon: <Home className="w-6 h-6" />,
      description: 'Retour à la base',
      color: '#8b5cf6',
      gradient: 'from-purple-500 to-violet-700',
      particle: '✦'
    },
    {
      path: '/announcements',
      label: 'ANNONCES',
      icon: <MessageSquare className="w-6 h-6" />,
      description: 'Dernières nouvelles',
      color: '#a855f7',
      gradient: 'from-purple-400 to-purple-700',
      particle: '🔥'
    },
    {
      path: '/credits',
      label: 'CRÉDITS',
      icon: <Trophy className="w-6 h-6" />,
      description: 'Hall of Fame',
      color: '#9333ea',
      gradient: 'from-violet-500 to-purple-800',
      particle: '👑'
    }
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = (path: string) => location === path;

  return (
    <>
      {/* Navigation Desktop - Design Futuriste 3D */}
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo S.L.Z avec effet holographique */}
            <Link href="/">
              <motion.div 
                className="flex items-center space-x-3 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center"
                    animate={{ 
                      boxShadow: [
                        '0 0 20px rgba(0, 212, 255, 0.5)',
                        '0 0 40px rgba(255, 0, 255, 0.5)',
                        '0 0 20px rgba(0, 212, 255, 0.5)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Crown className="w-7 h-7 text-white" />
                  </motion.div>
                  
                  {/* Particules orbitales */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white rounded-full"
                      animate={{
                        rotate: 360,
                        scale: [1, 1.5, 1]
                      }}
                      transition={{
                        duration: 3 + i,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      style={{
                        left: `${20 + i * 8}px`,
                        top: `${20 + i * 8}px`,
                        transformOrigin: `-${20 + i * 8}px -${20 + i * 8}px`
                      }}
                    />
                  ))}
                </div>
                
                <div className="hidden lg:block">
                  <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 via-violet-400 to-purple-600 bg-clip-text text-transparent">
                    S.L.Z GUILD
                  </h1>
                  <p className="text-xs text-white/80 font-semibold tracking-wide">ELITE GAMING LEGION</p>
                </div>
              </motion.div>
            </Link>

            {/* Navigation Items Desktop */}
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onHoverStart={() => setHoveredItem(item.path)}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <Link href={item.path}>
                    <motion.div
                      className="relative group"
                      whileHover={{ scale: 1.05, rotateY: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        className={`
                          relative px-6 py-3 font-bold text-sm transition-all duration-500 overflow-hidden
                          ${isActive(item.path) 
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-2xl` 
                            : 'text-white/80 hover:text-white bg-white/5 hover:bg-white/10'
                          }
                        `}
                        style={{
                          boxShadow: isActive(item.path) 
                            ? `0 0 30px ${item.color}50, inset 0 1px 0 rgba(255,255,255,0.2)` 
                            : 'none'
                        }}
                      >
                        {/* Effet de scan holographique */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: '-100%' }}
                          animate={{ x: hoveredItem === item.path ? '100%' : '-100%' }}
                          transition={{ duration: 0.6 }}
                        />
                        
                        {/* Icône avec rotation 3D */}
                        <motion.div
                          className="mr-2 relative z-10"
                          animate={isActive(item.path) ? { rotateY: [0, 360] } : {}}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          {item.icon}
                        </motion.div>
                        
                        <span className="relative z-10">{item.label}</span>
                        
                        {/* Particules flottantes */}
                        {(hoveredItem === item.path || isActive(item.path)) && (
                          <motion.div
                            className="absolute top-1 right-2 text-xs"
                            animate={{ 
                              y: [-2, 2, -2],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            {item.particle}
                          </motion.div>
                        )}
                      </Button>
                      
                      {/* Tooltip avec description */}
                      <AnimatePresence>
                        {hoveredItem === item.path && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2"
                          >
                            <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-2 whitespace-nowrap">
                              <p className="text-xs text-white/80">{item.description}</p>
                              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-l border-t border-white/10"></div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
              
              {/* Bouton Discord */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="ml-4"
              >
                <motion.a
                  href="https://discord.gg/YVVr439zyV"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 text-white font-bold text-sm relative overflow-hidden border border-purple-400/30"
                    style={{
                      boxShadow: '0 0 30px rgba(139, 92, 246, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      animate={{ 
                        x: [-100, 100],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <MessageSquare className="w-5 h-5 mr-2 relative z-10" />
                    <span className="relative z-10">REJOINDRE DISCORD</span>
                  </Button>
                </motion.a>
              </motion.div>

              {/* Admin Panel - Sécurisé */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="ml-2"
              >
                <motion.div
                  onClick={() => {
                    const password = prompt("Mot de passe administrateur requis:");
                    if (password === "SLZ_ADMIN_2024_ELITE") {
                      window.location.href = "/admin";
                    } else if (password !== null) {
                      alert("Accès refusé. Mot de passe incorrect.");
                    }
                  }}
                  whileHover={{ scale: 1.05, rotateZ: 2 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                >
                  <div className="px-4 py-3 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white font-black text-sm relative overflow-hidden border border-red-400/30 rounded-md">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"
                      animate={{ 
                        x: [-100, 100],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <Shield className="w-5 h-5 mr-1 relative z-10 inline" />
                    <span className="relative z-10">ADMIN</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Menu Mobile Button */}
            <div className="lg:hidden">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 text-white"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isOpen ? 'close' : 'menu'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Mobile - Overlay futuriste */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-20 right-0 bottom-0 w-80 bg-black/95 backdrop-blur-2xl border-l border-white/10"
            >
              <div className="p-6 space-y-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={item.path}>
                      <motion.div
                        whileHover={{ scale: 1.02, x: 10 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsOpen(false)}
                        className={`
                          flex items-center space-x-4 p-4 rounded-xl transition-all duration-300
                          ${isActive(item.path)
                            ? `bg-gradient-to-r ${item.gradient} shadow-xl`
                            : 'bg-white/5 hover:bg-white/10'
                          }
                        `}
                        style={{
                          boxShadow: isActive(item.path) ? `0 0 20px ${item.color}50` : 'none'
                        }}
                      >
                        <div className="text-white">{item.icon}</div>
                        <div className="flex-1">
                          <p className="font-bold text-white">{item.label}</p>
                          <p className="text-xs text-white/80">{item.description}</p>
                        </div>
                        <div className="text-lg">{item.particle}</div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
                
                {/* Discord Button Mobile */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.a
                    href="https://discord.gg/YVVr439zyV"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 shadow-xl"
                  >
                    <MessageSquare className="w-6 h-6 text-white" />
                    <div className="flex-1">
                      <p className="font-bold text-white">REJOINDRE DISCORD</p>
                      <p className="text-xs text-white/80">Communauté officielle</p>
                    </div>
                    <MessageSquare className="w-5 h-5 text-purple-200" />
                  </motion.a>
                </motion.div>
                
                {/* Admin Button Mobile */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    onClick={() => {
                      const password = prompt("Mot de passe administrateur requis:");
                      if (password === "SLZ_ADMIN_2024_ELITE") {
                        window.location.href = "/admin";
                      } else if (password !== null) {
                        alert("Accès refusé. Mot de passe incorrect.");
                      }
                      setIsOpen(false);
                    }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 shadow-xl"
                  >
                    <Shield className="w-6 h-6 text-white" />
                    <div className="flex-1">
                      <p className="font-bold text-white">ADMIN PANEL</p>
                      <p className="text-xs text-white/80">Accès sécurisé</p>
                    </div>
                    <Crown className="w-5 h-5 text-yellow-300" />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Effet de suivi de souris */}
      <motion.div
        className="fixed w-6 h-6 pointer-events-none z-30 mix-blend-difference"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full bg-white rounded-full blur-sm"></div>
      </motion.div>
    </>
  );
}