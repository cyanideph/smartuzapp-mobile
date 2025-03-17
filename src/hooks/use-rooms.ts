
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
        
        // First get all rooms
        const { data: roomsData, error: roomsError } = await supabase
          .from('chat_rooms')
          .select('*')
          .order('name');
        
        if (roomsError) {
          throw roomsError;
        }
        
        // Get last message for each room
        const roomsWithDetails = await Promise.all(roomsData.map(async (room) => {
          try {
            // Get last message
            const { data: lastMessage, error: messageError } = await supabase
              .from('messages')
              .select('*')
              .eq('room_id', room.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            
            // Generate random participants for visual appeal (in a real app, this would be actual count)
            const participants = Math.floor(Math.random() * 50) + 1;
            
            // Determine if room has new activity since last visit
            const hasActivity = lastMessage ? new Date(lastMessage.created_at) > new Date(Date.now() - 1000 * 60 * 60) : false;
            
            // Get unread count (in a real app with auth, this would be based on user's last read timestamp)
            const unreadCount = Math.floor(Math.random() * 10);
            
            return {
              ...room,
              participants,
              hasActivity,
              unreadCount: hasActivity ? unreadCount : 0,
              lastMessage: lastMessage ? lastMessage.text : null,
              lastMessageTime: lastMessage ? lastMessage.created_at : null
            };
          } catch (error) {
            console.error(`Error fetching details for room ${room.id}:`, error);
            return {
              ...room,
              participants: Math.floor(Math.random() * 50) + 1,
              hasActivity: false,
              unreadCount: 0
            };
          }
        }));
        
        setRooms(roomsWithDetails);
        setFilteredRooms(roomsWithDetails);
        
        // Initialize expanded state based on which regions have rooms
        const initialExpandedState: Record<string, boolean> = {};
        allRegions.forEach(region => {
          const hasRoomsInRegion = roomsWithDetails.some(room => room.region === region);
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

    // Set up real-time subscription for chat_rooms table
    const roomsChannel = supabase
      .channel('chat_rooms_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'chat_rooms'
      }, (payload) => {
        console.log('Chat rooms change received:', payload);
        
        // Handle different types of changes
        if (payload.eventType === 'INSERT') {
          const newRoom = {
            ...(payload.new as ChatRoom),
            participants: Math.floor(Math.random() * 50) + 1,
            hasActivity: true,
            unreadCount: 0
          };
          
          setRooms(prev => [...prev, newRoom]);
          
          // Expand the region if it's the first room in this region
          if (newRoom.region) {
            setExpandedRegions(prev => ({
              ...prev,
              [newRoom.region!]: true
            }));
          }
        } 
        else if (payload.eventType === 'UPDATE') {
          setRooms(prev => prev.map(room => 
            room.id === payload.new.id ? {...payload.new as ChatRoom, participants: room.participants, hasActivity: room.hasActivity, unreadCount: room.unreadCount} : room
          ));
        }
        else if (payload.eventType === 'DELETE') {
          setRooms(prev => prev.filter(room => room.id !== payload.old.id));
        }
      })
      .subscribe((status) => {
        console.log('Chat rooms subscription status:', status);
      });
    
    // Subscribe to message changes to update room activity
    const messagesChannel = supabase
      .channel('messages_changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages'
      }, (payload) => {
        console.log('New message received:', payload);
        const newMessage = payload.new;
        
        // Update the room with the new message information
        setRooms(prev => prev.map(room => {
          if (room.id === newMessage.room_id) {
            return {
              ...room,
              hasActivity: true,
              unreadCount: (room.unreadCount || 0) + 1,
              lastMessage: newMessage.text,
              lastMessageTime: newMessage.created_at
            };
          }
          return room;
        }));
      })
      .subscribe((status) => {
        console.log('Messages subscription status:', status);
      });
    
    // Clean up subscriptions on unmount
    return () => {
      supabase.removeChannel(roomsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [toast]);
  
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

  // Get filtered rooms based on the active tab
  const getFilteredRoomsByTab = (activeTab: string) => {
    if (activeTab === 'popular') {
      return [...filteredRooms].sort((a, b) => (b.participants || 0) - (a.participants || 0));
    } else if (activeTab === 'recent') {
      return [...filteredRooms].sort((a, b) => {
        if (a.lastMessageTime && b.lastMessageTime) {
          return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
        } else if (a.lastMessageTime) {
          return -1;
        } else if (b.lastMessageTime) {
          return 1;
        }
        return 0;
      });
    } else if (activeTab === 'active') {
      return [...filteredRooms].filter(room => room.hasActivity);
    }
    return filteredRooms;
  };

  const toggleRegion = (region: string) => {
    setExpandedRegions(prev => ({
      ...prev,
      [region]: !prev[region]
    }));
  };

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
    hasVisibleRooms: Object.values(groupRoomsByRegion()).some(group => group.length > 0),
    groupRoomsByRegion,
    getFilteredRoomsByTab,
    toggleRegion,
    markRoomAsRead
  };
};
