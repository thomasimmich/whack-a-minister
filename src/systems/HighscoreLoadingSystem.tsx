import { createClient } from '@supabase/supabase-js'
import { useEffect } from 'react';


export const HighscoreLoadingSystem = () => {

  useEffect(() => {

    const supabaseUrl = 'https://aejmdyaibrekeusxjtjc.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlam1keWFpYnJla2V1c3hqdGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODIyMzgyNTIsImV4cCI6MTk5NzgxNDI1Mn0.klZK3e4pNO9lZm9DIMBDCKGLa-yhss4k5VvGlD5KhA0'

    if (!supabaseKey) {
      throw new Error("Environment variable 'SUPABASE_KEY' is missing.")
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    async function fetchHighscore() {
      const { data, error } = await supabase
        .from('highscore')
        .select('id, player, score, created_at')
        .order('score', { ascending: false } )
        .limit(10);
      if (error) {
        console.error(error);
      } else {
        console.log(data)
      }
    }

    async function addHighscore(player: string, score: number) {

      if (player.length != 3) {
        throw new Error('Player must be lenth 3');
      }

      const { data, error } = await supabase
        .from('highscore')
        .insert([
          { player: player, score: score },
        ]);
      console.log(data)
      if (error) {
        console.error("Unable to insert new highscore")
        console.error(error)
      }
    }

    fetchHighscore();
  }, []);

  return <></>;
};
