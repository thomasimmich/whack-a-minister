import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useGameStateStore } from "../../store/gameStateStore";
import { useScoreStore } from "../../store/scoreStore";
import { GameState } from "../../types/gameTypes";
import SoundManager from "../../utils/SoundManager";

const SplashScreen = () => {
  const { initializeScores } = useScoreStore();
  const setGameState = useGameStateStore((state) => state.setGameState);
  const [musicStarted, setMusicStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    initializeScores();

    // Try to start background music when splash screen loads
    const soundManager = SoundManager.getInstance();
    soundManager.startBackgroundMusic();
    setMusicStarted(true);

    const handleFullscreenChange = () => {
      const doc: any = document;
      setIsFullscreen(
        !!(
          document.fullscreenElement ||
          doc.webkitFullscreenElement ||
          doc.mozFullScreenElement ||
          doc.msFullscreenElement
        )
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, [initializeScores]);

  const handleStartGame = () => {
    // Ensure music is started on user interaction
    if (!musicStarted) {
      const soundManager = SoundManager.getInstance();
      soundManager.forceStartBackgroundMusic();
      setMusicStarted(true);
    }
    setGameState(GameState.IDLE);
  };

  const handleShowLeaderboard = () => {
    // Ensure music is started on user interaction
    if (!musicStarted) {
      const soundManager = SoundManager.getInstance();
      soundManager.forceStartBackgroundMusic();
      setMusicStarted(true);
    }
    setGameState(GameState.LEADERBOARD);
  };

  const handleToggleFullscreen = async () => {
    if (typeof document === "undefined") return;

    const doc: any = document;
    const docEl: any = document.documentElement;

    try {
      // Check if already in fullscreen
      const isInFullscreen = !!(
        document.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );

      if (!isInFullscreen) {
        // Request fullscreen with all vendor prefixes
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          // iOS Safari
          await docEl.webkitRequestFullscreen();
        } else if (docEl.webkitEnterFullscreen) {
          // Older iOS
          await docEl.webkitEnterFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          await docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
          await docEl.msRequestFullscreen();
        }
      } else {
        // Exit fullscreen with all vendor prefixes
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
      }
    } catch (error) {
      console.warn("Fullscreen not supported or failed:", error);
      // On iOS, if fullscreen API is not supported, we can at least scroll to hide the address bar
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        window.scrollTo(0, 1);
      }
    }
  };

  return (
    <div className="w-screen h-screen fixed top-0 left-0 overflow-hidden flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat blur-[10px] scale-110" />

      <div className="relative z-10 flex flex-col items-center gap-12">
        {/* Title */}
        <motion.h1
          className="text-7xl sm:text-7xl md:text-8xl font-bold italic relative font-sans flex flex-col sm:flex-row items-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Bump - Orange */}
          <span className="relative">
            <span className="absolute top-0 left-0 text-transparent [-webkit-text-stroke:8px_#000000] z-0">
              Bump
            </span>
            <span className="relative bg-gradient-to-b from-[#ffd700] to-[#ff8c00] bg-clip-text text-transparent drop-shadow-[5.2px_3px_8px_rgba(0,0,0,1)] z-[1]">
              Bump
            </span>
          </span>
          
          {/* the - White with black outline and smaller */}
          <span className="text-5xl sm:ml-2 md:ml-4 sm:mt-4 sm:text-5xl md:text-6xl relative">
            <span className="absolute top-0 left-0 text-transparent [-webkit-text-stroke:6px_#000000] z-0">
              the
            </span>
            <span className="relative text-white z-[1]">
              the
            </span>
          </span>
          
          {/* Trump - White to green gradient */}
          <span className="relative">
            <span className="absolute top-0 left-0 text-transparent [-webkit-text-stroke:8px_#000000] z-0">
              Trump
            </span>
            <span className="relative bg-gradient-to-b from-white to-[#00ff00] bg-clip-text text-transparent drop-shadow-[5.2px_3px_8px_rgba(0,0,0,1)] z-[1]">
              Trump
            </span>
          </span>
        </motion.h1>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6">
          <motion.button
            onClick={handleStartGame}
            className="px-8 py-4 text-2xl sm:text-3xl font-bold italic transition-all duration-200 relative flex items-center justify-center font-sans border-4 border-black bg-gradient-to-b from-blue-400 to-blue-600 backdrop-blur-[10px] hover:scale-110 active:scale-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="absolute text-transparent [-webkit-text-stroke:4px_#000000] z-0">
              Play
            </span>
            <span className="relative text-white z-[1]">
              Play
            </span>
          </motion.button>

        

          <motion.button
            onClick={handleToggleFullscreen}
            className="px-8 py-4 text-2xl sm:text-3xl font-bold italic transition-all duration-200 relative flex items-center justify-center font-sans border-4 border-black bg-gradient-to-b from-green-400 to-green-600 backdrop-blur-[10px] hover:scale-110 active:scale-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="absolute text-transparent [-webkit-text-stroke:4px_#000000] z-0">
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </span>
            <span className="relative text-white z-[1]">
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
