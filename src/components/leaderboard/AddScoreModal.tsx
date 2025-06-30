import { useState } from "react";
import { useGameStore } from "../../store/gameStore";

interface AddScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, points: number) => Promise<void>;
  existingNames: string[];
  initialScore: number;
}

export const AddScoreModal: React.FC<AddScoreModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingNames,
}) => {
  const { score: initialScore } = useGameStore();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(name, initialScore);
    } catch (error) {
      console.error("Error submitting score:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/20 backdrop-blur-[30px] rounded-3xl border border-white/20 p-8 w-[95%] sm:w-[90%] lg:w-[80%] xl:w-[80%] 2xl:w-[50%] max-w-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Score hinzufügen</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Dein Name"
              list="existing-names"
              required
            />
            <datalist id="existing-names">
              {existingNames.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Score
            </label>
            <div className="text-2xl font-bold text-white">{initialScore}</div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Wird gespeichert..." : "Speichern"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
