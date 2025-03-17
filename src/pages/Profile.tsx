
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [status, setStatus] = useState('online');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('uzzap_user');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleSaveProfile = () => {
    setIsLoading(true);
    
    // In a real app with authentication, we would update the profile in Supabase here
    // For now, just update localStorage
    localStorage.setItem('uzzap_user', username);
    localStorage.setItem('uzzap_bio', bio);
    localStorage.setItem('uzzap_status', status);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
    
    setIsLoading(false);
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <MainLayout showHeader={true} showFooter={true} showBackButton={true} title="My Profile">
      <div className="p-4 flex flex-col items-center">
        <div className="mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src="" alt={username} />
            <AvatarFallback className="bg-uzzap-green text-white text-xl">
              {getInitials(username)}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="w-full max-w-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Your username"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              placeholder="Tell us about yourself"
              className="resize-none h-24"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="away">Away</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            className="w-full bg-uzzap-green hover:bg-uzzap-darkGreen mt-4"
            onClick={handleSaveProfile}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
