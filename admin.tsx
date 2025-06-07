import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import cyberpunkBg from '../assets/cyberpunk-bg.svg';
import { Shield, Users, BellRing, LayoutDashboard, LogOut, Loader2 } from "lucide-react";
import skAvatarPath from '../assets/sk-avatar.svg';

// Image pour l'admin (vous)
const adminAvatarPath = "https://i.pravatar.cc/150?img=68";

export default function AdminDashboard() {
  const { user, isLoading, logout, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [logoutLoading, setLogoutLoading] = useState(false);
  
  // Updated admin users with your Discord usernames
  const [adminUsers, setAdminUsers] = useState([
    { id: "1", name: "404dh", avatar: "https://cdn.discordapp.com/embed/avatars/0.png", role: "Fondateur", isOnline: true },
    { id: "2", name: "7yuki21", avatar: "https://cdn.discordapp.com/embed/avatars/1.png", role: "Administrateur", isOnline: true }
  ]);

  // Vérifier si l'utilisateur est authentifié et administrateur
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/admin-login");
      toast({
        title: "Accès refusé",
        description: "Vous devez être connecté pour accéder à cette page",
        variant: "destructive",
      });
    } else if (!isLoading && isAuthenticated && !isAdmin) {
      setLocation("/");
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les droits d'administrateur",
        variant: "destructive",
      });
    }
  }, [isLoading, isAuthenticated, isAdmin, setLocation, toast]);

  // Gérer la déconnexion
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout.mutateAsync();
      toast({
        title: "Déconnexion réussie",
        description: "Vous êtes maintenant déconnecté",
        variant: "default",
      });
      setTimeout(() => {
        setLocation("/");
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Erreur de déconnexion",
        description: error.message || "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
      setLogoutLoading(false);
    }
  };

  // Afficher un écran de chargement
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-near-black">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-neon-purple animate-spin mx-auto mb-4" />
          <p className="text-neon-purple font-semibold">Chargement du panel administrateur...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié ou n'est pas admin, ne rien afficher (la redirection est gérée par useEffect)
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-near-black relative overflow-x-hidden">
      {/* Fond cyberpunk animé */}
      <div className="absolute inset-0 z-0">
        <img src={cyberpunkBg} className="w-full h-full object-cover opacity-20" alt="Cyberpunk Background" />
        <div className="absolute inset-0 bg-gradient-to-br from-near-black/90 via-transparent to-near-black/90"></div>
      </div>
      
      {/* Cercles lumineux animés */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl animate-pulse-slow z-0"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-neon-magenta/5 rounded-full blur-3xl animate-pulse-slow z-0" style={{ animationDelay: '2s' }}></div>
      
      {/* En-tête du panel admin */}
      <header className="relative z-10 border-b border-neon-purple/20 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-neon-purple" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-magenta bg-clip-text text-transparent">
                Panel Administrateur
              </h1>
              <p className="text-light-gray text-sm">
                Connecté en tant que <span className="text-neon-purple font-medium">{user?.username}</span>
              </p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="text-light-gray hover:text-white hover:bg-neon-purple/20"
            onClick={handleLogout}
            disabled={logoutLoading}
          >
            {logoutLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            Déconnexion
          </Button>
        </div>
      </header>
      
      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <Card className="bg-black/60 border-neon-purple/30 shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-neon-purple animate-avatar-glow mx-auto">
                      <img 
                        src={user?.profileImageUrl || adminAvatarPath} 
                        alt={user?.username} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-success-green rounded-full border-2 border-black"></div>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">{user?.username}</h2>
                  <p className="text-neon-purple text-sm">Administrateur</p>
                </div>
                
                <nav>
                  <ul className="space-y-2">
                    <li>
                      <Button 
                        variant="ghost" 
                        className={`w-full justify-start ${activeTab === "dashboard" ? "bg-neon-purple/20 text-white" : "text-light-gray hover:bg-neon-purple/10"}`}
                        onClick={() => setActiveTab("dashboard")}
                      >
                        <LayoutDashboard className="mr-2 h-5 w-5" />
                        Tableau de bord
                      </Button>
                    </li>
                    <li>
                      <Button 
                        variant="ghost" 
                        className={`w-full justify-start ${activeTab === "users" ? "bg-neon-purple/20 text-white" : "text-light-gray hover:bg-neon-purple/10"}`}
                        onClick={() => setActiveTab("users")}
                      >
                        <Users className="mr-2 h-5 w-5" />
                        Utilisateurs
                      </Button>
                    </li>
                    <li>
                      <Button 
                        variant="ghost" 
                        className={`w-full justify-start ${activeTab === "notifications" ? "bg-neon-purple/20 text-white" : "text-light-gray hover:bg-neon-purple/10"}`}
                        onClick={() => setActiveTab("notifications")}
                      >
                        <BellRing className="mr-2 h-5 w-5" />
                        Notifications
                      </Button>
                    </li>
                  </ul>
                </nav>
              </div>
            </Card>
          </div>
          
          {/* Contenu principal */}
          <div className="col-span-12 lg:col-span-9">
            {activeTab === "dashboard" && (
              <Card className="bg-black/60 border-neon-purple/30 shadow-xl h-full">
                <CardHeader>
                  <CardTitle className="text-2xl bg-gradient-to-r from-neon-purple to-neon-magenta bg-clip-text text-transparent">
                    Tableau de bord
                  </CardTitle>
                  <CardDescription className="text-light-gray">
                    Vue d'ensemble de l'activité de la communauté Arise Crossover
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-dark-surface border-neon-purple/20 group hover:border-neon-purple/50 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-light-gray text-sm mb-1">Membres</p>
                            <h3 className="text-3xl font-bold text-white">62</h3>
                          </div>
                          <div className="w-12 h-12 bg-neon-purple/10 rounded-full flex items-center justify-center group-hover:bg-neon-purple/20 transition-all duration-300">
                            <Users className="h-6 w-6 text-neon-purple" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-dark-surface border-neon-purple/20 group hover:border-neon-purple/50 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-light-gray text-sm mb-1">En ligne</p>
                            <h3 className="text-3xl font-bold text-white">28</h3>
                          </div>
                          <div className="w-12 h-12 bg-neon-purple/10 rounded-full flex items-center justify-center group-hover:bg-neon-purple/20 transition-all duration-300">
                            <Users className="h-6 w-6 text-neon-purple" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-dark-surface border-neon-purple/20 group hover:border-neon-purple/50 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-light-gray text-sm mb-1">Administrateurs</p>
                            <h3 className="text-3xl font-bold text-white">2</h3>
                          </div>
                          <div className="w-12 h-12 bg-neon-purple/10 rounded-full flex items-center justify-center group-hover:bg-neon-purple/20 transition-all duration-300">
                            <Shield className="h-6 w-6 text-neon-purple" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4">Activité récente</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="bg-dark-surface border-neon-purple/20">
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center mr-4">
                              <BellRing className="h-5 w-5 text-neon-purple" />
                            </div>
                            <div>
                              <p className="text-white">Nouvelle annonce publiée</p>
                              <p className="text-light-gray text-sm">Il y a {i * 2} heures</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "users" && (
              <Card className="bg-black/60 border-neon-purple/30 shadow-xl h-full">
                <CardHeader>
                  <CardTitle className="text-2xl bg-gradient-to-r from-neon-purple to-neon-magenta bg-clip-text text-transparent">
                    Gestion des utilisateurs
                  </CardTitle>
                  <CardDescription className="text-light-gray">
                    Administrez les utilisateurs de la plateforme Arise Crossover
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-bold text-white mb-4">Administrateurs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {adminUsers.map((admin) => (
                      <Card key={admin.id} className="bg-dark-surface border-neon-purple/20 hover:border-neon-purple/50 transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <div className="relative mr-4">
                              <div className="w-14 h-14 rounded-full overflow-hidden border border-neon-purple">
                                <img 
                                  src={admin.avatar} 
                                  alt={admin.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-dark-surface ${admin.isOnline ? 'bg-success-green' : 'bg-muted'}`}></div>
                            </div>
                            <div>
                              <h4 className="text-white font-bold">{admin.name}</h4>
                              <p className="text-neon-purple text-sm">{admin.role}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Membres récents</h3>
                    <Button variant="outline" className="text-neon-purple border-neon-purple/50 hover:bg-neon-purple/20">
                      Voir tous
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Card key={i} className="bg-dark-surface border-neon-purple/20 hover:border-neon-purple/30 transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple/30 to-neon-magenta/30 mr-4 flex items-center justify-center">
                                <span className="text-white font-bold">U{i}</span>
                              </div>
                              <div>
                                <p className="text-white">Utilisateur #{i}</p>
                                <p className="text-light-gray text-sm">Inscrit il y a {i * 3} jours</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-light-gray hover:text-white hover:bg-neon-purple/20">
                              Détails
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "notifications" && (
              <Card className="bg-black/60 border-neon-purple/30 shadow-xl h-full">
                <CardHeader>
                  <CardTitle className="text-2xl bg-gradient-to-r from-neon-purple to-neon-magenta bg-clip-text text-transparent">
                    Notifications
                  </CardTitle>
                  <CardDescription className="text-light-gray">
                    Gérez les notifications envoyées aux membres
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Card className="bg-dark-surface border-neon-purple/20 hover:border-neon-purple/50 transition-all duration-300">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-white mb-2">Envoyer une notification</h3>
                        <p className="text-light-gray mb-4">
                          Créez une nouvelle notification pour tous les membres ou pour un groupe spécifique.
                        </p>
                        <Button className="btn-neon w-full">Créer une notification</Button>
                      </CardContent>
                    </Card>
                    
                    <h3 className="text-xl font-bold text-white mt-6 mb-4">Notifications récentes</h3>
                    
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Card key={i} className="bg-dark-surface border-neon-purple/20">
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center mr-4">
                              <BellRing className="h-5 w-5 text-neon-purple" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <p className="text-white font-medium">Notification importante #{i}</p>
                                <span className="text-light-gray text-sm">Il y a {i} jours</span>
                              </div>
                              <p className="text-light-gray text-sm">
                                Contenu de la notification {i}. Ceci est un exemple de notification envoyée aux membres.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}