import React from 'react';

interface SimplePanelProps {
  children: React.ReactNode;
  className?: string;
}

export function SimplePanel({ children, className = '' }: SimplePanelProps) {
  return (
    <div className={`bg-white border-2 border-gray-800 rounded-lg p-4 m-2 shadow-lg ${className}`}>
      {children}
    </div>
  );
}