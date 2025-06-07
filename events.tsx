import { Calendar, Clock, Users, MapPin, Star, Trophy, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Events() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Raid Epic Boss",
      description: "Affrontons le boss légendaire Darkoth dans les Shadowlands",
      date: "2025-01-28",
      time: "20:00",
      participants: 15,
      maxParticipants: 20,
      type: "raid",
      difficulty: "Expert",
      rewards: ["+500 XP", "Loot Épique", "Titre Spécial"]
    },
    {
      id: 2,
      title: "Tournoi PvP",
      description: "Championnat mensuel de la guilde - Battle Royale",
      date: "2025-01-30",
      time: "19:30",
      participants: 8,
      maxParticipants: 16,
      type: "pvp",
      difficulty: "Hardcore",
      rewards: ["1000 Robux", "Badge Champion", "Rang VIP"]
    },
    {
      id: 3,
      title: "Exploration Collective",
      description: "Découverte du nouveau monde mystérieux d'Astralion",
      date: "2025-02-02",
      time: "18:00",
      participants: 12,
      maxParticipants: 25,
      type: "exploration",
      difficulty: "Intermédiaire",
      rewards: ["Monture Rare", "+300 XP", "Cosmétiques"]
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'raid': return <Trophy className="w-5 h-5" />;
      case 'pvp': return <Zap className="w-5 h-5" />;
      case 'exploration': return <MapPin className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'raid': return 'from-red-500 to-orange-500';
      case 'pvp': return 'from-purple-500 to-pink-500';
      case 'exploration': return 'from-green-500 to-blue-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 bg-gradient-to-br from-black via-purple-900/20 to-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 via-sky-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            ÉVÉNEMENTS
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Rejoignez-nous pour des aventures épiques et des défis légendaires
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="group bg-black/40 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getEventColor(event.type)}`}></div>
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getEventColor(event.type)} text-white`}>
                    {getEventIcon(event.type)}
                  </div>
                  <Badge variant="outline" className="border-purple-400/50 text-purple-300">
                    {event.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-white group-hover:text-purple-300 transition-colors">
                  {event.title}
                </CardTitle>
                <p className="text-white/70 text-sm leading-relaxed">
                  {event.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-sky-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-purple-400">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-green-400">
                    <Users className="w-4 h-4" />
                    <span>{event.participants}/{event.maxParticipants}</span>
                  </div>
                  <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
                      style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-white/90">Récompenses :</h4>
                  <div className="flex flex-wrap gap-1">
                    {event.rewards.map((reward, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                        {reward}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-sky-600 hover:from-purple-700 hover:to-sky-700 text-white font-semibold py-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  <Star className="w-4 h-4 mr-2" />
                  Participer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-purple-500/10 to-sky-500/10 border-purple-400/30 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Envie de proposer un événement ?</h3>
              <p className="text-white/70 mb-6">Contactez les administrateurs sur Discord pour organiser votre propre événement !</p>
              <Button className="bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-700 hover:to-purple-700 text-white font-semibold px-8 py-3 transition-all duration-300 transform hover:scale-105">
                Proposer un Événement
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}