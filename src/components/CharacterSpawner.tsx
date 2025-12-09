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

  console.log(`[SPAWNER] 🎨 Rendering ${spawnedCharacters.length} characters`);

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

  // Calculate speed based on time left - more aggressive scaling
  const speed = Math.pow(AVAILABLE_TIME / Math.max(timeLeft, 1), 1.3);

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
    // hiddenDuration: random in [20, 60] frames divided by speed
    // Shorter range for more frequent spawns
    counterpartHiddenDurationRef.current =
      (Math.random() * 40 + 20) / speed;
    counterpartHiddenTimeRef.current = 0;
  }, [speed]);
  
  // NEW: Function to remove a character from the array
  const removeCharacter = useCallback((uniqueId: string) => {
    console.log(`[SPAWNER] 🗑️ removeCharacter called for ${uniqueId}`);
    setSpawnedCharacters((prev) => {
      const char = prev.find(c => c.uniqueId === uniqueId);
      if (char) {
        // Free up the position
        const posKey = `${char.character.position.x},${char.character.position.y}`;
        occupiedPositionsRef.current.delete(posKey);
        console.log(`[SPAWNER] 🗑️ Freed position ${posKey}`);
      }
      const updated = prev.filter((c) => c.uniqueId !== uniqueId);
      spawnedCharactersRef.current = updated;
      console.log(`[SPAWNER] 📊 After removal: ${updated.length} characters remaining`);
      return updated;
    });
  }, []);

  // Initialize (reset when game state changes)
  useEffect(() => {
    if (gameState !== GameState.IDLE) {
      // Reset when not in game
      console.log(`[SPAWNER] 🔄 Game state changed to ${gameState}, clearing all characters`);
      setSpawnedCharacters([]);
      spawnedCharactersRef.current = [];
      occupiedPositionsRef.current.clear();
      return;
    }

    // Initialize timing variables
    updateTurnVariables();
    counterpartHiddenTimeRef.current = 0;
    console.log(`[SPAWNER] 🎮 Game started, ready to spawn characters`);
  }, [gameState, updateTurnVariables]);

  // NEW: Spawn a new character at a random free position
  const spawnNewCharacter = useCallback(
    (visibleDuration: number) => {
      // Find available positions
      const availablePositions = HOLE_REL_POSITIONS.filter((pos) => {
        const posKey = `${pos.x},${pos.y}`;
        return !occupiedPositionsRef.current.has(posKey);
      });

      if (availablePositions.length === 0) {
        console.log(`[SPAWNER] ⚠️ No available positions, skipping spawn`);
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
      const visibleSeconds = visibleTimeMs / 1000;
      const uniqueId = `char-${nextIdRef.current++}`;

      console.log(`[SPAWNER] 🎯 ========== SPAWNING NEW CHARACTER ==========`);
      console.log(`[SPAWNER] 🎯 Unique ID: ${uniqueId}`);
      console.log(`[SPAWNER] 🎯 Type: ${characterType}`);
      console.log(`[SPAWNER] 🎯 Position: (${position.x}, ${position.y}) [${posKey}]`);
      console.log(`[SPAWNER] 🎯 visibleDuration: ${visibleDuration.toFixed(2)} frames`);
      console.log(`[SPAWNER] 🎯 visibleSeconds: ${visibleSeconds.toFixed(2)}s ⏱️`);
      console.log(`[SPAWNER] 🎯 hideTime: ${hideTime} (in ${visibleSeconds.toFixed(2)}s)`);
      console.log(`[SPAWNER] 🎯 ===============================================`);

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
        console.log(`[SPAWNER] 📊 After spawn: ${updated.length} total characters`, 
          updated.map(c => ({
            id: c.uniqueId,
            type: c.character.type,
            pos: `(${c.character.position.x}, ${c.character.position.y})`,
            remaining: `${((c.hideTime - now) / 1000).toFixed(1)}s`
          }))
        );
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
      const currentSpeed = Math.pow(AVAILABLE_TIME / Math.max(timeLeft, 1), 1.3);
      if (Math.abs(currentSpeed - speed) > 0.1) {
        updateTurnVariables();
      }

      // Debug logging every ~1 second
      if (Math.random() < 0.016) {
        const chars = spawnedCharactersRef.current;
        console.log(`[SPAWNER] 🔍 ===== UPDATE CHECK =====`);
        console.log(`  Time now: ${now}`);
        console.log(`  Total characters: ${chars.length}`);
        chars.forEach(char => {
          const timeRemaining = char.hideTime - now;
          console.log(`  ✅ ${char.uniqueId}: remaining=${(timeRemaining/1000).toFixed(1)}s, pos=(${char.character.position.x}, ${char.character.position.y})`);
        });
        console.log(`[SPAWNER] 🔍 ======================`);
      }

      // Check if we should spawn a new character
      if (counterpartHiddenTimeRef.current >= counterpartHiddenDurationRef.current) {
        // FIXED DURATION FOR TESTING - NOT divided by speed!
        // This should make characters visible for 10-15 seconds regardless of game speed
        const rawDuration = Math.random() * 300 + 600; // 600-900 frames = 10-15 seconds at 60fps
        const visibleDuration = rawDuration; // DO NOT divide by speed for testing!
        
        console.log(`[SPAWNER] 📊 Time to spawn! visibleDuration=${visibleDuration.toFixed(2)} frames (${(visibleDuration/60).toFixed(2)}s)`);

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

  const handleCharacterClick = useCallback((character: Character) => {
    console.log(`[SPAWNER] 👆 Character ${character.id} was clicked - character will handle its own removal`);
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
