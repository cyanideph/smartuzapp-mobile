
import { useState } from 'react';
import { ChatRoom } from '@/types/chatRoom';
import { useRoomPresence } from './room-presence/use-room-presence';
import { useRoomData } from './rooms/use-room-data';
import { useRoomFilters } from './rooms/use-room-filters';
import { useRoomTabs } from './rooms/use-room-tabs';
import { useRoomRealtime } from './rooms/use-room-realtime';

export const useRooms = () => {
  const { roomPresence } = useRoomPresence();
  const { rooms, loading, setRooms } = useRoomData(roomPresence);
  const { 
    searchQuery, 
    setSearchQuery, 
    filteredRooms, 
    expandedRegions, 
    hasVisibleRooms,
    groupRoomsByRegion, 
    toggleRegion 
  } = useRoomFilters(rooms);
  const { getFilteredRoomsByTab } = useRoomTabs(filteredRooms);
  
  // Set up realtime listeners
  useRoomRealtime(setRooms, roomPresence);

  const markRoomAsRead = (roomId: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          hasActivity: false,
          unreadCount: 0
        };
      }
      return room;
    }));
  };

  return {
    searchQuery,
    setSearchQuery,
    loading,
    rooms,
    filteredRooms,
    expandedRegions,
    hasRooms: rooms.length > 0,
    hasVisibleRooms,
    groupRoomsByRegion,
    getFilteredRoomsByTab,
    toggleRegion,
    markRoomAsRead
  };
};
