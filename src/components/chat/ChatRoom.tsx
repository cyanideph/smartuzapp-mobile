
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence } from 'framer-motion';
import Message from './Message';
import MessageInput from './MessageInput';
import RoomHeader from './RoomHeader';
import { useChatMessages } from '@/hooks/use-chat-messages';
import { useRoomInfo } from '@/hooks/use-room-info';
import { useToast } from '@/components/ui/use-toast';

const ChatRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { messages, loading, messagesEndRef, sendMessage } = useChatMessages(roomId);
  const { getHeader, onlineUsers, roomInfo } = useRoomInfo(roomId);
  const { toast } = useToast();

  useEffect(() => {
    // Show welcome message when entering a room
    if (!loading && roomInfo.name) {
      toast({
        title: `Welcome to ${roomInfo.name}`,
        description: `${onlineUsers} ${onlineUsers === 1 ? 'person is' : 'people are'} online in this room`,
      });
    }
  }, [loading, roomInfo.name, onlineUsers, toast]);

  // Auto-scroll effect when online users count changes
  useEffect(() => {
    if (onlineUsers > 0) {
      toast({
        title: 'Online users updated',
        description: `${onlineUsers} ${onlineUsers === 1 ? 'person is' : 'people are'} now online in this room`,
        duration: 3000,
      });
    }
  }, [onlineUsers, toast]);

  return (
    <div className="h-full flex flex-col">
      <RoomHeader title={getHeader()} onlineUsers={onlineUsers} />
      
      <ScrollArea className="flex-1 p-3 bg-gray-50 dark:bg-gray-900">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-uzzap-green"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p>No messages yet. Be the first to say hello!</p>
            <p className="mt-2 text-sm">
              This room is about {roomInfo.description || `chatting with people from ${roomInfo.region || 'Philippines'}`}
            </p>
            <p className="mt-2 text-sm text-uzzap-green">
              {onlineUsers} {onlineUsers === 1 ? 'person is' : 'people are'} currently online
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <Message 
                key={message.id}
                id={message.id}
                sender={message.sender}
                text={message.text}
                timestamp={message.timestamp}
                isCurrentUser={message.isCurrentUser}
              />
            ))}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        )}
      </ScrollArea>
      
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ChatRoom;
