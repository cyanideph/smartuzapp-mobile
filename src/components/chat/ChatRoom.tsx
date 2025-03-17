
import React from 'react';
import { useParams } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence } from 'framer-motion';
import Message from './Message';
import MessageInput from './MessageInput';
import RoomHeader from './RoomHeader';
import { useChatMessages } from '@/hooks/use-chat-messages';
import { useRoomInfo } from '@/hooks/use-room-info';

const ChatRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { messages, loading, messagesEndRef, sendMessage } = useChatMessages(roomId);
  const { getHeader, onlineUsers } = useRoomInfo(roomId);

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
            No messages yet. Be the first to say hello!
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
