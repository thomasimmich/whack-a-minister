import { useCallback, useEffect, useRef, useState } from "react";
import { useGame, useWindowDimensions } from "../hooks";
import { useGameStateStore } from "../store";
import type { Character, CharacterPosition } from "../types/gameTypes";
import { CharacterType, GameState } from "../types/gameTypes";
import GameCharacter from "./GameCharacter";

// Fixed hole positions (relative coordinates) - now just for spawning new characters
const HOLE_REL_POSITIONS: CharacterPosition[] = [
  { x: 0.15, y: 0.5 },
  { x: 0.35, y: 0.5 },
  { x: 0.55, y: 0.5 },
  { x: 0.75, y: 0.5 },
];

const AVAILABLE_TIME = 60; // Total game time in seconds

// NEW: Simple character with unique ID
interface SpawnedCharacter {
  uniqueId: string; // Unique ID for React key
  character: Character;
  spawnTime: number; // When spawned
  hideTime: number; // When should exit
}

const CharacterSpawner = () => {
  const { timeLeft } = useGame();
  const { gameState } = useGameStateStore();
  const scaleFactor = useScaleFactor();
  const {
    spawnedCharacters,
    handleCharacterClick,
    removeCharacter,
    speed,
  } = useCounterpartSystem(timeLeft, scaleFactor, gameState);

  return (
    <>
      {spawnedCharacters.map((spawnedChar) => (
        <GameCharacter
          key={spawnedChar.uniqueId}
          id={spawnedChar.character.id}
          type={spawnedChar.character.type}
          position={spawnedChar.character.position}
          state={spawnedChar.character.state}
          scale={spawnedChar.character.scale}
          speed={speed}
          timeLeft={timeLeft}
          hideTime={spawnedChar.hideTime}
          onCharacterClick={handleCharacterClick}
          onRemoveSelf={() => removeCharacter(spawnedChar.uniqueId)}
        />
      ))}
    </>
  );
};

// Custom hook for counterpart system (NEW: Array-based, no overwriting)
const useCounterpartSystem = (
  timeLeft: number,
  scaleFactor: number,
  gameState: GameState
) => {
  // NEW: Simple array of spawned characters
  const [spawnedCharacters, setSpawnedCharacters] = useState<SpawnedCharacter[]>([]);
  const spawnedCharactersRef = useRef<SpawnedCharacter[]>([]);
  const counterpartHiddenTimeRef = useRef<number>(0);
  const counterpartHiddenDurationRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(Date.now());
  const nextIdRef = useRef<number>(0); // Counter for unique IDs
  
  // Track which positions are currently occupied
  const occupiedPositionsRef = useRef<Set<string>>(new Set());

  // Calculate speed based on time left - gentle scaling
  // Was: 1.3 exponent (too aggressive), 0.8 (still too fast at end)
  // Now: 0.6 exponent (much gentler progression)
  const speed = Math.pow(AVAILABLE_TIME / Math.max(timeLeft, 1), 0.6);

  // Calculate character type randomly
  const calculateCounterpartTypeRandomly = useCallback((): CharacterType => {
    const chanceForEnemy = 0.8;
    const chanceForTimeBonus = 0.05;
    const random = Math.random();

    if (random < chanceForEnemy) {
      return CharacterType.ENEMY;
    } else if (random < chanceForEnemy + (1 - chanceForEnemy) * chanceForTimeBonus) {
      return CharacterType.TIME_BONUS;
    } else {
      return CharacterType.FRIEND;
    }
  }, []);

  // Update turn variables (recalculate durations based on speed)
  const updateTurnVariables = useCallback(() => {
    // hiddenDuration: Zeit zwischen Spawns
    // Base: 40-100 frames (0.67-1.67 Sekunden bei 60fps)
    // Etwas längere Intervalle, um nicht zu viele gleichzeitige Charaktere zu haben
    const baseHiddenDuration = Math.random() * 60 + 40; // 40-100 frames
    counterpartHiddenDurationRef.current = baseHiddenDuration / speed;
    counterpartHiddenTimeRef.current = 0;
  }, [speed]);
  
  // Function to remove a character from the array
  const removeCharacter = useCallback((uniqueId: string) => {
    setSpawnedCharacters((prev) => {
      const char = prev.find(c => c.uniqueId === uniqueId);
      if (char) {
        // Free up the position
        const posKey = `${char.character.position.x},${char.character.position.y}`;
        occupiedPositionsRef.current.delete(posKey);
      }
      const updated = prev.filter((c) => c.uniqueId !== uniqueId);
      spawnedCharactersRef.current = updated;
      return updated;
    });
  }, []);

  // Initialize (reset when game state changes)
  useEffect(() => {
    if (gameState !== GameState.IDLE) {
      // Reset when not in game
      setSpawnedCharacters([]);
      spawnedCharactersRef.current = [];
      occupiedPositionsRef.current.clear();
      return;
    }

    // Initialize timing variables
    updateTurnVariables();
    counterpartHiddenTimeRef.current = 0;
  }, [gameState, updateTurnVariables]);

  // Spawn a new character at a random free position
  const spawnNewCharacter = useCallback(
    (visibleDuration: number) => {
      // Find available positions
      const availablePositions = HOLE_REL_POSITIONS.filter((pos) => {
        const posKey = `${pos.x},${pos.y}`;
        return !occupiedPositionsRef.current.has(posKey);
      });

      if (availablePositions.length === 0) {
        return;
      }

      // Pick random position
      const position = availablePositions[Math.floor(Math.random() * availablePositions.length)];
      const posKey = `${position.x},${position.y}`;
      
      // Mark position as occupied
      occupiedPositionsRef.current.add(posKey);

      const characterType = calculateCounterpartTypeRandomly();
      const visibleTimeMs = (visibleDuration * 1000) / 60;
      const now = Date.now();
      const hideTime = now + visibleTimeMs;
      const uniqueId = `char-${nextIdRef.current++}`;

      const newCharacter: SpawnedCharacter = {
        uniqueId,
        spawnTime: now,
        hideTime: hideTime,
        character: {
          id: nextIdRef.current,
          type: characterType,
          position: position,
          isVisible: true,
          state: "normal",
          visibleTime: 0,
          hiddenTime: 0,
          scale: scaleFactor * 0.8,
        },
      };

      // ADD to array (DON'T overwrite anything!)
      setSpawnedCharacters((prev) => {
        const updated = [...prev, newCharacter];
        spawnedCharactersRef.current = updated;
        return updated;
      });
    },
    [calculateCounterpartTypeRandomly, scaleFactor]
  );

  // Update loop (frame-based ticker) - NEW: Just spawns, characters manage themselves
  useEffect(() => {
    if (gameState !== GameState.IDLE) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const update = () => {
      const now = Date.now();
      const deltaTime = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      // Convert delta time to frame units (assuming ~60fps: 1 frame = ~16.67ms)
      const deltaFrames = deltaTime / 16.67;

      // Increment hidden timer
      counterpartHiddenTimeRef.current += deltaFrames;

      // Update speed and durations if timeLeft changed significantly
      const currentSpeed = Math.pow(AVAILABLE_TIME / Math.max(timeLeft, 1), 0.6);
      if (Math.abs(currentSpeed - speed) > 0.1) {
        updateTurnVariables();
      }


      // Check if we should spawn a new character
      if (counterpartHiddenTimeRef.current >= counterpartHiddenDurationRef.current) {
        // Visible duration: 1-3 seconds, scaled by speed
        // Base: 60-180 frames (1-3 seconds at 60fps)
        // With minimum of 30 frames (0.5 seconds) to keep it playable
        const baseDuration = Math.random() * 120 + 60; // 60-180 frames
        const scaledDuration = baseDuration / speed;
        const visibleDuration = Math.max(scaledDuration, 30); // Minimum 0.5 seconds

        spawnNewCharacter(visibleDuration);

        // Recompute next durations and reset timer
        updateTurnVariables();
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    lastFrameTimeRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, timeLeft, speed, spawnNewCharacter, updateTurnVariables]);

  const handleCharacterClick = useCallback((_character: Character) => {
    // Character will call onRemoveSelf when it's done with exit animation
  }, []);

  return {
    spawnedCharacters,
    handleCharacterClick,
    removeCharacter,
    speed,
  };
};

const useScaleFactor = () => {
  const { width } = useWindowDimensions();
  return width / 2732;
};

export default CharacterSpawner;
