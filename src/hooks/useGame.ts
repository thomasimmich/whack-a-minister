import { useEffect, useState } from "react";
import { useGameStateStore } from "../store";
import { useCharacterStore } from "../store/characterStore";
import { useGameStore } from "../store/gameStore";
import type {
  Character,
  GameDimensions,
  HammerAnimation,
} from "../types/gameTypes";
import { GameState } from "../types/gameTypes";
import SoundManager from "../utils/SoundManager";

export const useGame = () => {
  const gameState = useGameStateStore((state) => state.gameState);
  const setGameState = useGameStateStore((state) => state.setGameState);
  const {
    score,
    timeLeft,
    scoreRoll,
    startGame,
    stopGame,
    getSpeedMultiplier,
    setTimeLeft,
    addScore,
    resetScore,
    incrementScoreRoll,
    resetScoreRoll,
  } = useGameStore();

  const [isHitting, setIsHitting] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<GameDimensions>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [hammerAnimation, setHammerAnimation] = useState<HammerAnimation>({
    isActive: false,
    rotation: 0,
    position: { x: 0, y: 0 },
  });

  const soundManager = SoundManager.getInstance();

  // Calculate scale factor based on screen width
  const scaleFactor = dimensions.width / 2732;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Game timer
  useEffect(() => {
    if (gameState === GameState.IDLE) {
      const timer = setInterval(() => {
        const currentTime = timeLeft;
        if (currentTime <= 0) {
          setGameState(GameState.GAME_OVER);
          setTimeLeft(0);
        } else {
          setTimeLeft(currentTime - 1);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft]);

  const handleCharacterClick = (character: Character) => {};

  const handleStartGame = () => {
    const { selectedCombination } = useCharacterStore.getState();
    if (!selectedCombination) {
      return; // Don't start the game if no combination is selected
    }

    // Reset all game state
    resetScore();
    resetScoreRoll();
    setTimeLeft(60);

    // Stop any playing music and start background music
    soundManager.stopBackgroundMusic();
    soundManager.startBackgroundMusic();

    // Start the game
    setGameState(GameState.IDLE);
    startGame();
  };

  const handleGameOver = () => {
    setGameState(GameState.GAME_OVER);
    stopGame();
  };

  const handleToggleMute = () => {
    soundManager.toggleMute();
    setIsMuted(!isMuted);
  };

  const handleCarClick = () => {
    resetScoreRoll();
  };

  const handleChangeCombination = () => {
    setGameState(GameState.SPLASH);
  };

  const updateScore = (points: number) => {
    addScore(points);
  };

  return {
    gameState,
    score,
    timeLeft,
    speed: getSpeedMultiplier(),
    isHitting,
    isMuted,
    dimensions,
    scoreRoll,
    hammerAnimation,
    scaleFactor,
    handleCharacterClick,
    handleStartGame,
    handleGameOver,
    handleToggleMute,
    handleCarClick,
    handleChangeCombination,
    updateScore,
  };
};
