import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface MusicPlayerProps {
  audioUrl?: string;
  autoPlay?: boolean;
  className?: string;
}

export function MusicPlayer({ 
  audioUrl = "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", 
  autoPlay = false,
  className = ""
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([0.5]);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialiser l'audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Configuration de l'audio
    audio.loop = true;
    audio.volume = volume[0];
    audio.preload = "auto";

    // Events listeners
    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume]);

  // Gérer le volume
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume[0];
    }
  }, [volume, isMuted]);

  // Fonction pour basculer lecture/pause
  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (!hasUserInteracted) {
        setHasUserInteracted(true);
      }

      if (isPlaying) {
        await audio.pause();
      } else {
        await audio.play();
      }
    } catch (error) {
      console.warn('Erreur lors de la lecture audio:', error);
    }
  };

  // Fonction pour basculer le son
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Fonction pour changer le volume
  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    if (newVolume[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Audio element */}
      <audio ref={audioRef} preload="auto">
        <source src={audioUrl} type="audio/mpeg" />
        <source src="/assets/audio/background-music.mp3" type="audio/mpeg" />
        Votre navigateur ne supporte pas l'audio HTML5.
      </audio>

      {/* Lecteur audio compact */}
      <div className="relative group">
        {/* Bordure néon animée */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-electric-blue rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse-slow"></div>
        
        <div className="relative bg-black/90 backdrop-blur-xl p-4 rounded-2xl border border-neon-purple/30 shadow-2xl">
          {/* Contrôles principaux */}
          <div className="flex items-center space-x-3">
            {/* Bouton Play/Pause */}
            <Button
              onClick={togglePlayPause}
              disabled={!isLoaded}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-purple to-electric-blue hover:from-electric-blue hover:to-neon-purple transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-neon-purple/50"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-0.5" />
              )}
            </Button>

            {/* Contrôles de volume */}
            <div className="flex items-center space-x-2 min-w-[120px]">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="w-8 h-8 rounded-full p-0 text-neon-purple hover:text-electric-blue hover:bg-neon-purple/20 transition-colors duration-300"
              >
                {isMuted || volume[0] === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>

              {/* Slider de volume */}
              <div className="flex-1">
                <Slider
                  value={volume}
                  onValueChange={handleVolumeChange}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Indicateur de statut */}
          <div className="mt-2 text-center">
            <span className="text-xs text-light-gray">
              {!hasUserInteracted ? (
                "Cliquez pour lancer la musique"
              ) : !isLoaded ? (
                "Chargement de la musique..."
              ) : isPlaying ? (
                <span className="text-electric-blue animate-pulse">♪ Musique en cours ♪</span>
              ) : (
                "Musique en pause"
              )}
            </span>
          </div>

          {/* Effet sonore visuel */}
          {isPlaying && (
            <div className="absolute -top-2 -right-2 flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-electric-blue rounded-full animate-bounce"
                  style={{
                    height: `${8 + Math.random() * 8}px`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '0.8s'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}