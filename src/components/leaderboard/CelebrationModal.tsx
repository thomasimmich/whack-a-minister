import Confetti from "react-confetti";
import type { CelebrationData } from "../../types/score";

interface CelebrationModalProps {
  data: CelebrationData;
}

const getCelebrationMessage = (rank: number, total: number) => {
  if (rank === 1) return "WOW! Du bist der Beste!";
  if (rank <= 3) return `Fantastisch! Du bist auf Platz ${rank} von ${total}!`;
  if (rank <= total * 0.25) return `Super! Du bist Platz ${rank} von ${total}`;
  if (rank <= total * 0.5)
    return `Gut gemacht! Du bist in der oberen Hälfte! Platz ${rank} von ${total}`;
  return `Weiter so! Du bist auf Platz ${rank} von ${total}!`;
};

export const CelebrationModal = ({ data }: CelebrationModalProps) => {
  return (
    <>
      <Confetti
        numberOfPieces={200}
        recycle={false}
        gravity={0.3}
        initialVelocityY={10}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl border border-white/30 transform transition-all duration-500 scale-100 animate-bounce h-auto min-h-[15rem] flex flex-col justify-center max-w-[90vw] sm:max-w-lg">
          <div className="text-5xl sm:text-6xl text-center mb-4">
            {data.rank === 1 ? "🏆" : "🎉"}
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-white text-center mb-2 px-2">
            {getCelebrationMessage(data.rank, data.total)}
          </h2>
          <p className="text-white/90 text-center text-base sm:text-lg">
            {data.rank === 1 ? "Du bist der Champion!" : "Mach weiter so!"}
          </p>
        </div>
      </div>
    </>
  );
};
