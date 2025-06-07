import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DiscordAvatar } from '@/components/discord-avatar';
import { Calendar, ChevronRight, Eye, Trophy, Star, Shield, Crown, Users, Zap } from 'lucide-react';
import { Link } from 'wouter';
import { useThemeCustomization } from '@/contexts/ThemeCustomizationContext';

interface AnimatedMemberCardProps {
  member: any;
  index: number;
  isLoaded: boolean;
  variant?: 'default' | 'premium' | 'elite' | 'admin';
  layout?: 'grid' | 'list';
  onClick?: (member: any) => void;
}

export function AnimatedMemberCard({ 
  member, 
  index, 
  isLoaded, 
  variant = 'default',
  layout = 'grid',
  onClick
}: AnimatedMemberCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const { theme } = useThemeCustomization();
  const [randomOffsets] = useState({
    x: Math.random() * 10 - 5,
    y: Math.random() * 10 - 5,
    rotation: Math.random() * 6 - 3,
    scale: 0.95 + Math.random() * 0.1,
  });

  useEffect(() => {
    if (isHovered) {
      setShowParticles(true);
    } else {
      const timer = setTimeout(() => setShowParticles(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isHovered]);

  const getBadgeColor = (role: string) => {
    const roleColors = {
      'Admin': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
      'Fondateur': 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      'Développeur': 'bg-green-500/20 text-green-400 border-green-500/40',
      'Modérateur': 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      'Vétéran': 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      'Membre Elite': 'bg-violet-500/20 text-violet-400 border-violet-500/40',
      'Joueur Pro': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40',
      'Stratège': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
      'Coach': 'bg-teal-500/20 text-teal-400 border-teal-500/40',
      'Compétiteur': 'bg-red-500/20 text-red-400 border-red-500/40',
      'Tacticien': 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      'Recrue': 'bg-slate-500/20 text-slate-400 border-slate-500/40',
      'Membre': 'bg-gray-500/20 text-gray-400 border-gray-500/40',
      'Invité': 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40',
      'Bot': 'bg-stone-500/20 text-stone-400 border-stone-500/40',
      'Support': 'bg-pink-500/20 text-pink-400 border-pink-500/40',
    } as Record<string, string>;
    
    return roleColors[role] || 'bg-gray-500/20 text-gray-400 border-gray-500/40';
  };

  const getRoleIcon = (role: string) => {
    if (role === 'Admin' || role === 'Fondateur') return <Crown className="w-3 h-3 text-white" />;
    if (role === 'Modérateur') return <Shield className="w-3 h-3 text-white" />;
    if (role === 'Développeur') return <Zap className="w-3 h-3 text-white" />;
    if (role.includes('Elite') || role.includes('Vétéran')) return <Star className="w-3 h-3 text-white" />;
    if (role.includes('Pro') || role.includes('Champion')) return <Trophy className="w-3 h-3 text-white" />;
    
    return <Users className="w-3 h-3 text-white" />;
  };

  const getCardVariantStyles = () => {
    switch(variant) {
      case 'premium':
        return 'from-blue-600/80 via-cyan-500/40 to-blue-600/80';
      case 'elite':
        return 'from-purple-600/80 via-violet-500/40 to-purple-600/80';
      case 'admin':
        return 'from-yellow-500/80 via-amber-500/40 to-yellow-500/80';
      default:
        return 'from-slate-700/30 via-slate-600/20 to-slate-700/30';
    }
  };

  const avatarAnimationVariants = {
    initial: { 
      scale: 0.8,
      opacity: 0,
      rotate: -10
    },
    animate: { 
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: { 
        duration: 0.7,
        delay: 0.3 + (index * 0.05),
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.15,
      rotate: 0,
      y: -5,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const cardAnimationVariants = {
    initial: { 
      y: 50,
      opacity: 0,
      scale: 0.9,
      rotate: randomOffsets.rotation,
    },
    animate: { 
      y: 0,
      opacity: 1,
      scale: randomOffsets.scale,
      rotate: 0,
      transition: { 
        duration: 0.8,
        delay: 0.1 + (index * 0.08),
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      scale: 1.03,
      rotate: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      y: 20,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(member);
    }
  };

  if (layout === 'list') {
    return (
      <motion.div
        initial="initial"
        animate={isLoaded ? "animate" : "initial"}
        exit="exit"
        variants={cardAnimationVariants}
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="w-full"
        onClick={handleCardClick}
      >
        <Card className="bg-dark-purple/30 backdrop-blur-sm border-purple-light/10 group overflow-hidden hover:shadow-purple-500/20 transition-all duration-500 relative">
          {/* Effet de bordure animée */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-electric-blue rounded-lg blur opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse-slow"></div>
          
          {/* Effet de halo au survol */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-purple-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
          
          <CardContent className="p-4 relative z-10 bg-black/50 rounded-lg">
            <div className="flex items-center gap-4">
              <motion.div
                variants={avatarAnimationVariants}
                className="relative"
              >
                {/* Avatar avec effet de bordure */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-tilt"></div>
                <div className="relative">
                  <DiscordAvatar
                    userId={member.id}
                    avatar={member.avatar}
                    username={member.displayName || member.username}
                    size="md"
                    className="border-2 border-purple-500/20 group-hover:border-purple-500/50 transition-colors duration-300"
                  />
                  
                  {/* Indicateur d'activité */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                </div>
              </motion.div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-semibold mb-1 flex items-center group-hover:text-purple-light transition-colors duration-300">
                      {member.displayName || member.username}
                    </h3>
                    
                    {/* Date d'inscription */}
                    <div className="text-xs text-gray-400 flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-purple-400" />
                      <span>
                        Depuis {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' }) : 'date inconnue'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 flex-wrap justify-end">
                    {/* Badges de rôle */}
                    {member.roles?.slice(0, 2).map((role: string, idx: number) => (
                      <span
                        key={`${member.id}-${role}-${idx}`}
                        className={`text-xs px-2 py-0.5 rounded-full border ${getBadgeColor(role)} inline-flex items-center`}
                      >
                        {getRoleIcon(role)}
                        <span className="ml-1">{role}</span>
                      </span>
                    ))}
                    
                    {member.roles?.length > 2 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-white inline-flex items-center">
                        +{member.roles.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <Link to={`/profile/${member.id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-60 hover:opacity-100 transition-opacity"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Profil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate={isLoaded ? "animate" : "initial"}
      exit="exit"
      variants={cardAnimationVariants}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="w-full"
      onClick={handleCardClick}
    >
      <Card className="bg-dark-purple/30 backdrop-blur-sm border-purple-light/10 group overflow-hidden h-full hover:shadow-purple-500/20 transition-all duration-500 relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br opacity-30 group-hover:opacity-60 transition-opacity duration-500" style={{ 
          background: `radial-gradient(circle at 50% 0%, ${theme.primaryColor}40, transparent 70%)` 
        }}></div>
        
        {/* Particle effects on hover */}
        <AnimatePresence>
          {showParticles && (
            <>
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  initial={{ 
                    opacity: 0,
                    scale: 0,
                    x: 0,
                    y: 0,
                    backgroundColor: i % 2 === 0 ? theme.primaryColor : theme.secondaryColor
                  }}
                  animate={{ 
                    opacity: [0, 0.8, 0],
                    scale: [0, Math.random() * 0.8 + 0.2, 0],
                    x: (Math.random() - 0.5) * 150,
                    y: (Math.random() - 0.5) * 150,
                    rotate: Math.random() * 360
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute rounded-full z-10"
                  style={{ 
                    top: '50%',
                    left: '50%',
                    width: Math.random() * 6 + 2 + 'px',
                    height: Math.random() * 6 + 2 + 'px',
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
        
        {/* Animated border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse-slow"></div>
        
        {/* Hover glow line */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
        
        <CardContent className="p-6 relative z-10 bg-black/50 rounded-lg flex flex-col h-full">
          <div className="flex justify-center mb-4">
            <motion.div 
              variants={avatarAnimationVariants}
              className="relative"
            >
              {/* Animated glow behind avatar */}
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: isHovered ? [1, 1.1, 1] : 1,
                }}
                transition={{ 
                  rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute -inset-2 rounded-full opacity-50"
                style={{ 
                  background: `conic-gradient(from 0deg, ${theme.primaryColor}, ${theme.secondaryColor}, ${theme.primaryColor})`,
                  filter: 'blur(10px)'
                }}
              />
              
              <div className="relative">
                <DiscordAvatar
                  userId={member.id}
                  avatar={member.avatar}
                  username={member.displayName || member.username}
                  size="xl"
                  className="border-4 border-dark-purple group-hover:border-purple-500/50 transition-colors duration-500"
                />
                
                {/* Status indicator */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-black z-10"></div>
                
                {/* Role indicator for admins and special roles */}
                {member.roles?.some((r: string) => r === 'Admin' || r === 'Fondateur') && (
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center z-20"
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <Crown className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
          
          <div className="text-center mb-3">
            <h3 className="text-lg font-semibold mb-1 group-hover:text-purple-light transition-colors duration-300">
              {member.displayName || member.username}
            </h3>
            
            {/* Badges de rôle */}
            <div className="flex flex-wrap gap-1 justify-center mt-2">
              {member.roles?.map((role: string, idx: number) => (
                <motion.span
                  key={`${member.id}-${role}-${idx}`}
                  className={`text-xs px-2 py-0.5 rounded-full border ${getBadgeColor(role)} inline-flex items-center`}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.5 + (idx * 0.1), duration: 0.4 }}
                >
                  {getRoleIcon(role)}
                  <span className="ml-1">{role}</span>
                </motion.span>
              ))}
            </div>
          </div>
          
          {/* Informations supplémentaires */}
          <div className="text-sm text-gray-300 flex-grow">
            <div className="flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 mr-2 text-purple-400" />
              <span>
                Depuis {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' }) : 'date inconnue'}
              </span>
            </div>
          </div>
          
          {/* Bouton Voir profil */}
          <CardFooter className="px-0 pt-4 pb-0 mt-auto">
            <Link to={`/profile/${member.id}`} className="w-full">
              <Button variant="outline" className="w-full border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all group">
                <Eye className="w-4 h-4 mr-2 group-hover:text-purple-400" />
                Voir le profil
                <ChevronRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Button>
            </Link>
          </CardFooter>
        </CardContent>
      </Card>
    </motion.div>
  );
}