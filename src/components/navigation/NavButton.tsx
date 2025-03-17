
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  active = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center"
    >
      <Button
        variant="ghost"
        className={`w-full flex flex-col items-center justify-center py-2 transition-all ${
          active ? 'bg-uzzap-green/10 text-uzzap-green' : 'text-gray-600'
        }`}
        onClick={onClick}
      >
        <Icon className={`w-6 h-6 mb-1 ${active ? 'text-uzzap-green' : 'text-gray-600'}`} />
        <span className="text-xs font-medium">{label}</span>
      </Button>
      {active && (
        <motion.div
          layoutId="activeIndicator"
          className="w-1/2 h-1 bg-uzzap-green rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
};

export default NavButton;
