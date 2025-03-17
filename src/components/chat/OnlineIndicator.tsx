
import React from 'react';

interface OnlineIndicatorProps {
  pulse?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'away' | 'busy' | 'offline';
}

const OnlineIndicator: React.FC<OnlineIndicatorProps> = ({ 
  pulse = true, 
  className = '',
  size = 'md',
  status = 'online'
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const statusClasses = {
    online: 'bg-uzzap-green',
    away: 'bg-yellow-400',
    busy: 'bg-red-500',
    offline: 'bg-gray-400',
  };
  
  return (
    <div 
      className={`rounded-full ${sizeClasses[size]} ${statusClasses[status]} ${pulse ? 'animate-pulse-light' : ''} ${className}`}
    />
  );
};

export default OnlineIndicator;
