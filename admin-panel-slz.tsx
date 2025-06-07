import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { 
  Crown, Users, Shield, Settings, BarChart3, Zap, Target, 
  UserCheck, UserX, Ban, Award, Star, AlertTriangle,
  Activity, TrendingUp, Eye, Edit, Trash2, Plus
} from 'lucide-react';
import * as THREE from 'three';

interface AdminUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isAdmin: boolean;
  isVerified: boolean;
  createdAt: string;
  lastActive: string;
}

interface GuildStatistic {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
}

export default function AdminPanelSLZ() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animation 3D du background admin
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Création d'un réseau de connexions 3D
    const geometry = new THREE.BufferGeometry();
    const nodeCount = 50;
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.2, 0.8, 0.7);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });

    const network = new THREE.Points(geometry, material);
    scene.add(network);

    // Lignes de connexion
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.random() < 0.1) {
          linePositions.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
          linePositions.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
        }
      }
    }

    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.2 });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    camera.position.z = 15;

    const animate = () => {
      requestAnimationFrame(animate);
      network.rotation.y += 0.002;
      network.rotation.x += 0.001;
      lines.rotation.y += 0.002;
      lines.rotation.x += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  const guildStats: GuildStatistic[] = [
    {
      label: "Membres Totaux",
      value: "1,247",
      change: "+24",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-cyan-500"
    },
    {
      label: "Membres Actifs",
      value: "892",
      change: "+12",
      trend: "up", 
      icon: Activity,
      color: "from-green-500 to-emerald-500"
    },
    {
      label: "Victoires Totales",
      value: "8,429",
      change: "+156",
      trend: "up",
      icon: Target,
      color: "from-yellow-500 to-orange-500"
    },
    {
      label: "Taux de Réussite",
      value: "94.7%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500"
    }
  ];

  const mockUsers: AdminUser[] = [
    {
      id: "95czHJPeTA-rqbQR5Vh31",
      username: "404",
      firstName: "Admin",
      lastName: "404",
      email: "admin404@slzguild.com",
      role: "admin",
      isAdmin: true,
      isVerified: true,
      createdAt: "2024-01-15",
      lastActive: "Il y a 5 min"
    },
    {
      id: "1WunHJxBKJw6UAjyH5Bix",
      username: "yuki",
      firstName: "Yuki",
      lastName: "Admin",
      email: "yuki@slzguild.com",
      role: "admin",
      isAdmin: true,
      isVerified: true,
      createdAt: "2024-01-10",
      lastActive: "En ligne"
    }
  ];

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const handleUserAction = (userId: string, action: string) => {
    console.log(`Action ${action} pour l'utilisateur ${userId}`);
    // Ici vous pourriez implémenter les actions réelles
  };

  const StatCard = ({ stat, index }: { stat: GuildStatistic, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -30 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ scale: 1.02, rotateY: 5 }}
    >
      <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-400' : 
                  stat.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {stat.change}
                </span>
                <span className="text-gray-500 text-sm ml-1">cette semaine</span>
              </div>
            </div>
            <motion.div
              className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center`}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <stat.icon className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Canvas 3D Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: 'transparent' }}
      />

      {/* Grille holographique */}
      <div
        className="absolute inset-0 z-10 opacity-20"
        style={{
          background: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Contenu principal */}
      <div className="relative z-20 min-h-screen p-6">
        {/* En-tête */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                PANNEAU D'ADMINISTRATION S.L.Z
              </h1>
              <p className="text-gray-400 mt-2">
                Bienvenue, {user?.firstName} - Contrôlez votre empire
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Bouton retour au site */}
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => window.location.href = '/'}
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-violet-600 hover:to-purple-600 text-white font-bold px-6 py-3 rounded-xl shadow-2xl border-0 transition-all duration-300"
                >
                  <motion.div
                    animate={{ x: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="mr-2"
                  >
                    ←
                  </motion.div>
                  Retour au Site
                </Button>
              </motion.div>
              
              <motion.div
                className="bg-gradient-to-r from-purple-600 to-violet-600 p-4 rounded-2xl"
                whileHover={{ scale: 1.05 }}
                animate={{ boxShadow: ["0 0 20px rgba(139, 92, 246, 0.3)", "0 0 40px rgba(139, 92, 246, 0.6)", "0 0 20px rgba(139, 92, 246, 0.3)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-12 h-12 text-white" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <TabsList className="bg-black/40 backdrop-blur-xl border border-purple-500/30 p-2 rounded-2xl">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:bg-purple-500/20">
                  <motion.div
                    animate={{ rotate: activeTab === 'dashboard' ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="mr-2"
                  >
                    <BarChart3 className="w-5 h-5" />
                  </motion.div>
                  Dashboard
                </TabsTrigger>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:bg-purple-500/20">
                  <motion.div
                    animate={{ scale: activeTab === 'users' ? [1, 1.1, 1] : 1 }}
                    transition={{ duration: 2, repeat: activeTab === 'users' ? Infinity : 0 }}
                    className="mr-2"
                  >
                    <Users className="w-5 h-5" />
                  </motion.div>
                  Utilisateurs
                </TabsTrigger>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <TabsTrigger value="security" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:bg-purple-500/20">
                  <motion.div
                    animate={{ rotateY: activeTab === 'security' ? [0, 180, 360] : 0 }}
                    transition={{ duration: 3, repeat: activeTab === 'security' ? Infinity : 0, ease: "linear" }}
                    className="mr-2"
                  >
                    <Shield className="w-5 h-5" />
                  </motion.div>
                  Sécurité
                </TabsTrigger>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:bg-purple-500/20">
                  <motion.div
                    animate={{ rotate: activeTab === 'settings' ? 360 : 0 }}
                    transition={{ duration: 4, repeat: activeTab === 'settings' ? Infinity : 0, ease: "linear" }}
                    className="mr-2"
                  >
                    <Settings className="w-5 h-5" />
                  </motion.div>
                  Paramètres
                </TabsTrigger>
              </motion.div>
            </TabsList>
          </motion.div>

          {/* Contenu Dashboard */}
          <TabsContent value="dashboard" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {guildStats.map((stat, index) => (
                <StatCard key={stat.label} stat={stat} index={index} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Graphique d'activité */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Activity className="w-6 h-6 mr-2 text-cyan-400" />
                      Activité des Membres
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-gray-400">
                        Graphique d'activité en temps réel
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Alertes système */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <Card className="bg-black/40 backdrop-blur-xl border-yellow-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <AlertTriangle className="w-6 h-6 mr-2 text-yellow-400" />
                      Alertes Système
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <motion.div
                        className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center">
                          <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
                          <div>
                            <p className="text-white font-semibold">Maintenance programmée</p>
                            <p className="text-gray-400 text-sm">Mise à jour prévue demain à 3h00</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Contenu Utilisateurs */}
          <TabsContent value="users" className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <Users className="w-6 h-6 mr-2 text-cyan-400" />
                      Gestion des Utilisateurs
                    </CardTitle>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-violet-600 hover:to-purple-600 text-white font-bold px-6 py-3 rounded-xl shadow-2xl border-0">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.div>
                        Ajouter Utilisateur
                      </Button>
                    </motion.div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user, index) => (
                      <motion.div
                        key={user.id}
                        className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        whileHover={{ scale: 1.01, x: 5 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <motion.div
                              className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <span className="text-white font-bold">
                                {user.firstName[0]}{user.lastName[0]}
                              </span>
                            </motion.div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="text-white font-semibold">{user.firstName} {user.lastName}</h3>
                                {user.isAdmin && (
                                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Admin
                                  </Badge>
                                )}
                                {user.isVerified && (
                                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                                    <UserCheck className="w-3 h-3 mr-1" />
                                    Vérifié
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm">@{user.username} • {user.email}</p>
                              <p className="text-gray-500 text-xs">Dernière activité: {user.lastActive}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <motion.button
                              className="p-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-600 rounded-xl transition-all duration-300 shadow-lg"
                              whileHover={{ scale: 1.1, rotateY: 10 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleUserAction(user.id, 'view')}
                            >
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              >
                                <Eye className="w-4 h-4 text-white" />
                              </motion.div>
                            </motion.button>
                            <motion.button
                              className="p-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-violet-600 hover:to-purple-600 rounded-xl transition-all duration-300 shadow-lg"
                              whileHover={{ scale: 1.1, rotateY: -10 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleUserAction(user.id, 'edit')}
                            >
                              <motion.div
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                              >
                                <Edit className="w-4 h-4 text-white" />
                              </motion.div>
                            </motion.button>
                            <motion.button
                              className="p-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-600 rounded-xl transition-all duration-300 shadow-lg"
                              whileHover={{ scale: 1.1, rotateX: 10 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleUserAction(user.id, 'ban')}
                            >
                              <motion.div
                                animate={{ rotateY: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                              >
                                <Ban className="w-4 h-4 text-white" />
                              </motion.div>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Contenu Sécurité */}
          <TabsContent value="security" className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <Card className="bg-black/40 backdrop-blur-xl border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="w-6 h-6 mr-2 text-red-400" />
                    Surveillance de Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg group hover:bg-green-500/20 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-white">Pare-feu Avancé</span>
                      </div>
                      <Badge className="bg-green-500 text-white group-hover:scale-110 transition-transform">Actif</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg group hover:bg-green-500/20 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-white">Protection DDoS</span>
                      </div>
                      <Badge className="bg-green-500 text-white group-hover:scale-110 transition-transform">Actif</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg group hover:bg-green-500/20 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-white">Chiffrement E2E</span>
                      </div>
                      <Badge className="bg-green-500 text-white group-hover:scale-110 transition-transform">Actif</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg group hover:bg-green-500/20 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-white">Audit Logs</span>
                      </div>
                      <Badge className="bg-green-500 text-white group-hover:scale-110 transition-transform">Actif</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg group hover:bg-yellow-500/20 transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                        <span className="text-white">Tentatives de connexion</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-xs">3 alertes</span>
                        <Badge className="bg-yellow-500 text-white group-hover:scale-110 transition-transform">Surveillé</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="w-6 h-6 mr-2 text-cyan-400" />
                    Logs de Sécurité Avancés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    <div className="text-sm p-3 bg-green-500/10 border border-green-500/30 rounded-lg group hover:bg-green-500/20 transition-all duration-300">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-white font-medium">Connexion réussie</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Success</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">admin404</span>
                        <span className="text-gray-500 text-xs">25 mai 2025, 14:32:15</span>
                      </div>
                    </div>
                    
                    <div className="text-sm p-3 bg-green-500/10 border border-green-500/30 rounded-lg group hover:bg-green-500/20 transition-all duration-300">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-white font-medium">Connexion réussie</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Success</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">yuki</span>
                        <span className="text-gray-500 text-xs">25 mai 2025, 14:30:42</span>
                      </div>
                    </div>
                    
                    <div className="text-sm p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg group hover:bg-yellow-500/20 transition-all duration-300">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                          <span className="text-white font-medium">Tentative de connexion échouée</span>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Alerte</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">IP: 192.168.1.100</span>
                        <span className="text-gray-500 text-xs">25 mai 2025, 14:28:33</span>
                      </div>
                    </div>
                    
                    <div className="text-sm p-3 bg-red-500/10 border border-red-500/30 rounded-lg group hover:bg-red-500/20 transition-all duration-300">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                          <span className="text-white font-medium">Tentative d'accès non autorisé</span>
                        </div>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Critique</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">IP: 45.33.xx.xx (Bloquée)</span>
                        <span className="text-gray-500 text-xs">25 mai 2025, 14:15:22</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Contenu Paramètres */}
          <TabsContent value="settings" className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Settings className="w-6 h-6 mr-2 text-cyan-400" />
                    Paramètres de la Guild
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <label className="text-white font-semibold mb-2 block">Nom de la Guild</label>
                      <Input 
                        defaultValue="S.L.Z Guild" 
                        className="bg-slate-800/50 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white font-semibold mb-2 block">Description</label>
                      <Input 
                        defaultValue="Guild d'élite pour les champions de Roblox" 
                        className="bg-slate-800/50 border-slate-700 text-white"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-violet-600 hover:to-purple-600 text-white font-bold px-8 py-3 rounded-xl shadow-2xl border-0">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            ✓
                          </motion.div>
                          Sauvegarder
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-bold px-8 py-3 rounded-xl shadow-2xl border-0">
                          <motion.div
                            animate={{ x: [-2, 2, -2] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="mr-2"
                          >
                            ✕
                          </motion.div>
                          Annuler
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Effet de scan holographique */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none"
        animate={{
          background: [
            'linear-gradient(0deg, transparent 0%, rgba(0,255,255,0.05) 50%, transparent 100%)',
            'linear-gradient(180deg, transparent 0%, rgba(0,255,255,0.05) 50%, transparent 100%)',
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}