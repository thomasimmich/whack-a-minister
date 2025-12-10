import { Container, Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import React, { useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import { useGameStore } from "../store/gameStore";

const GameUI: React.FC = () => {
  const { width } = useWindowDimensions();
  const { score, timeLeft, scoreRoll } = useGameStore();
  const [pulseScale, setPulseScale] = useState(1);
  const [comboIncreaseScale, setComboIncreaseScale] = useState(1);
  const previousScoreRollRef = useRef(scoreRoll);

  const isMobile = width < 768;
  const fontSize = isMobile ? 24 : 32;
  const margin = isMobile ? 80 : 120; // Increased to accommodate shadow

  // Combo increase animation
  useEffect(() => {
    if (scoreRoll > previousScoreRollRef.current) {
      // Combo increased - trigger scale up animation
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / 300, 1); // 300ms animation
        const scale = 1 + 0.5 * (1 - progress); // Scale from 1.5 to 1
        setComboIncreaseScale(scale);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setComboIncreaseScale(1);
        }
      };
      requestAnimationFrame(animate);
    }
    previousScoreRollRef.current = scoreRoll;
  }, [scoreRoll]);

  // Pulse animation for combo and time when low
  useEffect(() => {
    if (scoreRoll > 0 || timeLeft <= 10) {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const pulse = 1 + 0.1 * Math.sin(elapsed * 0.01); // Pulse between 1 and 1.1
        setPulseScale(pulse);
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    } else {
      setPulseScale(1);
    }
  }, [scoreRoll, timeLeft]);

  // Score text style
  const scoreTextStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: fontSize,
    fontStyle: "italic",
    fontWeight: "bold",
    fill: ["#ffffff", "#00ff00"], // White to green gradient
    fillGradientType: PIXI.TEXT_GRADIENT.LINEAR_VERTICAL,
    stroke: "#000000",
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 8,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
  });

  // Combo text style
  const comboTextStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: isMobile ? 18 : 24,
    fontStyle: "italic",
    fontWeight: "bold",
    fill: ["#ffd700", "#ff8c00", "#ff4500"], // Yellow to orange to red gradient
    fillGradientType: PIXI.TEXT_GRADIENT.LINEAR_VERTICAL,
    stroke: "#000000",
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 8,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
  });

  // Time text style
  const timeTextStyle = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: fontSize,
    fontStyle: "italic",
    fontWeight: "bold",
    fill:
      timeLeft <= 10
        ? ["#ff6b6b", "#ff0000"] // Red gradient when time is low
        : ["#ffffff", "#00ff00"], // White to green gradient normally
    fillGradientType: PIXI.TEXT_GRADIENT.LINEAR_VERTICAL,
    stroke: "#000000",
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 8,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
  });

  return (
    <Container x={0} y={0}>
      {/* Score */}
      <Text
        text={`Score: ${score}`}
        style={scoreTextStyle}
        anchor={0.5}
        x={margin} // Add 20px "padding" to the right
        y={50}
      />

      {/* Combo - only show when scoreRoll > 0 */}
      {scoreRoll > 1 && (
        <Text
          text={`Combo: x${scoreRoll}`}
          style={comboTextStyle}
          anchor={0.5}
          x={margin}
          y={isMobile ? 80 : 100}
          scale={pulseScale * comboIncreaseScale}
        />
      )}

      {/* Time - positioned on the right side, same y as score */}
      <Text
        text={`Time: ${timeLeft}s`}
        style={timeTextStyle}
        anchor={0.5}
        x={width - margin}
        y={50}
        scale={timeLeft <= 10 ? pulseScale : 1}
      />
    </Container>
  );
};

export default GameUI;
