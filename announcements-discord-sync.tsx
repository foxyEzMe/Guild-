import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Calendar, Heart, Eye, Pin, User, Crown, Shield, Zap, Award, Gem, Sparkles, Star, ArrowRight, MessageCircle, ThumbsUp, Share2, Bookmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchDiscordAnnouncements } from '@/lib/discord-api';

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

interface AnnouncementCardProps {
  announcement: any;
  index: number;
  isLoaded: boolean;
}

function AnnouncementCard({ announcement, index, isLoaded }: AnnouncementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const contentPreview = announcement.content.length > 150 
    ? announcement.content.substring(0, 150) + '...'
    : announcement.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ 
        opacity: isLoaded ? 1 : 0, 
        y: isLoaded ? 0 : 50,
        scale: isLoaded ? 1 : 0.95
      }}
      transition={{ 
        duration: 0.6,
        delay: index * 0.15,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.03,
        rotateX: 5,
        rotateY: 3,
        z: 30,
        transition: { duration: 0.4, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="bg-slate-900/60 backdrop-blur-xl border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 overflow-hidden group">
        <CardContent className="p-0">
          {/* Header avec auteur */}
          <div className="p-6 pb-4 border-b border-purple-500/10">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {/* Avatar de l'auteur */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative"
                >
                  <Avatar className="w-12 h-12 ring-2 ring-purple-500/30 group-hover:ring-purple-400/50 transition-all duration-300">
                    <AvatarImage 
                      src={announcement.authorAvatar || `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5)}.png`} 
                      alt={announcement.author} 
                    />
                    <AvatarFallback className="bg-purple-600 text-white font-bold">
                      {announcement.author?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {/* Badge premium pour certains rôles */}
                  {announcement.authorRoles?.some((role: string) => 
                    role.includes('Admin') || role.includes('Fondateur') || role.includes('Owner')
                  ) && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Crown className="w-2 h-2 text-white" />
                    </div>
                  )}
                </motion.div>

                {/* Informations de l'auteur */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-bold text-white text-sm">
                      {announcement.author}
                    </h4>
                    {announcement.authorRoles?.slice(0, 2).map((role: string, roleIndex: number) => (
                      <motion.div
                        key={role}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (index * 0.15) + (roleIndex * 0.05) }}
                      >
                        <Badge className={`${getRoleBadgeColor(role)} text-white text-xs px-1.5 py-0.5 flex items-center space-x-1`}>
                          {getRoleIcon(role)}
                          <span className="text-xs">{role}</span>
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(announcement.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {announcement.pinned && (
                      <span className="flex items-center text-yellow-400">
                        <Pin className="w-3 h-3 mr-1" />
                        Épinglé
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-400 p-1">
                  <ThumbsUp className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-400 p-1">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-400 p-1">
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Contenu de l'annonce */}
          <div className="p-6">
            {/* Titre */}
            <motion.h3 
              className="text-xl font-bold text-white mb-3 group-hover:text-purple-100 transition-colors duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: (index * 0.15) + 0.1 }}
            >
              {announcement.title}
            </motion.h3>

            {/* Contenu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: (index * 0.15) + 0.2 }}
            >
              <p className="text-gray-300 leading-relaxed mb-4">
                {isExpanded ? announcement.content : contentPreview}
              </p>
              
              {announcement.content.length > 150 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-purple-400 hover:text-purple-300 p-0 h-auto font-medium"
                >
                  {isExpanded ? 'Voir moins' : 'Voir plus'}
                  <ArrowRight className={`w-3 h-3 ml-1 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </Button>
              )}
            </motion.div>

            {/* Footer avec statistiques */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-purple-500/10">
              <div className="flex items-center space-x-4">
                {announcement.reactions > 0 && (
                  <div className="flex items-center text-sm text-gray-400">
                    <Heart className="w-4 h-4 mr-1 text-red-400" />
                    <span>{announcement.reactions} réaction{announcement.reactions > 1 ? 's' : ''}</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-400">
                  <MessageCircle className="w-4 h-4 mr-1 text-blue-400" />
                  <span>Discord #{announcement.channelId}</span>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-purple-400 group-hover:text-purple-300 transition-colors"
              >
                <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                  Voir sur Discord
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AnnouncementsDiscordSync() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();
  
  const { data: announcements, isLoading, error } = useQuery({
    queryKey: ['/api/discord/announcements'],
    queryFn: () => fetchDiscordAnnouncements(10),
    retry: 2,
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white pb-20">
      {/* Effets de fond */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] opacity-20 z-0"></div>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-slate-900 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <div className="container mx-auto px-4 pt-20 relative z-10">
        {/* Header */}
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
              Annonces Black Heart
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Restez informés des dernières nouvelles et événements de notre guilde directement depuis Discord.
          </motion.p>
          
          {/* Badge de synchronisation Discord */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="inline-flex items-center space-x-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full px-4 py-2"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-indigo-300">Synchronisé avec Discord</span>
            <MessageSquare className="w-4 h-4 text-indigo-400" />
          </motion.div>
        </motion.div>

        {/* Stats rapides */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-slate-900/40 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{announcements?.length || 0}</p>
              <p className="text-sm text-gray-400">Annonces</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/40 backdrop-blur-xl border-blue-500/20">
            <CardContent className="p-4 text-center">
              <Pin className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {announcements?.filter((a: any) => a.pinned).length || 0}
              </p>
              <p className="text-sm text-gray-400">Épinglées</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/40 backdrop-blur-xl border-red-500/20">
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {announcements?.reduce((sum: number, a: any) => sum + (a.reactions || 0), 0) || 0}
              </p>
              <p className="text-sm text-gray-400">Réactions</p>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Liste des annonces */}
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-slate-900/40 backdrop-blur-xl border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full bg-slate-700/50" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32 bg-slate-700/50" />
                      <Skeleton className="h-3 w-24 bg-slate-700/50" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-3/4 bg-slate-700/50 mb-3" />
                  <Skeleton className="h-4 w-full bg-slate-700/50 mb-2" />
                  <Skeleton className="h-4 w-2/3 bg-slate-700/50" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="bg-orange-900/40 backdrop-blur-xl border-orange-500/20">
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-16 h-16 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-orange-400 mb-2">Connexion Discord en cours...</h3>
              <p className="text-gray-300">Le bot Discord se connecte pour récupérer les dernières annonces.</p>
            </CardContent>
          </Card>
        ) : announcements && announcements.length > 0 ? (
          <div className="space-y-6">
            <AnimatePresence>
              {announcements.map((announcement: any, index: number) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  index={index}
                  isLoaded={isLoaded}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <Card className="bg-slate-900/40 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Aucune annonce pour le moment</h3>
              <p className="text-gray-400">Les nouvelles annonces du salon Discord apparaîtront ici automatiquement.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}