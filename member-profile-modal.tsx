import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Trophy, 
  Calendar, 
  Users, 
  MessageSquare, 
  Shield, 
  Crown, 
  Star,
  Gamepad2
} from 'lucide-react';
import { DiscordAvatar } from '@/components/discord-avatar';
import { BadgeDisplay } from '@/components/badge-display';
import { LevelBadge } from '@/components/badge-display';
import { useThemeCustomization } from '@/contexts/ThemeCustomizationContext';

interface MemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: any;
}

export function MemberProfileModal({ isOpen, onClose, member }: MemberProfileModalProps) {
  const { theme } = useThemeCustomization();
  const [stats, setStats] = useState({
    niveau: Math.floor(Math.random() * 100) + 1,
    xp: Math.floor(Math.random() * 10000),
    matches: Math.floor(Math.random() * 500),
    wins: Math.floor(Math.random() * 300),
    rank: getRankFromRoles(member?.roles || []),
  });
  
  const [badges, setBadges] = useState<string[]>([]);
  
  useEffect(() => {
    // Génère des badges en fonction des rôles de l'utilisateur
    if (member) {
      const newBadges: string[] = [];
      
      // Ajoute des badges basés sur les rôles
      if (member.roles) {
        if (member.roles.includes('Admin') || member.roles.includes('Fondateur')) {
          newBadges.push('Staff');
          newBadges.push('Vétéran');
          newBadges.push('SLZ Elite');
        }
        
        if (member.roles.includes('Modérateur')) {
          newBadges.push('Staff');
          newBadges.push('Modération');
        }
        
        if (member.roles.includes('Développeur')) {
          newBadges.push('Développeur');
          newBadges.push('Tech Master');
        }
        
        if (member.roles.includes('Vétéran')) {
          newBadges.push('Vétéran');
          newBadges.push('OG');
        }
        
        if (member.roles.includes('Membre Elite')) {
          newBadges.push('Elite');
          newBadges.push('SLZ Pro');
        }
      }
      
      // Ajoute des badges supplémentaires aléatoires
      const randomBadges = [
        'Stratège', 'Tacticien', 'Champion', 'Compétiteur', 
        'Coach', 'Prodige', 'Légende', 'Pro Gamer'
      ];
      
      // Ajoute entre 1 et 3 badges aléatoires
      const numRandomBadges = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numRandomBadges; i++) {
        const randomIndex = Math.floor(Math.random() * randomBadges.length);
        if (!newBadges.includes(randomBadges[randomIndex])) {
          newBadges.push(randomBadges[randomIndex]);
        }
      }
      
      setBadges(newBadges);
      
      // Met à jour les statistiques en fonction des rôles
      let niveau = Math.floor(Math.random() * 50) + 1; // niveau de base
      let winRate = 0.4 + (Math.random() * 0.3); // taux de victoire de base (40-70%)
      
      if (member.roles) {
        if (member.roles.includes('Admin') || member.roles.includes('Fondateur')) {
          niveau = Math.floor(Math.random() * 30) + 70; // niveau 70-100
          winRate = 0.7 + (Math.random() * 0.25); // 70-95%
        } else if (member.roles.includes('Modérateur') || member.roles.includes('Développeur')) {
          niveau = Math.floor(Math.random() * 20) + 50; // niveau 50-70
          winRate = 0.6 + (Math.random() * 0.2); // 60-80%
        } else if (member.roles.includes('Vétéran') || member.roles.includes('Membre Elite')) {
          niveau = Math.floor(Math.random() * 20) + 30; // niveau 30-50
          winRate = 0.5 + (Math.random() * 0.2); // 50-70%
        }
      }
      
      const matches = Math.floor(Math.random() * 300) + 50;
      const wins = Math.floor(matches * winRate);
      
      setStats({
        niveau,
        xp: niveau * 100 + Math.floor(Math.random() * 100),
        matches,
        wins,
        rank: getRankFromRoles(member.roles || []),
      });
    }
  }, [member]);
  
  function getRankFromRoles(roles: string[]): string {
    if (roles.includes('Admin') || roles.includes('Fondateur')) {
      return 'SSS';
    }
    if (roles.includes('Modérateur') || roles.includes('Développeur')) {
      return 'SS';
    }
    if (roles.includes('Vétéran') || roles.includes('Membre Elite')) {
      return 'S';
    }
    if (roles.includes('Joueur Pro') || roles.includes('Compétiteur')) {
      return 'A';
    }
    return ['B', 'C', 'A', 'B+'][Math.floor(Math.random() * 4)];
  }
  
  if (!member) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-purple-500/30 text-white max-w-4xl w-11/12 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Profil de Membre
            </span>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        {/* Contenu du profil */}
        <AnimatePresence>
          <div className="pt-4">
            {/* En-tête du profil avec bannière et avatar */}
            <div className="relative h-48 mb-16 rounded-lg overflow-hidden">
              {/* Bannière animée */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    `linear-gradient(45deg, ${theme.primaryColor}90, ${theme.secondaryColor}90)`,
                    `linear-gradient(45deg, ${theme.secondaryColor}90, ${theme.primaryColor}90)`,
                  ],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Effets de la bannière */}
              <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
              <motion.div
                className="absolute h-[1px] w-full bg-white/30"
                style={{ top: '50%' }}
                animate={{
                  opacity: [0, 0.5, 0],
                  width: ['0%', '100%', '0%'],
                  left: ['0%', '0%', '100%'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Avatar de profil */}
              <motion.div
                className="absolute -bottom-12 left-6 z-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute -inset-3 rounded-full blur-md"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{ 
                      background: `conic-gradient(from 0deg, ${theme.primaryColor}, ${theme.secondaryColor}, ${theme.primaryColor})` 
                    }}
                  />
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-black">
                    <DiscordAvatar
                      userId={member.id}
                      avatar={member.avatar}
                      username={member.displayName || member.username}
                      size="xl"
                      className="w-full h-full"
                    />
                  </div>
                  
                  {/* Badge spécial si l'utilisateur est admin */}
                  {member.roles?.some((r: string) => r === 'Admin' || r === 'Fondateur') && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center"
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <Crown className="h-5 w-5 text-white" />
                    </motion.div>
                  )}
                  
                  {/* Indicateur online */}
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-black"></div>
                </div>
              </motion.div>
              
              {/* Informations de base du profil */}
              <motion.div
                className="absolute bottom-4 left-40 z-10"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold text-white drop-shadow-md">
                  {member.displayName || member.username}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-gray-800/60 text-gray-100">
                    <Calendar className="w-3 h-3 mr-1" />
                    {member.joinedAt 
                      ? new Date(member.joinedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) 
                      : 'Date inconnue'
                    }
                  </Badge>
                  
                  {/* Affichage des rôles principaux */}
                  {member.roles?.slice(0, 2).map((role: string, idx: number) => (
                    <Badge 
                      key={idx}
                      className={getRoleBadgeStyle(role)}
                    >
                      {getRoleIcon(role)}
                      <span className="ml-1">{role}</span>
                    </Badge>
                  ))}
                </div>
              </motion.div>
              
              {/* Grade et niveau */}
              <motion.div
                className="absolute bottom-4 right-6 z-10 flex items-center gap-3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <LevelBadge level={stats.niveau} rank={stats.rank} />
              </motion.div>
            </div>
            
            {/* Contenu principal du profil */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pb-6">
              {/* Statistiques du joueur */}
              <motion.div
                className="md:col-span-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                    Statistiques du Joueur
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-black/40 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-sm">Niveau</p>
                      <p className="text-2xl font-bold text-white">{stats.niveau}</p>
                      <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                        <motion.div
                          className="h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(stats.xp % 100)}%` }}
                          transition={{ duration: 1, delay: 0.8 }}
                          style={{ 
                            background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})` 
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{stats.xp} XP</p>
                    </div>
                    
                    <div className="bg-black/40 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-sm">Matches</p>
                      <p className="text-2xl font-bold text-white">{stats.matches}</p>
                      <p className="text-xs text-gray-500 mt-3">Total de parties</p>
                    </div>
                    
                    <div className="bg-black/40 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-sm">Victoires</p>
                      <p className="text-2xl font-bold text-white">{stats.wins}</p>
                      <p className="text-xs text-gray-500 mt-3">Total de victoires</p>
                    </div>
                    
                    <div className="bg-black/40 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-sm">Win Rate</p>
                      <p className="text-2xl font-bold text-white">
                        {stats.matches > 0 ? Math.round((stats.wins / stats.matches) * 100) : 0}%
                      </p>
                      <p className="text-xs text-gray-500 mt-3">Taux de victoire</p>
                    </div>
                  </div>
                  
                  {/* Graphique de progression */}
                  <div className="bg-black/40 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">Progression récente</h4>
                    <div className="h-20 flex items-end gap-1">
                      {[...Array(14)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="bg-purple-500/50 rounded-t-sm w-full"
                          initial={{ height: 0 }}
                          animate={{ height: `${20 + Math.random() * 60}%` }}
                          transition={{ delay: 0.8 + (i * 0.05), duration: 0.5 }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>14 derniers jours</span>
                      <span>Aujourd'hui</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Badges et récompenses */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-6 h-full">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-400" />
                    Badges et Récompenses
                  </h3>
                  
                  <div className="space-y-4">
                    <BadgeDisplay badges={badges} size="md" />
                    
                    {/* Rang du joueur */}
                    <div className="bg-black/40 rounded-lg p-4 text-center mt-4">
                      <p className="text-gray-400 text-sm mb-1">Rang actuel</p>
                      <div className="flex items-center justify-center">
                        {getRankIcon(stats.rank)}
                        <span className="text-2xl font-bold ml-2">{getRankName(stats.rank)}</span>
                      </div>
                    </div>
                    
                    {/* Spécialité */}
                    <div className="bg-black/40 rounded-lg p-4 text-center">
                      <p className="text-gray-400 text-sm mb-1">Spécialité</p>
                      <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 border-0 text-white px-3 py-1">
                        <Gamepad2 className="w-3 h-3 mr-1" />
                        {getSpecialty(member.roles || [])}
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Actions */}
              <motion.div
                className="md:col-span-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="flex flex-wrap gap-3 justify-end">
                  <Button
                    variant="outline"
                    className="border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/10"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Envoyer un message
                  </Button>
                  
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Voir profil complet
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// Fonctions utilitaires
function getRoleBadgeStyle(role: string): string {
  const styles: Record<string, string> = {
    'Admin': 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50',
    'Fondateur': 'bg-amber-500/30 text-amber-300 border-amber-500/50',
    'Modérateur': 'bg-blue-500/30 text-blue-300 border-blue-500/50',
    'Développeur': 'bg-green-500/30 text-green-300 border-green-500/50',
    'Vétéran': 'bg-purple-500/30 text-purple-300 border-purple-500/50',
    'Membre Elite': 'bg-violet-500/30 text-violet-300 border-violet-500/50',
    'Joueur Pro': 'bg-red-500/30 text-red-300 border-red-500/50',
    'Compétiteur': 'bg-orange-500/30 text-orange-300 border-orange-500/50',
  };
  
  return styles[role] || 'bg-gray-500/30 text-gray-300 border-gray-500/50';
}

function getRoleIcon(role: string) {
  if (role === 'Admin' || role === 'Fondateur') return <Crown className="w-3 h-3" />;
  if (role === 'Modérateur') return <Shield className="w-3 h-3" />;
  if (role === 'Développeur') return <Gamepad2 className="w-3 h-3" />;
  if (role.includes('Elite') || role.includes('Vétéran')) return <Star className="w-3 h-3" />;
  if (role.includes('Pro') || role.includes('Compétiteur')) return <Trophy className="w-3 h-3" />;
  
  return <Users className="w-3 h-3" />;
}

function getRankIcon(rank: string) {
  if (rank === 'SSS') return <Crown className="w-6 h-6 text-yellow-400" />;
  if (rank === 'SS') return <Star className="w-6 h-6 text-yellow-300" />;
  if (rank === 'S') return <Trophy className="w-6 h-6 text-purple-400" />;
  if (rank === 'A') return <Shield className="w-6 h-6 text-blue-400" />;
  
  return <Shield className="w-6 h-6 text-gray-400" />;
}

function getRankName(rank: string): string {
  const ranks: Record<string, string> = {
    'SSS': 'RANG SSS',
    'SS': 'RANG SS',
    'S': 'RANG S',
    'A': 'RANG A',
    'B': 'RANG B',
    'C': 'RANG C',
    'B+': 'RANG B+',
  };
  
  return ranks[rank] || 'RANG C';
}

function getSpecialty(roles: string[]): string {
  const specialties = [
    'Stratège', 'Tacticien', 'Combattant', 'Support', 
    'Élite', 'Commandant', 'Infiltrateur', 'Sniper',
    'Assaut', 'Défenseur', 'Technicien', 'Médic'
  ];
  
  if (roles.includes('Admin') || roles.includes('Fondateur')) {
    return 'Commandant';
  }
  
  if (roles.includes('Développeur')) {
    return 'Technicien';
  }
  
  if (roles.includes('Modérateur')) {
    return 'Défenseur';
  }
  
  if (roles.includes('Vétéran')) {
    return 'Élite';
  }
  
  if (roles.includes('Membre Elite')) {
    return 'Stratège';
  }
  
  return specialties[Math.floor(Math.random() * specialties.length)];
}