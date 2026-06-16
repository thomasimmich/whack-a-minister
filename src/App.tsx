import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import { ControlPanel } from "./components/control-panel";
import { ProjectionStage } from "./components/projection-stage";
import { useMidiInput } from "./hooks/useMidiInput";
import { useSessionEventsStream } from "./hooks/useSessionEventsStream";
import { useSurfaceInteractions } from "./hooks/useSurfaceInteractions";
import { useSessionStore } from "./stores/sessionStore";
import { createDrumSurface } from "./surfaces";
import {
  MODE_STORAGE_KEY,
  SURFACES_STORAGE_KEY,
  loadMode,
  loadSurfaces,
  serializeSurfaces,
} from "./storage";
import type { AppMode, DrumSurface, SurfaceHitOptions } from "./types";

const DEBUG_POINTER_VELOCITY = 108;

const initialSurfaces = loadSurfaces();

export default function App() {
  const stageRef = useRef<HTMLDivElement>(null);
  useSessionEventsStream();

  const {
    addSurface,
    events,
    handleModeChange,
    handlePointerMove,
    handleSurfaceHit,
    inputName,
    isEditMode,
    learningSurfaceId,
    mode,
    removeMidiMapping,
    selectedSurface,
    selectedSurfaceId,
    setMainSurface,
    setSelectedSurfaceId,
    startInteraction,
    startLearning,
    stopInteraction,
    surfaces,
    updateSurface,
  } = useDrumEditor(stageRef);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <ControlPanel
        events={events}
        inputName={inputName}
        learningSurfaceId={learningSurfaceId}
        mode={mode}
        onAddSurface={addSurface}
        onModeChange={handleModeChange}
        onRemoveMidiMapping={removeMidiMapping}
        onSelectSurface={setSelectedSurfaceId}
        onSetMainSurface={setMainSurface}
        onStartLearning={startLearning}
        selectedSurface={selectedSurface}
        selectedSurfaceId={selectedSurfaceId}
        surfaces={surfaces}
        updateSurface={updateSurface}
      />

      <ProjectionStage
        isEditMode={isEditMode}
        learningSurfaceId={learningSurfaceId}
        onPointerMove={handlePointerMove}
        onPointerStop={stopInteraction}
        onStartInteraction={startInteraction}
        onSurfaceHit={handleSurfaceHit}
        selectedSurfaceId={selectedSurfaceId}
        stageRef={stageRef}
        surfaces={surfaces}
      />
    </main>
  );
}

function useDrumEditor(stageRef: RefObject<HTMLDivElement | null>) {
  const [mode, setMode] = useState<AppMode>(loadMode);
  const [surfaces, setSurfaces] = useState<DrumSurface[]>(initialSurfaces);
  const [selectedSurfaceId, setSelectedSurfaceId] = useState(
    () => initialSurfaces[0]?.id ?? "",
  );
  const [learningSurfaceId, setLearningSurfaceId] = useState<string | null>(
    null,
  );

  const selectedSurface = useMemo(
    () => surfaces.find((surface) => surface.id === selectedSurfaceId),
    [selectedSurfaceId, surfaces],
  );
  const isEditMode = mode === "edit";

  const updateSurface = useSurfaceUpdater(setSurfaces);
  const handleSurfaceHit = useCallback(
    (surface: DrumSurface, options?: SurfaceHitOptions) => {
      if (mode !== "game" || surface.surfaceType === "status") {
        return;
      }

      const drumSurfaces = surfaces.filter(
        (currentSurface) => currentSurface.surfaceType !== "status",
      );
      const surfaceNumber =
        drumSurfaces.findIndex((currentSurface) => currentSurface.id === surface.id) +
        1;

      if (surfaceNumber <= 0) {
        return;
      }

      const sessionState = useSessionStore.getState();

      if (
        surface.isMain &&
        !sessionState.isActive &&
        !sessionState.isStarting
      ) {
        void sessionState.startSession();
      }

      const hitVelocity =
        options?.velocity ??
        (options?.source === "pointer" ? DEBUG_POINTER_VELOCITY : undefined);

      if (sessionState.isActive && !sessionState.isIntroComplete) {
        if (surface.isMain) {
          sessionState.handleIntroHit();
        }
      } else if (sessionState.isActive && sessionState.isIntroComplete) {
        sessionState.handleSurfaceHit(surfaceNumber, hitVelocity);
      }

      const now = Date.now();
      setSurfaces((current) =>
        current.map((currentSurface) =>
          currentSurface.id === surface.id
            ? { ...currentSurface, lastHitAt: now }
            : currentSurface,
        ),
      );
    },
    [mode, surfaces],
  );
  const { events, inputName } = useMidiInput({
    learningSurfaceId,
    mode,
    onSurfaceHit: handleSurfaceHit,
    setLearningSurfaceId,
    setSurfaces,
    surfaces,
  });
  const {
    handlePointerMove,
    startInteraction,
    stopInteraction,
  } = useSurfaceInteractions({
    isEditMode,
    onSelectSurface: setSelectedSurfaceId,
    stageRef,
    updateSurface,
  });

  const addSurface = () => {
    const drumSurfaceCount = surfaces.filter(
      (surface) => surface.surfaceType !== "status",
    ).length;
    const surface = createDrumSurface(drumSurfaceCount);
    setSurfaces((current) => [...current, surface]);
    setSelectedSurfaceId(surface.id);
    setMode("edit");
  };

  const removeMidiMapping = () => {
    if (!selectedSurface) {
      return;
    }

    updateSurface(selectedSurface.id, {
      midiChannel: undefined,
      midiNote: undefined,
    });
  };

  const setMainSurface = (surfaceId: string) => {
    setSurfaces((current) =>
      current.map((surface) => ({
        ...surface,
        isMain:
          surface.surfaceType === "status" ? undefined : surface.id === surfaceId,
      })),
    );
  };

  const handleModeChange = (nextMode: AppMode) => {
    setMode(nextMode);
    setLearningSurfaceId(null);
  };

  const startLearning = () => {
    if (!selectedSurface) {
      return;
    }

    setMode("edit");
    setLearningSurfaceId(selectedSurface.id);
  };

  usePersistEditorState(mode, surfaces);

  return {
    addSurface,
    events,
    handleModeChange,
    handlePointerMove,
    handleSurfaceHit,
    inputName,
    isEditMode,
    learningSurfaceId,
    mode,
    removeMidiMapping,
    selectedSurface,
    selectedSurfaceId,
    setMainSurface,
    setSelectedSurfaceId,
    startInteraction,
    startLearning,
    stopInteraction,
    surfaces,
    updateSurface,
  };
}

function useSurfaceUpdater(
  setSurfaces: Dispatch<SetStateAction<DrumSurface[]>>,
) {
  return useCallback(
    (surfaceId: string, updates: Partial<DrumSurface>) => {
      setSurfaces((current) =>
        current.map((surface) =>
          surface.id === surfaceId
            ? { ...surface, ...normalizeRoundSurfaceUpdates(updates) }
            : surface,
        ),
      );
    },
    [setSurfaces],
  );
}

function normalizeRoundSurfaceUpdates(updates: Partial<DrumSurface>) {
  const size = updates.width ?? updates.height;

  if (size === undefined || updates.surfaceType === "status") {
    return updates;
  }

  return {
    ...updates,
    width: size,
    height: size,
  };
}

function usePersistEditorState(mode: AppMode, surfaces: DrumSurface[]) {
  useEffect(() => {
    localStorage.setItem(
      SURFACES_STORAGE_KEY,
      JSON.stringify(serializeSurfaces(surfaces)),
    );
  }, [surfaces]);

  useEffect(() => {
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  }, [mode]);
}