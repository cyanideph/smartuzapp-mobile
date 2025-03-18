
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = "https://fewqpgedjhvvbjgjtejj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZld3FwZ2Vkamh2dmJqZ2p0ZWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMTk5MDcsImV4cCI6MjA1Nzc5NTkwN30.KPDUtTRXCHExRzoyNG7vHcCHsm0n08n7yb8d1VFGP44";

// Create Supabase client with AsyncStorage for React Native
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
