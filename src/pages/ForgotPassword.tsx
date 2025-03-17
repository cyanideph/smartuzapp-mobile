
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate password reset process
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Reset link sent",
        description: "If an account with this email exists, you will receive a password reset link.",
      });
      
      navigate('/');
    }, 1500);
  };

  return (
    <MainLayout showHeader={true} showFooter={false} showBackButton={true} title="Recover Password">
      <div className="p-4 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="uzzap-card p-6">
            <h2 className="text-xl font-semibold text-center mb-4">Forgotten ID/Password</h2>
            <p className="text-gray-600 mb-4 text-center">Enter your email address below and we'll send you a password reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="uzzap-input"
                  required
                />
              </div>
              <div className="flex justify-between pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="min-w-[80px]"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="min-w-[80px] bg-uzzap-green hover:bg-uzzap-darkGreen"
                >
                  {isLoading ? "Sending..." : "Reset"}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default ForgotPassword;
