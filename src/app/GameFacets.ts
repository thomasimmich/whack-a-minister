import { Facet } from '../base/Facet';

export interface ScoreProps {
  scoreValue: number;
}
export class ScoreFacet extends Facet<ScoreProps> {
  constructor(props: ScoreProps) {
    super(props);
  }
}

export enum GameStates {
  WELCOME,
  PLAYING,

  GAME_OVER,

  HIGH_SCORES,
}
export interface GameStateProps {
  gameState: number;
}
export class GameStateFacet extends Facet<GameStateProps> {
  constructor(props: GameStateProps) {
    super(props);
  }
}
