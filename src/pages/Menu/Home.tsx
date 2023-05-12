import { useState } from 'react';

import LevelOverview from './LevelOverview';
import ScoreOverview from './ScoreOverview';


  
const Home = () => {
  const [activeScore, setActiveScore] = useState(false)

  function toggleActiveScore() {setActiveScore(!activeScore)}

  return (
    <>

      {!activeScore  ? (
       <LevelOverview toggleActiveScore={toggleActiveScore}  />
      ) : (<>
       <ScoreOverview toggleActiveScore={toggleActiveScore} />
      </>)}
    </>
  )

};
  
export default Home