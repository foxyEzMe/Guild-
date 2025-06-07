import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth, LoginCredentials } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Lock, User, Shield, Eye, EyeOff, Crown, Sparkles, Zap, Star } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export default function Login() {
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animatedTitle, setAnimatedTitle] = useState("");
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);

  const titleText = "ARISE CROSSOVER";

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

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      await login.mutateAsync(data);
      toast({
        title: "Connexion réussie !",
        description: "Bienvenue dans Arise Crossover",
      });
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Nom d'utilisateur ou mot de passe incorrect",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-purple-900/30 to-black">
      {/* Particules animées */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-60 animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.id * 0.1}s`,
              animationDuration: `${3 + (particle.id % 4)}s`,
            }}
          />
        ))}
      </div>

      {/* Effets de fond */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-2xl animate-spin" style={{animationDuration: '20s'}}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Titre animé spectaculaire */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-violet-300 to-purple-400 bg-clip-text text-transparent mb-2">
                {animatedTitle}
                <span className="animate-blink">|</span>
              </h1>
              
              {/* Effets lumineux autour du titre */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-violet-600/20 blur-xl rounded-full animate-pulse"></div>
              
              {/* Étoiles scintillantes */}
              <Star className="absolute -top-2 -right-2 w-6 h-6 text-purple-400 animate-ping" />
              <Sparkles className="absolute -bottom-2 -left-2 w-4 h-4 text-violet-400 animate-bounce" />
            </div>
            
            <p className="text-lg text-purple-300 font-semibold tracking-wider">
              ELITE GAMING GUILD
            </p>
          </div>

          {/* Carte de connexion avec effets glassmorphism */}
          <Card className="relative bg-black/40 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden">
            {/* Bordure animée */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-violet-600/20 animate-pulse"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500 animate-pulse"></div>
            
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="relative">
                  <Shield className="w-8 h-8 text-purple-400 animate-pulse" />
                  <div className="absolute inset-0 bg-purple-400/20 blur-xl rounded-full"></div>
                </div>
                <h2 className="text-2xl font-bold text-white">CONNEXION</h2>
                <div className="relative">
                  <Crown className="w-8 h-8 text-violet-400 animate-bounce" />
                  <div className="absolute inset-0 bg-violet-400/20 blur-xl rounded-full"></div>
                </div>
              </div>
              <p className="text-purple-300">Accédez à votre compte Elite</p>
            </CardHeader>

            <CardContent className="relative">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Champ Username avec effets */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-300 font-semibold flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Nom d'utilisateur
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              {...field}
                              className="bg-black/50 border-purple-500/30 text-white placeholder-purple-300/50 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300 group-focus-within:shadow-lg group-focus-within:shadow-purple-500/20"
                              placeholder="Entrez votre nom d'utilisateur"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 rounded-md pointer-events-none"></div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Champ Password avec effets */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-300 font-semibold flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Mot de passe
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              className="bg-black/50 border-purple-500/30 text-white placeholder-purple-300/50 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300 group-focus-within:shadow-lg group-focus-within:shadow-purple-500/20 pr-12"
                              placeholder="Entrez votre mot de passe"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 rounded-md pointer-events-none"></div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Bouton de connexion SPECTACULAIRE */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative group bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold py-4 text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 overflow-hidden"
                  >
                    {/* Effet de balayage lumineux */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                    
                    {/* Bordure animée */}
                    <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-border opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Zap className="w-5 h-5 group-hover:animate-bounce" />
                      )}
                      <span>{isLoading ? "CONNEXION..." : "SE CONNECTER"}</span>
                    </div>
                    
                    {/* Particules au survol */}
                    <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                    <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{animationDelay: '0.2s'}}></div>
                  </Button>

                  {/* Message d'aide stylé */}
                  <div className="text-center pt-4">
                    <p className="text-purple-300/80 text-sm">
                      Utilisez vos identifiants de membre Elite pour accéder à votre compte
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Note admin en bas */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-full">
              <Crown className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span className="text-purple-300 text-sm">Comptes admin disponibles: 7yuki21 & 404dh</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  );
}