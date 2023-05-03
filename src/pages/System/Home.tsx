import { useState } from 'react';

import LevelOverview from './LevelOverview';
import ScoreOverview from './ScoreOverview';

interface HomeProps {
  play: () => void;
}
  
const Home = ({  play,  }: HomeProps) => {
  const [activeScore, setActiveScore] = useState(false)

  function toggleActiveScore() {setActiveScore(!activeScore)}

  return (
    <>
      {!activeScore  ? (
       <LevelOverview toggleActiveScore={toggleActiveScore} play={play} />
      ) : (<>
       <ScoreOverview toggleActiveScore={toggleActiveScore} />
      </>)}
    </>
  )

};
  
export default Home