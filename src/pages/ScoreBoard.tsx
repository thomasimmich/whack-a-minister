import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { BASE_ASSET_URL } from '../base/Constants';
import { Highscore } from '../base/types';

const ScoreBoard = () => {
  const ScoreIlustration = BASE_ASSET_URL + '/images/menu/ScoreView.png';
  const [highscores, setHighscores] = useState<Highscore[]>([]);
  const [playerTag, setPlayerTag] = useState('');

  async function addHighscore(player: string, score: number) {
    const supabaseUrl = 'https://aejmdyaibrekeusxjtjc.supabase.co';
    const supabaseKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlam1keWFpYnJla2V1c3hqdGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODIyMzgyNTIsImV4cCI6MTk5NzgxNDI1Mn0.klZK3e4pNO9lZm9DIMBDCKGLa-yhss4k5VvGlD5KhA0';

    if (player.length != 3) {
      throw new Error('Player must be lenth 3');
    }

    const { data, error } = await supabase
      .from('highscore')
      .insert([{ player: player, score: score }]);
    console.log(data);
    if (error) {
      console.error('Unable to insert new highscore');
      console.error(error);
    }
  }

  const handleTagInputChange = (event) => {
    setPlayerTag(event.target.value);
  };

  const saveHighscore = () => {
    addHighscore(playerTag, 123);
  };
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
        setHighscores(data);
      }
    }
    fetchHighscore();
  }, []);

  const formatDate = (date: string) => {
    const currentDate = new Date();
    const highscoreDate = new Date(date);
    const difference = daysBetween(highscoreDate, currentDate);
    let text = '';
    switch (difference) {
      case 0:
        text = 'today';
        break;
      case 1:
        text = 'yesterday';
        break;
      default:
        text = `${difference} days ago`;
        break;
    }
    return text;
  };
  function daysBetween(startDate: Date, endDate: Date) {
    // The number of milliseconds in all UTC days (no DST)
    const oneDay = 1000 * 60 * 60 * 24;

    // A day in UTC always lasts 24 hours (unlike in other time formats)
    const start = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    const end = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

    // so it's safe to divide by 24 hours
    return (start - end) / oneDay;
  }

  return (
    <>
      <h1>Scoreboard</h1>

      <div className="my-5">
        <h1>GAME OVER</h1>
        <div>
          <p>Your score:</p>
          <p>123</p>
        </div>
        <div className="">
          <label htmlFor="playerTag">Please enter your player tag:</label>
          <input
            type="text"
            name="playerTag"
            id="playerTag"
            maxLength={3}
            onChange={handleTagInputChange}
          />
          <button type="submit" value="Submit" onClick={() => saveHighscore()} />
        </div>
      </div>

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
              <td>{highscore.player}</td>
              <td>{highscore.score}</td>
              <td>{formatDate(highscore.created_at)}</td>
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
