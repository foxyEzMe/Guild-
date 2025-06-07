import { useQuery } from '@tanstack/react-query';
import { Users, Crown, Shield, Star, Calendar, Trophy, Search, ChevronRight, Grid, List, Filter, ArrowUpDown, UserPlus, X, Eye, Gamepad2, Zap, LayoutGrid, LayoutList, SlidersHorizontal, Sparkles, Award, Gem } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchDiscordMembers } from '@/lib/discord-api';
import { DiscordAvatar } from '@/components/discord-avatar';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeCustomization } from '@/contexts/ThemeCustomizationContext';

// Fonction pour déterminer le variant de la carte en fonction des rôles du membre
function getMemberCardVariant(roles?: string[]): 'default' | 'premium' | 'elite' | 'admin' {
  if (!roles || roles.length === 0) return 'default';
  
  if (roles.some(r => r.includes('Admin') || r.includes('Fondateur') || r.includes('Owner'))) return 'admin';
  if (roles.some(r => r.includes('Modérateur') || r.includes('Développeur') || r.includes('Mod'))) return 'premium';
  if (roles.some(r => r.includes('Vétéran') || r.includes('Elite') || r.includes('VIP'))) return 'elite';
  
  return 'default';
}

function getRoleBadgeColor(role: string): string {
  if (role.includes('Fondateur') || role.includes('Owner')) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
  if (role.includes('Admin')) return 'bg-gradient-to-r from-red-500 to-pink-500';
  if (role.includes('Modérateur') || role.includes('Mod')) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
  if (role.includes('Développeur') || role.includes('Dev')) return 'bg-gradient-to-r from-green-500 to-emerald-500';
  if (role.includes('Vétéran')) return 'bg-gradient-to-r from-purple-500 to-violet-500';
  if (role.includes('Elite')) return 'bg-gradient-to-r from-indigo-500 to-purple-500';
  if (role.includes('VIP')) return 'bg-gradient-to-r from-amber-500 to-yellow-500';
  return 'bg-gradient-to-r from-gray-500 to-slate-500';
}

function getRoleIcon(role: string) {
  if (role.includes('Fondateur') || role.includes('Owner')) return <Crown className="w-3 h-3" />;
  if (role.includes('Admin')) return <Shield className="w-3 h-3" />;
  if (role.includes('Modérateur') || role.includes('Mod')) return <Eye className="w-3 h-3" />;
  if (role.includes('Développeur') || role.includes('Dev')) return <Zap className="w-3 h-3" />;
  if (role.includes('Vétéran')) return <Award className="w-3 h-3" />;
  if (role.includes('Elite')) return <Gem className="w-3 h-3" />;
  if (role.includes('VIP')) return <Sparkles className="w-3 h-3" />;
  return <Star className="w-3 h-3" />;
}

interface MemberCardProps {
  member: any;
  index: number;
  isLoaded: boolean;
  onClick?: (member: any) => void;
}

function MemberCard({ member, index, isLoaded, onClick }: MemberCardProps) {
  const variant = getMemberCardVariant(member.roles);
  
  const cardVariants = {
    default: 'bg-gray-900/40 border-gray-700/50 hover:border-purple-500/50',
    premium: 'bg-blue-900/40 border-blue-700/50 hover:border-blue-400/70',
    elite: 'bg-purple-900/40 border-purple-700/50 hover:border-purple-400/70',
    admin: 'bg-gradient-to-br from-red-900/40 to-orange-900/40 border-red-700/50 hover:border-red-400/70'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ 
        opacity: isLoaded ? 1 : 0, 
        y: isLoaded ? 0 : 50,
        scale: isLoaded ? 1 : 0.9
      }}
      transition={{ 
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.05,
        rotateY: 8,
        rotateX: 2,
        z: 50,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="cursor-pointer"
      onClick={() => onClick?.(member)}
    >
      <Card className={`${cardVariants[variant]} backdrop-blur-md transition-all duration-300 hover:shadow-2xl overflow-hidden group`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            {/* Avatar avec effet de brillance */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative"
              >
                <DiscordAvatar
                  userId={member.id}
                  avatar={member.avatar}
                  username={member.username}
                  size="lg"
                  className="ring-2 ring-purple-500/30 group-hover:ring-purple-400/60 transition-all duration-300"
                />
                {variant === 'admin' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Crown className="w-2 h-2 text-white" />
                  </div>
                )}
              </motion.div>
            </div>

            {/* Informations du membre */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-bold text-white truncate">
                  {member.displayName || member.username}
                </h3>
                {member.status && (
                  <div className={`w-3 h-3 rounded-full ${
                    member.status === 'online' ? 'bg-green-500' :
                    member.status === 'idle' ? 'bg-yellow-500' :
                    member.status === 'dnd' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                )}
              </div>

              {/* Badges des rôles */}
              <div className="flex flex-wrap gap-1 mb-3">
                {member.roles?.slice(0, 3).map((role: string, roleIndex: number) => (
                  <motion.div
                    key={role}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (index * 0.1) + (roleIndex * 0.05) }}
                  >
                    <Badge className={`${getRoleBadgeColor(role)} text-white text-xs px-2 py-1 flex items-center space-x-1`}>
                      {getRoleIcon(role)}
                      <span>{role}</span>
                    </Badge>
                  </motion.div>
                ))}
                {member.roles?.length > 3 && (
                  <Badge className="bg-gray-600 text-white text-xs">
                    +{member.roles.length - 3}
                  </Badge>
                )}
              </div>

              {/* Date de rejointe */}
              {member.joinedAt && (
                <p className="text-sm text-gray-400 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  Rejoint le {new Date(member.joinedAt).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>

            <motion.div
              whileHover={{ x: 5 }}
              className="text-purple-400 group-hover:text-purple-300 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function MembersEnhanced() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortOption, setSortOption] = useState<string>('role');
  const { theme } = useThemeCustomization();
  const { user, isAuthenticated } = useAuth();
  
  const { data: members, isLoading, error } = useQuery({
    queryKey: ['/api/discord/members'],
    queryFn: fetchDiscordMembers,
    retry: 2,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const getMembersByCategory = () => {
    if (!members || members.length === 0) return [];
    
    let filtered = members.filter((member: any) => {
      const matchesSearch = member.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (member.displayName && member.displayName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = (() => {
        if (activeCategory === 'all') return true;
        if (activeCategory === 'admin') return member.roles?.some((r: string) => r.includes('Admin') || r.includes('Fondateur') || r.includes('Owner'));
        if (activeCategory === 'mod') return member.roles?.some((r: string) => r.includes('Modérateur') || r.includes('Mod'));
        if (activeCategory === 'elite') return member.roles?.some((r: string) => r.includes('Vétéran') || r.includes('Elite') || r.includes('VIP'));
        if (activeCategory === 'member') return !member.roles?.some((r: string) => 
          r.includes('Admin') || r.includes('Fondateur') || r.includes('Modérateur') || r.includes('Vétéran') || r.includes('Elite')
        ) || member.roles?.length === 0;
        return true;
      })();
      
      const matchesRole = selectedRole === 'all' ? true : member.roles?.some((role: string) => role === selectedRole);
      
      return matchesSearch && matchesCategory && matchesRole;
    });
    
    // Appliquer le tri
    filtered = filtered.sort((a: any, b: any) => {
      if (sortOption === 'role') {
        const roleOrder: Record<string, number> = {
          'Fondateur': 1,
          'Owner': 1,
          'Admin': 2,
          'Développeur': 3,
          'Modérateur': 4,
          'Vétéran': 5,
          'Elite': 6,
          'VIP': 7
        };
        
        const aRole = a.roles && a.roles.length > 0 ? a.roles[0] : 'Membre';
        const bRole = b.roles && b.roles.length > 0 ? b.roles[0] : 'Membre';
        
        const aOrder = Object.entries(roleOrder).find(([key]) => aRole.includes(key))?.[1] || 99;
        const bOrder = Object.entries(roleOrder).find(([key]) => bRole.includes(key))?.[1] || 99;
        
        return aOrder - bOrder;
      } 
      else if (sortOption === 'name') {
        const aName = a.displayName || a.username;
        const bName = b.displayName || b.username;
        return aName.localeCompare(bName);
      }
      else if (sortOption === 'joinDate') {
        const aDate = a.joinedAt ? new Date(a.joinedAt).getTime() : 0;
        const bDate = b.joinedAt ? new Date(b.joinedAt).getTime() : 0;
        return bDate - aDate;
      }
      
      return 0;
    });
    
    return filtered;
  };

  const getUniqueRoles = () => {
    if (!members) return [];
    const allRoles = members.flatMap((member: any) => member.roles || []);
    return Array.from(new Set(allRoles));
  };

  const filteredMembers = getMembersByCategory();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white pb-20">
      {/* Effets de fond animés */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] opacity-20 z-0"></div>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-slate-900 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <div className="container mx-auto px-4 pt-20 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-5xl font-bold tracking-tight mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              Membres S.L.Z
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Notre guilde d'élite réunit les meilleurs joueurs et stratèges. Découvrez notre communauté exceptionnelle.
          </motion.p>
        </motion.div>
        
        {/* Filtres et contrôles */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-slate-900/40 backdrop-blur-xl border-purple-500/20 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6">
                {/* Barre de recherche et contrôles */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Rechercher un membre..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-800/50 border-purple-500/30 focus:border-purple-400/60 text-white pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                    {searchQuery && (
                      <button 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        onClick={() => setSearchQuery('')}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-3 items-center">
                    <Select value={sortOption} onValueChange={setSortOption}>
                      <SelectTrigger className="w-[140px] bg-slate-800/50 border-purple-500/30 text-white">
                        <SelectValue placeholder="Trier par..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-purple-500/30 text-white">
                        <SelectItem value="role">Par rôle</SelectItem>
                        <SelectItem value="name">Par nom</SelectItem>
                        <SelectItem value="joinDate">Par date</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="flex border border-purple-500/30 rounded-md overflow-hidden">
                      <Button
                        variant="ghost"
                        className={`px-3 py-2 h-10 ${viewMode === 'grid' ? 'bg-purple-500/20 text-white' : 'bg-slate-800/50 text-gray-400'}`}
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        className={`px-3 py-2 h-10 ${viewMode === 'list' ? 'bg-purple-500/20 text-white' : 'bg-slate-800/50 text-gray-400'}`}
                        onClick={() => setViewMode('list')}
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Navigation par catégories */}
                <Tabs 
                  value={activeCategory}
                  onValueChange={setActiveCategory}
                  className="w-full"
                >
                  <TabsList className="w-full bg-slate-800/30 p-1 flex flex-wrap justify-start border border-purple-500/20 rounded-lg">
                    <TabsTrigger 
                      value="all" 
                      className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white text-gray-400 rounded-md"
                    >
                      <Users className="w-4 h-4 mr-1.5" />
                      Tous
                    </TabsTrigger>
                    <TabsTrigger 
                      value="admin" 
                      className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400 text-gray-400 rounded-md"
                    >
                      <Crown className="w-4 h-4 mr-1.5" />
                      Direction
                    </TabsTrigger>
                    <TabsTrigger 
                      value="mod" 
                      className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 text-gray-400 rounded-md"
                    >
                      <Shield className="w-4 h-4 mr-1.5" />
                      Modération
                    </TabsTrigger>
                    <TabsTrigger 
                      value="elite" 
                      className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 text-gray-400 rounded-md"
                    >
                      <Trophy className="w-4 h-4 mr-1.5" />
                      Élite
                    </TabsTrigger>
                    <TabsTrigger 
                      value="member" 
                      className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 text-gray-400 rounded-md"
                    >
                      <Star className="w-4 h-4 mr-1.5" />
                      Membres
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Statistiques rapides */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-slate-900/40 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{filteredMembers.length}</p>
              <p className="text-sm text-gray-400">Membres</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/40 backdrop-blur-xl border-yellow-500/20">
            <CardContent className="p-4 text-center">
              <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {filteredMembers.filter(m => m.roles?.some((r: string) => r.includes('Admin') || r.includes('Fondateur'))).length}
              </p>
              <p className="text-sm text-gray-400">Admins</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/40 backdrop-blur-xl border-blue-500/20">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {filteredMembers.filter(m => m.roles?.some((r: string) => r.includes('Modérateur'))).length}
              </p>
              <p className="text-sm text-gray-400">Modérateurs</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/40 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {filteredMembers.filter(m => m.roles?.some((r: string) => r.includes('Elite') || r.includes('Vétéran'))).length}
              </p>
              <p className="text-sm text-gray-400">Élite</p>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Grille de membres */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <Card key={i} className="bg-slate-900/40 backdrop-blur-xl border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-16 w-16 rounded-full bg-slate-700/50" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32 bg-slate-700/50" />
                      <Skeleton className="h-3 w-24 bg-slate-700/50" />
                      <Skeleton className="h-3 w-40 bg-slate-700/50" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="bg-red-900/40 backdrop-blur-xl border-red-500/20">
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-400 mb-2">Connexion Discord en cours...</h3>
              <p className="text-gray-300">Le bot Discord se connecte pour récupérer les membres du serveur.</p>
            </CardContent>
          </Card>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            <AnimatePresence>
              {filteredMembers.map((member: any, index: number) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  index={index}
                  isLoaded={isLoaded}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredMembers.length === 0 && !isLoading && !error && (
          <Card className="bg-slate-900/40 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-8 text-center">
              <Search className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Aucun membre trouvé</h3>
              <p className="text-gray-400">Essayez de modifier vos critères de recherche.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}