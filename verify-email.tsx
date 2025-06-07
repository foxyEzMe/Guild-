import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  Mail, 
  Sparkles, 
  Star, 
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Home
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlanetScene } from "@/components/planet-scene";

type VerificationStatus = 'loading' | 'verified' | 'already_verified' | 'invalid_token' | 'server_error' | 'idle';

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Récupérer les paramètres de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const successParam = urlParams.get('success');
    const errorParam = urlParams.get('error');

    if (successParam === 'verified') {
      setStatus('verified');
      // Démarrer le compte à rebours pour la redirection
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setLocation('/login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else if (successParam === 'already_verified') {
      setStatus('already_verified');
    } else if (errorParam === 'invalid_token') {
      setStatus('invalid_token');
    } else if (errorParam === 'server_error') {
      setStatus('server_error');
    }
  }, [setLocation]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const floatingVariants = {
    floating: {
      y: [-15, 15, -15],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const getStatusContent = () => {
    switch (status) {
      case 'verified':
        return {
          icon: <CheckCircle className="w-24 h-24 text-green-400" />,
          title: "Email Vérifié avec Succès !",
          message: "Félicitations ! Votre compte a été activé avec succès. Vous faites maintenant partie de l'élite d'Arise Crossover !",
          buttonText: `Connexion (${countdown}s)`,
          buttonAction: () => setLocation('/login'),
          gradient: "from-green-400 via-emerald-500 to-teal-600",
          bgColor: "bg-green-500/20",
          borderColor: "border-green-500/30"
        };
      
      case 'already_verified':
        return {
          icon: <CheckCircle className="w-24 h-24 text-neon-purple" />,
          title: "Compte Déjà Activé",
          message: "Votre compte a déjà été vérifié ! Vous pouvez vous connecter dès maintenant.",
          buttonText: "Se connecter",
          buttonAction: () => setLocation('/login'),
          gradient: "from-neon-purple via-electric-blue to-neon-magenta",
          bgColor: "bg-neon-purple/20",
          borderColor: "border-neon-purple/30"
        };
      
      case 'invalid_token':
        return {
          icon: <XCircle className="w-24 h-24 text-red-400" />,
          title: "Lien de Validation Invalide",
          message: "Ce lien de validation est invalide ou a expiré. Veuillez demander un nouveau lien de validation.",
          buttonText: "Retour à l'inscription",
          buttonAction: () => setLocation('/register'),
          gradient: "from-red-400 via-pink-500 to-rose-600",
          bgColor: "bg-red-500/20",
          borderColor: "border-red-500/30"
        };
      
      case 'server_error':
        return {
          icon: <AlertCircle className="w-24 h-24 text-orange-400" />,
          title: "Erreur du Serveur",
          message: "Une erreur s'est produite lors de la vérification. Veuillez réessayer dans quelques instants.",
          buttonText: "Réessayer",
          buttonAction: () => window.location.reload(),
          gradient: "from-orange-400 via-amber-500 to-yellow-600",
          bgColor: "bg-orange-500/20",
          borderColor: "border-orange-500/30"
        };
      
      default:
        return {
          icon: <Mail className="w-24 h-24 text-electric-blue" />,
          title: "Vérification d'Email",
          message: "Cliquez sur le lien dans votre email pour vérifier votre compte.",
          buttonText: "Retour à l'accueil",
          buttonAction: () => setLocation('/'),
          gradient: "from-electric-blue via-neon-purple to-neon-magenta",
          bgColor: "bg-electric-blue/20",
          borderColor: "border-electric-blue/30"
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-purple-900/20 to-dark-bg relative overflow-hidden">
      <PlanetScene />
      
      {/* Étoiles et particules animées */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Particules colorées flottantes */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-3 h-3 rounded-full"
            style={{
              background: i % 3 === 0 ? '#8a2be2' : i % 3 === 1 ? '#4169e1' : '#ff1493',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
              x: Math.random() * 200 - 100,
              y: Math.random() * 200 - 100,
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-4xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Animation 3D à gauche */}
            <motion.div
              variants={itemVariants}
              className="hidden lg:flex items-center justify-center"
            >
              <motion.div
                variants={floatingVariants}
                animate="floating"
                className="relative"
              >
                <div className="w-80 h-80 relative">
                  {/* Anneaux rotatifs multicouches */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-neon-purple/40 rounded-full"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-6 border-3 border-electric-blue/50 rounded-full"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-12 border-2 border-neon-magenta/40 rounded-full"
                  />
                  
                  {/* Centre lumineux pulsant */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-20 bg-gradient-to-r from-neon-purple via-electric-blue to-neon-magenta rounded-full shadow-2xl shadow-neon-purple/60"
                  />

                  {/* Orbites d'étoiles */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-6 h-6"
                      style={{
                        left: "50%",
                        top: "50%",
                      }}
                      animate={{
                        rotate: 360,
                        x: Math.cos((i * Math.PI * 2) / 12) * (100 + i * 15),
                        y: Math.sin((i * Math.PI * 2) / 12) * (100 + i * 15),
                      }}
                      transition={{
                        duration: 8 + i * 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Contenu principal à droite */}
            <motion.div variants={itemVariants} className="space-y-8">
              <Card className={`${statusContent.bgColor} backdrop-blur-xl border ${statusContent.borderColor} shadow-2xl`}>
                <CardContent className="p-12 text-center space-y-8">
                  {/* Icône animée */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex justify-center"
                  >
                    <motion.div
                      animate={{ 
                        rotate: status === 'verified' ? [0, 360] : [0, 5, -5, 0],
                        scale: status === 'verified' ? [1, 1.1, 1] : 1
                      }}
                      transition={{ 
                        duration: status === 'verified' ? 2 : 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {statusContent.icon}
                    </motion.div>
                  </motion.div>

                  {/* Titre */}
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${statusContent.gradient} bg-clip-text text-transparent mb-4`}
                  >
                    {statusContent.title}
                  </motion.h1>

                  {/* Message */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="text-lg text-gray-300 leading-relaxed"
                  >
                    {statusContent.message}
                  </motion.p>

                  {/* Compte à rebours pour la vérification réussie */}
                  {status === 'verified' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl"
                    >
                      <p className="text-green-300 text-sm mb-2">
                        🎉 Redirection automatique vers la connexion dans :
                      </p>
                      <motion.div
                        key={countdown}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="text-3xl font-bold text-green-400"
                      >
                        {countdown}s
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Boutons d'action */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="space-y-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={statusContent.buttonAction}
                        className={`w-full bg-gradient-to-r ${statusContent.gradient} hover:opacity-90 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 shadow-lg`}
                      >
                        {status === 'server_error' ? (
                          <RefreshCw className="w-5 h-5 mr-2" />
                        ) : (
                          <ArrowRight className="w-5 h-5 mr-2" />
                        )}
                        {statusContent.buttonText}
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        onClick={() => setLocation('/')}
                        className="w-full border-neon-purple/30 hover:border-electric-blue text-white hover:bg-electric-blue/10 py-3 px-6 rounded-xl transition-all duration-300"
                      >
                        <Home className="w-4 h-4 mr-2" />
                        Retour à l'accueil
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Message additionnel pour les erreurs */}
                  {(status === 'invalid_token' || status === 'server_error') && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1, duration: 0.6 }}
                      className="text-sm text-gray-400 bg-dark-bg/30 p-4 rounded-xl border border-gray-600/20"
                    >
                      <p className="mb-2">
                        <strong>Besoin d'aide ?</strong>
                      </p>
                      <p>
                        Si le problème persiste, contactez notre équipe support qui vous assistera rapidement.
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}