'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: string;
}

export default function ProgressBar({ 
  progress, 
  color = 'from-comic-lime to-comic-cyan',
  height = 'h-8'
}: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`${height} bg-gray-200 rounded-full border-2 border-gray-200 overflow-hidden shadow-comic`}>
      <motion.div
        className={`h-full bg-gradient-to-r ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${clampedProgress}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}