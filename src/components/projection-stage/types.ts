import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import type { DrumSurface, InteractionType, SurfaceHitOptions } from "../../types";

export type StartSurfaceInteraction = (
  event: ReactPointerEvent<HTMLElement>,
  surface: DrumSurface,
  type: InteractionType,
) => void;

export type ProjectionStageProps = {
  isEditMode: boolean;
  learningSurfaceId: string | null;
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerStop: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onStartInteraction: StartSurfaceInteraction;
  onSurfaceHit: (surface: DrumSurface, options?: SurfaceHitOptions) => void;
  selectedSurfaceId: string;
  stageRef: RefObject<HTMLDivElement | null>;
  surfaces: DrumSurface[];
};
