interface DiscordAvatarProps {
  userId: string;
  avatar: string | null;
  username: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function DiscordAvatar({ userId, avatar, username, size = 'md', className = '' }: DiscordAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const getAvatarUrl = () => {
    if (avatar) {
      // Support des avatars animés (GIF) pour Discord
      const extension = avatar.startsWith('a_') ? 'gif' : 'png';
      return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.${extension}?size=256`;
    }
    // Fallback to default Discord avatar
    const defaultAvatarId = (parseInt(userId) >> 22) % 6;
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarId}.png`;
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative overflow-hidden rounded-full group`}>
      {/* Bordure néon animée */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-electric-blue rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse-slow"></div>
      
      {/* Conteneur de l'image */}
      <div className="relative bg-dark-surface rounded-full overflow-hidden">
        <img
          src={getAvatarUrl()}
          alt={`Avatar de ${username}`}
          className="w-full h-full object-cover transition-all duration-500 hover:scale-110 hover:rotate-3"
          onError={(e) => {
            // En cas d'erreur, utiliser l'avatar par défaut
            const target = e.target as HTMLImageElement;
            const defaultAvatarId = (parseInt(userId) >> 22) % 6;
            target.src = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarId}.png`;
          }}
        />
        
        {/* Overlay lumineux au survol */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-transparent to-electric-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
        
        {/* Particules brillantes */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-neon-purple rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
      </div>
    </div>
  );
}