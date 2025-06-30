import GameOverScreen from "./components/game-states/GameOverScreen";
import SplashScreen from "./components/game-states/SplashScreen";
import Leaderboard from "./components/Leaderboard";
import Level from "./components/Level";
import { GameContainer } from "./components/styled/GameStyles";
import { useGameStateStore } from "./store";
import { GameState } from "./types/gameTypes";

const App = () => {
  const { gameState } = useGameStateStore();

  return (
    <GameContainer>
      <Level />

      {gameState === GameState.SPLASH && <SplashScreen />}
      {gameState === GameState.GAME_OVER && <GameOverScreen />}
      {gameState === GameState.LEADERBOARD && <Leaderboard />}
    </GameContainer>
  );
};

export default App;
