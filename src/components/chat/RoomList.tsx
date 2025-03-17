
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

interface ChatRoom {
  id: string;
  name: string;
  participants: number;
  category: string;
}

const RoomList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<ChatRoom[]>([]);
  const navigate = useNavigate();

  // Sample data for demo purposes
  useEffect(() => {
    const sampleRooms: ChatRoom[] = Array.from({ length: 25 }, (_, i) => ({
      id: `room-${i + 1}`,
      name: `Gamers ${i + 1}`,
      participants: Math.floor(Math.random() * 50) + 1,
      category: 'Games',
    }));
    
    setRooms(sampleRooms);
    setFilteredRooms(sampleRooms);
  }, []);
  
  useEffect(() => {
    if (searchQuery) {
      const filtered = rooms.filter(room => 
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRooms(filtered);
    } else {
      setFilteredRooms(rooms);
    }
  }, [searchQuery, rooms]);
  
  const handleRoomClick = (roomId: string) => {
    navigate(`/chat/room/${roomId}`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-3 h-full flex flex-col">
      <div className="mb-4">
        <Input
          className="uzzap-input"
          placeholder="Search rooms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <ScrollArea className="flex-1 h-[calc(100vh-220px)]">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {filteredRooms.map((room) => (
            <motion.div
              key={room.id}
              variants={item}
              className="p-3 bg-white rounded-md border border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => handleRoomClick(room.id)}
            >
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-uzzap-green mr-2 animate-pulse-light"></div>
                <span className="font-medium">{room.name}</span>
              </div>
              <div className="text-sm text-gray-500">
                ({room.participants})
              </div>
            </motion.div>
          ))}
          
          {filteredRooms.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No rooms found matching "{searchQuery}"
            </div>
          )}
        </motion.div>
      </ScrollArea>
    </div>
  );
};

export default RoomList;
