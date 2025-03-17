
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

const ChatRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomInfo, setRoomInfo] = useState<{name: string, region?: string, province?: string}>({name: ''});
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Scroll to bottom of messages when they change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Set up real-time subscription to messages
  useEffect(() => {
    if (!roomId) return;
    
    const username = localStorage.getItem('uzzap_user') || 'Guest';
    setCurrentUser(username);
    
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
    
    // Generate random number of online users between 5 and 35
    setOnlineUsers(Math.floor(Math.random() * 30) + 5);
    
    fetchRoomDetails();
    fetchMessages();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        const newMessage = payload.new;
        
        // Add the new message to the state
        setMessages(currentMessages => [
          ...currentMessages, 
          {
            id: newMessage.id,
            sender: newMessage.sender,
            text: newMessage.text,
            timestamp: new Date(newMessage.created_at),
            isCurrentUser: newMessage.sender === username
          }
        ]);
      })
      .subscribe();
    
    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [roomId, toast]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !roomId) return;
    
    try {
      // Insert the message into the database
      const { error } = await supabase
        .from('messages')
        .insert({
          room_id: roomId,
          sender: currentUser,
          text: newMessage,
        });
      
      if (error) {
        throw error;
      }
      
      // Clear the input
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getHeader = () => {
    let header = roomName;
    if (roomInfo.province) {
      header += ` (${roomInfo.province})`;
    } else if (roomInfo.region) {
      header += ` (${roomInfo.region})`;
    }
    return header;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-uzzap-green text-white py-2 px-4 flex justify-between items-center">
        <h2 className="font-semibold">{getHeader()}</h2>
        <div className="text-sm">
          <span className="mr-1">●</span>
          Online: {onlineUsers}
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-3 bg-gray-50 dark:bg-gray-900">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-uzzap-green"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No messages yet. Be the first to say hello!
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`mb-3 ${message.isCurrentUser ? 'flex justify-end' : ''}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isCurrentUser 
                      ? 'bg-uzzap-green text-white ml-auto' 
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white'
                  }`}
                >
                  {!message.isCurrentUser && (
                    <div className="font-semibold text-sm text-uzzap-green dark:text-uzzap-green mb-1">
                      {message.sender}
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                  <div className={`text-xs mt-1 ${message.isCurrentUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        )}
      </ScrollArea>
      
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 flex items-center">
        <Input
          className="flex-1 uzzap-input"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button 
          onClick={handleSendMessage}
          className="ml-2 bg-uzzap-green hover:bg-uzzap-darkGreen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
        </Button>
      </div>
    </div>
  );
};

export default ChatRoom;
