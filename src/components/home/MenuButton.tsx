
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MenuButtonProps {
  icon: LucideIcon;
  label: string;
  color?: string;
  onClick?: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  icon: Icon,
  label,
  color = 'from-uzzap-lightGreen to-uzzap-green',
  onClick
}) => {
  const gradientClass = `from-${color.split(' ')[0]} to-${color.split(' ')[1]}`;
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`uzzap-icon-button from-${color} w-full h-24 bg-gradient-to-br`}
      onClick={onClick}
    >
      <Icon className="w-8 h-8 mb-2" />
      <span className="text-xs font-medium">{label}</span>
    </motion.button>
  );
};

export default MenuButton;
