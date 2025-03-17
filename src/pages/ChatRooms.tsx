
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import RoomList from '@/components/chat/RoomList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const ChatRooms: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <MainLayout showHeader={true} showFooter={true} showBackButton={true} title="Chat Rooms">
      <div className="relative h-full">
        <RoomList />
        <div className="absolute bottom-4 right-4">
          <Button 
            className="rounded-full bg-uzzap-green hover:bg-uzzap-darkGreen h-12 w-12 p-0 shadow-lg"
            onClick={() => navigate('/create-chatroom')}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatRooms;
