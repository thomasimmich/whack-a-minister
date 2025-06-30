import { create } from "zustand";

interface GameState {
  gameTime: number;
  isPlaying: boolean;
  startTime: number | null;
  timeLeft: number;
  score: number;
  scoreRoll: number;
  // Actions
  startGame: () => void;
  stopGame: () => void;
  updateGameTime: () => void;
  getSpeedMultiplier: () => number;
  setTimeLeft: (time: number) => void;
  addScore: (points: number) => void;
  resetScore: () => void;
  incrementScoreRoll: () => void;
  resetScoreRoll: () => void;
}

const AVAILABLE_TIME = 60; // Total game time in seconds

export const useGameStore = create<GameState>((set, get) => ({
  gameTime: 0,
  isPlaying: false,
  startTime: null,
  timeLeft: AVAILABLE_TIME,
  score: 0,
  scoreRoll: 0,

  startGame: () => {
    set({
      isPlaying: true,
      startTime: Date.now(),
      gameTime: 0,
      timeLeft: AVAILABLE_TIME,
      score: 0,
      scoreRoll: 0,
    });
  },

  stopGame: () => {
    set({
      isPlaying: false,
      startTime: null,
    });
  },

  updateGameTime: () => {
    const { startTime } = get();
    if (startTime) {
      set({ gameTime: (Date.now() - startTime) / 1000 }); // Convert to seconds
    }
  },

  setTimeLeft: (time: number) => {
    set({ timeLeft: time });
  },

  addScore: (points: number) => {
    set((state) => ({ score: state.score + points }));
  },

  resetScore: () => {
    set({ score: 0 });
  },

  incrementScoreRoll: () => {
    set((state) => ({ scoreRoll: state.scoreRoll + 1 }));
  },

  resetScoreRoll: () => {
    set({ scoreRoll: 0 });
  },

  getSpeedMultiplier: () => {
    const { timeLeft } = get();
    // Calculate speed based on remaining time
    // speed = availableTime / timeLeft
    // This will make the speed increase as time decreases
    return AVAILABLE_TIME / Math.max(timeLeft, 1); // Prevent division by zero
  },
}));
