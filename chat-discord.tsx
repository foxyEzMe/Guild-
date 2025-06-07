import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Crown, Shield, Smile, Hash, Users } from 'lucide-react';

interface ChatMessage {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  avatar: string;
  role: string;
  isAdmin: boolean;
}

export default function ChatDiscord() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Messages d'exemple pour démonstration
  const exampleMessages: ChatMessage[] = [
    {
      id: '1',
      author: 'yuki',
      content: 'Salut tout le monde ! Prêts pour la prochaine bataille ?',
      timestamp: new Date(Date.now() - 300000),
      avatar: 'https://cdn.discordapp.com/avatars/1271780076102488177/a_3bc844b6367bfc09cc129dd95aa32c1e.gif',
      role: 'Fondateur',
      isAdmin: true
    },
    {
      id: '2',
      author: '404',
      content: 'Le site web est maintenant optimisé ! Toutes les animations fonctionnent parfaitement 🔥',
      timestamp: new Date(Date.now() - 240000),
      avatar: 'https://cdn.discordapp.com/avatars/997247681330159636/a_1d8a35cff1ff3716366252c3eee764d6.gif',
      role: 'Développeur',
      isAdmin: true
    },
    {
      id: '3',
      author: 'yuki',
      content: 'Excellent travail 404 ! La guild S.L.Z est maintenant au top niveau',
      timestamp: new Date(Date.now() - 180000),
      avatar: 'https://cdn.discordapp.com/avatars/1271780076102488177/a_3bc844b6367bfc09cc129dd95aa32c1e.gif',
      role: 'Fondateur',
      isAdmin: true
    }
  ];

  useEffect(() => {
    setMessages(exampleMessages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getUserAvatar = (username: string) => {
    if (username === 'yuki') {
      return 'https://cdn.discordapp.com/avatars/1271780076102488177/a_3bc844b6367bfc09cc129dd95aa32c1e.gif';
    } else if (username === '404') {
      return 'https://cdn.discordapp.com/avatars/997247681330159636/a_1d8a35cff1ff3716366252c3eee764d6.gif';
    }
    return '/api/placeholder/40/40';
  };

  const handleSendMessage = () => {
    if (!message.trim() || !user) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      author: user.username,
      content: message,
      timestamp: new Date(),
      avatar: getUserAvatar(user.username),
      role: user.isAdmin ? (user.username === 'yuki' ? 'Fondateur' : 'Développeur') : 'Membre',
      isAdmin: user.isAdmin || false
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Vous devez être connecté pour accéder au chat</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background violet avec effet de flou */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-60 blur-sm"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 40% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)
            `,
          }}
        />
        
        {/* Texte "ARISE CROSSOVER" en arrière-plan flou */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="text-9xl font-black text-purple-300/10 select-none blur-sm"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ARISE CROSSOVER
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header du chat */}
        <motion.div
          className="p-4 bg-black/40 backdrop-blur-xl border-b border-purple-500/30"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <motion.div
              className="w-8 h-8 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Hash className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-white">Chat S.L.Z Guild</h1>
              <p className="text-purple-300 text-sm">Canal général • {messages.length} messages</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <Users className="w-3 h-3 mr-1" />
                En ligne
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Zone des messages */}
        <div className="flex-1 overflow-hidden">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="group hover:bg-purple-500/5 p-3 rounded-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar avec animation */}
                      <motion.div
                        className="relative flex-shrink-0"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500/50">
                          <img
                            src={msg.avatar}
                            alt={`Avatar de ${msg.author}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {msg.isAdmin && (
                          <motion.div
                            className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          >
                            <Crown className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Contenu du message */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-white">{msg.author}</span>
                          {msg.isAdmin && (
                            <Badge className={`text-xs ${
                              msg.author === 'yuki'
                                ? 'bg-gradient-to-r from-purple-500 to-violet-500'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                            } text-white`}>
                              {msg.role}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-400">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        <motion.p
                          className="text-gray-200 break-words"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                        >
                          {msg.content}
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <motion.div
              className="p-4 bg-black/40 backdrop-blur-xl border-t border-purple-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Écrivez un message dans #général...`}
                    className="bg-slate-800/50 border-purple-500/30 text-white placeholder-purple-300/50 focus:border-purple-400 focus:ring-purple-400/20 pr-12"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <motion.button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-purple-400 hover:text-purple-300 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Smile className="w-5 h-5" />
                  </motion.button>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-violet-600 hover:to-purple-600 disabled:opacity-50 px-4 py-2"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}