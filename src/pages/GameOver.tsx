import { useState } from 'react';

export const GameOver = () => {
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

  return (
    <div>
      <h1>GAME OVER</h1>
      <div>
        <p>Your score:</p>
        <p>123</p>
      </div>
      <div className="">
        <label htmlFor="playerTag">Please enter your player tag:</label>
        <input type="text" name="playerTag" id="playerTag" onChange={handleTagInputChange} />
        <button type="submit" value="Submit" onClick={() => saveHighscore()} />
      </div>
    </div>
  );
};

export default GameOver;
