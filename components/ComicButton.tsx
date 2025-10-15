'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ComicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'orange' | 'lime' | 'cyan' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  icon?: string;
  effect?: 'none' | 'pow' | 'shine' | 'pulse';
}

export default function ComicButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  icon,
  effect = 'shine',
}: ComicButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg',
  };

  const variantClasses = {
    primary: 'comic-button',
    secondary: 'comic-button-secondary',
    orange: 'comic-button-orange',
    lime: 'comic-button-lime',
    cyan: 'comic-button-cyan',
    danger: 'bg-gradient-to-br from-red-500 to-red-600 text-black border-2 border-gray-200 rounded-2xl font-semibold shadow-comic',
  };

  const effectClass = {
    none: '',
    pow: 'pow-effect',
    shine: 'comic-shine',
    pulse: 'pulse-comic',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${effectClass[effect]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
        relative overflow-hidden
      `}
      whileHover={!disabled ? { 
        scale: 1.05, 
        y: -4,
        boxShadow: '10px 10px 0px #000'
      } : {}}
      whileTap={!disabled ? { 
        scale: 0.98, 
        y: 2,
        boxShadow: '3px 3px 0px #000'
      } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {/* Inner glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20 pointer-events-none"
        initial={{ opacity: 0.5 }}
        whileHover={{ opacity: 0.8 }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon && (
          <motion.span
            className="text-2xl"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {icon}
          </motion.span>
        )}
        {children}
      </span>

      {/* Sparkle effect on hover */}
      {effect === 'pow' && !disabled && (
        <motion.div
          className="absolute -top-2 -right-2 text-2xl"
          initial={{ scale: 0, rotate: 0 }}
          whileHover={{ 
            scale: [0, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 0.5 }}
        >
          ✨
        </motion.div>
      )}
    </motion.button>
  );
}
