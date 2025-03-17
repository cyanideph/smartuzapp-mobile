
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import BuddyList from '@/components/buddies/BuddyList';

const Messages: React.FC = () => {
  return (
    <MainLayout showHeader={true} showFooter={true} showBackButton={true} title="Messages">
      <BuddyList />
    </MainLayout>
  );
};

export default Messages;
