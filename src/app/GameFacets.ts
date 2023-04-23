import { Facet } from '../base/Facet';

export interface ScoreProps {
  scoreValue: number;
}
export class ScoreFacet extends Facet<ScoreProps> {
  constructor(props: ScoreProps) {
    super(props);
  }
}

export interface HitableProps {
  hitCount: number;
}
export class HitableFacet extends Facet<HitableProps> {
  constructor(props: HitableProps) {
    super(props);
  }
}

export interface ActivationProps {
  activationCode: string;
}
export class ActivationFacet extends Facet<ActivationProps> {
  constructor(props: ActivationProps) {
    super(props);
  }
}

export interface LevelProps {
  levelValue: number;
}
export class LevelFacet extends Facet<LevelProps> {
  constructor(props: LevelProps) {
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
