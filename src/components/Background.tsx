import { Container, Sprite } from "@pixi/react";
import * as PIXI from "pixi.js";
import React, { useEffect, useMemo, useRef } from "react";
import { useWindowDimensions } from "../hooks";
import { useGameStateStore } from "../store/gameStateStore";
import { useGameStore } from "../store/gameStore";
import { GameState } from "../types/gameTypes";

interface Layer {
  sprites: PIXI.Sprite[];
  positions: number[];
}

const NUM_LAYERS = 5;
const BASE_SCALE_FACTOR = 1.5;

const BASE_OVERLAP = 1.5;
const BASE_SPEED = 5;
const OVERLAP_SPEED_MULTIPLIER = 0.5;

const Background: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const { layersRef, scaledHeight, spriteWidth, overlap } = useBackground(
    width,
    height
  );
  const resetScoreRoll = useGameStore((state) => state.resetScoreRoll);

  const initialPositions = useMemo(
    () => [-width, -overlap, width - overlap],
    [width, overlap]
  );

  const handleBackgroundClick = (e: PIXI.FederatedPointerEvent) => {
    // Check if click is in character areas (x: 0.15, 0.35, 0.55, 0.75 with y around 0.5)
    const clickX = e.global.x / width;
    const clickY = e.global.y / height;

    // Character positions are at x: 0.15, 0.35, 0.55, 0.75 with y around 0.5
    const characterXPositions = [0.15, 0.35, 0.55, 0.75];
    const characterAreaWidth = 0.2; // Approximate width of character area
    const characterAreaHeight = 0.4; // Approximate height of character area

    // Check if click is within any character area
    const isInCharacterArea = characterXPositions.some((xPos) => {
      const inXRange = Math.abs(clickX - xPos) < characterAreaWidth / 2;
      const inYRange = Math.abs(clickY - 0.5) < characterAreaHeight / 2;
      return inXRange && inYRange;
    });

    // Only reset combo if not clicking in character areas
    if (!isInCharacterArea) {
      resetScoreRoll();
    }
  };

  return (
    <Container
      interactive={true}
      eventMode="static"
      onpointerdown={handleBackgroundClick}
    >
      {Array.from({ length: NUM_LAYERS }).map((_, index) => (
        <React.Fragment key={`layer-${index}`}>
          {initialPositions.map((xPos, spriteIndex) => (
            <Sprite
              key={`sprite-${index}-${spriteIndex}`}
              ref={(el) => {
                if (el) {
                  if (!layersRef.current[index]) {
                    layersRef.current[index] = {
                      sprites: [],
                      positions: initialPositions,
                    };
                  }
                  layersRef.current[index].sprites[spriteIndex] = el;
                }
              }}
              image={`/assets/images/back${index}.png`}
              x={xPos}
              y={height - scaledHeight}
              width={spriteWidth}
              height={scaledHeight}
              anchor={0}
            />
          ))}
        </React.Fragment>
      ))}
    </Container>
  );
};

export default Background;

const useBackground = (width: number, height: number) => {
  const layersRef = useRef<Layer[]>([]);
  const animationRef = useRef<number>();
  const { updateGameTime, getSpeedMultiplier } = useGameStore();
  const gameState = useGameStateStore((state) => state.gameState);

  const scaleFactor = BASE_SCALE_FACTOR;
  const scaledHeight = height * scaleFactor;
  const spriteWidth = width + BASE_OVERLAP;
  const overlap = BASE_OVERLAP;

  useEffect(() => {
    const initialPositions = [-width, -overlap, width - overlap];

    // Initialize layer positions
    layersRef.current.forEach((layer) => {
      if (layer) {
        layer.positions = initialPositions;
      }
    });

    const animate = () => {
      updateGameTime();
      layersRef.current.forEach((layer, index) => {
        if (!layer) return;

        // Use base speed when game is not in IDLE state (game over, splash, etc.)
        const speedMultiplier =
          gameState === GameState.IDLE ? getSpeedMultiplier() : 1;
        const cappedSpeedMultiplier = Math.min(speedMultiplier, 3);
        const currentSpeed = BASE_SPEED * (index + 1) * cappedSpeedMultiplier;

        // Calculate dynamic overlap based on speed
        const dynamicOverlap =
          BASE_OVERLAP + currentSpeed * OVERLAP_SPEED_MULTIPLIER;
        const spriteWidth = width + dynamicOverlap;

        layer.positions = layer.positions.map((pos) => {
          const newPos = pos - currentSpeed;
          return newPos <= -width ? width - dynamicOverlap : newPos;
        });

        layer.sprites.forEach((sprite, i) => {
          if (sprite) {
            sprite.x = layer.positions[i];
            sprite.width = spriteWidth;
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, updateGameTime, getSpeedMultiplier, gameState]);

  return {
    layersRef,
    animationRef,
    scaleFactor,
    scaledHeight,
    spriteWidth,
    overlap,
  };
};
