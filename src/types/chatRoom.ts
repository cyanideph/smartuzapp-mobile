
export interface ChatRoom {
  id: string;
  name: string;
  participants?: number;
  category?: string | null;
  region?: string | null;
  province?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  hasActivity?: boolean;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

export const regionTitles: Record<string, string> = {
  'NCR': '1. National Capital Region (NCR)',
  'CAR': '2. Cordillera Administrative Region (CAR)',
  'Region I': '3. Ilocos Region (Region I)',
  'Region II': '4. Cagayan Valley (Region II)',
  'Region III': '5. Central Luzon (Region III)',
  'Region IV-A': '6. CALABARZON (Region IV-A)',
  'Region IV-B': '7. MIMAROPA (Region IV-B)',
  'Region V': '8. Bicol Region (Region V)',
  'Region VI': '9. Western Visayas (Region VI)',
  'Region VII': '10. Central Visayas (Region VII)',
  'Region VIII': '11. Eastern Visayas (Region VIII)',
  'Region IX': '12. Zamboanga Peninsula (Region IX)',
  'Region X': '13. Northern Mindanao (Region X)',
  'Region XI': '14. Davao Region (Region XI)',
  'Region XII': '15. SOCCSKSARGEN (Region XII)',
  'Region XIII': '16. Caraga (Region XIII)',
  'BARMM': '17. Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)',
  'Other': 'Other Categories'
};

export const allRegions = Object.keys(regionTitles);
