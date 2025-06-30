import { Container, Sprite } from "@pixi/react";
import * as PIXI from "pixi.js";
import React, { useEffect, useMemo, useRef } from "react";
import { useWindowDimensions } from "../hooks";
import { useGameStore } from "../store/gameStore";

interface Layer {
  sprites: PIXI.Sprite[];
  positions: number[];
}

const NUM_LAYERS = 5;
const BASE_SCALE_FACTOR = 1.5;
const OVERLAP = 10;
const BASE_SPEED = 5;

const Background: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const { layersRef, scaledHeight, spriteWidth, overlap } = useBackground(
    width,
    height
  );

  const initialPositions = useMemo(
    () => [-width, -overlap, width - overlap],
    [width, overlap]
  );

  return (
    <Container>
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

  const scaleFactor = BASE_SCALE_FACTOR;
  const scaledHeight = height * scaleFactor;
  const spriteWidth = width + OVERLAP;
  const overlap = OVERLAP;

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
      const speedMultiplier = getSpeedMultiplier();

      layersRef.current.forEach((layer, index) => {
        if (!layer) return;

        const currentSpeed = BASE_SPEED * (index + 1) * speedMultiplier;

        layer.positions = layer.positions.map((pos) => {
          const newPos = pos - currentSpeed;
          return newPos <= -width ? width - overlap : newPos;
        });

        layer.sprites.forEach((sprite, i) => {
          if (sprite) {
            sprite.x = layer.positions[i];
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
  }, [width, height, updateGameTime, getSpeedMultiplier]);

  return {
    layersRef,
    animationRef,
    scaleFactor,
    scaledHeight,
    spriteWidth,
    overlap,
  };
};
