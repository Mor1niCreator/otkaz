'use client';

import { ReactNode } from 'react';

interface SpeechBubbleProps {
  children: ReactNode;
  className?: string;
  direction?: 'bottom' | 'top';
}

export default function SpeechBubble({ 
  children, 
  className = '', 
  direction = 'bottom' 
}: SpeechBubbleProps) {
  return (
    <div className={`speech-bubble ${className}`}>
      {children}
    </div>
  );
}