
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface Buddy {
  id: string;
  username: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: string;
  hasNewMessages?: boolean;
}

const BuddyList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [filteredBuddies, setFilteredBuddies] = useState<Buddy[]>([]);
  const navigate = useNavigate();
  
  // Sample data for demo purposes
  useEffect(() => {
    const sampleBuddies: Buddy[] = [
      { id: '1', username: 'GameMaster42', status: 'online', hasNewMessages: true },
      { id: '2', username: 'PixelWarrior', status: 'online' },
      { id: '3', username: 'NeonRider', status: 'away', lastSeen: '20 min ago' },
      { id: '4', username: 'CyberPunk2077', status: 'offline', lastSeen: '2 hours ago' },
      { id: '5', username: 'RetroGamer', status: 'busy' },
      { id: '6', username: 'MobileGaming', status: 'online' },
      { id: '7', username: 'ConsoleMaster', status: 'offline', lastSeen: '1 day ago' },
      { id: '8', username: 'PCMasterRace', status: 'online', hasNewMessages: true },
    ];
    
    setBuddies(sampleBuddies);
    setFilteredBuddies(sampleBuddies);
  }, []);
  
  useEffect(() => {
    if (searchQuery) {
      const filtered = buddies.filter(buddy => 
        buddy.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBuddies(filtered);
    } else {
      setFilteredBuddies(buddies);
    }
  }, [searchQuery, buddies]);
  
  const handleBuddyClick = (buddyId: string) => {
    navigate(`/message/${buddyId}`);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
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
          placeholder="Search buddies..."
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
          <AnimatePresence>
            {filteredBuddies.map((buddy) => (
              <motion.div
                key={buddy.id}
                variants={item}
                layoutId={buddy.id}
                className="p-3 bg-white rounded-md border border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() => handleBuddyClick(buddy.id)}
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(buddy.status)} mr-2`}></div>
                  <span className="font-medium">{buddy.username}</span>
                  {buddy.hasNewMessages && (
                    <Badge className="ml-2 bg-uzzap-green text-white">
                      New
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {buddy.status === 'online' ? 'Online' : buddy.lastSeen}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredBuddies.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No buddies found matching "{searchQuery}"
            </div>
          )}
        </motion.div>
      </ScrollArea>
    </div>
  );
};

export default BuddyList;
