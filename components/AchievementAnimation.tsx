'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AchievementAnimationProps {
  show: boolean;
  onComplete?: () => void;
  achievement: {
    icon: string;
    name: string;
    description: string;
  };
}

export default function AchievementAnimation({ 
  show, 
  onComplete, 
  achievement 
}: AchievementAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-enough-yellow border-4 border-black p-8 max-w-md mx-4"
            style={{
              boxShadow: '0 8px 0px #000',
            }}
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="text-center">
              <motion.div 
                className="text-7xl mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0]
                }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                {achievement.icon}
              </motion.div>
              <div className="bg-black text-enough-yellow px-4 py-2 mb-3">
                <div className="text-2xl font-black uppercase tracking-wider">
                  🏆 ACHIEVEMENT UNLOCKED!
                </div>
              </div>
              <div className="text-xl font-black uppercase mb-2">
                {achievement.name}
              </div>
              <div className="text-base font-bold text-gray-700">
                {achievement.description}
              </div>
              <motion.div 
                className="mt-4 text-xl font-black uppercase"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ⭐ CONGRATULATIONS! ⭐
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
