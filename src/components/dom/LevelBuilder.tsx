import { Box, PositionalAudio } from '@react-three/drei';
import { useContext, useEffect, useRef, useState } from 'react';

import {
  ActivationFacet,
  CoinsFacet,
  GameStateFacet,
  GameStates,
  HitableFacet,
  LevelFacet,
  ScoreFacet,
} from '../../app/GameFacets';
import { BASE_ASSET_URL } from '../../base/Constants';
import { FullScreenCanvas } from '../three/FullScreenCanvas';
import LevelStatus from './LevelStatus';
import PauseMenu from './PauseMenu';
import GameOverMenu from './GameOverMenu';
import { DeCoder } from './DeCoder';
import LevelDoneMenu from './LevelDoneMenu';
import Dialouge from './Dialouge';
import { ECSContext, Entity, useEntities } from "@leanscope/ecs-engine/"

const LevelBuilder = () => {
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  const ecs = useContext(ECSContext);
  const mainTuneSoundRef = useRef<any>(null);
  const [level1Entity, setLevel1Entity] = useState<Entity>();
  const [gameStateEntity, setGameStateEntity] = useState('PLAYING');
  const [isTrainVisible, setIsTrainVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [dialougeText, setDialougeText] = useState([
    ' Hallo Paul! bieb Es ist nun an der Zeit, dass unsere Reise beginnt. buub Der Zug wird in Kürze eintreffen, um die Milchtüte sicher zum König zu bringen. Doch wir sollten uns vor den Plastik Jägern in Acht nehmen. bieb bieb Sie sind darauf aus, uns die Tüte zu entreißen. buub buub Wir müssen wachsam sein und uns gegenseitig unterstützen, um unser Ziel zu erreichen.',
    'Also lass uns bereit sein, Paul! buub buub Der Zug wird jeden Moment ankommen, und wir werden diese aufregende Reise antreten. bieb Zusammen können wir Hindernisse überwinden und eine positive Veränderung bewirken. buub buub Auf geht`s!',
  ]);

  async function startGame() {
    await delay(200)
    setIsMoving(true)
  }
  useEffect(() => {
    const level1Entity = ecs.engine.entities.find((e) => e.has(LevelFacet));
    setLevel1Entity(level1Entity);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsTrainVisible(true);
    }, 4900);
  }, []);

  return (
    <>
      {gameStateEntity === 'LEVEL_DONE' ||
        gameStateEntity === 'PAUSE' ||
        (gameStateEntity === 'PLAYING' && ( //gameStateEntity?.get(GameStateFacet)?.props.gameState  GameStates.PLAYING
          <>
            <FullScreenCanvas>
              <DeCoder
                isMoving={isMoving}
                isTrainVisible={isTrainVisible}
                buildCode="yzgabcdefgbyzhfgabc"
              />

              {/*  <Scores />  */}
              <PositionalAudio
                ref={mainTuneSoundRef}
                url={BASE_ASSET_URL + '/sounds/scheuertrack2.ogg'}
                load={undefined}
                autoplay={true}
                loop={true}
              />
            </FullScreenCanvas>
            <Dialouge startGame={startGame} text={dialougeText} />
          </>
        ))}
      <LevelStatus />
      {gameStateEntity === 'LEVEL_DONE' && <LevelDoneMenu />}
      {gameStateEntity === 'PAUSE' && <PauseMenu />}
      {gameStateEntity === 'GAME_OVER' && <GameOverMenu />}
    </>
  );
};

export default LevelBuilder;
