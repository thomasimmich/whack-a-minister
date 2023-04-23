import React from 'react';

import ScoreIlustration from '../images/ScoreView.png';

const ScoreBoard = () => {
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
