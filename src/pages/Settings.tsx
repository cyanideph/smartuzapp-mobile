
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [status, setStatus] = useState('online');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('uzzap_user');
    if (username) {
      setDisplayName(username);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('uzzap_notifications', notifications.toString());
      localStorage.setItem('uzzap_sound_effects', soundEffects.toString());
      localStorage.setItem('uzzap_status', status);
      
      if (displayName && displayName !== localStorage.getItem('uzzap_user')) {
        localStorage.setItem('uzzap_user', displayName);
      }
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('uzzap_user');
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <MainLayout showHeader={true} showFooter={true} showBackButton={true} title="Settings">
      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Account</h2>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input 
                id="displayName" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                placeholder="Your display name"
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
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Appearance</h2>
          <div className="flex items-center justify-between">
            <Label htmlFor="darkMode">Dark Mode</Label>
            <Switch 
              id="darkMode" 
              checked={theme === 'dark'} 
              onCheckedChange={toggleTheme} 
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Notifications</h2>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Enable Notifications</Label>
            <Switch 
              id="notifications" 
              checked={notifications} 
              onCheckedChange={setNotifications} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="soundEffects">Sound Effects</Label>
            <Switch 
              id="soundEffects" 
              checked={soundEffects} 
              onCheckedChange={setSoundEffects} 
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <Button 
            className="w-full bg-uzzap-green hover:bg-uzzap-darkGreen"
            onClick={handleSaveSettings}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
          
          <Button 
            className="w-full" 
            variant="outline"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
