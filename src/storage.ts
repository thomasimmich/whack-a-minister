import type { AppMode, DrumSurface } from "./types";
import { normalizeStatusPanelCutPercent } from "./statusPanel";
import {
  STATUS_PANEL_SURFACE_ID,
  createStatusPanelSurface,
} from "./surfaces";

export const SURFACES_STORAGE_KEY = "bump-the-drum-surfaces";
export const MODE_STORAGE_KEY = "bump-the-drum-mode";
export const HIGH_SCORE_STORAGE_KEY = "bump-the-drum-high-score";

export function getHighScore(): number {
  try {
    const stored = localStorage.getItem(HIGH_SCORE_STORAGE_KEY);

    if (stored === null) {
      return 0;
    }

    const parsed = Number.parseInt(stored, 10);

    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

export function setHighScore(score: number) {
  try {
    localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(Math.max(0, score)));
  } catch {
    // Ignore quota or privacy mode errors.
  }
}

const legacyPresetIds = new Set(["kick", "snare", "hihat"]);

function containsOnlyLegacyPresets(surfaces: DrumSurface[]) {
  return (
    surfaces.length > 0 &&
    surfaces.every((surface) => legacyPresetIds.has(surface.id))
  );
}

export function loadSurfaces(): DrumSurface[] {
  try {
    const stored = localStorage.getItem(SURFACES_STORAGE_KEY);

    if (!stored) {
      return [createStatusPanelSurface()];
    }

    const parsed = JSON.parse(stored) as DrumSurface[];

    if (!Array.isArray(parsed)) {
      return [createStatusPanelSurface()];
    }

    if (containsOnlyLegacyPresets(parsed)) {
      return [createStatusPanelSurface()];
    }

    return ensureStatusPanelSurface(normalizeMainSurface(parsed)).map((surface): DrumSurface => {
      const size = surface.width ?? surface.height;
      const isStatusPanel = surface.surfaceType === "status";

      return {
        ...surface,
        height: isStatusPanel ? surface.height : size,
        lastHitAt: undefined,
        midiChannel: isStatusPanel ? undefined : surface.midiChannel,
        midiNote: isStatusPanel ? undefined : surface.midiNote,
        statusPanelCutPercent: isStatusPanel
          ? normalizeStatusPanelCutPercent(surface.statusPanelCutPercent)
          : undefined,
        surfaceType: isStatusPanel ? "status" : "drum",
        width: isStatusPanel ? surface.width : size,
      };
    });
  } catch {
    return [createStatusPanelSurface()];
  }
}

export function loadMode(): AppMode {
  return localStorage.getItem(MODE_STORAGE_KEY) === "game" ? "game" : "edit";
}

export function serializeSurfaces(surfaces: DrumSurface[]): DrumSurface[] {
  return surfaces.map(
    ({
      id,
      isMain,
      name,
      statusPanelCutPercent,
      surfaceType,
      x,
      y,
      width,
      height,
      rotation,
      midiNote,
      midiChannel,
    }): DrumSurface => ({
      id,
      isMain: surfaceType === "status" ? undefined : isMain,
      name,
      statusPanelCutPercent:
        surfaceType === "status"
          ? normalizeStatusPanelCutPercent(statusPanelCutPercent)
          : undefined,
      surfaceType: surfaceType === "status" ? "status" : "drum",
      x,
      y,
      width,
      height,
      rotation,
      midiNote,
      midiChannel,
    }),
  );
}

function normalizeMainSurface(surfaces: DrumSurface[]): DrumSurface[] {
  const mainSurfaceIndex = surfaces.findIndex(
    (surface) => surface.surfaceType !== "status" && surface.isMain,
  );

  return surfaces.map((surface, index) => ({
    ...surface,
    isMain:
      surface.surfaceType === "status"
        ? undefined
        : mainSurfaceIndex === -1
          ? surfaces.findIndex((current) => current.surfaceType !== "status") ===
            index
          : index === mainSurfaceIndex,
  }));
}

function ensureStatusPanelSurface(surfaces: DrumSurface[]): DrumSurface[] {
  const hasStatusPanel = surfaces.some(
    (surface) =>
      surface.surfaceType === "status" || surface.id === STATUS_PANEL_SURFACE_ID,
  );

  if (hasStatusPanel) {
    return surfaces.map((surface) =>
      surface.surfaceType === "status" || surface.id === STATUS_PANEL_SURFACE_ID
        ? {
            ...surface,
            id: STATUS_PANEL_SURFACE_ID,
            name: surface.name || "Status Panel",
            surfaceType: "status",
          }
        : surface,
    );
  }

  return [...surfaces, createStatusPanelSurface()];
}
