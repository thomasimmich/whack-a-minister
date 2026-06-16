import { motion } from "framer-motion";
import { normalizeStatusPanelCutPercent } from "../../statusPanel";
import type { DrumSurface } from "../../types";
import { formatRemainingTime } from "./time";
import type { StartSurfaceInteraction } from "./types";

export function StatusPanelSurface({
  finishedScore,
  isActive,
  isEditMode,
  isIntroComplete,
  isSelected,
  onStartInteraction,
  remainingSeconds,
  score,
  surface,
}: {
  finishedScore: number | null;
  isActive: boolean;
  isEditMode: boolean;
  isIntroComplete: boolean;
  isSelected: boolean;
  onStartInteraction: StartSurfaceInteraction;
  remainingSeconds: number | null;
  score: number;
  surface: DrumSurface;
}) {
  const shouldShowLiveStatus =
    isEditMode || (isActive && isIntroComplete && remainingSeconds !== null);
  const displayScore = finishedScore ?? score;
  const displaySeconds = remainingSeconds ?? 0;

  if (!shouldShowLiveStatus && finishedScore === null) {
    return null;
  }

  return (
    <motion.div
      className={[
        "absolute left-0 top-0 touch-none select-none",
        isEditMode ? "cursor-move" : "pointer-events-none",
      ]
        .filter(Boolean)
        .join(" ")}
      key={surface.id}
      onPointerDown={(event) => {
        if (isEditMode) {
          onStartInteraction(event, surface, "drag");
        }
      }}
      style={{
        height: surface.height,
        transform: `translate(${surface.x}px, ${surface.y}px) rotate(${surface.rotation}deg)`,
        width: surface.width,
      }}
    >
      <SessionStatusPanel
        isEditMode={isEditMode}
        isSelected={isSelected}
        onStartInteraction={onStartInteraction}
        remainingSeconds={displaySeconds}
        score={displayScore}
        surface={surface}
      />
      {isEditMode && (
        <button
          aria-label="Status Panel skalieren"
          className="absolute bottom-2 right-2 z-40 h-6 w-6 rounded-full border-2 border-white bg-cyan-300 shadow-lg shadow-cyan-500/40"
          onPointerDown={(event) => onStartInteraction(event, surface, "resize")}
          type="button"
        />
      )}
    </motion.div>
  );
}

function SessionStatusPanel({
  isEditMode = false,
  isSelected = false,
  onStartInteraction,
  remainingSeconds,
  score,
  surface,
}: {
  isEditMode?: boolean;
  isSelected?: boolean;
  onStartInteraction?: StartSurfaceInteraction;
  remainingSeconds: number;
  score: number;
  surface: DrumSurface;
}) {
  const cutPercent = normalizeStatusPanelCutPercent(surface.statusPanelCutPercent);
  const contentPaddingPercent = Math.min(58, cutPercent + 12);

  return (
    <motion.div className="relative h-full w-full" layout>
      <div
        className={[
          "relative h-full overflow-hidden rounded-full border bg-slate-950/78 shadow-2xl shadow-black/45 backdrop-blur-md",
          isSelected ? "border-cyan-300 ring-4 ring-cyan-300/30" : "border-white/20",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          clipPath: `inset(0 0 0 ${cutPercent}% round 999px)`,
        }}
      >
        <div
          className="relative z-10 grid h-full content-center gap-2 pr-[10%] text-center"
          style={{ paddingLeft: `${contentPaddingPercent}%` }}
        >
          <div>
            <span className="block text-[0.58rem] font-black uppercase tracking-[0.22em] text-cyan-100/80">
              Zeit
            </span>
            <strong className="block text-[clamp(1.45rem,5vw,3.25rem)] font-black leading-none text-amber-200">
              {formatRemainingTime(remainingSeconds)}
            </strong>
          </div>
          <div>
            <span className="block text-[0.58rem] font-black uppercase tracking-[0.22em] text-cyan-100/80">
              Coins
            </span>
            <strong className="block text-[clamp(1.35rem,4.4vw,2.8rem)] font-black leading-none text-white">
              {score}
            </strong>
          </div>
        </div>
      </div>
      <button
        aria-label="Status Panel Abgrenzung verschieben"
        className={[
          "absolute top-[12%] z-30 h-[76%] w-4 -translate-x-1/2 rounded-full",
          isEditMode
            ? "cursor-ew-resize bg-cyan-200/25 shadow-[0_0_18px_rgba(103,232,249,0.5)]"
            : "pointer-events-none bg-cyan-100/45 shadow-[0_0_18px_rgba(103,232,249,0.5)]",
        ]
          .filter(Boolean)
          .join(" ")}
        onPointerDown={(event) => {
          if (isEditMode && onStartInteraction) {
            onStartInteraction(event, surface, "statusPanelCut");
          }
        }}
        style={{ left: `${cutPercent}%` }}
        type="button"
      />
    </motion.div>
  );
}
