import { Box, PositionalAudio } from '@react-three/drei';
import { useAnimationFrame } from 'framer-motion';
import { System } from 'tick-knock';
import { useContext, useEffect, useRef, useState } from 'react';
import { Entity } from 'tick-knock';

import {  ECSContext } from '../../app/ECSContext';
import {ActivationFacet,CoinsFacet,GameStateFacet,GameStates,HitableFacet,LevelFacet,ScoreFacet,} from '../../app/GameFacets';
import { BASE_ASSET_URL } from '../../base/Constants';
import { FullScreenCanvas } from "../three/FullScreenCanvas"
import { Scores } from "../three/Score"
import { useWindowSize } from '../../hooks/useWindowSize';
import LevelStatus from './LevelStatus';
import PauseMenu from './PauseMenu';
import GameOverMenu from './GameOverMenu';
import { DeCoder } from './DeCoder';
import { useRenderSystemEntities } from '../../hooks/useRenderSystemEntities';



interface LevelBuilderProps {
  backgroundColor: string;
}
  


const TriggerRenderAppSystems = () => {
  const ecs = useContext(ECSContext);

  useEffect(() => {
    console.log('app start');
    ecs.engine.clear();

    // Level System

    // Coins
    const coinsEntity = new Entity();
    ecs.engine.addEntity(coinsEntity);
    coinsEntity.addComponent(new CoinsFacet({ coinsValue: 0 }));

    // Score
    const scoreEntity = new Entity();
    ecs.engine.addEntity(scoreEntity);
    scoreEntity.addComponent(new ScoreFacet({ scoreValue: 0 }));

    // current Level
    const levelEntity = new Entity();
    ecs.engine.addEntity(levelEntity);
    levelEntity.addComponent(new LevelFacet({ levelValue: 1 }));
    
    // Hitable
    const enemyEntity = new Entity();
    ecs.engine.addEntity(enemyEntity);
    enemyEntity.addComponent(new HitableFacet({ hitCount: 0 }));

    // Gamestate
    const gameStateEntity = new Entity();
    ecs.engine.addEntity(gameStateEntity);
    gameStateEntity.addComponent(new GameStateFacet({ gameState: GameStates.WELCOME }));

    return () => {
      ecs.engine.removeEntity(scoreEntity);
      ecs.engine.removeEntity(levelEntity);
      ecs.engine.removeEntity(enemyEntity);
      ecs.engine.removeEntity(gameStateEntity);
      ecs.engine.removeEntity(coinsEntity);
    };

  
  }, []);

  const [blacklistedIdentifiableSystems] = useState(new Set<System>());

  useAnimationFrame((_state, dt) => {
    const systems = ecs.engine.systems;
   

    systems.forEach((system) => {
      try {
        if (!blacklistedIdentifiableSystems.has(system)) {
          //console.log('update system', system);
          system.update(dt);
        }
      } catch (e) {
        blacklistedIdentifiableSystems.add(system);

        console.error(e);
        console.warn(
          'Added system to blacklist, so that it is no longer executed in the systems pipeline.',
        );
      }
    });
  });

  return <></>;
};

const LevelBuilder = ({backgroundColor}: LevelBuilderProps) => {
  const mainTuneSoundRef = useRef<any>(null);
  const windowSize = useWindowSize();
  const [gameStateEntity] = useRenderSystemEntities((e) => e.has(GameStateFacet))




  // Test


  return (
    <>
      {gameStateEntity[0].get(GameStateFacet)?.props.gameState === GameStates.PLAYING &&(
        <FullScreenCanvas   >
          <TriggerRenderAppSystems />
          <Box position={[0, 0, 0]} args={[windowSize.width, windowSize.height, 0]}>
            <meshBasicMaterial color={backgroundColor} />
          </Box>

          <DeCoder />

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
      {gameStateEntity[0].get(GameStateFacet)?.props.gameState === GameStates.PAUSE &&(<PauseMenu  />)}
      {gameStateEntity[0].get(GameStateFacet)?.props.gameState === GameStates.GAME_OVER &&(<GameOverMenu />)}
    </>
  )
}

export default LevelBuilder