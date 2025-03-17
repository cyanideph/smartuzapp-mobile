
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/contexts/ThemeContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import ChatRooms from "./pages/ChatRooms";
import ChatRoomDetail from "./pages/ChatRoomDetail";
import CreateChatRoom from "./pages/CreateChatRoom";
import Buddies from "./pages/Buddies";
import Messages from "./pages/Messages";
import PrivateMessagePage from "./pages/PrivateMessagePage";
import Help from "./pages/Help";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AddBuddy from "./pages/AddBuddy";
import Connections from "./pages/Connections";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/home" element={<Home />} />
              <Route path="/chatrooms" element={<ChatRooms />} />
              <Route path="/chat/room/:roomId" element={<ChatRoomDetail />} />
              <Route path="/create-chatroom" element={<CreateChatRoom />} />
              <Route path="/buddies" element={<Buddies />} />
              <Route path="/add-buddy" element={<AddBuddy />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/message/:buddyId" element={<PrivateMessagePage />} />
              <Route path="/help" element={<Help />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
