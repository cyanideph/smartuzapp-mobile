
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PrivateMessage from '@/components/buddies/PrivateMessage';

const PrivateMessagePage: React.FC = () => {
  return (
    <MainLayout showHeader={true} showFooter={false} showBackButton={true}>
      <PrivateMessage />
    </MainLayout>
  );
};

export default PrivateMessagePage;
