export enum GameState {
  LOADING,
  SPLASH,
  IDLE,
  HITTING,
  TIME_BONUS,
  GAME_OVER,
  LEADERBOARD,
}

export enum CharacterType {
  ENEMY = "ENEMY",
  FRIEND = "FRIEND",
  TIME_BONUS = "TIME_BONUS",
}

export type CharacterState = "normal" | "hit" | "whacked";

export interface MaskConfig {
  width: number;
  height: number;
  bottomHeight: number;
  rotation: number;
  points?: { x: number; y: number }[]; // Optional custom points for complex masks
}

export interface CharacterPosition {
  x: number;
  y: number;
  maskConfig?: MaskConfig; // Optional custom mask config for this position
}

export interface Character {
  id: number;
  type: CharacterType;
  position: CharacterPosition;
  isVisible: boolean;
  state: CharacterState;
  visibleTime: number;
  hiddenTime: number;
  scale: number;
}

export type CharacterImages = Record<
  CharacterType,
  Record<CharacterState, string>
>;

export interface HammerAnimation {
  isActive: boolean;
  rotation: number;
  position: {
    x: number;
    y: number;
  };
}

export interface GameDimensions {
  width: number;
  height: number;
}
