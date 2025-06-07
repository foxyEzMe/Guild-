import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Shield, Edit3, Save, X, Camera, Image, Palette } from 'lucide-react';
import { ParticleBackground } from '@/components/particle-background';

// Schéma de validation pour le profil
const profileSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user, form]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // TODO: Implémenter la mise à jour du profil via API
      console.log('Données du profil à mettre à jour:', data);
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès",
        variant: "default",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-neon-purple mx-auto mb-4"></div>
          <p className="text-light-gray">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-light-gray">Vous devez être connecté pour accéder à cette page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black relative overflow-hidden">
      <ParticleBackground />
      
      {/* Contenu principal */}
      <div className="relative z-10 pt-24 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div 
            className={`text-center mb-12 transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
          >
            <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-neon-purple via-electric-blue to-neon-cyan bg-clip-text text-transparent animate-text-glow">
              Mon Profil
            </h1>
            <p className="text-light-gray text-lg">
              Gérez vos informations personnelles et préférences
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Carte de profil style Discord */}
            <div 
              className={`lg:col-span-1 transform transition-all duration-1000 ${
                isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
              }`}
              style={{ transitionDelay: '0.3s' }}
            >
              <Card className="relative overflow-hidden">
                {/* Bordure néon animée */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-electric-blue rounded-lg blur opacity-75 animate-pulse-slow"></div>
                
                <div className="relative bg-dark-surface rounded-lg overflow-hidden">
                  {/* Bannière utilisateur (style Discord) */}
                  <div className="relative h-32 bg-gradient-to-r from-neon-purple via-electric-blue to-neon-cyan">
                    {/* Overlay de changement de bannière */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button className="bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
                        <Image className="w-4 h-4 mr-2" />
                        Changer la bannière
                      </Button>
                    </div>
                    
                    {/* Avatar positionné en bas à droite de la bannière (style Discord) */}
                    <div className="absolute -bottom-8 right-6 w-24 h-24">
                      <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple via-electric-blue to-neon-cyan rounded-full blur-sm opacity-75 animate-pulse-slow"></div>
                      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-dark-surface group cursor-pointer">
                        <img
                          src={user.profileImageUrl || `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 6}.png`}
                          alt={`Avatar de ${user.username}`}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        />
                        {/* Overlay pour changer la photo */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Camera className="text-white w-6 h-6" />
                        </div>
                        {/* Indicateur de statut en ligne */}
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 rounded-full border-4 border-dark-surface animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Informations du profil */}
                  <div className="p-6 pt-12">
                    <div className="text-right mb-4">
                      <h2 className="text-2xl font-bold text-white mb-1">{user.username}</h2>
                      <p className="text-neon-purple font-semibold">
                        {user.isAdmin ? '🛡️ Administrateur' : '👑 Membre Elite'}
                      </p>
                    </div>
                    
                    {/* Badges */}
                    <div className="space-y-2">
                      <div className="px-4 py-2 bg-gradient-to-r from-neon-purple to-electric-blue rounded-full text-white text-sm font-bold animate-neon-flicker text-center">
                        Arise Crossover
                      </div>
                      {user.isAdmin && (
                        <div className="px-4 py-2 bg-gradient-to-r from-electric-blue to-neon-cyan rounded-full text-white text-sm font-bold animate-neon-flicker text-center" style={{ animationDelay: '0.5s' }}>
                          Staff Elite
                        </div>
                      )}
                    </div>
                    
                    {/* Statistiques style Discord */}
                    <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                      <div className="bg-dark-surface/50 rounded-lg p-3">
                        <div className="text-white font-bold text-lg">24</div>
                        <div className="text-light-gray text-xs">Jours actif</div>
                      </div>
                      <div className="bg-dark-surface/50 rounded-lg p-3">
                        <div className="text-white font-bold text-lg">Elite</div>
                        <div className="text-light-gray text-xs">Rang</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Formulaire de modification */}
            <div 
              className={`lg:col-span-2 transform transition-all duration-1000 ${
                isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
              }`}
              style={{ transitionDelay: '0.6s' }}
            >
              <Card className="relative overflow-hidden">
                {/* Bordure néon animée */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-electric-blue to-neon-cyan rounded-lg blur opacity-75 animate-pulse-slow"></div>
                
                <div className="relative bg-dark-surface p-8 rounded-lg">
                  {/* En-tête de la carte */}
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <User className="text-electric-blue w-6 h-6" />
                      Informations personnelles
                    </h3>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`transition-all duration-300 transform hover:scale-105 ${
                        isEditing 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                          : 'bg-gradient-to-r from-neon-purple to-electric-blue hover:from-electric-blue hover:to-neon-cyan'
                      }`}
                    >
                      {isEditing ? (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Annuler
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Modifier
                        </>
                      )}
                    </Button>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Nom d'utilisateur */}
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-neon-purple font-bold flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Nom d'utilisateur
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  className={`bg-dark-surface border-neon-purple/30 focus:border-electric-blue transition-all duration-300 ${
                                    !isEditing ? 'opacity-70 cursor-not-allowed' : 'focus:ring-2 focus:ring-electric-blue/50'
                                  }`}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400 text-sm" />
                            </FormItem>
                          )}
                        />

                        {/* Email */}
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-neon-purple font-bold flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  className={`bg-dark-surface border-neon-purple/30 focus:border-electric-blue transition-all duration-300 ${
                                    !isEditing ? 'opacity-70 cursor-not-allowed' : 'focus:ring-2 focus:ring-electric-blue/50'
                                  }`}
                                  placeholder="votre.email@exemple.com"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400 text-sm" />
                            </FormItem>
                          )}
                        />

                        {/* Prénom */}
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-neon-purple font-bold">Prénom</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  className={`bg-dark-surface border-neon-purple/30 focus:border-electric-blue transition-all duration-300 ${
                                    !isEditing ? 'opacity-70 cursor-not-allowed' : 'focus:ring-2 focus:ring-electric-blue/50'
                                  }`}
                                  placeholder="Votre prénom"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400 text-sm" />
                            </FormItem>
                          )}
                        />

                        {/* Nom */}
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-neon-purple font-bold">Nom</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  className={`bg-dark-surface border-neon-purple/30 focus:border-electric-blue transition-all duration-300 ${
                                    !isEditing ? 'opacity-70 cursor-not-allowed' : 'focus:ring-2 focus:ring-electric-blue/50'
                                  }`}
                                  placeholder="Votre nom"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400 text-sm" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Informations sur le rôle */}
                      <div className="p-4 bg-gradient-to-r from-neon-purple/10 to-electric-blue/10 rounded-lg border border-neon-purple/20">
                        <div className="flex items-center gap-3 mb-2">
                          <Shield className="text-neon-purple w-5 h-5" />
                          <span className="font-bold text-white">Statut du compte</span>
                        </div>
                        <p className="text-light-gray text-sm">
                          <span className="text-neon-purple font-semibold">Rôle :</span> {user.isAdmin ? 'Administrateur' : 'Membre'}
                        </p>
                        <p className="text-light-gray text-sm">
                          <span className="text-neon-purple font-semibold">ID :</span> {user.id}
                        </p>
                      </div>

                      {/* Section Personnalisation */}
                      <div className="p-6 bg-gradient-to-r from-neon-purple/10 to-electric-blue/10 rounded-lg border border-neon-purple/20 space-y-4">
                        <h4 className="text-xl font-bold text-white flex items-center gap-2">
                          <Palette className="text-electric-blue w-5 h-5" />
                          Personnalisation
                        </h4>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Changer bannière */}
                          <Button className="relative h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400 hover:text-white hover:bg-purple-500/30 rounded-lg transition-all duration-300 group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
                            <div className="relative flex flex-col items-center">
                              <Image className="w-6 h-6 mb-1" />
                              <span className="text-sm font-semibold">Changer ma Bannière</span>
                            </div>
                          </Button>

                          {/* Personnaliser style */}
                          <Button className="relative h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400 hover:text-white hover:bg-blue-500/30 rounded-lg transition-all duration-300 group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
                            <div className="relative flex flex-col items-center">
                              <Palette className="w-6 h-6 mb-1" />
                              <span className="text-sm font-semibold">Personnaliser Style</span>
                            </div>
                          </Button>
                        </div>
                        
                        <p className="text-light-gray text-sm">
                          Personnalisez votre bannière de profil et choisissez votre style unique sur Arise Crossover.
                        </p>
                      </div>

                      {/* Bouton de sauvegarde */}
                      {isEditing && (
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Sauvegarder les modifications
                        </Button>
                      )}
                    </form>
                  </Form>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}