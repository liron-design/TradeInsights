import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white' | 'slate';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'blue',
  text 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    blue: 'border-blue-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    slate: 'border-slate-600 border-t-transparent'
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <div 
        className={`${sizeClasses[size]} ${colorClasses[color]} border-2 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <span className="text-sm text-slate-600">{text}</span>
      )}
    </div>
  );
};