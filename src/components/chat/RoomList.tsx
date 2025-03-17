
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ChatRoom {
  id: string;
  name: string;
  participants?: number;
  category?: string;
  description?: string;
}

const RoomList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch chat rooms from Supabase
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('chat_rooms')
          .select('*')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        // Add random participants count for demo
        const roomsWithParticipants = data.map(room => ({
          ...room,
          participants: Math.floor(Math.random() * 50) + 1
        }));
        
        setRooms(roomsWithParticipants);
        setFilteredRooms(roomsWithParticipants);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        toast({
          title: 'Error',
          description: 'Failed to load chat rooms. Please try again.',
          variant: 'destructive',
        });
        
        // Fallback to sample data if database fetch fails
        const sampleRooms: ChatRoom[] = Array.from({ length: 5 }, (_, i) => ({
          id: `room-${i + 1}`,
          name: `Gamers ${i + 1}`,
          participants: Math.floor(Math.random() * 50) + 1,
          category: 'Games',
        }));
        setRooms(sampleRooms);
        setFilteredRooms(sampleRooms);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [toast]);
  
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
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-uzzap-green"></div>
          </div>
        ) : (
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
                className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => handleRoomClick(room.id)}
              >
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-uzzap-green mr-2 animate-pulse-light"></div>
                  <span className="font-medium dark:text-white">{room.name}</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ({room.participants})
                </div>
              </motion.div>
            ))}
            
            {filteredRooms.length === 0 && (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                No rooms found matching "{searchQuery}"
              </div>
            )}
          </motion.div>
        )}
      </ScrollArea>
    </div>
  );
};

export default RoomList;
