
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

    fetchRoomDetails();

    // Generate a unique ID for this user
    const userId = localStorage.getItem('uzzap_user_id') || Math.random().toString(36).substring(2, 15);
    localStorage.setItem('uzzap_user_id', userId);
    
    // Get username from local storage or generate one
    const username = localStorage.getItem('uzzap_user') || `Guest-${userId.substring(0, 5)}`;
    
    // Set up realtime presence to track users in the room
    const channel = supabase.channel(`room:${roomId}`)
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const userCount = Object.keys(presenceState).length;
        console.log('Presence synced:', presenceState, 'User count:', userCount);
        setOnlineUsers(userCount);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
        // The sync event will update the count
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        // The sync event will update the count
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to presence channel for room:', roomId);
          // Track the current user's presence
          await channel.track({
            user_id: userId,
            username: username,
            online_at: new Date().toISOString(),
            room_id: roomId
          });
        }
      });

    return () => {
      console.log('Cleaning up presence subscription for room:', roomId);
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
