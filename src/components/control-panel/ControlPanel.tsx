import { AnimatePresence, motion } from "framer-motion";
import type { AppMode, DrumSurface, MidiEvent } from "../../types";
import { MidiLog } from "./MidiLog";
import { ModeToggle } from "./ModeToggle";
import { SelectedSurfacePanel } from "./SelectedSurfacePanel";
import { SurfaceList } from "./SurfaceList";

type ControlPanelProps = {
  events: MidiEvent[];
  inputName: string;
  learningSurfaceId: string | null;
  mode: AppMode;
  onAddSurface: () => void;
  onModeChange: (mode: AppMode) => void;
  onRemoveMidiMapping: () => void;
  onSelectSurface: (surfaceId: string) => void;
  onSetMainSurface: (surfaceId: string) => void;
  onStartLearning: () => void;
  selectedSurface?: DrumSurface;
  selectedSurfaceId: string;
  surfaces: DrumSurface[];
  updateSurface: (surfaceId: string, updates: Partial<DrumSurface>) => void;
};

export function ControlPanel({
  events,
  inputName,
  learningSurfaceId,
  mode,
  onAddSurface,
  onModeChange,
  onRemoveMidiMapping,
  onSelectSurface,
  onSetMainSurface,
  onStartLearning,
  selectedSurface,
  selectedSurfaceId,
  surfaces,
  updateSurface,
}: ControlPanelProps) {
  const isEditMode = mode === "edit";
  const isGameMode = mode === "game";

  return (
    <>
      <motion.aside
        animate={{
          bottom: 16,
          height: "calc(100vh - 32px)",
          left: 16,
          opacity: isEditMode ? 1 : 0,
          pointerEvents: isEditMode ? "auto" : "none",
          width: 320,
          x: isEditMode ? 0 : -380,
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
        className="fixed z-50 overflow-hidden rounded-3xl border text-slate-100 shadow-2xl shadow-black/40 backdrop-blur-2xl"
        initial={false}
        transition={{ damping: 28, stiffness: 260, type: "spring" }}
      >
        <div className="flex h-full flex-col gap-6 overflow-y-auto p-3">
          <ModeToggle mode={mode} onModeChange={onModeChange} />

          <AnimatePresence initial={false}>
            {isEditMode && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-6"
                exit={{ opacity: 0, y: 12 }}
                initial={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.18 }}
              >
                <SurfaceList
                  onAddSurface={onAddSurface}
                  onSelectSurface={onSelectSurface}
                  selectedSurfaceId={selectedSurfaceId}
                  surfaces={surfaces}
                />

                {selectedSurface && (
                  <SelectedSurfacePanel
                    learningSurfaceId={learningSurfaceId}
                    onRemoveMidiMapping={onRemoveMidiMapping}
                    onSetMainSurface={onSetMainSurface}
                    onStartLearning={onStartLearning}
                    selectedSurface={selectedSurface}
                    updateSurface={updateSurface}
                  />
                )}

                <MidiLog events={events} inputName={inputName} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      <AnimatePresence>
        {isGameMode && (
          <motion.button
            animate={{ opacity: 1, x: 0 }}
            className="fixed left-4 top-4 z-50 rounded-full border border-white/15 bg-slate-950/70 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-cyan-100 shadow-2xl shadow-black/40 backdrop-blur-xl transition hover:border-cyan-200/50 hover:bg-cyan-200/10"
            exit={{ opacity: 0, x: -20 }}
            initial={{ opacity: 0, x: -20 }}
            onClick={() => onModeChange("edit")}
            transition={{ duration: 0.18, ease: "easeOut" }}
            type="button"
          >
            Edit
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
