export interface Highscore {
  id: number;
  user: string;
  score: number;
  date: string;
}

export interface MenuProps {
  highscores: Highscore[];
  playFunction: () => void;
}
export interface HomeProps {
  playFunction: () => void;
}

export interface ScoreboardProps {
  highscores: Highscore[];
}
