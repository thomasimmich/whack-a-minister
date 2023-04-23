export interface Highscore {
  id: number;
  player: string;
  score: number;
  created_at: string;
}

export interface PropsWithFunction {
  playFunction: () => void;
}
