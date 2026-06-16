import { motion } from "framer-motion";
import { useMemo } from "react";

const CONFETTI_COLORS = [
  "#ffd700",
  "#ff8c00",
  "#ff4500",
  "#a3e635",
  "#67e8f9",
  "#f472b6",
  "#c084fc",
  "#ffffff",
];

type ConfettiPiece = {
  color: string;
  delay: number;
  duration: number;
  id: number;
  left: number;
  rotation: number;
  size: number;
  xDrift: number;
};

function createConfettiPieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, id) => ({
    color: CONFETTI_COLORS[id % CONFETTI_COLORS.length]!,
    delay: Math.random() * 0.45,
    duration: 1.8 + Math.random() * 1.4,
    id,
    left: Math.random() * 100,
    rotation: Math.random() * 720 - 360,
    size: 6 + Math.random() * 8,
    xDrift: (Math.random() - 0.5) * 120,
  }));
}

export function ConfettiOverlay() {
  const pieces = useMemo(() => createConfettiPieces(72), []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-50 overflow-hidden rounded-[999px]"
    >
      {pieces.map((piece) => (
        <motion.span
          animate={{
            opacity: [1, 1, 0],
            rotate: piece.rotation,
            top: "108%",
            x: piece.xDrift,
          }}
          className="absolute block rounded-sm"
          initial={{
            opacity: 1,
            rotate: 0,
            top: "-8%",
            x: 0,
          }}
          key={piece.id}
          style={{
            backgroundColor: piece.color,
            height: piece.size * 0.55,
            left: `${piece.left}%`,
            width: piece.size,
          }}
          transition={{
            delay: piece.delay,
            duration: piece.duration,
            ease: "easeIn",
            opacity: { duration: piece.duration, times: [0, 0.75, 1] },
            repeat: Infinity,
            repeatDelay: 0.2,
          }}
        />
      ))}
    </div>
  );
}
