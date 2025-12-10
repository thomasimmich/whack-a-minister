import { Container, Sprite } from "@pixi/react";
import * as PIXI from "pixi.js";
import React, { useEffect, useRef } from "react";
import { useWindowDimensions } from "../hooks";
import { useGameStore } from "../store/gameStore";

interface Layer {
  sprites: PIXI.Sprite[];
  positions: number[];
}

const NUM_LAYERS = 5;

const BASE_OVERLAP = 1.5;
const BASE_SPEED = 10;

const Background: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const { layersRef, spriteHeight, imageAspectRatiosRef } = useBackground(
    width,
    height
  );
  const resetScoreRoll = useGameStore((state) => state.resetScoreRoll);


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
          {[0, 1, 2].map((spriteIndex) => (
            <Sprite
              key={`sprite-${index}-${spriteIndex}`}
              ref={(el) => {
                if (el) {
                  if (!layersRef.current[index]) {
                    layersRef.current[index] = {
                      sprites: [],
                      positions: [],
                    };
                  }
                  layersRef.current[index].sprites[spriteIndex] = el;
                  
                  // Store aspect ratio when sprite is loaded
                  if (el.texture && el.texture.width && el.texture.height) {
                    const aspectRatio = el.texture.width / el.texture.height;
                    imageAspectRatiosRef.current.set(index, aspectRatio);
                    // Scale to fill viewport height while maintaining aspect ratio
                    el.height = spriteHeight;
                    el.width = spriteHeight * aspectRatio;
                  }
                }
              }}
              image={`/assets/images/back${index}.png`}
              y={height}
              height={spriteHeight}
              anchor={[0, 1]}
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
  const { updateGameTime } = useGameStore();
  const imageAspectRatiosRef = useRef<Map<number, number>>(new Map());

  const overlap = BASE_OVERLAP;
  const spriteHeight = height;

  useEffect(() => {
    const animate = () => {
      updateGameTime();
      layersRef.current.forEach((layer, index) => {
        if (!layer) return;

        // Get aspect ratio to calculate sprite width
        const aspectRatio = imageAspectRatiosRef.current.get(index);
        const currentSpriteWidth = aspectRatio ? spriteHeight * aspectRatio : width + BASE_OVERLAP;
        
        // Initialize positions if not set, based on actual sprite width
        if (layer.positions.length === 0 || layer.positions[0] === undefined) {
          layer.positions = [-currentSpriteWidth, -overlap, currentSpriteWidth - overlap];
        }

        // Make the parallax start slower and increase more gently between layers
        const layerDepth =
          NUM_LAYERS > 1 ? index / (NUM_LAYERS - 1) : 0; // 0 (back) -> 1 (front)
        const layerSpeedFactor = 1 + layerDepth * 1; // from 1x to 2x across layers

        // Constant speed - no speed multiplier applied
        const currentSpeed = BASE_SPEED * 0.6 * layerSpeedFactor;

        // Update positions with movement
        const updatedPositions = layer.positions.map((pos) => pos - currentSpeed);
        
        // Handle wrap-around: move sprites that went off-screen to the right side
        updatedPositions.forEach((newPos, spriteIndex) => {
          if (newPos <= -currentSpriteWidth) {
            // Find the rightmost sprite position (excluding this one)
            const otherPositions = updatedPositions.filter((_, i) => i !== spriteIndex);
            const rightmostPos = otherPositions.length > 0 ? Math.max(...otherPositions) : currentSpriteWidth - overlap;
            // Place this sprite right after the rightmost sprite, ensuring seamless connection
            updatedPositions[spriteIndex] = rightmostPos + currentSpriteWidth - overlap;
          }
        });
        
        layer.positions = updatedPositions;

        layer.sprites.forEach((sprite, i) => {
          if (sprite && sprite.texture) {
            sprite.x = layer.positions[i];
            
            // Get aspect ratio from texture if available
            const imgAspectRatio = imageAspectRatiosRef.current.get(index);
            if (imgAspectRatio) {
              // Scale to fill viewport height while maintaining aspect ratio
              sprite.height = spriteHeight;
              sprite.width = spriteHeight * imgAspectRatio;
            } else {
              // Fallback: try to get from texture
              const texture = sprite.texture;
              if (texture && texture.width && texture.height) {
                const calculatedAspectRatio = texture.width / texture.height;
                imageAspectRatiosRef.current.set(index, calculatedAspectRatio);
                sprite.height = spriteHeight;
                sprite.width = spriteHeight * calculatedAspectRatio;
              }
            }
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
  }, [width, height, updateGameTime, spriteHeight, imageAspectRatiosRef]);

  return {
    layersRef,
    animationRef,
    spriteHeight,
    imageAspectRatiosRef,
  };
};
