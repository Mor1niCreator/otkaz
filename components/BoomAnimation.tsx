'use client';

import { useState, useEffect } from 'react';

interface BoomAnimationProps {
  show: boolean;
  onComplete?: () => void;
  text?: string;
  emoji?: string;
}

export default function BoomAnimation({ 
  show, 
  onComplete, 
  text = "BOOM!", 
  emoji = "💥" 
}: BoomAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="boom-animation text-center">
        <div className="text-8xl mb-2 comic-text-large">
          {emoji}
        </div>
        <div className="text-6xl font-bold comic-text-large">
          {text}
        </div>
        <div className="text-2xl mt-2 comic-text-shadow">
          POW! BANG! ZAP!
        </div>
      </div>
    </div>
  );
}