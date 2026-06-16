import { create } from "zustand";

const DEFAULT_TARGET_VISIBLE_MS = 4000;
const FRIEND_HIT_POINTS = -5;
export const FRIEND_TARGET_ENTRY_MS = 360;
export const TIME_BONUS_SECONDS = 10;
export const TIME_BONUS_MS = TIME_BONUS_SECONDS * 1000;
export const MAX_TIME_BONUS_PER_ROUND = 3;
const GAME_DURATION_MS = 60000;
const GAME_DURATION_SECONDS = GAME_DURATION_MS / 1000;
const GAME_TICK_MS = 250;
const INTRO_COUNTDOWN_START = 3;
const INTRO_COUNTDOWN_STEP_MS = 1000;
const INTRO_HINT_VISIBLE_MS = 2200;
const INTRO_HIT_VISIBLE_MS = 500;
const RESTART_COOLDOWN_MS = 5000;
const TARGET_HIT_VISIBLE_MS = 500;
const MIDI_MAX_VELOCITY = 127;
const STRONG_HIT_VELOCITY = 100;
const VERY_STRONG_HIT_VELOCITY = 120;
const STRONG_HIT_BONUS_POINTS = 1;
const VERY_STRONG_HIT_MULTIPLIER = 1.5;
// const startSessionUrl = "https://dev.api.agents.leanscope.ai/api/v1/sessions";
// const startSessionPayload = {
//   choreoRepositoryId: "2124",
//   choreoScenarioGuid: "53393ebf-4322-4177-aa77-c09822543e40",
//   sessionRepositoryId: "2124",
// };

let targetTimeout: number | undefined;
let introTimeout: number | undefined;
let introDemoHitTimeout: number | undefined;
let gameEndTimeout: number | undefined;
let gameTickInterval: number | undefined;
const activeHitTimeouts = new Map<string, number>();

function createMockImage(label: string, color: string) {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
      <rect width="240" height="240" rx="120" fill="${color}"/>
      <text x="120" y="132" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" font-weight="800" fill="#020617">${label}</text>
    </svg>
  `)}`;
}

const defaultTargetAssets: TargetAssets = {
  enemy: {
    defaultImage: createMockImage("ENEMY", "#fb7185"),
    hitImage: createMockImage("HIT", "#f97316"),
  },
  friend: {
    defaultImage: createMockImage("FRIEND", "#22d3ee"),
    hitImage: createMockImage("HIT", "#bef264"),
  },
  timeBonus: {
    defaultImage: createMockImage("TIME", "#facc15"),
    hitImage: createMockImage("TIME+", "#fde047"),
  },
};

export type SessionResponse = {
  sessionId: string;
  sessionToken: string;
  uiUrl: string;
  controllerUrl: string;
  sessionScenarioGuid: string;
  markdown: string;
};

export type SessionEvent = {
  id: string;
  receivedAt: string;
  type: string;
  data: unknown;
};

export type TargetKind = "enemy" | "friend" | "timeBonus";

export type TargetAsset = {
  defaultImage: string;
  hitImage: string;
};

export type TargetAssets = Record<TargetKind, TargetAsset>;

export type SessionIntroPhase =
  | "idle"
  | "enemyHint"
  | "friendHint"
  | "timeBonusHint"
  | "countdown"
  | "complete";

export type IntroDemoHit = {
  expiresAt: number;
  id: string;
  kind: TargetKind;
};

export function getIntroDemoKind(phase: SessionIntroPhase): TargetKind | null {
  if (phase === "enemyHint") {
    return "enemy";
  }

  if (phase === "friendHint") {
    return "friend";
  }

  if (phase === "timeBonusHint") {
    return "timeBonus";
  }

  return null;
}

export type SessionTarget = {
  expiresAt: number;
  hitEligibleAt: number;
  id: string;
  kind: TargetKind;
  surfaceNumber: 1 | 2;
};

export type TargetEventPayload = {
  kind: TargetKind;
  surfaceNumber: 1 | 2;
  visibleMs?: number;
};

export type HitFeedback = {
  bonusPoints: number;
  expiresAt: number;
  id: string;
  kind: TargetKind;
  offsetX: number;
  offsetY: number;
  points: number;
  scoreMultiplier: number;
  streak: number;
  surfaceNumber: 1 | 2;
  tiltDirection: -1 | 0 | 1;
  velocity: number;
  hitStrength: "normal" | "strong" | "veryStrong";
};

type StreamStatus = "idle" | "connecting" | "open" | "error";

type SessionStore = {
  activeHits: HitFeedback[];
  assets: TargetAssets;
  bpm: number;
  currentTarget: SessionTarget | null;
  events: SessionEvent[];
  finishedAt: number | null;
  finishedScore: number | null;
  gameEndsAt: number | null;
  gameStartedAt: number | null;
  introCountdown: number | null;
  introDemoHit: IntroDemoHit | null;
  introPhase: SessionIntroPhase;
  isActive: boolean;
  isIntroComplete: boolean;
  isStarting: boolean;
  remainingSeconds: number | null;
  score: number;
  session: SessionResponse | null;
  startError: string | null;
  streak: number;
  timeBonusSpawnCount: number;
  submitError: string | null;
  submitStatus: "idle" | "submitting" | "error";
  streamError: string | null;
  streamStatus: StreamStatus;
  addEvent: (event: Omit<SessionEvent, "id" | "receivedAt">) => void;
  clearTarget: () => void;
  handleIntroHit: () => void;
  handleSurfaceHit: (surfaceNumber: number, velocity?: number) => void;
  setBpm: (bpm: number) => void;
  setTargetAssets: (assets: Partial<TargetAssets>) => void;
  setStreamError: (streamError: string | null) => void;
  setStreamStatus: (streamStatus: StreamStatus) => void;
  showTarget: (payload: TargetEventPayload) => void;
  startSession: () => Promise<void>;
  submitTargetHit: (target: SessionTarget) => Promise<void>;
};

type SetSessionState = (
  state: Partial<SessionStore> | ((state: SessionStore) => Partial<SessionStore>),
) => void;
type GetSessionState = () => SessionStore;

export function getRestartCooldownRemainingMs(finishedAt: number | null) {
  if (finishedAt === null) {
    return 0;
  }

  return Math.max(0, RESTART_COOLDOWN_MS - (Date.now() - finishedAt));
}

export function getRestartCooldownRemainingSeconds(finishedAt: number | null) {
  return Math.ceil(getRestartCooldownRemainingMs(finishedAt) / 1000);
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  activeHits: [],
  assets: defaultTargetAssets,
  bpm: 120,
  currentTarget: null,
  events: [],
  finishedAt: null,
  finishedScore: null,
  gameEndsAt: null,
  gameStartedAt: null,
  introCountdown: null,
  introDemoHit: null,
  introPhase: "idle",
  isActive: false,
  isIntroComplete: false,
  isStarting: false,
  remainingSeconds: null,
  score: 0,
  session: null,
  startError: null,
  streak: 0,
  timeBonusSpawnCount: 0,
  submitError: null,
  submitStatus: "idle",
  streamError: null,
  streamStatus: "idle",
  addEvent: (event) =>
    set((state) => ({
      events: [
        {
          ...event,
          id: crypto.randomUUID(),
          receivedAt: new Date().toLocaleTimeString(),
        },
        ...state.events,
      ].slice(0, 100),
    })),
  clearTarget: () => {
    clearTargetTimer();
    set({ currentTarget: null });
  },
  handleIntroHit: () => {
    const state = get();
    const kind = getIntroDemoKind(state.introPhase);

    if (!state.isActive || state.isIntroComplete || !kind) {
      return;
    }

    const introDemoHit: IntroDemoHit = {
      expiresAt: Date.now() + INTRO_HIT_VISIBLE_MS,
      id: crypto.randomUUID(),
      kind,
    };

    clearIntroDemoHitTimer();
    set({ introDemoHit });

    introDemoHitTimeout = window.setTimeout(() => {
      introDemoHitTimeout = undefined;
      set((currentState) =>
        currentState.introDemoHit?.id === introDemoHit.id
          ? { introDemoHit: null }
          : {},
      );
    }, INTRO_HIT_VISIBLE_MS);
  },
  handleSurfaceHit: (surfaceNumber, velocity = MIDI_MAX_VELOCITY) => {
    const state = get();
    const target = state.currentTarget;

    if (!state.isActive || !state.isIntroComplete || !state.gameEndsAt) {
      return;
    }

    if (Date.now() >= state.gameEndsAt) {
      finishGame(set, get);
      return;
    }

    if (!target || target.surfaceNumber !== surfaceNumber) {
      return;
    }

    if (Date.now() < target.hitEligibleAt) {
      return;
    }

    window.clearTimeout(targetTimeout);

    const nextStreak = target.kind === "enemy" ? state.streak + 1 : 0;
    const hitStrength = resolveHitStrength(velocity);
    const {
      bonusPoints,
      multiplier: scoreMultiplier,
      points,
    } = calculateHitPoints(target.kind, nextStreak, hitStrength);
    const activeHit: HitFeedback = {
      bonusPoints,
      expiresAt: Date.now() + TARGET_HIT_VISIBLE_MS,
      id: crypto.randomUUID(),
      hitStrength,
      kind: target.kind,
      offsetX: randomNumberBetween(-34, 34),
      offsetY: randomNumberBetween(-22, 22),
      points,
      scoreMultiplier,
      streak: nextStreak,
      surfaceNumber: target.surfaceNumber,
      tiltDirection:
        hitStrength === "normal" ? 0 : Math.random() > 0.5 ? 1 : -1,
      velocity,
    };

    if (target.kind === "timeBonus" && state.gameEndsAt) {
      extendGameTime(set, get, TIME_BONUS_MS);
    }

    set((state) => ({
      activeHits: [
        ...state.activeHits.filter(
          (hit) => hit.surfaceNumber !== activeHit.surfaceNumber,
        ),
        activeHit,
      ],
      currentTarget: null,
      score: Math.max(0, state.score + points),
      streak: nextStreak,
    }));
    void get().submitTargetHit(target);

    const timeout = window.setTimeout(() => {
      activeHitTimeouts.delete(activeHit.id);
      set((state) => ({
        activeHits: state.activeHits.filter((hit) => hit.id !== activeHit.id),
      }));
    }, TARGET_HIT_VISIBLE_MS);
    activeHitTimeouts.set(activeHit.id, timeout);
  },
  setBpm: (bpm) => set({ bpm, startError: null }),
  setTargetAssets: (assets) =>
    set((state) => ({
      assets: {
        enemy: {
          ...state.assets.enemy,
          ...assets.enemy,
        },
        friend: {
          ...state.assets.friend,
          ...assets.friend,
        },
        timeBonus: {
          ...state.assets.timeBonus,
          ...assets.timeBonus,
        },
      },
    })),
  setStreamError: (streamError) => set({ streamError }),
  setStreamStatus: (streamStatus) => set({ streamStatus }),
  showTarget: ({ kind, surfaceNumber, visibleMs = DEFAULT_TARGET_VISIBLE_MS }) => {
    const { currentTarget, gameEndsAt, isActive, isIntroComplete, timeBonusSpawnCount } =
      get();
    const missedEnemy = currentTarget?.kind === "enemy";
    let resolvedKind = kind;

    if (
      resolvedKind === "timeBonus" &&
      timeBonusSpawnCount >= MAX_TIME_BONUS_PER_ROUND
    ) {
      resolvedKind = Math.random() > 0.5 ? "enemy" : "friend";
    }

    clearTargetTimer();

    const now = Date.now();

    if (!isActive || !isIntroComplete || !gameEndsAt) {
      return;
    }

    if (now >= gameEndsAt) {
      finishGame(set, get);
      return;
    }

    const targetVisibleMs = Math.min(visibleMs, gameEndsAt - now);

    if (targetVisibleMs <= 0) {
      return;
    }

    const target: SessionTarget = {
      expiresAt: now + targetVisibleMs,
      hitEligibleAt:
        resolvedKind === "friend" ? now + FRIEND_TARGET_ENTRY_MS : now,
      id: crypto.randomUUID(),
      kind: resolvedKind,
      surfaceNumber,
    };

    set({
      currentTarget: target,
      ...(resolvedKind === "timeBonus"
        ? { timeBonusSpawnCount: timeBonusSpawnCount + 1 }
        : {}),
      ...(missedEnemy ? { streak: 0 } : {}),
    });

    targetTimeout = window.setTimeout(() => {
      set((state) => {
        if (state.currentTarget?.id !== target.id) {
          return {};
        }

        return {
          currentTarget: null,
          streak: target.kind === "enemy" ? 0 : state.streak,
        };
      });
    }, targetVisibleMs);
  },
  startSession: async () => {
    const token = import.meta.env.VITE_SESSION_API_TOKEN;

    if (!token) {
      set({
        startError: "VITE_SESSION_API_TOKEN fehlt in .env.local.",
      });
      return;
    }

    if (get().isStarting) {
      return;
    }

    const { finishedAt, finishedScore } = get();

    if (
      finishedScore !== null &&
      getRestartCooldownRemainingMs(finishedAt) > 0
    ) {
      return;
    }

    clearSessionTimers();

    set({
      activeHits: [],
      bpm: 120,
      currentTarget: null,
      events: [],
      finishedAt: null,
      finishedScore: null,
      gameEndsAt: null,
      gameStartedAt: null,
      introCountdown: null,
      introDemoHit: null,
      introPhase: "idle",
      isActive: false,
      isIntroComplete: false,
      isStarting: true,
      remainingSeconds: null,
      score: 0,
      session: null,
      startError: null,
      streak: 0,
      timeBonusSpawnCount: 0,
      submitError: null,
      submitStatus: "idle",
      streamError: null,
      streamStatus: "idle",
    });

    try {
      // const response = await fetch(startSessionUrl, {
      //   body: JSON.stringify(startSessionPayload),
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "application/json",
      //   },
      //   method: "POST",
      // });

      // if (!response.ok) {
      //   throw new Error(`Session konnte nicht gestartet werden (${response.status}).`);
      // }
      // const session = (await response.json()) as SessionResponse;
      const session = {
        controllerUrl: "https://dev.api.agents.leanscope.ai/api/v1/sessions/53393ebf-4322-4177-aa77-c09822543e40/controller",
        sessionId: "53393ebf-4322-4177-aa77-c09822543e40",
        sessionToken: "e8a575a1-9c40-461f-ad36-94da4a3feeaa",
        uiUrl: "https://dev.api.agents.leanscope.ai/api/v1/sessions/53393ebf-4322-4177-aa77-c09822543e40/ui",
      } as SessionResponse;

      set({
        introPhase: "enemyHint",
        isActive: true,
        session,
      });
      startIntroSequence(set, get);
    } catch (error) {
      set({
        startError:
          error instanceof Error
            ? error.message
            : "Session konnte nicht gestartet werden.",
      });
    } finally {
      set({ isStarting: false });
    }
  },
  submitTargetHit: async (target) => {
    const session = get().session;

    if (!session) {
      return;
    }

    set({ submitError: null, submitStatus: "submitting" });

    try {
      const response = await fetch(`${session.controllerUrl}/submit`, {
        body: JSON.stringify({
          kind: target.kind,
          surfaceNumber: target.surfaceNumber,
          targetId: target.id,
          type: "targetHit",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Hit-Response fehlgeschlagen (${response.status}).`);
      }

      set({ submitStatus: "idle" });
    } catch (error) {
      set({
        submitError:
          error instanceof Error
            ? error.message
            : "Hit-Response konnte nicht gesendet werden.",
        submitStatus: "error",
      });
    }
  },
}));

function clearTargetTimer() {
  window.clearTimeout(targetTimeout);
}

function clearIntroDemoHitTimer() {
  if (introDemoHitTimeout !== undefined) {
    window.clearTimeout(introDemoHitTimeout);
    introDemoHitTimeout = undefined;
  }
}

function clearSessionTimers() {
  window.clearTimeout(introTimeout);
  clearIntroDemoHitTimer();
  window.clearTimeout(targetTimeout);
  window.clearTimeout(gameEndTimeout);
  window.clearInterval(gameTickInterval);
  clearActiveHitTimers();
}

function clearActiveHitTimers() {
  activeHitTimeouts.forEach((timeout) => window.clearTimeout(timeout));
  activeHitTimeouts.clear();
}

function startIntroSequence(set: SetSessionState, get: GetSessionState) {
  window.clearTimeout(introTimeout);

  introTimeout = window.setTimeout(() => {
    set({ introDemoHit: null, introPhase: "friendHint" });

    introTimeout = window.setTimeout(() => {
      set({ introDemoHit: null, introPhase: "timeBonusHint" });

      introTimeout = window.setTimeout(() => {
        set({
          introCountdown: INTRO_COUNTDOWN_START,
          introDemoHit: null,
          introPhase: "countdown",
        });
        scheduleCountdownStep(set, get, INTRO_COUNTDOWN_START);
      }, INTRO_HINT_VISIBLE_MS);
    }, INTRO_HINT_VISIBLE_MS);
  }, INTRO_HINT_VISIBLE_MS);
}

function scheduleCountdownStep(
  set: SetSessionState,
  get: GetSessionState,
  currentCount: number,
) {
  introTimeout = window.setTimeout(() => {
    const nextCount = currentCount - 1;

    if (nextCount <= 0) {
      set({
        introCountdown: null,
        introPhase: "complete",
        isIntroComplete: true,
      });
      startGameTimer(set, get);
      return;
    }

    set({ introCountdown: nextCount });
    scheduleCountdownStep(set, get, nextCount);
  }, INTRO_COUNTDOWN_STEP_MS);
}

function startGameTimer(set: SetSessionState, get: GetSessionState) {
  window.clearTimeout(gameEndTimeout);
  window.clearInterval(gameTickInterval);

  const gameStartedAt = Date.now();
  const gameEndsAt = gameStartedAt + GAME_DURATION_MS;

  set({
    finishedAt: null,
    finishedScore: null,
    gameEndsAt,
    gameStartedAt,
    remainingSeconds: GAME_DURATION_SECONDS,
  });

  gameTickInterval = window.setInterval(() => {
    updateRemainingSeconds(set, get);
  }, GAME_TICK_MS);

  gameEndTimeout = window.setTimeout(() => {
    finishGame(set, get);
  }, GAME_DURATION_MS);
}

function updateRemainingSeconds(set: SetSessionState, get: GetSessionState) {
  const gameEndsAt = get().gameEndsAt;

  if (!gameEndsAt) {
    return;
  }

  const remainingSeconds = Math.max(
    0,
    Math.ceil((gameEndsAt - Date.now()) / 1000),
  );

  set({ remainingSeconds });
}

function extendGameTime(
  set: SetSessionState,
  get: GetSessionState,
  extraMs: number,
) {
  const { gameEndsAt } = get();

  if (!gameEndsAt) {
    return;
  }

  const newGameEndsAt = gameEndsAt + extraMs;
  const remainingMs = newGameEndsAt - Date.now();

  if (remainingMs <= 0) {
    return;
  }

  window.clearTimeout(gameEndTimeout);
  gameEndTimeout = window.setTimeout(() => {
    finishGame(set, get);
  }, remainingMs);

  set({ gameEndsAt: newGameEndsAt });
  updateRemainingSeconds(set, get);
}

function finishGame(set: SetSessionState, get: GetSessionState) {
  const state = get();

  if (!state.gameStartedAt || state.finishedScore !== null) {
    return;
  }

  clearSessionTimers();

  set({
    activeHits: [],
    currentTarget: null,
    finishedAt: Date.now(),
    finishedScore: state.score,
    isActive: false,
    remainingSeconds: 0,
    streamStatus: "idle",
  });
}

function randomNumberBetween(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

function resolveHitStrength(velocity: number): HitFeedback["hitStrength"] {
  if (velocity >= VERY_STRONG_HIT_VELOCITY) {
    return "veryStrong";
  }

  if (velocity >= STRONG_HIT_VELOCITY) {
    return "strong";
  }

  return "normal";
}

function calculateHitPoints(
  targetKind: TargetKind,
  streak: number,
  hitStrength: HitFeedback["hitStrength"],
) {
  if (targetKind !== "enemy") {
    return {
      bonusPoints: 0,
      multiplier: 1,
      points: targetKind === "friend" ? FRIEND_HIT_POINTS : 0,
    };
  }

  const bonusPoints = hitStrength === "normal" ? 0 : STRONG_HIT_BONUS_POINTS;
  const multiplier =
    hitStrength === "veryStrong" ? VERY_STRONG_HIT_MULTIPLIER : 1;
  const basePoints = streak + bonusPoints;
  const points = Math.max(1, Math.round(basePoints * multiplier));

  return { bonusPoints, multiplier, points };
}
