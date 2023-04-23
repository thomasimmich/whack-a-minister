import { BASE_ASSET_URL } from '../base/Constants';
import { ScoreboardProps } from '../base/types';

const ScoreBoard = ({ highscores }: ScoreboardProps) => {
  const ScoreIlustration = BASE_ASSET_URL + '/images/menu/ScoreView.png';

  const data = highscores;

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
          {data.map((highscore) => (
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
