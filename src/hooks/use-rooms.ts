
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ChatRoom, allRegions } from '@/types/chatRoom';

export const useRooms = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Fetch rooms from Supabase
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('chat_rooms')
          .select('*')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        // Add random participant count for visual appeal
        const roomsWithParticipants = data.map(room => ({
          ...room,
          participants: Math.floor(Math.random() * 50) + 1
        }));
        
        setRooms(roomsWithParticipants);
        setFilteredRooms(roomsWithParticipants);
        
        // Initialize expanded state based on which regions have rooms
        const initialExpandedState: Record<string, boolean> = {};
        allRegions.forEach(region => {
          const hasRoomsInRegion = roomsWithParticipants.some(room => room.region === region);
          initialExpandedState[region] = hasRoomsInRegion;
        });
        
        initialExpandedState['Other'] = true;
        setExpandedRegions(initialExpandedState);
        
      } catch (error) {
        console.error('Error fetching rooms:', error);
        toast({
          title: 'Error',
          description: 'Failed to load chat rooms. Please try again.',
          variant: 'destructive',
        });
        setRooms([]);
        setFilteredRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [toast]);
  
  // Filter rooms based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = rooms.filter(room => 
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRooms(filtered);
    } else {
      setFilteredRooms(rooms);
    }
  }, [searchQuery, rooms]);

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

  const toggleRegion = (region: string) => {
    setExpandedRegions(prev => ({
      ...prev,
      [region]: !prev[region]
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
    hasVisibleRooms: Object.values(groupRoomsByRegion()).some(group => group.length > 0),
    groupRoomsByRegion,
    toggleRegion
  };
};
