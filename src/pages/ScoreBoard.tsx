import { BASE_ASSET_URL } from '../base/Constants';

const ScoreBoard = () => {
  const ScoreIlustration = BASE_ASSET_URL + '/images/menu/ScoreView.png';
  const currentDate = new Date().toLocaleDateString();
  const fakeData: any = [
    { id: 1, user: 'asd', score: 0, date: currentDate },
    { id: 2, user: 'qwe', score: 10, date: currentDate },
    { id: 3, user: 'sdf', score: 20, date: currentDate },
    { id: 4, user: 'wer', score: 30, date: currentDate },
    { id: 5, user: 'dgf', score: 40, date: currentDate },
    { id: 6, user: 'dfg', score: 50, date: currentDate },
  ];

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
          {fakeData.map((highscore) => (
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
