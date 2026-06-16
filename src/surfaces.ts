import type { DrumSurface } from "./types";
import { DEFAULT_STATUS_PANEL_CUT_PERCENT } from "./statusPanel";

export const STATUS_PANEL_SURFACE_ID = "status-panel";

export function createSurfaceName(count: number) {
  return `Fläche ${count + 1}`;
}

export function createSurfaceId() {
  return crypto.randomUUID?.() ?? `surface-${Date.now()}`;
}

export function createDrumSurface(count: number): DrumSurface {
  return {
    id: createSurfaceId(),
    isMain: count === 0,
    name: createSurfaceName(count),
    surfaceType: "drum",
    x: 320 + count * 24,
    y: 220 + count * 18,
    width: 160,
    height: 160,
    rotation: 0,
  };
}

export function createStatusPanelSurface(): DrumSurface {
  return {
    id: STATUS_PANEL_SURFACE_ID,
    name: "Status Panel",
    statusPanelCutPercent: DEFAULT_STATUS_PANEL_CUT_PERCENT,
    surfaceType: "status",
    x: 860,
    y: 48,
    width: 220,
    height: 220,
    rotation: 0,
  };
}
