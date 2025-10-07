'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ComicPanelProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export default function ComicPanel({ children, className = '', animate = false }: ComicPanelProps) {
  const Wrapper = animate ? motion.div : 'div';
  const animationProps = animate
    ? {
        initial: { scale: 0.95, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }
    : {};

  return (
    <Wrapper className={`comic-panel ${className}`} {...animationProps}>
      {children}
    </Wrapper>
  );
}