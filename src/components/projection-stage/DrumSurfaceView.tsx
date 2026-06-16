import { AnimatePresence, motion } from "framer-motion";
import punchCoronaImage from "../../assets/punch-corona.png";
import {
  FRIEND_TARGET_ENTRY_MS,
  type HitFeedback,
  type SessionTarget,
} from "../../stores/sessionStore";
import type { DrumSurface, SurfaceHitOptions } from "../../types";
import { SessionGameOverOverlay } from "./SessionGameOverOverlay";
import { SessionIntroOverlay } from "./SessionIntroOverlay";
import { SessionStartOverlay } from "./SessionStartOverlay";
import { getTargetImage, getTargetImageLayout, getTimeBonusHitWrapperStyle } from "./targetImages";
import type { StartSurfaceInteraction } from "./types";

export function DrumSurfaceView({
  activeHit,
  countdown,
  currentTarget,
  finishedAt,
  finishedScore,
  introDemoHit,
  introPhase,
  isActive,
  isEditMode,
  isLearning,
  isMainSurface,
  isSelected,
  isStarting,
  onStartInteraction,
  onSurfaceHit,
  startError,
  surface,
}: {
  activeHit?: HitFeedback;
  countdown: number | null;
  currentTarget: SessionTarget | null;
  finishedAt: number | null;
  finishedScore: number | null;
  introDemoHit: Parameters<typeof SessionIntroOverlay>[0]["introDemoHit"];
  introPhase: Parameters<typeof SessionIntroOverlay>[0]["phase"];
  isActive: boolean;
  isEditMode: boolean;
  isLearning: boolean;
  isMainSurface: boolean;
  isSelected: boolean;
  isStarting: boolean;
  onStartInteraction: StartSurfaceInteraction;
  onSurfaceHit: (surface: DrumSurface, options?: SurfaceHitOptions) => void;
  startError: string | null;
  surface: DrumSurface;
}) {
  const shouldShowIntro = !isEditMode && isMainSurface;
  const targetImage = activeHit
    ? getTargetImage(activeHit.kind, true)
    : currentTarget
      ? getTargetImage(currentTarget.kind)
      : null;
  const targetKind = activeHit?.kind ?? currentTarget?.kind;
  const isTimeBonusHit = activeHit?.kind === "timeBonus";
  const isPowerHit =
    activeHit?.hitStrength === "strong" || activeHit?.hitStrength === "veryStrong";
  const tiltDirection = activeHit?.tiltDirection ?? 0;
  const hitStretchAnimation =
    activeHit?.hitStrength === "veryStrong"
      ? {
          scaleX: [1.04, 1.24, 1.08],
          scaleY: [0.98, 0.8, 0.92],
          rotate: [0, tiltDirection * 9, tiltDirection * 3],
          skewX: [0, tiltDirection * 10, tiltDirection * 4],
        }
      : activeHit?.hitStrength === "strong"
        ? {
            scaleX: [1.02, 1.13, 1.05],
            scaleY: [0.99, 0.9, 0.95],
            rotate: [0, tiltDirection * 7, tiltDirection * 2],
            skewX: [0, tiltDirection * 8, tiltDirection * 3],
          }
        : null;
  const targetImageLayout =
    targetKind !== undefined
      ? getTargetImageLayout(targetKind, Boolean(activeHit))
      : null;
  const targetImageKey = targetKind ? `${surface.id}-${targetKind}` : undefined;
  const surfaceClassName = [
    "absolute bg-black left-0 top-0 flex touch-none select-none flex-col items-center justify-center overflow-hidden rounded-[999px] border-2 text-center shadow-2xl transition-colors duration-100",
    isEditMode ? "cursor-move" : "cursor-pointer",
    isSelected
      ? "bg-white/5 ring-4 ring-cyan-300/30"
      : "border-black border-4 bg-white/5 text-cyan-50",
    isLearning ? "border-amber-300 bg-amber-300/20 ring-4 ring-amber-300/40" : "",
    isEditMode && isMainSurface ? "border-amber-300 ring-4 ring-amber-300/30" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      animate={{ backgroundPositionX: ["0px", "-1024px"] }}
      className={surfaceClassName}
      key={surface.id}
      onPointerDown={(event) => {
        if (isEditMode) {
          onStartInteraction(event, surface, "drag");
          return;
        }

        onSurfaceHit(surface, { source: "pointer" });
      }}
      style={{
        backgroundColor: "black",
        height: surface.height,
        transform: `translate(${surface.x}px, ${surface.y}px) rotate(${surface.rotation}deg)`,
        width: surface.width,
      }}
    >
      <div className="pointer-events-none absolute left-1/2 top-[60%] z-10 h-[96%] w-[96%] -translate-x-1/2 -translate-y-1/2">
        <AnimatePresence initial={false} mode="wait">
          {targetImage && (
            <motion.div
              animate={{ y: "0%" }}
              className={
                isTimeBonusHit
                  ? "flex h-full w-full items-end justify-center"
                  : "h-full w-full"
              }
              exit={{ y: "145%" }}
              initial={{ y: "145%" }}
              key={targetImageKey}
              transition={{ duration: FRIEND_TARGET_ENTRY_MS / 1000, ease: "easeOut" }}
            >
              <div
                className={isTimeBonusHit ? "w-full" : "h-full w-full"}
                style={isTimeBonusHit ? getTimeBonusHitWrapperStyle() : undefined}
              >
                <motion.img
                  alt={`${targetKind} target`}
                  animate={
                    activeHit
                      ? {
                          x: ["-1.2%", "1.2%", "-1.2%"],
                          y: "0%",
                          ...(isPowerHit ? hitStretchAnimation ?? {} : {}),
                        }
                      : { x: "0%", y: ["-2%", "2%", "-2%"] }
                  }
                  className={targetImageLayout?.className}
                  src={targetImage}
                  style={{
                    ...(targetImageLayout?.style ?? {}),
                    transformOrigin: "center center",
                  }}
                  transition={
                    activeHit
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
          )}
        </AnimatePresence>
      </div>
      {activeHit && (
        <div className="pointer-events-none absolute left-1/2 top-[60%] z-0 size-[98%] -translate-x-1/2 -translate-y-1/2">
          <motion.img
            alt=""
            animate={{ scale: [0.95, 1.05, 0.95] }}
            className="h-full w-full object-contain"
            src={punchCoronaImage}
            transition={{
              duration: 0.28,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </div>
      )}

      {isEditMode && (
        <span className="pointer-events-none text-xl font-black uppercase tracking-wide">
          {surface.name}
        </span>
      )}
      {isEditMode && isMainSurface && (
        <span className="pointer-events-none mt-1 rounded-full bg-amber-300 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-950">
          Hauptfläche
        </span>
      )}
      {isEditMode && (
        <span className="pointer-events-none mt-1 text-xs font-bold uppercase tracking-wide opacity-70">
          {surface.midiNote === undefined
            ? "No MIDI"
            : `Ch ${surface.midiChannel} · ${surface.midiNote}`}
        </span>
      )}

      {isEditMode && (
        <>
          <button
            aria-label={`${surface.name} rotieren`}
            className="absolute left-1/2 top-0 h-7 w-7 -translate-x-1/2 -translate-y-12 rounded-full border-2 border-cyan-100 bg-slate-950 shadow-lg shadow-cyan-500/30 before:absolute before:left-1/2 before:top-full before:h-10 before:w-px before:-translate-x-1/2 before:bg-cyan-100"
            onPointerDown={(event) => onStartInteraction(event, surface, "rotate")}
            type="button"
          />
          <button
            aria-label={`${surface.name} skalieren`}
            className="absolute bottom-2 right-2 h-6 w-6 rounded-full border-2 border-white bg-cyan-300 shadow-lg shadow-cyan-500/40"
            onPointerDown={(event) => onStartInteraction(event, surface, "resize")}
            type="button"
          />
        </>
      )}

      {shouldShowIntro && (
        <>
          <SessionStartOverlay
            isActive={isActive}
            isStarting={isStarting}
            startError={startError}
          />
          <SessionIntroOverlay
            countdown={countdown}
            introDemoHit={introDemoHit}
            phase={introPhase}
          />
          <SessionGameOverOverlay
            finishedAt={finishedAt}
            finishedScore={finishedScore}
            isActive={isActive}
          />
        </>
      )}
    </motion.div>
  );
}
