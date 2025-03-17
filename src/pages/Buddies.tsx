
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import BuddyList from '@/components/buddies/BuddyList';

const Buddies: React.FC = () => {
  return (
    <MainLayout showHeader={true} showFooter={true} showBackButton={true} title="My Buddies">
      <BuddyList />
    </MainLayout>
  );
};

export default Buddies;
