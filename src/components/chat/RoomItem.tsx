
import React from 'react';
import { motion } from 'framer-motion';
import { ChatRoom } from '@/types/chatRoom';

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
      className="p-2 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
      onClick={() => onClick(room.id)}
    >
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-uzzap-green mr-2 animate-pulse-light"></div>
        <span className="font-medium dark:text-white">{room.name}</span>
        {room.province && (
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({room.province})</span>
        )}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        ({room.participants})
      </div>
    </motion.div>
  );
};

export default RoomItem;
