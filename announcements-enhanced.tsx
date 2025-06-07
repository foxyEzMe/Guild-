import { useQuery } from '@tanstack/react-query';
import { 
  Megaphone, Calendar, User, MessageCircle, Trophy, Bell, 
  Zap, Star, Lock, ChevronRight, ExternalLink, 
  Sparkles, Users, Crown, Heart, Share2, BookOpen, X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { fetchDiscordAnnouncements } from '@/lib/discord-api';
import { DiscordAvatar } from '@/components/discord-avatar';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeCustomization } from '@/contexts/ThemeCustomizationContext';
import resnBg from '../assets/resn-inspired-bg.svg';
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocation } from 'wouter';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

export default function Announcements() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { theme } = useThemeCustomization();
  
  const { data: announcements, isLoading, error } = useQuery({
    queryKey: ['/api/discord/announcements'],
    queryFn: () => fetchDiscordAnnouncements(10),
  });

  // Annonces de base pour l'affichage (mises à jour pour mai 2025)
  const defaultAnnouncements = [
    {
      id: '1',
      title: '🌟 ÉVÉNEMENT SPÉCIAL - Grand Tournoi S.L.Z 2025',
      content: 'Rejoignez-nous pour le GRAND TOURNOI S.L.Z le 31 mai à 20h ! 🎮 Plus de 100 000 Robux de prix, participation des joueurs professionnels et diffusion en direct sur Twitch ! Inscriptions ouvertes dans #tournoi-slz jusqu\'au 30 mai. Préparez vos meilleures stratégies, cet événement sera légendaire ! 🏆',
      author: 'Yuki',
      authorId: '1271780076102488177',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      channelName: 'événements',
      reactions: 85
    },
    {
      id: '2', 
      title: '⚡ MISE À JOUR MAJEURE - Version 3.5 du serveur',
      content: 'Mise à jour 3.5 déployée ! 🚀 Nouvelles fonctionnalités : profils Discord synchronisés, système de badges amélioré, chat temps réel optimisé et nouvelle section stratégies exclusives pour les membres de rang A et supérieur. Découvrez toutes les améliorations en vous connectant au site maintenant !',
      author: '404',
      authorId: '997247681330159636',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      channelName: 'annonces',
      reactions: 62
    },
    {
      id: '3',
      title: '🎮 RÉSULTATS - Tournoi Arise Crossover de Mai',
      content: 'Félicitations aux vainqueurs du tournoi de Mai ! 🏆 Équipe Phantom X en 1ère place, suivie par les Dragons de Feu et les Ninjas Célestes ! Visionnez les replay des meilleurs moments sur notre chaîne YouTube. Le prochain tournoi mensuel commence les inscriptions dès demain. Préparez-vous pour de nouveaux défis et récompenses exclusives !',
      author: 'NightFury',
      authorId: '123456789',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
      channelName: 'résultats',
      reactions: 47
    },
    {
      id: '4',
      title: '🛡️ STRATÉGIE EXCLUSIVE - Tactiques de domination en mode Raid',
      content: 'Nouvelles stratégies dévoilées pour les raids de niveau élite ! 📊 Notre équipe d\'analystes a développé des combinaisons imbattables pour les Boss de niveau S. Consultez les guides détaillés dans le canal #stratégies-elite. Formation spéciale ce weekend pour les membres de rang B+ dirigée par notre champion Yuki.',
      author: 'Yuki',
      authorId: '1271780076102488177',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      channelName: 'stratégies',
      reactions: 39
    },
    {
      id: '5',
      title: '💎 RECRUTEMENT - Nouvelle saison compétitive',
      content: 'Ouverture du recrutement pour la saison compétitive Mai-Août 2025 ! 🌠 Nous recherchons des joueurs de rang B minimum avec expérience en PvP tactique. Tests d\'admission les 28-29 mai organisés par nos modérateurs. Avantages exclusifs : coaching personnalisé, accès aux stratégies premium et participation garantie aux tournois sponsorisés.',
      author: 'CyberNinja',
      authorId: '456123789',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      channelName: 'recrutement',
      reactions: 74
    },
    {
      id: '6',
      title: '🎁 RÉCOMPENSES - Événement spécial 10 000 membres',
      content: 'NOUS AVONS ATTEINT 10 000 MEMBRES ! 🎉 Pour célébrer cette étape incroyable, nous distribuons des récompenses exclusives : accessoires limités, bonus d\'XP x3 pendant toute la semaine et items légendaires pour tous les membres actifs ! Connectez-vous avant le 30 mai pour recevoir votre pack de célébration spécial !',
      author: 'VortexQueen',
      authorId: '321654987',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
      channelName: 'annonces',
      reactions: 128
    }
  ];
  
  // Animation d'entrée
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Gestion du modal des annonces
  const handleAnnouncementClick = (announcement: any) => {
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }
    
    setSelectedAnnouncement(announcement);
    setIsAnnouncementModalOpen(true);
  };
  
  const handleCloseAnnouncementModal = () => {
    setIsAnnouncementModalOpen(false);
  };
  
  // Redirection vers la page de connexion si l'utilisateur tente d'accéder à une annonce complète sans être connecté
  useEffect(() => {
    if (!authLoading && expandedAnnouncement && !isAuthenticated) {
      // Afficher un modal ou rediriger vers la page de connexion
      setExpandedAnnouncement(null);
      setLocation("/login");
    }
  }, [expandedAnnouncement, isAuthenticated, authLoading, setLocation]);

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Il y a moins d\'une heure';
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
      } else {
        return dateObj.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    }
  };

  const getAnnouncementIcon = (title: string) => {
    if (title.toLowerCase().includes('tournoi') || title.toLowerCase().includes('compétiti')) {
      return <Trophy className="w-full h-full text-yellow-400" />;
    }
    if (title.toLowerCase().includes('mise à jour') || title.toLowerCase().includes('update')) {
      return <Zap className="w-full h-full text-blue-400" />;
    }
    if (title.toLowerCase().includes('raid') || title.toLowerCase().includes('stratégie')) {
      return <BookOpen className="w-full h-full text-green-400" />;
    }
    if (title.toLowerCase().includes('recrutement') || title.toLowerCase().includes('rejoignez')) {
      return <Users className="w-full h-full text-purple-400" />;
    }
    if (title.toLowerCase().includes('récompense') || title.toLowerCase().includes('cadeau')) {
      return <Gift className="w-full h-full text-pink-400" />;
    }
    if (title.toLowerCase().includes('événement') || title.toLowerCase().includes('spécial')) {
      return <Sparkles className="w-full h-full text-cyan-400" />;
    }
    return <Megaphone className="w-full h-full text-purple-400" />;
  };

  const getAnnouncementColor = (title: string) => {
    if (title.toLowerCase().includes('tournoi') || title.toLowerCase().includes('compétiti')) {
      return 'from-yellow-500 to-amber-500';
    }
    if (title.toLowerCase().includes('mise à jour') || title.toLowerCase().includes('update')) {
      return 'from-blue-500 to-cyan-500';
    }
    if (title.toLowerCase().includes('raid') || title.toLowerCase().includes('stratégie')) {
      return 'from-green-500 to-teal-500';
    }
    if (title.toLowerCase().includes('recrutement') || title.toLowerCase().includes('rejoignez')) {
      return 'from-purple-500 to-violet-500';
    }
    if (title.toLowerCase().includes('récompense') || title.toLowerCase().includes('cadeau')) {
      return 'from-pink-500 to-rose-500';
    }
    if (title.toLowerCase().includes('événement') || title.toLowerCase().includes('spécial')) {
      return 'from-cyan-500 to-blue-500';
    }
    return 'from-purple-500 to-indigo-500';
  };
  
  const getAnnouncementBgColor = (title: string) => {
    if (title.toLowerCase().includes('tournoi') || title.toLowerCase().includes('compétiti')) {
      return 'bg-yellow-500/10 border-yellow-500/30';
    }
    if (title.toLowerCase().includes('mise à jour') || title.toLowerCase().includes('update')) {
      return 'bg-blue-500/10 border-blue-500/30';
    }
    if (title.toLowerCase().includes('raid') || title.toLowerCase().includes('stratégie')) {
      return 'bg-green-500/10 border-green-500/30';
    }
    if (title.toLowerCase().includes('recrutement') || title.toLowerCase().includes('rejoignez')) {
      return 'bg-purple-500/10 border-purple-500/30';
    }
    if (title.toLowerCase().includes('récompense') || title.toLowerCase().includes('cadeau')) {
      return 'bg-pink-500/10 border-pink-500/30';
    }
    if (title.toLowerCase().includes('événement') || title.toLowerCase().includes('spécial')) {
      return 'bg-cyan-500/10 border-cyan-500/30';
    }
    return 'bg-purple-500/10 border-purple-500/30';
  };

  if (error) {
    return (
      <div className="min-h-screen pt-20 px-4 bg-near-black/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-sky-blue">Dernières Annonces</h1>
            <Card className="guild-card max-w-md mx-auto">
              <CardContent className="p-6">
                <p className="text-red-400">Erreur lors du chargement des annonces Discord.</p>
                <p className="text-light-gray text-sm mt-2">
                  Vérifiez que le bot Discord est configuré correctement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const displayAnnouncements = announcements?.length ? announcements : defaultAnnouncements;

  return (
    <div className="min-h-screen pt-24 px-4 relative overflow-hidden">
      {/* Fond animé */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] opacity-20 z-0"></div>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-deep-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0">
        <img src={resnBg} alt="Background" className="w-full h-full object-cover object-center opacity-30" />
      </div>
      
      {/* Effets de particules flottantes */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              rotate: [0, 180, 360],
              opacity: [Math.random() * 0.3 + 0.1, Math.random() * 0.8 + 0.3, Math.random() * 0.3 + 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              background: i % 3 === 0 
                ? theme.primaryColor 
                : i % 3 === 1 
                  ? theme.secondaryColor 
                  : theme.accentColor,
              boxShadow: `0 0 10px ${i % 3 === 0 
                ? theme.primaryColor 
                : i % 3 === 1 
                  ? theme.secondaryColor 
                  : theme.accentColor}`,
            }}
          />
        ))}
      </div>
      
      {/* Effet de scan de ligne */}
      <motion.div
        className="absolute left-0 w-full h-[2px] bg-gradient-to-r z-10 pointer-events-none"
        style={{ 
          backgroundImage: `linear-gradient(to right, transparent, ${theme.primaryColor}, transparent)`,
        }}
        animate={{
          top: ['0%', '100%'],
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 2,
        }}
      />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          >
            <motion.div 
              className="w-24 h-24 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 rounded-full mx-auto flex items-center justify-center"
              animate={{ 
                boxShadow: [
                  `0 0 20px 0px ${theme.primaryColor}80`,
                  `0 0 40px 10px ${theme.primaryColor}40`,
                  `0 0 20px 0px ${theme.primaryColor}80`,
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Megaphone className="text-white w-12 h-12" />
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-7xl font-black mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400">
              ANNONCES
            </span>
            <motion.span
              className="inline-block ml-3"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <Sparkles className="h-12 w-12 text-yellow-400" />
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Les dernières nouvelles épiques de l'empire <span className="text-purple-400 font-bold">S.L.Z Guild</span>. Restez informé des événements, tournois et mises à jour.
          </motion.p>
        </motion.div>
        
        {/* Catégories d'annonces */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { label: "Événements", icon: Sparkles, color: "from-cyan-500 to-blue-500" },
            { label: "Tournois", icon: Trophy, color: "from-yellow-500 to-amber-500" },
            { label: "Mises à jour", icon: Zap, color: "from-blue-500 to-indigo-500" },
            { label: "Stratégies", icon: BookOpen, color: "from-green-500 to-emerald-500" },
            { label: "Recrutement", icon: Users, color: "from-purple-500 to-violet-500" },
            { label: "Récompenses", icon: Gift, color: "from-pink-500 to-rose-500" },
          ].map((category, index) => (
            <motion.div
              key={category.label}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
            >
              <Button
                variant="outline"
                className={`w-full h-full flex flex-col items-center justify-center py-3 bg-black/40 backdrop-blur-sm border-${category.color.split(" ")[0].replace("from-", "")}/30 hover:bg-gradient-to-br hover:${category.color} hover:text-white transition-all duration-300`}
              >
                <category.icon className="w-6 h-6 mb-2" />
                <span className="text-xs font-medium">{category.label}</span>
              </Button>
            </motion.div>
          ))}
        </motion.div>
        
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Skeleton className="w-16 h-16 rounded-lg bg-gray-800 flex-shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-6 w-48 bg-gray-800" />
                          <Skeleton className="h-4 w-24 bg-gray-800" />
                        </div>
                        <Skeleton className="h-4 w-full bg-gray-800" />
                        <Skeleton className="h-4 w-3/4 bg-gray-800" />
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-3 w-20 bg-gray-800" />
                          <Skeleton className="h-3 w-16 bg-gray-800" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-8">
              {displayAnnouncements.length > 0 ? (
                displayAnnouncements.map((announcement, index) => (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="w-full"
                  >
                    <motion.div
                      whileHover={{ 
                        scale: 1.02, 
                        boxShadow: `0 0 30px 0px ${theme.primaryColor}30`,
                      }}
                      className={`border rounded-xl transition-all duration-300 cursor-pointer ${getAnnouncementBgColor(announcement.title)}`}
                      onClick={() => handleAnnouncementClick(announcement)}
                    >
                      <div className="flex flex-col md:flex-row items-start p-6">
                        {/* Icône d'annonce */}
                        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 w-16 h-16">
                          <motion.div
                            className={`w-16 h-16 rounded-lg flex items-center justify-center bg-gradient-to-br ${getAnnouncementColor(announcement.title)}`}
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          >
                            <motion.div
                              className="w-10 h-10 flex items-center justify-center"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                              {getAnnouncementIcon(announcement.title)}
                            </motion.div>
                          </motion.div>
                        </div>
                        
                        {/* Contenu de l'annonce */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-2">
                            <h3 className="text-xl md:text-2xl font-bold text-white">
                              {announcement.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-black/50 text-gray-300 px-3">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(announcement.createdAt)}
                              </Badge>
                              <Badge className="bg-purple-500/20 text-purple-300 px-3">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                {announcement.reactions}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-gray-300 mb-4 line-clamp-2 md:line-clamp-3">
                            {announcement.content}
                          </p>
                          
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800 mr-2">
                                <DiscordAvatar
                                  userId={announcement.authorId}
                                  avatar={null}
                                  username={announcement.author}
                                  size="sm"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{announcement.author}</p>
                                <p className="text-xs text-gray-400">{announcement.channelName || "annonces"}</p>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-400 hover:text-white hover:bg-white/10"
                                >
                                  <Heart className="w-4 h-4 mr-1" />
                                  J'aime
                                </Button>
                              </motion.div>
                              
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-400 hover:text-white hover:bg-white/10"
                                >
                                  <Share2 className="w-4 h-4 mr-1" />
                                  Partager
                                </Button>
                              </motion.div>
                              
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10 text-white"
                                >
                                  Voir plus
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="max-w-md mx-auto bg-black/40 backdrop-blur-sm border-purple-500/30">
                    <CardContent className="p-8">
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          ease: "easeInOut" 
                        }}
                        className="mx-auto mb-4"
                      >
                        <Megaphone className="w-16 h-16 text-purple-400 mx-auto" />
                      </motion.div>
                      <h3 className="text-xl font-bold mb-2">Aucune annonce trouvée</h3>
                      <p className="text-gray-400 mb-6">
                        Le bot Discord se synchronise avec le canal d'annonces... Revenez plus tard pour voir les dernières nouvelles.
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        >
                          <Bell className="w-4 h-4 mr-2" />
                          Activer les notifications
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        )}
        
        {/* Actions et boutons */}
        <motion.div
          className="flex flex-col md:flex-row justify-center items-center gap-4 mt-12 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-6 rounded-xl text-lg shadow-lg shadow-purple-900/20 w-full md:w-auto"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Bell className="w-5 h-5" />
              </motion.div>
              Toutes les annonces
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              className="border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/10 px-6 py-6 rounded-xl text-lg shadow-lg w-full md:w-auto"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mr-2"
              >
                <ExternalLink className="w-5 h-5" />
              </motion.div>
              Rejoindre Discord
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Modal d'annonce détaillée */}
      <Dialog open={isAnnouncementModalOpen} onOpenChange={(open) => !open && handleCloseAnnouncementModal()}>
        <DialogContent className="bg-black/90 backdrop-blur-xl border-purple-500/30 text-white max-w-4xl w-11/12">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center justify-between">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Annonce
              </span>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </DialogTitle>
          </DialogHeader>

          {selectedAnnouncement && (
            <div className="pt-4">
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className={`w-16 h-16 rounded-lg flex items-center justify-center bg-gradient-to-br ${getAnnouncementColor(selectedAnnouncement.title)}`}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <motion.div
                      className="w-10 h-10 flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {getAnnouncementIcon(selectedAnnouncement.title)}
                    </motion.div>
                  </motion.div>
                  
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">{selectedAnnouncement.title}</h2>
                    <p className="text-gray-400 text-sm">
                      {formatDate(selectedAnnouncement.createdAt)} • {selectedAnnouncement.channelName || "annonces"}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 mb-8 bg-gray-900/50 p-6 rounded-lg">
                  <p className="text-white whitespace-pre-line text-lg">{selectedAnnouncement.content}</p>
                </div>
                
                <div className="flex justify-between items-center border-t border-gray-800 pt-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 mr-2">
                      <DiscordAvatar
                        userId={selectedAnnouncement.authorId}
                        avatar={null}
                        username={selectedAnnouncement.author}
                        size="md"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{selectedAnnouncement.author}</p>
                      <p className="text-xs text-gray-400">{selectedAnnouncement.reactions} réactions</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10"
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      J'aime
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Partager
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/30 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                  Annonces similaires
                </h3>
                
                <div className="space-y-2">
                  {displayAnnouncements
                    .filter(a => a.id !== selectedAnnouncement.id)
                    .slice(0, 3)
                    .map(announcement => (
                      <div 
                        key={announcement.id}
                        className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer"
                        onClick={() => {
                          setSelectedAnnouncement(announcement);
                        }}
                      >
                        <div className={`w-8 h-8 rounded-md flex items-center justify-center bg-gradient-to-br ${getAnnouncementColor(announcement.title)}`}>
                          {getAnnouncementIcon(announcement.title)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="font-medium text-sm text-white truncate">{announcement.title}</p>
                          <p className="text-xs text-gray-400">{formatDate(announcement.createdAt)}</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Icône de cadeau
function Gift(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 12 20 22 4 22 4 12"></polyline>
      <rect x="2" y="7" width="20" height="5"></rect>
      <line x1="12" y1="22" x2="12" y2="7"></line>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
    </svg>
  );
}