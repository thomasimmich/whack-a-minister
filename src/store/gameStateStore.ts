import { create } from "zustand";
import { GameState } from "../types/gameTypes";

interface GameStateStore {
  gameState: GameState;
  previousGameState: GameState | null;
  setGameState: (gameState: GameState) => void;
  showAddScoreModalOnLeaderboard: boolean;
  setShowAddScoreModalOnLeaderboard: (show: boolean) => void;
}

export const useGameStateStore = create<GameStateStore>((set) => ({
  gameState: GameState.SPLASH,
  previousGameState: null,
  setGameState: (gameState: GameState) =>
    set((state) => ({
      gameState,
      previousGameState: state.gameState,
    })),
  showAddScoreModalOnLeaderboard: false,
  setShowAddScoreModalOnLeaderboard: (show: boolean) =>
    set({ showAddScoreModalOnLeaderboard: show }),
}));
