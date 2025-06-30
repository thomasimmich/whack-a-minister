import React, { useCallback, useEffect, useState } from "react";
import { useGame, useWindowDimensions } from "../hooks";
import { useGameStateStore } from "../store";
import type { Character, CharacterPosition } from "../types/gameTypes";
import { CharacterType, GameState } from "../types/gameTypes";
import GameCharacter from "./GameCharacter";

// Types for character spawning configuration
interface SpawnConfig {
  chanceForEnemy: number;
  chanceForTimeBonus: number;
  baseDelay: number;
  additionalDelay: number;
  randomDelay: number;
}

const CHARACTER_POSITIONS: CharacterPosition[] = [
  { x: 0.15, y: 0.5 },
  { x: 0.35, y: 0.5 },
  { x: 0.55, y: 0.5 },
  { x: 0.75, y: 0.5 },
];

const CharacterSpawner = () => {
  const { timeLeft, speed } = useGame();
  const { gameState } = useGameStateStore();
  const scaleFactor = useScaleFactor();
  const {
    characters,
    handleCharacterClick,
    handleCharacterRemoval,
    spawnCharacterAtPosition,
  } = useCharacterSpawning(timeLeft, scaleFactor);

  useEffect(() => {
    if (gameState === GameState.IDLE && characters.length === 0) {
      spawnCharacterAtPosition(
        CHARACTER_POSITIONS[
          Math.floor(Math.random() * CHARACTER_POSITIONS.length)
        ]
      );
    }
  }, [gameState, characters.length, spawnCharacterAtPosition]);

  return (
    <>
      {characters.map((character) => (
        <GameCharacter
          key={character.id}
          id={character.id}
          type={character.type}
          position={character.position}
          state={character.state}
          scale={character.scale}
          speed={speed}
          timeLeft={timeLeft}
          onCharacterClick={handleCharacterClick}
          onCharacterRemoved={() => handleCharacterRemoval(character)}
        />
      ))}
    </>
  );
};

// Custom hook for character spawning logic
const useCharacterSpawning = (timeLeft: number, scaleFactor: number) => {
  const [isSpawning, setIsSpawning] = useState(false);
  const {
    characters,
    isPositionAvailable,
    getAvailablePositions,
    addCharacter,
    removeCharacter,
  } = useFaceManagement(timeLeft);

  const getSpawnConfig = useCallback(
    (timeLeftPercent: number, firstHalf: boolean): SpawnConfig => {
      return {
        chanceForEnemy: 0.8,
        chanceForTimeBonus: 0.05,
        baseDelay: firstHalf
          ? 2500 - timeLeftPercent * 1500
          : 1500 - timeLeftPercent * 1000,
        additionalDelay: firstHalf
          ? 1200 - timeLeftPercent * 800
          : 800 - timeLeftPercent * 500,
        randomDelay: 400,
      };
    },
    []
  );

  const spawnCharacterAtPosition = useCallback(
    (position: CharacterPosition) => {
      if (!isPositionAvailable(position)) {
        console.log("Position not available, skipping spawn:", position);
        return;
      }

      const { chanceForEnemy, chanceForTimeBonus } = getSpawnConfig(
        timeLeft / 60,
        timeLeft > 30
      );
      const random = Math.random();

      let characterType: CharacterType;
      if (random < chanceForEnemy) {
        characterType = CharacterType.ENEMY;
      } else if (
        random <
        chanceForEnemy + (1 - chanceForEnemy) * chanceForTimeBonus
      ) {
        characterType = CharacterType.TIME_BONUS;
      } else {
        characterType = CharacterType.FRIEND;
      }

      const newCharacter: Character = {
        id: Date.now() + Math.random(),
        type: characterType,
        position,
        isVisible: true,
        state: "normal",
        visibleTime: 0,
        hiddenTime: 0,
        scale: scaleFactor * 0.8,
      };

      addCharacter(newCharacter);
    },
    [scaleFactor, isPositionAvailable, addCharacter, getSpawnConfig, timeLeft]
  );

  const placeSingleCharacter = useCallback(
    (excludePosition?: CharacterPosition) => {
      const availablePositions = getAvailablePositions(excludePosition);
      if (availablePositions.length === 0) {
        console.log("No available positions found");
        return;
      }

      const randomPosition =
        availablePositions[
          Math.floor(Math.random() * availablePositions.length)
        ];
      const delay = Math.random() * 300;

      setTimeout(() => {
        spawnCharacterAtPosition(randomPosition);
      }, delay);
    },
    [getAvailablePositions, spawnCharacterAtPosition]
  );

  const handleCharacterClick = useCallback(async () => {
    if (isSpawning) return;

    setIsSpawning(true);
    const timeLeftPercent = timeLeft / 60;
    const firstHalf = timeLeftPercent > 0.5;
    const first30Seconds = timeLeft > 30;
    const config = getSpawnConfig(timeLeftPercent, firstHalf);

    let numNewCharacters = 1;
    if (first30Seconds) {
      if (Math.random() < 0.0005) numNewCharacters++;
    } else {
      const baseChance =
        0.01 + Math.pow(Math.max(0, timeLeftPercent - 0.5) * 2, 3) * 0.9;
      if (Math.random() < baseChance) {
        numNewCharacters++;
        if (!firstHalf && Math.random() < baseChance * 0.8) {
          numNewCharacters++;
        }
      }
    }

    for (let i = 0; i < numNewCharacters; i++) {
      const totalDelay =
        config.baseDelay +
        i * config.additionalDelay +
        Math.random() * config.randomDelay;
      setTimeout(() => placeSingleCharacter(), totalDelay);
    }

    setTimeout(() => setIsSpawning(false), 1000);
  }, [isSpawning, timeLeft, getSpawnConfig, placeSingleCharacter]);

  const handleCharacterRemoval = useCallback(
    (character: Character) => {
      removeCharacter(character);
      placeSingleCharacter(character.position);
    },
    [placeSingleCharacter, removeCharacter]
  );

  return {
    characters,
    isSpawning,
    handleCharacterClick,
    handleCharacterRemoval,
    spawnCharacterAtPosition,
  };
};

const useFaceManagement = (timeLeft: number) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [occupiedPositions, setOccupiedPositions] = useState<Set<string>>(
    new Set()
  );
  const occupiedPositionsRef = React.useRef<Set<string>>(occupiedPositions);
  occupiedPositionsRef.current = occupiedPositions;

  const isPositionAvailable = useCallback(
    (position: CharacterPosition) => {
      const positionKey = `${position.x},${position.y}`;
      if (occupiedPositionsRef.current.has(positionKey)) {
        return false;
      }
      return !characters.some(
        (char) =>
          char.position.x === position.x && char.position.y === position.y
      );
    },
    [characters]
  );

  const getAvailablePositions = useCallback(
    (excludePosition?: CharacterPosition) => {
      return CHARACTER_POSITIONS.filter((position) => {
        const isExcluded =
          excludePosition &&
          position.x === excludePosition.x &&
          position.y === excludePosition.y;
        return isPositionAvailable(position) && !isExcluded;
      });
    },
    [isPositionAvailable]
  );

  const removeRandomCharacter = useCallback(() => {
    if (characters.length > 0) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      const characterToRemove = characters[randomIndex];
      const positionKey = `${characterToRemove.position.x},${characterToRemove.position.y}`;

      setCharacters((prev) => prev.filter((_, index) => index !== randomIndex));
      setOccupiedPositions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(positionKey);
        return newSet;
      });
    }
  }, [characters]);

  const addCharacter = useCallback((character: Character) => {
    const positionKey = `${character.position.x},${character.position.y}`;
    setOccupiedPositions((prev) => new Set(prev).add(positionKey));
    setCharacters((prev) => [...prev, character]);
  }, []);

  const removeCharacter = useCallback((character: Character) => {
    setCharacters((prev) => prev.filter((c) => c.id !== character.id));
    setOccupiedPositions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(`${character.position.x},${character.position.y}`);
      return newSet;
    });
  }, []);

  // Check and remove characters if too many in first half
  useEffect(() => {
    const timeLeftPercent = timeLeft / 60;
    const firstHalf = timeLeftPercent > 0.5;

    if (firstHalf) {
      // In first half: more aggressive removal if more than 2 characters
      if (characters.length > 2) {
        const interval = setInterval(() => {
          if (Math.random() < 0.3) {
            // Increased chance to 30%
            removeRandomCharacter();
          }
        }, 1500); // Faster interval (1.5 seconds)

        return () => clearInterval(interval);
      }
    } else {
      // In second half: less aggressive removal, only if more than 4 characters
      if (characters.length > 4) {
        const interval = setInterval(() => {
          if (Math.random() < 0.1) {
            // Reduced chance to 10%
            removeRandomCharacter();
          }
        }, 3000); // Slower interval (3 seconds)

        return () => clearInterval(interval);
      }
    }
  }, [timeLeft, characters.length, removeRandomCharacter]);

  return {
    characters,
    occupiedPositions,
    isPositionAvailable,
    getAvailablePositions,
    addCharacter,
    removeCharacter,
  };
};

const useScaleFactor = () => {
  const { width } = useWindowDimensions();
  return width / 2732;
};

export default CharacterSpawner;
