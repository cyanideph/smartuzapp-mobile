
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import MenuButton from '@/components/home/MenuButton';
import NavButton from '@/components/navigation/NavButton';
import { MessageSquare, User, Users, Globe, Settings, Plus, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [username, setUsername] = useState('Guest');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const storedUsername = localStorage.getItem('uzzap_user');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      navigate('/');
    }
  }, [navigate]);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const menuCategories = [
    {
      title: "Communication",
      items: [
        { icon: Users, label: "Buddies", onClick: () => navigate('/buddies') },
        { icon: UserPlus, label: "Add Buddy", onClick: () => navigate('/add-buddy') },
        { icon: MessageSquare, label: "Messages", onClick: () => navigate('/messages') },
        { icon: Users, label: "Chatrooms", onClick: () => navigate('/chatrooms') },
        { icon: Plus, label: "Create Room", onClick: () => navigate('/create-chatroom') },
        { icon: Globe, label: "Connections", onClick: () => navigate('/connections') },
      ]
    },
    {
      title: "Account",
      items: [
        { icon: User, label: "Profile", onClick: () => navigate('/profile') },
        { icon: Settings, label: "Settings", onClick: () => navigate('/settings') },
        { icon: MessageSquare, label: "Status", onClick: () => {
          const status = localStorage.getItem('uzzap_status') || 'online';
          toast({
            title: "Status updated",
            description: `Your status has been set to ${status}.`,
          });
        }},
      ]
    }
  ];
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <MainLayout showHeader={true} showFooter={true}>
      <div className="flex flex-col h-full">
        <div className="bg-gradient-to-b from-uzzap-darkGreen to-uzzap-green p-4 text-white">
          <h2 className="text-lg font-semibold">Welcome, {username}!</h2>
          <p className="text-sm opacity-80">What would you like to do today?</p>
        </div>
        
        <div className="flex-1 p-4 overflow-auto">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {menuCategories.map((category, idx) => (
              <motion.div key={idx} variants={item} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{category.title}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {category.items.map((menuItem, i) => (
                    <MenuButton
                      key={i}
                      icon={menuItem.icon}
                      label={menuItem.label}
                      onClick={menuItem.onClick}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800 grid grid-cols-4">
          <NavButton
            icon={User}
            label="Profile"
            active={activeTab === 'profile'}
            onClick={() => navigate('/profile')}
          />
          <NavButton
            icon={Users}
            label="Buddies"
            active={activeTab === 'buddies'}
            onClick={() => navigate('/buddies')}
          />
          <NavButton
            icon={MessageSquare}
            label="Chat"
            active={activeTab === 'chat'}
            onClick={() => navigate('/chatrooms')}
          />
          <NavButton
            icon={Settings}
            label="Settings"
            active={activeTab === 'settings'}
            onClick={() => navigate('/settings')}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
