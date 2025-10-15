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
        rounded-2xl border-2 border-gray-200 font-semibold uppercase
        flex items-center gap-2 cursor-pointer
        transition-all duration-200
        ${isSelected ? 'shadow-comic-xl' : 'shadow-comic'}
        relative overflow-hidden
      `}
      style={{
        textShadow: '1px 1px 0px rgba(0,0,0,0.3)',
      }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={animate ? { scale: 1.15, rotate: 3, y: -5 } : {}}
      whileTap={animate ? { scale: 0.9, rotate: -3 } : {}}
      initial={animate ? { scale: 0, rotate: -180, opacity: 0 } : {}}
      animate={animate ? { scale: 1, rotate: 0, opacity: 1 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      {/* Inner shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-black/10 pointer-events-none rounded-2xl"
        initial={{ opacity: 0.3 }}
        animate={isHovered ? { opacity: 0.6 } : { opacity: 0.3 }}
      />

      {/* Halftone dots overlay */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-2xl opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)',
          backgroundSize: '8px 8px',
        }}
      />

      {/* Sparkle effects on hover */}
      {isHovered && (
        <>
          <motion.div
            className="absolute -top-2 -right-2 text-2xl"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 0.6 }}
          >
            ✨
          </motion.div>
          <motion.div
            className="absolute -bottom-2 -left-2 text-xl"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1.2, 1], rotate: [0, -180, -360] }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            💫
          </motion.div>
        </>
      )}

      {/* Icon with animation */}
      <motion.span
        className={`${iconSizes[size]} relative z-10`}
        style={{
          filter: 'drop-shadow(3px 3px 0px rgba(0,0,0,0.5))',
        }}
        animate={isHovered ? { 
          rotate: [0, -15, 15, -10, 10, 0], 
          scale: [1, 1.3, 1.2, 1.3, 1] 
        } : {}}
        transition={{ duration: 0.6 }}
      >
        {icon}
      </motion.span>

      {/* Text */}
      <div className="relative z-10">
        <motion.span
          animate={isHovered ? { 
            letterSpacing: '0.05em',
          } : {}}
          transition={{ duration: 0.2 }}
        >
          {name}
        </motion.span>
      </div>

      {/* Count badge */}
      {count !== undefined && (
        <motion.span
          className="ml-auto bg-black text-comic-yellow rounded-full w-7 h-7 flex items-center justify-center text-xs font-semibold border-2 border-comic-yellow relative z-10"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
        >
          {count}
        </motion.span>
      )}

      {/* Selection checkmark with POW effect */}
      {isSelected && (
        <motion.div
          className="ml-auto text-3xl relative z-10"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          style={{
            filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.5))',
          }}
        >
          ✓
        </motion.div>
      )}
    </motion.div>
  );
}
