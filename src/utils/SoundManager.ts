class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, HTMLAudioElement>;
  private backgroundMusic: HTMLAudioElement | null;
  private gameOverMusic: HTMLAudioElement | null;
  private isMuted: boolean;
  private volume: number;

  private constructor() {
    this.sounds = new Map();
    this.backgroundMusic = null;
    this.gameOverMusic = null;
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

    // Set up game over music
    this.gameOverMusic = this.sounds.get("gameOverTrack") || null;
    if (this.gameOverMusic) {
      console.log("Game over music loaded successfully");
      this.gameOverMusic.loop = false;
      this.gameOverMusic.volume = this.volume;
    } else {
      console.error("Failed to load game over music");
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

    // Stop game over music if it's playing
    if (this.gameOverMusic) {
      this.gameOverMusic.pause();
      this.gameOverMusic.currentTime = 0;
    }

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

    // Stop game over music if it's playing
    if (this.gameOverMusic) {
      this.gameOverMusic.pause();
      this.gameOverMusic.currentTime = 0;
    }

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
    if (this.isMuted || !this.gameOverMusic) return;

    // Stop background music
    this.stopBackgroundMusic();

    // Play game over music
    this.gameOverMusic.currentTime = 0;
    this.gameOverMusic
      .play()
      .catch((error) => console.error("Error playing game over music:", error));
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
    if (this.gameOverMusic) {
      this.gameOverMusic.volume = this.volume;
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBackgroundMusic();
      if (this.gameOverMusic) {
        this.gameOverMusic.pause();
      }
    } else {
      this.startBackgroundMusic();
    }
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }
}

export default SoundManager;
