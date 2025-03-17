
import React from 'react';
import { motion } from 'framer-motion';

interface MessageProps {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

const Message: React.FC<MessageProps> = ({ id, sender, text, timestamp, isCurrentUser }) => {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-3 ${isCurrentUser ? 'flex justify-end' : ''}`}
    >
      <div 
        className={`max-w-[80%] rounded-lg p-3 ${
          isCurrentUser 
            ? 'bg-uzzap-green text-white ml-auto' 
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white'
        }`}
      >
        {!isCurrentUser && (
          <div className="font-semibold text-sm text-uzzap-green dark:text-uzzap-green mb-1">
            {sender}
          </div>
        )}
        <div className="text-sm whitespace-pre-wrap">{text}</div>
        <div className={`text-xs mt-1 ${isCurrentUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
};

export default Message;
