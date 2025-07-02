class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, HTMLAudioElement>;
  private backgroundMusic: HTMLAudioElement | null;
  private isMuted: boolean;
  private volume: number;

  private constructor() {
    this.sounds = new Map();
    this.backgroundMusic = null;
    this.isMuted = false;
    this.volume = 0.5; // Default volume at 50%
    this.loadSounds();
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private loadSounds() {
    // Load sound effects
    const soundFiles = {
      hit: "/assets/sounds/hammer0.mp3",
      miss: "/assets/sounds/failure.mp3",
      timeBonus: "/assets/sounds/party.mp3",
      gameOver: "/assets/sounds/gameover.mp3",
      background: "/assets/sounds/scheuertrack1.mp3",
      gameOverTrack: "/assets/sounds/end-timer.mp3",
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      console.log(`Loading sound: ${key} from ${path}`);
      const audio = new Audio(path);
      audio.volume = this.volume;
      this.sounds.set(key, audio);
    });

    // Set up background music
    this.backgroundMusic = this.sounds.get("background") || null;
    if (this.backgroundMusic) {
      console.log("Background music loaded successfully");
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = this.volume;
    } else {
      console.error("Failed to load background music");
    }
  }

  public playSound(soundName: string) {
    if (this.isMuted) return;

    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.currentTime = 0;
      sound
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    }
  }

  public startBackgroundMusic() {
    if (this.isMuted || !this.backgroundMusic) return;

    // Try to play background music
    this.backgroundMusic.play().catch((error) => {
      console.log(
        "Background music autoplay blocked by browser. Will start on user interaction."
      );
      // This is expected behavior - browsers block autoplay until user interaction
    });
  }

  public forceStartBackgroundMusic() {
    if (this.isMuted || !this.backgroundMusic) return;

    // Force start background music (should work after user interaction)
    this.backgroundMusic
      .play()
      .catch((error) =>
        console.error("Error playing background music:", error)
      );
  }

  public stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  public playGameOverMusic() {
    if (this.isMuted) return;

    // Stop background music
    this.stopBackgroundMusic();

    // Play the actual game over sound (not the end-timer sound)
    const gameOverSound = this.sounds.get("gameOver");
    if (gameOverSound) {
      gameOverSound.currentTime = 0;
      gameOverSound
        .play()
        .catch((error) =>
          console.error("Error playing game over sound:", error)
        );
    }
  }

  public stopGameOverMusic() {
    // Stop the game over sound
    const gameOverSound = this.sounds.get("gameOver");
    if (gameOverSound) {
      gameOverSound.pause();
      gameOverSound.currentTime = 0;
    }
  }

  public playEndTimerSound() {
    if (this.isMuted) return;

    const endTimerSound = this.sounds.get("gameOverTrack");
    if (endTimerSound) {
      endTimerSound.currentTime = 0;
      endTimerSound
        .play()
        .catch((error) =>
          console.error("Error playing end timer sound:", error)
        );
    }
  }

  public setVolume(volume: number) {
    // Ensure volume is between 0 and 1
    this.volume = Math.max(0, Math.min(1, volume));

    // Update volume for all sounds
    this.sounds.forEach((sound) => {
      sound.volume = this.volume;
    });

    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.volume;
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBackgroundMusic();
    } else {
      this.startBackgroundMusic();
    }
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }
}

export default SoundManager;
