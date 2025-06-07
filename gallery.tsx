import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Download, Eye, Camera, Trophy, Zap } from 'lucide-react';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const galleryItems = [
    {
      id: 1,
      title: "Victoire Épique contre Darkoth",
      category: "raid",
      author: "7yuki21",
      likes: 45,
      views: 230,
      date: "2025-01-20",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
      description: "Notre meilleure victoire contre le boss légendaire !"
    },
    {
      id: 2,
      title: "Tournoi PvP Championship",
      category: "pvp",
      author: "404dh",
      likes: 67,
      views: 412,
      date: "2025-01-18",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
      description: "Moments forts du championnat mensuel"
    },
    {
      id: 3,
      title: "Exploration des Terres Mystiques",
      category: "exploration",
      author: "EliteWarrior",
      likes: 38,
      views: 156,
      date: "2025-01-15",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
      description: "Découverte d'un nouveau territoire fantastique"
    },
    {
      id: 4,
      title: "Team Building Guilde",
      category: "guild",
      author: "TechMaster",
      likes: 52,
      views: 298,
      date: "2025-01-12",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
      description: "Moments de convivialité entre membres"
    },
    {
      id: 5,
      title: "Construction Base Épique",
      category: "building",
      author: "DesignPro",
      likes: 73,
      views: 445,
      date: "2025-01-10",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=600&fit=crop",
      description: "Notre nouvelle base fortifiée dans les cieux"
    },
    {
      id: 6,
      title: "Événement Spécial Halloween",
      category: "event",
      author: "7yuki21",
      likes: 89,
      views: 567,
      date: "2024-10-31",
      image: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=800&h=600&fit=crop",
      description: "Célébration d'Halloween avec costumes épiques"
    }
  ];

  const categories = [
    { id: 'all', name: 'Tout', icon: Camera },
    { id: 'raid', name: 'Raids', icon: Trophy },
    { id: 'pvp', name: 'PvP', icon: Zap },
    { id: 'exploration', name: 'Exploration', icon: Eye },
    { id: 'guild', name: 'Guilde', icon: Heart },
    { id: 'building', name: 'Construction', icon: Share2 },
    { id: 'event', name: 'Événements', icon: Download }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'raid': return 'from-red-500 to-orange-500';
      case 'pvp': return 'from-purple-500 to-pink-500';
      case 'exploration': return 'from-green-500 to-blue-500';
      case 'guild': return 'from-sky-500 to-cyan-500';
      case 'building': return 'from-yellow-500 to-orange-500';
      case 'event': return 'from-violet-500 to-purple-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 bg-gradient-to-br from-black via-purple-900/20 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 via-sky-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            GALERIE
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Revivez les moments épiques et les victoires légendaires d'Arise Crossover
          </p>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`
                  relative group px-6 py-3 transition-all duration-300 transform hover:scale-105
                  ${selectedCategory === category.id 
                    ? 'bg-gradient-to-r from-purple-600 to-sky-600 text-white shadow-lg' 
                    : 'bg-black/20 border-purple-400/30 text-white/70 hover:bg-purple-500/20 hover:border-purple-400/50'
                  }
                `}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {category.name}
                {selectedCategory === category.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-sky-600 opacity-20 rounded animate-pulse"></div>
                )}
              </Button>
            );
          })}
        </div>

        {/* Grille de la galerie */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <Card 
              key={item.id} 
              className="group bg-black/40 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Badge 
                  className={`absolute top-3 right-3 bg-gradient-to-r ${getCategoryColor(item.category)} text-white border-none`}
                >
                  {categories.find(c => c.id === item.category)?.name}
                </Badge>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-black/70 hover:bg-black/90 text-white border-none">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="bg-black/70 hover:bg-black/90 text-white border-none">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="bg-black/70 hover:bg-black/90 text-white border-none">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-red-400">
                      <Heart className="w-4 h-4" />
                      <span>{item.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sky-400">
                      <Eye className="w-4 h-4" />
                      <span>{item.views}</span>
                    </div>
                  </div>
                  <span className="text-white/50">{item.author}</span>
                </div>
                
                <div className="mt-2 text-xs text-white/40">
                  {new Date(item.date).toLocaleDateString('fr-FR')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <Camera className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl text-white/70 mb-2">Aucune image dans cette catégorie</h3>
            <p className="text-white/50">Revenez bientôt pour voir de nouveaux contenus !</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-purple-500/10 to-sky-500/10 border-purple-400/30 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Partagez vos moments épiques !</h3>
              <p className="text-white/70 mb-6">Envoyez vos captures d'écran sur Discord pour les voir apparaître dans la galerie</p>
              <Button className="bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-700 hover:to-purple-700 text-white font-semibold px-8 py-3 transition-all duration-300 transform hover:scale-105">
                <Camera className="w-4 h-4 mr-2" />
                Partager une Image
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}