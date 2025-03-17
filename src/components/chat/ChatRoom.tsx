
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [currentUser, setCurrentUser] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages when they change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Set up initial data for the demo
  useEffect(() => {
    const username = localStorage.getItem('uzzap_user') || 'Guest';
    setCurrentUser(username);
    
    // Set room name based on the roomId
    const roomNumber = roomId?.split('-')[1] || '1';
    setRoomName(`Gamers ${roomNumber}`);
    
    // Sample messages
    const sampleMessages: Message[] = [
      {
        id: '1',
        sender: 'System',
        text: `Welcome to ${roomName || 'the chat room'}!`,
        timestamp: new Date(Date.now() - 60000 * 15),
        isCurrentUser: false,
      },
      {
        id: '2',
        sender: 'GameMaster42',
        text: 'Hey everyone! Who's playing the new release?',
        timestamp: new Date(Date.now() - 60000 * 10),
        isCurrentUser: false,
      },
      {
        id: '3',
        sender: 'PixelWarrior',
        text: 'I am! The graphics are amazing!',
        timestamp: new Date(Date.now() - 60000 * 5),
        isCurrentUser: false,
      },
      {
        id: '4',
        sender: username,
        text: 'Just joined. What game are you all talking about?',
        timestamp: new Date(Date.now() - 60000 * 2),
        isCurrentUser: true,
      },
    ];
    
    setMessages(sampleMessages);
  }, [roomId, roomName]);
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: Date.now().toString(),
        sender: currentUser,
        text: newMessage,
        timestamp: new Date(),
        isCurrentUser: true,
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage('');
      
      // Simulate a response after a short delay
      setTimeout(() => {
        const responseMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'GameMaster42',
          text: 'That\'s cool! We\'re discussing the latest RPG release.',
          timestamp: new Date(),
          isCurrentUser: false,
        };
        setMessages(prev => [...prev, responseMsg]);
      }, 3000);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-uzzap-green text-white py-2 px-4 flex justify-between items-center">
        <h2 className="font-semibold">{roomName}</h2>
        <div className="text-sm">
          <span className="mr-1">●</span>
          Online: {Math.floor(Math.random() * 30) + 5}
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-3 bg-gray-50">
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
                    : 'bg-white border border-gray-200'
                }`}
              >
                {!message.isCurrentUser && (
                  <div className="font-semibold text-sm text-uzzap-green mb-1">
                    {message.sender}
                  </div>
                )}
                <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                <div className={`text-xs mt-1 ${message.isCurrentUser ? 'text-white/70' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </ScrollArea>
      
      <div className="bg-white border-t border-gray-200 p-3 flex items-center">
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
