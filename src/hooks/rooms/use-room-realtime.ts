
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatRoom } from '@/types/chatRoom';

export const useRoomRealtime = (setRooms: React.Dispatch<React.SetStateAction<ChatRoom[]>>, roomPresence: Record<string, number>) => {
  useEffect(() => {
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
            participants: 0,
            hasActivity: true,
            unreadCount: 0
          };
          
          setRooms(prev => [...prev, newRoom]);
        } 
        else if (payload.eventType === 'UPDATE') {
          setRooms(prev => prev.map(room => 
            room.id === payload.new.id ? {
              ...payload.new as ChatRoom, 
              participants: roomPresence[room.id] || 0, 
              hasActivity: room.hasActivity, 
              unreadCount: room.unreadCount
            } : room
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
  }, [setRooms, roomPresence]);
};
