import { Crown, Users, Bell, Settings, MessageSquare, Image, Palette, Shield, Star, Zap, Sparkles, Target, Trophy } from 'lucide-react';
import { FaDiscord, FaTrello } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LiveStats } from '@/components/live-stats';
import { Link, useLocation } from 'wouter';
import { PlanetScene } from '@/components/planet-scene';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { DiscordJoinNotification } from '@/components/discord-join-notification';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showDiscordNotif, setShowDiscordNotif] = useState(false);
  const { isAuthenticated, isAdmin, user } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();
  
  const heroTexts = [
    "ÉLITE GAMING",
    "PUISSANCE STRATÉGIQUE", 
    "CONQUÊTE TOTALE",
    "EXCELLENCE PURE"
  ];
  
  // Effet pour faire défiler les textes d'en-tête
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  // Effet pour charger l'animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);
  
  // Effet pour vérifier si l'utilisateur vient de s'inscrire (via un paramètre d'URL)
  useEffect(() => {
    // Vérifier si l'utilisateur vient de s'inscrire
    const params = new URLSearchParams(window.location.search);
    if (params.get('newUser') === 'true' && isAuthenticated && user) {
      // Montrer la notification Discord après un court délai
      setTimeout(() => {
        setShowDiscordNotif(true);
        
        // Notification de bienvenue
        toast({
          title: "🎉 Bienvenue dans la communauté !",
          description: "Votre compte a été créé avec succès. Explorez le site pour découvrir toutes les fonctionnalités.",
          variant: "default",
        });
      }, 1500);
      
      // Nettoyer l'URL pour ne pas afficher la notification à chaque fois
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [isAuthenticated, user]);

  return (
    <>
      <PlanetScene />
      
      {/* Notification pour rejoindre Discord */}
      <DiscordJoinNotification 
        show={showDiscordNotif}
        onClose={() => setShowDiscordNotif(false)}
        username={user?.username || "membre"}
      />
      
      {/* HERO SECTION - Point focal principal */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 z-10">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Logo central spectaculaire */}
          <div 
            className={`mb-8 transform transition-all duration-1500 ${
              isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-32 opacity-0 scale-75'
            }`}
            style={{ transitionDelay: '0.3s' }}
          >
            <div className="relative w-48 h-48 mx-auto">
              {/* Anneaux d'énergie multiples */}
              <div className="absolute inset-0 bg-gradient-conic from-neon-purple via-electric-blue to-neon-cyan rounded-full opacity-40 blur-3xl animate-spin-slow"></div>
              <div className="absolute inset-4 bg-gradient-conic from-electric-blue via-neon-cyan to-neon-purple rounded-full opacity-30 blur-2xl animate-spin-reverse"></div>
              
              {/* Logo principal */}
              <div className="absolute inset-8 bg-gradient-to-br from-neon-purple via-electric-blue to-neon-cyan rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30 animate-subtle-float">
                <Crown className="text-white w-24 h-24 animate-subtle-float" />
              </div>
              
              {/* Particules orbitales */}
              <div className="absolute top-6 right-12 w-4 h-4 bg-neon-cyan rounded-full animate-orbit"></div>
              <div className="absolute bottom-8 left-8 w-3 h-3 bg-electric-blue rounded-full animate-orbit-reverse"></div>
              <div className="absolute top-16 left-6 w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Titre principal dynamique */}
          <div 
            className={`mb-6 transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{ transitionDelay: '0.6s' }}
          >
            <h1 className="text-7xl md:text-8xl font-black mb-4 bg-gradient-to-r from-neon-purple via-electric-blue to-neon-cyan bg-clip-text text-transparent" style={{ filter: 'none', textShadow: 'none' }}>
              ARISE CROSSOVER
            </h1>
            <div className="h-16 overflow-hidden">
              <div className="text-3xl md:text-4xl font-bold text-electric-blue animate-slide-up">
                {heroTexts[currentTextIndex]}
              </div>
            </div>
          </div>

          {/* Description captivante */}
          <div 
            className={`mb-12 transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{ transitionDelay: '0.9s' }}
          >
            <p className="text-xl md:text-2xl text-light-gray max-w-3xl mx-auto leading-relaxed" style={{ filter: 'none', textShadow: 'none' }}>
              Rejoignez l'élite du gaming compétitif. Une guilde où la 
              <span className="text-neon-purple font-bold"> stratégie</span>, 
              <span className="text-electric-blue font-bold"> l'excellence</span> et 
              <span className="text-neon-cyan font-bold"> la camaraderie</span> se rencontrent.
            </p>
          </div>

          {/* ZONE D'ACTIONS PRINCIPALES - Organisation claire */}
          <motion.div 
            className="grid md:grid-cols-1 gap-6 mb-16 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            {/* Bouton Discord principal avec animations 3D */}
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#5865F2] to-[#4752C4] rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
              <Button
                onClick={() => window.open('https://discord.gg/6xatKzxUqD', '_blank')}
                className="relative h-16 w-full bg-gradient-to-r from-[#5865F2] to-[#4752C4] hover:from-[#4752C4] hover:to-[#5865F2] text-white font-bold text-lg px-8 rounded-2xl shadow-2xl border-0"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="mr-3"
                >
                  <FaDiscord className="text-2xl" />
                </motion.div>
                Rejoindre Discord
                <motion.div 
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Sparkles className="absolute top-2 right-2 w-4 h-4 text-white/60" />
              </Button>
            </motion.div>


          </motion.div>

          {/* FONCTIONNALITÉS PRINCIPALES - Section simplifiée */}
          <AnimatePresence>
            {isAuthenticated && (
              <motion.div 
                className="grid md:grid-cols-2 gap-8 mb-16 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 1.5, duration: 1 }}
              >
                {/* Badge de bienvenue utilisateur */}
                <motion.div
                  className="md:col-span-2 text-center mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.7, duration: 0.8 }}
                >
                  <Badge className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 text-lg font-bold shadow-2xl">
                    <Crown className="w-5 h-5 mr-2" />
                    Bienvenue, {user?.firstName} {user?.lastName}
                    <Sparkles className="w-5 h-5 ml-2" />
                  </Badge>
                </motion.div>



                {/* Admin Panel (visible pour les admins seulement) */}
                {isAdmin && (
                  <motion.div
                    whileHover={{ scale: 1.03, rotateX: -5 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
                    <Link href="/admin">
                      <Button className="relative w-full h-24 bg-gradient-to-r from-red-600 to-orange-600 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-2xl shadow-2xl border-0">
                        <div className="flex flex-col items-center">
                          <motion.div
                            animate={{ rotateY: [0, 180, 360] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="mb-2"
                          >
                            <Shield className="w-8 h-8" />
                          </motion.div>
                          <span className="text-lg font-bold">ADMIN PANEL</span>
                          <span className="text-sm opacity-80">Contrôle total</span>
                        </div>
                        <motion.div
                          className="absolute top-3 right-3"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Crown className="w-5 h-5 text-yellow-400" />
                        </motion.div>
                      </Button>
                    </Link>
                  </motion.div>
                )}

                {/* Bouton profil si pas admin */}
                {!isAdmin && (
                  <motion.div
                    whileHover={{ scale: 1.03, rotateX: -5 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
                    <Link href="/profile">
                      <Button className="relative w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white font-bold rounded-2xl shadow-2xl border-0">
                        <div className="flex flex-col items-center">
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="mb-2"
                          >
                            <Settings className="w-8 h-8" />
                          </motion.div>
                          <span className="text-lg font-bold">MON PROFIL</span>
                          <span className="text-sm opacity-80">Personnaliser</span>
                        </div>
                        <Star className="absolute top-3 right-3 w-5 h-5 text-yellow-400" />
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats en temps réel - Bien visible */}
          <div 
            className={`transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{ transitionDelay: '1.8s' }}
          >
            <LiveStats />
          </div>
        </div>
      </section>



      {/* SECTION PHOTOS - Galerie en bas */}
      <section className="relative py-16 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <div 
            className={`transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{ transitionDelay: '3s' }}
          >
            <h3 className="text-4xl font-bold text-white mb-12 text-center bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent" style={{ filter: 'none', textShadow: 'none' }}>
              NOS LÉGENDES
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {/* Yuki - Photo noir */}
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative group overflow-hidden rounded-2xl"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-black rounded-2xl overflow-hidden">
                  <img
                    src="/images/c786865f8dbe2ceef9765401efa8bf37_1749300622642.jpeg"
                    alt="Yuki - Fondateur S.L.Z Guild"
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h4 className="text-white font-bold text-2xl mb-2" style={{ filter: 'none', textShadow: 'none' }}>Yuki (SK)</h4>
                    <p className="text-yellow-400 text-lg font-semibold mb-2">Fondateur & Leader Suprême</p>
                    <p className="text-white/80 text-sm" style={{ filter: 'none', textShadow: 'none' }}>Architecte visionnaire de l'empire Black Heart</p>
                  </div>
                </div>
              </motion.div>

              {/* 404 - Photo couleur */}
              <motion.div
                whileHover={{ scale: 1.05, rotateY: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative group overflow-hidden rounded-2xl"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-black rounded-2xl overflow-hidden">
                  <img
                    src="/images/IMG_8086_1749300622645.jpeg"
                    alt="404 - Développeur & Admin S.L.Z Guild"
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h4 className="text-white font-bold text-2xl mb-2" style={{ filter: 'none', textShadow: 'none' }}>404</h4>
                    <p className="text-cyan-400 text-lg font-semibold mb-2">Développeur Web & Admin</p>
                    <p className="text-white/80 text-sm" style={{ filter: 'none', textShadow: 'none' }}>Maître de la technologie et innovation</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION EXTERNE - Links vers services externes */}
      <section className="relative py-16 px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className={`transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{ transitionDelay: '3.2s' }}
          >
            <h3 className="text-3xl font-bold text-white mb-8" style={{ filter: 'none', textShadow: 'none' }}>Restez Connectés</h3>
            <div className="flex justify-center space-x-6">
              <Button
                onClick={() => window.open('https://discord.gg/6xatKzxUqD', '_blank')}
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <FaDiscord className="mr-3 text-xl" />
                Discord
              </Button>
              <Button
                onClick={() => window.open('https://trello.com/votre-board', '_blank')}
                className="bg-[#0079BF] hover:bg-[#005A8B] text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <FaTrello className="mr-3 text-xl" />
                Trello
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}