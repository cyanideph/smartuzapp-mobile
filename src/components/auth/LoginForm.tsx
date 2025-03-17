
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [autoConnect, setAutoConnect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, allow any login
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${username}!`,
      });
      
      localStorage.setItem('uzzap_user', username);
      navigate('/home');
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="uzzap-card p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Login to network</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="uzzap-input"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="uzzap-input"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="autoConnect" 
              checked={autoConnect}
              onCheckedChange={(checked) => setAutoConnect(!!checked)}
            />
            <Label htmlFor="autoConnect" className="text-sm cursor-pointer">
              Network access point (automatic)
            </Label>
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
              {isLoading ? "Connecting..." : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default LoginForm;
