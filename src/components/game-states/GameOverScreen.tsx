import { motion } from "framer-motion";
import React from "react";
import { useGameStateStore, useGameStore } from "../../store";
import { GameState } from "../../types/gameTypes";

const GameOverScreen: React.FC = () => {
  const { score } = useGameStore();
  const setGameState = useGameStateStore((state) => state.setGameState);

  const handlePlayAgain = () => setGameState(GameState.IDLE);
  const handleAddToLeaderboard = () => setGameState(GameState.LEADERBOARD);

  return (
    <div className="w-screen h-screen fixed top-0 left-0 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat blur-[10px] scale-110" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[50vh] bg-black/20 backdrop-blur-[30px] rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(140,140,140,0.37)] overflow-hidden flex flex-col z-10 w-[95%] sm:w-[90%] lg:w-[80%] xl:w-[80%] 2xl:w-[50%]">
        <div className="p-8 border-b border-white/10">
          <motion.h1
            className="text-4xl font-bold text-white drop-shadow-lg text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Game Over
          </motion.h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
          <motion.div
            className="text-6xl font-bold text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            {score}
          </motion.div>
          <div className="text-xl text-white/70">Your Score</div>
        </div>

        <div className="p-8 border-t border-white/10 flex flex-row gap-4">
          <motion.button
            onClick={handleAddToLeaderboard}
            className="flex-1 py-4 rounded-xl text-lg font-semibold bg-white hover:bg-white/90 text-black transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Add to Leaderboard
          </motion.button>
          <motion.button
            onClick={handlePlayAgain}
            className="flex-1 py-4 rounded-xl text-lg font-semibold bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Play Again
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
