
import React from 'react';
import { motion } from 'framer-motion';

interface UzzapLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showBeta?: boolean;
}

const UzzapLogo: React.FC<UzzapLogoProps> = ({ size = 'md', showBeta = true }) => {
  const sizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  const betaSizes = {
    sm: 'text-[0.5rem]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <h1 className={`font-extrabold ${sizes[size]} tracking-tight text-uzzap-green`} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
        <span className="relative italic">
          <span className="drop-shadow-sm">Uzzap</span>
          {showBeta && (
            <span className={`absolute -top-1 -right-10 ${betaSizes[size]} text-uzzap-green font-bold bg-white px-1 rounded-sm`}>
              BETA
            </span>
          )}
        </span>
      </h1>
    </motion.div>
  );
};

export default UzzapLogo;
