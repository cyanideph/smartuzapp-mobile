
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from 'framer-motion';

const Help: React.FC = () => {
  const faqs = [
    {
      question: "How do I add buddies?",
      answer: "To add buddies, navigate to the Buddies section from the home screen, then tap the Add button at the bottom of the screen and enter their Uzzap ID."
    },
    {
      question: "How do I join a chat room?",
      answer: "Go to the Chatrooms section from the home screen, browse through the available rooms, and tap on any room to join the conversation."
    },
    {
      question: "Can I create my own chat room?",
      answer: "Yes! In the Chatrooms section, tap on the 'Create Room' button at the bottom of the screen and follow the prompts to set up your own room."
    },
    {
      question: "How do I change my status?",
      answer: "From the home screen, tap on the Profile section, then select 'Status' to choose from available options: Online, Away, Busy, or Invisible."
    },
    {
      question: "Is my conversation history saved?",
      answer: "Uzzap saves your conversation history on your device. You can clear your history in the Settings under Privacy & Data."
    },
    {
      question: "How do I block someone?",
      answer: "Open a chat with the person you want to block, tap on their name at the top of the screen to view their profile, then select 'Block User'."
    }
  ];

  return (
    <MainLayout showHeader={true} showFooter={true} showBackButton={true} title="Help Center">
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="uzzap-card p-4 mb-4"
        >
          <h2 className="text-xl font-semibold mb-2">Welcome to Uzzap Help</h2>
          <p className="text-gray-600">
            Find answers to common questions and learn how to make the most of Uzzap messenger.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mt-6 text-center text-gray-500 text-sm"
        >
          <p>Still need help? Contact our support team:</p>
          <p className="font-medium text-uzzap-green">support@uzzap.com</p>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Help;
