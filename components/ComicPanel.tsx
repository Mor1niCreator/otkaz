'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ComicPanelProps {
  children: ReactNode;
  variant?: 'default' | 'action' | 'hero' | 'neon' | 'starburst';
  className?: string;
  animate?: boolean;
  delay?: number;
}

export default function ComicPanel({
  children,
  variant = 'default',
  className = '',
  animate = true,
  delay = 0,
}: ComicPanelProps) {
  const variantClasses = {
    default: 'comic-panel',
    action: 'comic-panel-action',
    hero: 'comic-panel bg-comic-hero text-black',
    neon: 'comic-panel neon-border',
    starburst: 'comic-panel bg-starburst text-black',
  };

  if (!animate) {
    return (
      <div className={`${variantClasses[variant]} ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={`${variantClasses[variant]} ${className}`}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay,
        type: 'spring',
        stiffness: 200,
        damping: 20
      }}
      whileHover={{ 
        scale: 1.02,
        y: -3,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );
}
