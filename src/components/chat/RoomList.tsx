
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
  category?: string;
  region?: string;
  province?: string;
  description?: string;
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

// Get all regions in order
const allRegions = Object.keys(regionTitles);

const RoomList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  // Group rooms by region
  const groupRoomsByRegion = (roomsList: ChatRoom[]) => {
    const grouped: Record<string, ChatRoom[]> = {};
    
    // Initialize all regions with empty arrays
    allRegions.forEach(region => {
      grouped[region] = [];
    });
    
    // Ensure 'Other' category exists
    if (!grouped['Other']) {
      grouped['Other'] = [];
    }
    
    // Group rooms by region
    roomsList.forEach(room => {
      // Use the region field directly if available, otherwise extract from category
      const roomRegion = room.region || (room.category ? room.category.split(' - ')[0] : '');
      
      if (roomRegion && allRegions.includes(roomRegion)) {
        grouped[roomRegion].push(room);
      } else {
        // Handle rooms with no region or invalid region
        grouped['Other'].push(room);
      }
    });
    
    return grouped;
  };

  // Toggle region expansion
  const toggleRegion = (region: string) => {
    setExpandedRegions(prev => ({
      ...prev,
      [region]: !prev[region]
    }));
  };

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
        
        // Initialize expanded state for all regions
        const initialExpandedState: Record<string, boolean> = {};
        allRegions.forEach(region => {
          initialExpandedState[region] = false;
        });
        // Auto-expand the "Other" category to show non-Philippine region rooms
        initialExpandedState['Other'] = true;
        setExpandedRegions(initialExpandedState);
        
        console.log('Fetched rooms:', roomsWithParticipants);
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
          region: 'NCR',
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

  const groupedRooms = groupRoomsByRegion(filteredRooms);

  // Check if we have any rooms to display
  const hasRooms = rooms.length > 0;
  // Check if any rooms are shown after filtering and grouping
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
