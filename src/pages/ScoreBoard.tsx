import { BASE_ASSET_URL } from '../base/Constants';

const ScoreBoard = () => {
  const ScoreIlustration = BASE_ASSET_URL + '/images/menu/ScoreView.png';
  return (
    <>
      <h1>Scoreboard</h1>
      <div className="h-2/4  flex items-end">
        <img src={ScoreIlustration} />
      </div>
    </>
  );
};

export default ScoreBoard;
