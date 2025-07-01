import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCharacterStore } from "../../store/characterStore";
import { useGameStateStore } from "../../store/gameStateStore";
import { useScoreStore } from "../../store/scoreStore";
import { GameState } from "../../types/gameTypes";
import SoundManager from "../../utils/SoundManager";

const SplashScreen = () => {
  const { selectedCombination } = useCharacterStore();
  const { scores, initializeScores } = useScoreStore();
  const setGameState = useGameStateStore((state) => state.setGameState);
  const [musicStarted, setMusicStarted] = useState(false);

  useEffect(() => {
    initializeScores();

    // Try to start background music when splash screen loads
    const soundManager = SoundManager.getInstance();
    soundManager.startBackgroundMusic();
    setMusicStarted(true);
  }, [initializeScores]);

  const handleStartGame = () => {
    // Ensure music is started on user interaction
    if (!musicStarted) {
      const soundManager = SoundManager.getInstance();
      soundManager.forceStartBackgroundMusic();
      setMusicStarted(true);
    }
    setGameState(GameState.IDLE);
  };

  const handleShowLeaderboard = () => {
    // Ensure music is started on user interaction
    if (!musicStarted) {
      const soundManager = SoundManager.getInstance();
      soundManager.forceStartBackgroundMusic();
      setMusicStarted(true);
    }
    setGameState(GameState.LEADERBOARD);
  };

  const top3Scores = scores.slice(0, 3);

  const getMedal = (index: number) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `${index + 1}`;
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString();
  };

  return (
    <div className="w-screen h-screen fixed top-0 left-0 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat blur-[10px] scale-110" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[80vh] bg-black/20 backdrop-blur-[30px] rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(140,140,140,0.37)] overflow-hidden flex flex-col z-10 w-[95%] sm:w-[90%] lg:w-[80%] xl:w-[80%] 2xl:w-[60%]">
        <div className="p-8  text-center">
          <motion.h1
            className="text-6xl font-bold text-white drop-shadow-lg mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Dump a Trump
          </motion.h1>
          <motion.p
            className="text-xl text-white/80"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Whack the bad guys, save the good ones!
          </motion.p>
        </div>

        <div className="flex-1 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Top 3 Leaderboard */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <motion.h2
                className="text-2xl font-bold text-white mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Top 3 Players
              </motion.h2>

              <div className="space-y-3">
                {top3Scores.length > 0 ? (
                  top3Scores.map((score, index) => (
                    <motion.div
                      key={score.id}
                      className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getMedal(index)}</span>
                        <div>
                          <div className="font-semibold text-white">
                            {score.name}
                          </div>
                          <div className="text-sm text-white/70">
                            {formatDate(score.date)}
                          </div>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-white">
                        {score.points}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="text-center text-white/70 py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    No scores yet. Be the first to play!
                  </motion.div>
                )}
              </div>
            </div>

            {/* Game Info */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <motion.h2
                className="text-2xl font-bold text-white mb-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                How to Play
              </motion.h2>

              <motion.div
                className="space-y-4 text-white/90"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <div className="font-semibold">Hit the Bad Guys</div>
                    <div className="text-sm text-white/70">
                      Click on Trump and other enemies to score points
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">❤️</span>
                  <div>
                    <div className="font-semibold">Protect the Good Guys</div>
                    <div className="text-sm text-white/70">
                      Avoid clicking on Selenskyi and other allies
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <div className="font-semibold">Time Bonus</div>
                    <div className="text-sm text-white/70">
                      Quick reactions earn bonus points
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="p-8 flex gap-4">
          <motion.button
            onClick={handleStartGame}
            className="flex-1 py-4 rounded-xl text-lg font-semibold bg-white text-black transition-all duration-200 hover:bg-white/90 hover:scale-105"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Start Game
          </motion.button>

          <motion.button
            onClick={handleShowLeaderboard}
            className="px-6 py-4 rounded-xl text-lg font-semibold bg-white/10 text-white border border-white/20 transition-all duration-200 hover:bg-white/20 hover:scale-105"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            Full Leaderboard
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
