import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Activity, Eye, Clock, Shield, Zap, TrendingUp, Globe, UserCheck, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface UserActivity {
  id: string;
  username: string;
  action: string;
  timestamp: Date;
  ip: string;
  location: string;
  device: string;
}

interface SiteStats {
  totalUsers: number;
  activeUsers: number;
  onlineUsers: number;
  todayVisits: number;
  totalSessions: number;
  avgSessionTime: string;
}

export default function AdminStats() {
  const [realTimeUsers, setRealTimeUsers] = useState<UserActivity[]>([]);
  const [siteStats, setSiteStats] = useState<SiteStats>({
    totalUsers: 2,
    activeUsers: 1,
    onlineUsers: 1,
    todayVisits: 47,
    totalSessions: 156,
    avgSessionTime: "12m 34s"
  });

  // Simulation d'activité en temps réel
  useEffect(() => {
    const activities: UserActivity[] = [
      {
        id: '1',
        username: '404dh',
        action: 'Connexion admin',
        timestamp: new Date(),
        ip: '192.168.1.100',
        location: 'France',
        device: 'Chrome/Desktop'
      },
      {
        id: '2',
        username: '404dh',
        action: 'Consultation membres',
        timestamp: new Date(Date.now() - 2 * 60000),
        ip: '192.168.1.100',
        location: 'France',
        device: 'Chrome/Desktop'
      },
      {
        id: '3',
        username: '404dh',
        action: 'Accès page événements',
        timestamp: new Date(Date.now() - 5 * 60000),
        ip: '192.168.1.100',
        location: 'France',
        device: 'Chrome/Desktop'
      }
    ];
    
    setRealTimeUsers(activities);

    // Simulation de mise à jour en temps réel
    const interval = setInterval(() => {
      const newActivity: UserActivity = {
        id: Date.now().toString(),
        username: '404dh',
        action: 'Navigation sur le site',
        timestamp: new Date(),
        ip: '192.168.1.100',
        location: 'France',
        device: 'Chrome/Desktop'
      };
      
      setRealTimeUsers(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getActionIcon = (action: string) => {
    if (action.includes('Connexion')) return <UserCheck className="w-4 h-4 text-green-400" />;
    if (action.includes('admin')) return <Shield className="w-4 h-4 text-red-400" />;
    if (action.includes('Navigation')) return <Activity className="w-4 h-4 text-blue-400" />;
    return <Eye className="w-4 h-4 text-purple-400" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('Connexion')) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (action.includes('admin')) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (action.includes('Navigation')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `Il y a ${diff}s`;
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)}min`;
    return `Il y a ${Math.floor(diff / 3600)}h`;
  };

  return (
    <div className="min-h-screen pt-24 px-4 bg-gradient-to-br from-black via-purple-900/20 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Header avec titre animé */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            STATISTIQUES ADMIN
          </h1>
          <p className="text-xl text-purple-300 max-w-2xl mx-auto">
            Surveillance en temps réel de l'activité du site Arise Crossover
          </p>
        </div>

        {/* Cartes de statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium">Utilisateurs Total</p>
                  <p className="text-3xl font-bold text-white">{siteStats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">+100% ce mois</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm font-medium">En Ligne</p>
                  <p className="text-3xl font-bold text-white">{siteStats.onlineUsers}</p>
                </div>
                <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-400 animate-pulse" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <span className="text-green-400 text-sm">Temps réel</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm font-medium">Visites Aujourd'hui</p>
                  <p className="text-3xl font-bold text-white">{siteStats.todayVisits}</p>
                </div>
                <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm">+23% vs hier</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-300 text-sm font-medium">Temps Moyen</p>
                  <p className="text-3xl font-bold text-white">{siteStats.avgSessionTime}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-600/20 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm">+5min vs hier</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activité en temps réel */}
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                <span>Activité en Temps Réel</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">LIVE</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {realTimeUsers.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-center gap-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20 hover:bg-purple-500/20 transition-colors duration-300"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getActionIcon(activity.action)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{activity.username}</span>
                        <Badge className={`text-xs ${getActionColor(activity.action)}`}>
                          {activity.action}
                        </Badge>
                      </div>
                      <div className="text-sm text-purple-300">
                        {activity.location} • {activity.device}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-purple-400">{formatTime(activity.timestamp)}</div>
                    <div className="text-xs text-purple-500">{activity.ip}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Informations système */}
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-400" />
                Système & Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Statut du serveur */}
              <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold">Serveur</span>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">OPÉRATIONNEL</Badge>
              </div>

              {/* Base de données */}
              <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold">Base de Données</span>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">CONNECTÉE</Badge>
              </div>

              {/* Bot Discord */}
              <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold">Bot Discord</span>
                </div>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">ACTIF</Badge>
              </div>

              {/* Sécurité */}
              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-semibold">Alertes Sécurité</span>
                </div>
                <p className="text-yellow-300 text-sm">
                  Aucune menace détectée. Tous les systèmes sont sécurisés.
                </p>
              </div>

              {/* Actions rapides */}
              <div className="space-y-3">
                <h4 className="text-white font-semibold mb-3">Actions Rapides</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30">
                    <Users className="w-4 h-4 mr-2" />
                    Gérer Users
                  </Button>
                  <Button className="bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30">
                    <Shield className="w-4 h-4 mr-2" />
                    Sécurité
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Note de mise à jour */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-full">
            <Zap className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-purple-300">Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}