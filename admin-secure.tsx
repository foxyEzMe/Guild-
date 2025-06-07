import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, MessageSquare, Settings, Eye, EyeOff, Crown, Lock, CheckCircle, AlertTriangle, UserPlus, Activity, BarChart3, Calendar, Server, Database, Globe, Zap, Star, Sparkles, Target, Trophy, Terminal, Code, Cpu, HardDrive, Wifi, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const ADMIN_PASSWORD = "BLACKHEART_ADMIN_2024_ELITE";

export default function AdminSecure() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Données simulées pour le panel
  const { data: stats } = useQuery({
    queryKey: ['/api/discord/stats'],
    enabled: isAuthenticated,
  });

  const { data: members } = useQuery({
    queryKey: ['/api/discord/members'],
    enabled: isAuthenticated,
  });

  const handleLogin = async () => {
    setIsLoading(true);
    
    // Simulation d'une vérification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginAttempts(0);
      toast({
        title: "Accès autorisé",
        description: "Bienvenue dans le panel d'administration",
        variant: "default",
      });
    } else {
      setLoginAttempts(prev => prev + 1);
      setPassword('');
      toast({
        title: "Accès refusé",
        description: `Mot de passe incorrect. Tentatives: ${loginAttempts + 1}/3`,
        variant: "destructive",
      });
      
      if (loginAttempts >= 2) {
        toast({
          title: "Trop de tentatives",
          description: "Accès bloqué temporairement pour des raisons de sécurité",
          variant: "destructive",
        });
        setTimeout(() => setLoginAttempts(0), 30000); // Reset après 30s
      }
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && password) {
      handleLogin();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Particules et effets de fond avancés */}
        <div className="absolute inset-0">
          {/* Grille cyberpunk */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
              {[...Array(400)].map((_, i) => (
                <motion.div
                  key={i}
                  className="border border-red-500/10"
                  animate={{
                    opacity: [0.1, 0.3, 0.1],
                    borderColor: [`rgba(239, 68, 68, 0.1)`, `rgba(245, 158, 11, 0.2)`, `rgba(239, 68, 68, 0.1)`]
                  }}
                  transition={{
                    duration: Math.random() * 4 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Particules flottantes */}
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, Math.random() * 2 + 0.5, 0],
                y: [0, -Math.random() * 100 - 50],
                x: [0, Math.random() * 50 - 25],
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}

          {/* Rayons lumineux */}
          <motion.div
            className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-red-500/50 via-transparent to-transparent"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scaleX: [1, 2, 1],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-orange-500/50 via-transparent to-transparent"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scaleY: [1, 2, 1],
            }}
            transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          />
        </div>

        {/* Interface de connexion futuriste */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateX: -30 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 max-w-lg w-full"
        >
          {/* Container principal avec effet holographique */}
          <div className="relative">
            {/* Aura externe */}
            <motion.div
              className="absolute -inset-8 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 rounded-3xl blur-2xl"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Interface principale */}
            <Card className="bg-black/95 backdrop-blur-2xl border-2 border-red-500/50 shadow-2xl overflow-hidden">
              {/* En-tête avec animations */}
              <CardHeader className="text-center space-y-6 relative">
                {/* Effet de scan horizontal */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"
                  animate={{ x: [-100, 400] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* Logo admin cyberpunk */}
                <motion.div className="relative">
                  <motion.div
                    className="mx-auto w-32 h-32 relative"
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    {/* Anneaux externes */}
                    <motion.div
                      className="absolute inset-0 border-4 border-red-500/30 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute inset-2 border-2 border-orange-500/40 rounded-full"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute inset-4 border border-yellow-500/50 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Centre avec shield */}
                    <div className="absolute inset-6 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-2xl">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360],
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        <Shield className="w-12 h-12 text-white" />
                      </motion.div>
                    </div>

                    {/* Particules orbitales */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-red-400 rounded-full"
                        style={{
                          top: '50%',
                          left: '50%',
                          transformOrigin: '50px',
                        }}
                        animate={{
                          rotate: 360,
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          rotate: { duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.5 },
                          opacity: { duration: 2, repeat: Infinity, delay: i * 0.3 },
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>

                {/* Titre avec effet de frappe */}
                <div>
                  <motion.h1 
                    className="text-5xl font-black bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                  >
                    BLACK HEART COMMAND
                  </motion.h1>
                  <motion.p 
                    className="text-red-400 font-bold text-lg tracking-widest"
                    animate={{
                      opacity: [0.7, 1, 0.7],
                      textShadow: ['0 0 5px rgba(239, 68, 68, 0.5)', '0 0 20px rgba(239, 68, 68, 0.8)', '0 0 5px rgba(239, 68, 68, 0.5)']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    SYSTÈME D'ADMINISTRATION SÉCURISÉ
                  </motion.p>
                </div>
              </CardHeader>

              <CardContent className="space-y-8 p-8">
                {/* Alerte sécurité */}
                <motion.div
                  className="relative p-4 bg-gradient-to-r from-red-900/40 to-orange-900/40 border border-red-500/50 rounded-xl overflow-hidden"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(239, 68, 68, 0.3)',
                      '0 0 40px rgba(239, 68, 68, 0.6)',
                      '0 0 20px rgba(239, 68, 68, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10"
                    animate={{ x: [-100, 100] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="relative flex items-center justify-center space-x-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Lock className="w-6 h-6 text-red-400" />
                    </motion.div>
                    <span className="text-red-400 font-bold text-lg tracking-wide">
                      ZONE ULTRA-SÉCURISÉE
                    </span>
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <AlertTriangle className="w-6 h-6 text-orange-400" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Interface de saisie futuriste */}
                <div className="space-y-4">
                  <motion.label 
                    className="block text-red-400 font-bold text-lg tracking-wider"
                    animate={{
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    CODE D'ACCÈS ADMINISTRATEUR
                  </motion.label>
                  
                  <div className="relative">
                    {/* Container du champ avec effet cyber */}
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.02 }}
                      whileFocus={{ scale: 1.02 }}
                    >
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●"
                        className="h-16 bg-black/80 border-2 border-red-500/50 text-white text-xl font-mono tracking-wider pr-16 focus:border-red-400 focus:ring-4 focus:ring-red-400/20 placeholder:text-red-500/40"
                        disabled={loginAttempts >= 3}
                      />
                      
                      {/* Effet de scan sur le champ */}
                      <motion.div
                        className="absolute inset-0 border border-red-400/30 rounded-md pointer-events-none"
                        animate={{
                          boxShadow: [
                            '0 0 0px rgba(239, 68, 68, 0)',
                            '0 0 20px rgba(239, 68, 68, 0.5)',
                            '0 0 0px rgba(239, 68, 68, 0)'
                          ]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />

                      {/* Bouton d'affichage du mot de passe */}
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-white transition-colors p-2"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                      </motion.button>
                    </motion.div>
                  </div>
                </div>

                {/* Bouton d'accès ultra-stylé */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleLogin}
                    disabled={!password || loginAttempts >= 3 || isLoading}
                    className="w-full h-20 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 hover:from-red-700 hover:via-orange-700 hover:to-yellow-700 text-white font-black text-xl relative overflow-hidden border-2 border-red-500/50"
                  >
                    {/* Effet de fond animé */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10"
                      animate={{ x: [-100, 400] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    
                    {/* Contenu du bouton */}
                    <div className="relative z-10 flex items-center justify-center space-x-4">
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        >
                          <Shield className="w-8 h-8" />
                        </motion.div>
                      ) : (
                        <>
                          <motion.div
                            animate={{
                              rotate: [0, 360],
                              scale: [1, 1.2, 1],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Shield className="w-8 h-8" />
                          </motion.div>
                          <span className="tracking-widest">INITIALISER L'ACCÈS</span>
                          <motion.div
                            animate={{
                              opacity: [0.5, 1, 0.5],
                              scale: [1, 1.3, 1],
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <Zap className="w-8 h-8" />
                          </motion.div>
                        </>
                      )}
                    </div>

                    {/* Particules sur le bouton */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0],
                        }}
                        transition={{
                          duration: Math.random() * 2 + 1,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </Button>
                </motion.div>

                {/* Compteur de tentatives avec style cyber */}
                <AnimatePresence>
                  {loginAttempts > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.8 }}
                      className="relative p-4 bg-gradient-to-r from-red-900/60 to-orange-900/60 border border-red-500/70 rounded-xl overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20"
                        animate={{ x: [-100, 100] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                      <div className="relative flex items-center justify-center space-x-3">
                        <motion.div
                          animate={{ 
                            rotate: [0, 360],
                            scale: [1, 1.2, 1]
                          }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <AlertTriangle className="w-6 h-6 text-red-400" />
                        </motion.div>
                        <span className="text-red-400 font-bold text-lg tracking-wide">
                          VIOLATIONS DÉTECTÉES: {loginAttempts}/3
                        </span>
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        >
                          <Shield className="w-6 h-6 text-orange-400" />
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer avec informations système */}
                <motion.div
                  className="text-center space-y-2 pt-4 border-t border-red-500/30"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <p className="text-red-400/80 text-sm font-mono tracking-wider">
                    BLACK HEART SECURITY PROTOCOL v2.4.0
                  </p>
                  <p className="text-orange-400/60 text-xs font-mono">
                    SURVEILLANCE ACTIVE • INTRUSION DETECTION ENABLED
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black pt-20 pb-8 relative overflow-hidden">
      {/* Fond avec effets cyberpunk */}
      <div className="absolute inset-0">
        {/* Grille animée */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
            {[...Array(400)].map((_, i) => (
              <motion.div
                key={i}
                className="border border-red-500/20"
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  borderColor: [`rgba(239, 68, 68, 0.1)`, `rgba(245, 158, 11, 0.2)`, `rgba(239, 68, 68, 0.1)`]
                }}
                transition={{
                  duration: Math.random() * 4 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Particules flottantes */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, Math.random() * 2 + 0.5, 0],
              y: [0, -Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Header Admin cyberpunk */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-16 z-40 bg-black/95 backdrop-blur-xl border-b-2 border-red-500/50 mb-8 relative"
      >
        {/* Effet de scan horizontal */}
        <motion.div
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"
          animate={{ x: [-100, 400] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Logo admin animé */}
              <motion.div
                className="w-16 h-16 relative"
                animate={{ rotateY: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <motion.div
                  className="absolute inset-0 border-2 border-red-500/50 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-1 border border-orange-500/60 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-2 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Crown className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
              </motion.div>
              
              <div>
                <motion.h1 
                  className="text-3xl font-black bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent"
                  animate={{
                    textShadow: ['0 0 10px rgba(239, 68, 68, 0.5)', '0 0 20px rgba(239, 68, 68, 0.8)', '0 0 10px rgba(239, 68, 68, 0.5)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  BLACK HEART COMMAND CENTER
                </motion.h1>
                <p className="text-red-400 font-bold tracking-wider">SYSTÈME D'ADMINISTRATION AVANCÉ</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.div
                className="px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/50 rounded-xl"
                animate={{
                  boxShadow: ['0 0 10px rgba(34, 197, 94, 0.3)', '0 0 20px rgba(34, 197, 94, 0.6)', '0 0 10px rgba(34, 197, 94, 0.3)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </motion.div>
                  <span className="text-green-400 font-bold">SYSTÈME ACTIF</span>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => setIsAuthenticated(false)}
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold border border-red-500/50"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Shield className="w-4 h-4" />
                  </motion.div>
                  DÉCONNEXION SÉCURISÉE
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Statistiques en temps réel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { icon: Users, value: "20", label: "Membres Total", color: "blue", gradient: "from-blue-500 to-cyan-500" },
            { icon: Activity, value: "10", label: "En ligne", color: "green", gradient: "from-green-500 to-emerald-500" },
            { icon: MessageSquare, value: "156", label: "Messages/jour", color: "purple", gradient: "from-purple-500 to-violet-500" },
            { icon: Server, value: "99.9%", label: "Uptime", color: "yellow", gradient: "from-yellow-500 to-orange-500" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="relative group"
            >
              <motion.div
                className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300`}
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              />
              <Card className="relative bg-black/90 backdrop-blur-xl border-2 border-red-500/30">
                <CardContent className="p-6 text-center">
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                    className="mb-4"
                  >
                    <stat.icon className={`w-12 h-12 text-${stat.color}-400 mx-auto`} />
                  </motion.div>
                  <motion.p 
                    className="text-3xl font-black text-white mb-2"
                    animate={{
                      textShadow: [`0 0 10px rgba(239, 68, 68, 0.5)`, `0 0 20px rgba(239, 68, 68, 0.8)`, `0 0 10px rgba(239, 68, 68, 0.5)`]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-gray-400 font-semibold tracking-wide">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Interface principale avec onglets cyberpunk */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Tabs defaultValue="dashboard" className="space-y-8">
            {/* Barre d'onglets futuriste */}
            <div className="relative">
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 rounded-2xl blur-lg"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <TabsList className="relative grid w-full grid-cols-5 bg-black/90 backdrop-blur-xl border-2 border-red-500/50 p-2 rounded-2xl">
                {[
                  { value: "dashboard", icon: BarChart3, label: "DASHBOARD" },
                  { value: "members", icon: Users, label: "MEMBRES" },
                  { value: "moderation", icon: Shield, label: "MODÉRATION" },
                  { value: "system", icon: Terminal, label: "SYSTÈME" },
                  { value: "settings", icon: Settings, label: "PARAMÈTRES" },
                ].map((tab, i) => (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value} 
                    className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-600 data-[state=active]:text-white text-red-400 font-bold tracking-wider py-4 rounded-xl transition-all duration-300"
                  >
                    <motion.div
                      className="flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </motion.div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Contenu des onglets */}
            <TabsContent value="dashboard" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {/* Activité en temps réel */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="lg:col-span-2"
                >
                  <Card className="bg-black/90 backdrop-blur-xl border-2 border-red-500/30 overflow-hidden">
                    <CardHeader className="relative">
                      <motion.div
                        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"
                        animate={{ x: [-100, 400] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                      <CardTitle className="text-white flex items-center space-x-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                          <Activity className="w-6 h-6 text-red-400" />
                        </motion.div>
                        <span className="text-xl font-black tracking-wide">ACTIVITÉ EN TEMPS RÉEL</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { action: "Nouveau membre rejoint", user: "PlayerXYZ", time: "Il y a 2min", type: "join" },
                        { action: "Message modéré", user: "Modérateur", time: "Il y a 15min", type: "mod" },
                        { action: "Événement créé", user: "Admin", time: "Il y a 1h", type: "event" },
                        { action: "Violation détectée", user: "Système", time: "Il y a 2h", type: "alert" },
                      ].map((activity, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 + 1 }}
                          className="relative p-4 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-xl overflow-hidden group"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10"
                            animate={{ x: [-100, 100] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          />
                          <div className="relative flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <motion.div
                                className={`w-3 h-3 rounded-full ${
                                  activity.type === 'join' ? 'bg-green-400' :
                                  activity.type === 'mod' ? 'bg-yellow-400' :
                                  activity.type === 'event' ? 'bg-blue-400' : 'bg-red-400'
                                }`}
                                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                              <div>
                                <p className="text-white font-bold">{activity.action}</p>
                                <p className="text-gray-400 text-sm">Par {activity.user}</p>
                              </div>
                            </div>
                            <span className="text-red-400 text-sm font-mono">{activity.time}</span>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Statistiques système */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                >
                  <Card className="bg-black/90 backdrop-blur-xl border-2 border-red-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center space-x-3">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Cpu className="w-6 h-6 text-red-400" />
                        </motion.div>
                        <span className="text-xl font-black tracking-wide">SYSTÈME</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {[
                        { label: "CPU", value: 25, color: "green" },
                        { label: "RAM", value: 50, color: "yellow" },
                        { label: "STORAGE", value: 33, color: "blue" },
                        { label: "NETWORK", value: 80, color: "purple" },
                      ].map((metric, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 font-semibold tracking-wider">{metric.label}</span>
                            <span className={`text-${metric.color}-400 font-bold font-mono`}>{metric.value}%</span>
                          </div>
                          <div className="relative">
                            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.value}%` }}
                                transition={{ delay: i * 0.2 + 1.2, duration: 1, ease: "easeOut" }}
                                className={`h-full bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-400 rounded-full relative`}
                              >
                                <motion.div
                                  className="absolute inset-0 bg-white/30"
                                  animate={{ x: [-100, 100] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="bg-black/90 backdrop-blur-xl border-2 border-red-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        >
                          <Users className="w-6 h-6 text-red-400" />
                        </motion.div>
                        <span className="text-xl font-black tracking-wide">GESTION DES MEMBRES</span>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold">
                          <UserPlus className="w-4 h-4 mr-2" />
                          INVITER MEMBRE
                        </Button>
                      </motion.div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Yuki (SK)", role: "Fondateur", status: "En ligne", avatar: "Y", level: "MAX" },
                        { name: "404", role: "Admin Tech", status: "En ligne", avatar: "4", level: "99" },
                        { name: "Modérateur Elite", role: "Modérateur", status: "En ligne", avatar: "M", level: "85" },
                        { name: "Player Pro", role: "Membre Elite", status: "Hors ligne", avatar: "P", level: "67" },
                      ].map((member, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 + 1 }}
                          className="relative p-4 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-xl overflow-hidden group hover:border-red-400/50 transition-all duration-300"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5"
                            animate={{ x: [-100, 100] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          />
                          <div className="relative flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <motion.div
                                className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold relative overflow-hidden"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                              >
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                />
                                <span className="relative z-10">{member.avatar}</span>
                              </motion.div>
                              <div>
                                <p className="text-white font-bold text-lg">{member.name}</p>
                                <div className="flex items-center space-x-2">
                                  <p className="text-red-400 text-sm font-semibold">{member.role}</p>
                                  <span className="text-gray-500">•</span>
                                  <p className="text-orange-400 text-sm font-mono">LVL {member.level}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <motion.div
                                className={`px-3 py-1 rounded-full text-sm font-bold ${
                                  member.status === 'En ligne' 
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                                }`}
                                animate={member.status === 'En ligne' ? {
                                  boxShadow: ['0 0 10px rgba(34, 197, 94, 0.3)', '0 0 20px rgba(34, 197, 94, 0.6)', '0 0 10px rgba(34, 197, 94, 0.3)']
                                } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                {member.status}
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: 15 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                                  <Settings className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="moderation">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="bg-black/90 backdrop-blur-xl border-2 border-red-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-3">
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity }
                        }}
                      >
                        <Shield className="w-6 h-6 text-red-400" />
                      </motion.div>
                      <span className="text-xl font-black tracking-wide">SYSTÈME DE MODÉRATION</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { title: "Auto-Ban", description: "Bannissement automatique", status: "ACTIF", color: "green" },
                        { title: "Spam Filter", description: "Filtre anti-spam", status: "ACTIF", color: "green" },
                        { title: "Word Filter", description: "Filtre de mots", status: "ACTIF", color: "green" },
                        { title: "Raid Protection", description: "Protection raids", status: "ACTIF", color: "green" },
                        { title: "Auto-Kick", description: "Expulsion automatique", status: "INACTIF", color: "red" },
                        { title: "Log System", description: "Système de logs", status: "ACTIF", color: "green" },
                      ].map((tool, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 + 1 }}
                          className="relative p-4 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-xl overflow-hidden group hover:border-red-400/50 transition-all duration-300"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5"
                            animate={{ x: [-100, 100] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                          />
                          <div className="relative">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-white font-bold text-lg">{tool.title}</h3>
                              <motion.div
                                className={`w-3 h-3 rounded-full ${
                                  tool.color === 'green' ? 'bg-green-400' : 'bg-red-400'
                                }`}
                                animate={{ 
                                  scale: [1, 1.3, 1], 
                                  opacity: [0.7, 1, 0.7] 
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{tool.description}</p>
                            <motion.div
                              className={`px-3 py-1 rounded-full text-xs font-bold text-center ${
                                tool.color === 'green' 
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                                  : 'bg-red-500/20 text-red-400 border border-red-500/50'
                              }`}
                              animate={tool.color === 'green' ? {
                                boxShadow: ['0 0 5px rgba(34, 197, 94, 0.3)', '0 0 15px rgba(34, 197, 94, 0.6)', '0 0 5px rgba(34, 197, 94, 0.3)']
                              } : {
                                boxShadow: ['0 0 5px rgba(239, 68, 68, 0.3)', '0 0 15px rgba(239, 68, 68, 0.6)', '0 0 5px rgba(239, 68, 68, 0.3)']
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              {tool.status}
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="system">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-6"
              >
                <Card className="bg-black/90 backdrop-blur-xl border-2 border-red-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-3">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Terminal className="w-6 h-6 text-red-400" />
                      </motion.div>
                      <span className="text-xl font-black tracking-wide">TERMINAL SYSTÈME</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-black/80 border border-red-500/30 rounded-xl p-4 font-mono text-sm">
                      <div className="space-y-2">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 }}
                          className="text-green-400"
                        >
                          [SYSTEM] ✓ S.L.Z Command Center initialized
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 }}
                          className="text-blue-400"
                        >
                          [DATABASE] ✓ Connection established - 20 members loaded
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.4 }}
                          className="text-yellow-400"
                        >
                          [SECURITY] ✓ All protection systems online
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.6 }}
                          className="text-purple-400"
                        >
                          [DISCORD] ✓ Bot connected - 10 members online
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.8 }}
                          className="text-red-400"
                        >
                          [ADMIN] ✓ Full access granted to administrator
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 2 }}
                          className="text-white flex items-center space-x-2"
                        >
                          <span>root@slz-guild:~$</span>
                          <motion.div
                            className="w-2 h-4 bg-white"
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="settings">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="bg-black/90 backdrop-blur-xl border-2 border-red-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-3">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      >
                        <Settings className="w-6 h-6 text-red-400" />
                      </motion.div>
                      <span className="text-xl font-black tracking-wide">PARAMÈTRES SYSTÈME</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        { title: "Mode Maintenance", description: "Activer le mode maintenance du site", enabled: false },
                        { title: "Auto-Modération", description: "Modération automatique des messages", enabled: true },
                        { title: "Notifications Discord", description: "Notifications automatiques Discord", enabled: true },
                        { title: "Logs Système", description: "Enregistrement des activités", enabled: true },
                        { title: "Backup Automatique", description: "Sauvegarde automatique des données", enabled: true },
                      ].map((setting, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 + 1 }}
                          className="relative p-4 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-xl overflow-hidden group"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5"
                            animate={{ x: [-100, 100] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
                          />
                          <div className="relative flex items-center justify-between">
                            <div>
                              <h3 className="text-white font-bold text-lg mb-1">{setting.title}</h3>
                              <p className="text-gray-400 text-sm">{setting.description}</p>
                            </div>
                            <motion.div
                              className={`px-4 py-2 rounded-full font-bold text-sm ${
                                setting.enabled 
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                                  : 'bg-red-500/20 text-red-400 border border-red-500/50'
                              }`}
                              animate={setting.enabled ? {
                                boxShadow: ['0 0 10px rgba(34, 197, 94, 0.3)', '0 0 20px rgba(34, 197, 94, 0.6)', '0 0 10px rgba(34, 197, 94, 0.3)']
                              } : {
                                boxShadow: ['0 0 10px rgba(239, 68, 68, 0.3)', '0 0 20px rgba(239, 68, 68, 0.6)', '0 0 10px rgba(239, 68, 68, 0.3)']
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {setting.enabled ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}