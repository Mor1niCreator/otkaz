'use client';

import { useState, useEffect } from 'react';

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

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="achievement-pop bg-gradient-to-r from-comic-orange to-comic-yellow border-8 border-black rounded-3xl p-8 max-w-md mx-4 shadow-comic-lg">
        <div className="text-center">
          <div className="text-8xl mb-4 comic-icon bounce-comic">
            {achievement.icon}
          </div>
          <div className="text-4xl font-bold comic-text-shadow mb-2">
            🏆 ACHIEVEMENT UNLOCKED! 🏆
          </div>
          <div className="text-2xl font-bold comic-text-outline mb-2">
            {achievement.name}
          </div>
          <div className="text-lg comic-text-shadow">
            {achievement.description}
          </div>
          <div className="mt-4 text-2xl pulse-comic">
            ⭐ CONGRATULATIONS! ⭐
          </div>
        </div>
      </div>
    </div>
  );
}