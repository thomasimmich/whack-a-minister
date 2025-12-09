import React, { useEffect } from "react";
import { useGameStateStore, useGameStore } from "../../store";
import { GameState } from "../../types/gameTypes";
import SoundManager from "../../utils/SoundManager";

const GameOverScreen: React.FC = () => {
  const { score, resetScore, resetScoreRoll, setTimeLeft, startGame } =
    useGameStore();
  const setGameState = useGameStateStore((state) => state.setGameState);
  const setShowAddScoreModalOnLeaderboard = useGameStateStore(
    (state) => state.setShowAddScoreModalOnLeaderboard
  );
  const soundManager = SoundManager.getInstance();

  // Play game over sound when component mounts
  useEffect(() => {
    soundManager.playGameOverMusic();

    // Cleanup function to stop game over music when component unmounts
    return () => {
      soundManager.stopGameOverMusic();
    };
  }, []);

  const handlePlayAgain = () => {
    // Reset all game state
    resetScore();
    resetScoreRoll();
    setTimeLeft(60);

    // Stop game over music and start background music
    soundManager.stopGameOverMusic();
    soundManager.startBackgroundMusic();

    // Start the game
    setGameState(GameState.IDLE);
    startGame();
  };

  const handleAddToLeaderboard = () => {
    // Stop game over music when navigating to leaderboard
    soundManager.stopGameOverMusic();
    setShowAddScoreModalOnLeaderboard(true);
    setGameState(GameState.LEADERBOARD);
  };

  return (
    <div className="w-screen h-screen fixed top-0 left-0 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat blur-[10px] scale-110" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[80vh] h-auto bg-black/20 backdrop-blur-[30px] rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(140,140,140,0.37)] overflow-y-auto flex flex-col z-10 w-[95%] sm:w-[90%] lg:w-[80%] xl:w-[80%] 2xl:w-[50%]">
        <div className="p-4 sm:p-8 border-b border-white/10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg text-center">
            Game Over
          </h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 gap-4 sm:gap-8">
          <div className="text-5xl sm:text-6xl font-bold text-white">{score}</div>
          <div className="text-lg sm:text-xl text-white/70">Your Score</div>
        </div>

        <div className="p-4 sm:p-8 border-t border-white/10 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAddToLeaderboard}
            className="flex-1 py-4 rounded-xl text-lg font-semibold bg-white hover:bg-white/90 text-black transition-all duration-200"
          >
            Add to Leaderboard
          </button>
          <button
            onClick={handlePlayAgain}
            className="flex-1 py-4 rounded-xl text-lg font-semibold bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
