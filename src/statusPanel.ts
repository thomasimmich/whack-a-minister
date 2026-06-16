export const DEFAULT_STATUS_PANEL_CUT_PERCENT = 18;
export const MIN_STATUS_PANEL_CUT_PERCENT = 0;
export const MAX_STATUS_PANEL_CUT_PERCENT = 42;

export function normalizeStatusPanelCutPercent(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_STATUS_PANEL_CUT_PERCENT;
  }

  return Math.min(
    MAX_STATUS_PANEL_CUT_PERCENT,
    Math.max(MIN_STATUS_PANEL_CUT_PERCENT, Math.round(value)),
  );
}
