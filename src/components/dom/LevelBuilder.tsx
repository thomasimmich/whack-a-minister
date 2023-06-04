import { Box, PositionalAudio } from '@react-three/drei';
import { useContext, useEffect, useRef, useState } from 'react';

import {
  GameStateFacet,
  GameStates,
  LevelFacet,
} from '../../app/GameFacets';
import { BASE_ASSET_URL, Tags } from '../../base/Constants';
import { FullScreenCanvas } from '../three/FullScreenCanvas';
import LevelStatus from './LevelStatus';
import PauseMenu from './PauseMenu';
import { DeCoder } from './DeCoder';
import LevelDoneMenu from './LevelDoneMenu';
import Dialouge from './Dialouge';
import { ECSContext, Entity, useEntities, useEntity } from '@leanscope/ecs-engine/';
import { DeCoder002 } from './DeCoderLevel002';

const LevelBuilder = () => {
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  const mainTuneSoundRef = useRef<any>(null);
  const [gameStateEntity] = useEntity((e) => e.has(GameStateFacet));
  const [currentLevelEntity] = useEntity((e) => e.has(Tags.CURRENT));
  const [isTrainVisible, setIsTrainVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [dialougeText, setDialougeText] = useState([
    ' Hallo Paul! bieb Es ist nun an der Zeit, dass unsere Reise beginnt. buub Der Zug wird in Kürze eintreffen, um die Milchtüte sicher zum König zu bringen. Doch wir sollten uns vor den Plastik Jägern in Acht nehmen. bieb bieb Sie sind darauf aus, uns die Tüte zu entreißen. buub buub Wir müssen wachsam sein und uns gegenseitig unterstützen, um unser Ziel zu erreichen.',
    'Also lass uns bereit sein, Paul! buub buub Der Zug wird jeden Moment ankommen, und wir werden diese aufregende Reise antreten. bieb Zusammen können wir Hindernisse überwinden und eine positive Veränderung bewirken. buub buub Auf geht`s!',
  ]);
  //   const [dialougeTextEntity] = useEntity((e) => e.has(CurrentDialougeFacet));

  async function startGame() {
    gameStateEntity?.addComponent(new GameStateFacet({ gameState: GameStates.PLAYING }));
    await delay(200);
  }

  useEffect(() => {
    if (gameStateEntity?.get(GameStateFacet)?.props.gameState === GameStates.PLAYING ) {
      setIsMoving(true)
    }else if (gameStateEntity?.get(GameStateFacet)?.props.gameState === GameStates.DIALOUGE ) {
      setIsMoving(false)
    }else if (gameStateEntity?.get(GameStateFacet)?.props.gameState === GameStates.LEVEL_DONE ) {
      setIsMoving(false)
    }
  }, [gameStateEntity?.get(GameStateFacet)?.props.gameState])

  useEffect(() => {
    setTimeout(() => {
      setIsTrainVisible(true);
    }, 4900);
  }, []);

  return (
    <>
      <FullScreenCanvas>
        {currentLevelEntity?.get(LevelFacet)?.props.levelValue == 1 ? (
          <DeCoder
            isMoving={isMoving}
            isTrainVisible={isTrainVisible}
            buildCode="yzgabcdefgbyzhfgabc"
          />
        ) : currentLevelEntity?.get(LevelFacet)?.props.levelValue == 2 ? (
          <DeCoder002
            isMoving={isMoving}
            isTrainVisible={isTrainVisible}
            buildCode="abababababababababababababababababababab"
          />
        ) : (
          <></>
        )}

        {/*  <Scores />  */}
        <PositionalAudio
          ref={mainTuneSoundRef}
          url={
            currentLevelEntity?.get(LevelFacet)?.props.levelValue == 1
              ? BASE_ASSET_URL + '/sounds/scheuertrack1.mp3'
              : currentLevelEntity?.get(LevelFacet)?.props.levelValue == 2
              ? BASE_ASSET_URL + '/sounds/scheuertrack3.ogg'
              : BASE_ASSET_URL + '/sounds/scheuertrack2.ogg'
          }
          load={undefined}
          autoplay={true}
          loop={true}
        />
      </FullScreenCanvas>
      <Dialouge startGame={startGame} text={dialougeText} />

      <LevelStatus />
      {gameStateEntity?.get(GameStateFacet)?.props.gameState === GameStates.LEVEL_DONE && (
        <LevelDoneMenu />
      )}
      {gameStateEntity?.get(GameStateFacet)?.props.gameState === GameStates.PAUSE && <PauseMenu />}
    </>
  );
};

export default LevelBuilder;
