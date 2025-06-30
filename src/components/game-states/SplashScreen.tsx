import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  characterCombinations,
  useCharacterStore,
} from "../../store/characterStore";
import { useGameStateStore } from "../../store/gameStateStore";
import { GameState } from "../../types/gameTypes";
import { processCharacterCombination } from "../../utils/characterUtils";

const SplashScreen = () => {
  const { selectedCombination, setSelectedCombination } = useCharacterStore();
  const processedImages = useProcessCharacterCombinations();
  const setGameState = useGameStateStore((state) => state.setGameState);

  const handleStartGame = () =>
    selectedCombination && setGameState(GameState.IDLE);

  return (
    <div className="w-screen h-screen fixed top-0 left-0 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat blur-[10px] scale-110" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[66vh] bg-black/20 backdrop-blur-[30px] rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(140,140,140,0.37)] overflow-hidden flex flex-col z-10 w-[95%] sm:w-[90%] lg:w-[80%] xl:w-[80%] 2xl:w-[50%]">
        <div className="p-8 border-b border-white/10">
          <motion.h1
            className="text-4xl font-bold text-white drop-shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Whack-a-Minister
          </motion.h1>
        </div>

        <div className="flex-1 overflow-y-auto p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white/10 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded hover:[&::-webkit-scrollbar-thumb]:bg-white/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characterCombinations.map((combination) => (
              <motion.div
                key={combination.id}
                className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:bg-white/20 hover:scale-105 hover:shadow-lg hover:shadow-white/10 ${
                  selectedCombination?.id === combination.id
                    ? "bg-white/30 ring-2 ring-white/40"
                    : ""
                }`}
                onClick={() => setSelectedCombination(combination)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center justify-between gap-4">
                  {processedImages[combination.id] && (
                    <>
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
                          <img
                            src={processedImages[combination.id].enemy.default}
                            alt="Enemy character"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-white/70 font-medium">
                          {combination.enemies[0]}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white/80">VS</div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden ">
                          <img
                            src={processedImages[combination.id].friend.default}
                            alt="Friend character"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-white/70 font-medium">
                          {combination.friends[0]}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-8 border-t border-white/10">
          <motion.button
            onClick={handleStartGame}
            className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-200 ${
              selectedCombination
                ? "bg-white/20 hover:bg-white/30 text-white"
                : "bg-white/10 text-white/50 cursor-not-allowed"
            }`}
            whileHover={selectedCombination ? { scale: 1.02 } : {}}
            whileTap={selectedCombination ? { scale: 0.98 } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Start Game
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;

const useProcessCharacterCombinations = (): Record<
  string,
  ReturnType<typeof processCharacterCombination>
> => {
  const [processedImages, setProcessedImages] = useState<
    Record<string, ReturnType<typeof processCharacterCombination>>
  >({});

  useEffect(() => {
    // Process all combinations at once
    const images = characterCombinations.reduce((acc, combination) => {
      acc[combination.id] = processCharacterCombination(combination);
      return acc;
    }, {} as Record<string, ReturnType<typeof processCharacterCombination>>);
    setProcessedImages(images);
  }, []);

  return processedImages;
};
