import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { Score } from '../types/score';
import { useEffect, useRef } from 'react';

interface PresentationProps {
  scores: Score[];
  view: 'leaderboard' | 'podium' | 'play';
}

const getMedal = (index: number) => {
  switch (index) {
    case 0: return '🥇';
    case 1: return '🥈';
    case 2: return '🥉';
    default: return `${index + 1}`;
  }
};

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString();
};

export const Presentation = ({ scores, view }: PresentationProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (view === 'leaderboard' && scrollRef.current) {
      let scrollPosition = 0;
      const scrollSpeed = 1; // Pixel pro Scroll
      const scrollDelay = 30; // Millisekunden zwischen Scrolls

      scrollIntervalRef.current = setInterval(() => {
        if (scrollRef.current) {
          const container = scrollRef.current;
          const maxScroll = container.scrollHeight - container.clientHeight;

          if (maxScroll > 0) {
            scrollPosition += scrollSpeed;
            if (scrollPosition >= maxScroll) {
              // Sanft zum Anfang zurückspringen
              container.scrollTo({ top: 0, behavior: 'smooth' });
              scrollPosition = 0;
            } else {
              container.scrollTo({ top: scrollPosition, behavior: 'smooth' });
            }
          }
        }
      }, scrollDelay);
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [view]);

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const podiumVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.3
      }
    }
  };

  const playVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      rotate: 180,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {view === 'leaderboard' && (
        <motion.div
          key="leaderboard"
          ref={scrollRef}
          className="h-full overflow-y-auto p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white/10 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded hover:[&::-webkit-scrollbar-thumb]:bg-white/30"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <table className="w-full">
            <thead className="sticky top-0 bg-black/20 backdrop-blur-sm z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Rang</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Punkte</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {scores.map((score, index: number) => (
                <motion.tr
                  key={score.id}
                  className="hover:bg-white/10 transition-colors"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{getMedal(index+1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="font-medium text-white">{score.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{score.points}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/90">{formatDate(score.date)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {view === 'podium' && (
        <motion.div
          key="podium"
          className="flex-1 flex items-end justify-center space-x-8 p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {scores.slice(0, 3).map((score, index) => (
            <motion.div
              key={score.id}
              className="flex flex-col items-center"
              variants={podiumVariants}
              custom={index}
            >
              <motion.div 
                className="text-4xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.2 }}
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                {getMedal(index)}
              </motion.div>
              <motion.div 
                className="bg-white/20 backdrop-blur-md p-4 rounded-t-xl w-32 text-center"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
              >
                <div className="text-xl font-bold text-white mb-2">{score.name}</div>
                <div className="text-white/90">{score.points} Punkte</div>
              </motion.div>
              {index === 0 ? (
                <div
                  className="bg-white/30 backdrop-blur-md w-32"
                  style={{ height: `${(3 - index) * 100}px` }}
                />
              ) : (
                <motion.div 
                  className="bg-white/30 backdrop-blur-md w-32"
                  style={{ height: `${(3 - index) * 100}px` }}
                  initial={{ height: 0 }}
                  animate={{ 
                    height: [
                      `${(3 - index) * 100}px`,
                      `${(3 - index) * 95}px`,
                      `${(3 - index) * 100}px`
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: index * 0.2
                  }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {view === 'play' && (
        <motion.div
          key="play"
          className="flex-1 flex flex-col items-center justify-center p-8"
          variants={playVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div 
            className="text-6xl mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            🎮
          </motion.div>
          <motion.h2 
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              delay: 0.3,
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            Lass uns spielen!
          </motion.h2>
          <motion.p 
            className="text-xl text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              delay: 0.5,
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            Wer wird heute der Champion?
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 