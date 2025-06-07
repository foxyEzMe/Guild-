import { useQuery } from '@tanstack/react-query';
import { Megaphone, Calendar, User, MessageCircle, Trophy, Bell, Zap, Star, Lock, ChevronRight, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchDiscordAnnouncements } from '@/lib/discord-api';
import { DiscordAvatar } from '@/components/discord-avatar';
import { useState, useEffect } from 'react';
import resnBg from '../assets/resn-inspired-bg.svg';
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocation } from 'wouter';

export default function Announcements() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | null>(null);
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
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
    if (title.toLowerCase().includes('raid') || title.toLowerCase().includes('événement')) {
      return <Megaphone className="w-6 h-6 text-purple-light" />;
    }
    if (title.toLowerCase().includes('tournoi') || title.toLowerCase().includes('résultat')) {
      return <Trophy className="w-6 h-6 text-purple-primary" />;
    }
    if (title.toLowerCase().includes('spécial') || title.toLowerCase().includes('week-end')) {
      return <Bell className="w-6 h-6 text-purple-light" />;
    }
    if (title.toLowerCase().includes('mise à jour') || title.toLowerCase().includes('update')) {
      return <Zap className="w-6 h-6 text-purple-primary" />;
    }
    return <Megaphone className="w-6 h-6 text-purple-light" />;
  };

  const getAnnouncementColor = (title: string) => {
    if (title.toLowerCase().includes('raid') || title.toLowerCase().includes('événement')) {
      return 'text-purple-light';
    }
    if (title.toLowerCase().includes('tournoi') || title.toLowerCase().includes('résultat')) {
      return 'text-purple-primary';
    }
    if (title.toLowerCase().includes('spécial') || title.toLowerCase().includes('week-end')) {
      return 'text-purple-light';
    }
    if (title.toLowerCase().includes('mise à jour') || title.toLowerCase().includes('update')) {
      return 'text-purple-primary';
    }
    return 'text-purple-light';
  };
  
  const getAnnouncementBg = (title: string) => {
    if (title.toLowerCase().includes('raid') || title.toLowerCase().includes('événement')) {
      return 'bg-purple-light/10';
    }
    if (title.toLowerCase().includes('tournoi') || title.toLowerCase().includes('résultat')) {
      return 'bg-purple-primary/15';
    }
    if (title.toLowerCase().includes('spécial') || title.toLowerCase().includes('week-end')) {
      return 'bg-purple-light/10';
    }
    if (title.toLowerCase().includes('mise à jour') || title.toLowerCase().includes('update')) {
      return 'bg-purple-primary/15';
    }
    return 'bg-purple-light/10';
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

  return (
    <div className="min-h-screen pt-24 px-4 relative overflow-hidden">
      {/* Epic Background Effects */}
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-sky-blue/8 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-electric-blue/6 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-20 animate-slide-up">
          <div className="inline-block mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-sky-blue via-electric-blue to-neon-cyan rounded-full mx-auto flex items-center justify-center animate-glow">
              <Megaphone className="text-pure-black w-12 h-12 animate-pulse" />
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-r from-sky-blue via-electric-blue to-neon-cyan bg-clip-text text-transparent animate-text-glow">
            ANNONCES
          </h1>
          <p className="text-2xl text-light-gray max-w-3xl mx-auto leading-relaxed">
            Les dernières nouvelles épiques de l'empire <span className="text-sky-blue font-bold animate-text-glow">S.L.Z Guild</span>
          </p>
        </div>
        
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="announcement-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="w-12 h-12 rounded-lg bg-muted flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-48 bg-muted" />
                        <Skeleton className="h-4 w-24 bg-muted" />
                      </div>
                      <Skeleton className="h-4 w-full bg-muted" />
                      <Skeleton className="h-4 w-3/4 bg-muted" />
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-3 w-20 bg-muted" />
                        <Skeleton className="h-3 w-16 bg-muted" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {announcements && announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <Card key={announcement.id} className="announcement-card hover:border-sky-blue/60 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-sky-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          {getAnnouncementIcon(announcement.title)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className={`text-xl font-bold ${getAnnouncementColor(announcement.title)}`}>
                              {announcement.title}
                            </h3>
                            <span className="text-sm text-light-gray">
                              {formatDate(announcement.createdAt)}
                            </span>
                          </div>
                          <p className="text-light-gray leading-relaxed mb-4">
                            {announcement.content}
                          </p>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-sky-blue flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              Par {announcement.author}
                            </span>
                            <span className="text-sm text-light-gray flex items-center">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {announcement.reactions} réactions
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center">
                  <Card className="guild-card max-w-md mx-auto">
                    <CardContent className="p-6">
                      <Megaphone className="w-12 h-12 text-sky-blue mx-auto mb-4" />
                      <p className="text-light-gray">Aucune annonce trouvée.</p>
                      <p className="text-sm text-light-gray mt-2">
                        Le bot Discord se synchronise avec le canal d'annonces...
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
            
            {announcements && announcements.length > 0 && (
              <div className="text-center mt-12">
                <Button className="btn-primary px-8 py-3 rounded-xl text-pure-black font-bold">
                  <Megaphone className="w-5 h-5 mr-2" />
                  Voir Toutes les Annonces
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
