
import React from 'react';

interface RoomHeaderProps {
  title: string;
  onlineUsers: number;
}

const RoomHeader: React.FC<RoomHeaderProps> = ({ title, onlineUsers }) => {
  return (
    <div className="bg-uzzap-green text-white py-2 px-4 flex justify-between items-center">
      <h2 className="font-semibold">{title}</h2>
      <div className="text-sm">
        <span className="mr-1">●</span>
        Online: {onlineUsers}
      </div>
    </div>
  );
};

export default RoomHeader;
