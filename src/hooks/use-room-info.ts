
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface RoomInfo {
  name: string;
  region?: string;
  province?: string;
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
          .select('name, region, province')
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
