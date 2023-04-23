import { useState } from 'react';
import { BASE_ASSET_URL } from '../base/Constants';
import { PropsWithFunction } from '../base/types';
import Navbar from '../components/dom/Navbar';
import Home from './Home';
import ScoreBoard from './ScoreBoard';

const Menu = ({ playFunction }: PropsWithFunction) => {
  const [activeScore, setActiveScore] = useState(false);
  const ScoreIlustration = BASE_ASSET_URL + '/images/menu/ScoreView.png';
  const Card = BASE_ASSET_URL + '/images/menu/card-1.png';

  const toggleActiveScore = () => {
    setActiveScore(!activeScore);
  };

  return (
    <div className="w-full h-full p-8   text-black">
      <Navbar togglePage={() => toggleActiveScore()}></Navbar>
      {!activeScore ? <Home playFunction={playFunction}></Home> : <ScoreBoard></ScoreBoard>}
    </div>
  );
};

export default Menu;
