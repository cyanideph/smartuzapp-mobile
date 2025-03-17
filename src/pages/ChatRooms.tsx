
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RoomList from '@/components/chat/RoomList';

const ChatRooms: React.FC = () => {
  return (
    <MainLayout showHeader={true} showFooter={true} showBackButton={true} title="Chat Rooms">
      <RoomList />
    </MainLayout>
  );
};

export default ChatRooms;
