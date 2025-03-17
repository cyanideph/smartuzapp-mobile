
import { ChatRoom } from '@/types/chatRoom';

export const useRoomTabs = (filteredRooms: ChatRoom[]) => {
  // Get filtered rooms based on the active tab
  const getFilteredRoomsByTab = (activeTab: string) => {
    if (activeTab === 'popular') {
      return [...filteredRooms].sort((a, b) => (b.participants || 0) - (a.participants || 0));
    } else if (activeTab === 'recent') {
      return [...filteredRooms].sort((a, b) => {
        if (a.lastMessageTime && b.lastMessageTime) {
          return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
        } else if (a.lastMessageTime) {
          return -1;
        } else if (b.lastMessageTime) {
          return 1;
        }
        return 0;
      });
    } else if (activeTab === 'active') {
      return [...filteredRooms].filter(room => room.hasActivity);
    }
    return filteredRooms;
  };

  return {
    getFilteredRoomsByTab
  };
};
