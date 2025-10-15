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
  text = 'Saved!', 
  emoji = '✓',
  type = 'success'
}: BoomAnimationProps) {
  
  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onAnimationComplete={() => {
            setTimeout(onComplete, 1200);
          }}
        >
          {/* Subtle expanding rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: '100px',
                height: '100px',
                border: '2px solid rgba(245, 198, 26, 0.6)',
              }}
              initial={{
                scale: 0,
                opacity: 0.8,
              }}
              animate={{
                scale: [0, 3, 3.5],
                opacity: [0.8, 0.3, 0],
              }}
              transition={{
                duration: 1.2,
                delay: i * 0.15,
                ease: [0.4, 0, 0.2, 1],
              }}
            />
          ))}

          {/* Main card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            className="relative"
          >
            {/* Glow background */}
            <motion.div
              className="absolute inset-0 -m-12"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{ duration: 0.4 }}
              style={{
                background: 'radial-gradient(circle, rgba(245, 198, 26, 0.4) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />

            {/* Card */}
            <div
              className="relative px-12 py-10 rounded-3xl"
              style={{
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 100px rgba(245, 198, 26, 0.2)',
              }}
            >
              {/* Success Icon */}
              <motion.div
                className="mx-auto mb-4 flex items-center justify-center"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F5C61A 0%, #FFD93D 100%)',
                  boxShadow: '0 8px 24px rgba(245, 198, 26, 0.4)',
                }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 20,
                  delay: 0.1,
                }}
              >
                <motion.span
                  className="text-5xl font-semibold"
                  style={{ color: '#1D1D1F' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {emoji}
                </motion.span>
              </motion.div>

              {/* Text */}
              <motion.div
                className="text-2xl font-semibold text-center"
                style={{ color: '#1D1D1F' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {text}
              </motion.div>

              {/* Subtle check marks around */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${i % 2 === 0 ? '10%' : '85%'}`,
                    color: '#F5C61A',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1],
                    opacity: [0, 1, 0.7],
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + i * 0.05,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  ✓
                </motion.div>
              ))}

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                  }}
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
