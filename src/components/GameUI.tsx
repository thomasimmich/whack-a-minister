import React from "react";
import { useGameStore } from "../store/gameStore";

const GameUI: React.FC = () => {
  const { score, timeLeft, scoreRoll } = useGameStore();

  return (
    <div className="absolute top-0 left-0 w-full p-5 text-white font-sans z-50">
      <div className="flex justify-between items-center p-3 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold">Score: {score}</div>
          {scoreRoll > 0 && (
            <div className="text-xl font-bold text-yellow-400">
              Combo: x{scoreRoll}
            </div>
          )}
        </div>
        <div
          className={`text-2xl font-bold ${
            timeLeft <= 10 ? "text-red-500" : "text-white"
          }`}
        >
          Time: {timeLeft}s
        </div>
      </div>
    </div>
  );
};

export default GameUI;
