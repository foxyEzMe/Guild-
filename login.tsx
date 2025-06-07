import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Lock, User, Shield, Eye, EyeOff, Crown } from "lucide-react";
import { ParticleBackground } from "@/components/particle-background";

export default function Login() {
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [loginEffect, setLoginEffect] = useState(false);
  const [animatedText, setAnimatedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);

  const welcomeText = "ARISE CROSSOVER";
  
  useEffect(() => {
    // Redirect to home if already authenticated
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);
  
  useEffect(() => {
    // Text animation effect
    if (textIndex < welcomeText.length) {
      const timer = setTimeout(() => {
        setAnimatedText(prev => prev + welcomeText[textIndex]);
        setTextIndex(textIndex + 1);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [textIndex]);

  // Gérer la soumission du formulaire de connexion
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = (formData.get('username') as string)?.trim();
    const password = formData.get('password') as string;

    // Validation côté client renforcée
    if (!username || !password) {
      toast({
        title: "⚠️ Champs manquants",
        description: "Veuillez remplir votre nom d'utilisateur et mot de passe",
        variant: "destructive",
      });
      return;
    }

    if (username.length < 3) {
      toast({
        title: "❌ Nom d'utilisateur invalide",
        description: "Le nom d'utilisateur doit contenir au moins 3 caractères",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "❌ Mot de passe trop court",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoginEffect(true);
      await login.mutateAsync({ username, password });
      toast({
        title: "✅ Connexion réussie !",
        description: `Bienvenue ${username} sur Black Heart !`,
        variant: "default",
      });
      setTimeout(() => setLocation("/"), 500);
    } catch (error: any) {
      toast({
        title: "🚫 Échec de connexion",
        description: error.message || "Nom d'utilisateur ou mot de passe incorrect",
        variant: "destructive",
      });
      setLoginEffect(false);
    }
  };

  // Gérer la soumission du formulaire d'inscription
  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = (formData.get('username') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Validation côté client complète
    if (!username || !password || !confirmPassword) {
      toast({
        title: "⚠️ Champs obligatoires manquants",
        description: "Nom d'utilisateur, mot de passe et confirmation sont requis",
        variant: "destructive",
      });
      return;
    }

    if (username.length < 3) {
      toast({
        title: "❌ Nom d'utilisateur trop court",
        description: "Minimum 3 caractères requis pour le nom d'utilisateur",
        variant: "destructive",
      });
      return;
    }

    if (username.length > 20) {
      toast({
        title: "❌ Nom d'utilisateur trop long",
        description: "Maximum 20 caractères pour le nom d'utilisateur",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "❌ Mot de passe trop faible",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "❌ Mots de passe différents",
        description: "La confirmation doit être identique au mot de passe",
        variant: "destructive",
      });
      return;
    }

    // Validation email si fourni
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "❌ Email invalide",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoginEffect(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          email: email || undefined, 
          password 
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'inscription');
      }
      
      toast({
        title: "🎉 Compte créé avec succès !",
        description: `Bienvenue ${username} dans Black Heart !`,
        variant: "default",
      });
      setTimeout(() => setLocation("/"), 800);
    } catch (error: any) {
      toast({
        title: "🚫 Échec de l'inscription",
        description: error.message || "Ce nom d'utilisateur est peut-être déjà pris",
        variant: "destructive",
      });
      setLoginEffect(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-pure-black">
      {/* Enhanced Animated Background */}
      <ParticleBackground />
      
      {/* Cercles lumineux animés */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-neon-purple/10 rounded-full blur-3xl animate-pulse-slow z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] bg-neon-violet/8 rounded-full blur-3xl animate-pulse-slow z-0" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-electric-blue/5 rounded-full blur-3xl animate-pulse-slow z-0" style={{ animationDelay: '3s' }}></div>
      
      {/* Animated grid lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 z-0"></div>
      
      {/* Horizontal light beams */}
      <div className="absolute top-1/3 -left-40 h-[2px] w-screen bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent animate-pulse-slow"></div>
      <div className="absolute top-2/3 -right-40 h-[2px] w-screen bg-gradient-to-l from-transparent via-neon-violet/40 to-transparent animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      {/* Contenu principal */}
      <div className={`relative z-10 transition-all duration-1000 w-full max-w-md px-4 sm:px-6 md:px-8 mx-auto ${loginEffect ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="text-center mb-8 sm:mb-12">
          <div className="relative inline-block mb-4 sm:mb-6">
            <div className="absolute inset-0 bg-gradient-radial from-neon-purple/30 via-electric-blue/20 to-transparent blur-xl animate-pulse-slow rounded-full"></div>
            <Crown className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-neon-purple animate-subtle-float mx-auto" />
          </div>
          
          {/* Animated typing effect - Responsive */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 bg-gradient-to-r from-neon-purple via-neon-violet to-electric-blue bg-clip-text text-transparent animate-text-glow leading-tight">
            {animatedText}
            <span className="inline-block w-[2px] sm:w-[3px] md:w-[4px] lg:w-[5px] h-[20px] sm:h-[24px] md:h-[32px] lg:h-[40px] bg-neon-purple ml-1 animate-pulse"></span>
          </h1>
          <p className="text-light-gray text-base sm:text-lg max-w-sm sm:max-w-md mx-auto mb-6 sm:mb-8 px-2">
            Rejoindre la <span className="text-neon-purple font-semibold">Black Heart</span>
          </p>
        </div>
        
        <div className="relative group">
          {/* Bordure néon animée */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-magenta rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
          
          <main className="relative bg-black/90 p-4 sm:p-6 md:p-8 rounded-lg shadow-2xl border border-neon-purple/50" role="main">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8 bg-dark-surface">
                <TabsTrigger 
                  value="login"
                  className="text-sm sm:text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-purple data-[state=active]:to-neon-magenta data-[state=active]:text-white"
                >
                  Connexion
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="text-sm sm:text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-purple data-[state=active]:to-neon-magenta data-[state=active]:text-white"
                >
                  Inscription
                </TabsTrigger>
              </TabsList>
              
              {/* Onglet de connexion */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLoginSubmit} className="space-y-4 sm:space-y-6" noValidate>
                  <fieldset className="space-y-4">
                    <legend className="sr-only">Informations de connexion</legend>
                    
                    <div>
                      <label htmlFor="login-username" className="block text-neon-purple font-bold mb-2 text-sm sm:text-base">
                        Nom d'utilisateur *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-neon-purple/70" />
                        <Input
                          id="login-username"
                          name="username"
                          type="text"
                          required
                          minLength={3}
                          maxLength={20}
                          autoComplete="username"
                          className="pl-8 sm:pl-10 text-sm sm:text-base h-10 sm:h-12 bg-dark-surface border-neon-purple/30 focus:border-neon-magenta transition-all duration-300 focus:ring-2 focus:ring-neon-purple/50"
                          placeholder="Votre nom d'utilisateur"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="login-password" className="block text-neon-purple font-bold mb-2 text-sm sm:text-base">
                        Mot de passe *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-neon-purple/70" />
                        <Input
                          id="login-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          minLength={6}
                          autoComplete="current-password"
                          className="pl-8 sm:pl-10 pr-10 text-sm sm:text-base h-10 sm:h-12 bg-dark-surface border-neon-purple/30 focus:border-neon-magenta transition-all duration-300 focus:ring-2 focus:ring-neon-purple/50"
                          placeholder="Votre mot de passe"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-neon-purple/70 hover:text-neon-purple transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                        </button>
                      </div>
                    </div>
                  </fieldset>
                  
                  <Button
                    type="submit"
                    disabled={login.isPending}
                    className="w-full btn-neon group relative overflow-hidden transition-all duration-500"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {login.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connexion en cours...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                          Connexion
                        </>
                      )}
                    </span>
                  </Button>
                </form>
              </TabsContent>
              
              {/* Onglet d'inscription */}
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="register-username" className="block text-neon-purple font-bold mb-2">
                      Nom d'utilisateur
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-neon-purple/70" />
                      <Input
                        id="register-username"
                        name="username"
                        type="text"
                        required
                        minLength={3}
                        className="pl-10 bg-dark-surface border-neon-purple/30 focus:border-neon-magenta transition-all duration-300"
                        placeholder="Choisissez un nom d'utilisateur"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="register-email" className="block text-neon-purple font-bold mb-2">
                      Email (optionnel)
                    </label>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      className="bg-dark-surface border-neon-purple/30 focus:border-neon-magenta transition-all duration-300"
                      placeholder="Entrez votre email"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="register-password" className="block text-neon-purple font-bold mb-2">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-neon-purple/70" />
                      <Input
                        id="register-password"
                        name="password"
                        type={showRegisterPassword ? "text" : "password"}
                        required
                        minLength={6}
                        className="pl-10 pr-10 bg-dark-surface border-neon-purple/30 focus:border-neon-magenta transition-all duration-300"
                        placeholder="Créez un mot de passe"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-neon-purple/70 hover:text-neon-purple"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      >
                        {showRegisterPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="register-confirm-password" className="block text-neon-purple font-bold mb-2">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-neon-purple/70" />
                      <Input
                        id="register-confirm-password"
                        name="confirmPassword"
                        type={showRegisterPassword ? "text" : "password"}
                        required
                        className="pl-10 bg-dark-surface border-neon-purple/30 focus:border-neon-magenta transition-all duration-300"
                        placeholder="Confirmez votre mot de passe"
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full btn-3d mt-6 group"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Shield className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                      Créer un compte
                    </span>
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
      
      {/* Animation de succès lors de la connexion */}
      {loginEffect && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-neon-purple to-neon-magenta mx-auto mb-6 flex items-center justify-center animate-pulse">
              <Shield className="h-12 w-12 text-white animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">Authentification réussie</h2>
            <p className="text-neon-purple animate-pulse">Redirection vers votre espace personnel...</p>
          </div>
        </div>
      )}
    </div>
  );
}