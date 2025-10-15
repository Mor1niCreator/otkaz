'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Achievement {
  id: string;
  nameEn: string;
  nameRu: string;
  descriptionEn: string;
  descriptionRu: string;
  icon: string;
}

interface AchievementAnimationProps {
  show: boolean;
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementAnimation({ show, achievement, onClose }: AchievementAnimationProps) {
  if (!achievement) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(12px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Radial glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(245, 198, 26, 0.3) 0%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />
          </motion.div>

          {/* Achievement Card */}
          <motion.div
            className="relative max-w-sm mx-4"
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Card */}
            <div
              className="p-8 rounded-3xl text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 80px rgba(245, 198, 26, 0.2)',
              }}
            >
              {/* Badge */}
              <motion.div
                className="inline-block px-4 py-2 rounded-full mb-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 198, 26, 0.15) 0%, rgba(255, 217, 61, 0.1) 100%)',
                  border: '1px solid rgba(245, 198, 26, 0.3)',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
              >
                <span className="text-sm font-medium text-gray-700">Achievement Unlocked!</span>
              </motion.div>

              {/* Icon */}
              <motion.div
                className="text-8xl mb-6"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                  times: [0, 0.3, 0.7, 1],
                }}
              >
                {achievement.icon}
              </motion.div>

              {/* Title */}
              <motion.h2
                className="text-2xl font-semibold mb-2"
                style={{ color: '#1D1D1F' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {achievement.nameEn}
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-base mb-6"
                style={{ color: '#86868B' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {achievement.descriptionEn}
              </motion.p>

              {/* Confetti/Sparkles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl pointer-events-none"
                  style={{
                    left: `${50 + Math.cos((i / 12) * Math.PI * 2) * 40}%`,
                    top: `${50 + Math.sin((i / 12) * Math.PI * 2) * 40}%`,
                  }}
                  initial={{
                    scale: 0,
                    opacity: 0,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 180, 360],
                    y: [0, -20, -40],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.3 + i * 0.05,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  ✨
                </motion.div>
              ))}

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="enough-button-primary px-8 py-3 text-base font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Awesome!
              </motion.button>
            </div>

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                }}
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
