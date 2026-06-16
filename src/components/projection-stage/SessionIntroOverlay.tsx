import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import punchCoronaImage from "../../assets/punch-corona.png";
import {
  FRIEND_TARGET_ENTRY_MS,
  getIntroDemoKind,
  type IntroDemoHit,
  type SessionIntroPhase,
} from "../../stores/sessionStore";
import { playStartTimerSound, stopStartTimerSound } from "./audio";
import { PixiLikeText } from "./PixiLikeText";
import {
  getTargetImage,
  getTargetImageLayout,
  getTimeBonusHitWrapperStyle,
} from "./targetImages";

type IntroContent = {
  colors: string[];
  fontSize: number;
  key: string;
  kind: "enemy" | "friend" | "timeBonus" | null;
  text: string;
};

export function SessionIntroOverlay({
  countdown,
  introDemoHit,
  phase,
}: {
  countdown: number | null;
  introDemoHit: IntroDemoHit | null;
  phase: SessionIntroPhase;
}) {
  const content = getIntroContent(phase, countdown);

  useEffect(() => {
    if (phase !== "countdown") {
      return;
    }

    playStartTimerSound();

    return () => {
      stopStartTimerSound();
    };
  }, [phase]);

  if (!content) {
    return null;
  }

  const demoKind = getIntroDemoKind(phase);
  const isHintScreen = demoKind !== null;
  const isHit = isHintScreen && introDemoHit?.kind === demoKind;
  const targetImage = isHintScreen ? getTargetImage(demoKind, isHit) : null;
  const isTimeBonus = demoKind === "timeBonus";
  const isEnemyOrFriend = demoKind === "enemy" || demoKind === "friend";
  const targetImageLayout =
    demoKind !== null ? getTargetImageLayout(demoKind, isHit) : null;
  const introImageStyle =
    isTimeBonus && isHit
      ? getTimeBonusHitWrapperStyle()
      : isEnemyOrFriend
        ? { transform: "translateY(8%)" }
        : undefined;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="pointer-events-none absolute inset-0 z-20 grid place-items-center rounded-[999px] bg-slate-950/78 p-6 text-center backdrop-blur-sm"
        exit={{ opacity: 0, scale: 0.94 }}
        initial={{ opacity: 0, scale: 0.94 }}
        key={content.key}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        {isHintScreen && targetImage ? (
          <div className="relative h-full w-full max-w-[88%]">
            <div
              className={`pointer-events-none absolute inset-0 z-40 flex items-center justify-center ${
                isTimeBonus ? "translate-y-[-7%]" : ""
              }`}
            >
              <div className="rounded-2xl px-4 py-2 backdrop-blur-[1px]">
                <PixiLikeText
                  colors={content.colors}
                  fontSize={content.fontSize}
                  id={`${content.key}-text`}
                  maxWidth={340}
                  strokeWidth={content.fontSize >= 72 ? 10 : 8}
                  text={content.text.toUpperCase()}
                />
              </div>
            </div>
            <div className="relative z-10 flex h-full w-full min-h-0 items-end justify-center">
              {isHit && (
                <div className="absolute inset-0 z-0 flex items-end justify-center">
                  <motion.img
                    alt=""
                    animate={{ scale: [0.95, 1.05, 0.95] }}
                    className="h-[84%] w-[84%] object-contain"
                    src={punchCoronaImage}
                    transition={{
                      duration: 0.28,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                  />
                </div>
              )}
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  animate={{ y: "0%" }}
                  className={
                    isTimeBonus && isHit
                      ? "relative z-10 flex h-full w-full items-end justify-center"
                      : "relative z-10 h-full w-full"
                  }
                  exit={{ y: "145%" }}
                  initial={{ y: "145%" }}
                  key={content.key}
                  transition={{
                    duration: FRIEND_TARGET_ENTRY_MS / 1000,
                    ease: "easeOut",
                  }}
                >
                  <div
                    className={
                      isTimeBonus && isHit
                        ? "mx-auto w-[64%]"
                        : isTimeBonus
                          ? "mx-auto h-[66%] w-[66%]"
                          : "mx-auto h-[82%] w-[82%]"
                    }
                    style={introImageStyle}
                  >
                    <motion.img
                      alt={`${demoKind} intro target`}
                      animate={
                        isHit
                          ? { x: ["-1.2%", "1.2%", "-1.2%"], y: "0%" }
                          : { x: "0%", y: ["-2%", "2%", "-2%"] }
                      }
                      className={targetImageLayout?.className}
                      src={targetImage}
                      style={targetImageLayout?.style}
                      transition={
                        isHit
                          ? {
                              duration: 0.12,
                              ease: "easeInOut",
                              repeat: Infinity,
                            }
                          : {
                              duration: 1.45,
                              ease: "easeInOut",
                              repeat: Infinity,
                            }
                      }
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <PixiLikeText
            colors={content.colors}
            fontSize={content.fontSize}
            id={`${content.key}-text`}
            maxWidth={280}
            strokeWidth={content.fontSize >= 72 ? 10 : 8}
            text={content.text.toUpperCase()}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function getIntroContent(
  phase: SessionIntroPhase,
  countdown: number | null,
): IntroContent | null {
  if (phase === "enemyHint") {
    return {
      colors: ["#ffffff", "#4ade80", "#16a34a"],
      fontSize: 38,
      key: phase,
      kind: "enemy",
      text: "Schlagen!",
    };
  }

  if (phase === "friendHint") {
    return {
      colors: ["#ffffff", "#67e8f9", "#22d3ee"],
      fontSize: 34,
      key: phase,
      kind: "friend",
      text: "Nicht schlagen!",
    };
  }

  if (phase === "timeBonusHint") {
    return {
      colors: ["#ffffff", "#fde047", "#facc15"],
      fontSize: 30,
      key: phase,
      kind: "timeBonus",
      text: "Schlagen für Extrazeit",
    };
  }

  if (phase === "countdown" && countdown !== null) {
    return {
      colors: ["#ffd700", "#ff8c00", "#ff4500"],
      fontSize: 96,
      key: `${phase}-${countdown}`,
      kind: null,
      text: String(countdown),
    };
  }

  return null;
}
