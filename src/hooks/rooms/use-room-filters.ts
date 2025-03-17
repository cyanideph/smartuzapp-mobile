
import { useState, useEffect } from 'react';
import { allRegions } from '@/types/chatRoom';
import { ChatRoom } from '@/types/chatRoom';

export const useRoomFilters = (rooms: ChatRoom[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRooms, setFilteredRooms] = useState<ChatRoom[]>([]);
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});

  // Initialize expanded state based on which regions have rooms
  useEffect(() => {
    if (rooms.length > 0) {
      const initialExpandedState: Record<string, boolean> = {};
      allRegions.forEach(region => {
        const hasRoomsInRegion = rooms.some(room => room.region === region);
        initialExpandedState[region] = hasRoomsInRegion;
      });
      
      initialExpandedState['Other'] = true;
      setExpandedRegions(initialExpandedState);
    }
  }, [rooms]);

  // Filter rooms based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = rooms.filter(room => 
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (room.province && room.province.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (room.region && room.region.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredRooms(filtered);
    } else {
      setFilteredRooms(rooms);
    }
  }, [searchQuery, rooms]);

  const toggleRegion = (region: string) => {
    setExpandedRegions(prev => ({
      ...prev,
      [region]: !prev[region]
    }));
  };

  // Group rooms by region
  const groupRoomsByRegion = () => {
    const grouped: Record<string, ChatRoom[]> = {};
    
    allRegions.forEach(region => {
      grouped[region] = [];
    });
    
    if (!grouped['Other']) {
      grouped['Other'] = [];
    }
    
    filteredRooms.forEach(room => {
      const roomRegion = room.region || '';
      
      if (roomRegion && allRegions.includes(roomRegion)) {
        grouped[roomRegion].push(room);
      } else {
        grouped['Other'].push(room);
      }
    });
    
    return grouped;
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredRooms,
    expandedRegions,
    hasVisibleRooms: Object.values(groupRoomsByRegion()).some(group => group.length > 0),
    groupRoomsByRegion,
    toggleRegion
  };
};
