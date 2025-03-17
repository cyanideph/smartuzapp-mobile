
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ChevronDown } from 'lucide-react';

interface ChatRoom {
  id: string;
  name: string;
  participants?: number;
  category?: string | null;
  region?: string | null;
  province?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

const regionTitles = {
  'NCR': '1. National Capital Region (NCR)',
  'CAR': '2. Cordillera Administrative Region (CAR)',
  'Region I': '3. Ilocos Region (Region I)',
  'Region II': '4. Cagayan Valley (Region II)',
  'Region III': '5. Central Luzon (Region III)',
  'Region IV-A': '6. CALABARZON (Region IV-A)',
  'Region IV-B': '7. MIMAROPA (Region IV-B)',
  'Region V': '8. Bicol Region (Region V)',
  'Region VI': '9. Western Visayas (Region VI)',
  'Region VII': '10. Central Visayas (Region VII)',
  'Region VIII': '11. Eastern Visayas (Region VIII)',
  'Region IX': '12. Zamboanga Peninsula (Region IX)',
  'Region X': '13. Northern Mindanao (Region X)',
  'Region XI': '14. Davao Region (Region XI)',
  'Region XII': '15. SOCCSKSARGEN (Region XII)',
  'Region XIII': '16. Caraga (Region XIII)',
  'BARMM': '17. Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)',
  'Other': 'Other Categories'
};

const allRegions = Object.keys(regionTitles);

const RoomList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const groupRoomsByRegion = (roomsList: ChatRoom[]) => {
    const grouped: Record<string, ChatRoom[]> = {};
    
    allRegions.forEach(region => {
      grouped[region] = [];
    });
    
    if (!grouped['Other']) {
      grouped['Other'] = [];
    }
    
    roomsList.forEach(room => {
      const roomRegion = room.region || '';
      
      if (roomRegion && allRegions.includes(roomRegion)) {
        grouped[roomRegion].push(room);
      } else {
        grouped['Other'].push(room);
      }
    });
    
    return grouped;
  };

  const toggleRegion = (region: string) => {
    setExpandedRegions(prev => ({
      ...prev,
      [region]: !prev[region]
    }));
  };

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
        
        // Add random participant count for visual appeal
        const roomsWithParticipants = data.map(room => ({
          ...room,
          participants: Math.floor(Math.random() * 50) + 1
        }));
        
        setRooms(roomsWithParticipants);
        setFilteredRooms(roomsWithParticipants);
        
        // Initialize expanded state based on which regions have rooms
        const initialExpandedState: Record<string, boolean> = {};
        allRegions.forEach(region => {
          const hasRoomsInRegion = roomsWithParticipants.some(room => room.region === region);
          initialExpandedState[region] = hasRoomsInRegion;
        });
        
        initialExpandedState['Other'] = true;
        setExpandedRegions(initialExpandedState);
        
      } catch (error) {
        console.error('Error fetching rooms:', error);
        toast({
          title: 'Error',
          description: 'Failed to load chat rooms. Please try again.',
          variant: 'destructive',
        });
        setRooms([]);
        setFilteredRooms([]);
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

  const groupedRooms = groupRoomsByRegion(filteredRooms);

  const hasRooms = rooms.length > 0;
  const hasVisibleRooms = Object.values(groupedRooms).some(group => group.length > 0);

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
        ) : !hasRooms ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No chat rooms available. Create one to get started!
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {allRegions.map((region) => {
              const roomsInRegion = groupedRooms[region] || [];
              if (roomsInRegion.length === 0) return null;
              
              return (
                <div key={region} className="mb-2">
                  <div 
                    onClick={() => toggleRegion(region)}
                    className="flex items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <ChevronDown 
                      className={`h-4 w-4 mr-2 transition-transform ${expandedRegions[region] ? 'rotate-0' : '-rotate-90'}`} 
                    />
                    <span className="font-semibold text-sm">{regionTitles[region as keyof typeof regionTitles] || region}</span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({roomsInRegion.length})</span>
                  </div>
                  
                  {expandedRegions[region] && (
                    <div className="pl-6 mt-1 space-y-1">
                      {roomsInRegion.map((room) => (
                        <motion.div
                          key={room.id}
                          variants={item}
                          className="p-2 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                          onClick={() => handleRoomClick(room.id)}
                        >
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-uzzap-green mr-2 animate-pulse-light"></div>
                            <span className="font-medium dark:text-white">{room.name}</span>
                            {room.province && (
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({room.province})</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ({room.participants})
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            
            {!hasVisibleRooms && searchQuery && (
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
