import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getRestartCooldownRemainingSeconds } from "../../stores/sessionStore";
import { playGameOverSound, stopGameOverSound } from "./audio";
import { getHighScore, setHighScore } from "../../storage";
import { ConfettiOverlay } from "./ConfettiOverlay";
import { PixiLikeText } from "./PixiLikeText";

export function SessionGameOverOverlay({
  finishedAt,
  finishedScore,
  isActive,
}: {
  finishedAt: number | null;
  finishedScore: number | null;
  isActive: boolean;
}) {
  const [restartCooldownSeconds, setRestartCooldownSeconds] = useState(() =>
    getRestartCooldownRemainingSeconds(finishedAt),
  );
  const [highScore, setHighScoreDisplay] = useState(() => getHighScore());
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  useEffect(() => {
    setRestartCooldownSeconds(getRestartCooldownRemainingSeconds(finishedAt));

    if (finishedAt === null) {
      return;
    }

    const interval = window.setInterval(() => {
      const remainingSeconds = getRestartCooldownRemainingSeconds(finishedAt);
      setRestartCooldownSeconds(remainingSeconds);

      if (remainingSeconds <= 0) {
        window.clearInterval(interval);
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [finishedAt]);

  useEffect(() => {
    if (isActive || finishedScore === null) {
      return;
    }

    playGameOverSound();

    return () => {
      stopGameOverSound();
    };
  }, [finishedScore, isActive]);

  useEffect(() => {
    if (finishedScore === null) {
      setIsNewHighScore(false);
      setHighScoreDisplay(getHighScore());
      return;
    }

    const previousHighScore = getHighScore();

    if (finishedScore > previousHighScore) {
      setHighScore(finishedScore);
      setHighScoreDisplay(finishedScore);
      setIsNewHighScore(true);
      return;
    }

    setHighScoreDisplay(previousHighScore);
    setIsNewHighScore(false);
  }, [finishedScore]);

  if (isActive || finishedScore === null) {
    return null;
  }

  const canRestart = restartCooldownSeconds <= 0;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="pointer-events-none absolute inset-0 z-30 grid place-items-center rounded-[999px] bg-slate-950/84 p-8 text-center backdrop-blur-sm"
        exit={{ opacity: 0, scale: 0.94 }}
        initial={{ opacity: 0, scale: 0.94 }}
        key="game-over"
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        <div className="pt-2">
          <PixiLikeText
            colors={["#ffd700", "#ff8c00", "#ff4500"]}
            fontSize={28}
            id="game-over-label"
            maxWidth={260}
            strokeWidth={8}
            text="SPIEL VORBEI"
          />
          <div className="relative">
            <PixiLikeText
              colors={["#ffffff", "#a3e635"]}
              fontSize={76}
              id="game-over-score"
              maxWidth={260}
              strokeWidth={10}
              text={String(finishedScore)}
            />
          </div>
          {isNewHighScore ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              className=""
              transition={{
                duration: 0.85,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              <PixiLikeText
                colors={["#fff7ad", "#ffd700", "#ff8c00"]}
                fontSize={26}
                id="game-over-highscore-broken"
                maxWidth={280}
                strokeWidth={8}
                text="HIGHSCORE GEBROCHEN!"
              />
            </motion.div>
          ) : (
            <div className="relative">
              <PixiLikeText
                colors={["#cbd5e1", "#94a3b8"]}
                fontSize={22}
                id="game-over-highscore"
                maxWidth={280}
                strokeWidth={7}
                text={`HIGHSCORE: ${highScore}`}
              />
            </div>
          )}
          <div className="relative">
            <PixiLikeText
              colors={canRestart ? ["#ffffff", "#67e8f9"] : ["#fbbf24", "#f97316"]}
              fontSize={22}
              id="game-over-restart"
              maxWidth={280}
              strokeWidth={7}
              text={
                canRestart
                  ? "SCHLAGEN UM NOCHMAL ZU SPIELEN"
                  : `NOCH ${restartCooldownSeconds}s WARTEN`
              }
            />
          </div>
        </div>
        {isNewHighScore && <ConfettiOverlay />}
      </motion.div>
    </AnimatePresence>
  );
}
