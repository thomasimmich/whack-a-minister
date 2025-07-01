import { Container, Sprite } from "@pixi/react";
import * as PIXI from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { useGame, useWindowDimensions } from "../hooks";
import useCarStore from "../store/carStore";
import { useGameStateStore } from "../store/gameStateStore";
import { useGameStore } from "../store/gameStore";
import { GameState } from "../types/gameTypes";
import SoundManager from "../utils/SoundManager";

const Car = () => {
  const soundManager = SoundManager.getInstance();
  const { width, height } = useWindowDimensions();
  const resetScoreRoll = useGameStore((state) => state.resetScoreRoll);

  const scaleFactor = width / 2732;
  const carAspectRatio = 2.5;
  const carWidth = width * 0.8;
  const carHeight = carWidth / carAspectRatio;
  const wheelSize = carWidth * 0.22;

  const carX = width * 0.5065;
  const carY = height - carHeight * 0.75;
  const wheel1X = width * 0.82;
  const wheel2X = width * 0.22;
  const wheelY = height - wheelSize / 2;

  const { carRef, wheelRef, wheel2Ref } = useCarAnimation(carX, carY);

  useUpdateCarPosition(carY, carHeight);

  const handleCarClick = () => {
    soundManager.playSound("horn");
    resetScoreRoll();
  };

  return (
    <Container>
      {/* Car body */}
      <Sprite
        ref={carRef}
        image="/assets/images/car.png"
        x={carX}
        y={carY}
        width={carWidth}
        height={carHeight}
        interactive={true}
        pointerdown={handleCarClick}
        scale={scaleFactor}
      />

      {/* Wheels */}
      <Sprite
        ref={wheelRef}
        image="/assets/images/wheel.png"
        x={wheel1X}
        y={wheelY}
        width={wheelSize}
        height={wheelSize}
        scale={scaleFactor}
      />
      <Sprite
        ref={wheel2Ref}
        image="/assets/images/wheel.png"
        x={wheel2X}
        y={wheelY}
        width={wheelSize}
        height={wheelSize}
        scale={scaleFactor}
      />
    </Container>
  );
};

export default Car;

const useCarAnimation = (carX: number, carY: number) => {
  const carRef = useRef<PIXI.Sprite>(null);
  const wheelRef = useRef<PIXI.Sprite>(null);
  const wheel2Ref = useRef<PIXI.Sprite>(null);
  const [stateTime, setStateTime] = useState(0);

  const { speed } = useGame();
  const gameTime = useGameStore((state) => state.gameTime);
  const startTime = useGameStore((state) => state.startTime);
  const { getSpeedMultiplier } = useGameStore();
  const gameState = useGameStateStore((state) => state.gameState);

  // Car
  useEffect(() => {
    if (!carRef.current) return;

    carRef.current.anchor.set(0.5);

    const motionEffect = () => {
      if (!carRef.current) return;

      const time = Date.now() * 0.001;
      carRef.current.rotation = Math.sin(time * 8) * 0.01;

      requestAnimationFrame(motionEffect);
    };

    const animationFrame = requestAnimationFrame(motionEffect);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Wheels
  useEffect(() => {
    if (!wheelRef.current || !wheel2Ref.current) return;

    wheelRef.current.anchor.set(0.5);
    wheel2Ref.current.anchor.set(0.5);

    const animateWheels = () => {
      if (wheelRef.current && wheel2Ref.current) {
        // Use the same speed multiplier system as the parallax background
        const speedMultiplier =
          gameState === GameState.IDLE ? getSpeedMultiplier() : 1;
        const cappedSpeedMultiplier = Math.min(speedMultiplier, 3);
        const baseRotationSpeed = 0.04;
        const rotationSpeed = baseRotationSpeed * cappedSpeedMultiplier;

        wheelRef.current.rotation += rotationSpeed;
        wheel2Ref.current.rotation += rotationSpeed;
      }

      requestAnimationFrame(animateWheels);
    };

    const animationFrameWheels = requestAnimationFrame(animateWheels);
    return () => {
      cancelAnimationFrame(animationFrameWheels);
    };
  }, [getSpeedMultiplier, gameState]);

  return { carRef, wheelRef, wheel2Ref, stateTime, setStateTime };
};

const useUpdateCarPosition = (carY: number, carHeight: number) => {
  const setTopOfCar = useCarStore((state) => state.setTopOfCar);

  useEffect(() => {
    setTopOfCar(carY - carHeight / 4.5);
  }, [carY, carHeight, setTopOfCar]);
};
