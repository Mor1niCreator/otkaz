'use client';

import { motion } from 'framer-motion';

interface ComicTextProps {
  children: React.ReactNode;
  variant?: 'pow' | 'boom' | 'zap' | 'hero' | 'normal';
  className?: string;
  animate?: boolean;
}

export default function ComicText({ 
  children, 
  variant = 'normal',
  className = '',
  animate = true 
}: ComicTextProps) {
  const variants = {
    pow: {
      className: 'text-4xl md:text-6xl text-comic-yellow uppercase',
      style: {
        fontFamily: "'Bungee Shade', 'Bangers', cursive, sans-serif",
        fontWeight: 400,
        textShadow: '5px 5px 0px #000, 10px 10px 0px rgba(255, 107, 53, 0.5)',
        WebkitTextStroke: '2px #000',
        transform: 'rotate(-8deg) scaleY(1.1)',
        letterSpacing: '0.1em',
      },
    },
    boom: {
      className: 'text-5xl md:text-7xl uppercase',
      style: {
        fontFamily: "'Shrikhand', 'Russo One', cursive, sans-serif",
        fontWeight: 400,
        background: 'linear-gradient(135deg, #FF006E 0%, #FF6B35 50%, #FFE030 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(5px 5px 0px #000)',
        letterSpacing: '0.08em',
        transform: 'scaleY(1.15) rotate(3deg)',
      },
    },
    zap: {
      className: 'text-4xl md:text-6xl text-comic-cyan uppercase',
      style: {
        fontFamily: "'Bungee Inline', 'Bangers', cursive, sans-serif",
        fontWeight: 400,
        textShadow: '5px 5px 0px #000, 0 0 25px rgba(6, 255, 240, 0.9)',
        WebkitTextStroke: '3px #000',
        letterSpacing: '0.12em',
        transform: 'skewX(-5deg)',
      },
    },
    hero: {
      className: 'text-3xl md:text-5xl uppercase',
      style: {
        fontFamily: "'Bangers', 'Russo One', cursive, sans-serif",
        fontWeight: 400,
        background: 'linear-gradient(135deg, #8338EC 0%, #FF006E 50%, #FF6B35 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(4px 4px 0px #000)',
        letterSpacing: '0.05em',
        transform: 'scaleY(1.1)',
      },
    },
    normal: {
      className: 'font-bold',
      style: {
        fontFamily: "'Chewy', 'Russo One', cursive, sans-serif",
        fontWeight: 400,
      },
    },
  };

  const currentVariant = variants[variant];

  if (!animate) {
    return (
      <span 
        className={`${currentVariant.className} ${className}`}
        style={currentVariant.style}
      >
        {children}
      </span>
    );
  }

  const animations = {
    pow: {
      initial: { scale: 0, rotate: -45 },
      animate: { scale: 1, rotate: -5 },
      transition: { type: 'spring', stiffness: 300, damping: 15 },
    },
    boom: {
      initial: { scale: 0, y: -100 },
      animate: { scale: 1, y: 0 },
      transition: { type: 'spring', stiffness: 200, damping: 10 },
    },
    zap: {
      initial: { scale: 0, x: -100 },
      animate: { scale: 1, x: 0 },
      transition: { type: 'spring', stiffness: 400, damping: 12 },
    },
    hero: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    normal: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3 },
    },
  };

  const anim = animations[variant];

  return (
    <motion.span
      className={`${currentVariant.className} ${className} inline-block`}
      style={currentVariant.style}
      initial={anim.initial}
      animate={anim.animate}
      transition={anim.transition}
    >
      {children}
    </motion.span>
  );
}
