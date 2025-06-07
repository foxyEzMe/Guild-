import { BADGES } from '@shared/levels';
import { motion } from 'framer-motion';

interface BadgeDisplayProps {
  badges: string[];
  size?: 'sm' | 'md' | 'lg';
  limit?: number;
}

export function BadgeDisplay({ badges, size = 'md', limit = 6 }: BadgeDisplayProps) {
  const displayBadges = badges.slice(0, limit);
  const remainingCount = badges.length - limit;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {displayBadges.map((badgeId, index) => {
        const badge = BADGES.find(b => b.id === badgeId);
        if (!badge) return null;

        return (
          <motion.div
            key={badgeId}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.15, y: -3 }}
            className={`
              inline-flex items-center gap-1 rounded-full font-semibold
              bg-gradient-to-r ${badge.gradient}
              text-white shadow-xl border border-white/30
              transition-all duration-300 transform hover:shadow-glow-${badge.color}
              ${sizeClasses[size]}
              cursor-pointer
            `}
            title={badge.description}
          >
            <span className="text-lg">{badge.icon}</span>
            <span className="hidden sm:inline">{badge.name}</span>
          </motion.div>
        );
      })}
      
      {remainingCount > 0 && (
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className={`
            inline-flex items-center rounded-full font-semibold
            bg-gradient-to-r from-slate-600 to-slate-700
            text-white shadow-lg border border-white/20 cursor-pointer
            ${sizeClasses[size]}
          `}
          title="Voir plus de badges"
        >
          <span className="flex items-center gap-1">
            <span>+{remainingCount}</span>
            <span className="hidden sm:inline">badges</span>
          </span>
        </motion.div>
      )}
    </div>
  );
}

export function LevelBadge({ level, rank }: { level: number; rank: string }) {
  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'RANG E': return 'from-gray-400 to-gray-600';
      case 'RANG D': return 'from-green-400 to-green-600';
      case 'RANG C': return 'from-blue-400 to-blue-600';
      case 'RANG B': return 'from-purple-400 to-purple-600';
      case 'RANG A': return 'from-yellow-400 to-yellow-600';
      case 'RANG S': return 'from-red-400 to-red-600';
      case 'RANG SS': return 'from-pink-400 to-pink-600';
      case 'RANG SSS': return 'from-purple-500 via-pink-500 to-purple-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className={`
      inline-flex items-center gap-2 px-3 py-1 rounded-full
      bg-gradient-to-r ${getRankColor(rank)}
      text-white font-bold text-sm shadow-lg
      border border-white/30
    `}>
      <span className="text-lg">⭐</span>
      <span>Lvl {level}</span>
      <span className="hidden sm:inline">• {rank}</span>
    </div>
  );
}