
import React from 'react';
import { useNavigate } from 'react-router-dom';
import UzzapLogo from '@/components/logo/UzzapLogo';
import { motion } from 'framer-motion';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const menuOptions = [
    { id: 'login', label: 'Login to Network', onClick: () => navigate('/login') },
    { id: 'register', label: 'Register a New Account', onClick: () => navigate('/register') },
    { id: 'forgot', label: 'Forgotten ID/Password', onClick: () => navigate('/forgot-password') },
    { id: 'help', label: 'Help', onClick: () => navigate('/help') },
    { id: 'about', label: 'About Uzzap', onClick: () => navigate('/about') },
    { id: 'exit', label: 'Exit Application', onClick: () => window.close() },
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10"
        >
          <UzzapLogo size="lg" showBeta={true} />
        </motion.div>
        
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full max-w-md"
        >
          {menuOptions.map((option) => (
            <motion.button
              key={option.id}
              variants={item}
              className="uzzap-button mb-3 relative overflow-hidden group"
              onClick={option.onClick}
            >
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center mr-3"
              >
                <span className="w-1 h-1 rounded-full bg-gray-500"></span>
              </motion.span>
              <span>{option.label}</span>
              <motion.div 
                className="absolute left-0 top-0 h-full w-0 bg-uzzap-green/10 transition-all duration-300 group-hover:w-full"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
              />
            </motion.button>
          ))}
        </motion.div>
      </div>
      
      <motion.div 
        className="py-4 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p>© 2023 Uzzap Messenger</p>
      </motion.div>
    </div>
  );
};

export default Welcome;
