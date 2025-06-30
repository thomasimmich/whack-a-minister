export interface Score {
  id: string;
  name: string;
  points: number;
  date: string; // ISO timestamp
}

export interface CelebrationData {
  rank: number;
  total: number;
} 