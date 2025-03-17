
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Plus, Search } from 'lucide-react';

const AddBuddy: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', `%${searchQuery}%`)
        .limit(10);
      
      if (error) {
        throw error;
      }
      
      setSearchResults(data || []);
      
      if (data && data.length === 0) {
        toast({
          title: "No results",
          description: "No users found matching your search.",
        });
      }
    } catch (error) {
      console.error('Error searching for users:', error);
      toast({
        title: "Error",
        description: "Failed to search for users. Please try again.",
        variant: "destructive",
      });
      
      // Fallback for demo purposes
      setSearchResults([
        { id: '1', username: 'GameMaster42', status: 'online' },
        { id: '2', username: 'PixelWarrior', status: 'online' },
        { id: '3', username: 'NeonRider', status: 'away' }
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddBuddy = async (buddyId: string, buddyName: string) => {
    try {
      toast({
        title: "Buddy added",
        description: `${buddyName} has been added to your buddies list.`,
      });
      
      // In a real app with authentication, you would add the buddy to the database here
      navigate('/buddies');
    } catch (error) {
      console.error('Error adding buddy:', error);
      toast({
        title: "Error",
        description: "Failed to add buddy. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout showHeader={true} showFooter={true} showBackButton={true} title="Add Buddy">
      <div className="p-4">
        <div className="space-y-4 max-w-md mx-auto">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Search by username"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-uzzap-green hover:bg-uzzap-darkGreen"
            >
              {isSearching ? (
                <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
          </div>
          
          <div className="mt-6 space-y-3">
            <Label>Search Results</Label>
            
            {isSearching ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-uzzap-green rounded-full"></div>
              </div>
            ) : (
              searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((user) => (
                    <div 
                      key={user.id} 
                      className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          user.status === 'online' ? 'bg-green-500' : 
                          user.status === 'away' ? 'bg-yellow-500' :
                          user.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
                        } mr-2`}></div>
                        <span className="font-medium dark:text-white">{user.username}</span>
                      </div>
                      <Button 
                        size="sm"
                        className="bg-uzzap-green hover:bg-uzzap-darkGreen"
                        onClick={() => handleAddBuddy(user.id, user.username)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 flex flex-col items-center">
                  <User className="h-12 w-12 mb-2 opacity-50" />
                  <p>Search for users to add as buddies</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddBuddy;
