import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useSessionStore } from "../../stores/sessionStore";
import {
  playBackgroundMusic,
  playEndTimerSound,
  playHitSound,
  preloadHitSounds,
  resumeAudioPlayback,
  setBackgroundMusicMuted,
  stopEndTimerSound,
  stopGameOverSound,
  stopStartTimerSound,
} from "./audio";

const END_TIMER_START_SECONDS = 4;
import { DrumSurfaceView } from "./DrumSurfaceView";
import { ScoreFeedbackOverlay } from "./ScoreFeedbackOverlay";
import { StatusPanelSurface } from "./StatusPanelSurface";
import type { ProjectionStageProps } from "./types";

export function ProjectionStage({
  isEditMode,
  learningSurfaceId,
  onPointerMove,
  onPointerStop,
  onStartInteraction,
  onSurfaceHit,
  selectedSurfaceId,
  stageRef,
  surfaces,
}: ProjectionStageProps) {
  const activeHits = useSessionStore((state) => state.activeHits);
  const currentTarget = useSessionStore((state) => state.currentTarget);
  const finishedAt = useSessionStore((state) => state.finishedAt);
  const finishedScore = useSessionStore((state) => state.finishedScore);
  const introCountdown = useSessionStore((state) => state.introCountdown);
  const introDemoHit = useSessionStore((state) => state.introDemoHit);
  const introPhase = useSessionStore((state) => state.introPhase);
  const isActive = useSessionStore((state) => state.isActive);
  const isIntroComplete = useSessionStore((state) => state.isIntroComplete);
  const isStarting = useSessionStore((state) => state.isStarting);
  const remainingSeconds = useSessionStore((state) => state.remainingSeconds);
  const score = useSessionStore((state) => state.score);
  const startError = useSessionStore((state) => state.startError);
  const drumSurfaces = surfaces.filter(
    (surface) => surface.surfaceType !== "status",
  );
  const mainSurfaceId =
    drumSurfaces.find((surface) => surface.isMain)?.id ?? drumSurfaces[0]?.id;
  const playedHitIdsRef = useRef(new Set<string>());
  const playedIntroHitIdsRef = useRef(new Set<string>());
  const endTimerPlayedRef = useRef(false);
  const isGameOver = finishedScore !== null && !isActive;

  useEffect(() => {
    preloadHitSounds();
  }, []);

  useEffect(() => {
    if (!isGameOver) {
      stopGameOverSound();
    }

    setBackgroundMusicMuted(isGameOver);
  }, [isGameOver]);

  useEffect(() => {
    if (isStarting) {
      endTimerPlayedRef.current = false;
      stopEndTimerSound();
      stopStartTimerSound();
    }
  }, [isStarting]);

  useEffect(() => {
    if (
      remainingSeconds !== null &&
      remainingSeconds > END_TIMER_START_SECONDS &&
      endTimerPlayedRef.current
    ) {
      endTimerPlayedRef.current = false;
      stopEndTimerSound();
    }
  }, [remainingSeconds]);

  useEffect(() => {
    if (
      !isActive ||
      !isIntroComplete ||
      remainingSeconds === null ||
      remainingSeconds > END_TIMER_START_SECONDS ||
      endTimerPlayedRef.current
    ) {
      return;
    }

    endTimerPlayedRef.current = true;
    playEndTimerSound();
  }, [isActive, isIntroComplete, remainingSeconds]);

  useEffect(() => {
    const stopBackgroundMusic = playBackgroundMusic();

    return stopBackgroundMusic;
  }, []);

  useEffect(() => {
    for (const hit of activeHits) {
      if (playedHitIdsRef.current.has(hit.id)) {
        continue;
      }

      playedHitIdsRef.current.add(hit.id);
      playHitSound(hit.kind);
    }
  }, [activeHits]);

  useEffect(() => {
    if (!introDemoHit || playedIntroHitIdsRef.current.has(introDemoHit.id)) {
      return;
    }

    playedIntroHitIdsRef.current.add(introDemoHit.id);
    playHitSound(introDemoHit.kind);
  }, [introDemoHit]);

  return (
    <section
      className={`fixed h-screen w-full overflow-hidden ${
        isEditMode
          ? "bg-[radial-gradient(circle_at_center,#1e293b_0%,#020617_62%)]"
          : "bg-black"
      }`}
      onPointerMove={onPointerMove}
      onPointerCancel={onPointerStop}
      onPointerDownCapture={resumeAudioPlayback}
      onPointerUp={onPointerStop}
      ref={stageRef}
    >
      {surfaces.map((surface) => {
        if (surface.surfaceType === "status") {
          return (
            <StatusPanelSurface
              finishedScore={finishedScore}
              isActive={isActive}
              isEditMode={isEditMode}
              isIntroComplete={isIntroComplete}
              isSelected={isEditMode && surface.id === selectedSurfaceId}
              key={surface.id}
              onStartInteraction={onStartInteraction}
              remainingSeconds={remainingSeconds}
              score={score}
              surface={surface}
            />
          );
        }

        const surfaceNumber =
          drumSurfaces.findIndex((drumSurface) => drumSurface.id === surface.id) + 1;
        const target =
          !isEditMode && currentTarget?.surfaceNumber === surfaceNumber
            ? currentTarget
            : null;
        const activeHit = !isEditMode
          ? activeHits.find((hit) => hit.surfaceNumber === surfaceNumber)
          : undefined;

        return (
          <DrumSurfaceView
            activeHit={activeHit}
            countdown={introCountdown}
            currentTarget={target}
            finishedAt={finishedAt}
            finishedScore={finishedScore}
            introDemoHit={introDemoHit}
            introPhase={introPhase}
            isActive={isActive}
            isEditMode={isEditMode}
            isLearning={learningSurfaceId === surface.id}
            isMainSurface={surface.id === mainSurfaceId}
            isSelected={isEditMode && surface.id === selectedSurfaceId}
            isStarting={isStarting}
            key={surface.id}
            onStartInteraction={onStartInteraction}
            onSurfaceHit={onSurfaceHit}
            startError={startError}
            surface={surface}
          />
        );
      })}
      <AnimatePresence>
        {!isEditMode &&
          activeHits.map((hit) => (
            <ScoreFeedbackOverlay hit={hit} key={hit.id} surfaces={drumSurfaces} />
          ))}
      </AnimatePresence>
    </section>
  );
}
