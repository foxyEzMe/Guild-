import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Palette, Volume2, Vibrate, Save, Crown, Shield, Zap, Gamepad2 } from 'lucide-react';
import { useThemeCustomization } from '@/contexts/ThemeCustomizationContext';

export default function ProfileEnhanced() {
  const { user } = useAuth();
  const { theme, updateTheme, presetThemes, applyPreset } = useThemeCustomization();
  const [bannerImage, setBannerImage] = useState('/api/placeholder/800/200');
  const [profileImage, setProfileImage] = useState('');
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Sons d'interaction
  const playSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUeA0OY5PO2dyMFl29GyD8');
    audio.volume = 0.3;
    if (theme.soundEnabled) audio.play().catch(() => {});
  };

  const vibrate = () => {
    if (theme.vibrationsEnabled && navigator.vibrate) {
      navigator.vibrate([30, 20, 30]);
    }
  };

  const handleInteraction = () => {
    playSound();
    vibrate();
  };

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      handleInteraction();
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      handleInteraction();
    }
  };

  const colorPresets = [
    { name: 'Violet Gaming', colors: ['#8B5CF6', '#A855F7', '#EC4899'], key: 'purple' },
    { name: 'Rouge Feu', colors: ['#EF4444', '#F87171', '#FCA5A5'], key: 'red' },
    { name: 'Bleu Électrique', colors: ['#3B82F6', '#60A5FA', '#93C5FD'], key: 'blue' },
    { name: 'Vert Néon', colors: ['#10B981', '#34D399', '#6EE7B7'], key: 'green' },
    { name: 'Orange Cyber', colors: ['#F59E0B', '#FBBF24', '#FCD34D'], key: 'orange' },
    { name: 'Cyan Matrix', colors: ['#06B6D4', '#22D3EE', '#67E8F9'], key: 'cyan' },
  ];

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Bannière de profil avec overlay */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-900/20 to-black backdrop-blur-xl">
          {/* Image de bannière */}
          <div 
            className="h-48 bg-cover bg-center relative"
            style={{
              backgroundImage: `linear-gradient(45deg, ${theme.primaryColor}40, ${theme.secondaryColor}40), url(${bannerImage})`
            }}
          >
            {/* Overlay avec particules */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
              {/* Particules flottantes */}
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full animate-float opacity-60"
                  style={{
                    backgroundColor: theme.accentColor,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>

            {/* Bouton de changement de bannière */}
            <Button
              onClick={() => {
                handleInteraction();
                bannerInputRef.current?.click();
              }}
              className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm hover:bg-black/70 border border-purple-500/30"
              size="sm"
            >
              <Camera className="w-4 h-4 mr-2" />
              Changer la bannière
            </Button>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              className="hidden"
            />
          </div>

          {/* Profil utilisateur */}
          <CardContent className="relative -mt-16 pb-6">
            <div className="flex items-end space-x-6">
              {/* Avatar avec bordure néon */}
              <div className="relative group">
                <div 
                  className="absolute -inset-2 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"
                  style={{
                    background: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.secondaryColor}, ${theme.accentColor})`
                  }}
                />
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-black bg-black">
                  <img
                    src={profileImage || user.profileImageUrl || `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id) % 6}.png`}
                    alt={`Avatar de ${user.username}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Button
                    onClick={() => {
                      handleInteraction();
                      avatarInputRef.current?.click();
                    }}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    variant="ghost"
                  >
                    <Upload className="w-6 h-6 text-white" />
                  </Button>
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              {/* Informations utilisateur */}
              <div className="flex-1 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{user.username}</h1>
                  {user.isAdmin && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">
                      <Crown className="w-3 h-3 mr-1" />
                      ADMIN
                    </Badge>
                  )}
                  <Badge 
                    className="text-white border-0"
                    style={{ 
                      background: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                    }}
                  >
                    <Gamepad2 className="w-3 h-3 mr-1" />
                    GAMER
                  </Badge>
                </div>
                <p className="text-gray-300">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div 
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                  <span className="text-sm text-gray-400">En ligne</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onglets de personnalisation */}
        <Tabs defaultValue="themes" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/50 backdrop-blur-xl border border-purple-500/30">
            <TabsTrigger value="themes" onClick={handleInteraction}>
              <Palette className="w-4 h-4 mr-2" />
              Thèmes
            </TabsTrigger>
            <TabsTrigger value="sounds" onClick={handleInteraction}>
              <Volume2 className="w-4 h-4 mr-2" />
              Audio
            </TabsTrigger>
            <TabsTrigger value="effects" onClick={handleInteraction}>
              <Zap className="w-4 h-4 mr-2" />
              Effets
            </TabsTrigger>
          </TabsList>

          {/* Personnalisation des thèmes */}
          <TabsContent value="themes" className="space-y-4">
            <Card className="bg-black/50 backdrop-blur-xl border border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Thèmes Prédéfinis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {colorPresets.map((preset) => (
                    <Button
                      key={preset.key}
                      onClick={() => {
                        handleInteraction();
                        applyPreset(preset.key as 'purple' | 'red' | 'blue' | 'green' | 'orange' | 'cyan');
                      }}
                      className="h-20 p-4 group relative overflow-hidden border-2 border-transparent hover:border-white/30 transition-all duration-300"
                      style={{
                        background: `linear-gradient(45deg, ${preset.colors[0]}, ${preset.colors[1]}, ${preset.colors[2]})`
                      }}
                    >
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
                      <div className="relative z-10 text-white font-bold text-center">
                        {preset.name}
                      </div>
                      
                      {/* Indicateur de thème actif */}
                      {theme.primaryColor === preset.colors[0] && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse" />
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Couleurs personnalisées */}
            <Card className="bg-black/50 backdrop-blur-xl border border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Couleurs Personnalisées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="primary" className="text-white">Couleur Principale</Label>
                    <Input
                      id="primary"
                      type="color"
                      value={theme.primaryColor}
                      onChange={(e) => {
                        handleInteraction();
                        updateTheme({ primaryColor: e.target.value });
                      }}
                      className="h-12 bg-black/50 border border-purple-500/30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondary" className="text-white">Couleur Secondaire</Label>
                    <Input
                      id="secondary"
                      type="color"
                      value={theme.secondaryColor}
                      onChange={(e) => {
                        handleInteraction();
                        updateTheme({ secondaryColor: e.target.value });
                      }}
                      className="h-12 bg-black/50 border border-purple-500/30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accent" className="text-white">Couleur d'Accent</Label>
                    <Input
                      id="accent"
                      type="color"
                      value={theme.accentColor}
                      onChange={(e) => {
                        handleInteraction();
                        updateTheme({ accentColor: e.target.value });
                      }}
                      className="h-12 bg-black/50 border border-purple-500/30"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paramètres audio */}
          <TabsContent value="sounds">
            <Card className="bg-black/50 backdrop-blur-xl border border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Paramètres Audio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sounds" className="text-white">Effets Sonores</Label>
                  <Button
                    onClick={() => {
                      handleInteraction();
                      updateTheme({ soundEnabled: !theme.soundEnabled });
                    }}
                    variant={theme.soundEnabled ? "default" : "outline"}
                    className={theme.soundEnabled ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    {theme.soundEnabled ? "Activé" : "Désactivé"}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="vibrations" className="text-white">Vibrations</Label>
                  <Button
                    onClick={() => {
                      handleInteraction();
                      updateTheme({ vibrationsEnabled: !theme.vibrationsEnabled });
                    }}
                    variant={theme.vibrationsEnabled ? "default" : "outline"}
                    className={theme.vibrationsEnabled ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    {theme.vibrationsEnabled ? "Activé" : "Désactivé"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Effets visuels */}
          <TabsContent value="effects">
            <Card className="bg-black/50 backdrop-blur-xl border border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Effets Visuels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Type d'Arrière-plan</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {['gradient', 'particle', 'cosmic'].map((type) => (
                      <Button
                        key={type}
                        onClick={() => {
                          handleInteraction();
                          updateTheme({ backgroundType: type as 'gradient' | 'particle' | 'cosmic' });
                        }}
                        variant={theme.backgroundType === type ? "default" : "outline"}
                        className="capitalize"
                      >
                        {type === 'gradient' && 'Dégradé'}
                        {type === 'particle' && 'Particules'}
                        {type === 'cosmic' && 'Cosmique'}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Aperçu en temps réel */}
        <Card className="bg-black/50 backdrop-blur-xl border border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Aperçu des Modifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="h-32 rounded-lg relative overflow-hidden"
              style={{
                background: `linear-gradient(45deg, ${theme.primaryColor}, ${theme.secondaryColor}, ${theme.accentColor})`
              }}
            >
              <div className="absolute inset-0 bg-black/30">
                {/* Particules d'aperçu */}
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full animate-float opacity-60"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`
                    }}
                  />
                ))}
              </div>
              <div className="relative z-10 flex items-center justify-center h-full">
                <span className="text-white font-bold text-lg">Aperçu du Thème</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}