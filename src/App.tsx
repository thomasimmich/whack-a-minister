import { useEffect, useState } from "react";
import GameOverScreen from "./components/game-states/GameOverScreen";
import SplashScreen from "./components/game-states/SplashScreen";
import Leaderboard from "./components/Leaderboard";
import Level from "./components/Level";
import OrientationLock from "./components/OrientationLock";
import { GameContainer } from "./components/styled/GameStyles";
import { useGameStateStore } from "./store";
import { GameState } from "./types/gameTypes";
import SoundManager from "./utils/SoundManager";

const App = () => {
  const { gameState } = useGameStateStore();
  const [musicStarted, setMusicStarted] = useState(false);

  useEffect(() => {
    const handleUserInteraction = () => {
      if (!musicStarted) {
        const soundManager = SoundManager.getInstance();
        soundManager.forceStartBackgroundMusic();
        setMusicStarted(true);
        // Remove the event listeners after music starts
        document.removeEventListener("click", handleUserInteraction);
        document.removeEventListener("keydown", handleUserInteraction);
        document.removeEventListener("touchstart", handleUserInteraction);
      }
    };

    // Add event listeners for user interaction
    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, [musicStarted]);

  return (
    <GameContainer>
      <OrientationLock />
      <Level />

      {gameState === GameState.SPLASH && <SplashScreen />}
      {gameState === GameState.GAME_OVER && <GameOverScreen />}
      {gameState === GameState.LEADERBOARD && <Leaderboard />}
    </GameContainer>
  );
};

export default App;
