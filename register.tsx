import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  Star, 
  Zap,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  Shield
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { registerUserSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { PlanetScene } from "@/components/planet-scene";

type RegisterFormData = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<'form' | 'success' | 'verification'>('form');
  const [userEmail, setUserEmail] = useState('');
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const res = await apiRequest("POST", "/api/register", data);
      return await res.json();
    },
    onSuccess: (data) => {
      console.log('Inscription réussie, données reçues:', data);
      setUserEmail(data.user?.email || data.email || 'votre email');
      setRegistrationStep('success');
      toast({
        title: "🎉 Inscription réussie !",
        description: "Un email de validation a été envoyé à votre adresse.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur s'est produite lors de l'inscription.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const floatingVariants = {
    floating: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (registrationStep === 'success') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        <PlanetScene />
        
        {/* Particules flottantes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-neon-purple rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center max-w-2xl mx-auto px-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 mx-auto mb-8 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-electric-blue to-neon-magenta rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-dark-bg rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-neon-purple" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-neon-purple via-electric-blue to-neon-magenta bg-clip-text text-transparent mb-6"
          >
            Inscription Réussie !
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl text-gray-300 mb-8 leading-relaxed"
          >
            Bienvenue dans l'univers <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold">Arise Crossover</span> !
            <br />
            Un email de validation a été envoyé à <span className="text-electric-blue font-semibold">{userEmail}</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="space-y-4"
          >
            <div className="p-6 bg-dark-surface/30 backdrop-blur-sm border border-neon-purple/30 rounded-2xl">
              <Mail className="w-8 h-8 text-electric-blue mx-auto mb-3" />
              <p className="text-gray-300">
                Vérifiez votre boîte de réception et cliquez sur le lien de validation pour activer votre compte.
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setLocation('/login')}
                className="w-full bg-gradient-to-r from-neon-purple to-electric-blue hover:from-electric-blue hover:to-neon-magenta text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 shadow-lg hover:shadow-neon-purple/50"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Aller à la connexion
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-900 relative overflow-hidden">
      <PlanetScene />
      
      {/* Étoiles animées */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Section gauche - Formulaire */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="text-center lg:text-left">
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-neon-purple via-electric-blue to-neon-magenta bg-clip-text text-transparent mb-4"
              >
                Rejoignez l'Élite
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-300 leading-relaxed"
              >
                Créez votre compte et découvrez l'univers exclusif d'<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">Arise Crossover</span>
              </motion.p>
            </div>

            <motion.div variants={itemVariants}>
              <Card className="bg-dark-surface/40 backdrop-blur-xl border-neon-purple/30 shadow-2xl">
                <CardHeader className="space-y-1 pb-6">
                  <CardTitle className="text-2xl text-center text-white flex items-center justify-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <UserPlus className="w-8 h-8 text-neon-purple" />
                    </motion.div>
                    Création de compte
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Prénom et Nom */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-neon-purple font-semibold flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Prénom
                              </FormLabel>
                              <FormControl>
                                <motion.div
                                  whileFocus={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Input
                                    {...field}
                                    placeholder="Votre prénom"
                                    className="bg-dark-bg/50 border-neon-purple/30 focus:border-electric-blue text-white placeholder:text-gray-400 transition-all duration-300 focus:ring-2 focus:ring-electric-blue/30"
                                  />
                                </motion.div>
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-neon-purple font-semibold flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Nom
                              </FormLabel>
                              <FormControl>
                                <motion.div
                                  whileFocus={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Input
                                    {...field}
                                    placeholder="Votre nom"
                                    className="bg-dark-bg/50 border-neon-purple/30 focus:border-electric-blue text-white placeholder:text-gray-400 transition-all duration-300 focus:ring-2 focus:ring-electric-blue/30"
                                  />
                                </motion.div>
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Email */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neon-purple font-semibold flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Email
                            </FormLabel>
                            <FormControl>
                              <motion.div
                                whileFocus={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="votre@email.com"
                                  className="bg-dark-bg/50 border-neon-purple/30 focus:border-electric-blue text-white placeholder:text-gray-400 transition-all duration-300 focus:ring-2 focus:ring-electric-blue/30"
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      {/* Nom d'utilisateur */}
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neon-purple font-semibold flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Nom d'utilisateur
                            </FormLabel>
                            <FormControl>
                              <motion.div
                                whileFocus={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Input
                                  {...field}
                                  placeholder="Votre nom d'utilisateur"
                                  className="bg-dark-bg/50 border-neon-purple/30 focus:border-electric-blue text-white placeholder:text-gray-400 transition-all duration-300 focus:ring-2 focus:ring-electric-blue/30"
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      {/* Mot de passe */}
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neon-purple font-semibold flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              Mot de passe
                            </FormLabel>
                            <FormControl>
                              <motion.div
                                whileFocus={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                                className="relative"
                              >
                                <Input
                                  {...field}
                                  type={showPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  className="bg-dark-bg/50 border-neon-purple/30 focus:border-electric-blue text-white placeholder:text-gray-400 transition-all duration-300 focus:ring-2 focus:ring-electric-blue/30 pr-12"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
                                  )}
                                </Button>
                              </motion.div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      {/* Confirmation mot de passe */}
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neon-purple font-semibold flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              Confirmer le mot de passe
                            </FormLabel>
                            <FormControl>
                              <motion.div
                                whileFocus={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                                className="relative"
                              >
                                <Input
                                  {...field}
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  className="bg-dark-bg/50 border-neon-purple/30 focus:border-electric-blue text-white placeholder:text-gray-400 transition-all duration-300 focus:ring-2 focus:ring-electric-blue/30 pr-12"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
                                  )}
                                </Button>
                              </motion.div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          disabled={registerMutation.isPending}
                          className="w-full bg-gradient-to-r from-neon-purple to-electric-blue hover:from-electric-blue hover:to-neon-magenta text-white font-bold py-4 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-neon-purple/50"
                        >
                          {registerMutation.isPending ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                            />
                          ) : (
                            <Sparkles className="w-5 h-5 mr-2" />
                          )}
                          {registerMutation.isPending ? "Création en cours..." : "Créer mon compte"}
                        </Button>
                      </motion.div>

                      <div className="text-center">
                        <p className="text-gray-400">
                          Déjà un compte ?{" "}
                          <button
                            type="button"
                            onClick={() => setLocation('/login')}
                            className="text-electric-blue hover:text-neon-purple transition-colors duration-300 font-semibold"
                          >
                            Se connecter
                          </button>
                        </p>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Section droite - Animation 3D */}
          <motion.div
            variants={itemVariants}
            className="hidden lg:flex items-center justify-center"
          >
            <motion.div
              variants={floatingVariants}
              animate="floating"
              className="relative"
            >
              <div className="w-96 h-96 relative">
                {/* Anneaux rotatifs */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-neon-purple/30 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-8 border-2 border-electric-blue/40 rounded-full"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-16 border-2 border-neon-magenta/30 rounded-full"
                />

                {/* Centre lumineux */}
                <div className="absolute inset-24 bg-gradient-to-r from-neon-purple via-electric-blue to-neon-magenta rounded-full animate-pulse shadow-2xl shadow-neon-purple/50" />

                {/* Étoiles orbitales */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 bg-white rounded-full"
                    style={{
                      left: "50%",
                      top: "50%",
                    }}
                    animate={{
                      rotate: 360,
                      x: Math.cos((i * Math.PI * 2) / 8) * (120 + i * 20),
                      y: Math.sin((i * Math.PI * 2) / 8) * (120 + i * 20),
                    }}
                    transition={{
                      duration: 10 + i * 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Star className="w-4 h-4 text-electric-blue animate-pulse" />
                  </motion.div>
                ))}
              </div>

              {/* Texte descriptif */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="mt-12 text-center"
              >
                <h3 className="text-2xl font-bold text-white mb-4">
                  Bienvenue dans l'Élite
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Rejoignez une communauté exclusive de joueurs passionnés et découvrez un univers gaming sans limites.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}