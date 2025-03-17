
import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import UzzapLogo from '../logo/UzzapLogo';

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
    // Options functionality would go here
  };
  
  const handleHome = () => {
    if (location.pathname !== '/home') {
      navigate('/home');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
                </Button>
              )}
              <UzzapLogo size="sm" showBeta={true} />
            </div>
            {title && (
              <h1 className="text-lg font-semibold text-white ml-2">{title}</h1>
            )}
            <div className="flex-1"></div>
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
            Options
          </Button>
          
          <Button 
            variant="ghost" 
            className="text-white hover:bg-gray-800"
            onClick={handleHome}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </Button>
          
          <Button 
            variant="ghost" 
            className="text-white hover:bg-gray-800"
          >
            Hide
          </Button>
        </motion.footer>
      )}
    </div>
  );
};

export default MainLayout;
