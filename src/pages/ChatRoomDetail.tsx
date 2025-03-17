
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ChatRoom from '@/components/chat/ChatRoom';

const ChatRoomDetail: React.FC = () => {
  return (
    <MainLayout showHeader={true} showFooter={false} showBackButton={true}>
      <ChatRoom />
    </MainLayout>
  );
};

export default ChatRoomDetail;
