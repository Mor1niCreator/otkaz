'use client';

import { motion } from 'framer-motion';

interface ComicBadgeProps {
  icon: string;
  text: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  effect?: 'pow' | 'boom' | 'zap' | 'star' | 'none';
}

export default function ComicBadge({ 
  icon, 
  text, 
  color = 'bg-comic-yellow', 
  size = 'md',
  effect = 'none' 
}: ComicBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const getEffectEmoji = () => {
    switch (effect) {
      case 'pow': return '💥';
      case 'boom': return '💣';
      case 'zap': return '⚡';
      case 'star': return '✨';
      default: return null;
    }
  };

  return (
    <motion.div
      className="relative inline-block"
      whileHover={{ scale: 1.05, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Main badge */}
      <div
        className={`
          ${color} ${sizeClasses[size]}
          rounded-full border border-gray-200
          font-semibold shadow-comic
          flex items-center gap-1.5
          relative
        `}
        style={{
          textShadow: '1px 1px 0px rgba(0,0,0,0.2)',
        }}
      >
        <span className={iconSizes[size]}>{icon}</span>
        <span>{text}</span>
      </div>

      {/* Effect emoji */}
      {effect !== 'none' && (
        <motion.span
          className="absolute -top-2 -right-2 text-xl"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 15, 0]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        >
          {getEffectEmoji()}
        </motion.span>
      )}
    </motion.div>
  );
}
