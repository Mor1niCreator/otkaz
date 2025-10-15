'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BoomAnimationProps {
  show: boolean;
  onComplete: () => void;
  text?: string;
  emoji?: string;
  type?: 'pow' | 'boom' | 'zap';
}

export default function BoomAnimation({ 
  show, 
  onComplete, 
  text = 'SAVED!', 
  emoji = '💰',
  type = 'boom'
}: BoomAnimationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="text-center relative"
            initial={{ scale: 0, y: 50 }}
            animate={{ 
              scale: [0, 1.1, 1], 
              y: [50, -10, 0]
            }}
            exit={{ scale: 0, opacity: 0, y: -50 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Background burst */}
            <div className="absolute inset-0 -z-10">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-white border-2 border-black"
                  style={{
                    width: '6px',
                    height: '60px',
                    left: '50%',
                    top: '50%',
                    transformOrigin: 'top center',
                    rotate: `${i * 30}deg`,
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: [0, 1.3, 1] }}
                  transition={{ 
                    duration: 0.4,
                    delay: i * 0.02,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </div>

            <motion.div 
              className="text-8xl mb-4"
              animate={{ 
                scale: [1, 1.15, 1],
              }}
              transition={{ duration: 0.4, repeat: 2 }}
              style={{
                filter: 'drop-shadow(4px 4px 0px #000)',
              }}
            >
              {emoji}
            </motion.div>
            
            <motion.div 
              className="bg-white border-4 border-black px-8 py-4"
              style={{
                boxShadow: '0 6px 0px #000',
              }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div
                className="text-4xl font-black uppercase tracking-wider"
                style={{
                  color: '#000',
                }}
              >
                {text}
              </div>
            </motion.div>

            {/* Sparkles */}
            {['✨', '💫', '⭐'].map((sparkle, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl"
                style={{
                  left: `${15 + i * 35}%`,
                  top: `${-10 + (i % 2) * 120}%`,
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: [0, 1.3, 1],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.2 + i * 0.1,
                }}
              >
                {sparkle}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
