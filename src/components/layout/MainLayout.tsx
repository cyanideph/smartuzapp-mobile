
import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import UzzapLogo from '../logo/UzzapLogo';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { User, Settings, ChevronLeft, Home, Menu } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showBackButton?: boolean;
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  showBackButton = false,
  title
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleOptions = () => {
    navigate('/settings');
  };
  
  const handleHome = () => {
    if (location.pathname !== '/home') {
      navigate('/home');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      {showHeader && (
        <motion.header 
          className="sticky top-0 z-10 bg-gradient-to-r from-uzzap-darkGreen to-uzzap-green p-3 shadow-md"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {showBackButton && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleBack}
                  className="mr-2 text-white hover:bg-uzzap-darkGreen hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
              <div className="cursor-pointer" onClick={handleHome}>
                <UzzapLogo size="sm" showBeta={true} />
              </div>
            </div>
            {title && (
              <h1 className="text-lg font-semibold text-white ml-2">{title}</h1>
            )}
            <div className="flex items-center gap-1">
              <ThemeToggle />
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/profile')}
                className="rounded-full w-8 h-8 text-white hover:bg-uzzap-darkGreen"
              >
                <User className="h-4 w-4" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full w-8 h-8 text-white hover:bg-uzzap-darkGreen"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.header>
      )}
      
      <motion.main 
        className="flex-1 overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {children}
      </motion.main>
      
      {showFooter && (
        <motion.footer 
          className="sticky bottom-0 z-10 bg-black text-white p-2 flex justify-around items-center shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            variant="ghost" 
            className="text-white hover:bg-gray-800"
            onClick={handleOptions}
          >
            <Settings className="h-5 w-5" />
            <span className="ml-1 text-xs">Options</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="text-white hover:bg-gray-800"
            onClick={handleHome}
          >
            <Home className="h-5 w-5" />
            <span className="ml-1 text-xs">Home</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="text-white hover:bg-gray-800"
            onClick={() => navigate('/buddies')}
          >
            <User className="h-5 w-5" />
            <span className="ml-1 text-xs">Buddies</span>
          </Button>
        </motion.footer>
      )}
    </div>
  );
};

export default MainLayout;
