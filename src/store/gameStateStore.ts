import { create } from "zustand";
import { GameState } from "../types/gameTypes";

interface GameStateStore {
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
}

export const useGameStateStore = create<GameStateStore>((set) => ({
  gameState: GameState.SPLASH,
  setGameState: (gameState: GameState) => set({ gameState }),
}));
