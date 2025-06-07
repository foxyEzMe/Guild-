import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeDisplay } from './badge-display';
import { Card } from '@/components/ui/card';
import { Shield, Users, Star, Calendar, Trophy, X } from 'lucide-react';

interface UserProfilePopupProps {
  user: {
    id: string;
    username: string;
    avatar?: string;
    discordAvatar?: string;
    discordId?: string;
    role?: string;
    isAdmin?: boolean;
    level?: number;
    badges?: string[];
    joinDate?: string;
    banner?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

export function UserProfilePopup({ user, isOpen, onClose, position }: UserProfilePopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  
  // Default position in the center of the screen if not provided
  const defaultPosition = {
    x: position?.x || window.innerWidth / 2 - 180,
    y: position?.y || window.innerHeight / 2 - 200
  };
  
  // Adjust position to ensure popup stays within viewport
  const adjustedPosition = {
    x: Math.min(defaultPosition.x, window.innerWidth - 360),
    y: Math.min(defaultPosition.y, window.innerHeight - 400)
  };
  
  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Get Discord avatar URL or fallback
  const getAvatarUrl = () => {
    if (user.discordAvatar && user.discordId) {
      return `https://cdn.discordapp.com/avatars/${user.discordId}/${user.discordAvatar}.png`;
    } else if (user.avatar) {
      return user.avatar;
    }
    return `https://ui-avatars.com/api/?name=${user.username}&background=8800cc&color=fff`;
  };

  // Get banner URL or fallback gradient
  const getBannerStyle = () => {
    if (user.banner) {
      return { 
        backgroundImage: `url(${user.banner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    // Different gradients based on admin status or role
    if (user.isAdmin) {
      return { background: 'linear-gradient(to right, #FF4D4D, #F9CB28)' };
    }
    
    return { background: 'linear-gradient(to right, #8A2BE2, #4B0082)' };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm user-profile-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            // Seulement fermer si l'utilisateur clique sur l'overlay et pas sur le contenu
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            ref={popupRef}
            className="absolute z-50"
            style={{ 
              top: adjustedPosition.y,
              left: adjustedPosition.x,
              width: '350px'
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="overflow-hidden bg-black/80 backdrop-blur-xl border-purple-500/30 shadow-2xl">
              {/* Close button */}
              <button 
                className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </button>
              
              {/* Banner */}
              <div 
                className="h-32 w-full relative" 
                style={getBannerStyle()}
              >
                {/* Avatar */}
                <div className="absolute -bottom-10 left-4">
                  <div className="w-20 h-20 rounded-full border-4 border-black/80 overflow-hidden">
                    <img 
                      src={getAvatarUrl()} 
                      alt={user.username} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* User Info */}
              <div className="p-5 pt-12">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white">{user.username}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {user.isAdmin && (
                        <div className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-xs flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          <span>Admin</span>
                        </div>
                      )}
                      {user.role && (
                        <div className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-xs">
                          {user.role}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {user.level && (
                    <div className="px-3 py-1 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full text-white text-sm font-bold">
                      Lvl {user.level}
                    </div>
                  )}
                </div>
                
                {/* User Stats */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-purple-500/10 rounded-lg p-2 flex items-center gap-2 border border-purple-500/20">
                    <Trophy className="w-4 h-4 text-purple-400" />
                    <span className="text-white">Membre S.L.Z</span>
                  </div>
                  
                  <div className="bg-cyan-500/10 rounded-lg p-2 flex items-center gap-2 border border-cyan-500/20">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span className="text-white">{user.joinDate || 'Mai 2025'}</span>
                  </div>
                </div>
                
                {/* Badges */}
                {user.badges && user.badges.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-gray-400 text-sm mb-2">Badges</h4>
                    <BadgeDisplay badges={user.badges} size="sm" limit={10} />
                  </div>
                )}
                
                {/* Actions */}
                <div className="mt-6 text-center">
                  <button 
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-violet-600 hover:to-purple-600 rounded-lg text-white text-sm font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Ouvrir dans une nouvelle fenêtre ou traiter autrement
                      alert(`Profil de ${user.username} - Cette fonctionnalité sera bientôt disponible`);
                    }}
                  >
                    Voir profil complet
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}