
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { useRooms } from '@/hooks/use-rooms';
import { allRegions } from '@/types/chatRoom';
import RegionGroup from './RegionGroup';

const RoomList: React.FC = () => {
  const navigate = useNavigate();
  const { 
    searchQuery, 
    setSearchQuery, 
    loading, 
    hasRooms, 
    hasVisibleRooms, 
    expandedRegions,
    groupRoomsByRegion, 
    toggleRegion 
  } = useRooms();

  const handleRoomClick = (roomId: string) => {
    navigate(`/chat/room/${roomId}`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const groupedRooms = groupRoomsByRegion();

  return (
    <div className="p-3 h-full flex flex-col">
      <div className="mb-4">
        <Input
          className="uzzap-input"
          placeholder="Search rooms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <ScrollArea className="flex-1 h-[calc(100vh-220px)]">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-uzzap-green"></div>
          </div>
        ) : !hasRooms ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No chat rooms available. Create one to get started!
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {allRegions.map((region) => (
              <RegionGroup
                key={region}
                region={region}
                rooms={groupedRooms[region] || []}
                isExpanded={!!expandedRegions[region]}
                onToggle={() => toggleRegion(region)}
                onRoomClick={handleRoomClick}
              />
            ))}
            
            {!hasVisibleRooms && searchQuery && (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                No rooms found matching "{searchQuery}"
              </div>
            )}
          </motion.div>
        )}
      </ScrollArea>
    </div>
  );
};

export default RoomList;
