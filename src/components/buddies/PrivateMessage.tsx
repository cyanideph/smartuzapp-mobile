
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
  text: string;
  timestamp: Date;
  isFromMe: boolean;
}

interface Buddy {
  id: string;
  username: string;
  status: 'online' | 'offline' | 'away' | 'busy';
}

const PrivateMessage: React.FC = () => {
  const { buddyId } = useParams<{ buddyId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [buddy, setBuddy] = useState<Buddy | null>(null);
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Scroll to bottom of messages when they change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Set up initial data and subscriptions
  useEffect(() => {
    if (!buddyId) return;
    
    const username = localStorage.getItem('uzzap_user') || 'Guest';
    setCurrentUser(username);
    
    // Fetch buddy details
    const fetchBuddyDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', buddyId)
          .single();
        
        if (error) {
          console.error('Error fetching buddy details:', error);
          // Fallback to a default buddy if database fetch fails
          setBuddy({
            id: buddyId,
            username: 'User',
            status: 'offline'
          });
        } else if (data) {
          setBuddy({
            id: data.id,
            username: data.username,
            status: data.status as 'online' | 'offline' | 'away' | 'busy'
          });
        }
      } catch (error) {
        console.error('Error in buddy details fetch:', error);
        setBuddy({
          id: buddyId,
          username: 'User',
          status: 'offline'
        });
      }
    };
    
    // For now, just use sample messages
    // In a real implementation, you would fetch messages from private_messages table
    // and set up a subscription for new messages
    
    const sampleMessages: Message[] = [
      {
        id: '1',
        text: 'Hey there!',
        timestamp: new Date(Date.now() - 60000 * 20),
        isFromMe: false,
      },
      {
        id: '2',
        text: 'Hi! How are you?',
        timestamp: new Date(Date.now() - 60000 * 18),
        isFromMe: true,
      },
      {
        id: '3',
        text: 'I\'m good, thanks! Have you tried the new game?',
        timestamp: new Date(Date.now() - 60000 * 15),
        isFromMe: false,
      },
      {
        id: '4',
        text: 'Not yet, is it worth playing?',
        timestamp: new Date(Date.now() - 60000 * 10),
        isFromMe: true,
      },
      {
        id: '5',
        text: 'Definitely! The graphics are amazing and the storyline is great.',
        timestamp: new Date(Date.now() - 60000 * 5),
        isFromMe: false,
      },
    ];
    
    fetchBuddyDetails();
    setMessages(sampleMessages);
    setLoading(false);
    
  }, [buddyId]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // In a real implementation, you would insert a new message into the private_messages table
    // For now, just add it to the local state
    
    const newMsg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: new Date(),
      isFromMe: true,
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate a response after a short delay
    setTimeout(() => {
      const responseMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sure! Let me know what you think after you play it.',
        timestamp: new Date(),
        isFromMe: false,
      };
      setMessages(prev => [...prev, responseMsg]);
    }, 3000);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-uzzap-green text-white py-2 px-4 flex items-center">
        {buddy && (
          <>
            <div className={`w-3 h-3 rounded-full ${getStatusColor(buddy.status)} mr-2`}></div>
            <h2 className="font-semibold">{buddy.username}</h2>
            <span className="ml-2 text-xs opacity-70">
              {buddy.status === 'online' ? 'online now' : buddy.status}
            </span>
          </>
        )}
      </div>
      
      <ScrollArea className="flex-1 p-3 bg-gray-50 dark:bg-gray-900">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-uzzap-green"></div>
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
                className={`mb-3 ${message.isFromMe ? 'flex justify-end' : ''}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isFromMe 
                      ? 'bg-uzzap-green text-white ml-auto' 
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                  <div className={`text-xs mt-1 ${message.isFromMe ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
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

export default PrivateMessage;
