
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import UzzapLogo from '@/components/logo/UzzapLogo';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <MainLayout showHeader={true} showFooter={true} showBackButton={true} title="About">
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center mb-6"
        >
          <UzzapLogo size="md" showBeta={true} />
          <p className="text-gray-500 mt-2">Version 1.0.0 (Beta)</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="uzzap-card p-4 mb-4"
        >
          <h2 className="text-lg font-semibold mb-2">About Uzzap</h2>
          <p className="text-gray-600 mb-3">
            Uzzap is a nostalgic messaging app inspired by classic instant messengers from the 2000s era. 
            It combines retro design elements with modern functionality to create a unique communication experience.
          </p>
          <p className="text-gray-600">
            Originally launched in the early 2000s, Uzzap was popular in Southeast Asia for its simple interface 
            and chat room features. This modern recreation pays homage to the original while adding contemporary 
            improvements.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="uzzap-card p-4 mb-4"
        >
          <h2 className="text-lg font-semibold mb-2">Features</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Private messaging with friends</li>
            <li>Public chat rooms by interest</li>
            <li>Buddy list management</li>
            <li>Status updates</li>
            <li>Nostalgic UI with modern touches</li>
          </ul>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="uzzap-card p-4"
        >
          <h2 className="text-lg font-semibold mb-2">Legal</h2>
          <p className="text-gray-600 text-sm">
            © 2023 Uzzap Messenger. All rights reserved.<br />
            This is a demo application created for educational purposes.
          </p>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default About;
