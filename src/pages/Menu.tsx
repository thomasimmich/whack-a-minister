import { useState } from 'react';

import Navbar from '../components/dom/Navbar';
import Home from './Home';
import ScoreBoard from './ScoreBoard';

const Menu = ({ playFunc }) => {
  const [activeScore, setActiveScore] = useState(false);

  const toggleActiveScore = () => {
    setActiveScore(!activeScore);
  };

  return (
    <>
      <div className="w-full h-full p-8   text-black">
        <Navbar togglePage={() => toggleActiveScore()}></Navbar>
        {!activeScore ? <Home play={playFunc}></Home> : <ScoreBoard></ScoreBoard>}
      </div>
    </>
  );
};

export default Menu;
