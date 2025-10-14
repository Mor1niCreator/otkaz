'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ComicTagProps {
  icon: string;
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  isSelected?: boolean;
  onClick?: () => void;
  count?: number;
  animate?: boolean;
}

export default function ComicTag({
  icon,
  name,
  color,
  size = 'md',
  isSelected = false,
  onClick,
  count,
  animate = true,
}: ComicTagProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const iconSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <motion.div
      className={`
        ${sizeClasses[size]} 
        ${color}
        rounded-xl border-4 border-black font-black
        flex items-center gap-2 cursor-pointer
        transition-all duration-200
        ${isSelected ? 'shadow-comic-lg scale-105' : 'shadow-comic'}
        ${isHovered ? 'scale-110 rotate-2' : ''}
        relative overflow-hidden
      `}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={animate ? { scale: 1.1, rotate: 2 } : {}}
      whileTap={animate ? { scale: 0.95, rotate: -2 } : {}}
      initial={animate ? { scale: 0, rotate: -180 } : {}}
      animate={animate ? { scale: 1, rotate: 0 } : {}}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      {/* Comic effect lines */}
      {isHovered && (
        <>
          <motion.div
            className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-full opacity-70"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-1 -right-1 w-2 h-2 bg-white rounded-full opacity-70"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
          />
        </>
      )}

      {/* Icon with animation */}
      <motion.span
        className={`${iconSizes[size]} filter drop-shadow-lg`}
        animate={isHovered ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.span>

      {/* Text */}
      <div className="relative">
        <span className="relative z-10">{name}</span>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-yellow-300 opacity-30 -z-10"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* Count badge */}
      {count !== undefined && (
        <motion.span
          className="ml-auto bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-black"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
        >
          {count}
        </motion.span>
      )}

      {/* Selection checkmark */}
      {isSelected && (
        <motion.div
          className="ml-auto text-2xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          ✓
        </motion.div>
      )}

      {/* POW effect on click */}
      {isHovered && animate && (
        <motion.div
          className="absolute -top-8 -right-8 text-yellow-400 font-black text-2xl transform -rotate-12"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{ textShadow: '2px 2px 0px black, -2px -2px 0px black, 2px -2px 0px black, -2px 2px 0px black' }}
        >
          ★
        </motion.div>
      )}
    </motion.div>
  );
}
