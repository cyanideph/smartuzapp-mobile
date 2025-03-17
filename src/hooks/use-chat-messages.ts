
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

export function useChatMessages(roomId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when they change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Set up real-time subscription to messages
  useEffect(() => {
    if (!roomId) return;
    
    const username = localStorage.getItem('uzzap_user') || 'Guest';
    setCurrentUser(username);
    
    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('room_id', roomId)
          .order('created_at');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const formattedMessages = data.map(msg => ({
            id: msg.id,
            sender: msg.sender,
            text: msg.text,
            timestamp: new Date(msg.created_at),
            isCurrentUser: msg.sender === username
          }));
          
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: 'Error',
          description: 'Failed to load messages',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up real-time subscription
    const channel = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        console.log('New message received:', payload);
        const newMsg = payload.new;
        
        // Add the new message to the state
        setMessages(currentMessages => [
          ...currentMessages, 
          {
            id: newMsg.id,
            sender: newMsg.sender,
            text: newMsg.text,
            timestamp: new Date(newMsg.created_at),
            isCurrentUser: newMsg.sender === username
          }
        ]);
      })
      .subscribe((status) => {
        console.log(`Subscription status for room ${roomId}:`, status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to room changes');
        }
      });
    
    // Clean up subscription on unmount
    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [roomId, toast]);

  const sendMessage = async (newMessage: string) => {
    if (!newMessage.trim() || !roomId) return;
    
    try {
      console.log('Sending message:', { roomId, sender: currentUser, text: newMessage });
      
      // Insert the message into the database
      const { data, error } = await supabase
        .from('messages')
        .insert({
          room_id: roomId,
          sender: currentUser,
          text: newMessage,
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      console.log('Message sent successfully:', data);
      
      // Optimistically add the message to the UI immediately
      if (data && data.length > 0) {
        const newMsg = data[0];
        setMessages(prevMessages => [
          ...prevMessages,
          {
            id: newMsg.id,
            sender: newMsg.sender,
            text: newMsg.text,
            timestamp: new Date(newMsg.created_at),
            isCurrentUser: true
          }
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return {
    messages,
    loading,
    messagesEndRef,
    sendMessage
  };
}
