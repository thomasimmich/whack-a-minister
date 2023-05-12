import { Box, PositionalAudio } from '@react-three/drei';
import { useAnimationFrame } from 'framer-motion';
import { System } from 'tick-knock';
import { useContext, useEffect, useRef, useState } from 'react';
import { Entity } from 'tick-knock';

import { ECSContext } from '../../app/ECSContext';
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
import { Scores } from '../three/Score';
import { useWindowSize } from '../../hooks/useWindowSize';
import LevelStatus from './LevelStatus';
import PauseMenu from './PauseMenu';
import GameOverMenu from './GameOverMenu';
import { DeCoder } from './DeCoder';
import { useRenderSystemEntities } from '../../hooks/useRenderSystemEntities';
import { useEntity } from '../../hooks/useEntity';

interface LevelBuilderProps {
  backgroundColor: string;
}

const LevelBuilder = ({ backgroundColor }: LevelBuilderProps) => {
  const ecs = useContext(ECSContext);
  const mainTuneSoundRef = useRef<any>(null);
  const windowSize = useWindowSize();
  //const [gameStateEntity, setGameStateEntity] = useState<Entity>()
  const [level1Entity, setLevel1Entity] = useState<Entity>();
  const [gameStateEntity, setGameStateEntity] = useState('PLAYING');

  useEffect(() => {
    const level1Entity = ecs.engine.entities.find((e) => e.has(LevelFacet));
    setLevel1Entity(level1Entity);

    const gameStateEntityEntity = ecs.engine.entities.find((e) => e.has(LevelFacet));
    //setGameStateEntity(gameStateEntityEntity);

    console.log('level 1', level1Entity);
    console.log('GameState', gameStateEntity);
  }, []);
  
  return (
    <>
      {gameStateEntity === "PLAYING" && ( //gameStateEntity?.get(GameStateFacet)?.props.gameState  GameStates.PLAYING
        <FullScreenCanvas>
          
          <DeCoder buildCode='yzgabcdefg' />

          {/*  <Scores />  */}
          <PositionalAudio
            ref={mainTuneSoundRef}
            url={BASE_ASSET_URL + '/sounds/scheuertrack1.mp3'}
            load={undefined}
            autoplay={true}
            loop={true}
          />
        </FullScreenCanvas>
      )}
      <LevelStatus />
      {gameStateEntity === "PAUSE" && <PauseMenu />}
      {gameStateEntity === "GAME_OVER" && (
        <GameOverMenu />
      )}
    </>
  );
};

export default LevelBuilder;
