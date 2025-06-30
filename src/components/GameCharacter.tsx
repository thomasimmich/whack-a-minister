import { Container, Graphics, Sprite, Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import React, { useEffect, useRef, useState } from "react";
import useCarStore from "../store/carStore";
import { useCharacterStore } from "../store/characterStore";
import { useGameStore } from "../store/gameStore";
import {
  CharacterType,
  type Character,
  type CharacterImages,
  type CharacterPosition,
} from "../types/gameTypes";
import { processCharacterCombination } from "../utils/characterUtils";
import { Ease } from "../utils/ease.class";

// Sound management
const SOUNDS = {
  punch: Array.from({ length: 9 }, (_, i) => `/assets/sounds/punch${i}.mp3`),
  failure: "/assets/sounds/failure.mp3",
  squeeze: "/assets/sounds/squeeze.mp3",
  honk: "/assets/sounds/honk.mp3",
};

let lastPunchSoundIndex = -1;

const playSound = (type: CharacterType) => {
  let soundPath: string;

  switch (type) {
    case CharacterType.ENEMY:
      // Select a random punch sound, avoiding the last used one
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * SOUNDS.punch.length);
      } while (randomIndex === lastPunchSoundIndex && SOUNDS.punch.length > 1);

      lastPunchSoundIndex = randomIndex;
      soundPath = SOUNDS.punch[randomIndex];
      break;

    case CharacterType.FRIEND:
      soundPath = SOUNDS.failure;
      break;

    case CharacterType.TIME_BONUS:
      soundPath = SOUNDS.squeeze;
      break;

    default:
      return;
  }

  const audio = new Audio(soundPath);
  audio.play().catch((error) => console.error("Error playing sound:", error));
};

const CHARACTER_POSITIONS: CharacterPosition[] = [
  { x: 0.15, y: 0.5 }, // Position 1: Back
  { x: 0.35, y: 0.5 }, // Position 2: Almost back
  { x: 0.55, y: 0.5 }, // Position 3: Second from front
  { x: 0.75, y: 0.5 }, // Position 4: Front
];

interface GameCharacterProps
  extends Omit<Character, "isVisible" | "visibleTime" | "hiddenTime"> {
  onCharacterClick: (character: Character) => void;
  onCharacterRemoved: () => void;
  speed: number;
  timeLeft: number;
}

const CHARACTER_IMAGES: CharacterImages = {
  [CharacterType.ENEMY]: {
    normal: "assets/images/scheuer.png",
    hit: "assets/images/scheuer-hit.png",
    whacked: "assets/images/scheuer-hammered.png",
  },
  [CharacterType.FRIEND]: {
    normal: "assets/images/greta.png",
    hit: "assets/images/greta-hit.png",
    whacked: "assets/images/greta-whacked.png",
  },
  [CharacterType.TIME_BONUS]: {
    normal: "assets/images/scheuermilch.png",
    hit: "assets/images/scheuermilch-hit.png",
    whacked: "assets/images/scheuermilch-whacked.png",
  },
};

const ANIMATION_DURATION = 500; // milliseconds
const VIBRATION_AMPLITUDE = 5; // pixels
const VIBRATION_SPEED = 0.015; // speed of vibration
const ENTRY_OFFSET = 150; // Increased from 100 to 150 for larger characters

const maskConfigs = [
  { width: 800, height: 1000, bottomHeight: 75, rotation: -0.1, yOffset: -20 }, // Position 1: Back
  { width: 800, height: 1000, bottomHeight: 0, rotation: -0.1, yOffset: -40 }, // Position 2: Almost back
  { width: 800, height: 1000, bottomHeight: 200, rotation: 0.05, yOffset: -15 }, // Position 3: Second from front
  { width: 800, height: 1000, bottomHeight: 230, rotation: 0.1, yOffset: 0 }, // Position 4: Front
];

const createMaskForIndex = (
  graphics: PIXI.Graphics,
  index: number,
  sprite: PIXI.Sprite,
  scaleFactor: number
) => {
  const config = maskConfigs[index];
  const width = config.width * scaleFactor;
  const height = config.height * scaleFactor;
  const bottomHeight = config.bottomHeight * scaleFactor;

  graphics.clear();
  // Apply rotation to the graphics context
  graphics.rotation = config.rotation;

  // Draw the mask shape in green with some transparency
  graphics.beginFill(0x00ff00, 0.3);
  graphics.moveTo(-width / 2, -height / 2); // Top left
  graphics.lineTo(width / 2, -height / 2); // Top right
  graphics.lineTo(width / 2, bottomHeight); // Bottom right
  graphics.lineTo(-width / 2, bottomHeight); // Bottom left
  graphics.lineTo(-width / 2, -height / 2); // Back to top left
  graphics.endFill();

  // Add a green outline to make the shape more visible
  graphics.lineStyle(2, 0x00ff00, 1);
  graphics.moveTo(-width / 2, -height / 2);
  graphics.lineTo(width / 2, -height / 2);
  graphics.lineTo(width / 2, bottomHeight);
  graphics.lineTo(-width / 2, bottomHeight);
  graphics.lineTo(-width / 2, -height / 2);
};

interface ScoreTextProps {
  score: number;
  isVisible: boolean;
  onAnimationComplete: () => void;
}

const ScoreText: React.FC<ScoreTextProps> = ({
  score,
  isVisible,
  onAnimationComplete,
}) => {
  const [scale, setScale] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: -100 });
  const textRef = useRef<PIXI.Text>(null);
  const scoreRoll = useGameStore((state) => state.scoreRoll);

  useEffect(() => {
    if (isVisible) {
      // Reset scale and set random position
      setScale(0);
      setPosition({
        x: (Math.random() - 0.5) * 100, // Random x offset between -50 and 50
        y: -150 - Math.random() * 100, // Random y offset between -150 and -250
      });

      // Grow animation
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / 200, 1); // 200ms grow animation
        const easedProgress = Ease.inSine(progress);
        setScale(easedProgress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Keep text fully visible
          setScale(1);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isVisible]);

  const scoreText = score > 0 ? `+${score}` : score.toString();
  const textStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 36,
    fontStyle: "italic",
    fontWeight: "bold",
    fill: ["#ffffff", "#00ff00"], // White to green gradient
    fillGradientType: PIXI.TEXT_GRADIENT.LINEAR_VERTICAL,
    stroke: "#000000",
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
  });

  return (
    <Text
      ref={textRef}
      text={scoreText}
      style={textStyle}
      anchor={0.5}
      scale={scale}
      x={position.x}
      y={position.y}
      alpha={1} // Fixed opacity
    />
  );
};

interface CharacterState {
  default: string;
  hit: string;
}

interface ProcessedCombination {
  enemy: CharacterState;
  friend: CharacterState;
}

const GameCharacter: React.FC<GameCharacterProps> = ({
  id,
  type,
  position,
  state,
  scale,
  onCharacterClick,
  onCharacterRemoved,
  speed,
  timeLeft,
}) => {
  const [currentState, setCurrentState] = useState(state);
  const [isExiting, setIsExiting] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [currentScale, setCurrentScale] = useState(scale);
  const [currentAlpha, setCurrentAlpha] = useState(1);
  const [currentY, setCurrentY] = useState(position.y * window.innerHeight);
  const [vibrationOffset, setVibrationOffset] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showPunchCorona, setShowPunchCorona] = useState(false);
  const punchCoronaTimeoutRef = useRef<number>();
  const containerRef = useRef<PIXI.Container>(null);
  const maskRef = useRef<PIXI.Graphics>(null);
  const spriteRef = useRef<PIXI.Sprite>(null);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const topOfCar = useCarStore((state) => state.topOfCar);
  const { selectedCombination } = useCharacterStore();
  const [characterImages, setCharacterImages] =
    useState<ProcessedCombination | null>(null);
  const scoreRoll = useGameStore((state) => state.scoreRoll);

  useEffect(() => {
    if (selectedCombination) {
      const processedImages = processCharacterCombination(selectedCombination);
      setCharacterImages(processedImages);
    }
  }, [selectedCombination]);

  // Initialize mask
  useEffect(() => {
    if (containerRef.current && maskRef.current && spriteRef.current) {
      const index = CHARACTER_POSITIONS.findIndex(
        (pos) => pos.x === position.x && pos.y === position.y
      );
      if (index !== -1) {
        createMaskForIndex(maskRef.current, index, spriteRef.current, scale);
        containerRef.current.mask = maskRef.current;
      }
    }
  }, [position, scale]);

  // Calculate visible time based on game state
  const calculateVisibleTime = () => {
    const baseVisibleTime = (Math.random() * 0.5 + 3) / Math.sqrt(speed);
    const timeLeftPercent = timeLeft / 60;
    // More dramatic scaling: starts longer, ends much shorter
    return baseVisibleTime * (0.5 + timeLeftPercent * 0.2); // Changed from (0.3 + timeLeftPercent * 0.3)
  };

  // Entry animation and auto-hide setup
  useEffect(() => {
    const startY = position.y * window.innerHeight + ENTRY_OFFSET; // Start below
    setCurrentY(startY);

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      const easedProgress = Ease.inSine(progress);

      setCurrentY(startY - easedProgress * ENTRY_OFFSET); // Move up

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);

    // Set up auto-hide timer based on calculated visible time
    const visibleTime = calculateVisibleTime();

    const autoHideTimer = setTimeout(() => {
      if (!isExiting) {
        startExitAnimation();
      }
    }, visibleTime * 1000);

    return () => clearTimeout(autoHideTimer);
  }, []);

  // Vibration effect while visible
  useEffect(() => {
    if (!isExiting && currentState === "normal") {
      let lastTime = Date.now();
      const vibrate = () => {
        const now = Date.now();
        lastTime = now;

        setVibrationOffset(
          Math.sin(now * VIBRATION_SPEED) * VIBRATION_AMPLITUDE
        );

        if (!isExiting && currentState === "normal") {
          requestAnimationFrame(vibrate);
        }
      };
      requestAnimationFrame(vibrate);
    }
  }, [isExiting, currentState]);

  const startExitAnimation = () => {
    if (isExiting) return; // Prevent multiple exit animations
    setIsExiting(true);

    const startY = position.y * window.innerHeight;
    const exitStartTime = Date.now();

    const exitAnimate = () => {
      const exitElapsed = Date.now() - exitStartTime;
      const exitProgress = Math.min(exitElapsed / ANIMATION_DURATION, 1);
      const exitEasedProgress = Ease.inBack(exitProgress, 0.6);

      // Move down with easing
      setCurrentY(startY + exitEasedProgress * ENTRY_OFFSET);

      if (exitProgress < 1) {
        requestAnimationFrame(exitAnimate);
      } else {
        // Hide score text when character is fully exited
        setShowScore(false);
        // Ensure the character is removed after animation completes
        onCharacterRemoved();
      }
    };
    requestAnimationFrame(exitAnimate);
  };

  const handleClick = () => {
    if (currentState === "normal") {
      setCurrentState("whacked");
      setShowPunchCorona(true);

      // Play appropriate sound
      playSound(type);

      // Calculate and show score
      let newScore = 0;
      switch (type) {
        case CharacterType.ENEMY:
          const scoreRoll = useGameStore.getState().scoreRoll;
          newScore = 10 + scoreRoll * 2; // Base 10 points plus 2 points per streak
          // Increment scoreRoll for next hit
          useGameStore.getState().incrementScoreRoll();
          break;
        case CharacterType.FRIEND:
          newScore = -30; // Penalty for hitting friend
          // Reset scoreRoll when hitting a friend
          useGameStore.getState().resetScoreRoll();
          break;
        case CharacterType.TIME_BONUS:
          newScore = 20; // Points for time bonus
          break;
      }
      setScore(newScore);
      useGameStore.getState().addScore(newScore);
      setShowScore(true);

      // Update the score in the game store

      // Hide punch corona after 200ms
      if (punchCoronaTimeoutRef.current) {
        window.clearTimeout(punchCoronaTimeoutRef.current);
      }
      punchCoronaTimeoutRef.current = window.setTimeout(() => {
        setShowPunchCorona(false);
      }, 200);

      if (isExiting) {
        // If character was exiting, return to normal position first
        setIsReturning(true);
        const startY = currentY;
        const targetY = position.y * window.innerHeight;
        const returnStartTime = Date.now();

        const returnAnimate = () => {
          const returnElapsed = Date.now() - returnStartTime;
          const returnProgress = Math.min(
            returnElapsed / ANIMATION_DURATION,
            1
          );
          const returnEasedProgress = Ease.inBack(returnProgress, 0.6);

          setCurrentY(startY + (targetY - startY) * returnEasedProgress);

          if (returnProgress < 1) {
            requestAnimationFrame(returnAnimate);
          } else {
            setIsReturning(false);
            // Wait a moment before starting exit animation
            setTimeout(() => {
              startExitAnimation();
            }, 10000); // Stay visible for 10 seconds
          }
        };
        requestAnimationFrame(returnAnimate);
      } else {
        // If not exiting, start exit animation immediately
        startExitAnimation();
      }
    }
  };

  const handleScoreAnimationComplete = () => {
    // Only hide score if character is not in returning state
    if (!isReturning) {
      setShowScore(false);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (punchCoronaTimeoutRef.current) {
        window.clearTimeout(punchCoronaTimeoutRef.current);
      }
    };
  }, []);

  const getImagePath = () => {
    if (!characterImages) return CHARACTER_IMAGES[type][currentState];

    switch (type) {
      case CharacterType.ENEMY:
        return currentState === "normal"
          ? characterImages.enemy.default
          : characterImages.enemy.hit;
      case CharacterType.FRIEND:
        return currentState === "normal"
          ? characterImages.friend.default
          : characterImages.friend.hit;
      case CharacterType.TIME_BONUS:
        return CHARACTER_IMAGES[type][currentState]; // Keep original for time bonus
      default:
        return CHARACTER_IMAGES[type][currentState];
    }
  };

  const imagePath = getImagePath();
  console.log(imagePath);

  return (
    <Container x={position.x * window.innerWidth} y={topOfCar}>
      <Container ref={containerRef}>
        <Graphics ref={maskRef} />
        <Container
          y={currentY - position.y * window.innerHeight + vibrationOffset}
        >
          {showPunchCorona && (
            <Sprite
              image="assets/images/punch-corona.png"
              scale={currentScale * 0.95}
              anchor={0.5}
              alpha={0.8}
            />
          )}
          <Sprite
            ref={spriteRef}
            key={id}
            image={imagePath}
            scale={currentScale}
            y={
              maskConfigs[
                CHARACTER_POSITIONS.findIndex(
                  (pos) => pos.x === position.x && pos.y === position.y
                )
              ].yOffset
            }
            anchor={0.5}
            interactive={true}
            eventMode="static"
            onpointerdown={handleClick}
            onpointerover={() => setIsHovered(true)}
            onpointerout={() => setIsHovered(false)}
            hitArea={new PIXI.Circle(0, 0, 200)}
            cursor="pointer"
          />
        </Container>
      </Container>
      {/* Score text in a separate container that's not affected by hover or animations */}
      <Container>
        {showScore && (
          <ScoreText
            score={score}
            isVisible={showScore}
            onAnimationComplete={handleScoreAnimationComplete}
          />
        )}
      </Container>
    </Container>
  );
};

export default GameCharacter;
