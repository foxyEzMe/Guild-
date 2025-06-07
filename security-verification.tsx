import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Lock, Eye, EyeOff, Sparkles, Zap } from 'lucide-react';
import * as THREE from 'three';

const securitySchema = z.object({
  username: z.string().min(1, "Nom d'utilisateur requis"),
  securityAnswer: z.string().min(1, "Réponse de sécurité requise"),
});

type SecurityFormData = z.infer<typeof securitySchema>;

export default function SecurityVerification() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const { toast } = useToast();

  const form = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      username: "",
      securityAnswer: "",
    },
  });

  // Animation 3D du background
  useEffect(() => {
    if (!canvasRef.current) return;

    // Configuration de la scène 3D
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Création du tunnel de particules 3D
    const geometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position en spirale
      const angle = (i / particleCount) * Math.PI * 20;
      const radius = (i / particleCount) * 2;
      
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = Math.sin(angle) * radius;
      positions[i3 + 2] = (i / particleCount) * 10 - 5;

      // Couleurs dégradées
      const hue = (i / particleCount) * 0.3 + 0.5;
      const color = new THREE.Color().setHSL(hue, 1, 0.8);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    camera.position.z = 3;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      particleSystem.rotation.z += 0.005;
      particleSystem.rotation.y += 0.01;
      
      renderer.render(scene, camera);
    };
    animate();

    // Gestion du redimensionnement
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

  // Génération de particules pour l'interface
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 2,
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  const onSubmit = async (data: SecurityFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/verify-security", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur de vérification");
      }

      const result = await response.json();
      
      toast({
        title: "🎉 Vérification réussie !",
        description: result.message,
        variant: "default",
      });

      // Redirection vers l'accueil après vérification
      setTimeout(() => {
        setLocation("/");
      }, 1500);

    } catch (error: any) {
      toast({
        title: "❌ Erreur de vérification",
        description: error.message || "Réponse de sécurité incorrecte",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Canvas 3D Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: 'transparent' }}
      />

      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden z-10">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Contenu principal */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Carte de vérification */}
          <motion.div
            className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 shadow-2xl"
            whileHover={{ 
              boxShadow: "0 0 50px rgba(6, 182, 212, 0.3)",
              scale: 1.02,
            }}
            transition={{ duration: 0.3 }}
          >
            {/* En-tête avec icône animée */}
            <motion.div
              className="text-center mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.div
                className="mx-auto w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mb-4"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Shield className="w-10 h-10 text-white" />
              </motion.div>
              
              <motion.h1
                className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                VÉRIFICATION DE SÉCURITÉ
              </motion.h1>
              
              <motion.p
                className="text-gray-300 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Confirmez votre identité pour accéder à S.L.Z Guild
              </motion.p>
            </motion.div>

            {/* Formulaire */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <Label htmlFor="username" className="text-cyan-300 font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Nom d'utilisateur
                </Label>
                <Input
                  {...form.register('username')}
                  id="username"
                  className="mt-2 bg-slate-800/50 border-cyan-500/30 text-white focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-300"
                  placeholder="Entrez votre nom d'utilisateur"
                />
                {form.formState.errors.username && (
                  <p className="text-red-400 text-sm mt-1">{form.formState.errors.username.message}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <Label htmlFor="securityAnswer" className="text-purple-300 font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Réponse de sécurité
                </Label>
                <div className="relative mt-2">
                  <Input
                    {...form.register('securityAnswer')}
                    id="securityAnswer"
                    type={showAnswer ? "text" : "password"}
                    className="bg-slate-800/50 border-purple-500/30 text-white focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300 pr-12"
                    placeholder="Entrez votre réponse de sécurité"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={() => setShowAnswer(!showAnswer)}
                  >
                    {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {form.formState.errors.securityAnswer && (
                  <p className="text-red-400 text-sm mt-1">{form.formState.errors.securityAnswer.message}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50"
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Zap className="w-4 h-4" />
                        </motion.div>
                        Vérification en cours...
                      </motion.div>
                    ) : (
                      <motion.span
                        key="verify"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        VÉRIFIER MON IDENTITÉ
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </form>

            {/* Lien retour */}
            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              <Button
                variant="ghost"
                onClick={() => setLocation('/login')}
                className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
              >
                ← Retour à la connexion
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Effet de lueur animée */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}