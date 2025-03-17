
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users } from 'lucide-react';
import { ChatRoom } from '@/types/chatRoom';
import { Badge } from '@/components/ui/badge';
import OnlineIndicator from './OnlineIndicator';

interface RoomItemProps {
  room: ChatRoom;
  onClick: (roomId: string) => void;
}

const RoomItem: React.FC<RoomItemProps> = ({ room, onClick }) => {
  return (
    <motion.div
      className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(room.id)}
      transition={{ duration: 0.2 }}
      layout
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <OnlineIndicator active={true} size="md" pulse={room.hasActivity} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{room.name}</h3>
              {room.unreadCount && room.unreadCount > 0 && (
                <Badge className="bg-uzzap-green text-white text-xs px-2 py-0.5 rounded-full">
                  {room.unreadCount}
                </Badge>
              )}
              {room.hasActivity && (
                <span className="w-2 h-2 bg-uzzap-green rounded-full animate-pulse"></span>
              )}
            </div>
            
            <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
              <Users className="h-3 w-3 mr-1" />
              <span>{room.participants} online</span>
              {room.province && (
                <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                  • {room.province}
                </span>
              )}
            </div>
            
            {room.lastMessage && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                {room.lastMessage}
              </p>
            )}
          </div>
        </div>
        
        {room.lastMessageTime && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {new Date(room.lastMessageTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default RoomItem;
