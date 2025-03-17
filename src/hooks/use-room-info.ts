
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface RoomInfo {
  name: string;
  region?: string;
  province?: string;
  description?: string;
}

export function useRoomInfo(roomId: string | undefined) {
  const [roomName, setRoomName] = useState('');
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({name: ''});
  const [onlineUsers, setOnlineUsers] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!roomId) return;

    // Get room details
    const fetchRoomDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_rooms')
          .select('name, region, province, description')
          .eq('id', roomId)
          .single();
        
        if (error) {
          console.error('Error fetching room details:', error);
          toast({
            title: 'Error',
            description: 'Failed to load room details',
            variant: 'destructive',
          });
          return;
        }
        
        if (data) {
          setRoomName(data.name);
          setRoomInfo(data);
        }
      } catch (error) {
        console.error('Error in room details fetch:', error);
      }
    };

    // Generate random number of online users between 5 and 35
    setOnlineUsers(Math.floor(Math.random() * 30) + 5);
    
    fetchRoomDetails();

    // Set up realtime presence to track users in the room (simplified for demo)
    const channel = supabase.channel(`room:${roomId}:presence`)
      .on('presence', { event: 'sync' }, () => {
        // In a real app, you would get the actual count from channel.presenceState()
        console.log('Presence sync event received');
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
        setOnlineUsers(prev => prev + 1);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        setOnlineUsers(prev => Math.max(prev - 1, 1)); // Ensure we don't go below 1
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track the current user's presence
          const username = localStorage.getItem('uzzap_user') || 'Guest';
          await channel.track({
            user_id: Math.random().toString(36).substring(2, 15), // In a real app, this would be the actual user ID
            username: username,
            online_at: new Date().toISOString()
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, toast]);

  const getHeader = () => {
    let header = roomName;
    if (roomInfo.province) {
      header += ` (${roomInfo.province})`;
    } else if (roomInfo.region) {
      header += ` (${roomInfo.region})`;
    }
    return header;
  };

  return {
    roomName,
    roomInfo,
    onlineUsers,
    getHeader
  };
}
