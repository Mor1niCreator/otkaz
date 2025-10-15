'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ComicEffectsProps {
  show: boolean;
  type?: 'pow' | 'boom' | 'zap' | 'star' | 'sparkles';
  position?: { x: number; y: number } | 'center';
}

export function ComicExplosion({ show, type = 'pow', position = 'center' }: ComicEffectsProps) {
  const effects = {
    pow: {
      text: 'POW!',
      colors: ['#FFE030', '#FF6B35', '#FF006E'],
      rotation: -12,
    },
    boom: {
      text: 'BOOM!',
      colors: ['#FF006E', '#8338EC', '#3A86FF'],
      rotation: 8,
    },
    zap: {
      text: 'ZAP!',
      colors: ['#06FFF0', '#3A86FF', '#8338EC'],
      rotation: -5,
    },
    star: {
      text: '★',
      colors: ['#FFE030', '#CCFF00', '#06D6A0'],
      rotation: 0,
    },
    sparkles: {
      text: '✨',
      colors: ['#FFE030', '#FF10F0', '#00F5FF'],
      rotation: 0,
    },
  };

  const effect = effects[type];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Main explosion text */}
          <motion.div
            className="relative"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: [0, 1.5, 1],
              rotate: [effect.rotation - 180, effect.rotation + 20, effect.rotation]
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div
              className="text-8xl font-semibold uppercase"
              style={{
                color: effect.colors[0],
                textShadow: `
                  6px 6px 0px #000,
                  -2px -2px 0px #000,
                  2px -2px 0px #000,
                  -2px 2px 0px #000,
                  0 0 30px ${effect.colors[1]}
                `,
                WebkitTextStroke: '3px #000',
                transform: `rotate(${effect.rotation}deg)`,
              }}
            >
              {effect.text}
            </div>
          </motion.div>

          {/* Radiating lines */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 bg-black"
              style={{
                height: '60px',
                left: '50%',
                top: '50%',
                transformOrigin: 'top center',
                rotate: `${i * 30}deg`,
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ 
                scaleY: [0, 1, 0.8],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 0.6,
                delay: 0.1 + i * 0.02,
                ease: 'easeOut'
              }}
            />
          ))}

          {/* Explosion circles */}
          {effect.colors.map((color, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 border-gray-200"
              style={{
                width: 100 + i * 50,
                height: 100 + i * 50,
                backgroundColor: color,
                opacity: 0.3,
              }}
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 2, 3],
                opacity: [0.5, 0.3, 0]
              }}
              transition={{ 
                duration: 0.8,
                delay: i * 0.1,
                ease: 'easeOut'
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ActionLines({ show, direction = 'right' }: { show: boolean; direction?: 'left' | 'right' | 'up' | 'down' }) {
  const directions = {
    right: { rotate: 0, x: [-100, 100] },
    left: { rotate: 180, x: [100, -100] },
    up: { rotate: 90, y: [100, -100] },
    down: { rotate: -90, y: [-100, 100] },
  };

  const dir = directions[direction];

  return (
    <AnimatePresence>
      {show && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 bg-black"
              style={{
                width: `${30 + Math.random() * 50}%`,
                top: `${10 + i * 12}%`,
                left: direction === 'right' ? 0 : 'auto',
                right: direction === 'left' ? 0 : 'auto',
                transform: `rotate(${dir.rotate}deg)`,
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ 
                scaleX: 1,
                opacity: [0, 0.6, 0],
                x: dir.x,
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.5,
                delay: i * 0.05,
                ease: 'easeOut'
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

export function SpeedLines({ intensity = 5 }: { intensity?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
      {[...Array(intensity)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-0.5 bg-black"
          style={{
            width: `${20 + Math.random() * 40}%`,
            top: `${Math.random() * 100}%`,
            left: 0,
          }}
          animate={{
            x: ['0%', '100%'],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

export function HalftonePattern({ color = 'black', size = 'md' }: { color?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: '6px 6px',
    md: '10px 10px',
    lg: '14px 14px',
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-10"
      style={{
        backgroundImage: `radial-gradient(circle, ${color} 1.5px, transparent 1.5px)`,
        backgroundSize: sizes[size],
      }}
    />
  );
}

export function ComicBurst({ show, color = '#FFE030' }: { show: boolean; color?: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="absolute inset-0 pointer-events-none">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                width: '4px',
                height: '40px',
                backgroundColor: color,
                transformOrigin: 'top center',
                rotate: `${i * 22.5}deg`,
                border: '2px solid #000',
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ 
                scaleY: [0, 1.5, 1],
                opacity: [0, 1, 0.8]
              }}
              exit={{ scaleY: 0, opacity: 0 }}
              transition={{ 
                duration: 0.5,
                delay: i * 0.02,
                ease: 'easeOut'
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
