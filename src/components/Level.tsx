import { useMemo } from "react";
import { useWindowDimensions } from "../hooks";
import { useGameStateStore } from "../store";
import { GameState } from "../types/gameTypes";
import Background from "./Background";
import Car from "./Car";
import CharacterSpawner from "./CharacterSpawner";
import GameUI from "./GameUI";
import { GameStage } from "./styled/GameStyles";

const Level = () => {
  const { width, height } = useWindowDimensions();
  const isOverlayVisible = useIsOverlayVisible();

  return (
    <div
      className={`relative w-full h-full transition-all duration-500 ${
        isOverlayVisible ? "blur-md" : ""
      }`}
    >
      <GameStage width={width} height={height}>
        <Background />
        <Car />
        <CharacterSpawner />
        {!isOverlayVisible && <GameUI />}
      </GameStage>

      {/* <HammerCursor /> */}
    </div>
  );
};

export default Level;

const OVERLAY_STATES = [
  GameState.SPLASH,
  GameState.GAME_OVER,
  GameState.LEADERBOARD,
];

const useIsOverlayVisible = () => {
  const gameState = useGameStateStore((state) => state.gameState);
  const isOverlayVisible = useMemo(
    () => OVERLAY_STATES.includes(gameState),
    [gameState]
  );
  console.log("isOverlayVisible", isOverlayVisible, gameState);
  return isOverlayVisible;
};
