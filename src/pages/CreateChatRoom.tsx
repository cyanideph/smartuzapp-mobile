
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CreateChatRoom: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Games');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please provide a room name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .insert([
          { name, description, category }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Chat room created successfully!",
      });
      
      navigate('/chatrooms');
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: "Error",
        description: "Failed to create chat room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout showHeader={true} showFooter={true} showBackButton={true} title="Create Chat Room">
      <div className="p-4">
        <div className="space-y-4 max-w-md mx-auto">
          <div className="space-y-2">
            <Label htmlFor="name">Room Name*</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter room name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Games">Games</SelectItem>
                <SelectItem value="Music">Music</SelectItem>
                <SelectItem value="Movies">Movies</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Describe what this room is about"
              className="resize-none h-24"
            />
          </div>
          
          <Button 
            className="w-full bg-uzzap-green hover:bg-uzzap-darkGreen mt-4"
            onClick={handleCreateRoom}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Room'}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateChatRoom;
