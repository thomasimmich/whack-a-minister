import { useEffect, useState } from "react";
import { useGameStateStore, useGameStore } from "../store";
import { useScoreStore } from "../store/scoreStore";
import { GameState } from "../types/gameTypes";
import SoundManager from "../utils/SoundManager";
import { AddScoreModal } from "./leaderboard/AddScoreModal";
import { CelebrationModal } from "./leaderboard/CelebrationModal";
import { ScoreNotification } from "./leaderboard/ScoreNotification";

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString();
};

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

function Leaderboard() {
  const {
    scores,
    existingNames,
    addScore,
    getTodayPlayers,
    notification,
    setNotification,
    initializeScores,
  } = useScoreStore();

  const { score, resetScore, resetScoreRoll, setTimeLeft, startGame } =
    useGameStore();
  const showAddScoreModalOnLeaderboard = useGameStateStore(
    (state) => state.showAddScoreModalOnLeaderboard
  );
  const setShowAddScoreModalOnLeaderboard = useGameStateStore(
    (state) => state.setShowAddScoreModalOnLeaderboard
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    rank: number;
    total: number;
  } | null>(null);

  const setGameState = useGameStateStore((state) => state.setGameState);
  const soundManager = SoundManager.getInstance();

  useEffect(() => {
    initializeScores();
  }, [initializeScores]);

  // Show modal if the flag is set (from Game Over screen)
  useEffect(() => {
    if (showAddScoreModalOnLeaderboard && score > 0) {
      setIsModalOpen(true);
      setShowAddScoreModalOnLeaderboard(false);
    }
  }, [
    showAddScoreModalOnLeaderboard,
    score,
    setShowAddScoreModalOnLeaderboard,
  ]);

  const handleAddScore = async (name: string, points: number) => {
    try {
      const result = await addScore(name, points);
      if (result) {
        setCelebrationData(result);
        setShowCelebration(true);
        setTimeout(() => {
          setShowCelebration(false);
          setCelebrationData(null);
        }, 5000);
      }
      setIsModalOpen(false);
      // Reset score after adding to leaderboard
      useGameStore.getState().resetScore();
    } catch (error) {
      console.error("Error adding score:", error);
      throw error;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset score when modal is closed without submitting
    useGameStore.getState().resetScore();
  };

  const handlePlay = () => {
    // Stop any playing music and start background music
    soundManager.stopBackgroundMusic();
    soundManager.startBackgroundMusic();

    // Start the game (this will reset all game state)
    setGameState(GameState.IDLE);
    startGame();
  };

  const handleChangeCombination = () => setGameState(GameState.SPLASH);

  return (
    <div className="w-screen h-screen fixed top-0 left-0 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat blur-[10px] scale-110" />
      {showCelebration && celebrationData && (
        <CelebrationModal data={celebrationData} />
      )}
      {notification && (
        <ScoreNotification
          score={notification}
          onClose={() => setNotification(null)}
        />
      )}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[66vh] bg-black/20 backdrop-blur-[30px] rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(140,140,140,0.37)] overflow-hidden flex flex-col z-10 transition-opacity duration-500 ${
          showCelebration ? "opacity-0" : "opacity-100"
        } w-[95%] sm:w-[90%] lg:w-[80%] xl:w-[80%] 2xl:w-[50%]`}
      >
        <div className="p-8 border-b border-white/10 flex justify-between items-center">
          <div className="flex flex-col items-start">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              Rangliste
            </h1>
            <div className="text-white/80 text-sm mt-1">
              {existingNames.length} Spieler gesamt • {getTodayPlayers()} heute
              aktiv
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleChangeCombination}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/20 hover:scale-105"
              title="Change Combination"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>
            <button
              onClick={handlePlay}
              className="bg-white text-black px-6 py-2 rounded-full border border-white flex items-center justify-center transition-all duration-200 hover:bg-white/90 hover:scale-105 font-medium"
            >
              Play
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white/10 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded hover:[&::-webkit-scrollbar-thumb]:bg-white/30">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Rang
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Punkte
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Datum
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {scores.map((score, index: number) => (
                <tr
                  key={score.id}
                  className="hover:bg-white/10 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {getMedal(index)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="font-medium text-white">{score.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {score.points}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/90">
                    {formatDate(score.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddScoreModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddScore}
        existingNames={existingNames}
        initialScore={score}
      />
    </div>
  );
}

export default Leaderboard;
