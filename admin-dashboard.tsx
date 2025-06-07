import { useState, useEffect } from 'react';
import { useNavigate } from 'wouter';
import { Shield, Users, Bell, Settings, ChevronRight, LogOut, Lock, Edit, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { fetchDiscordMembers, fetchDiscordAnnouncements } from '@/lib/discord-api';
import resnBg from '../assets/resn-inspired-bg.svg';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function AdminDashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('members');
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Récupération des données
  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ['/api/discord/members'],
    queryFn: fetchDiscordMembers,
  });
  
  const { data: announcements, isLoading: isLoadingAnnouncements } = useQuery({
    queryKey: ['/api/discord/announcements'],
    queryFn: () => fetchDiscordAnnouncements(10),
  });
  
  // Animation d'entrée
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Redirection si non connecté ou non admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user && user.role !== 'admin'))) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, user, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 px-4 relative overflow-hidden bg-deep-black">
        <div className="absolute inset-0 z-0">
          <img src={resnBg} className="w-full h-full object-cover opacity-70" alt="Background" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-8">Chargement du panneau d'administration...</h1>
            <div className="flex justify-center">
              <Skeleton className="w-24 h-24 rounded-full bg-purple-primary/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return null; // Ne rien afficher pendant la redirection
  }
  
  return (
    <div className="min-h-screen pt-24 px-4 relative overflow-hidden bg-deep-black">
      {/* Fond moderne */}
      <div className="absolute inset-0 z-0">
        <img src={resnBg} className="w-full h-full object-cover opacity-70" alt="Background" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* En-tête */}
        <div 
          className={`mb-10 transform transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-primary to-purple-light rounded-lg flex items-center justify-center shadow-xl">
                <Shield className="text-white w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Panneau d'Administration</h1>
                <p className="text-white/70">Bienvenue, {user?.username || 'Administrateur'}</p>
              </div>
            </div>
            
            <Button 
              variant="outline"
              className="btn-animated flex items-center gap-2"
              onClick={() => navigate('/logout')}
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </Button>
          </div>
        </div>
        
        {/* Navigation par onglets */}
        <div 
          className={`mb-8 transform transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
          style={{ transitionDelay: '0.1s' }}
        >
          <Tabs defaultValue="members" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="bg-dark-purple/30 backdrop-blur-sm border border-purple-light/10 p-1 w-full flex">
              <TabsTrigger 
                value="members" 
                className="flex-1 data-[state=active]:bg-purple-primary/20 data-[state=active]:text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Membres
              </TabsTrigger>
              <TabsTrigger 
                value="announcements" 
                className="flex-1 data-[state=active]:bg-purple-primary/20 data-[state=active]:text-white"
              >
                <Bell className="w-4 h-4 mr-2" />
                Annonces
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex-1 data-[state=active]:bg-purple-primary/20 data-[state=active]:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </TabsTrigger>
            </TabsList>
            
            {/* Contenu des onglets */}
            <TabsContent value="members" className="mt-6">
              <Card className="bg-dark-purple/30 backdrop-blur-sm border-purple-light/10">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-light" />
                      <span>Gestion des Membres</span>
                    </div>
                    <div className="text-sm text-white/70">
                      {members?.length || 0} membres au total
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingMembers ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="w-10 h-10 rounded-full bg-purple-primary/10" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32 bg-purple-primary/10" />
                            <Skeleton className="h-3 w-24 bg-purple-primary/10" />
                          </div>
                          <Skeleton className="h-8 w-16 bg-purple-primary/10" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {members?.map((member) => (
                        <div key={member.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-purple-primary/10 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ 
                            backgroundImage: member.avatar 
                              ? `url(https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png)` 
                              : `url(https://ui-avatars.com/api/?name=${member.username}&background=8800cc&color=fff)`
                          }}></div>
                          
                          <div className="flex-1">
                            <div className="font-medium text-white">{member.displayName || member.username}</div>
                            <div className="text-sm text-white/60">{member.roles?.join(', ') || 'Membre'}</div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 px-2 border-purple-primary/20 hover:bg-purple-primary/20">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="announcements" className="mt-6">
              <Card className="bg-dark-purple/30 backdrop-blur-sm border-purple-light/10 mb-6">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-purple-light" />
                      <span>Créer une Annonce</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Titre</Label>
                      <Input 
                        id="title" 
                        placeholder="Titre de l'annonce" 
                        className="bg-deep-black/50 border-purple-primary/20 focus:border-purple-primary/50 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Contenu</Label>
                      <Textarea 
                        id="content" 
                        placeholder="Contenu de l'annonce" 
                        rows={5}
                        className="bg-deep-black/50 border-purple-primary/20 focus:border-purple-primary/50 text-white mt-1"
                      />
                    </div>
                    <Button className="btn-primary w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Publier l'annonce
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-dark-purple/30 backdrop-blur-sm border-purple-light/10">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-purple-light" />
                      <span>Annonces Publiées</span>
                    </div>
                    <div className="text-sm text-white/70">
                      {announcements?.length || 0} annonces au total
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingAnnouncements ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-2 pb-4 border-b border-purple-primary/10">
                          <Skeleton className="h-5 w-64 bg-purple-primary/10" />
                          <Skeleton className="h-4 w-full bg-purple-primary/10" />
                          <Skeleton className="h-4 w-3/4 bg-purple-primary/10" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {announcements?.map((announcement) => (
                        <div key={announcement.id} className="pb-4 border-b border-purple-primary/10 last:border-0 group">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-white">{announcement.title}</h3>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-purple-primary/20 hover:bg-purple-primary/20">
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-red-500/20 hover:bg-red-500/20 hover:text-red-500">
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-white/70 mt-1">{announcement.content}</p>
                          <div className="text-xs text-white/50 mt-2">Publié le {new Date(announcement.createdAt).toLocaleDateString('fr-FR')}</div>
                        </div>
                      ))}
                      
                      {announcements?.length === 0 && (
                        <div className="text-center py-4">
                          <Bell className="w-10 h-10 text-purple-light/40 mx-auto mb-2" />
                          <p className="text-white/70">Aucune annonce publiée pour le moment.</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <Card className="bg-dark-purple/30 backdrop-blur-sm border-purple-light/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-purple-light" />
                    <span>Gestion des Accès</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">Comptes Administrateurs</h3>
                      <div className="space-y-2 bg-deep-black/30 p-4 rounded-lg">
                        <div className="flex justify-between items-center p-2 rounded-lg hover:bg-purple-primary/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-primary/20 flex items-center justify-center">
                              <Shield className="w-5 h-5 text-purple-light" />
                            </div>
                            <div>
                              <div className="font-medium text-white">404dh</div>
                              <div className="text-xs text-white/60">Admin principal</div>
                            </div>
                          </div>
                          <Badge className="bg-purple-primary text-white">Fondateur</Badge>
                        </div>
                        
                        <div className="flex justify-between items-center p-2 rounded-lg hover:bg-purple-primary/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-primary/20 flex items-center justify-center">
                              <Shield className="w-5 h-5 text-purple-light" />
                            </div>
                            <div>
                              <div className="font-medium text-white">7yuki21</div>
                              <div className="text-xs text-white/60">Admin</div>
                            </div>
                          </div>
                          <Badge className="bg-purple-primary text-white">Co-Fondateur</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">Ajouter un Administrateur</h3>
                      <div className="flex gap-3">
                        <Input 
                          placeholder="Nom d'utilisateur Discord" 
                          className="bg-deep-black/50 border-purple-primary/20 focus:border-purple-primary/50 text-white"
                        />
                        <Button className="btn-primary">
                          <Plus className="w-4 h-4 mr-2" />
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Composant Badge
function Badge({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}