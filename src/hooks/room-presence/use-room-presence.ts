
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatRoom } from '@/types/chatRoom';

export const useRoomPresence = () => {
  const [roomPresence, setRoomPresence] = useState<Record<string, number>>({});

  useEffect(() => {
    // Generate a unique ID for this user if not exists
    const userId = localStorage.getItem('uzzap_user_id') || Math.random().toString(36).substring(2, 15);
    localStorage.setItem('uzzap_user_id', userId);
    
    // Get username from local storage or generate one
    const username = localStorage.getItem('uzzap_user') || `Guest-${userId.substring(0, 5)}`;
    
    // Set up a global presence channel to track all online users
    const globalChannel = supabase.channel('global_presence')
      .on('presence', { event: 'sync' }, () => {
        // Process presence data to count users per room
        const presenceState = globalChannel.presenceState();
        const roomCounts: Record<string, number> = {};
        
        // Count users in each room
        Object.values(presenceState).forEach((userList: any) => {
          userList.forEach((presence: any) => {
            if (presence.room_id) {
              roomCounts[presence.room_id] = (roomCounts[presence.room_id] || 0) + 1;
            }
          });
        });
        
        setRoomPresence(roomCounts);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to global presence channel');
          // Track the current user's global presence
          await globalChannel.track({
            user_id: userId,
            username: username,
            online_at: new Date().toISOString()
          });
        }
      });
    
    return () => {
      supabase.removeChannel(globalChannel);
    };
  }, []);

  return { roomPresence };
};
