'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComicExplosion } from './ComicEffects';

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
  text = 'BOOM!', 
  emoji = '💥',
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
    <>
      <ComicExplosion show={show} type={type} />
      
      <AnimatePresence>
        {show && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Main text with comic effect */}
            <motion.div
              className="text-center relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: [0, 1.3, 1], 
                rotate: [-180, 20, 0] 
              }}
              exit={{ scale: 0, opacity: 0, rotate: 180 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Burst rays background */}
              <div className="absolute inset-0 -z-10">
                {[...Array(16)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      width: '6px',
                      height: '80px',
                      backgroundColor: '#FFE030',
                      border: '2px solid #000',
                      left: '50%',
                      top: '50%',
                      transformOrigin: 'top center',
                      rotate: `${i * 22.5}deg`,
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: [0, 1.5, 1.2] }}
                    transition={{ 
                      duration: 0.5,
                      delay: i * 0.02,
                      ease: 'easeOut'
                    }}
                  />
                ))}
              </div>

              <motion.div 
                className="text-9xl mb-4"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0]
                }}
                transition={{ duration: 0.5 }}
                style={{
                  filter: 'drop-shadow(6px 6px 0px #000)',
                }}
              >
                {emoji}
              </motion.div>
              
              <motion.div 
                className="text-7xl uppercase"
                style={{ 
                  fontFamily: "'Righteous', 'Russo One', sans-serif",
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #FFE030 0%, #FF6B35 50%, #FF006E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(5px 5px 0px #000)',
                  letterSpacing: '0.15em',
                  WebkitTextStroke: '2px #000',
                }}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {text}
              </motion.div>

              {/* Sparkles around */}
              {['✨', '💫', '⭐', '✨', '💫'].map((sparkle, i) => (
                <motion.div
                  key={i}
                  className="absolute text-4xl"
                  style={{
                    left: `${20 + i * 20}%`,
                    top: `${10 + (i % 2) * 80}%`,
                  }}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 1],
                    rotate: [0, 360, 720],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 1,
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
    </>
  );
}
