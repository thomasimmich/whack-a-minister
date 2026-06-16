import backgroundMusicSound from "../../assets/sounds/backgroundMusic.mp3";
import endTimerSound from "../../assets/sounds/end-timer.mp3";
import failureSound from "../../assets/sounds/failure.mp3";
import gameOverSound from "../../assets/sounds/gameover.mp3";
import hitSound from "../../assets/sounds/hit.mp3";
import startTimerSound from "../../assets/sounds/start-timer.mp3";
import punchSound0 from "../../assets/sounds/punch0.mp3";
import punchSound1 from "../../assets/sounds/punch1.mp3";
import punchSound2 from "../../assets/sounds/punch2.mp3";
import punchSound3 from "../../assets/sounds/punch3.mp3";
import punchSound4 from "../../assets/sounds/punch4.mp3";
import punchSound5 from "../../assets/sounds/punch5.mp3";
import punchSound6 from "../../assets/sounds/punch6.mp3";
import punchSound7 from "../../assets/sounds/punch7.mp3";
import punchSound8 from "../../assets/sounds/punch8.mp3";
import squeezeSound from "../../assets/sounds/squeeze.mp3";
import type { HitFeedback } from "../../stores/sessionStore";

const punchSounds = [
  punchSound0,
  punchSound1,
  punchSound2,
  punchSound3,
  punchSound4,
  punchSound5,
  punchSound6,
  punchSound7,
  punchSound8,
];
const hitSounds = [
  hitSound,
  failureSound,
  squeezeSound,
  backgroundMusicSound,
  endTimerSound,
  gameOverSound,
  startTimerSound,
  ...punchSounds,
];
const BACKGROUND_MUSIC_VOLUME = 0.55;
const audioCache = new Map<string, HTMLAudioElement>();
let backgroundMusicAudio: HTMLAudioElement | null = null;
let backgroundMusicMuted = false;
let backgroundMusicStopped = false;
let endTimerAudio: HTMLAudioElement | null = null;
let gameOverAudio: HTMLAudioElement | null = null;
let startTimerAudio: HTMLAudioElement | null = null;
const playbackRetryEvents = [
  "click",
  "keydown",
  "mousedown",
  "pointerdown",
  "touchstart",
] as const;
const playbackRetryCallbacks = new Set<() => void>();
let playbackRetryListenersAttached = false;

export function playHitSound(kind: HitFeedback["kind"]) {
  if (kind === "timeBonus") {
    playSound(squeezeSound);
    return;
  }

  const feedbackSound =
    kind === "enemy"
      ? punchSounds[Math.floor(Math.random() * punchSounds.length)]
      : failureSound;

  playSound(hitSound, () => {
    playSound(feedbackSound);
  });
}

export function playBackgroundMusic() {
  backgroundMusicAudio ??= getCachedAudio(backgroundMusicSound);
  const audio = backgroundMusicAudio;
  backgroundMusicStopped = false;

  audio.loop = true;
  applyBackgroundMusicVolume();

  const startPlayback = () => {
    if (backgroundMusicStopped) {
      removePlaybackRetry(startPlayback);
      return;
    }

    void audio
      .play()
      .then(() => {
        removePlaybackRetry(startPlayback);
      })
      .catch(() => {
        // Browsers can reject autoplay until the user has interacted with the page.
        addPlaybackRetry(startPlayback);
      });
  };

  startPlayback();

  return () => {
    backgroundMusicStopped = true;
    removePlaybackRetry(startPlayback);
    audio.pause();
  };
}

export function setBackgroundMusicMuted(muted: boolean) {
  backgroundMusicMuted = muted;
  applyBackgroundMusicVolume();
}

export function preloadHitSounds() {
  for (const sound of hitSounds) {
    getCachedAudio(sound);
  }
}

export function resumeAudioPlayback() {
  preloadHitSounds();
  retryBlockedPlayback();
}

export function playStartTimerSound() {
  startTimerAudio ??= getCachedAudio(startTimerSound);
  startTimerAudio.currentTime = 0;
  void startTimerAudio.play().catch(() => {
    // Browsers can reject playback when audio is blocked by user settings.
  });
}

export function stopStartTimerSound() {
  const audio = startTimerAudio ?? audioCache.get(startTimerSound);

  if (!audio) {
    return;
  }

  audio.pause();
  audio.currentTime = 0;
}

export function playEndTimerSound() {
  endTimerAudio ??= getCachedAudio(endTimerSound);
  endTimerAudio.currentTime = 0;
  void endTimerAudio.play().catch(() => {
    // Browsers can reject playback when audio is blocked by user settings.
  });
}

export function stopEndTimerSound() {
  if (!endTimerAudio) {
    return;
  }

  endTimerAudio.pause();
  endTimerAudio.currentTime = 0;
}

export function playGameOverSound() {
  stopEndTimerSound();
  stopGameOverSound();
  gameOverAudio ??= getCachedAudio(gameOverSound);
  gameOverAudio.currentTime = 0;
  void gameOverAudio.play().catch(() => {
    // Browsers can reject playback when audio is blocked by user settings.
  });
}

export function stopGameOverSound() {
  const audio = gameOverAudio ?? audioCache.get(gameOverSound);

  if (!audio) {
    return;
  }

  audio.pause();
  audio.currentTime = 0;
}

function applyBackgroundMusicVolume() {
  if (!backgroundMusicAudio) {
    return;
  }

  backgroundMusicAudio.volume = backgroundMusicMuted
    ? 0
    : BACKGROUND_MUSIC_VOLUME;
}

function getCachedAudio(sound: string) {
  const cachedAudio = audioCache.get(sound);

  if (cachedAudio) {
    return cachedAudio;
  }

  const audio = new Audio(sound);
  audio.preload = "auto";
  audio.load();
  audioCache.set(sound, audio);

  return audio;
}

function playSound(sound: string, onEnded?: () => void) {
  const audio = getCachedAudio(sound).cloneNode() as HTMLAudioElement;

  if (onEnded) {
    audio.addEventListener("ended", onEnded, { once: true });
  }

  audio.currentTime = 0;
  void audio.play().catch(() => {
    // Browsers can reject playback when audio is blocked by user settings.
  });
}

function addPlaybackRetry(callback: () => void) {
  playbackRetryCallbacks.add(callback);

  if (playbackRetryListenersAttached) {
    return;
  }

  for (const eventName of playbackRetryEvents) {
    window.addEventListener(eventName, retryBlockedPlayback, {
      capture: true,
      passive: true,
    });
  }

  playbackRetryListenersAttached = true;
}

function removePlaybackRetry(callback: () => void) {
  playbackRetryCallbacks.delete(callback);

  if (playbackRetryCallbacks.size > 0 || !playbackRetryListenersAttached) {
    return;
  }

  for (const eventName of playbackRetryEvents) {
    window.removeEventListener(eventName, retryBlockedPlayback, {
      capture: true,
    });
  }

  playbackRetryListenersAttached = false;
}

function retryBlockedPlayback() {
  for (const callback of playbackRetryCallbacks) {
    callback();
  }
}
