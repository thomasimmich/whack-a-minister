import { Facet } from '../base/Facet';

export interface CurrentDialougeProps {
  currentDialougeArray: string[];
}
export class CurrentDialougeFacet extends Facet<CurrentDialougeProps> {
  constructor(props: CurrentDialougeProps) {
    super(props);
  }
}

export interface CurrentLevelProps {
  currentLevelValue: number;
}
export class CurrentLevelFacet extends Facet<CurrentLevelProps> {
  constructor(props: CurrentLevelProps) {
    super(props);
  }
}
export interface  IsActiveProps {
  isActive: boolean;
}
export class IsActiveFacet extends Facet<IsActiveProps> {
  constructor(props: IsActiveProps) {
    super(props);
  }
}

export interface  BuildCodeProps {
  buildCode: string;
}
export class BuildCodeFacet extends Facet<BuildCodeProps> {
  constructor(props: BuildCodeProps) {
    super(props);
  }
}

export interface  ImageProps {
  src: string;
}
export class ImageFacet extends Facet<ImageProps> {
  constructor(props: ImageProps = {src: "/untiteld.png"}) {
    super(props);
  }
}

export interface NameProps {
  name: string;
}
export class NameFacet extends Facet<NameProps> {
  constructor(props: NameProps = {name: "untiteld"}) {
    super(props);
  }
}

export interface ScoreProps {
  scoreValue: number;
}
export class ScoreFacet extends Facet<ScoreProps> {
  constructor(props: ScoreProps) {
    super(props);
  }
}

export interface CoinsProps {
  coinsValue: number;
}
export class CoinsFacet extends Facet<CoinsProps> {
  constructor(props: CoinsProps) {
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
  PAUSE,
  GAME_OVER,
  HIGH_SCORES,
  LEVEL_DONE,
  DIALOUGE,
}
export interface GameStateProps {
  gameState: GameStates;
}
export class GameStateFacet extends Facet<GameStateProps> {
  constructor(props: GameStateProps) {
    super(props);
  }
}
