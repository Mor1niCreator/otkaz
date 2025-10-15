'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface BoomAnimationProps {
  show: boolean;
  onComplete: () => void;
  text?: string;
  emoji?: string;
  type?: 'boom' | 'pow' | 'success';
}

export default function BoomAnimation({ 
  show, 
  onComplete, 
  text = 'SAVED!', 
  emoji = '💰',
  type = 'success'
}: BoomAnimationProps) {
  
  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Burst particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F5C61A 0%, #FFD93D 100%)',
                boxShadow: '0 0 10px rgba(245, 198, 26, 0.6)',
              }}
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                opacity: 0,
              }}
              animate={{
                x: Math.cos((i / 12) * Math.PI * 2) * 100,
                y: Math.sin((i / 12) * Math.PI * 2) * 100,
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
              }}
            />
          ))}

          {/* Main content */}
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 20,
            }}
            onAnimationComplete={() => {
              setTimeout(onComplete, 1000);
            }}
            className="relative"
          >
            {/* Glow background */}
            <motion.div
              className="absolute inset-0 -m-8"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.4 }}
              transition={{ duration: 0.4 }}
              style={{
                background: 'radial-gradient(circle, rgba(245, 198, 26, 0.6) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />

            {/* Card */}
            <div
              className="relative px-10 py-8 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 60px rgba(245, 198, 26, 0.3)',
              }}
            >
              {/* Emoji */}
              <motion.div
                className="text-7xl text-center mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: 2,
                }}
              >
                {emoji}
              </motion.div>

              {/* Text */}
              <div
                className="text-3xl font-semibold text-center"
                style={{
                  background: 'linear-gradient(135deg, #F5C61A 0%, #FFD93D 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {text}
              </div>

              {/* Sparkles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${10 + (i % 2) * 70}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
