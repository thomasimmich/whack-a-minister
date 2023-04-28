import LevelBuilder from "../../components/dom/LevelBuilder";
import { BASE_ASSET_URL } from '../../base/Constants';
interface Level001Props {
  stoppPlaying: () => void;
}

const Level001 = ({stoppPlaying}: Level001Props) => {
  const BGLayer4 = BASE_ASSET_URL + '/images/background/backgroundLayer4.png';
  const BGLayer3 = BASE_ASSET_URL + '/images/background/backgroundLayer3.png';
  const BGLayer2 = BASE_ASSET_URL + '/images/background/backgroundLayer2.png';
  const BGLayer1 = BASE_ASSET_URL + '/images/background/backgroundLayer1.png';

  const MGLayer1 = BASE_ASSET_URL + '/images/middleground/middleGround.png';
  const FGLayer1 = BASE_ASSET_URL + '/images/foreground/foreground.png';

  return (
   <LevelBuilder backgroundColor="#AEFFF1" />
  )
}

export default Level001