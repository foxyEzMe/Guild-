import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useThemeCustomization } from '@/contexts/ThemeCustomizationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, Zap, Star, Trophy, Target, Users, Gamepad2, Settings, Save, Edit, Palette } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { ThemeSelector } from '@/components/theme-selector';

export default function ProfileFixed() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [location] = useLocation();
  const [profileUser, setProfileUser] = useState<any>(null);
  
  // Extraire l'ID de l'utilisateur depuis l'URL si présent
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('id');
    
    if (userId) {
      // Si un ID est spécifié dans l'URL, charger le profil correspondant
      // Pour cet exemple, nous simulons la récupération de données
      if (userId === '1' || userId === 'yuki') {
        setProfileUser({
          username: 'yuki',
          isAdmin: true,
          role: 'Fondateur',
          firstName: 'SK',
          lastName: 'Fondateur'
        });
      } else if (userId === '2' || userId === '404') {
        setProfileUser({
          username: '404',
          isAdmin: true,
          role: 'Développeur',
          firstName: '404',
          lastName: 'Dev'
        });
      } else {
        // Profil par défaut pour les autres membres
        setProfileUser({
          username: 'member_' + userId,
          isAdmin: false,
          role: 'Membre',
          firstName: 'Membre',
          lastName: userId
        });
      }
    } else {
      // Si aucun ID n'est spécifié, utiliser le profil de l'utilisateur connecté
      setProfileUser(user);
    }
  }, [user, location]);
  
  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement du profil...</div>
      </div>
    );
  }

  // Photos Discord authentiques
  const getUserAvatar = () => {
    if (profileUser.username === 'yuki') {
      return 'https://cdn.discordapp.com/avatars/1271780076102488177/a_3bc844b6367bfc09cc129dd95aa32c1e.gif';
    } else if (profileUser.username === '404') {
      return 'https://cdn.discordapp.com/avatars/997247681330159636/a_1d8a35cff1ff3716366252c3eee764d6.gif';
    }
    return '/api/placeholder/150/150';
  };

  const getUserStats = () => {
    if (profileUser.username === 'yuki') {
      return {
        rang: 'RANG SSS',
        niveau: 'MAX',
        victoires: '2,847',
        precision: '96.8%',
        badges: ['Fondateur', 'Stratège Elite', 'Leader', 'Légende', 'RANG SSS']
      };
    } else if (profileUser.username === '404') {
      return {
        rang: 'RANG SSS',
        niveau: 'MAX', 
        victoires: '1,923',
        precision: '94.2%',
        badges: ['Admin', 'Développeur', 'Tech Master', 'Code Ninja', 'RANG SSS']
      };
    }
    return {
      rang: 'Membre',
      niveau: '25',
      victoires: '342',
      precision: '87.5%',
      badges: ['Nouveau', 'Actif']
    };
  };

  const stats = getUserStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background animé */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)
            `,
          }}
        />
        
        {/* Grille holographique */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen p-4">
        {/* Header avec avatar */}
        <motion.div
          className="max-w-4xl mx-auto mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30 overflow-hidden">
            <div className="relative h-48 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700">
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'linear-gradient(45deg, rgba(139, 92, 246, 0.8) 0%, rgba(168, 85, 247, 0.8) 100%)',
                    'linear-gradient(45deg, rgba(168, 85, 247, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <div className="absolute bottom-6 left-6 flex items-end gap-6">
                {/* Avatar avec animations */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full blur-sm"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/80">
                    <motion.img
                      src={getUserAvatar()}
                      alt={`Avatar de ${profileUser.firstName || profileUser.username}`}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  {profileUser.isAdmin && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center"
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ 
                        rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <Crown className="w-6 h-6 text-white" />
                    </motion.div>
                  )}
                </motion.div>

                <div className="text-white mb-4">
                  <motion.h1
                    className="text-4xl font-black mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    {profileUser.firstName || ''} {profileUser.lastName || ''}
                  </motion.h1>
                  <motion.p
                    className="text-xl text-purple-200 mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    @{profileUser.username}
                  </motion.p>
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                  >
                    <Badge className={`${
                      profileUser.isAdmin 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                        : 'bg-gradient-to-r from-purple-500 to-violet-500'
                    } text-white font-bold`}>
                      {profileUser.isAdmin ? <Crown className="w-4 h-4 mr-1" /> : <Star className="w-4 h-4 mr-1" />}
                      {stats.rang}
                    </Badge>
                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold">
                      <Zap className="w-4 h-4 mr-1" />
                      Niveau {stats.niveau}
                    </Badge>
                  </motion.div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          className="max-w-4xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Victoires', value: stats.victoires, icon: Trophy, color: 'from-yellow-500 to-orange-500' },
              { label: 'Précision', value: stats.precision, icon: Target, color: 'from-green-500 to-emerald-500' },
              { label: 'Rang Global', value: '#' + (user.isAdmin ? '1' : '47'), icon: Star, color: 'from-purple-500 to-violet-500' },
              { label: 'Parties', value: '2,439', icon: Gamepad2, color: 'from-blue-500 to-indigo-500' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30 text-center">
                  <CardContent className="p-4">
                    <motion.div
                      className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2`}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Badges et informations */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Badges obtenus */}
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
                  Badges Obtenus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {stats.badges.map((badge, index) => (
                    <motion.div
                      key={badge}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Badge className={`bg-gradient-to-r ${
                        badge === 'Fondateur' ? 'from-yellow-500 to-orange-500' :
                        badge === 'Admin' ? 'from-yellow-500 to-amber-500' :
                        badge === 'Développeur' ? 'from-cyan-500 to-blue-500' :
                        badge === 'Stratège Elite' ? 'from-red-500 to-pink-500' :
                        badge === 'Leader' ? 'from-indigo-500 to-blue-500' :
                        badge === 'Légende' ? 'from-purple-500 via-pink-500 to-purple-500' :
                        badge === 'Tech Master' ? 'from-green-500 to-emerald-500' :
                        badge === 'Code Ninja' ? 'from-fuchsia-500 to-purple-500' :
                        'from-purple-600 to-violet-600'
                      } text-white font-bold px-3 py-1 shadow-lg`}>
                        <Star className="w-4 h-4 mr-1" />
                        {badge}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Informations du compte */}
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-6 h-6 mr-2 text-blue-400" />
                    Informations de Compte
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-violet-600 hover:to-purple-600"
                      size="sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {isEditing ? 'Annuler' : 'Modifier'}
                    </Button>
                  </motion.div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Email</label>
                  <p className="text-white">{user.email || 'Non renseigné'}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Rôle</label>
                  <p className="text-white">{user.role}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Statut</label>
                  <p className="text-green-400 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    En ligne
                  </p>
                </div>
                
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-4"
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-600 w-full">
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder les modifications
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Bouton retour */}
        <motion.div
          className="max-w-4xl mx-auto mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/">
              <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-violet-600 hover:to-purple-600 text-white font-bold px-8 py-3 rounded-xl shadow-2xl">
                <motion.div
                  animate={{ x: [-2, 2, -2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="mr-2"
                >
                  ←
                </motion.div>
                Retour à l'accueil
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}