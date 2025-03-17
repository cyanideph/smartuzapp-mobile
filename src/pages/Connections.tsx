
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Globe, MessageSquare, Smartphone, Laptop, Share2 } from 'lucide-react';

const Connections: React.FC = () => {
  const { toast } = useToast();
  const [mobileConnected, setMobileConnected] = useState(false);
  const [desktopConnected, setDesktopConnected] = useState(true);
  const [webConnected, setWebConnected] = useState(false);

  const handleToggleMobile = () => {
    setMobileConnected(!mobileConnected);
    toast({
      title: !mobileConnected ? "Mobile Connected" : "Mobile Disconnected",
      description: !mobileConnected 
        ? "Your account is now connected to the mobile app" 
        : "Your account has been disconnected from the mobile app",
    });
  };

  const handleToggleDesktop = () => {
    setDesktopConnected(!desktopConnected);
    toast({
      title: !desktopConnected ? "Desktop Connected" : "Desktop Disconnected",
      description: !desktopConnected 
        ? "Your account is now connected to the desktop app" 
        : "Your account has been disconnected from the desktop app",
    });
  };

  const handleToggleWeb = () => {
    setWebConnected(!webConnected);
    toast({
      title: !webConnected ? "Web Connected" : "Web Disconnected",
      description: !webConnected 
        ? "Your account is now connected to the web app" 
        : "Your account has been disconnected from the web app",
    });
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText('https://uzzap.lovable.dev/');
    toast({
      title: "Link Copied",
      description: "Invite link has been copied to clipboard",
    });
  };

  return (
    <MainLayout showHeader={true} showFooter={true} showBackButton={true} title="Connections">
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="mr-2 text-uzzap-green" />
              Mobile App
            </CardTitle>
            <CardDescription>Connect your account to Uzzap mobile app</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <span className={mobileConnected ? "text-green-500" : "text-gray-500"}>
              {mobileConnected ? "Connected" : "Disconnected"}
            </span>
            <Switch checked={mobileConnected} onCheckedChange={handleToggleMobile} />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Laptop className="mr-2 text-uzzap-green" />
              Desktop App
            </CardTitle>
            <CardDescription>Connect your account to Uzzap desktop app</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <span className={desktopConnected ? "text-green-500" : "text-gray-500"}>
              {desktopConnected ? "Connected" : "Disconnected"}
            </span>
            <Switch checked={desktopConnected} onCheckedChange={handleToggleDesktop} />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 text-uzzap-green" />
              Web App
            </CardTitle>
            <CardDescription>Connect your account to Uzzap web app</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <span className={webConnected ? "text-green-500" : "text-gray-500"}>
              {webConnected ? "Connected" : "Disconnected"}
            </span>
            <Switch checked={webConnected} onCheckedChange={handleToggleWeb} />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 text-uzzap-green" />
              Invite Friends
            </CardTitle>
            <CardDescription>Share Uzzap with your friends</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Send this link to your friends to invite them to Uzzap:</p>
            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md flex justify-between items-center">
              <span className="text-sm truncate">https://uzzap.lovable.dev/</span>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={handleShareLink}
                className="ml-2"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-uzzap-green hover:bg-uzzap-darkGreen"
              onClick={handleShareLink}
            >
              Copy Invite Link
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Connections;
