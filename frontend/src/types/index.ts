export interface User {
  id: number;
  username: string;
  avatar: string;
  coins: number;
  level: number;
  rating: number;
  wins: number;
  losses: number;
}

export interface Tournament {
  id: number;
  name: string;
  participants: number;
  maxParticipants: number;
  entryFee: number;
  prizePool: number;
  status: 'upcoming' | 'ongoing' | 'finished';
  startTime: string;
  endTime?: string;
}

export interface ShopItem {
  id: number;
  name: string;
  description: string;
  price: number;
  type: 'cosmetic' | 'powerup' | 'badge';
  icon: string;
  owned?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  points: number;
}
