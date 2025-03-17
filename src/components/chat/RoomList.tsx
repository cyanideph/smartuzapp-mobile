
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { useRooms } from '@/hooks/use-rooms';
import { allRegions } from '@/types/chatRoom';
import RegionGroup from './RegionGroup';
import { Search, X, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

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
    getFilteredRoomsByTab,
    toggleRegion,
    markRoomAsRead,
    rooms
  } = useRooms();

  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'recent' | 'active'>('all');
  
  // Count rooms with activity
  const activeRoomsCount = rooms.filter(room => room.hasActivity).length;

  const handleRoomClick = (roomId: string) => {
    markRoomAsRead(roomId);
    navigate(`/chat/room/${roomId}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const filteredRoomsByTab = getFilteredRoomsByTab(activeTab);
  
  // Group the filtered rooms by region
  const groupedRoomsByRegion: Record<string, any> = {};
  
  allRegions.forEach(region => {
    groupedRoomsByRegion[region] = filteredRoomsByTab.filter(room => room.region === region);
  });
  
  // Add "Other" category for rooms without a region
  groupedRoomsByRegion['Other'] = filteredRoomsByTab.filter(room => !room.region || !allRegions.includes(room.region));

  return (
    <div className="p-3 h-full flex flex-col">
      <div className="mb-4 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10 pr-10 py-2 uzzap-input"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="active" className="relative">
            Active
            {activeRoomsCount > 0 && (
              <Badge variant="secondary" className="ml-1 bg-uzzap-green text-white absolute -top-1 -right-1 text-xs">
                {activeRoomsCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <ScrollArea className="flex-1 h-[calc(100vh-260px)]">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-uzzap-green"></div>
          </div>
        ) : !hasRooms ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <p>No chat rooms available.</p>
            <p className="mt-2">Create one to get started!</p>
            <Button 
              className="mt-4 bg-uzzap-green hover:bg-uzzap-darkGreen"
              onClick={() => navigate('/create-chatroom')}
            >
              Create Room
            </Button>
          </div>
        ) : filteredRoomsByTab.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            {activeTab === 'active' ? (
              <>
                <div className="mb-4">
                  <BellRing className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600" />
                </div>
                <p>No active rooms at the moment.</p>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p>No rooms found matching "{searchQuery}"</p>
                <Button variant="outline" className="mt-4" onClick={handleClearSearch}>
                  Clear Search
                </Button>
              </>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            {allRegions.map((region) => (
              <RegionGroup
                key={region}
                region={region}
                rooms={groupedRoomsByRegion[region] || []}
                isExpanded={!!expandedRegions[region]}
                onToggle={() => toggleRegion(region)}
                onRoomClick={handleRoomClick}
              />
            ))}
            
            {!hasVisibleRooms && searchQuery && (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p>No rooms found matching "{searchQuery}"</p>
                <Button variant="outline" className="mt-4" onClick={handleClearSearch}>
                  Clear Search
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </ScrollArea>
    </div>
  );
};

export default RoomList;
