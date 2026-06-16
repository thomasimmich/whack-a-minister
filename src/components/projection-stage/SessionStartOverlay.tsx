import { AnimatePresence, motion } from "framer-motion";
import { PixiLikeText } from "./PixiLikeText";

export function SessionStartOverlay({
  isActive,
  isStarting,
  startError,
}: {
  isActive: boolean;
  isStarting: boolean;
  startError: string | null;
}) {
  if (isActive) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="pointer-events-none absolute inset-0 z-20 grid place-items-center rounded-[999px] bg-slate-950/74 p-8 text-center backdrop-blur-sm"
        exit={{ opacity: 0, scale: 0.94 }}
        initial={{ opacity: 0, scale: 0.94 }}
        key={isStarting ? "starting" : "start"}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <div className="pt-5 grid w-full justify-items-center gap-1">
          <PixiLikeText
            colors={["#ffffff", "#67e8f9"]}
            fontSize={28}
            id={isStarting ? "start-label-starting" : "start-label-ready"}
            maxWidth={260}
            strokeWidth={8}
            text={isStarting ? "SESSION STARTET" : "BUMP THE DRUM"}
          />
          {isStarting ? (
            <PixiLikeText
              colors={["#ffd700", "#ff8c00", "#ff4500"]}
              fontSize={34}
              id="start-message-starting"
              maxWidth={260}
              strokeWidth={8}
              text="BITTE WARTEN..."
            />
          ) : (
            <PixiLikeText
              colors={["#ffd700", "#ff8c00", "#ff4500"]}
              fontSize={20}
              id="start-message-ready"
              maxWidth={320}
              strokeWidth={8}
              text="SCHLAGEN UM SPIEL ZU STARTEN"
            />
          )}
          {startError && (
            <span className="max-w-64 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-100">
              {startError}
            </span>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
