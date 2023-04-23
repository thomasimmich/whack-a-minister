import { createClient } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { BASE_ASSET_URL } from '../base/Constants';
import { ScoreboardProps } from '../base/types';

const ScoreBoard = ({ highscores }: ScoreboardProps) => {
  const ScoreIlustration = BASE_ASSET_URL + '/images/menu/ScoreView.png';

  useEffect(() => {
    const supabaseUrl = 'https://aejmdyaibrekeusxjtjc.supabase.co';
    const supabaseKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlam1keWFpYnJla2V1c3hqdGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODIyMzgyNTIsImV4cCI6MTk5NzgxNDI1Mn0.klZK3e4pNO9lZm9DIMBDCKGLa-yhss4k5VvGlD5KhA0';

    if (!supabaseKey) {
      throw new Error("Environment variable 'SUPABASE_KEY' is missing.");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    async function fetchHighscore() {
      const { data, error } = await supabase
        .from('highscore')
        .select('id, player, score, created_at')
        .order('score', { ascending: false })
        .limit(10);
      if (error) {
        console.error(error);
      } else {
        console.log(data);
      }
    }

    const highscores = fetchHighscore();
  }, []);

  return (
    <>
      <h1>Scoreboard</h1>
      <table className="w-full">
        <thead>
          <tr>
            <th>PLAYER</th>
            <th>SCORE</th>
            <th>DATE</th>
          </tr>
        </thead>
        <tbody>
          {highscores?.map((highscore) => (
            <tr key={highscore.id}>
              <td>{highscore.user}</td>
              <td>{highscore.score}</td>
              <td>{highscore.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-2/4  flex items-end">
        <img src={ScoreIlustration} />
      </div>
    </>
  );
};

export default ScoreBoard;
