
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

// Define regions and provinces data structure
const philippineRegions = {
  'NCR': ['Manila'],
  'CAR': ['Abra', 'Apayao', 'Benguet', 'Ifugao', 'Kalinga', 'Mountain Province'],
  'Region I': ['Ilocos Norte', 'Ilocos Sur', 'La Union', 'Pangasinan'],
  'Region II': ['Batanes', 'Cagayan', 'Isabela', 'Nueva Vizcaya', 'Quirino'],
  'Region III': ['Aurora', 'Bataan', 'Bulacan', 'Nueva Ecija', 'Pampanga', 'Tarlac', 'Zambales'],
  'Region IV-A': ['Cavite', 'Laguna', 'Batangas', 'Rizal', 'Quezon'],
  'Region IV-B': ['Marinduque', 'Occidental Mindoro', 'Oriental Mindoro', 'Palawan', 'Romblon'],
  'Region V': ['Albay', 'Camarines Norte', 'Camarines Sur', 'Catanduanes', 'Masbate', 'Sorsogon'],
  'Region VI': ['Aklan', 'Antique', 'Capiz', 'Guimaras', 'Iloilo', 'Negros Occidental'],
  'Region VII': ['Bohol', 'Cebu', 'Negros Oriental', 'Siquijor'],
  'Region VIII': ['Biliran', 'Eastern Samar', 'Leyte', 'Northern Samar', 'Samar', 'Southern Leyte'],
  'Region IX': ['Zamboanga del Norte', 'Zamboanga del Sur', 'Zamboanga Sibugay'],
  'Region X': ['Bukidnon', 'Camiguin', 'Lanao del Norte', 'Misamis Occidental', 'Misamis Oriental'],
  'Region XI': ['Davao de Oro', 'Davao del Norte', 'Davao del Sur', 'Davao Occidental', 'Davao Oriental'],
  'Region XII': ['Cotabato', 'Sarangani', 'South Cotabato', 'Sultan Kudarat'],
  'Region XIII': ['Agusan del Norte', 'Agusan del Sur', 'Dinagat Islands', 'Surigao del Norte', 'Surigao del Sur'],
  'BARMM': ['Basilan', 'Lanao del Sur', 'Maguindanao del Norte', 'Maguindanao del Sur', 'Sulu', 'Tawi-Tawi']
};

// Get region titles with format numbers
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
  'BARMM': '17. Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)'
};

const CreateChatRoom: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState<string | undefined>(undefined);
  const [province, setProvince] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegionChange = (value: string) => {
    setRegion(value);
    setProvince(undefined); // Reset province when region changes
  };

  const handleCreateRoom = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please provide a room name",
        variant: "destructive",
      });
      return;
    }

    if (!region) {
      toast({
        title: "Error",
        description: "Please select a region",
        variant: "destructive",
      });
      return;
    }

    // We'll still set category for backward compatibility, but now also set region and province
    const category = province ? `${region} - ${province}` : region;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .insert([
          { 
            name, 
            description, 
            category,
            region,
            province 
          }
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
            <Label htmlFor="region">Region*</Label>
            <Select value={region} onValueChange={handleRegionChange}>
              <SelectTrigger id="region" className="w-full">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(regionTitles).map((key) => (
                  <SelectItem key={key} value={key}>
                    {regionTitles[key as keyof typeof regionTitles]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {region && (
            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger id="province" className="w-full">
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  {philippineRegions[region as keyof typeof philippineRegions].map((prov) => (
                    <SelectItem key={prov} value={prov}>
                      {prov}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
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
