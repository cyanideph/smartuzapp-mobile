
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ChatRoom } from '@/types/chatRoom';

export const useRoomData = (roomPresence: Record<string, number>) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
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
            
            // Determine if room has new activity since last visit
            const hasActivity = lastMessage ? new Date(lastMessage.created_at) > new Date(Date.now() - 1000 * 60 * 60) : false;
            
            // Get unread count (in a real app with auth, this would be based on user's last read timestamp)
            const unreadCount = Math.floor(Math.random() * 10);
            
            return {
              ...room,
              participants: roomPresence[room.id] || 0,
              hasActivity,
              unreadCount: hasActivity ? unreadCount : 0,
              lastMessage: lastMessage ? lastMessage.text : null,
              lastMessageTime: lastMessage ? lastMessage.created_at : null
            };
          } catch (error) {
            console.error(`Error fetching details for room ${room.id}:`, error);
            return {
              ...room,
              participants: roomPresence[room.id] || 0,
              hasActivity: false,
              unreadCount: 0
            };
          }
        }));
        
        setRooms(roomsWithDetails);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        toast({
          title: 'Error',
          description: 'Failed to load chat rooms. Please try again.',
          variant: 'destructive',
        });
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [toast, roomPresence]);

  // Update rooms when presence changes
  useEffect(() => {
    setRooms(prev => prev.map(room => ({
      ...room,
      participants: roomPresence[room.id] || 0
    })));
  }, [roomPresence]);

  return {
    rooms,
    loading,
    setRooms
  };
};
