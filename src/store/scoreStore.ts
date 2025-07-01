import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { Score } from "../types/score";

interface ScoreState {
  scores: Score[];
  existingNames: string[];
  notification: Score | null;
  setNotification: (score: Score | null) => void;
  addScore: (
    name: string,
    points: number
  ) => Promise<{ rank: number; total: number } | null>;
  getLastTwoDaysPlayers: () => number;
  initializeScores: () => Promise<void>;
}

export const useScoreStore = create<ScoreState>((set, get) => ({
  scores: [],
  existingNames: [],
  notification: null,
  setNotification: (score: Score | null) => set({ notification: score }),

  addScore: async (name: string, points: number) => {
    try {
      const currentDate = new Date();
      if (isNaN(currentDate.getTime())) {
        throw new Error("Invalid date");
      }

      const newScoreEntry: Score = {
        id: uuidv4(),
        name,
        points,
        date: currentDate.toISOString(),
      };

      const { error } = await supabase.from("scores").insert([newScoreEntry]);

      if (error) throw error;

      // Fetch latest scores from last two days immediately after adding
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoISO = twoDaysAgo.toISOString();

      const { data: latestScores, error: fetchError } = await supabase
        .from("scores")
        .select("*")
        .gte("date", twoDaysAgoISO)
        .order("points", { ascending: false })
        .order("date", { ascending: false });

      if (fetchError) throw fetchError;

      if (latestScores) {
        set({ scores: latestScores });
        const names = [
          ...new Set(latestScores.map((score: Score) => score.name)),
        ];
        set({ existingNames: names });

        // Calculate rank by counting how many scores have more points
        const rank =
          latestScores.filter((score: Score) => score.points > points).length +
          1;
        return { rank, total: latestScores.length };
      }

      return null;
    } catch (error) {
      console.error("Error adding score:", error);
      throw error;
    }
  },

  getLastTwoDaysPlayers: () => {
    const { scores } = get();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const twoDaysAgoISO = twoDaysAgo.toISOString();

    const lastTwoDaysPlayers = new Set(
      scores
        .filter((score: Score) => score.date >= twoDaysAgoISO)
        .map((score: Score) => score.name)
    );
    return lastTwoDaysPlayers.size;
  },

  initializeScores: async () => {
    try {
      // Get scores from local storage first
      const savedScores = localStorage.getItem("scores");
      const localScores = savedScores ? JSON.parse(savedScores) : [];

      if (localScores.length > 0) {
        // Convert old date format to ISO timestamps and add UUIDs
        const updatedLocalScores = localScores.map(
          (score: { name: string; points: number; date: string }) => {
            try {
              const date = new Date(score.date);
              if (isNaN(date.getTime())) {
                console.warn(
                  `Invalid date found for score: ${JSON.stringify(
                    score
                  )}, using current date`
                );
                return {
                  id: uuidv4(),
                  ...score,
                  date: new Date().toISOString(),
                };
              }
              return {
                id: uuidv4(),
                ...score,
                date: date.toISOString(),
              };
            } catch {
              console.warn(
                `Error converting date for score: ${JSON.stringify(
                  score
                )}, using current date`
              );
              return {
                id: uuidv4(),
                ...score,
                date: new Date().toISOString(),
              };
            }
          }
        );

        // Always sync local scores to Supabase
        const { error: insertError } = await supabase
          .from("scores")
          .insert(updatedLocalScores);

        if (insertError) {
          console.error("Error syncing local scores to Supabase:", insertError);
        }

        // Clean up local storage after sync attempt
        localStorage.removeItem("scores");
      }

      // Get scores from last two days from Supabase (including newly synced ones)
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoISO = twoDaysAgo.toISOString();

      const { data: supabaseScores, error } = await supabase
        .from("scores")
        .select("*")
        .gte("date", twoDaysAgoISO)
        .order("points", { ascending: false })
        .order("date", { ascending: false });

      if (error) throw error;

      if (supabaseScores) {
        set({ scores: supabaseScores });
        const names = [
          ...new Set(supabaseScores.map((score: Score) => score.name)),
        ];
        set({ existingNames: names });
      }

      // Set up real-time subscription
      const subscription = supabase
        .channel("scores_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "scores",
          },
          async () => {
            // Fetch the latest scores from last two days after any change
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
            const twoDaysAgoISO = twoDaysAgo.toISOString();

            const { data: latestScores, error } = await supabase
              .from("scores")
              .select("*")
              .gte("date", twoDaysAgoISO)
              .order("points", { ascending: false })
              .order("date", { ascending: false });

            if (!error && latestScores) {
              set({ scores: latestScores });
              const names = [
                ...new Set(latestScores.map((score: Score) => score.name)),
              ];
              set({ existingNames: names });
            }
          }
        )
        .subscribe();

      // Store cleanup function in a variable
      const cleanup = () => {
        subscription.unsubscribe();
      };

      // Add cleanup to window for component unmount
      window.addEventListener("beforeunload", cleanup);
    } catch (error) {
      console.error("Error initializing scores:", error);
    }
  },
}));
