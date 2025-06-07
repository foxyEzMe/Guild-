import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth, LoginCredentials } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import cyberpunkBg from '../assets/cyberpunk-bg.svg';
import { Loader2, Lock, User, ShieldAlert } from "lucide-react";

// Schéma de validation pour le formulaire de connexion
const loginSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export default function AdminLogin() {
  const { toast } = useToast();
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [loginEffect, setLoginEffect] = useState(false);

  // Initialiser le formulaire avec react-hook-form et zod
  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Gérer la soumission du formulaire
  const onSubmit = async (data: LoginCredentials) => {
    try {
      setLoginEffect(true);
      await login.mutateAsync(data);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'interface d'administration",
        variant: "default",
      });
      setTimeout(() => {
        setLocation("/admin");
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Identifiants invalides. Veuillez réessayer.",
        variant: "destructive",
      });
      setLoginEffect(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-near-black">
      {/* Fond cyberpunk animé */}
      <div className="absolute inset-0 z-0">
        <img src={cyberpunkBg} className="w-full h-full object-cover opacity-40" alt="Cyberpunk Background" />
        <div className="absolute inset-0 bg-gradient-to-br from-near-black/80 via-transparent to-near-black/80"></div>
      </div>
      
      {/* Cercles lumineux animés */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse-slow z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-magenta/8 rounded-full blur-3xl animate-pulse-slow z-0" style={{ animationDelay: '2s' }}></div>
      
      {/* Grille cyberpunk */}
      <div className="cyber-grid absolute inset-0 z-0"></div>
      
      {/* Contenu principal */}
      <div className={`relative z-10 transition-all duration-1000 ${loginEffect ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <ShieldAlert className="w-20 h-20 text-neon-purple animate-pulse mx-auto mb-4" />
            <div className="absolute inset-0 bg-neon-purple/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-neon-purple via-neon-magenta to-neon-pink bg-clip-text text-transparent animate-text-glow">
            ADMINISTRATION
          </h1>
          <p className="text-light-gray text-lg max-w-md mx-auto mb-8">
            Accès réservé aux administrateurs <span className="text-neon-purple font-semibold">Arise Crossover</span>
          </p>
        </div>
        
        <Card className="w-full max-w-md mx-auto relative group">
          {/* Bordure néon animée */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-magenta rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
          
          <div className="relative bg-black/90 p-8 rounded-lg shadow-2xl border border-neon-purple/50">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neon-purple font-bold">Nom d'utilisateur</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-5 w-5 text-neon-purple/70" />
                          <Input
                            {...field}
                            className="pl-10 bg-dark-surface border-neon-purple/30 focus:border-neon-magenta transition-all duration-300 focus:ring-2 focus:ring-neon-purple/50"
                            placeholder="Entrez votre nom d'utilisateur"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-destructive text-sm" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neon-purple font-bold">Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-neon-purple/70" />
                          <Input
                            {...field}
                            type="password"
                            className="pl-10 bg-dark-surface border-neon-purple/30 focus:border-neon-magenta transition-all duration-300 focus:ring-2 focus:ring-neon-purple/50"
                            placeholder="Entrez votre mot de passe"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-destructive text-sm" />
                    </FormItem>
                  )}
                />
                
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
                        Connexion Admin
                      </>
                    )}
                  </span>
                </Button>
              </form>
            </Form>
          </div>
        </Card>
      </div>
      
      {/* Animation de succès lors de la connexion */}
      {loginEffect && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-neon-purple to-neon-magenta mx-auto mb-6 flex items-center justify-center animate-pulse">
              <Lock className="h-12 w-12 text-white animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">Authentification réussie</h2>
            <p className="text-neon-purple animate-pulse">Redirection vers le panneau d'administration...</p>
          </div>
        </div>
      )}
    </div>
  );
}