
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import BuddyList from '@/components/buddies/BuddyList';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

const Buddies: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <MainLayout showHeader={true} showFooter={true} showBackButton={true} title="My Buddies">
      <div className="relative h-full">
        <BuddyList />
        <div className="absolute bottom-4 right-4">
          <Button 
            className="rounded-full bg-uzzap-green hover:bg-uzzap-darkGreen h-12 w-12 p-0 shadow-lg"
            onClick={() => navigate('/add-buddy')}
          >
            <UserPlus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Buddies;
