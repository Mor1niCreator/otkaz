import React from 'react';
import { clsx } from 'clsx';

interface ComicPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'flat';
  size?: 'sm' | 'md' | 'lg';
}

export function ComicPanel({ 
  children, 
  className, 
  variant = 'default',
  size = 'md' 
}: ComicPanelProps) {
  const baseClasses = 'comic-panel';
  
  const variantClasses = {
    default: '',
    elevated: 'shadow-xl',
    flat: 'shadow-sm'
  };
  
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  };
  
  return (
    <div className={clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
}