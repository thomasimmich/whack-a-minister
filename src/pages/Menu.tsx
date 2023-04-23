import { useState } from 'react';

import { MenuProps } from '../base/types';
import Navbar from '../components/dom/Navbar';
import Home from './Home';
import ScoreBoard from './ScoreBoard';

const Menu = ({ highscores, playFunction }: MenuProps) => {
  const [activeScore, setActiveScore] = useState(false);

  const toggleActiveScore = () => {
    setActiveScore(!activeScore);
  };

  return (
    <>
      <div className="w-full h-full p-8   text-black">
        <Navbar togglePage={() => toggleActiveScore()}></Navbar>
        {!activeScore ? (
          <Home playFunction={playFunction}></Home>
        ) : (
          <ScoreBoard highscores={highscores}></ScoreBoard>
        )}
      </div>
    </>
  );
};

export default Menu;
