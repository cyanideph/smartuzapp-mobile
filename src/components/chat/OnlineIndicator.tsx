
import React from 'react';

interface OnlineIndicatorProps {
  pulse?: boolean;
  className?: string;
}

const OnlineIndicator: React.FC<OnlineIndicatorProps> = ({ pulse = true, className = '' }) => {
  return (
    <div 
      className={`w-3 h-3 rounded-full bg-uzzap-green ${pulse ? 'animate-pulse-light' : ''} ${className}`}
    />
  );
};

export default OnlineIndicator;
