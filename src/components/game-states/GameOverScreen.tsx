import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useGameStateStore, useGameStore } from "../../store";
import { GameState } from "../../types/gameTypes";
import SoundManager from "../../utils/SoundManager";
import { ScoreTextFill } from "../styled/GameStyles";

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
    <div className="w-screen h-screen fixed top-0 left-0 overflow-hidden flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg.jpg')] h-full bg-cover bg-center bg-no-repeat blur-[10px] scale-110" />

      <div className="relative z-10 flex flex-col md:flex-row items-stretch justify-center gap-0 md:gap-10 px-0 max-w-6xl w-full">
        {/* Left: Title */}
        <div className="flex-1 flex justify-center items-center h-screen">
          <motion.h1
            className="text-6xl sm:text-7xl md:text-8xl font-bold italic relative font-sans flex flex-row items-center gap-2 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Game - red gradient */}
            <span className="relative">
              <span className="absolute top-0 left-0 text-transparent [-webkit-text-stroke:8px_#000000] z-0">
                Game
              </span>
              <span className="relative bg-gradient-to-b from-[#ff6b6b] to-[#ff0000] bg-clip-text text-transparent drop-shadow-[5.2px_3px_8px_rgba(0,0,0,1)] z-[1]">
                Game
              </span>
            </span>

            {/* Over - yellow / orange like combo text */}
            <span className="relative">
              <span className="absolute top-0 left-0 text-transparent [-webkit-text-stroke:8px_#000000] z-0">
                Over
              </span>
              <span className="relative bg-gradient-to-b from-[#ffd700] via-[#ff8c00] to-[#ff4500] bg-clip-text text-transparent drop-shadow-[5.2px_3px_8px_rgba(0,0,0,1)] z-[1]">
                Over
              </span>
            </span>
          </motion.h1>
        </div>

        {/* Right: Score + Buttons */}
        <div className="flex-1 p-4  flex flex-col h-screen">
          {/* Score display - centered in remaining space */}
          <motion.div
            className="flex-1 flex flex-col items-center justify-center gap-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="relative mt-4">
              <p className="text-8xl italic font-bold bg-gradient-to-b from-white to-[#00ff00] bg-clip-text text-transparent drop-shadow-[5.2px_3px_8px_rgba(0,0,0,1)] sm:text-9xl md:text-[12rem]">
                {score}
              </p>
            </div>
            <div className="text-xl sm:text-2xl text-white/80 font-semibold">
              Your Score
            </div>
          </motion.div>

          {/* Buttons - aligned to bottom */}
          <div className="flex mt-20 flex-col items-center justify-center gap-4 sm:gap-6 pb-4">
            <motion.button
              onClick={handlePlayAgain}
              className="px-8 py-4 text-2xl sm:text-3xl font-bold italic transition-all duration-200 relative flex items-center justify-center font-sans border-4 border-black bg-gradient-to-b from-blue-400 to-blue-600 backdrop-blur-[10px] hover:scale-110 active:scale-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="absolute text-transparent [-webkit-text-stroke:4px_#000000] z-0">
                Play Again
              </span>
              <span className="relative text-white z-[1]">
                Play Again
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
