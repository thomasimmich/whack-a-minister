import { motion } from "framer-motion";
import type { HitFeedback } from "../../stores/sessionStore";
import { TIME_BONUS_SECONDS } from "../../stores/sessionStore";
import type { DrumSurface } from "../../types";
import { PixiLikeText } from "./PixiLikeText";

export function ScoreFeedbackOverlay({
  hit,
  surfaces,
}: {
  hit: HitFeedback;
  surfaces: DrumSurface[];
}) {
  const surface = surfaces[hit.surfaceNumber - 1];

  if (!surface) {
    return null;
  }

  const isTimeBonus = hit.kind === "timeBonus";
  const isPositiveFeedback = hit.kind === "enemy";
  const isBoostedHit = hit.hitStrength === "strong" || hit.hitStrength === "veryStrong";
  const isVeryStrongHit = hit.hitStrength === "veryStrong";
  const feedbackTilt = hit.tiltDirection * 9;
  const x = surface.x + surface.width / 2 + hit.offsetX;
  const y = surface.y + surface.height / 2 + hit.offsetY;
  const pointsText = isTimeBonus
    ? `+${TIME_BONUS_SECONDS} Sekunden`
    : hit.points > 0
      ? `+${hit.points}`
      : String(hit.points);
  const streakText = isTimeBonus
    ? "Zeitbonus"
    : isPositiveFeedback
      ? isVeryStrongHit
        ? `Streak x${hit.streak} · x1.5`
        : hit.bonusPoints > 0
          ? `Streak x${hit.streak} · Bonus`
          : `Streak x${hit.streak}`
      : "Streak reset";
  const powerText = isVeryStrongHit ? "MEGA HIT!" : isBoostedHit ? "HARTER TREFFER!" : null;

  return (
    <div
      className="pointer-events-none fixed z-999"
      style={{
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${surface.rotation}deg)`,
      }}
    >
      <motion.div
        animate={
          isTimeBonus
            ? {
                opacity: 1,
                scale: [0.72, 1.24, 1],
                y: -92,
              }
            : isPositiveFeedback
            ? {
                opacity: 1,
                scale: [0.72, 1.2, 1],
                y: -92,
              }
            : {
                opacity: 1,
                scale: [0.78, 1.1, 1],
                x: [-10, 10, -7, 7, 0],
                y: -76,
              }
        }
        className="relative grid min-w-32 justify-items-center"
        exit={{
          opacity: 0,
          scale: 0.72,
          transition: { duration: 0.08 },
          y: -132,
        }}
        initial={{ opacity: 0, scale: 0.72, y: -12 }}
        key={hit.id}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        <div
          style={
            isBoostedHit
              ? { transform: `rotate(${feedbackTilt}deg) skewX(${hit.tiltDirection * 5}deg)` }
              : undefined
          }
        >
          <PixiLikeText
            colors={
              isTimeBonus
                ? ["#ffffff", "#fde047", "#facc15"]
                : isPositiveFeedback
                  ? ["#ffffff", "#a3e635"]
                  : ["#ff6b6b", "#ff0000"]
            }
            fontSize={isTimeBonus ? 44 : 56}
            id={`${hit.id}-points`}
            strokeWidth={8}
            text={pointsText}
          />
          <PixiLikeText
            colors={
              isTimeBonus
                ? ["#ffd700", "#ff8c00", "#ff4500"]
                : isPositiveFeedback
                ? ["#ffd700", "#ff8c00", "#ff4500"]
                : ["#ffffff", "#fca5a5"]
            }
            fontSize={24}
            id={`${hit.id}-streak`}
            strokeWidth={8}
            text={streakText.toUpperCase()}
          />
          {powerText && (
            <motion.div
              animate={{ scale: [0.85, 1.06, 1], y: [8, 0, -2] }}
              initial={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.34, ease: "easeOut" }}
            >
              <PixiLikeText
                colors={isVeryStrongHit ? ["#ffffff", "#f97316", "#ef4444"] : ["#ffffff", "#22d3ee", "#0ea5e9"]}
                fontSize={22}
                id={`${hit.id}-power`}
                strokeWidth={7}
                text={powerText}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
