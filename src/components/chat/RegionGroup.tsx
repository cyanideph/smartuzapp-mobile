
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import RoomItem from './RoomItem';
import { ChatRoom, regionTitles } from '@/types/chatRoom';

interface RegionGroupProps {
  region: string;
  rooms: ChatRoom[];
  isExpanded: boolean;
  onToggle: () => void;
  onRoomClick: (roomId: string) => void;
}

const RegionGroup: React.FC<RegionGroupProps> = ({ 
  region, 
  rooms, 
  isExpanded, 
  onToggle, 
  onRoomClick 
}) => {
  if (rooms.length === 0) return null;
  
  const container = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="mb-2">
      <div 
        onClick={onToggle}
        className="flex items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <ChevronDown 
          className={`h-4 w-4 mr-2 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`} 
        />
        <span className="font-semibold text-sm">{regionTitles[region as keyof typeof regionTitles] || region}</span>
        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({rooms.length})</span>
      </div>
      
      {isExpanded && (
        <motion.div 
          className="pl-6 mt-1 space-y-1"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {rooms.map((room) => (
            <motion.div key={room.id} variants={item}>
              <RoomItem room={room} onClick={onRoomClick} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default RegionGroup;
