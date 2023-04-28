import { Box, PositionalAudio } from '@react-three/drei';
import { useAnimationFrame } from 'framer-motion';
import { System } from 'tick-knock';
import { useContext, useEffect, useRef, useState } from 'react';
import { Entity } from 'tick-knock';

import {  ECSContext } from '../../app/ECSContext';
import {ActivationFacet,GameStateFacet,GameStates,HitableFacet,LevelFacet,ScoreFacet,} from '../../app/GameFacets';
import { BASE_ASSET_URL } from '../../base/Constants';
import { FullScreenCanvas } from "../three/FullScreenCanvas"
import { Scores } from "../three/Score"
import { useWindowSize } from '../../hooks/useWindowSize';



interface LevelBuilderProps {
  backgroundColor: string;
  stoppPlaying: () => void;
}
  


const TriggerRenderAppSystems = () => {
  const ecs = useContext(ECSContext);

  useEffect(() => {
    console.log('app start');
    ecs.engine.clear();

    const scoreEntity = new Entity();
    ecs.engine.addEntity(scoreEntity);
    scoreEntity.addComponent(new ScoreFacet({ scoreValue: 0 }));

    const levelEntity = new Entity();
    ecs.engine.addEntity(levelEntity);
    levelEntity.addComponent(new LevelFacet({ levelValue: 1 }));
    levelEntity.addComponent(new ActivationFacet({ activationCode: 'aaaabbbbb' }));

    const enemyEntity = new Entity();
    ecs.engine.addEntity(enemyEntity);
    enemyEntity.addComponent(new HitableFacet({ hitCount: 0 }));

    const gameStateEntity = new Entity();
    ecs.engine.addEntity(gameStateEntity);
    gameStateEntity.addComponent(new GameStateFacet({ gameState: GameStates.WELCOME }));

    return () => {
      ecs.engine.removeEntity(scoreEntity);
      ecs.engine.removeEntity(levelEntity);
      ecs.engine.removeEntity(enemyEntity);
      ecs.engine.removeEntity(gameStateEntity);
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


  return (
    <FullScreenCanvas   >
    <TriggerRenderAppSystems />
    <Box position={[0, 0, 0]} args={[windowSize.width, windowSize.height, 0]}>
      <meshBasicMaterial color={backgroundColor} />
    </Box>
    {/*
      <>
        <StaticBoxContainer speed={0.0} imageUrl={BGLayer4} y={0} z={0} />
        <StaticBoxContainer speed={0.01} imageUrl={BGLayer3} y={0} z={0} />
        <StaticBoxContainer speed={0.02} imageUrl={BGLayer2} y={0} z={0} />
        <StaticBoxContainer speed={0.03} imageUrl={BGLayer1} y={0} z={0} />
        <StaticBoxContainer speed={0.06} imageUrl={MGLayer1} y={0} z={0} />
        <TrainWithPeople />
        <StaticBoxContainer speed={0.09} imageUrl={FGLayer1} y={0} z={0.11} />
      </>
  */}

    <Scores />

    <PositionalAudio
      ref={mainTuneSoundRef}
      url={BASE_ASSET_URL + '/sounds/scheuertrack1.mp3'}
      load={undefined}
      autoplay={true}
      loop={true}
    />
  </FullScreenCanvas>
  )
}

export default LevelBuilder