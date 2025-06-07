import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, Zap, Star, Trophy, Target, Users, Gamepad2 } from 'lucide-react';

export default function ProfileSLZ() {
  const { user } = useAuth();
  
  if (!user) {
    return <div>Chargement...</div>;
  }

  // Données utilisateur avec les vraies photos Discord
  const getUserAvatar = () => {
    if (user.username === 'yuki') {
      return 'https://cdn.discordapp.com/avatars/1271780076102488177/a_3bc844b6367bfc09cc129dd95aa32c1e.gif';
    } else if (user.username === '404') {
      return 'https://cdn.discordapp.com/avatars/997247681330159636/a_1d8a35cff1ff3716366252c3eee764d6.gif';
    }
    return '/api/placeholder/150/150';
  };

  const getUserStats = () => {
    if (user?.username === 'yuki') {
      return {
        rang: 'Fondateur',
        niveau: 'MAX',
        victoires: '2,847',
        precision: '96.8%',
        badges: ['Fondateur', 'Stratège Elite', 'Leader', 'Légende']
      };
    } else if (user?.username === '404') {
      return {
        rang: 'Développeur',
        niveau: 'MAX',
        victoires: '1,923',
        precision: '94.2%',
        badges: ['Admin', 'Développeur', 'Tech Master', 'Code Ninja']
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
              radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 20%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)
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
          className="max-w-6xl mx-auto mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30 overflow-hidden">
            <div className="relative h-48 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700">
              {/* Banner avec effet de particules */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'linear-gradient(45deg, rgba(139, 92, 246, 0.8) 0%, rgba(168, 85, 247, 0.8) 50%, rgba(139, 92, 246, 0.8) 100%)',
                    'linear-gradient(45deg, rgba(168, 85, 247, 0.8) 0%, rgba(139, 92, 246, 0.8) 50%, rgba(168, 85, 247, 0.8) 100%)',
                    'linear-gradient(45deg, rgba(139, 92, 246, 0.8) 0%, rgba(168, 85, 247, 0.8) 50%, rgba(139, 92, 246, 0.8) 100%)',
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
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/80 bg-gradient-to-r from-purple-500 to-violet-500">
                    <motion.img
                      src={getUserAvatar()}
                      alt={`Avatar de ${user?.firstName}`}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  {user?.isAdmin && (
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
                    {user?.firstName} {user?.lastName}
                  </motion.h1>
                  <motion.p
                    className="text-xl text-purple-200 mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    @{user?.username}
                  </motion.p>
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                  >
                    <Badge className={`${
                      user?.isAdmin 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                        : 'bg-gradient-to-r from-purple-500 to-violet-500'
                    } text-white font-bold`}>
                      {user?.isAdmin ? <Crown className="w-4 h-4 mr-1" /> : <Star className="w-4 h-4 mr-1" />}
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
          className="max-w-6xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Victoires', value: stats.victoires, icon: Trophy, color: 'from-yellow-500 to-orange-500' },
              { label: 'Précision', value: stats.precision, icon: Target, color: 'from-green-500 to-emerald-500' },
              { label: 'Rang Global', value: '#' + (user?.isAdmin ? '1' : '47'), icon: Star, color: 'from-purple-500 to-violet-500' },
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

        {/* Onglets du profil */}
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-black/40 backdrop-blur-xl border border-purple-500/30 p-2 rounded-2xl mb-6">
              {[
                { value: 'overview', label: 'Vue d\'ensemble', icon: Users },
                { value: 'achievements', label: 'Succès', icon: Trophy },
                { value: 'settings', label: 'Paramètres', icon: Settings },
              ].map((tab) => (
                <motion.div key={tab.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <TabsTrigger
                    value={tab.value}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:bg-purple-500/20"
                  >
                    <motion.div
                      animate={{ rotate: activeTab === tab.value ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                      className="mr-2"
                    >
                      <tab.icon className="w-5 h-5" />
                    </motion.div>
                    {tab.label}
                  </TabsTrigger>
                </motion.div>
              ))}
            </TabsList>

            {/* Contenu Vue d'ensemble */}
            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Heart className="w-6 h-6 mr-2 text-red-400" />
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
                          <Badge className="bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold px-3 py-1">
                            <Sparkles className="w-4 h-4 mr-1" />
                            {badge}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Shield className="w-6 h-6 mr-2 text-blue-400" />
                      Informations de Compte
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-400">Email</Label>
                      <p className="text-white">{user?.email || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Rôle</Label>
                      <p className="text-white">{user?.role}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Statut</Label>
                      <p className="text-green-400">En ligne</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Contenu Succès */}
            <TabsContent value="achievements">
              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
                    Hauts Faits Débloqués
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { name: 'Premier Pas', desc: 'Rejoindre la guild', unlocked: true },
                      { name: 'Guerrier', desc: '100 victoires', unlocked: true },
                      { name: 'Stratège', desc: '500 victoires', unlocked: user?.isAdmin },
                      { name: 'Légende', desc: '1000 victoires', unlocked: user?.isAdmin },
                    ].map((achievement, index) => (
                      <motion.div
                        key={achievement.name}
                        className={`p-4 rounded-lg border ${
                          achievement.unlocked
                            ? 'bg-purple-500/20 border-purple-500/50'
                            : 'bg-gray-800/20 border-gray-600/50'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center">
                          <motion.div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                              achievement.unlocked
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                : 'bg-gray-600'
                            }`}
                            animate={achievement.unlocked ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Trophy className="w-6 h-6 text-white" />
                          </motion.div>
                          <div>
                            <h4 className={`font-bold ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
                              {achievement.name}
                            </h4>
                            <p className="text-gray-300 text-sm">{achievement.desc}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contenu Paramètres */}
            <TabsContent value="settings">
              <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center">
                      <Settings className="w-6 h-6 mr-2 text-blue-400" />
                      Paramètres du Profil
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-violet-600 hover:to-purple-600"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {isEditing ? 'Annuler' : 'Modifier'}
                      </Button>
                    </motion.div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-400">Prénom</Label>
                      <Input
                        defaultValue={user?.firstName}
                        disabled={!isEditing}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400">Nom</Label>
                      <Input
                        defaultValue={user?.lastName}
                        disabled={!isEditing}
                        className="bg-slate-800/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex space-x-4"
                    >
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-600">
                          <Save className="w-4 h-4 mr-2" />
                          Sauvegarder
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}