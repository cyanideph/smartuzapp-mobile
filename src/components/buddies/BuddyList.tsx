
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch buddies from Supabase
  useEffect(() => {
    const fetchBuddies = async () => {
      try {
        setLoading(true);
        // For now, just fetch all profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(20);
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          // Format profiles as buddies
          const fetchedBuddies: Buddy[] = data.map(profile => ({
            id: profile.id,
            username: profile.username,
            status: profile.status as 'online' | 'offline' | 'away' | 'busy',
            lastSeen: profile.last_seen ? new Date(profile.last_seen).toLocaleString() : undefined,
            hasNewMessages: Math.random() > 0.7 // Random for demo
          }));
          
          setBuddies(fetchedBuddies);
          setFilteredBuddies(fetchedBuddies);
        } else {
          // If no profiles are found, show empty state
          setBuddies([]);
          setFilteredBuddies([]);
          toast({
            title: 'No buddies found',
            description: 'No profiles are available in the system',
            variant: 'default',
          });
        }
      } catch (error) {
        console.error('Error fetching buddies:', error);
        toast({
          title: 'Error',
          description: 'Failed to load buddies. Please try again.',
          variant: 'destructive',
        });
        
        setBuddies([]);
        setFilteredBuddies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBuddies();
  }, [toast]);
  
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
            <AnimatePresence>
              {filteredBuddies.map((buddy) => (
                <motion.div
                  key={buddy.id}
                  variants={item}
                  layoutId={buddy.id}
                  className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => handleBuddyClick(buddy.id)}
                >
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(buddy.status)} mr-2`}></div>
                    <span className="font-medium dark:text-white">{buddy.username}</span>
                    {buddy.hasNewMessages && (
                      <Badge className="ml-2 bg-uzzap-green text-white">
                        New
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {buddy.status === 'online' ? 'Online' : buddy.lastSeen}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredBuddies.length === 0 && !loading && (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                {searchQuery ? `No buddies found matching "${searchQuery}"` : "No buddies available"}
              </div>
            )}
          </motion.div>
        )}
      </ScrollArea>
    </div>
  );
};

export default BuddyList;
