
import React from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RoomItem from './RoomItem';
import { ChatRoom, regionTitles } from '@/types/chatRoom';
import { Badge } from '@/components/ui/tabs';

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
    hidden: { opacity: 0, height: 0 },
    show: { 
      opacity: 1,
      height: 'auto',
      transition: {
        staggerChildren: 0.05,
        height: { duration: 0.3 }
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="mb-3 overflow-hidden">
      <motion.div 
        className="flex items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={onToggle}
        whileTap={{ scale: 0.98 }}
      >
        <ChevronDown 
          className={`h-4 w-4 mr-2 transition-transform duration-300 ${isExpanded ? 'rotate-0' : '-rotate-90'}`} 
        />
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-uzzap-green" />
          <span className="font-semibold text-sm">{regionTitles[region as keyof typeof regionTitles] || region}</span>
        </div>
        <Badge variant="outline" className="ml-2 bg-gray-200 dark:bg-gray-700 text-xs">
          {rooms.length}
        </Badge>
      </motion.div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="pl-6 mt-1 space-y-2"
            variants={container}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            {rooms.map((room) => (
              <motion.div key={room.id} variants={item}>
                <RoomItem room={room} onClick={onRoomClick} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegionGroup;
