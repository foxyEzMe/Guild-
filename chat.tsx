import { useState, useEffect, useRef } from 'react';
import { Send, Smile, Paperclip, Hash, Users, Settings, Mic, MicOff, Headphones, Shield, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { BadgeDisplay, LevelBadge } from '@/components/badge-display';
import { calculateLevel, addXP, getAdminBadges } from '@shared/levels';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfilePopup } from '@/components/user-profile-popup';
import { LevelUpNotification } from '@/components/level-up-notification';

interface ChatMessage {
  id: string;
  userId: string;
  author: string;
  content: string;
  timestamp: Date;
  avatar?: string;
  role?: string;
  level: number;
  badges: string[];
  isAdmin: boolean;
}

export default function Chat() {
  const [message, setMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [showDiscordVerification, setShowDiscordVerification] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState({ level: 1, rank: 'RANG E', newBadges: [] as string[] });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  // Handler for opening user profile popup - amélioration pour mobile et PC
  const handleOpenUserProfile = (msg: ChatMessage, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Créer les données utilisateur avec tous les badges pour les admins
    setSelectedUser({
      id: msg.userId,
      username: msg.author,
      avatar: msg.avatar,
      role: msg.role || (msg.isAdmin ? 'Admin' : 'Membre'),
      isAdmin: msg.isAdmin,
      level: msg.level,
      badges: msg.isAdmin ? getAdminBadges() : msg.badges,
      joinDate: 'Mai 2025',
      banner: msg.isAdmin ? 
        'https://cdn.discordapp.com/banners/997247681330159636/a_8771a5ebd22010f7f1aadc42da898a59.gif' : 
        undefined
    });
    
    // Calculer la position optimale pour la popup (centrer sur mobile, près du clic sur desktop)
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // Sur mobile, centrer la popup
      setPopupPosition({ 
        x: window.innerWidth / 2, 
        y: window.innerHeight / 3 
      });
    } else {
      // Sur desktop, positionner près du clic mais éviter les bords
      const safeX = Math.min(Math.max(event.clientX, 100), window.innerWidth - 100);
      const safeY = Math.min(Math.max(event.clientY, 100), window.innerHeight - 100);
      setPopupPosition({ x: safeX, y: safeY });
    }
    
    setShowUserProfile(true);
    
    // Ajouter un délai avant de permettre la fermeture pour éviter la fermeture accidentelle
    setTimeout(() => {
      const overlay = document.querySelector('.user-profile-overlay');
      if (overlay) {
        overlay.classList.add('ready');
      }
    }, 100);
  };
  
  // Handler for closing user profile popup
  const handleCloseUserProfile = () => {
    setShowUserProfile(false);
  };

  // Récupération des messages Discord en temps réel
  const { data: discordMessages = [] } = useQuery({
    queryKey: ['/api/discord/announcements', 50],
    refetchInterval: 5000 // Mise à jour toutes les 5 secondes
  });

  // Messages de chat avec le nouveau système
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: 'yuki_id',
      author: 'Yuki',
      content: 'Salut tout le monde ! Prêts pour le raid de ce soir ?',
      timestamp: new Date('2025-01-25T19:30:00'),
      avatar: 'https://cdn.discordapp.com/avatars/997247681330159636/a_1d8a35cff1ff3716366252c3eee764d6.gif',
      role: 'admin',
      level: 100,
      badges: ['founder', 'admin', 'level_100'],
      isAdmin: true
    },
    {
      id: '2',
      userId: '404_id',
      author: '404',
      content: 'Le serveur est opérationnel ! Bon jeu à tous 🎮',
      timestamp: new Date('2025-01-25T19:35:00'),
      avatar: 'https://cdn.discordapp.com/avatars/997247681330159636/a_1d8a35cff1ff3716366252c3eee764d6.gif',
      role: 'admin',
      level: 100,
      badges: ['admin', 'developer', 'level_100'],
      isAdmin: true
    },
    {
      id: '3',
      userId: 'elite_id',
      author: 'EliteWarrior',
      content: 'J\'ai hâte de tester la nouvelle zone ! Elle a l\'air incroyable',
      timestamp: new Date('2025-01-25T19:40:00'),
      avatar: 'https://cdn.discordapp.com/embed/avatars/1.png',
      role: 'member',
      level: 25,
      badges: ['level_25', 'level_20'],
      isAdmin: false
    }
  ]);

  // Vérifier l'accès au chat
  const hasDiscordAccess = user?.chatAccess || user?.isAdmin;

  const channels = [
    { id: 'general', name: 'général', members: 45 },
    { id: 'raids', name: 'raids', members: 23 },
    { id: 'pvp', name: 'pvp', members: 18 },
    { id: 'events', name: 'événements', members: 35 },
    { id: 'help', name: 'aide', members: 12 }
  ];

  const [activeChannel, setActiveChannel] = useState('general');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() && user && hasDiscordAccess) {
      const userLevel = calculateLevel(user.xp || 0);
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: user.id,
        author: user.username,
        content: message,
        timestamp: new Date(),
        avatar: user.discordAvatar || `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 6)}.png`,
        role: user.role || 'member',
        level: userLevel.level,
        badges: user.badges || [],
        isAdmin: user.isAdmin || false
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Ajouter XP pour le message et vérifier montée de niveau (simulation)
      if (!user.isAdmin) {
        // Les admins n'ont pas besoin de gagner d'XP
        const currentXp = user.xp || 0;
        const currentLevel = user.level || 1;
        const newXP = addXP(currentXp, message.length);
        
        // Calculer le nouveau niveau potentiel
        const newLevelInfo = calculateLevel(newXP);
        
        // Vérifier si l'utilisateur a monté de niveau
        if (newLevelInfo.level > currentLevel) {
          // Trouver les nouveaux badges débloqués
          const previousBadges = user.badges || [];
          const newBadges = newLevelInfo.badges.filter(badge => !previousBadges.includes(badge));
          
          // Montrer la notification de montée de niveau
          setLevelUpInfo({
            level: newLevelInfo.level,
            rank: newLevelInfo.rank,
            newBadges: newBadges
          });
          setShowLevelUp(true);
        }
        
        // Ici on pourrait faire un call API pour mettre à jour l'XP et le niveau
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'admin': return 'text-red-400';
      case 'moderator': return 'text-blue-400';
      case 'vip': return 'text-yellow-400';
      default: return 'text-white';
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin': return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">ADMIN</Badge>;
      case 'moderator': return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">MOD</Badge>;
      case 'vip': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">VIP</Badge>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900">
      <div className="flex h-screen">
        {/* Sidebar des canaux */}
        <div className="w-64 bg-black/70 backdrop-blur-sm border-r border-purple-500/30 p-4">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Arise Crossover</h1>
                <p className="text-sm text-gray-400">62 membres</p>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-purple-400" />
              Canaux Texte
            </h2>
            <div className="space-y-2">
              {channels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={`w-full text-left p-2 rounded-md transition-all duration-200 flex items-center justify-between group ${
                    activeChannel === channel.id 
                      ? 'bg-purple-600/40 text-white' 
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    <span>{channel.name}</span>
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-gray-300">
                    {channel.members}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Contrôles voice */}
          <div className="mt-auto">
            <div className="bg-black/60 rounded-lg p-3 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">V</span>
                </div>
                <span className="text-white text-sm">Voice Chat</span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={isMuted ? "destructive" : "outline"}
                  onClick={() => setIsMuted(!isMuted)}
                  className="flex-1"
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant={isDeafened ? "destructive" : "outline"}
                  onClick={() => setIsDeafened(!isDeafened)}
                  className="flex-1"
                >
                  <Headphones className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Zone de chat principale */}
        <div className="flex-1 flex flex-col">
          {!isAuthenticated && (
            <div className="flex-1 flex items-center justify-center">
              <Card className="bg-black/60 backdrop-blur-xl border border-purple-500/30 p-8 text-center max-w-md">
                <CardContent>
                  <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Connexion Requise</h3>
                  <p className="text-gray-300 mb-4">
                    Vous devez être connecté pour accéder au chat Arise Crossover.
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/login'}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Se connecter
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {isAuthenticated && !hasDiscordAccess && (
            <div className="flex-1 flex items-center justify-center">
              <Card className="bg-black/60 backdrop-blur-xl border border-purple-500/30 p-8 text-center max-w-md">
                <CardContent>
                  <Users className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Vérification Discord Requise</h3>
                  <p className="text-gray-300 mb-4">
                    Pour accéder au chat, vous devez être membre de notre serveur Discord Arise Crossover.
                  </p>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => window.open('https://discord.gg/FXs9vseQ7N', '_blank')}
                      className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
                    >
                      Rejoindre le Discord
                    </Button>
                    <Button 
                      onClick={() => setShowDiscordVerification(true)}
                      variant="outline"
                      className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                    >
                      Je suis déjà membre
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {isAuthenticated && hasDiscordAccess && (
            <>
          {/* Header du canal */}
          <div className="bg-black/50 backdrop-blur-sm border-b border-purple-500/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Hash className="w-6 h-6 text-purple-400" />
                <h1 className="text-xl font-bold text-white">
                  {channels.find(c => c.id === activeChannel)?.name}
                </h1>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {channels.find(c => c.id === activeChannel)?.members} membres
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400 text-sm">En ligne: 12</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 group hover:bg-black/20 p-3 rounded-lg transition-colors"
              >
                <div 
                  className="w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-purple-500/30 cursor-pointer hover:ring-purple-500 transition-all transform hover:scale-105"
                  onClick={(e) => handleOpenUserProfile(msg, e)}
                >
                  {msg.avatar ? (
                    <img src={msg.avatar} alt={msg.author} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {msg.author.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`font-semibold ${getRoleColor(msg.role)}`}>
                      {msg.author}
                    </span>
                    {msg.isAdmin && (
                      <div className="flex items-center" title="Administrateur">
                        <Shield className="w-4 h-4 text-yellow-400" />
                      </div>
                    )}
                    <LevelBadge level={msg.level} rank={calculateLevel((msg.level - 1) * 100).rank} />
                    <span className="text-xs text-gray-400">
                      {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <BadgeDisplay badges={msg.badges} size="sm" limit={2} />
                  </div>
                  
                  <p className="text-gray-200 leading-relaxed break-words">
                    {msg.content}
                  </p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Zone de saisie */}
          <div className="bg-black/50 backdrop-blur-sm border-t border-purple-500/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Envoyer un message dans #${channels.find(c => c.id === activeChannel)?.name}`}
                  className="bg-black/60 border-purple-500/40 text-white placeholder-gray-400 pr-20 focus:border-purple-400 focus:ring-purple-400/20"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-1">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-1">
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || !hasDiscordAccess}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          </>
          )}
        </div>
      </div>

      {/* Modal de vérification Discord */}
      <AnimatePresence>
        {showDiscordVerification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDiscordVerification(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-black/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Vérification Discord</h3>
                <Button
                  onClick={() => setShowDiscordVerification(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-gray-300 mb-4">
                Notre bot Discord va vérifier votre statut de membre. Assurez-vous d'avoir rejoint le serveur Arise Crossover.
              </p>
              
              <div className="space-y-3">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const discordUsername = formData.get('discordUsername') as string;
                  
                  // Appel API pour vérifier le Discord
                  fetch('/api/discord/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ discordUsername }),
                    credentials: 'include'
                  })
                  .then(res => res.json())
                  .then(data => {
                    if (data.success) {
                      setShowDiscordVerification(false);
                      window.location.reload(); // Recharger pour mettre à jour l'accès
                    } else {
                      alert(data.error || 'Erreur de vérification');
                    }
                  })
                  .catch(err => {
                    console.error('Erreur:', err);
                    alert('Erreur lors de la vérification');
                  });
                }}>
                  <Input
                    name="discordUsername"
                    placeholder="Votre nom d'utilisateur Discord"
                    className="mb-3 bg-black/60 border-purple-500/30 text-white"
                    required
                  />
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Vérifier mon accès
                  </Button>
                </form>
                <Button 
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300"
                  onClick={() => setShowDiscordVerification(false)}
                >
                  Annuler
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* User Profile Popup */}
      <UserProfilePopup 
        user={selectedUser} 
        isOpen={showUserProfile} 
        onClose={handleCloseUserProfile}
        position={popupPosition}
      />
      
      {/* Level Up Notification */}
      {isAuthenticated && (
        <LevelUpNotification
          show={showLevelUp}
          onClose={() => setShowLevelUp(false)}
          level={levelUpInfo.level}
          rank={levelUpInfo.rank}
          newBadges={levelUpInfo.newBadges}
        />
      )}
    </div>
  );
}