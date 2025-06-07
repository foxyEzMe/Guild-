import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Lock, User, Shield, Eye, EyeOff, Crown, Sparkles, Zap, Star, UserPlus, Mail, UserCheck } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const registerSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  email: z.string().email("Veuillez entrer un email valide").optional().or(z.literal("")),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
  securityQuestion: z.string().min(1, "Veuillez choisir une question de sécurité"),
  securityAnswer: z.string().min(1, "Veuillez entrer une réponse de sécurité")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterSpectacular() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [animatedTitle, setAnimatedTitle] = useState("");
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [registrationStep, setRegistrationStep] = useState<'form' | 'success'>('form');

  const titleText = "REJOIGNEZ L'ÉLITE";

  // Animation du titre
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= titleText.length) {
        setAnimatedTitle(titleText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Génération de particules
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      securityQuestion: "",
      securityAnswer: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const res = await apiRequest("POST", "/api/register", data);
      return await res.json();
    },
    onSuccess: (data) => {
      console.log('Inscription réussie:', data);
      toast({
        title: "🎉 Inscription réussie !",
        description: "Vous êtes maintenant connecté et redirigé vers l'accueil.",
        variant: "default",
      });
      // Redirection vers l'accueil avec un paramètre pour afficher la notification Discord
      window.location.href = '/?newUser=true';
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
    // Le reste de la logique de redirection est gérée dans onSuccess
  };

  if (registrationStep === 'success') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        {/* Effet de particules de fond */}
        <div className="absolute inset-0">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Contenu de succès */}
        <div className="relative z-10 text-center max-w-md mx-auto px-6">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <UserCheck className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Bienvenue dans l'Élite !
            </h1>
            <p className="text-purple-300 text-lg mb-6">
              Votre compte a été créé avec succès. Un email de validation vous a été envoyé.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={() => setLocation('/auth')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Se connecter maintenant
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setLocation('/')}
              className="w-full border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition-all duration-300"
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Effet de grille hexagonale */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: `
            radial-gradient(circle at 25px 25px, #8b5cf6 2px, transparent 2px),
            radial-gradient(circle at 75px 75px, #8b5cf6 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Particules flottantes */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Effets de lumière */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 min-h-screen flex">
        {/* Section gauche - Formulaire */}
        <div className="flex-1 flex items-center justify-center px-8 lg:px-16">
          <div className="w-full max-w-md">
            {/* En-tête avec titre animé */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Crown className="w-16 h-16 text-purple-400" />
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  {animatedTitle}
                </span>
                <span className="animate-pulse">|</span>
              </h1>
              
              <p className="text-purple-300 text-lg">
                Créez votre compte élite et rejoignez notre communauté d'excellence
              </p>
            </div>

            {/* Formulaire d'inscription */}
            <Card className="bg-gray-900/80 backdrop-blur-xl border-purple-500/30 shadow-2xl">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center space-x-2 text-purple-400">
                  <UserPlus className="w-5 h-5" />
                  <span className="font-semibold">Inscription Elite</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-300">Prénom</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                                <Input
                                  {...field}
                                  type="text"
                                  className="pl-10 bg-gray-800/50 border-purple-500/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                                  placeholder="Votre prénom"
                                />
                              </div>
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
                            <FormLabel className="text-purple-300">Nom</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                                <Input
                                  {...field}
                                  type="text"
                                  className="pl-10 bg-gray-800/50 border-purple-500/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                                  placeholder="Votre nom"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-300">Nom d'utilisateur</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                              <Input
                                {...field}
                                type="text"
                                className="pl-10 bg-gray-800/50 border-purple-500/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                                placeholder="Choisissez votre pseudonyme"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-300">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                              <Input
                                {...field}
                                type="email"
                                className="pl-10 bg-gray-800/50 border-purple-500/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                                placeholder="votre@email.com"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-300">Mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                className="pl-10 pr-10 bg-gray-800/50 border-purple-500/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                                placeholder="Créez un mot de passe sécurisé"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-300">Confirmer le mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                              <Input
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                className="pl-10 pr-10 bg-gray-800/50 border-purple-500/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                                placeholder="Confirmez votre mot de passe"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                              >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="securityQuestion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-300">Question de sécurité</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                              <Input
                                {...field}
                                type="text"
                                className="pl-10 bg-gray-800/50 border-purple-500/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                                placeholder="Ex: Quel est votre film préféré?"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="securityAnswer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-300">Réponse de sécurité</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                              <Input
                                {...field}
                                type="text"
                                className="pl-10 bg-gray-800/50 border-purple-500/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                                placeholder="Votre réponse (à conserver précieusement)"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={registerMutation.isPending}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Création en cours...
                        </>
                      ) : (
                        <>
                          <Crown className="mr-2 h-4 w-4" />
                          Rejoindre l'Élite
                        </>
                      )}
                    </Button>
                  </form>
                </Form>

                <div className="text-center pt-4">
                  <p className="text-gray-400">
                    Déjà membre ?{" "}
                    <button
                      onClick={() => setLocation('/auth')}
                      className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                    >
                      Se connecter
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section droite - Héro */}
        <div className="hidden lg:flex flex-1 items-center justify-center px-8">
          <div className="text-center max-w-lg">
            <div className="mb-8">
              <div className="relative inline-block">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Crown className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                </div>
                <div className="absolute -bottom-2 -left-2">
                  <Star className="w-6 h-6 text-blue-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
                <div className="absolute top-1/2 -right-8">
                  <Zap className="w-5 h-5 text-purple-400 animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
              </div>
            </div>

            <h2 className="text-5xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                S.L.Z GUILD
              </span>
            </h2>

            <p className="text-xl text-purple-300 mb-8 leading-relaxed">
              Rejoignez l'élite du gaming compétitif Roblox. Faites partie d'une communauté exceptionnelle où l'excellence n'est pas une option, mais une norme.
            </p>

            <div className="grid grid-cols-1 gap-4 text-left">
              <div className="flex items-center space-x-3 text-purple-300">
                <Shield className="w-5 h-5 text-purple-400" />
                <span>Communauté Elite & Exclusive</span>
              </div>
              <div className="flex items-center space-x-3 text-purple-300">
                <Crown className="w-5 h-5 text-purple-400" />
                <span>Événements & Tournois Prestigieux</span>
              </div>
              <div className="flex items-center space-x-3 text-purple-300">
                <Zap className="w-5 h-5 text-purple-400" />
                <span>Support Premium & Assistance 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}