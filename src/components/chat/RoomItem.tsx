
import React from 'react';
import { motion } from 'framer-motion';
import { ChatRoom } from '@/types/chatRoom';
import OnlineIndicator from './OnlineIndicator';
import { Users } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface RoomItemProps {
  room: ChatRoom;
  onClick: (roomId: string) => void;
}

const RoomItem: React.FC<RoomItemProps> = ({ room, onClick }) => {
  return (
    <motion.div
      key={room.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="transition-all duration-200"
      onClick={() => onClick(room.id)}
    >
      <Card className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <OnlineIndicator className="mr-2" status={room.hasActivity ? 'online' : 'away'} />
            <span className="font-medium dark:text-white">{room.name}</span>
            {room.province && (
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({room.province})</span>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Users className="h-3 w-3 mr-1" />
            <span>{room.participants}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default RoomItem;
