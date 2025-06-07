import { useQuery } from '@tanstack/react-query';
import { Users, Crown, Shield, Star, Calendar, Trophy, Search, ChevronRight, Grid, List, Filter, ArrowUpDown, UserPlus, X, Eye, Gamepad2, Zap, LayoutGrid, LayoutList, SlidersHorizontal } from 'lucide-react';
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
import { AnimatedMemberCard } from '@/components/animated-member-card';
import { MemberProfileModal } from '@/components/member-profile-modal';
import { MembersHeaderEffect } from '@/components/members-header-effect';
import resnBg from '../assets/resn-inspired-bg.svg';

interface MemberCardProps {
  member: any;
  index: number;
  isLoaded: boolean;
}

// Fonction pour déterminer le variant de la carte en fonction des rôles du membre
function getMemberCardVariant(roles?: string[]): 'default' | 'premium' | 'elite' | 'admin' {
  if (!roles || roles.length === 0) return 'default';
  
  if (roles.some(r => r === 'Admin' || r === 'Fondateur')) return 'admin';
  if (roles.some(r => r === 'Modérateur' || r === 'Développeur')) return 'premium';
  if (roles.some(r => r === 'Vétéran' || r === 'Membre Elite' || r.includes('Elite'))) return 'elite';
  
  return 'default';
}

export default function Members() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortOption, setSortOption] = useState('role');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { theme } = useThemeCustomization();
  const { user, isAuthenticated } = useAuth();
  
  const { data: members, isLoading, error } = useQuery({
    queryKey: ['/api/discord/members'],
    queryFn: fetchDiscordMembers,
    retry: 1,
  });

  // Membres par défaut (en cas d'erreur de chargement)
  const defaultMembers = [
    {
      id: '1',
      username: 'PlayerAdmin',
      displayName: 'PlayerAdmin',
      roles: ['Fondateur'],
      joinedAt: new Date('2023-01-01'),
      avatar: null
    },
    {
      id: '2',
      username: 'StrategyMaster',
      displayName: 'Strategy Master',
      roles: ['Admin'],
      joinedAt: new Date('2023-02-15'),
      avatar: null
    },
    {
      id: '3',
      username: 'TacticQueen',
      displayName: 'Tactic Queen',
      roles: ['Modérateur'],
      joinedAt: new Date('2023-03-10'),
      avatar: null
    },
    {
      id: '4',
      username: 'EliteGamer',
      displayName: 'Elite Gamer',
      roles: ['Vétéran'],
      joinedAt: new Date('2023-04-05'),
      avatar: null
    }
  ];

  useEffect(() => {
    // Simuler un temps de chargement pour les animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Gérer le clic sur une carte de membre pour ouvrir le modal
  const handleMemberClick = (member: any) => {
    setSelectedMember(member);
    setIsProfileModalOpen(true);
  };
  
  // Fermer le modal de profil
  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const getMembersByCategory = () => {
    const allMembers = members?.length ? members : defaultMembers;
    
    // Appliquer les filtres de recherche
    let filtered = allMembers.filter(member => {
      const matchesSearch = member.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (member.displayName && member.displayName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filtre par catégorie d'onglet
      const matchesCategory = (() => {
        if (activeCategory === 'all') return true;
        if (activeCategory === 'admin') return member.roles?.some(r => r === 'Admin' || r === 'Fondateur');
        if (activeCategory === 'mod') return member.roles?.some(r => r === 'Modérateur');
        if (activeCategory === 'elite') return member.roles?.some(r => r === 'Vétéran' || r === 'Membre Elite' || r.includes('Elite'));
        if (activeCategory === 'member') return !member.roles?.some(r => 
          r === 'Admin' || r === 'Fondateur' || r === 'Modérateur' || r === 'Vétéran' || r === 'Membre Elite' || r.includes('Elite')
        ) || member.roles?.length === 0;
        return true;
      })();
      
      // Filtre par rôle sélectionné
      const matchesRole = selectedRole ? member.roles?.some(role => role === selectedRole) : true;
      
      return matchesSearch && matchesCategory && matchesRole;
    });
    
    // Appliquer le tri
    filtered = filtered.sort((a, b) => {
      if (sortOption === 'role') {
        const roleOrder: Record<string, number> = {
          'Fondateur': 1,
          'Admin': 2,
          'Développeur': 3,
          'Modérateur': 4,
          'Vétéran': 5,
          'Membre Elite': 6
        };
        
        const aRole = a.roles && a.roles.length > 0 ? a.roles[0] : 'Membre';
        const bRole = b.roles && b.roles.length > 0 ? b.roles[0] : 'Membre';
        
        const aOrder = roleOrder[aRole] || 99;
        const bOrder = roleOrder[bRole] || 99;
        
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
        return bDate - aDate; // Plus récent en premier
      }
      
      return 0;
    });
    
    return filtered;
  };

  const getUniqueRoles = () => {
    const allMembers = members?.length ? members : defaultMembers;
    const allRoles = allMembers.flatMap(member => member.roles || []);
    return Array.from(new Set(allRoles));
  };

  return (
    <div className="relative min-h-screen bg-deep-black text-white pb-20">
      {/* Effets de fond animés */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] opacity-20 z-0"></div>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-deep-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0">
        <img src={resnBg} alt="Background" className="w-full h-full object-cover object-center opacity-30" />
      </div>
      <MembersHeaderEffect />
      
      <div className="container mx-auto px-4 pt-20 relative z-10">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl font-bold tracking-tight mb-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-light to-blue-400">
              Membres <span className="text-white">S.L.Z</span>
            </span>
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Notre guilde réunit les meilleurs joueurs et stratèges de <span className="text-purple-light font-semibold">Arise Crossover</span>. Découvrez notre équipe d'élite.
          </motion.p>
        </motion.div>
        
        {/* Filtres et contrôles de navigation */}
        <div 
          className={`mb-12 transform transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
          style={{ transitionDelay: '0.2s' }}
        >
          <Card className="bg-dark-purple/30 backdrop-blur-sm border-purple-light/10 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6">
                {/* Barre de recherche et contrôles de vue */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Rechercher un membre..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-deep-black/50 border-purple-primary/20 focus:border-purple-primary/50 text-white pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    {searchQuery && (
                      <button 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                        onClick={() => setSearchQuery('')}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-3 items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Select
                            value={sortOption}
                            onValueChange={(value) => setSortOption(value)}
                          >
                            <SelectTrigger className="w-[140px] bg-deep-black/50 border-purple-primary/20 text-white">
                              <SelectValue placeholder="Trier par..." />
                            </SelectTrigger>
                            <SelectContent className="bg-deep-black border-purple-primary/20 text-white">
                              <SelectItem value="role">Par rôle</SelectItem>
                              <SelectItem value="name">Par nom</SelectItem>
                              <SelectItem value="joinDate">Par date</SelectItem>
                            </SelectContent>
                          </Select>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Trier les membres</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <div className="flex border border-purple-primary/20 rounded-md overflow-hidden">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              className={`px-3 py-2 h-10 ${viewMode === 'grid' ? 'bg-purple-primary/20 text-white' : 'bg-deep-black/50 text-white/60'}`}
                              onClick={() => setViewMode('grid')}
                            >
                              <Grid className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Vue en grille</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              className={`px-3 py-2 h-10 ${viewMode === 'list' ? 'bg-purple-primary/20 text-white' : 'bg-deep-black/50 text-white/60'}`}
                              onClick={() => setViewMode('list')}
                            >
                              <List className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Vue en liste</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
                
                {/* Navigation par catégories */}
                <Tabs 
                  defaultValue="all" 
                  value={activeCategory}
                  onValueChange={setActiveCategory}
                  className="w-full"
                >
                  <TabsList className="w-full bg-deep-black/30 p-1 flex flex-wrap justify-start border border-purple-primary/10 rounded-lg">
                    <TabsTrigger 
                      value="all" 
                      className="data-[state=active]:bg-purple-primary/20 data-[state=active]:text-white text-white/70 rounded-md"
                    >
                      <Users className="w-4 h-4 mr-1.5" />
                      Tous
                    </TabsTrigger>
                    <TabsTrigger 
                      value="admin" 
                      className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400 text-white/70 rounded-md"
                    >
                      <Crown className="w-4 h-4 mr-1.5" />
                      Direction
                    </TabsTrigger>
                    <TabsTrigger 
                      value="mod" 
                      className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 text-white/70 rounded-md"
                    >
                      <Shield className="w-4 h-4 mr-1.5" />
                      Modération
                    </TabsTrigger>
                    <TabsTrigger 
                      value="elite" 
                      className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 text-white/70 rounded-md"
                    >
                      <Trophy className="w-4 h-4 mr-1.5" />
                      Élite
                    </TabsTrigger>
                    <TabsTrigger 
                      value="member" 
                      className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 text-white/70 rounded-md"
                    >
                      <Star className="w-4 h-4 mr-1.5" />
                      Membres
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Grille de membres */}
        {isLoading ? (
          <div 
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-dark-purple/30 backdrop-blur-sm border-purple-light/10">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Skeleton className="w-12 h-12 rounded-full bg-purple-primary/10" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24 bg-purple-primary/10" />
                      <Skeleton className="h-3 w-16 bg-purple-primary/10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-32 bg-purple-primary/10" />
                    <Skeleton className="h-3 w-28 bg-purple-primary/10" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="all" className="mt-6">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {getMembersByCategory().length > 0 ? (
                    getMembersByCategory().map((member, index) => (
                      <MemberCard 
                        key={member.id} 
                        member={member} 
                        index={index} 
                        isLoaded={isLoaded} 
                      />
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-10">
                      <div className="bg-dark-purple/30 backdrop-blur-sm border border-purple-light/10 rounded-lg p-8 max-w-md mx-auto">
                        <Users className="w-12 h-12 mx-auto mb-4 text-purple-400 opacity-60" />
                        <h3 className="text-xl font-semibold mb-2">Aucun membre trouvé</h3>
                        <p className="text-gray-400">
                          Aucun membre ne correspond à votre recherche. Essayez d'autres termes ou filtres.
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4 border-purple-500/20 hover:border-purple-500/50"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedRole(null);
                          }}
                        >
                          Réinitialiser les filtres
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 mb-12">
                  {getMembersByCategory().length > 0 ? (
                    getMembersByCategory().map((member, index) => (
                      <div
                        key={member.id}
                        className={`transform transition-all duration-1000 ${
                          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                        }`}
                        style={{ transitionDelay: `${0.3 + index * 0.03}s` }}
                      >
                        <Card className="bg-dark-purple/30 backdrop-blur-sm border-purple-light/10 hover:border-purple-light/30 group transition-all duration-300">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <DiscordAvatar
                                  userId={member.id}
                                  avatar={member.avatar}
                                  username={member.displayName || member.username}
                                  size="md"
                                  className="border-2 border-purple-500/20 group-hover:border-purple-500/50 transition-colors duration-300"
                                />
                                <div>
                                  <h3 className="font-medium group-hover:text-purple-light transition-colors duration-300">
                                    {member.displayName || member.username}
                                  </h3>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {member.roles?.slice(0, 2).map((role: string, idx: number) => (
                                      <Badge
                                        key={`${member.id}-${role}-${idx}`}
                                        variant="outline"
                                        className="text-xs py-0 h-5"
                                      >
                                        {role}
                                      </Badge>
                                    ))}
                                    {member.roles && member.roles.length > 2 && (
                                      <Badge variant="outline" className="text-xs py-0 h-5">
                                        +{member.roles.length - 2}
                                      </Badge>
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
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <div className="bg-dark-purple/30 backdrop-blur-sm border border-purple-light/10 rounded-lg p-8 max-w-md mx-auto">
                        <Users className="w-12 h-12 mx-auto mb-4 text-purple-400 opacity-60" />
                        <h3 className="text-xl font-semibold mb-2">Aucun membre trouvé</h3>
                        <p className="text-gray-400">
                          Aucun membre ne correspond à votre recherche. Essayez d'autres termes ou filtres.
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4 border-purple-500/20 hover:border-purple-500/50"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedRole(null);
                          }}
                        >
                          Réinitialiser les filtres
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="admin">
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" : "space-y-3 mb-12"}>
                {getMembersByCategory().length > 0 ? (
                  viewMode === 'grid' ? (
                    getMembersByCategory().map((member, index) => (
                      <MemberCard key={member.id} member={member} index={index} isLoaded={isLoaded} />
                    ))
                  ) : (
                    getMembersByCategory().map((member, index) => (
                      <div
                        key={member.id}
                        className={`transform transition-all duration-1000 ${
                          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                        }`}
                        style={{ transitionDelay: `${0.3 + index * 0.03}s` }}
                      >
                        <Card className="bg-dark-purple/30 backdrop-blur-sm border-purple-light/10 hover:border-purple-light/30 group transition-all duration-300">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <DiscordAvatar
                                  userId={member.id}
                                  avatar={member.avatar}
                                  username={member.displayName || member.username}
                                  size="md"
                                  className="border-2 border-purple-500/20 group-hover:border-purple-500/50 transition-colors duration-300"
                                />
                                <div>
                                  <h3 className="font-medium group-hover:text-purple-light transition-colors duration-300">
                                    {member.displayName || member.username}
                                  </h3>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {member.roles?.slice(0, 2).map((role: string, idx: number) => (
                                      <Badge
                                        key={`${member.id}-${role}-${idx}`}
                                        variant="outline"
                                        className="text-xs py-0 h-5"
                                      >
                                        {role}
                                      </Badge>
                                    ))}
                                    {member.roles && member.roles.length > 2 && (
                                      <Badge variant="outline" className="text-xs py-0 h-5">
                                        +{member.roles.length - 2}
                                      </Badge>
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
                      </div>
                    ))
                  )
                ) : (
                  <div className="col-span-3 text-center py-10">
                    <div className="bg-dark-purple/30 backdrop-blur-sm border border-purple-light/10 rounded-lg p-8 max-w-md mx-auto">
                      <Users className="w-12 h-12 mx-auto mb-4 text-purple-400 opacity-60" />
                      <h3 className="text-xl font-semibold mb-2">Aucun membre trouvé</h3>
                      <p className="text-gray-400">
                        Aucun membre ne correspond à votre recherche. Essayez d'autres termes ou filtres.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4 border-purple-500/20 hover:border-purple-500/50"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedRole(null);
                        }}
                      >
                        Réinitialiser les filtres
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="mod">
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" : "space-y-3 mb-12"}>
                {getMembersByCategory().length > 0 ? (
                  viewMode === 'grid' ? (
                    getMembersByCategory().map((member, index) => (
                      <MemberCard key={member.id} member={member} index={index} isLoaded={isLoaded} />
                    ))
                  ) : (
                    getMembersByCategory().map((member, index) => (
                      <div
                        key={member.id}
                        className={`transform transition-all duration-1000 ${
                          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                        }`}
                        style={{ transitionDelay: `${0.3 + index * 0.03}s` }}
                      >
                        <Card className="bg-dark-purple/30 backdrop-blur-sm border-purple-light/10 hover:border-purple-light/30 group transition-all duration-300">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <DiscordAvatar
                                  userId={member.id}
                                  avatar={member.avatar}
                                  username={member.displayName || member.username}
                                  size="md"
                                  className="border-2 border-purple-500/20 group-hover:border-purple-500/50 transition-colors duration-300"
                                />
                                <div>
                                  <h3 className="font-medium group-hover:text-purple-light transition-colors duration-300">
                                    {member.displayName || member.username}
                                  </h3>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {member.roles?.slice(0, 2).map((role: string, idx: number) => (
                                      <Badge
                                        key={`${member.id}-${role}-${idx}`}
                                        variant="outline"
                                        className="text-xs py-0 h-5"
                                      >
                                        {role}
                                      </Badge>
                                    ))}
                                    {member.roles && member.roles.length > 2 && (
                                      <Badge variant="outline" className="text-xs py-0 h-5">
                                        +{member.roles.length - 2}
                                      </Badge>
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
                      </div>
                    ))
                  )
                ) : (
                  <div className="col-span-3 text-center py-10">
                    <div className="bg-dark-purple/30 backdrop-blur-sm border border-purple-light/10 rounded-lg p-8 max-w-md mx-auto">
                      <Users className="w-12 h-12 mx-auto mb-4 text-purple-400 opacity-60" />
                      <h3 className="text-xl font-semibold mb-2">Aucun membre trouvé</h3>
                      <p className="text-gray-400">
                        Aucun membre ne correspond à votre recherche. Essayez d'autres termes ou filtres.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4 border-purple-500/20 hover:border-purple-500/50"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedRole(null);
                        }}
                      >
                        Réinitialiser les filtres
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="elite">
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" : "space-y-3 mb-12"}>
                {getMembersByCategory().length > 0 ? (
                  viewMode === 'grid' ? (
                    getMembersByCategory().map((member, index) => (
                      <MemberCard key={member.id} member={member} index={index} isLoaded={isLoaded} />
                    ))
                  ) : (
                    getMembersByCategory().map((member, index) => (
                      <div
                        key={member.id}
                        className={`transform transition-all duration-1000 ${
                          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                        }`}
                        style={{ transitionDelay: `${0.3 + index * 0.03}s` }}
                      >
                        <Card className="bg-dark-purple/30 backdrop-blur-sm border-purple-light/10 hover:border-purple-light/30 group transition-all duration-300">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <DiscordAvatar
                                  userId={member.id}
                                  avatar={member.avatar}
                                  username={member.displayName || member.username}
                                  size="md"
                                  className="border-2 border-purple-500/20 group-hover:border-purple-500/50 transition-colors duration-300"
                                />
                                <div>
                                  <h3 className="font-medium group-hover:text-purple-light transition-colors duration-300">
                                    {member.displayName || member.username}
                                  </h3>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {member.roles?.slice(0, 2).map((role: string, idx: number) => (
                                      <Badge
                                        key={`${member.id}-${role}-${idx}`}
                                        variant="outline"
                                        className="text-xs py-0 h-5"
                                      >
                                        {role}
                                      </Badge>
                                    ))}
                                    {member.roles && member.roles.length > 2 && (
                                      <Badge variant="outline" className="text-xs py-0 h-5">
                                        +{member.roles.length - 2}
                                      </Badge>
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
                      </div>
                    ))
                  )
                ) : (
                  <div className="col-span-3 text-center py-10">
                    <div className="bg-dark-purple/30 backdrop-blur-sm border border-purple-light/10 rounded-lg p-8 max-w-md mx-auto">
                      <Users className="w-12 h-12 mx-auto mb-4 text-purple-400 opacity-60" />
                      <h3 className="text-xl font-semibold mb-2">Aucun membre trouvé</h3>
                      <p className="text-gray-400">
                        Aucun membre ne correspond à votre recherche. Essayez d'autres termes ou filtres.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4 border-purple-500/20 hover:border-purple-500/50"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedRole(null);
                        }}
                      >
                        Réinitialiser les filtres
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="member">
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" : "space-y-3 mb-12"}>
                {getMembersByCategory().length > 0 ? (
                  viewMode === 'grid' ? (
                    getMembersByCategory().map((member, index) => (
                      <MemberCard key={member.id} member={member} index={index} isLoaded={isLoaded} />
                    ))
                  ) : (
                    getMembersByCategory().map((member, index) => (
                      <div
                        key={member.id}
                        className={`transform transition-all duration-1000 ${
                          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                        }`}
                        style={{ transitionDelay: `${0.3 + index * 0.03}s` }}
                      >
                        <Card className="bg-dark-purple/30 backdrop-blur-sm border-purple-light/10 hover:border-purple-light/30 group transition-all duration-300">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <DiscordAvatar
                                  userId={member.id}
                                  avatar={member.avatar}
                                  username={member.displayName || member.username}
                                  size="md"
                                  className="border-2 border-purple-500/20 group-hover:border-purple-500/50 transition-colors duration-300"
                                />
                                <div>
                                  <h3 className="font-medium group-hover:text-purple-light transition-colors duration-300">
                                    {member.displayName || member.username}
                                  </h3>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {member.roles?.slice(0, 2).map((role: string, idx: number) => (
                                      <Badge
                                        key={`${member.id}-${role}-${idx}`}
                                        variant="outline"
                                        className="text-xs py-0 h-5"
                                      >
                                        {role}
                                      </Badge>
                                    ))}
                                    {member.roles && member.roles.length > 2 && (
                                      <Badge variant="outline" className="text-xs py-0 h-5">
                                        +{member.roles.length - 2}
                                      </Badge>
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
                      </div>
                    ))
                  )
                ) : (
                  <div className="col-span-3 text-center py-10">
                    <div className="bg-dark-purple/30 backdrop-blur-sm border border-purple-light/10 rounded-lg p-8 max-w-md mx-auto">
                      <Users className="w-12 h-12 mx-auto mb-4 text-purple-400 opacity-60" />
                      <h3 className="text-xl font-semibold mb-2">Aucun membre trouvé</h3>
                      <p className="text-gray-400">
                        Aucun membre ne correspond à votre recherche. Essayez d'autres termes ou filtres.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4 border-purple-500/20 hover:border-purple-500/50"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedRole(null);
                        }}
                      >
                        Réinitialiser les filtres
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </>
        )}
        
        {/* Statistiques */}
        <div 
          className={`transform transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
          style={{ transitionDelay: '0.6s' }}
        >
          <Card className="bg-dark-purple/30 backdrop-blur-sm border-purple-light/10">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-deep-black/40 p-4 rounded-lg text-center">
                  <Users className="w-6 h-6 mb-2 mx-auto text-purple-400" />
                  <p className="text-sm text-gray-400">Total Membres</p>
                  <p className="text-2xl font-bold">{getMembersByCategory().length}</p>
                </div>
                
                <div className="bg-deep-black/40 p-4 rounded-lg text-center">
                  <Crown className="w-6 h-6 mb-2 mx-auto text-yellow-400" />
                  <p className="text-sm text-gray-400">Direction</p>
                  <p className="text-2xl font-bold">
                    {getMembersByCategory().filter(m => 
                      m.roles?.some(r => r === 'Admin' || r === 'Fondateur')
                    ).length}
                  </p>
                </div>
                
                <div className="bg-deep-black/40 p-4 rounded-lg text-center">
                  <Shield className="w-6 h-6 mb-2 mx-auto text-blue-400" />
                  <p className="text-sm text-gray-400">Staff</p>
                  <p className="text-2xl font-bold">
                    {getMembersByCategory().filter(m => 
                      m.roles?.some(r => r === 'Modérateur' || r === 'Développeur')
                    ).length}
                  </p>
                </div>
                
                <div className="bg-deep-black/40 p-4 rounded-lg text-center">
                  <Trophy className="w-6 h-6 mb-2 mx-auto text-purple-400" />
                  <p className="text-sm text-gray-400">Élite</p>
                  <p className="text-2xl font-bold">
                    {getMembersByCategory().filter(m => 
                      m.roles?.some(r => r.includes('Elite') || r === 'Vétéran')
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}